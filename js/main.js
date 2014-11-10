;(function(e,t,n){function i(n,s){if(!t[n]){if(!e[n]){var o=typeof require=="function"&&require;if(!s&&o)return o(n,!0);if(r)return r(n,!0);throw new Error("Cannot find module '"+n+"'")}var u=t[n]={exports:{}};e[n][0].call(u.exports,function(t){var r=e[n][1][t];return i(r?r:t)},u,u.exports)}return t[n].exports}var r=typeof require=="function"&&require;for(var s=0;s<n.length;s++)i(n[s]);return i})({1:[function(require,module,exports){
(function() {
  var __slice = [].slice;

  if (window._gaq == null) {
    window._gaq = [];
    window._gaq.push(['_gat._anonymizeIp']);
  }

  if (window.analytics == null) {
    window.analytics = (function() {
      var addTracker, customVars, gaDebugUrl, gaQueue, gaToken, gaUrl, load, prefix, push, setSessionVar, setVar, trackEvent, trackPageView, trackers, unsetVar;
      gaUrl = (document.location.protocol === 'https:' ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
      gaDebugUrl = gaUrl.replace('/ga.js', '/u/ga_debug.js');
      gaQueue = function() {
        return window._gaq;
      };
      gaToken = 'UA-42548053-1';
      trackers = {};
      customVars = {};
      load = function(debug) {
        var scriptEl;
        if (debug == null) {
          debug = false;
        }
        scriptEl = document.createElement('script');
        scriptEl.src = debug ? gaDebugUrl : gaUrl;
        scriptEl.async = true;
        return $(document.head).append(scriptEl);
      };
      addTracker = function(name, token) {
        if (trackers[name] == null) {
          trackers[name] = token;
        }
        return gaQueue().push([prefix('_setAccount', name), token]);
      };
      prefix = function(command, name) {
        if (name === 'publitas') {
          return command;
        } else {
          return "" + name + "." + command;
        }
      };
      push = function() {
        var args, command, name, _, _results;
        command = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
        _results = [];
        for (name in trackers) {
          _ = trackers[name];
          _results.push(gaQueue().push([prefix(command, name)].concat(args)));
        }
        return _results;
      };
      trackPageView = function(url) {
        if ((url != null) && url.length > 0) {
          return push('_trackPageview', url);
        } else {
          return push('_trackPageview');
        }
      };
      trackEvent = function() {
        return push.apply(null, ['_trackEvent'].concat(__slice.call(arguments)));
      };
      setSessionVar = function(slot, name, value) {
        return push('_setCustomVar', slot, name, value, 2);
      };
      setVar = function(slot, name, value) {
        return push('_setCustomVar', slot, name, value);
      };
      unsetVar = function(slot) {
        return push('_deleteCustomVar', slot);
      };
      addTracker('drumtime', gaToken);
      return {
        trackPageView: function(url) {
          return trackPageView(url);
        },
        trackEvent: trackEvent,
        setSessionVar: setSessionVar,
        setVar: setVar,
        unsetVar: unsetVar,
        addTracker: addTracker,
        load: load
      };
    })();
  }

}).call(this);

},{}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
(function() {
  var attachEvents, close, fullscreenButton, onFullscreenChange, open, overlay, playButton, player, playerOptions, videoEl, watchButton;

  player = null;

  playButton = null;

  watchButton = null;

  overlay = null;

  fullscreenButton = null;

  videoEl = null;

  playerOptions = {
    width: 640,
    height: 360,
    cropX: 64,
    thumbnailUrl: 'images/video_thumb.png'
  };

  exports.init = function() {
    playButton = $('#play_video');
    watchButton = $('#watch');
    overlay = $('#video_overlay');
    fullscreenButton = $('a.goFullscreen');
    videoEl = $('#video');
    if (!((videoEl[0].requestFullscreen != null) || (videoEl[0].webkitRequestFullscreen != null) || (videoEl[0].mozRequestFullScreen != null))) {
      fullscreenButton.hide();
    }
    return attachEvents();
  };

  close = function() {
    if ((player != null) && player.isFullscreen()) {
      player.exitFullscreen();
      videoEl.hide();
      return;
    }
    overlay.removeClass('visible');
    if (player != null) {
      player.destroy();
      return player = null;
    }
  };

  open = function() {
    overlay.addClass('visible');
    return setTimeout(function() {
      if (player == null) {
        player = Player('#video', 'N-2yTQFuYlM', playerOptions);
      }
      player.setVolume(100);
      return player.setPlaybackQuality('hd720');
    }, 550);
  };

  onFullscreenChange = function() {
    return setTimeout(function() {
      videoEl.show();
      if (player.isFullscreen()) {
        return videoEl.css('width', '');
      }
    });
  };

  attachEvents = function() {
    playButton.on('click', function() {
      analytics.trackEvent('video', 'open', 'play button (large)');
      return open();
    });
    watchButton.on('click', function() {
      analytics.trackEvent('video', 'open', 'watch button (large)');
      return open();
    });
    fullscreenButton.on('click', function() {
      if (player == null) {
        return;
      }
      videoEl.hide();
      player.goFullscreen();
      setTimeout(function() {
        return videoEl.css('width', '');
      });
      return analytics.trackEvent('video', 'go fullscreen');
    });
    overlay.find('a.close').on('click', function() {
      close();
      return analytics.trackEvent('video', 'close', 'button');
    });
    overlay.on('click', '.controls', function(e) {
      if (!($(e.target).hasClass('controls') && player)) {
        return;
      }
      player.togglePlay();
      return analytics.trackEvent('video', 'play/pause', 'click');
    });
    $(document).on('keydown', function(e) {
      switch (e.which) {
        case 27:
          close();
          return analytics.trackEvent('video', 'close', 'keyboard');
        case 32:
          if (player != null) {
            e.preventDefault();
            player.togglePlay();
            return analytics.trackEvent('video', 'play/pause', 'keyboard');
          }
      }
    });
    $(document).on('fullscreenchange', onFullscreenChange);
    $(document).on('mozfullscreenchange', onFullscreenChange);
    return $(document).on('webkitfullscreenchange', onFullscreenChange);
  };

}).call(this);

},{}],4:[function(require,module,exports){
(function() {
  var scrollHeader, video;

  video = require('./video');

  scrollHeader = require('./scrolling_header');

  $(function() {
    var experimentSection;
    video.init();
    scrollHeader($('header'));
    analytics.load();
    analytics.trackPageView(window.location.href);
    $('header #links a').on('click', function(e) {
      return analytics.trackEvent('main menu', 'click', $(e.currentTarget).prop('class'));
    });
    $(document).on('click', function(e) {
      return analytics.trackEvent('click', e.target.nodeName, "#" + e.target.id + "." + e.target.className);
    });
    $(document).on('click', '.buy', function() {
      return setTimeout(function() {
        return window.location = 'macappstore://itunes.apple.com/app/id570388126';
      }, 50);
    });
    experimentSection = $('#experiment').parent();
    return $('[href=#experiment]').on('click', function(e) {
      var $html, removeTransforms, top;
      e.preventDefault();
      top = experimentSection.offset().top - 120;
      $html = $(document.documentElement);
      $html.css({
        transform: "translate(0, " + top + "px)"
      });
      document.body.scrollTop = top;
      document.documentElement.scrollTop = top;
      removeTransforms = function() {
        return $html.css({
          transition: '',
          transform: ''
        });
      };
      return setTimeout(function() {
        $html.on('transitionend', removeTransforms);
        $html.on('oTransitionEnd', removeTransforms);
        $html.on('webkitTransitionEnd', removeTransforms);
        return $html.css({
          transition: 'all 600ms',
          transform: "translate(0, 0)"
        });
      });
    });
  });

}).call(this);

},{"./scrolling_header":2,"./video":3}]},{},[1,2,4,3])
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvZmVsaXgvV29ya3NwYWNlL2RydW10aW1lLmdpdGh1Yi5pby90bXAvZ29vZ2xlX2FuYWx5dGljcy5qcyIsIi9Vc2Vycy9mZWxpeC9Xb3Jrc3BhY2UvZHJ1bXRpbWUuZ2l0aHViLmlvL3RtcC9zY3JvbGxpbmdfaGVhZGVyLmpzIiwiL1VzZXJzL2ZlbGl4L1dvcmtzcGFjZS9kcnVtdGltZS5naXRodWIuaW8vdG1wL3ZpZGVvLmpzIiwiL1VzZXJzL2ZlbGl4L1dvcmtzcGFjZS9kcnVtdGltZS5naXRodWIuaW8vdG1wL21haW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNySEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKSB7XG4gIHZhciBfX3NsaWNlID0gW10uc2xpY2U7XG5cbiAgaWYgKHdpbmRvdy5fZ2FxID09IG51bGwpIHtcbiAgICB3aW5kb3cuX2dhcSA9IFtdO1xuICAgIHdpbmRvdy5fZ2FxLnB1c2goWydfZ2F0Ll9hbm9ueW1pemVJcCddKTtcbiAgfVxuXG4gIGlmICh3aW5kb3cuYW5hbHl0aWNzID09IG51bGwpIHtcbiAgICB3aW5kb3cuYW5hbHl0aWNzID0gKGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGFkZFRyYWNrZXIsIGN1c3RvbVZhcnMsIGdhRGVidWdVcmwsIGdhUXVldWUsIGdhVG9rZW4sIGdhVXJsLCBsb2FkLCBwcmVmaXgsIHB1c2gsIHNldFNlc3Npb25WYXIsIHNldFZhciwgdHJhY2tFdmVudCwgdHJhY2tQYWdlVmlldywgdHJhY2tlcnMsIHVuc2V0VmFyO1xuICAgICAgZ2FVcmwgPSAoZG9jdW1lbnQubG9jYXRpb24ucHJvdG9jb2wgPT09ICdodHRwczonID8gJ2h0dHBzOi8vc3NsJyA6ICdodHRwOi8vd3d3JykgKyAnLmdvb2dsZS1hbmFseXRpY3MuY29tL2dhLmpzJztcbiAgICAgIGdhRGVidWdVcmwgPSBnYVVybC5yZXBsYWNlKCcvZ2EuanMnLCAnL3UvZ2FfZGVidWcuanMnKTtcbiAgICAgIGdhUXVldWUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHdpbmRvdy5fZ2FxO1xuICAgICAgfTtcbiAgICAgIGdhVG9rZW4gPSAnVUEtNDI1NDgwNTMtMSc7XG4gICAgICB0cmFja2VycyA9IHt9O1xuICAgICAgY3VzdG9tVmFycyA9IHt9O1xuICAgICAgbG9hZCA9IGZ1bmN0aW9uKGRlYnVnKSB7XG4gICAgICAgIHZhciBzY3JpcHRFbDtcbiAgICAgICAgaWYgKGRlYnVnID09IG51bGwpIHtcbiAgICAgICAgICBkZWJ1ZyA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHNjcmlwdEVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2NyaXB0Jyk7XG4gICAgICAgIHNjcmlwdEVsLnNyYyA9IGRlYnVnID8gZ2FEZWJ1Z1VybCA6IGdhVXJsO1xuICAgICAgICBzY3JpcHRFbC5hc3luYyA9IHRydWU7XG4gICAgICAgIHJldHVybiAkKGRvY3VtZW50LmhlYWQpLmFwcGVuZChzY3JpcHRFbCk7XG4gICAgICB9O1xuICAgICAgYWRkVHJhY2tlciA9IGZ1bmN0aW9uKG5hbWUsIHRva2VuKSB7XG4gICAgICAgIGlmICh0cmFja2Vyc1tuYW1lXSA9PSBudWxsKSB7XG4gICAgICAgICAgdHJhY2tlcnNbbmFtZV0gPSB0b2tlbjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZ2FRdWV1ZSgpLnB1c2goW3ByZWZpeCgnX3NldEFjY291bnQnLCBuYW1lKSwgdG9rZW5dKTtcbiAgICAgIH07XG4gICAgICBwcmVmaXggPSBmdW5jdGlvbihjb21tYW5kLCBuYW1lKSB7XG4gICAgICAgIGlmIChuYW1lID09PSAncHVibGl0YXMnKSB7XG4gICAgICAgICAgcmV0dXJuIGNvbW1hbmQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIFwiXCIgKyBuYW1lICsgXCIuXCIgKyBjb21tYW5kO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgcHVzaCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgYXJncywgY29tbWFuZCwgbmFtZSwgXywgX3Jlc3VsdHM7XG4gICAgICAgIGNvbW1hbmQgPSBhcmd1bWVudHNbMF0sIGFyZ3MgPSAyIDw9IGFyZ3VtZW50cy5sZW5ndGggPyBfX3NsaWNlLmNhbGwoYXJndW1lbnRzLCAxKSA6IFtdO1xuICAgICAgICBfcmVzdWx0cyA9IFtdO1xuICAgICAgICBmb3IgKG5hbWUgaW4gdHJhY2tlcnMpIHtcbiAgICAgICAgICBfID0gdHJhY2tlcnNbbmFtZV07XG4gICAgICAgICAgX3Jlc3VsdHMucHVzaChnYVF1ZXVlKCkucHVzaChbcHJlZml4KGNvbW1hbmQsIG5hbWUpXS5jb25jYXQoYXJncykpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gX3Jlc3VsdHM7XG4gICAgICB9O1xuICAgICAgdHJhY2tQYWdlVmlldyA9IGZ1bmN0aW9uKHVybCkge1xuICAgICAgICBpZiAoKHVybCAhPSBudWxsKSAmJiB1cmwubGVuZ3RoID4gMCkge1xuICAgICAgICAgIHJldHVybiBwdXNoKCdfdHJhY2tQYWdldmlldycsIHVybCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIHB1c2goJ190cmFja1BhZ2V2aWV3Jyk7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICB0cmFja0V2ZW50ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBwdXNoLmFwcGx5KG51bGwsIFsnX3RyYWNrRXZlbnQnXS5jb25jYXQoX19zbGljZS5jYWxsKGFyZ3VtZW50cykpKTtcbiAgICAgIH07XG4gICAgICBzZXRTZXNzaW9uVmFyID0gZnVuY3Rpb24oc2xvdCwgbmFtZSwgdmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIHB1c2goJ19zZXRDdXN0b21WYXInLCBzbG90LCBuYW1lLCB2YWx1ZSwgMik7XG4gICAgICB9O1xuICAgICAgc2V0VmFyID0gZnVuY3Rpb24oc2xvdCwgbmFtZSwgdmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIHB1c2goJ19zZXRDdXN0b21WYXInLCBzbG90LCBuYW1lLCB2YWx1ZSk7XG4gICAgICB9O1xuICAgICAgdW5zZXRWYXIgPSBmdW5jdGlvbihzbG90KSB7XG4gICAgICAgIHJldHVybiBwdXNoKCdfZGVsZXRlQ3VzdG9tVmFyJywgc2xvdCk7XG4gICAgICB9O1xuICAgICAgYWRkVHJhY2tlcignZHJ1bXRpbWUnLCBnYVRva2VuKTtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHRyYWNrUGFnZVZpZXc6IGZ1bmN0aW9uKHVybCkge1xuICAgICAgICAgIHJldHVybiB0cmFja1BhZ2VWaWV3KHVybCk7XG4gICAgICAgIH0sXG4gICAgICAgIHRyYWNrRXZlbnQ6IHRyYWNrRXZlbnQsXG4gICAgICAgIHNldFNlc3Npb25WYXI6IHNldFNlc3Npb25WYXIsXG4gICAgICAgIHNldFZhcjogc2V0VmFyLFxuICAgICAgICB1bnNldFZhcjogdW5zZXRWYXIsXG4gICAgICAgIGFkZFRyYWNrZXI6IGFkZFRyYWNrZXIsXG4gICAgICAgIGxvYWQ6IGxvYWRcbiAgICAgIH07XG4gICAgfSkoKTtcbiAgfVxuXG59KS5jYWxsKHRoaXMpO1xuIiwiKGZ1bmN0aW9uKCkge1xuICBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGRvbUVsKSB7XG4gICAgdmFyIGFkanVzdEJnT3BhY2l0eSwgYmFja2dyb3VuZCwgaGVpZ2h0LCBsYXN0U2V0LCBzY3JvbGxMb2dnZWQ7XG4gICAgYmFja2dyb3VuZCA9IGRvbUVsLmZpbmQoJy5iZycpO1xuICAgIGhlaWdodCA9IGRvbUVsLmhlaWdodCgpO1xuICAgIGxhc3RTZXQgPSBudWxsO1xuICAgIHNjcm9sbExvZ2dlZCA9IGZhbHNlO1xuICAgIGFkanVzdEJnT3BhY2l0eSA9IGZ1bmN0aW9uKHNjcm9sbFRvcCkge1xuICAgICAgdmFyIHBjdDtcbiAgICAgIHNjcm9sbFRvcCA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxUb3AgfHwgZG9jdW1lbnQuYm9keS5zY3JvbGxUb3AgfHwgd2luZG93LnBhZ2VZT2Zmc2V0O1xuICAgICAgcGN0ID0gMS4xICogc2Nyb2xsVG9wIC8gaGVpZ2h0O1xuICAgICAgcGN0ID0gTWF0aC5tYXgocGN0LCAwKTtcbiAgICAgIHBjdCA9IE1hdGgubWluKHBjdCwgMSk7XG4gICAgICBpZiAobGFzdFNldCA9PT0gcGN0KSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGJhY2tncm91bmQuY3NzKHtcbiAgICAgICAgb3BhY2l0eTogTWF0aC5yb3VuZCgxMCAqIHBjdCkgLyAxMFxuICAgICAgfSk7XG4gICAgICByZXR1cm4gbGFzdFNldCA9IHBjdDtcbiAgICB9O1xuICAgICQoZG9jdW1lbnQpLm9uKCdzY3JvbGwnLCBmdW5jdGlvbihlKSB7XG4gICAgICBzZXRUaW1lb3V0KGFkanVzdEJnT3BhY2l0eSk7XG4gICAgICBpZiAoIXNjcm9sbExvZ2dlZCkge1xuICAgICAgICB3aW5kb3cuYW5hbHl0aWNzLnRyYWNrRXZlbnQoJ3Njcm9sbCcsICdpbml0aWFsIHNjcm9sbCcpO1xuICAgICAgICByZXR1cm4gc2Nyb2xsTG9nZ2VkID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICAkKGRvY3VtZW50KS5vbigndG91Y2htb3ZlJywgZnVuY3Rpb24oZSkge1xuICAgICAgdmFyIHRvdWNoZXMsIF9yZWY7XG4gICAgICB0b3VjaGVzID0gKF9yZWYgPSBlLm9yaWdpbmFsRXZlbnQudG91Y2hlcykgIT0gbnVsbCA/IF9yZWYgOiBlLm9yaWdpbmFsRXZlbnQuY2hhbmdlZFRvdWNoZXM7XG4gICAgICBpZiAodG91Y2hlcy5sZW5ndGggIT09IDEgfHwgbGFzdFNldCA9PT0gMSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICByZXR1cm4gYWRqdXN0QmdPcGFjaXR5KCk7XG4gICAgfSk7XG4gICAgcmV0dXJuIGFkanVzdEJnT3BhY2l0eSgpO1xuICB9O1xuXG59KS5jYWxsKHRoaXMpO1xuIiwiKGZ1bmN0aW9uKCkge1xuICB2YXIgYXR0YWNoRXZlbnRzLCBjbG9zZSwgZnVsbHNjcmVlbkJ1dHRvbiwgb25GdWxsc2NyZWVuQ2hhbmdlLCBvcGVuLCBvdmVybGF5LCBwbGF5QnV0dG9uLCBwbGF5ZXIsIHBsYXllck9wdGlvbnMsIHZpZGVvRWwsIHdhdGNoQnV0dG9uO1xuXG4gIHBsYXllciA9IG51bGw7XG5cbiAgcGxheUJ1dHRvbiA9IG51bGw7XG5cbiAgd2F0Y2hCdXR0b24gPSBudWxsO1xuXG4gIG92ZXJsYXkgPSBudWxsO1xuXG4gIGZ1bGxzY3JlZW5CdXR0b24gPSBudWxsO1xuXG4gIHZpZGVvRWwgPSBudWxsO1xuXG4gIHBsYXllck9wdGlvbnMgPSB7XG4gICAgd2lkdGg6IDY0MCxcbiAgICBoZWlnaHQ6IDM2MCxcbiAgICBjcm9wWDogNjQsXG4gICAgdGh1bWJuYWlsVXJsOiAnaW1hZ2VzL3ZpZGVvX3RodW1iLnBuZydcbiAgfTtcblxuICBleHBvcnRzLmluaXQgPSBmdW5jdGlvbigpIHtcbiAgICBwbGF5QnV0dG9uID0gJCgnI3BsYXlfdmlkZW8nKTtcbiAgICB3YXRjaEJ1dHRvbiA9ICQoJyN3YXRjaCcpO1xuICAgIG92ZXJsYXkgPSAkKCcjdmlkZW9fb3ZlcmxheScpO1xuICAgIGZ1bGxzY3JlZW5CdXR0b24gPSAkKCdhLmdvRnVsbHNjcmVlbicpO1xuICAgIHZpZGVvRWwgPSAkKCcjdmlkZW8nKTtcbiAgICBpZiAoISgodmlkZW9FbFswXS5yZXF1ZXN0RnVsbHNjcmVlbiAhPSBudWxsKSB8fCAodmlkZW9FbFswXS53ZWJraXRSZXF1ZXN0RnVsbHNjcmVlbiAhPSBudWxsKSB8fCAodmlkZW9FbFswXS5tb3pSZXF1ZXN0RnVsbFNjcmVlbiAhPSBudWxsKSkpIHtcbiAgICAgIGZ1bGxzY3JlZW5CdXR0b24uaGlkZSgpO1xuICAgIH1cbiAgICByZXR1cm4gYXR0YWNoRXZlbnRzKCk7XG4gIH07XG5cbiAgY2xvc2UgPSBmdW5jdGlvbigpIHtcbiAgICBpZiAoKHBsYXllciAhPSBudWxsKSAmJiBwbGF5ZXIuaXNGdWxsc2NyZWVuKCkpIHtcbiAgICAgIHBsYXllci5leGl0RnVsbHNjcmVlbigpO1xuICAgICAgdmlkZW9FbC5oaWRlKCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIG92ZXJsYXkucmVtb3ZlQ2xhc3MoJ3Zpc2libGUnKTtcbiAgICBpZiAocGxheWVyICE9IG51bGwpIHtcbiAgICAgIHBsYXllci5kZXN0cm95KCk7XG4gICAgICByZXR1cm4gcGxheWVyID0gbnVsbDtcbiAgICB9XG4gIH07XG5cbiAgb3BlbiA9IGZ1bmN0aW9uKCkge1xuICAgIG92ZXJsYXkuYWRkQ2xhc3MoJ3Zpc2libGUnKTtcbiAgICByZXR1cm4gc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgIGlmIChwbGF5ZXIgPT0gbnVsbCkge1xuICAgICAgICBwbGF5ZXIgPSBQbGF5ZXIoJyN2aWRlbycsICdOLTJ5VFFGdVlsTScsIHBsYXllck9wdGlvbnMpO1xuICAgICAgfVxuICAgICAgcGxheWVyLnNldFZvbHVtZSgxMDApO1xuICAgICAgcmV0dXJuIHBsYXllci5zZXRQbGF5YmFja1F1YWxpdHkoJ2hkNzIwJyk7XG4gICAgfSwgNTUwKTtcbiAgfTtcblxuICBvbkZ1bGxzY3JlZW5DaGFuZ2UgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgIHZpZGVvRWwuc2hvdygpO1xuICAgICAgaWYgKHBsYXllci5pc0Z1bGxzY3JlZW4oKSkge1xuICAgICAgICByZXR1cm4gdmlkZW9FbC5jc3MoJ3dpZHRoJywgJycpO1xuICAgICAgfVxuICAgIH0pO1xuICB9O1xuXG4gIGF0dGFjaEV2ZW50cyA9IGZ1bmN0aW9uKCkge1xuICAgIHBsYXlCdXR0b24ub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG4gICAgICBhbmFseXRpY3MudHJhY2tFdmVudCgndmlkZW8nLCAnb3BlbicsICdwbGF5IGJ1dHRvbiAobGFyZ2UpJyk7XG4gICAgICByZXR1cm4gb3BlbigpO1xuICAgIH0pO1xuICAgIHdhdGNoQnV0dG9uLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuICAgICAgYW5hbHl0aWNzLnRyYWNrRXZlbnQoJ3ZpZGVvJywgJ29wZW4nLCAnd2F0Y2ggYnV0dG9uIChsYXJnZSknKTtcbiAgICAgIHJldHVybiBvcGVuKCk7XG4gICAgfSk7XG4gICAgZnVsbHNjcmVlbkJ1dHRvbi5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcbiAgICAgIGlmIChwbGF5ZXIgPT0gbnVsbCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICB2aWRlb0VsLmhpZGUoKTtcbiAgICAgIHBsYXllci5nb0Z1bGxzY3JlZW4oKTtcbiAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB2aWRlb0VsLmNzcygnd2lkdGgnLCAnJyk7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBhbmFseXRpY3MudHJhY2tFdmVudCgndmlkZW8nLCAnZ28gZnVsbHNjcmVlbicpO1xuICAgIH0pO1xuICAgIG92ZXJsYXkuZmluZCgnYS5jbG9zZScpLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuICAgICAgY2xvc2UoKTtcbiAgICAgIHJldHVybiBhbmFseXRpY3MudHJhY2tFdmVudCgndmlkZW8nLCAnY2xvc2UnLCAnYnV0dG9uJyk7XG4gICAgfSk7XG4gICAgb3ZlcmxheS5vbignY2xpY2snLCAnLmNvbnRyb2xzJywgZnVuY3Rpb24oZSkge1xuICAgICAgaWYgKCEoJChlLnRhcmdldCkuaGFzQ2xhc3MoJ2NvbnRyb2xzJykgJiYgcGxheWVyKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBwbGF5ZXIudG9nZ2xlUGxheSgpO1xuICAgICAgcmV0dXJuIGFuYWx5dGljcy50cmFja0V2ZW50KCd2aWRlbycsICdwbGF5L3BhdXNlJywgJ2NsaWNrJyk7XG4gICAgfSk7XG4gICAgJChkb2N1bWVudCkub24oJ2tleWRvd24nLCBmdW5jdGlvbihlKSB7XG4gICAgICBzd2l0Y2ggKGUud2hpY2gpIHtcbiAgICAgICAgY2FzZSAyNzpcbiAgICAgICAgICBjbG9zZSgpO1xuICAgICAgICAgIHJldHVybiBhbmFseXRpY3MudHJhY2tFdmVudCgndmlkZW8nLCAnY2xvc2UnLCAna2V5Ym9hcmQnKTtcbiAgICAgICAgY2FzZSAzMjpcbiAgICAgICAgICBpZiAocGxheWVyICE9IG51bGwpIHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIHBsYXllci50b2dnbGVQbGF5KCk7XG4gICAgICAgICAgICByZXR1cm4gYW5hbHl0aWNzLnRyYWNrRXZlbnQoJ3ZpZGVvJywgJ3BsYXkvcGF1c2UnLCAna2V5Ym9hcmQnKTtcbiAgICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gICAgJChkb2N1bWVudCkub24oJ2Z1bGxzY3JlZW5jaGFuZ2UnLCBvbkZ1bGxzY3JlZW5DaGFuZ2UpO1xuICAgICQoZG9jdW1lbnQpLm9uKCdtb3pmdWxsc2NyZWVuY2hhbmdlJywgb25GdWxsc2NyZWVuQ2hhbmdlKTtcbiAgICByZXR1cm4gJChkb2N1bWVudCkub24oJ3dlYmtpdGZ1bGxzY3JlZW5jaGFuZ2UnLCBvbkZ1bGxzY3JlZW5DaGFuZ2UpO1xuICB9O1xuXG59KS5jYWxsKHRoaXMpO1xuIiwiKGZ1bmN0aW9uKCkge1xuICB2YXIgc2Nyb2xsSGVhZGVyLCB2aWRlbztcblxuICB2aWRlbyA9IHJlcXVpcmUoJy4vdmlkZW8nKTtcblxuICBzY3JvbGxIZWFkZXIgPSByZXF1aXJlKCcuL3Njcm9sbGluZ19oZWFkZXInKTtcblxuICAkKGZ1bmN0aW9uKCkge1xuICAgIHZhciBleHBlcmltZW50U2VjdGlvbjtcbiAgICB2aWRlby5pbml0KCk7XG4gICAgc2Nyb2xsSGVhZGVyKCQoJ2hlYWRlcicpKTtcbiAgICBhbmFseXRpY3MubG9hZCgpO1xuICAgIGFuYWx5dGljcy50cmFja1BhZ2VWaWV3KHdpbmRvdy5sb2NhdGlvbi5ocmVmKTtcbiAgICAkKCdoZWFkZXIgI2xpbmtzIGEnKS5vbignY2xpY2snLCBmdW5jdGlvbihlKSB7XG4gICAgICByZXR1cm4gYW5hbHl0aWNzLnRyYWNrRXZlbnQoJ21haW4gbWVudScsICdjbGljaycsICQoZS5jdXJyZW50VGFyZ2V0KS5wcm9wKCdjbGFzcycpKTtcbiAgICB9KTtcbiAgICAkKGRvY3VtZW50KS5vbignY2xpY2snLCBmdW5jdGlvbihlKSB7XG4gICAgICByZXR1cm4gYW5hbHl0aWNzLnRyYWNrRXZlbnQoJ2NsaWNrJywgZS50YXJnZXQubm9kZU5hbWUsIFwiI1wiICsgZS50YXJnZXQuaWQgKyBcIi5cIiArIGUudGFyZ2V0LmNsYXNzTmFtZSk7XG4gICAgfSk7XG4gICAgJChkb2N1bWVudCkub24oJ2NsaWNrJywgJy5idXknLCBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gd2luZG93LmxvY2F0aW9uID0gJ21hY2FwcHN0b3JlOi8vaXR1bmVzLmFwcGxlLmNvbS9hcHAvaWQ1NzAzODgxMjYnO1xuICAgICAgfSwgNTApO1xuICAgIH0pO1xuICAgIGV4cGVyaW1lbnRTZWN0aW9uID0gJCgnI2V4cGVyaW1lbnQnKS5wYXJlbnQoKTtcbiAgICByZXR1cm4gJCgnW2hyZWY9I2V4cGVyaW1lbnRdJykub24oJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xuICAgICAgdmFyICRodG1sLCByZW1vdmVUcmFuc2Zvcm1zLCB0b3A7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICB0b3AgPSBleHBlcmltZW50U2VjdGlvbi5vZmZzZXQoKS50b3AgLSAxMjA7XG4gICAgICAkaHRtbCA9ICQoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50KTtcbiAgICAgICRodG1sLmNzcyh7XG4gICAgICAgIHRyYW5zZm9ybTogXCJ0cmFuc2xhdGUoMCwgXCIgKyB0b3AgKyBcInB4KVwiXG4gICAgICB9KTtcbiAgICAgIGRvY3VtZW50LmJvZHkuc2Nyb2xsVG9wID0gdG9wO1xuICAgICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbFRvcCA9IHRvcDtcbiAgICAgIHJlbW92ZVRyYW5zZm9ybXMgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuICRodG1sLmNzcyh7XG4gICAgICAgICAgdHJhbnNpdGlvbjogJycsXG4gICAgICAgICAgdHJhbnNmb3JtOiAnJ1xuICAgICAgICB9KTtcbiAgICAgIH07XG4gICAgICByZXR1cm4gc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgJGh0bWwub24oJ3RyYW5zaXRpb25lbmQnLCByZW1vdmVUcmFuc2Zvcm1zKTtcbiAgICAgICAgJGh0bWwub24oJ29UcmFuc2l0aW9uRW5kJywgcmVtb3ZlVHJhbnNmb3Jtcyk7XG4gICAgICAgICRodG1sLm9uKCd3ZWJraXRUcmFuc2l0aW9uRW5kJywgcmVtb3ZlVHJhbnNmb3Jtcyk7XG4gICAgICAgIHJldHVybiAkaHRtbC5jc3Moe1xuICAgICAgICAgIHRyYW5zaXRpb246ICdhbGwgNjAwbXMnLFxuICAgICAgICAgIHRyYW5zZm9ybTogXCJ0cmFuc2xhdGUoMCwgMClcIlxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcblxufSkuY2FsbCh0aGlzKTtcbiJdfQ==
;