video = require('./video')
scrollHeader = require('./scrolling_header')

$ ->
  video.init()
  scrollHeader $('header')

  analytics.load()
  analytics.trackPageView window.location.href

  $('header #links a').on 'click', (e) ->
    analytics.trackEvent 'main menu', 'click', $(e.currentTarget).prop 'class'

  $(document).on 'click', (e) ->
    analytics.trackEvent 'click', e.target.nodeName, "##{e.target.id}.#{e.target.className}"


  $(document).on 'click', '.buy', ->
    setTimeout ->
      window.location = 'macappstore://itunes.apple.com/app/id570388126'
    , 50


  experimentSection = $('#experiment').parent()
  $('[href=#experiment]').on 'click', (e) ->
    e.preventDefault()

    top   = experimentSection.offset().top - 120
    $html = $(document.documentElement)

    $html.css transform: "translate(0, #{top}px)"
    document.body.scrollTop            = top
    document.documentElement.scrollTop = top

    removeTransforms = -> $html.css transition: '', transform: ''

    setTimeout ->
      $html.on 'transitionend', removeTransforms
      $html.on 'oTransitionEnd', removeTransforms
      $html.on 'webkitTransitionEnd', removeTransforms

      $html.css
        transition: 'all 600ms'
        transform: "translate(0, 0)"

