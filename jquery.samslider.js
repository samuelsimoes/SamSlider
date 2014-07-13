(function($){
  $.fn.samSlider = function( options ) {

    var config = $.extend( {
      previousButton: '.previous-btn',
      nextButton: '.next-btn',
      auto: true,
      speed: 2000,
      pagination: true,
      paginationContainer: '.pagination-ctn',
      circular: true,
      slidesContainer: '.slides',
      slideSelector: 'li',
      onChangeHook: function(index) {}
    }, options );

    var $container = $(this);
    var $nextButton = $container.find(config.nextButton);
    var $previousButton = $container.find(config.previousButton);
    var $paginationContainer = $container.find(config.paginationContainer);
    var $slidesContainer = $container.find(config.slidesContainer);
    var $slides = $slidesContainer.children(config.slideSelector);

    var SliderModule = (function() {
      // Module
      var m = {};

      m.init = function() {
        m.showItem(0);
        buildPagination();
        attachControlsClickHandler();

        if(config.auto) carousel();

        return m;
      };

      m.goToNextSlide = function() {

        var $visibleItemIndex = m.visibleSlide.index();
        var $nextSlide = $slides.eq($visibleItemIndex+1);

        if($nextSlide.length > 0)
          m.showItem($visibleItemIndex+1);
        else if (config.circular && $nextSlide.length == 0)
          m.showItem(0);

        if(config.auto) startCarousel();
      };

      m.goToPreviousSlide = function() {
        var $visibleItemIndex = m.visibleSlide.index();
        var $previousSlide = $slides.eq($visibleItemIndex-1);

        m.showItem($previousSlide.index());

        if(config.auto) startCarousel();
      };

      m.showItem = function (slideIndex) {
        var $visibleSlide = $slides.filter(':visible');

        if($visibleSlide.index() != slideIndex) {

          $visibleSlide.fadeOut(250);
          $slides.eq(slideIndex).delay(250).fadeIn(500);

          m.visibleSlide = $slides.eq(slideIndex);

          $paginationContainer.find(config.slideSelector+'.active').removeClass('active');
          $paginationContainer.find(config.slideSelector+':eq('+slideIndex+')').addClass('active');

          if(config.auto) startCarousel();

          config.onChangeHook(slideIndex);
        }
      };

      var buildPagination = function() {
        if(!config.pagination) return;

        $paginationContainer.html('<ul></ul>');

        var $pagination = $paginationContainer.find('ul');

        $slides.each( function(i) {
          $pagination.append('<li><a href="#">'+(i+1)+'</a></li>');
        });

        $pagination.find('li:eq(0)').addClass('active');

        attachPaginationClickHandler();
      };

      var attachPaginationClickHandler = function() {
        $paginationContainer.on('click', 'a', function() {
          var $pageCtn = $(this).parents('li');

          m.showItem($pageCtn.index());

          return false;
        });
      };

      var attachControlsClickHandler = function() {
        $nextButton.on('click', function() {
          m.goToNextSlide();
          return false;
        });

        $previousButton.on('click', function() {
          m.goToPreviousSlide();
          return false;
        });
      };

      var carousel =  function() {
        $slides
          .mouseenter(function(){ clearInterval(m.carouselRotator); })
          .mouseleave(startCarousel);

        startCarousel();
      };

      var startCarousel = function() {
        clearInterval(m.carouselRotator);

        m.carouselRotator = setInterval( function() {
          m.goToNextSlide();
        }, config.speed);
      };

      return m.init();
    })();

    return {
      goToNextSlide: function() {
        SliderModule.goToNextSlide();
      },
        goToPreviousSlide: function() {
          SliderModule.goToPreviousSlide();
        },
        goToSlide: function(slideIndex) {
          SliderModule.showItem(slideIndex);
        }
    };
  }
})(jQuery);
