# This a wrapper around the Google Analytics api which allows 
# us to use several trackers at the same time
unless window._gaq?
  window._gaq = [] # the google analytics command queue. Needs to be global
  window._gaq.push ['_gat._anonymizeIp'] # anonymize all ips

# the should only ever be one instance
window.analytics ?= do ->
  gaUrl      = (if document.location.protocol == 'https:' then 'https://ssl' else 'http://www') + '.google-analytics.com/ga.js'
  gaDebugUrl = gaUrl.replace('/ga.js', '/u/ga_debug.js') 
  gaQueue    =  -> window._gaq
  gaToken    = 'UA-42548053-1'
  trackers   = {}
  customVars = {} 

  # we want to have control over when to load the api.
  load = (debug = false) ->
    scriptEl       = document.createElement('script')
    scriptEl.src   = if debug then gaDebugUrl else gaUrl
    scriptEl.async = true
    $(document.head).append scriptEl

  addTracker = (name, token) ->
    trackers[name] ?= token
    gaQueue().push [prefix('_setAccount', name), token]

  prefix = (command, name) ->
    if name == 'publitas' then command else "#{name}.#{command}"

  push = (command, args...) ->
    gaQueue().push [prefix(command, name)].concat(args) for name, _ of trackers

  trackPageView = (url) ->
    if url? and url.length > 0
      push '_trackPageview', url
    else  
      push '_trackPageview'

  trackEvent =  ->
    push '_trackEvent', arguments...

  setSessionVar = (slot, name, value) ->
    push '_setCustomVar', slot, name, value, 2

  setVar = (slot, name, value) ->
    push '_setCustomVar', slot, name, value

  unsetVar = (slot) ->
    push '_deleteCustomVar', slot

  # initial setup
  addTracker 'drumtime', gaToken
 
  # api
  trackPageView: (url) -> trackPageView(url)
  trackEvent: trackEvent
  setSessionVar: setSessionVar
  setVar: setVar
  unsetVar: unsetVar
  addTracker: addTracker
  load: load