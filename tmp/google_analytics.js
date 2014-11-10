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
