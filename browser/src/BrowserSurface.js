export default class BrowserSurface {
  create (grSurface) {
    const browserSurface = new BrowserSurface(grSurface)
    grSurface.implementation = browserSurface
    return browserSurface
  }

  constructor (grSurface) {
    this.grSurface = grSurface
  }

  /**
   *
   *                Deletes the surface and invalidates its object ID.
   *
   *
   * @param {GrSurface} resource
   *
   * @since 1
   *
   */
  destroy (resource) {
  }

  /**
   *
   *                Set a buffer as the content of this surface.
   *
   *                The new size of the surface is calculated based on the buffer
   *                size transformed by the inverse bufferTransform and the
   *                inverse bufferScale. This means that the supplied buffer
   *                must be an integer multiple of the bufferScale.
   *
   *                The x and y arguments specify the location of the new pending
   *                buffer's upper left corner, relative to the current buffer's upper
   *                left corner, in surface local coordinates. In other words, the
   *                x and y, combined with the new surface size define in which
   *                directions the surface's size changes.
   *
   *                Surface contents are double-buffered state, see GrSurface.commit.
   *
   *                The initial surface contents are void; there is no content.
   *                GrSurface.attach assigns the given GrBuffer as the pending
   *                GrBuffer. GrSurface.commit makes the pending GrBuffer the new
   *                surface contents, and the size of the surface becomes the size
   *                calculated from the GrBuffer, as described above. After commit,
   *                there is no pending buffer until the next attach.
   *
   *                Committing a pending GrBuffer allows the compositor to read the
   *                pixels in the GrBuffer. The compositor may access the pixels at
   *                any time after the GrSurface.commit request. It may take some
   *                time for the contents to arrive at the compositor if they have
   *                not been transferred already. The compositor will continue using
   *                old surface content and state until the new content has arrived.
   *                See also GrBuffer.complete.
   *
   *                If it is possible to re-use a GrBuffer or update its
   *                contents, the respective buffer factory shall define how that
   *                works.
   *
   *                Destroying the GrBuffer after GrBuffer.complete does not change
   *                the surface contents. However, if the client destroys the
   *                GrBuffer before receiving the GrBuffer.complete event, the surface
   *                contents become undefined immediately.
   *
   *                If GrSurface.attach is sent with a NULL GrBuffer, the
   *                following GrSurface.commit will remove the surface content.
   *
   *
   * @param {GrSurface} resource
   * @param {?*} buffer undefined
   * @param {Number} x undefined
   * @param {Number} y undefined
   *
   * @since 1
   *
   */
  attach (resource, buffer, x, y) {

  }

  /**
   *
   *                This request is used to describe the regions where the pending
   *                buffer is different from the current surface contents, and where
   *                the surface therefore needs to be repainted. The compositor
   *                ignores the parts of the damage that fall outside of the surface.
   *
   *                Damage is double-buffered state, see GrSurface.commit.
   *
   *                The damage rectangle is specified in surface local coordinates.
   *
   *                The initial value for pending damage is empty: no damage.
   *                GrSurface.damage adds pending damage: the new pending damage
   *                is the union of old pending damage and the given rectangle.
   *
   *                GrSurface.commit assigns pending damage as the current damage,
   *                and clears pending damage. The server will clear the current
   *                damage as it repaints the surface.
   *
   *                Alternatively, damage can be posted with GrSurface.damageBuffer
   *                which uses buffer co-ordinates instead of surface co-ordinates,
   *                and is probably the preferred and intuitive way of doing this.
   *
   *                The factory behind the the GrBuffer might imply full surface
   *                damage, overriding this request. This is common when the factory
   *                uses a video encoder, where regions outside the original changes
   *                may improve in quality.
   *
   *
   * @param {GrSurface} resource
   * @param {Number} x undefined
   * @param {Number} y undefined
   * @param {Number} width undefined
   * @param {Number} height undefined
   *
   * @since 1
   *
   */
  damage (resource, x, y, width, height) {

  }

  /**
   *
   *                Request a notification when it is a good time start drawing a new
   *                frame, by creating a frame callback. This is useful for throttling
   *                redrawing operations, and driving animations.
   *
   *                When a client is animating on a GrSurface, it can use the 'frame'
   *                request to get notified when it is a good time to draw and commit the
   *                next frame of animation. If the client commits an update earlier than
   *                that, it is likely that some updates will not make it to the display,
   *                and the client is wasting resources by drawing too often.
   *
   *                The frame request will take effect on the next GrSurface.commit.
   *                The notification will only be posted for one frame unless
   *                requested again. For a GrSurface, the notifications are posted in
   *                the order the frame requests were committed.
   *
   *                The server must send the notifications so that a client
   *                will not send excessive updates, while still allowing
   *                the highest possible update rate for clients that wait for the reply
   *                before drawing again. The server should give some time for the client
   *                to draw and commit after sending the frame callback events to let them
   *                hit the next output refresh.
   *
   *                A server should avoid signalling the frame callbacks if the
   *                surface is not visible in any way, e.g. the surface is off-screen,
   *                or completely obscured by other opaque surfaces.
   *
   *                The object returned by this request will be destroyed by the
   *                compositor after the callback is fired and as such the client must not
   *                attempt to use it after that point.
   *
   *                The callbackData passed in the callback is the current time, in
   *                milliseconds, with an undefined base.
   *
   *
   * @param {GrSurface} resource
   * @param {*} callback undefined
   *
   * @since 1
   *
   */
  frame (resource, callback) {

  }

  /**
   *
   *                This request sets the region of the surface that contains
   *                opaque content.
   *
   *                The opaque region is an optimization hint for the compositor
   *                that lets it optimize out redrawing of content behind opaque
   *                regions.  Setting an opaque region is not required for correct
   *                behaviour, but marking transparent content as opaque will result
   *                in repaint artifacts.
   *
   *                The opaque region is specified in surface local coordinates.
   *
   *                The compositor ignores the parts of the opaque region that fall
   *                outside of the surface.
   *
   *                Opaque region is double-buffered state, see GrSurface.commit.
   *
   *                GrSurface.setOpaqueRegion changes the pending opaque region.
   *                GrSurface.commit copies the pending region to the current region.
   *                Otherwise, the pending and current regions are never changed.
   *
   *                The initial value for opaque region is empty. Setting the pending
   *                opaque region has copy semantics, and the GrRegion object can be
   *                destroyed immediately. A NULL GrRegion causes the pending opaque
   *                region to be set to empty.
   *
   *
   * @param {GrSurface} resource
   * @param {?*} region undefined
   *
   * @since 1
   *
   */
  setOpaqueRegion (resource, region) {

  }

  /**
   *
   *                This request sets the region of the surface that can receive
   *                pointer and touch events.
   *
   *                Input events happening outside of this region will try the next
   *                surface in the server surface stack. The compositor ignores the
   *                parts of the input region that fall outside of the surface.
   *
   *                The input region is specified in surface local coordinates.
   *
   *                Input region is double-buffered state, see GrSurface.commit.
   *
   *                GrSurface.setInputRegion changes the pending input region.
   *                GrSurface.commit copies the pending region to the current region.
   *                Otherwise the pending and current regions are never changed,
   *                except cursor and icon surfaces are special cases, see
   *                GrPointer.setCursor and GrDataDevice.startDrag.
   *
   *                The initial value for input region is infinite. That means the
   *                whole surface will accept input. Setting the pending input region
   *                has copy semantics, and the GrRegion object can be destroyed
   *                immediately. A NULL GrRegion causes the input region to be set
   *                to infinite.
   *
   *
   * @param {GrSurface} resource
   * @param {?*} region undefined
   *
   * @since 1
   *
   */
  setInputRegion (resource, region) {

  }

  /**
   *
   *                Surface state (input, opaque, and damage regions, attached buffers,
   *                etc.) is double-buffered. Protocol requests modify the pending
   *                state, as opposed to current state in use by the compositor. Commit
   *                request atomically applies all pending state, replacing the current
   *                state. After commit, the new pending state is as documented for each
   *                related request.
   *
   *                On commit, a pending GrBuffer is applied first, all other state
   *                second. This means that all coordinates in double-buffered state are
   *                relative to the new GrBuffer coming into use, except for
   *                GrSurface.attach itself. If there is no pending GrBuffer, the
   *                coordinates are relative to the current surface contents.
   *
   *                All requests that need a commit to become effective are documented
   *                to affect double-buffered state.
   *
   *                Other interfaces may add further double-buffered surface state.
   *
   *
   * @param {GrSurface} resource
   *
   * @since 1
   *
   */
  commit (resource) {

  }

  /**
   *
   *                This request sets an optional transformation on how the compositor
   *                interprets the contents of the buffer attached to the surface. The
   *                accepted values for the transform parameter are the values for
   *                GrOutput.transform.
   *
   *                Buffer transform is double-buffered state, see GrSurface.commit.
   *
   *                A newly created surface has its buffer transformation set to normal.
   *
   *                GrSurface.setBufferTransform changes the pending buffer
   *                transformation. GrSurface.commit copies the pending buffer
   *                transformation to the current one. Otherwise, the pending and current
   *                values are never changed.
   *
   *                The purpose of this request is to allow clients to render content
   *                according to the output transform, thus permiting the compositor to
   *                use certain optimizations even if the display is rotated. Using
   *                hardware overlays and scanning out a client buffer for fullscreen
   *                surfaces are examples of such optimizations. Those optimizations are
   *                highly dependent on the compositor implementation, so the use of this
   *                request should be considered on a case-by-case basis.
   *
   *                Note that if the transform value includes 90 or 270 degree rotation,
   *                the width of the buffer will become the surface height and the height
   *                of the buffer will become the surface width.
   *
   *                If transform is not one of the values from the
   *                GrOutput.transform enum the invalidTransform protocol error
   *                is raised.
   *
   *
   * @param {GrSurface} resource
   * @param {Number} transform undefined
   *
   * @since 2
   *
   */
  setBufferTransform (resource, transform) {

  }

  /**
   *
   *                This request sets an optional scaling factor on how the compositor
   *                interprets the contents of the buffer attached to the window.
   *
   *                Buffer scale is double-buffered state, see GrSurface.commit.
   *
   *                A newly created surface has its buffer scale set to 1.
   *
   *                GrSurface.setBufferScale changes the pending buffer scale.
   *                GrSurface.commit copies the pending buffer scale to the current one.
   *                Otherwise, the pending and current values are never changed.
   *
   *                The purpose of this request is to allow clients to supply higher
   *                resolution buffer data for use on high resolution outputs. Its
   *                intended that you pick the same  buffer scale as the scale of the
   *                output that the surface is displayed on.This means the compositor
   *                can avoid scaling when rendering the surface on that output.
   *
   *                Note that if the scale is larger than 1, then you have to attach
   *                a buffer that is larger (by a factor of scale in each dimension)
   *                than the desired surface size.
   *
   *                If scale is not positive the invalidScale protocol error is
   *                raised.
   *
   *
   * @param {GrSurface} resource
   * @param {Number} scale undefined
   *
   * @since 3
   *
   */
  setBufferScale (resource, scale) {

  }

  /**
   *
   *                This request is used to describe the regions where the pending
   *                buffer is different from the current surface contents, and where
   *                the surface therefore needs to be repainted. The compositor
   *                ignores the parts of the damage that fall outside of the surface.
   *
   *                Damage is double-buffered state, see GrSurface.commit.
   *
   *                The damage rectangle is specified in buffer coordinates.
   *
   *                The initial value for pending damage is empty: no damage.
   *                GrSurface.damageBuffer adds pending damage: the new pending
   *                damage is the union of old pending damage and the given rectangle.
   *
   *                GrSurface.commit assigns pending damage as the current damage,
   *                and clears pending damage. The server will clear the current
   *                damage as it repaints the surface.
   *
   *                This request differs from GrSurface.damage in only one way - it
   *                takes damage in buffer co-ordinates instead of surface local
   *                co-ordinates. While this generally is more intuitive than surface
   *                co-ordinates, it is especially desirable when using wpViewport
   *                or when a drawing library (like EGL) is unaware of buffer scale
   *                and buffer transform.
   *
   *                Note: Because buffer transformation changes and damage requests may
   *                be interleaved in the protocol stream, It is impossible to determine
   *                the actual mapping between surface and buffer damage until
   *                GrSurface.commit time. Therefore, compositors wishing to take both
   *                kinds of damage into account will have to accumulate damage from the
   *                two requests separately and only transform from one to the other
   *                after receiving the GrSurface.commit.
   *
   *
   * @param {GrSurface} resource
   * @param {Number} x undefined
   * @param {Number} y undefined
   * @param {Number} width undefined
   * @param {Number} height undefined
   *
   * @since 4
   *
   */
  damageBuffer (resource, x, y, width, height) {

  }
}