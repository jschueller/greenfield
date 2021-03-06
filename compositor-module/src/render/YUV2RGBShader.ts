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

import Size from "../Size";
import Program from './Program'
import ShaderCompiler from './ShaderCompiler'
import {FRAGMENT_YUV_TO_RGB, VERTEX_QUAD} from './ShaderSources'
import Texture from "./Texture";

type ShaderArgs = {
  yTexture: WebGLUniformLocation,
  uTexture: WebGLUniformLocation,
  vTexture: WebGLUniformLocation,
  a_position: GLint,
  a_texCoord: GLint
}

class YUV2RGBShader {
  readonly gl: WebGLRenderingContext
  readonly vertexBuffer: WebGLBuffer
  readonly shaderArgs: ShaderArgs
  readonly program: Program

  static create(gl: WebGLRenderingContext): YUV2RGBShader {
    const program = this._initShaders(gl)
    const shaderArgs = this._initShaderArgs(gl, program)
    const vertexBuffer = this._initBuffers(gl)

    return new YUV2RGBShader(gl, vertexBuffer, shaderArgs, program)
  }

  // TODO convert to stand-alone function
  private static _initShaders(gl: WebGLRenderingContext): Program {
    const program = new Program(gl)
    program.attach(ShaderCompiler.compile(gl, VERTEX_QUAD))
    program.attach(ShaderCompiler.compile(gl, FRAGMENT_YUV_TO_RGB))
    program.link()
    program.use()

    return program
  }

  // TODO convert to stand-alone function
  private static _initShaderArgs(gl: WebGLRenderingContext, program: Program): ShaderArgs {
    // find shader arguments
    const yTexture = program.getUniformLocation('yTexture')
    if (yTexture === null) {
      throw new Error('yTexture not found shader')
    }
    const uTexture = program.getUniformLocation('uTexture')
    if (uTexture === null) {
      throw new Error('uTexture not found shader')
    }
    const vTexture = program.getUniformLocation('vTexture')
    if (vTexture === null) {
      throw new Error('vTexture not found shader')
    }

    const a_position = program.getAttributeLocation('a_position')
    gl.enableVertexAttribArray(a_position)
    const a_texCoord = program.getAttributeLocation('a_texCoord')
    gl.enableVertexAttribArray(a_texCoord)

    return {
      yTexture,
      uTexture,
      vTexture,
      a_position,
      a_texCoord
    }
  }

  // TODO convert to stand-alone function
  private static _initBuffers(gl: WebGLRenderingContext): WebGLBuffer {
    // Create vertex buffer object.
    const webglBuffer = gl.createBuffer()
    if (webglBuffer === null) {
      throw new Error('Can\'t create webgl buffer.')
    }
    return webglBuffer
  }

  private constructor(gl: WebGLRenderingContext, vertexBuffer: WebGLBuffer, shaderArgs: ShaderArgs, program: Program) {
    this.gl = gl
    this.vertexBuffer = vertexBuffer
    this.shaderArgs = shaderArgs
    this.program = program
  }

  setTexture(textureY: Texture, textureU: Texture, textureV: Texture) {
    const gl = this.gl

    gl.uniform1i(this.shaderArgs.yTexture, 0)
    gl.uniform1i(this.shaderArgs.uTexture, 1)
    gl.uniform1i(this.shaderArgs.vTexture, 2)

    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, textureY.texture)

    gl.activeTexture(gl.TEXTURE1)
    gl.bindTexture(gl.TEXTURE_2D, textureU.texture)

    gl.activeTexture(gl.TEXTURE2)
    gl.bindTexture(gl.TEXTURE_2D, textureV.texture)
  }

  use() {
    this.program.use()
  }

  release() {
    this.gl.useProgram(null)
  }

  updateShaderData(encodedFrameSize: Size, maxXTexCoord: number, maxYTexCoord: number) {
    const {w, h} = encodedFrameSize
    this.gl.viewport(0, 0, w, h)
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer)
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array([
      // First triangle
      // top left:
      -1, 1, 0, maxYTexCoord,
      // top right:
      1, 1, maxXTexCoord, maxYTexCoord,
      // bottom right:
      1, -1, maxXTexCoord, 0,

      // Second triangle
      // bottom right:
      1, -1, maxXTexCoord, 0,
      // bottom left:
      -1, -1, 0, 0,
      // top left:
      -1, 1, 0, maxYTexCoord
    ]), this.gl.DYNAMIC_DRAW)
    this.gl.vertexAttribPointer(this.shaderArgs.a_position, 2, this.gl.FLOAT, false, 16, 0)
    this.gl.vertexAttribPointer(this.shaderArgs.a_texCoord, 2, this.gl.FLOAT, false, 16, 8)
  }

  draw() {
    const gl = this.gl
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT)
    gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 6)
    gl.bindTexture(gl.TEXTURE_2D, null)
  }
}

export default YUV2RGBShader
