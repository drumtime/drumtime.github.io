player           = null
playButton       = null
watchButton      = null
overlay          = null
fullscreenButton = null
videoEl          = null

playerOptions =
  width: 640
  height: 360
  cropX: 64
  thumbnailUrl: 'images/video_thumb.png'

exports.init = ->
  playButton       = $('#play_video')
  watchButton      = $('#watch')
  overlay          = $('#video_overlay')
  fullscreenButton = $('a.goFullscreen')
  videoEl          = $('#video')

  fullscreenButton.hide() unless videoEl[0].requestFullscreen? or 
                                 videoEl[0].webkitRequestFullscreen? or
                                 videoEl[0].mozRequestFullScreen?

  attachEvents()

close = ->
  if player? and player.isFullscreen()
    player.exitFullscreen()
    videoEl.hide()
    return

  overlay.removeClass 'visible'
  if player?
    player.destroy()
    player = null

open = ->
  overlay.addClass 'visible'
  setTimeout ->
    player ?= Player('#video', 'N-2yTQFuYlM', playerOptions)
    player.setVolume 100
    player.setPlaybackQuality 'hd720'
  , 550

onFullscreenChange = -> 
  setTimeout -> 
    videoEl.show()
    videoEl.css 'width', '' if player.isFullscreen()

attachEvents = ->
  playButton.on 'click', ->
    analytics.trackEvent 'video', 'open', 'play button (large)'
    open()
  watchButton.on 'click', ->
    analytics.trackEvent 'video', 'open', 'watch button (large)'
    open()

  fullscreenButton.on 'click', ->
    return unless player?
    videoEl.hide()
    player.goFullscreen()
    setTimeout -> videoEl.css 'width', ''
    analytics.trackEvent 'video', 'go fullscreen'

  overlay.find('a.close').on 'click', -> 
    close()
    analytics.trackEvent 'video', 'close', 'button'

  overlay.on 'click', '.controls', (e) ->
    return unless $(e.target).hasClass('controls') and player
    player.togglePlay()
    analytics.trackEvent 'video', 'play/pause', 'click' 

  $(document).on 'keydown', (e) -> 
    switch e.which 
      when 27 # esc
        close() 
        analytics.trackEvent 'video', 'close', 'keyboard'
      when 32 # space
        if player?
          e.preventDefault()
          player.togglePlay() 
          analytics.trackEvent 'video', 'play/pause', 'keyboard' 


  $(document).on 'fullscreenchange',       onFullscreenChange
  $(document).on 'mozfullscreenchange',    onFullscreenChange
  $(document).on 'webkitfullscreenchange', onFullscreenChange