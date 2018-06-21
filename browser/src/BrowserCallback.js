'use strict'

/**
 *
 *            Clients can handle the 'done' event to get notified when
 *            the related request is done.
 *
 */
export default class BrowserCallback {
  /**
   * @param {GrCallback}grCallbackResource
   * @return {BrowserCallback}
   */
  static create (grCallbackResource) {
    return new BrowserCallback(grCallbackResource)
  }

  /**
   * @param {GrCallback}grCallbackResource
   * @private
   */
  constructor (grCallbackResource) {
    /**
     * @type {GrCallback}
     */
    this.resource = grCallbackResource
  }

  /**
   *
   *                Notify the client when the related request is done.
   *
   *
   * @param {Number} data request-specific data for the callback
   *
   * @since 1
   *
   */
  done (data) {
    this.resource.done(data)
    this.resource.destroy()
    this.resource = null
  }
}
