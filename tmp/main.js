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
