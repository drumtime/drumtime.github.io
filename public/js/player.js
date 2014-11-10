(function(){var callbacks,ytApi;callbacks=[];ytApi=$("<script>");ytApi.attr("src","//www.youtube.com/iframe_api");$("script").parent().append(ytApi);this.onYouTubeIframeAPIReady=function(){var callback,_i,_len,_results;_results=[];for(_i=0,_len=callbacks.length;_i<_len;_i++){callback=callbacks[_i];_results.push(callback())}return _results};this.Player=function(domEl,videoId,options){var Slider,api,controls,destroy,exitFullscreenButton,fullscreen,fullscreenButton,init,newYTPlayer,onFullscreenChange,onPlayerStateChange,onScrubberChange,onVolumeSliderChange,pauseButton,play,playButton,playbackPct,player,playerEl,playerReady,playing,quality,scrubber,scrubberEl,startUpdating,stopUpdating,thumbnailUrl,updateInterval,updateTimer,volume,volumeEl,volumeSlider;domEl=$(domEl);options=$.extend({videoId:videoId,cropX:0,cropY:0,playerVars:{html5:1,modestbranding:1,showinfo:0,wmode:"transparent",controls:0,iv_load_policy:3,hd:1,rel:0}},options!=null?options:{});domEl.html("    <div class='yt-player'></div>    <div class='controls'>      <div class='play'></div>      <div class='pause'></div>      <div class='goFullscreen'></div>      <div class='exitFullscreen'></div>      <div class='scrubber slider'>        <div class='track'>          <div class='progress'></div>        </div>        <div class='knob'></div>      </div>      <div class='volume slider'>        <div class='track'>          <div class='progress'></div>        </div>        <div class='knob'>      </div></div>    </div>  ");controls=domEl.find(".controls");playerEl=domEl.find(".yt-player");playButton=controls.find(".play");fullscreenButton=controls.find(".goFullscreen");exitFullscreenButton=controls.find(".exitFullscreen");pauseButton=controls.find(".pause");scrubberEl=controls.find(".scrubber");volumeEl=controls.find(".volume");player=null;scrubber=null;volumeSlider=null;play=false;playing=false;destroy=false;volume=null;quality=null;fullscreen=false;api={};updateTimer=null;updateInterval=50;newYTPlayer=function(){return new YT.Player(playerEl[0],$.extend({events:{onReady:playerReady,onStateChange:onPlayerStateChange}},options))};init=function(){domEl.css({"background-image":"url("+thumbnailUrl()+")"});api.resize(options.width,options.height);setTimeout(function(){scrubber=Slider(scrubberEl,onScrubberChange);volumeSlider=Slider(volumeEl,onVolumeSliderChange);return onFullscreenChange()});return newYTPlayer()};playerReady=function(event){var name,prop,_ref;player=event.target;if(destroy){player.destroy();return}playerEl=domEl.find(".yt-player");if(volume==null){volume=player.getVolume()}api.setVolume(volume);if(quality){api.setPlaybackQuality(quality)}for(name in player){prop=player[name];if((_ref=api[name])==null){api[name]=prop}}if(play){player.playVideo()}play=false;return typeof callback==="function"?callback(player):void 0};onScrubberChange=function(pct,released){if(released==null){released=false}if(!player){return}return setTimeout(function(){return player.seekTo(pct.x*player.getDuration(),released)})};onVolumeSliderChange=function(pct,released){if(released==null){released=false}if(!player){return}return player.setVolume(pct.x*100)};api.resize=function(width,height){domEl.css({width:width-options.cropX,height:height-options.cropY});playerEl.css({width:width,height:height});playerEl.attr("width",width).attr("height",height);return domEl.blur};api.goFullscreen=function(){var _base,_base1,_base2;if(fullscreen){return}if(typeof(_base=domEl[0]).requestFullscreen==="function"){_base.requestFullscreen()}if(typeof(_base1=domEl[0]).webkitRequestFullscreen==="function"){_base1.webkitRequestFullscreen()}return typeof(_base2=domEl[0]).mozRequestFullScreen==="function"?_base2.mozRequestFullScreen():void 0};api.exitFullscreen=function(){if(!fullscreen){return}if(typeof document.cancelFullscreen==="function"){document.cancelFullscreen()}if(typeof document.webkitCancelFullScreen==="function"){document.webkitCancelFullScreen()}return typeof document.mozCancelFullScreen==="function"?document.mozCancelFullScreen():void 0};onFullscreenChange=function(){if(fullscreen){domEl.addClass("fullscreen");api.resize(window.screen.width,window.screen.height);fullscreenButton.hide();exitFullscreenButton.show();return setTimeout(function(){volumeSlider.refresh();return scrubber.refresh()})}else{domEl.removeClass("fullscreen");api.resize(options.width,options.height);fullscreenButton.show();exitFullscreenButton.hide();return setTimeout(function(){volumeSlider.refresh();return scrubber.refresh()})}};$(document).on("fullscreenchange",function(){fullscreen=document.fullscreenElement!=null;return onFullscreenChange()});$(document).on("mozfullscreenchange",function(){fullscreen=document.mozFullScreenElement!=null;return onFullscreenChange()});$(document).on("webkitfullscreenchange",function(){fullscreen=document.webkitFullscreenElement!=null;return onFullscreenChange()});api.isFullscreen=function(){return fullscreen};api.playVideo=function(){if(player){return player.playVideo()}else{domEl.addClass("buffering");return play=true}};api.pauseVideo=function(){if(player){return player.pauseVideo()}else{domEl.removeClass("buffering");return play=false}};api.togglePlay=function(){if(playing){return api.pauseVideo()}else{return api.playVideo()}};api.destroy=function(){destroy=true;if(player){player.destroy()}domEl.removeClass("paused");domEl.removeClass("playing");return domEl.removeClass("buffering")};api.setVolume=function(volumePct){if(volumePct<0||volumePct>100){return}volume=volumePct;if(player!=null){player.setVolume(volume)}if(volumeSlider!=null){return volumeSlider.moveTo(volume/100)}};api.setPlaybackQuality=function(suggestedQuality){quality=suggestedQuality;if(player!=null){return player.setPlaybackQuality(suggestedQuality)}};playbackPct=function(){if(!player){return}return player.getCurrentTime()/player.getDuration()};startUpdating=function(){return updateTimer=setInterval(function(){return scrubber.moveTo(playbackPct())},updateInterval)};stopUpdating=function(){if(updateTimer){return clearInterval(updateTimer)}};onPlayerStateChange=function(event){switch(event.data){case YT.PlayerState.PLAYING:playing=true;domEl.addClass("playing");domEl.removeClass("paused").removeClass("buffering");scrubber.moveTo(playbackPct());return startUpdating();case YT.PlayerState.BUFFERING:return domEl.addClass("buffering");case YT.PlayerState.PAUSED:playing=false;domEl.removeClass("playing").removeClass("buffering");domEl.addClass("paused");stopUpdating();return scrubber.moveTo(playbackPct());case YT.PlayerState.ENDED:playing=false;domEl.removeClass("playing").removeClass("buffering").removeClass("paused");stopUpdating();return scrubber.moveTo(1)}};thumbnailUrl=function(){var _ref;return(_ref=options.thumbnailUrl)!=null?_ref:"http://img.youtube.com/vi/"+videoId+"/0.jpg"};playButton.on("click",function(){return api.playVideo()});pauseButton.on("click",function(){return api.pauseVideo()});fullscreenButton.on("click",function(){return api.goFullscreen()});exitFullscreenButton.on("click",function(){return api.exitFullscreen()});Slider=function(domEl,callback,options){var constrain,currentPos,dragging,endDrag,knob,knobHeight,knobWidth,maxX,maxY,minX,minY,moveTo,positionPct,progressBar,render,startDrag,startPoint,startPos,track,trackClicked,trackRect,updateDrag,_ref,_ref1;if(options==null){options={}}track=domEl.find(".track");knob=domEl.find(".knob");progressBar=domEl.find(".progress");startPoint=null;startPos=null;currentPos={x:0,y:0};dragging=false;if((_ref=options.dragX)==null){options.dragX=true}if((_ref1=options.dragY)==null){options.dragY=false}trackRect=null;knobWidth=null;knobHeight=null;maxX=maxY=minX=minY=null;init=function(){trackRect=track.offset();trackRect.width=track.width();trackRect.height=track.height();knobWidth=knob.outerWidth();knobHeight=knob.outerHeight();minX=0;maxX=trackRect.width;minY=0;return maxY=trackRect.height};constrain=function(value,dimension){if(dimension==="x"){return Math.max(minX,Math.min(maxX,value))}else if(dimension==="y"){return Math.max(minY,Math.min(maxY,value))}};startDrag=function(e){if(e.which!==1){return}startPoint={x:e.pageX,y:e.pageY};startPos={x:parseInt(knob.css("left")),y:parseInt(knob.css("top"))};if(isNaN(startPos.x)){startPos.x=0}if(isNaN(startPos.y)){startPos.y=0}currentPos=$.extend({},startPos);dragging=true;$(document).on("mousemove",updateDrag);return $(document).on("mouseup",endDrag)};updateDrag=function(e){var x,y;if(options.dragX){x=e.pageX-startPoint.x;currentPos.x=constrain(startPos.x+x,"x")}if(options.dragY){y=constrain(e.pageY-startPoint.y,"y");currentPos.x=constrain(startPos.y+y,"y")}render();return callback(positionPct())};trackClicked=function(e){if(dragging){return}if(options.dragX){currentPos.x=e.pageX-trackRect.left}if(options.dragY){currentPos.y=e.pageY-trackRect.top}render();return callback(positionPct(),true)};endDrag=function(e){$(document).off("mousemove",updateDrag);$(document).off("mouseup",endDrag);callback(positionPct(),true);return setTimeout(function(){return dragging=false},200)};positionPct=function(){return{x:currentPos.x/(maxX-minX),y:currentPos.y/(maxY-minY)}};render=function(){var scale;scale={x:options.dragX?positionPct().x:1,y:options.dragY?positionPct().y:1};progressBar.css({webkitTransform:"scale("+scale.x+", "+scale.y+")"});progressBar.css({mozTransform:"scale("+scale.x+", "+scale.y+")"});progressBar.css({transform:"scale("+scale.x+", "+scale.y+")"});return knob.css({left:options.dragX?currentPos.x-knobWidth/2:null,top:options.dragY?currentPos.y-knobHeight/2:null})};moveTo=function(pct){if(dragging){return}if(options.dragX){currentPos.x=minX+pct*(maxX-minX)}if(options.dragY){currentPos.y=minY+pct*(maxY-minY)}return render()};init();knob.on("mousedown",startDrag);track.on("click",trackClicked);return{moveTo:moveTo,refresh:init}};if(typeof YT!=="undefined"&&YT!==null){init()}else{callbacks.push(init)}return api}}).call(this);