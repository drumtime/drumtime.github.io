module.exports = (domEl) ->
  background = domEl.find '.bg'
  height     = domEl.height()
  lastSet    = null

  scrollLogged = false

  adjustBgOpacity = (scrollTop) ->
    scrollTop = document.documentElement.scrollTop or document.body.scrollTop or window.pageYOffset
    pct       = 1.1 * scrollTop/height

    pct = Math.max pct, 0
    pct = Math.min pct, 1

    return if lastSet == pct
    background.css opacity: Math.round(10 * pct) / 10
    lastSet = pct

  $(document).on 'scroll', (e) ->
    setTimeout adjustBgOpacity
    unless scrollLogged
      window.analytics.trackEvent 'scroll', 'initial scroll'
      scrollLogged = true

  $(document).on 'touchmove', (e) ->
    touches = (e.originalEvent.touches ? e.originalEvent.changedTouches)
    return if touches.length != 1 or lastSet == 1
    adjustBgOpacity()


  adjustBgOpacity()
