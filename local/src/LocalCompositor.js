'use strict'

module.exports = class LocalCompositor {
  /**
   *
   * @param {wfc.GrCompositor} grCompositoryProxy
   * @returns {module.ShimCompositor}
   */
  static create () {
    return new LocalCompositor()
  }

  constructor () {
    // set when resource is created
    this.resource = null
  }

  // no compositor events to relay
}