// Copyright 2019 Erik De Rijcke
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

'use strict'

import GrWebGlBufferRequests from '../protocol/GrWebGlBufferRequests'
import WebGLFrame from './WebGLFrame'

/**
 * @implements {GrWebGlBufferRequests}
 * @implements {WlBufferRequests}
 * @implements BufferImplementation
 */
export default class WebGLBuffer extends GrWebGlBufferRequests {
  /**
   * @param {GrWebGlBufferResource}resource
   * @param {WlBufferResource}bufferResource
   * @param {WebFS}webFS
   * @return {WebGLBuffer}
   */
  static create (resource, bufferResource, webFS) {
    const canvas = window.document.createElement('canvas')
    const offscreenCanvas = canvas.transferControlToOffscreen()
    resource.offscreenCanvas(webFS.fromOffscreenCanvas(offscreenCanvas))
    const webGLFrame = WebGLFrame.create(canvas)
    return new WebGLBuffer(resource, bufferResource, webGLFrame)
  }

  /**
   * @param {GrWebGlBufferResource}resource
   * @param {WlBufferResource}bufferResource
   * @param {WebGLFrame}webGLFrame
   */
  constructor (resource, bufferResource, webGLFrame) {
    super()
    /**
     * @type {GrWebGlBufferResource}
     */
    this.resource = resource
    /**
     * @type {WlBufferResource}
     */
    this.bufferResource = bufferResource
    /**
     * @type {WebGLFrame}
     * @private
     */
    this._webGLFrame = webGLFrame
  }

  /**
   *
   *                Transfer the associated HTML5 web gl buffer contents to the compositor.
   *
   *
   * @param {GrWebGlBufferResource} resource
   * @param {WebFD} contents HTML5 web gl image bitmap to transfer to the compositor.
   *
   * @since 1
   *
   */
  async transfer (resource, contents) {
    const imageBitmap = /** @type {ImageBitmap} */ await contents.getTransferable()
    this._webGLFrame.update(imageBitmap)
  }

  /**
   *
   *  Destroy a buffer. If and how you need to release the backing
   *  storage is defined by the buffer factory interface.
   *
   *  For possible side-effects to a surface, see wl_surface.attach.
   *
   *
   * @param {WlBufferResource} resource
   *
   * @since 1
   *
   */
  destroy (resource) {
    this.resource.destroy()
    this.bufferResource.destroy()
    // TODO what more to do here?
  }

  /**
   * @param serial
   * @return {Promise<WebGLFrame>}
   */
  async getContents (serial) {
    return this._webGLFrame
  }

  release () {
    this.bufferResource.release()
  }
}
