!function(e){var t={};function r(s){if(t[s])return t[s].exports;var i=t[s]={i:s,l:!1,exports:{}};return e[s].call(i.exports,i,i.exports,r),i.l=!0,i.exports}r.m=e,r.c=t,r.d=function(e,t,s){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:s})},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var s=Object.create(null);if(r.r(s),Object.defineProperty(s,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var i in e)r.d(s,i,function(t){return e[t]}.bind(null,i));return s},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="/",r(r.s=0)}([function(e,t,r){e.exports=r(1)},function(e,t,r){"use strict";r.r(t);var s=function(e,t,r,s){return new(r||(r=Promise))((function(i,n){function o(e){try{l(s.next(e))}catch(e){n(e)}}function a(e){try{l(s.throw(e))}catch(e){n(e)}}function l(e){var t;e.done?i(e.value):(t=e.value,t instanceof r?t:new r((function(e){e(t)}))).then(o,a)}l((s=s.apply(e,t||[])).next())}))};const i=new TextDecoder("utf8");class n{constructor(e,t,r,s,i){this.fd=e,this.type=t,this.url=r,this._onGetTransferable=s,this._onClose=i}getTransferable(){return s(this,void 0,void 0,(function*(){return yield this._onGetTransferable(this)}))}close(){this._onClose(this)}}function o(e){return{value:e,type:"u",size:4,optional:!1,_marshallArg:function(t){new Uint32Array(t.buffer,t.bufferOffset,1)[0]=e,t.bufferOffset+=this.size}}}function a(e){return{value:e,type:"h",size:0,optional:!1,_marshallArg:function(t){t.fds.push(e)}}}function l(e){return{value:e,type:"i",size:4,optional:!1,_marshallArg:function(e){new Int32Array(e.buffer,e.bufferOffset,1)[0]=this.value,e.bufferOffset+=this.size}}}function f(e){return{value:e,type:"o",size:4,optional:!1,_marshallArg:function(e){new Uint32Array(e.buffer,e.bufferOffset,1)[0]=this.value.id,e.bufferOffset+=this.size}}}function c(e){return{value:e,type:"o",size:4,optional:!0,_marshallArg:function(e){new Uint32Array(e.buffer,e.bufferOffset,1)[0]=void 0===this.value?0:this.value.id,e.bufferOffset+=this.size}}}function _(){return{value:0,type:"n",size:4,optional:!1,_marshallArg:function(e){new Uint32Array(e.buffer,e.bufferOffset,1)[0]=this.value,e.bufferOffset+=this.size}}}function u(e){return{value:e+"\0",type:"s",size:4+(e.length+1+3&-4),optional:!1,_marshallArg:function(e){new Uint32Array(e.buffer,e.bufferOffset,1)[0]=this.value.length;const t=this.value.length,r=new Uint8Array(e.buffer,e.bufferOffset+4,t);for(let e=0;e<t;e++)r[e]=this.value[e].charCodeAt(0);e.bufferOffset+=this.size}}}function h(e,t){if(e.consumed+t>e.size)throw new Error("Request too short.");e.consumed+=t}function d(e){return h(e,4),e.buffer[e.bufferOffset++]}function v(e){h(e,4);const t=new Int32Array(e.buffer.buffer,e.buffer.byteOffset+e.bufferOffset*Uint32Array.BYTES_PER_ELEMENT,1)[0];return e.bufferOffset+=1,t}function b(e,t){h(e,4);const r=e.buffer[e.bufferOffset++],s=t.wlObjects[r];if(s)return s;throw new Error("Unknown object id "+r)}function g(e){h(e,4);const t=e.buffer[e.bufferOffset++],r=t+3&-4;h(e,r);const s=new Uint8Array(e.buffer.buffer,e.buffer.byteOffset+e.bufferOffset*Uint32Array.BYTES_PER_ELEMENT,t-1);return e.bufferOffset+=r/4,i.decode(s)}function y(e){if(e.fds.length>0){let t=e.fds.shift();if(void 0===t)throw new Error("No more webfds found in wl message.");return t}throw new Error("Not enough file descriptors in message object.")}var p=function(e,t,r,s){return new(r||(r=Promise))((function(i,n){function o(e){try{l(s.next(e))}catch(e){n(e)}}function a(e){try{l(s.throw(e))}catch(e){n(e)}}function l(e){var t;e.done?i(e.value):(t=e.value,t instanceof r?t:new r((function(e){e(t)}))).then(o,a)}l((s=s.apply(e,t||[])).next())}))};class m extends class{constructor(e){this._destroyPromise=new Promise(e=>this._destroyResolver=e),this._destroyListeners=[],this.id=e,this._destroyPromise.then(()=>this._destroyListeners.forEach(e=>e(this)))}destroy(){this._destroyResolver()}addDestroyListener(e){this._destroyListeners.push(e)}removeDestroyListener(e){this._destroyListeners=this._destroyListeners.filter(t=>t!==e)}onDestroy(){return this._destroyPromise}}{constructor(e,t,r){super(r),this.display=e,this._connection=t,t.registerWlObject(this)}destroy(){super.destroy(),this._connection.unregisterWlObject(this)}_marshallConstructor(e,t,r,s){const i=new r(this.display,this._connection,this.display.generateNextId());let n=8;return s.forEach(e=>{"n"===e.type&&(e.value=i.id),n+=e.size}),this._connection.marshallMsg(e,t,n,s),i}_marshall(e,t,r){let s=8;r.forEach(e=>s+=e.size),this._connection.marshallMsg(e,t,s,r)}}class w extends m{constructor(e,t,r){super(e,t,r)}sync(){return this._marshallConstructor(this.id,0,O,[_()])}getRegistry(){return this._marshallConstructor(this.id,1,x,[_()])}0(e){var t;return p(this,void 0,void 0,(function*(){yield null===(t=this.listener)||void 0===t?void 0:t.error(b(e,this._connection),d(e),g(e))}))}1(e){var t;return p(this,void 0,void 0,(function*(){yield null===(t=this.listener)||void 0===t?void 0:t.deleteId(d(e))}))}}class x extends m{constructor(e,t,r){super(e,t,r)}bind(e,t,r,s){return this._marshallConstructor(this.id,0,r,[o(e),u(t),o(s),_()])}0(e){var t;return p(this,void 0,void 0,(function*(){yield null===(t=this.listener)||void 0===t?void 0:t.global(d(e),g(e),d(e))}))}1(e){var t;return p(this,void 0,void 0,(function*(){yield null===(t=this.listener)||void 0===t?void 0:t.globalRemove(d(e))}))}}class O extends m{constructor(e,t,r){super(e,t,r)}0(e){var t;return p(this,void 0,void 0,(function*(){yield null===(t=this.listener)||void 0===t?void 0:t.done(d(e))}))}}class P{constructor(e){this._webFDs={},this._nextFD=0,this._fdDomainUUID=e}static create(e){return new P(e)}fromArrayBuffer(e){const t=this._nextFD++,r=new URL("client://");r.searchParams.append("fd",""+t),r.searchParams.append("type","ArrayBuffer"),r.searchParams.append("clientId",this._fdDomainUUID);const s=new n(t,"ArrayBuffer",r,()=>Promise.resolve(e),()=>{delete this._webFDs[t]});return this._webFDs[t]=s,s}fromImageBitmap(e){const t=this._nextFD++,r=new URL("client://");r.searchParams.append("fd",""+t),r.searchParams.append("type","ImageBitmap"),r.searchParams.append("clientId",this._fdDomainUUID);const s=new n(t,"ImageBitmap",r,()=>Promise.resolve(e),()=>{delete this._webFDs[t]});return this._webFDs[t]=s,s}fromOffscreenCanvas(e){const t=this._nextFD++,r="OffscreenCanvas",s=new URL("client://");s.searchParams.append("fd",""+t),s.searchParams.append("type",r),s.searchParams.append("clientId",this._fdDomainUUID);const i=new n(t,r,s,()=>Promise.resolve(e),()=>{delete this._webFDs[t]});return this._webFDs[t]=i,i}getWebFD(e){return this._webFDs[e]}}var A=function(e,t,r,s){return new(r||(r=Promise))((function(i,n){function o(e){try{l(s.next(e))}catch(e){n(e)}}function a(e){try{l(s.throw(e))}catch(e){n(e)}}function l(e){var t;e.done?i(e.value):(t=e.value,t instanceof r?t:new r((function(e){e(t)}))).then(o,a)}l((s=s.apply(e,t||[])).next())}))};var S;!function(e){e[e._invalidObject=0]="_invalidObject",e[e._invalidMethod=1]="_invalidMethod",e[e._noMemory=2]="_noMemory"}(S||(S={}));class R extends m{constructor(e,t,r){super(e,t,r)}0(e){var t;return A(this,void 0,void 0,(function*(){yield null===(t=this.listener)||void 0===t?void 0:t.done(d(e))}))}}class B extends m{constructor(e,t,r){super(e,t,r)}createSurface(){return this._marshallConstructor(this.id,0,$,[_()])}createRegion(){return this._marshallConstructor(this.id,1,ee,[_()])}}var E,z;!function(e){e[e._invalidFormat=0]="_invalidFormat",e[e._invalidStride=1]="_invalidStride",e[e._invalidFd=2]="_invalidFd"}(E||(E={})),function(e){e[e._argb8888=0]="_argb8888",e[e._xrgb8888=1]="_xrgb8888",e[e._c8=538982467]="_c8",e[e._rgb332=943867730]="_rgb332",e[e._bgr233=944916290]="_bgr233",e[e._xrgb4444=842093144]="_xrgb4444",e[e._xbgr4444=842089048]="_xbgr4444",e[e._rgbx4444=842094674]="_rgbx4444",e[e._bgrx4444=842094658]="_bgrx4444",e[e._argb4444=842093121]="_argb4444",e[e._abgr4444=842089025]="_abgr4444",e[e._rgba4444=842088786]="_rgba4444",e[e._bgra4444=842088770]="_bgra4444",e[e._xrgb1555=892424792]="_xrgb1555",e[e._xbgr1555=892420696]="_xbgr1555",e[e._rgbx5551=892426322]="_rgbx5551",e[e._bgrx5551=892426306]="_bgrx5551",e[e._argb1555=892424769]="_argb1555",e[e._abgr1555=892420673]="_abgr1555",e[e._rgba5551=892420434]="_rgba5551",e[e._bgra5551=892420418]="_bgra5551",e[e._rgb565=909199186]="_rgb565",e[e._bgr565=909199170]="_bgr565",e[e._rgb888=875710290]="_rgb888",e[e._bgr888=875710274]="_bgr888",e[e._xbgr8888=875709016]="_xbgr8888",e[e._rgbx8888=875714642]="_rgbx8888",e[e._bgrx8888=875714626]="_bgrx8888",e[e._abgr8888=875708993]="_abgr8888",e[e._rgba8888=875708754]="_rgba8888",e[e._bgra8888=875708738]="_bgra8888",e[e._xrgb2101010=808669784]="_xrgb2101010",e[e._xbgr2101010=808665688]="_xbgr2101010",e[e._rgbx1010102=808671314]="_rgbx1010102",e[e._bgrx1010102=808671298]="_bgrx1010102",e[e._argb2101010=808669761]="_argb2101010",e[e._abgr2101010=808665665]="_abgr2101010",e[e._rgba1010102=808665426]="_rgba1010102",e[e._bgra1010102=808665410]="_bgra1010102",e[e._yuyv=1448695129]="_yuyv",e[e._yvyu=1431918169]="_yvyu",e[e._uyvy=1498831189]="_uyvy",e[e._vyuy=1498765654]="_vyuy",e[e._ayuv=1448433985]="_ayuv",e[e._nv12=842094158]="_nv12",e[e._nv21=825382478]="_nv21",e[e._nv16=909203022]="_nv16",e[e._nv61=825644622]="_nv61",e[e._yuv410=961959257]="_yuv410",e[e._yvu410=961893977]="_yvu410",e[e._yuv411=825316697]="_yuv411",e[e._yvu411=825316953]="_yvu411",e[e._yuv420=842093913]="_yuv420",e[e._yvu420=842094169]="_yvu420",e[e._yuv422=909202777]="_yuv422",e[e._yvu422=909203033]="_yvu422",e[e._yuv444=875713881]="_yuv444",e[e._yvu444=875714137]="_yvu444"}(z||(z={}));class M extends m{constructor(e,t,r){super(e,t,r)}destroy(){super.destroy(),this._marshall(this.id,0,[])}0(e){var t;return A(this,void 0,void 0,(function*(){yield null===(t=this.listener)||void 0===t?void 0:t.release()}))}}var j;!function(e){e[e._invalidFinish=0]="_invalidFinish",e[e._invalidActionMask=1]="_invalidActionMask",e[e._invalidAction=2]="_invalidAction",e[e._invalidOffer=3]="_invalidOffer"}(j||(j={}));var I;!function(e){e[e._invalidActionMask=0]="_invalidActionMask",e[e._invalidSource=1]="_invalidSource"}(I||(I={}));var L;!function(e){e[e._role=0]="_role"}(L||(L={}));var U;!function(e){e[e._none=0]="_none",e[e._copy=1]="_copy",e[e._move=2]="_move",e[e._ask=4]="_ask"}(U||(U={}));class T extends m{constructor(e,t,r){super(e,t,r)}getShellSurface(e){return this._marshallConstructor(this.id,0,D,[_(),f(e)])}}var C;!function(e){e[e._role=0]="_role"}(C||(C={}));class D extends m{constructor(e,t,r){super(e,t,r)}pong(e){this._marshall(this.id,0,[o(e)])}move(e,t){this._marshall(this.id,1,[f(e),o(t)])}resize(e,t,r){this._marshall(this.id,2,[f(e),o(t),o(r)])}setToplevel(){this._marshall(this.id,3,[])}setTransient(e,t,r,s){this._marshall(this.id,4,[f(e),l(t),l(r),o(s)])}setFullscreen(e,t,r){this._marshall(this.id,5,[o(e),o(t),c(r)])}setPopup(e,t,r,s,i,n){this._marshall(this.id,6,[f(e),o(t),f(r),l(s),l(i),o(n)])}setMaximized(e){this._marshall(this.id,7,[c(e)])}setTitle(e){this._marshall(this.id,8,[u(e)])}setClass(e){this._marshall(this.id,9,[u(e)])}0(e){var t;return A(this,void 0,void 0,(function*(){yield null===(t=this.listener)||void 0===t?void 0:t.ping(d(e))}))}1(e){var t;return A(this,void 0,void 0,(function*(){yield null===(t=this.listener)||void 0===t?void 0:t.configure(d(e),v(e),v(e))}))}2(e){var t;return A(this,void 0,void 0,(function*(){yield null===(t=this.listener)||void 0===t?void 0:t.popupDone()}))}}var F,k,N;!function(e){e[e._none=0]="_none",e[e._top=1]="_top",e[e._bottom=2]="_bottom",e[e._left=4]="_left",e[e._topLeft=5]="_topLeft",e[e._bottomLeft=6]="_bottomLeft",e[e._right=8]="_right",e[e._topRight=9]="_topRight",e[e._bottomRight=10]="_bottomRight"}(F||(F={})),function(e){e[e._inactive=1]="_inactive"}(k||(k={})),function(e){e[e._default=0]="_default",e[e._scale=1]="_scale",e[e._driver=2]="_driver",e[e._fill=3]="_fill"}(N||(N={}));class $ extends m{constructor(e,t,r){super(e,t,r)}destroy(){super.destroy(),this._marshall(this.id,0,[])}attach(e,t,r){this._marshall(this.id,1,[c(e),l(t),l(r)])}damage(e,t,r,s){this._marshall(this.id,2,[l(e),l(t),l(r),l(s)])}frame(){return this._marshallConstructor(this.id,3,R,[_()])}setOpaqueRegion(e){this._marshall(this.id,4,[c(e)])}setInputRegion(e){this._marshall(this.id,5,[c(e)])}commit(e){this._marshall(this.id,6,[o(e)])}setBufferTransform(e){this._marshall(this.id,7,[l(e)])}setBufferScale(e){this._marshall(this.id,8,[l(e)])}damageBuffer(e,t,r,s){this._marshall(this.id,9,[l(e),l(t),l(r),l(s)])}0(e){var t;return A(this,void 0,void 0,(function*(){yield null===(t=this.listener)||void 0===t?void 0:t.enter(b(e,this._connection))}))}1(e){var t;return A(this,void 0,void 0,(function*(){yield null===(t=this.listener)||void 0===t?void 0:t.leave(b(e,this._connection))}))}}var H;!function(e){e[e._invalidScale=0]="_invalidScale",e[e._invalidTransform=1]="_invalidTransform"}(H||(H={}));var Y;!function(e){e[e._pointer=1]="_pointer",e[e._keyboard=2]="_keyboard",e[e._touch=4]="_touch"}(Y||(Y={}));var W,X,G,q;!function(e){e[e._role=0]="_role"}(W||(W={})),function(e){e[e._released=0]="_released",e[e._pressed=1]="_pressed"}(X||(X={})),function(e){e[e._verticalScroll=0]="_verticalScroll",e[e._horizontalScroll=1]="_horizontalScroll"}(G||(G={})),function(e){e[e._wheel=0]="_wheel",e[e._finger=1]="_finger",e[e._continuous=2]="_continuous",e[e._wheelTilt=3]="_wheelTilt"}(q||(q={}));var V,K;!function(e){e[e._noKeymap=0]="_noKeymap",e[e._xkbV1=1]="_xkbV1"}(V||(V={})),function(e){e[e._released=0]="_released",e[e._pressed=1]="_pressed"}(K||(K={}));var J,Q,Z;!function(e){e[e._unknown=0]="_unknown",e[e._none=1]="_none",e[e._horizontalRgb=2]="_horizontalRgb",e[e._horizontalBgr=3]="_horizontalBgr",e[e._verticalRgb=4]="_verticalRgb",e[e._verticalBgr=5]="_verticalBgr"}(J||(J={})),function(e){e[e._normal=0]="_normal",e[e._90=1]="_90",e[e._180=2]="_180",e[e._270=3]="_270",e[e._flipped=4]="_flipped",e[e._flipped90=5]="_flipped90",e[e._flipped180=6]="_flipped180",e[e._flipped270=7]="_flipped270"}(Q||(Q={})),function(e){e[e._current=1]="_current",e[e._preferred=2]="_preferred"}(Z||(Z={}));class ee extends m{constructor(e,t,r){super(e,t,r)}destroy(){super.destroy(),this._marshall(this.id,0,[])}add(e,t,r,s){this._marshall(this.id,1,[l(e),l(t),l(r),l(s)])}subtract(e,t,r,s){this._marshall(this.id,2,[l(e),l(t),l(r),l(s)])}}var te;!function(e){e[e._badSurface=0]="_badSurface"}(te||(te={}));var re;!function(e){e[e._badSurface=0]="_badSurface"}(re||(re={}));var se=function(e,t,r,s){return new(r||(r=Promise))((function(i,n){function o(e){try{l(s.next(e))}catch(e){n(e)}}function a(e){try{l(s.throw(e))}catch(e){n(e)}}function l(e){var t;e.done?i(e.value):(t=e.value,t instanceof r?t:new r((function(e){e(t)}))).then(o,a)}l((s=s.apply(e,t||[])).next())}))};class ie extends m{constructor(e,t,r){super(e,t,r)}attach(e){this._marshall(this.id,0,[a(e)])}0(e){var t;return se(this,void 0,void 0,(function*(){yield null===(t=this.listener)||void 0===t?void 0:t.detach(y(e))}))}}class ne extends m{constructor(e,t,r){super(e,t,r)}createWebArrayBuffer(){return this._marshallConstructor(this.id,0,ie,[_()])}createBuffer(e,t,r){return this._marshallConstructor(this.id,1,M,[_(),f(e),l(t),l(r)])}}var oe;!function(e){e[e._role=0]="_role",e[e._defunctSurfaces=1]="_defunctSurfaces",e[e._notTheTopmostPopup=2]="_notTheTopmostPopup",e[e._invalidPopupParent=3]="_invalidPopupParent",e[e._invalidSurfaceState=4]="_invalidSurfaceState",e[e._invalidPositioner=5]="_invalidPositioner"}(oe||(oe={}));var ae,le,fe,ce;!function(e){e[e._invalidInput=0]="_invalidInput"}(ae||(ae={})),function(e){e[e._none=0]="_none",e[e._top=1]="_top",e[e._bottom=2]="_bottom",e[e._left=3]="_left",e[e._right=4]="_right",e[e._topLeft=5]="_topLeft",e[e._bottomLeft=6]="_bottomLeft",e[e._topRight=7]="_topRight",e[e._bottomRight=8]="_bottomRight"}(le||(le={})),function(e){e[e._none=0]="_none",e[e._top=1]="_top",e[e._bottom=2]="_bottom",e[e._left=3]="_left",e[e._right=4]="_right",e[e._topLeft=5]="_topLeft",e[e._bottomLeft=6]="_bottomLeft",e[e._topRight=7]="_topRight",e[e._bottomRight=8]="_bottomRight"}(fe||(fe={})),function(e){e[e._none=0]="_none",e[e._slideX=1]="_slideX",e[e._slideY=2]="_slideY",e[e._flipX=4]="_flipX",e[e._flipY=8]="_flipY",e[e._resizeX=16]="_resizeX",e[e._resizeY=32]="_resizeY"}(ce||(ce={}));var _e;!function(e){e[e._notConstructed=1]="_notConstructed",e[e._alreadyConstructed=2]="_alreadyConstructed",e[e._unconfiguredBuffer=3]="_unconfiguredBuffer"}(_e||(_e={}));var ue,he;!function(e){e[e._none=0]="_none",e[e._top=1]="_top",e[e._bottom=2]="_bottom",e[e._left=4]="_left",e[e._topLeft=5]="_topLeft",e[e._bottomLeft=6]="_bottomLeft",e[e._right=8]="_right",e[e._topRight=9]="_topRight",e[e._bottomRight=10]="_bottomRight"}(ue||(ue={})),function(e){e[e._maximized=1]="_maximized",e[e._fullscreen=2]="_fullscreen",e[e._resizing=3]="_resizing",e[e._activated=4]="_activated"}(he||(he={}));var de;!function(e){e[e._invalidGrab=0]="_invalidGrab"}(de||(de={}));var ve=function(e,t,r,s){return new(r||(r=Promise))((function(i,n){function o(e){try{l(s.next(e))}catch(e){n(e)}}function a(e){try{l(s.throw(e))}catch(e){n(e)}}function l(e){var t;e.done?i(e.value):(t=e.value,t instanceof r?t:new r((function(e){e(t)}))).then(o,a)}l((s=s.apply(e,t||[])).next())}))};const be=P.create(([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g,e=>(e^self.crypto.getRandomValues(new Uint8Array(1))[0]&15>>e/4).toString(16))),ge=new class{constructor(){this.wlObjects={},this.closed=!1,this._outMessages=[],this._inMessages=[],this._idleHandlers=[]}addIdleHandler(e){this._idleHandlers=[...this._idleHandlers,e]}removeIdleHandler(e){this._idleHandlers=this._idleHandlers.filter(t=>t!==e)}marshallMsg(e,t,r,s){const i={buffer:new ArrayBuffer(r),fds:[],bufferOffset:0},n=new Uint32Array(i.buffer),o=new Uint16Array(i.buffer);n[0]=e,o[2]=t,o[3]=r,i.bufferOffset=8,s.forEach(e=>e._marshallArg(i)),this.onSend(i)}_idle(){return s(this,void 0,void 0,(function*(){for(const e of this._idleHandlers)yield e()}))}message(e){return s(this,void 0,void 0,(function*(){if(!(this.closed||this._inMessages.push(Object.assign(Object.assign({},e),{bufferOffset:0,consumed:0,size:0}))>1)){for(;this._inMessages.length;){const e=this._inMessages[0];for(;e.bufferOffset<e.buffer.length;){const t=e.buffer[e.bufferOffset],r=e.buffer[e.bufferOffset+1];e.size=r>>>16;const s=65535&r;if(e.size>e.buffer.byteLength)throw new Error("Request buffer too small");const i=this.wlObjects[t];if(!i)throw new Error("invalid object "+t);e.bufferOffset+=2,e.consumed=8;try{yield i[s](e)}catch(e){throw console.error(`\nwlObject: ${i.constructor.name}[${s}](..)\nname: ${e.name} message: ${e.message} text: ${e.text}\nerror object stack:\n${e.stack}\n`),this.close(),e}if(this.closed)return}this._inMessages.shift()}this.flush(),yield this._idle()}}))}onSend(e){this.closed||this._outMessages.push(e)}flush(){var e;this.closed||0!==this._outMessages.length&&(null===(e=this.onFlush)||void 0===e||e.call(this,this._outMessages),this._outMessages=[])}close(){this.closed||(Object.values(this.wlObjects).sort((e,t)=>e.id-t.id).forEach(e=>e.destroy()),this.closed=!0)}registerWlObject(e){if(!this.closed){if(e.id in this.wlObjects)throw new Error(`Illegal object id: ${e.id}. Already registered.`);this.wlObjects[e.id]=e}}unregisterWlObject(e){this.closed||delete this.wlObjects[e.id]}},ye=new class{constructor(e){this._recycledIds=[],this._lastId=1,this._connection=e,this._displayProxy=new w(this,this._connection,1),this._destroyPromise=new Promise((e,t)=>{this._destroyResolve=e,this._destroyReject=t}),this._displayProxy.listener={deleteId:e=>{this._recycledIds.push(e)},error:(e,t,r)=>{this._protocolError(e,t,r)}}}close(){this._connection.closed||(this._connection.close(),this._destroyResolve())}_protocolError(e,t,r){this._connection.closed||(this._connection.close(),this._destroyReject(new Error(`Protocol error. type: ${e.constructor.name}, id: ${e.id}, code: ${t}, message: ${r}`)))}onClose(){return this._destroyPromise}getRegistry(){return this._displayProxy.getRegistry()}generateNextId(){return this._recycledIds.length?this._recycledIds.shift():++this._lastId}sync(){return new Promise(e=>{const t=this._displayProxy.sync();t.listener={done:r=>{e(r),t.destroy()}}})}flush(){this._connection.flush()}}(ge);!function(e,t,r){const s=[];onmessage=s=>{if(t.closed)return;const i=s.data;if(i.protocolMessage instanceof ArrayBuffer){const s=new Uint32Array(i.protocolMessage),n=i.meta.map(e=>{if(e instanceof ArrayBuffer)return r.fromArrayBuffer(e);if(e instanceof ImageBitmap)return r.fromImageBitmap(e);if(e instanceof OffscreenCanvas)return r.fromOffscreenCanvas(e);throw new Error(`COMPOSITOR BUG? Unsupported transferable received from compositor: ${e}.`)});try{t.message({buffer:s,fds:n})}catch(t){e.errorHandler&&"function"==typeof e.errorHandler?e.errorHandler(t):(console.error("\tname: "+t.name+" message: "+t.message+" text: "+t.text),console.error("error object stack: "),console.error(t.stack))}}else console.error("[web-worker-client] server send an illegal message."),t.close()},t.onFlush=e=>ve(this,void 0,void 0,(function*(){if(s.push(e),!(s.length>1))for(;s.length;){const e=s[0],t=e.reduce((e,t)=>e+t.buffer.byteLength,0),r=new Uint32Array(new ArrayBuffer(t));let i=0;const n=[];for(const t of e){for(const e of t.fds){const t=yield e.getTransferable();n.push(t)}const e=new Uint32Array(t.buffer);r.set(e,i),i+=e.length}self.postMessage({protocolMessage:r.buffer,meta:n},[r.buffer,...n]),s.shift()}}))}(ye,ge,be);class pe{constructor(e){this._busy=[],this._available=e,this._busy=[]}static create(e,t,r,s){const i=new Array(t),n=new pe(i);for(let o=0;o<t;o++)i[o]=me.create(e,r,s,n);return n}give(e){const t=this._busy.indexOf(e);t>-1&&this._busy.splice(t,1),this._available.push(e)}take(){const e=this._available.shift();return null!=e?(this._busy.push(e),e):null}}class me{constructor(e,t,r,s,i,n,o){this.proxy=e,this.bufferProxy=t,this._pixelContent=r,this.arrayBuffer=s,this.width=i,this.height=n,this._shmBufferPool=o}static create(e,t,r,s){const i=new ArrayBuffer(r*t*Uint32Array.BYTES_PER_ELEMENT),n=be.fromArrayBuffer(i),o=e.createWebArrayBuffer(),a=e.createBuffer(o,t,r),l=new me(o,a,n,i,t,r,s);return o.listener=l,a.listener=l,l}attach(){this.proxy.attach(this._pixelContent)}async detach(e){this._pixelContent=e,this.arrayBuffer=await e.getTransferable()}release(){this._shmBufferPool.give(this)}}class we{constructor(e,t,r){this._registry=e,this.width=t,this.height=r}static create(e,t){const r=ye.getRegistry(),s=new we(r,e,t);return r.listener=s,s}global(e,t,r){var s;"wl_compositor"===t&&(this._compositor=this._registry.bind(e,t,B,r),this._surface=this._compositor.createSurface(),this._onFrame=(s=this._surface,()=>new Promise(e=>{const t=s.frame();t.listener={done:r=>{e(r),t.destroy()}}}))),"gr_web_shm"===t&&(this._webShm=this._registry.bind(e,t,ne,r),this._shmBufferPool=pe.create(this._webShm,2,this.width,this.height)),"wl_shell"===t&&(this._shell=this._registry.bind(e,t,T,r))}init(){if(void 0===this._shell)throw ye.close(),new Error("No shell proxy.");if(void 0===this._surface)throw ye.close(),new Error("No surface proxy.");this._shellSurface=this._shell.getShellSurface(this._surface),this._shellSurface.listener=this,this._shellSurface.setToplevel(),this._shellSurface.setTitle("Simple Web Shm")}_paintPixels(e,t){const r=e.width>>1,s=e.height>>1;let i,n;const o=new Uint32Array(e.arrayBuffer);n=(s<r?s:r)-8,i=n-32,n*=n,i*=i;let a=0;for(let l=0;l<e.height;l++){const f=(l-r)*(l-r);for(let r=0;r<e.width;r++){let e,c=4278190080;const _=(r-s)*(r-s)+f;e=_<i?525313*((_>>5)+(t>>6)):_<n?525313*(l+(t>>5)):525313*(r+(t>>4)),c|=(16711680&e)>>16,c|=65280&e,c|=(255&e)<<16,o[a++]=c}}}draw(e){var t;if(void 0===this._shmBufferPool)throw ye.close(),new Error("No shm buffer pool.");if(void 0===this._surface)throw ye.close(),new Error("No surface proxy.");const r=this._shmBufferPool.take();r?(this._paintPixels(r,e),r.attach(),this._surface.attach(r.bufferProxy,0,0),this._surface.damage(0,0,r.width,r.height),null===(t=this._onFrame)||void 0===t||t.call(this).then(e=>this.draw(e)),this._surface.commit(0)):(console.error("All buffers occupied by compositor!"),ye.close())}globalRemove(e){}configure(e,t,r){}ping(e){if(void 0===this._shellSurface)throw new Error("No shell surface proxy.");this._shellSurface.pong(e)}popupDone(){}}!async function(){const e=we.create(250,250),t=ye.sync();ye.flush(),await t,e.init(),e.draw(0);try{await ye.onClose(),console.log("Application exit.")}catch(e){console.error("Application terminated with error."),console.error(e.stackTrace)}}()}]);