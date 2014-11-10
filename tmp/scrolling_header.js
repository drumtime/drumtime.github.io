(function() {
  module.exports = function(domEl) {
    var adjustBgOpacity, background, height, lastSet, scrollLogged;
    background = domEl.find('.bg');
    height = domEl.height();
    lastSet = null;
    scrollLogged = false;
    adjustBgOpacity = function(scrollTop) {
      var pct;
      scrollTop = document.documentElement.scrollTop || document.body.scrollTop || window.pageYOffset;
      pct = 1.1 * scrollTop / height;
      pct = Math.max(pct, 0);
      pct = Math.min(pct, 1);
      if (lastSet === pct) {
        return;
      }
      background.css({
        opacity: Math.round(10 * pct) / 10
      });
      return lastSet = pct;
    };
    $(document).on('scroll', function(e) {
      setTimeout(adjustBgOpacity);
      if (!scrollLogged) {
        window.analytics.trackEvent('scroll', 'initial scroll');
        return scrollLogged = true;
      }
    });
    $(document).on('touchmove', function(e) {
      var touches, _ref;
      touches = (_ref = e.originalEvent.touches) != null ? _ref : e.originalEvent.changedTouches;
      if (touches.length !== 1 || lastSet === 1) {
        return;
      }
      return adjustBgOpacity();
    });
    return adjustBgOpacity();
  };

}).call(this);
