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
