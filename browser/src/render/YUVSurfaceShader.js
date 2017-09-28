'use strict'

import Program from './Program'
import ShaderCompiler from './ShaderCompiler'
import { vertexQuad, fragmentYUV } from './ShaderSources'

export default class YUVSurfaceShader {
  /**
   *
   * @param {WebGLRenderingContext} gl
   * @returns {YUVSurfaceShader}
   */
  static create (gl) {
    const program = this._initShaders(gl)
    const shaderArgs = this._initShaderArgs(gl, program)
    const vertexBuffer = this._initBuffers(gl)

    return new YUVSurfaceShader(gl, vertexBuffer, shaderArgs, program)
  }

  static _initShaders (gl) {
    const program = new Program(gl)
    program.attach(ShaderCompiler.compile(gl, vertexQuad))
    program.attach(ShaderCompiler.compile(gl, fragmentYUV))
    program.link()
    program.use()

    return program
  }

  static _initShaderArgs (gl, program) {
    // find shader arguments
    const shaderArgs = {}
    shaderArgs.YTexture = program.getUniformLocation('YTexture')
    shaderArgs.UTexture = program.getUniformLocation('UTexture')
    shaderArgs.VTexture = program.getUniformLocation('VTexture')

    shaderArgs.u_projection = program.getUniformLocation('u_projection')
    shaderArgs.u_transform = program.getUniformLocation('u_transform')

    shaderArgs.a_position = program.getAttributeLocation('a_position')
    gl.enableVertexAttribArray(shaderArgs.a_position)
    shaderArgs.a_texCoord = program.getAttributeLocation('a_texCoord')
    gl.enableVertexAttribArray(shaderArgs.a_texCoord)

    return shaderArgs
  }

  static _initBuffers (gl) {
    // Create vertex buffer object.
    const vbo = gl.createBuffer()

    return vbo
  }

  constructor (gl, vertexBuffer, shaderArgs, program) {
    this.gl = gl
    this.vertexBuffer = vertexBuffer
    this.shaderArgs = shaderArgs
    this.program = program
  }

  setProjection (projection) {
    this.program.setUniformM4(this.shaderArgs.u_projection, projection)
  }

  setTransform (transform) {
    this.program.setUniformM4(this.shaderArgs.u_transform, transform)
  }

  /**
   *
   * @param {Size} size
   */
  setSize (size) {
    this.size = size
  }

  /**
   *
   * @param {Texture} textureY
   * @param {Texture} textureU
   * @param {Texture} textureV
   */
  setTexture (textureY, textureU, textureV) {
    const gl = this.gl

    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, textureY.texture)
    gl.uniform1i(this.shaderArgs.YTexture, 0)

    gl.activeTexture(gl.TEXTURE1)
    gl.bindTexture(gl.TEXTURE_2D, textureU.texture)
    gl.uniform1i(this.shaderArgs.UTexture, 1)

    gl.activeTexture(gl.TEXTURE2)
    gl.bindTexture(gl.TEXTURE_2D, textureV.texture)
    gl.uniform1i(this.shaderArgs.VTexture, 2)
  }

  draw () {
    const gl = this.gl
    this.program.use()
    gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer)
    // TODO we could also do 3 subdata calls (probably faster as we have to transfer less data)
    gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array([
      // top left:
      0, 0, 0, 0,
      // top right:
      this.size.w, 0, 1, 0,
      // bottom right:
      this.size.w, this.size.h, 1, 1,
      // bottom right:
      this.size.w, this.size.h, 1, 1,
      // bottom left:
      0, this.size.h, 0, 1,
      // top left:
      0, 0, 0, 0
    ]), this.gl.DYNAMIC_DRAW)
    gl.vertexAttribPointer(this.shaderArgs.a_position, 2, gl.FLOAT, false, 16, 0)
    gl.vertexAttribPointer(this.shaderArgs.a_texCoord, 2, gl.FLOAT, false, 16, 8)
    gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 6)
  }
}