'use strict'

import ViewState from './ViewState'
import BrowserRtcBufferFactory from '../BrowserRtcBufferFactory'
import YUVASurfaceShader from './YUVASurfaceShader'
import YUVSurfaceShader from './YUVSurfaceShader'
import Size from '../Size'

export default class Renderer {
  /**
   *
   * @param {BrowserSession} browserSession
   * @returns {Renderer}
   */
  static create (browserSession) {
    // create offscreen gl context
    const canvas = document.createElement('canvas')
    let gl = canvas.getContext('webgl2', {
      antialias: false,
      depth: false,
      alpha: true,
      preserveDrawingBuffer: false
    })
    if (!gl) {
      throw new Error('This browser doesn\'t support WebGL2!')
    }

    gl.clearColor(0, 0, 0, 0)
    const yuvaShader = YUVASurfaceShader.create(gl)
    const yuvShader = YUVSurfaceShader.create(gl)

    return new Renderer(browserSession, gl, yuvaShader, yuvShader, canvas)
  }

  /**
   * @param {GrBuffer}grBuffer
   * @return Size
   */
  static bufferSize (grBuffer) {
    if (grBuffer === null) {
      return Size.create(0, 0)
    }
    // TODO we could check for null here in case we are dealing with a different kind of buffer
    const browserRtcDcBuffer = BrowserRtcBufferFactory.get(grBuffer)
    return browserRtcDcBuffer.geo
  }

  static onAnimationFrame () {
    if (this._animationPromise === null) {
      this._armAnimationFramePromise()
    }
    return this._animationPromise
  }

  static _armAnimationFramePromise () {
    this._animationPromise = new Promise((resolve) => {
      window.requestAnimationFrame((time) => {
        this._animationPromise = null
        resolve(time)
      })
    })
  }

  /**
   * Use Renderer.create(..) instead.
   * @private
   * @param {BrowserSession}browserSession
   * @param {WebGLRenderingContext}gl
   * @param {YUVASurfaceShader}yuvaShader
   * @param {YUVSurfaceShader}yuvShader
   * @param {HTMLCanvasElement}canvas
   */
  constructor (browserSession, gl, yuvaShader, yuvShader, canvas) {
    /**
     * @type {BrowserSession}
     */
    this.browserSession = browserSession
    /**
     * @type {WebGLRenderingContext}
     */
    this.gl = gl
    /**
     * @type {YUVASurfaceShader}
     */
    this.yuvaShader = yuvaShader
    /**
     * @type {YUVSurfaceShader}
     */
    this.yuvShader = yuvShader
    /**
     * @type {HTMLCanvasElement}
     */
    this.canvas = canvas
  }

  /**
   * @param {BrowserSurface}browserSurface
   * @return Size
   */
  surfaceSize (browserSurface) {
    const grBuffer = browserSurface.grBuffer
    const bufferSize = Renderer.bufferSize(grBuffer)
    if (browserSurface.bufferScale === 1) {
      return bufferSize
    }
    const surfaceWidth = bufferSize.w / browserSurface.bufferScale
    const surfaceHeight = bufferSize.h / browserSurface.bufferScale
    return Size.create(surfaceWidth, surfaceHeight)
  }

  async requestRender (browserSurface) {
    const renderStart = Date.now()

    const grBuffer = browserSurface.grBuffer
    if (grBuffer === null) {
      browserSurface.renderState = null
      return
    }

    let viewState = browserSurface.renderState
    if (!viewState) {
      viewState = ViewState.create(this.gl)
      browserSurface.renderState = viewState
    }

    const browserRtcDcBuffer = BrowserRtcBufferFactory.get(grBuffer)
    const views = browserSurface.browserSurfaceViews

    const syncSerial = await browserRtcDcBuffer.whenComplete()

    browserSurface.size = this.surfaceSize(browserSurface)
    browserSurface.bufferSize = browserRtcDcBuffer.geo

    // copy state into a separate object so we don't read a different state when our animation frame fires
    const state = {
      buffer: {
        type: browserRtcDcBuffer.type,
        pngContent: browserRtcDcBuffer.pngContent,
        yuvContent: browserRtcDcBuffer.yuvContent,
        yuvWidth: browserRtcDcBuffer.yuvWidth,
        yuvHeight: browserRtcDcBuffer.yuvHeight,
        alphaYuvContent: browserRtcDcBuffer.alphaYuvContent,
        alphaYuvWidth: browserRtcDcBuffer.alphaYuvWidth,
        alphaYuvHeight: browserRtcDcBuffer.alphaYuvHeight,
        geo: browserRtcDcBuffer.geo,
        resource: browserRtcDcBuffer.resource
      },

      syncSerial: syncSerial,
      views: views
    }

    this._render(viewState, state)

    const renderDuration = Date.now() - renderStart
    state.buffer.resource.latency(state.syncSerial, renderDuration)

    const drawPromises = []
    state.views.forEach(browserSurfaceView => {
      drawPromises.push(browserSurfaceView.onDraw())
    })

    return window.Promise.all(drawPromises)
  }

  _render (viewState, state) {
    // update textures
    viewState.update(state)
    this._draw(state, viewState)
  }

  _draw (state, renderState) {
    // paint the textures
    if (state.buffer.type === 'h264') {
      this._drawH264(state, renderState)
    } else { // if (browserRtcDcBuffer.type === 'png')
      this._drawPNG(state, renderState)
    }
  }

  _drawH264 (state, renderState) {
    const bufferSize = state.buffer.geo
    const viewPortUpdate = this.canvas.width !== bufferSize.w || this.canvas.height !== bufferSize.h
    this.canvas.width = bufferSize.w
    this.canvas.height = bufferSize.h

    if (state.buffer.alphaYuvContent != null) {
      this.yuvaShader.use()
      this.yuvaShader.draw(renderState.yTexture, renderState.uTexture, renderState.vTexture, renderState.alphaYTexture, bufferSize, viewPortUpdate)
    } else {
      this.yuvShader.use()
      this.yuvShader.draw(renderState.yTexture, renderState.uTexture, renderState.vTexture, bufferSize, viewPortUpdate)
    }

    // blit rendered texture from render canvas into view canvasses
    state.views.forEach((view) => {
      view.drawCanvas(this.canvas)
    })
  }

  _drawPNG (state, renderState) {
    state.views.forEach((view) => {
      view.drawPNG(renderState.pngImage)
    })
  }
}
/**
 * @type {Promise<number>}
 * @private
 */
Renderer._animationPromise = null
