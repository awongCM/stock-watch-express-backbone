/* backbone-callbacks - v0.1.6 - 2014-01-06 */
(function(e){var t=e._||require("underscore")._,n=e.Backbone||require("backbone"),r=function(e,n){return function(){var r=t.toArray(arguments),i=r[r.length-1];if(typeof i=="function"){r.splice(-1,1),r.length===0&&r.push({}),r.length===1&&e==="save"&&r.push({});var s=r[r.length-1];s.success=function(e,t){i(null,t)},s.error=function(e,t){i(t,null)}}return n.apply(this,r)}};typeof module!="undefined"&&typeof module.exports!="undefined"?module.exports=r:e.BackboneCallbacks=r,r.attach=function(e){t.each(["save","destroy","fetch"],function(t){e.Model.prototype[t]=new r(t,e.Model.prototype[t])}),t.each(["fetch"],function(t){e.Collection.prototype[t]=new r(t,e.Collection.prototype[t])})},r.attach(n)})(this);