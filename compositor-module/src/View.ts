// Copyright 2020 Erik De Rijcke
//
// This file is part of Greenfield.
//
// Greenfield is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Greenfield is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with Greenfield.  If not, see <https://www.gnu.org/licenses/>.

import Mat4 from './math/Mat4'
import Point from './math/Point'
import Vec4 from './math/Vec4'
import RenderState from './render/RenderState'
import Scene from './render/Scene'
import Size from './Size'
import Surface from './Surface'

export default class View {
  readonly surface: Surface
  readonly scene: Scene
  readonly userTransformations: Map<string, Mat4> = new Map<string, Mat4>()

  renderState: RenderState
  customTransformation?: Mat4
  positionOffset: Point
  destroyed: boolean
  mapped: boolean

  private readonly _destroyPromise: Promise<void>
  private _transformation: Mat4
  private _inverseTransformation: Mat4
  // @ts-ignore
  private _destroyResolve: (value?: (PromiseLike<void> | void)) => void
  private _parent?: View
  private _primary: boolean

  static create(surface: Surface, width: number, height: number, scene: Scene): View {
    const renderState = RenderState.create(scene.sceneShader.gl, Size.create(width, height))
    return new View(surface, width, height, Mat4.IDENTITY(), scene, renderState)
  }

  private constructor(surface: Surface, width: number, height: number, transformation: Mat4, scene: Scene, renderState: RenderState) {
    this.surface = surface
    this.scene = scene
    this.renderState = renderState
    this.positionOffset = Point.create(0, 0)
    this._transformation = transformation
    this._inverseTransformation = transformation.invert()
    this._destroyPromise = new Promise<void>(resolve => {
      this._destroyResolve = resolve
    })
    this.destroyed = false
    this._primary = false
    this.mapped = true
  }

  set parent(parent: View | undefined) {
    if (this.destroyed) {
      return
    }

    this._parent = parent

    if (parent) {
      this.primary = parent.primary

      parent.onDestroy().then(() => {
        if (this.parent === parent) {
          this.destroy()
          this.parent = undefined
        }
      })
      // this.applyTransformations()
    }
  }

  set primary(primary: boolean) {
    if (this.destroyed) {
      return
    }

    this._primary = primary
  }

  get primary(): boolean {
    if (this._primary) {
      return true
    } else if (this.parent) {
      return this.parent.primary
    } else {
      return false
    }
  }

  get parent(): View | undefined {
    return this._parent
  }

  set transformation(transformation: Mat4) {
    if (this.destroyed) {
      return
    }

    this._transformation = transformation
    this._inverseTransformation = transformation.invert()
  }

  get transformation(): Mat4 {
    return this._transformation
  }

  applyTransformations() {
    if (this.destroyed) {
      return
    }

    this.transformation = this._calculateTransformation()
    this._applyTransformationsChild()
  }

  _applyTransformationsChild() {
    this.findChildViews().forEach(childView => childView.applyTransformations())
  }

  findChildViews(): View[] {
    return this.surface.children
      .filter(surfaceChild => surfaceChild.surface !== this.surface)
      .map(surfaceChild => surfaceChild.surface.views.filter(view => view.parent === this))
      .flat()
  }

  private _calculateTransformation(): Mat4 {
    if (this.customTransformation) {
      return this.customTransformation
    }
    // TODO we might want to keep some 'transformation dirty' flags to avoid needless matrix multiplications

    // inherit parent transformation
    let parentTransformation = Mat4.IDENTITY()
    if (this._parent) {
      parentTransformation = this._parent.transformation
    }

    // position transformation
    const surfaceChild = this.surface.surfaceChildSelf
    const { x, y } = surfaceChild.position.plus(this.positionOffset)
    const positionTransformation = Mat4.translation(x, y)

    return parentTransformation.timesMat4(positionTransformation)
  }

  withUserTransformations(transformation: Mat4) {
    let finalTransformation = transformation
    // TODO use reduce
    this.userTransformations.forEach(value => {
      finalTransformation = transformation.timesMat4(value)
    })
    return finalTransformation
  }

  /**
   * @param viewPoint point in view coordinates with respect to view transformations
   * @return point in browser coordinates
   */
  toCompositorSpace(viewPoint: Point): Point {
    return this.transformation.timesPoint(viewPoint)
  }

  /**
   * @param browserPoint point in browser coordinates
   * @return point in view coordinates with respect to view transformations
   */
  toViewSpaceFromCompositor(browserPoint: Point): Point {
    // normalize first by subtracting view offset
    return this._inverseTransformation.timesPoint(browserPoint)
  }

  toViewSpaceFromSurface(surfacePoint: Point): Point {
    const { w, h } = this.renderState.size
    if (this.surface.size) {
      const { h: surfaceHeight, w: surfaceWidth } = this.surface.size
      if (surfaceWidth === w && surfaceHeight === h) {
        return surfacePoint
      } else {
        return Mat4.scalarVector(Vec4.create2D(w / surfaceWidth, h / surfaceHeight)).timesPoint(surfacePoint)
      }
    } else {
      return surfacePoint
    }
  }

  /**
   * @param scenePoint point in browser coordinates
   */
  toSurfaceSpace(scenePoint: Point): Point {
    const viewPoint = this.toViewSpaceFromCompositor(scenePoint)

    const surfaceSize = this.surface.size
    if (surfaceSize) {
      const surfaceWidth = surfaceSize.w
      const surfaceHeight = surfaceSize.h
      if (surfaceWidth === this.renderState.size.w && surfaceHeight === this.renderState.size.h) {
        return viewPoint
      } else {
        return Mat4.scalarVector(Vec4.create2D(surfaceWidth / this.renderState.size.w, surfaceHeight / this.renderState.size.h)).timesPoint(viewPoint)
      }
    } else {
      return scenePoint
    }
  }

  destroy() {
    if (this.renderState) {
      this.renderState.destroy()
    }

    this.destroyed = true
    this._destroyResolve()
  }

  onDestroy() {
    return this._destroyPromise
  }
}
