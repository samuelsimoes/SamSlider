SamSlider = {};

SamSlider.FadeTransition = function(rootNode, childrenNodes) {
  this.nodes = childrenNodes;
};

SamSlider.FadeTransition.prototype = {
  showNode: function (options) {
    var nodeToShow = this.nodes.eq(options.nodeToShowIndex);

    if (typeof options.visibleNodeIndex != "undefined") {
      this.nodes.eq(options.visibleNodeIndex).fadeOut(250);
    }

    nodeToShow.delay(250).fadeIn(500);
  }
};

SamSlider.Controller = function(transitionStrategy, nodesQuantity, options) {
  $.extend(this, {
    options: (options || {}),
    transitionStrategy: transitionStrategy,
    nodesQuantity: nodesQuantity
  });
};

SamSlider.Controller.prototype = {
  showPreviousNode: function () {
    var previousNodeIndex = (this.visibleNodeIndex - 1),
        isFirstSlide = (previousNodeIndex < 0);

    if (isFirstSlide) {
      if (this.options.circular) {
        previousNodeIndex = (this.nodesQuantity - 1);
      } else {
        return;
      }
    }

    this.transitionStrategy.showNode({
      nodeToShowIndex: previousNodeIndex,
      visibleNodeIndex: this.visibleNodeIndex
    });

    this.visibleNodeIndex = previousNodeIndex;
  },

  showNextNode: function () {
    var nextNodeIndex = (this.visibleNodeIndex + 1),
        isLastSlide = (nextNodeIndex == this.nodesQuantity);

    if (isLastSlide) {
      if (this.options.circular) {
        nextNodeIndex = 0;
      } else {
        return;
      }
    }

    this.transitionStrategy.showNode({
      nodeToShowIndex: nextNodeIndex,
      visibleNodeIndex: this.visibleNodeIndex
    });

    this.visibleNodeIndex = nextNodeIndex;
  },

  showNode: function (index) {
    if (index == this.visibleNodeIndex) { return; }

    this.transitionStrategy.showNode({
      nodeToShowIndex: index,
      visibleNodeIndex: this.visibleNodeIndex
    });

    this.visibleNodeIndex = index;
  }
};

(function($){
  $.fn.samSlider = function(options) {
    var config = $.extend( {
      previousButton: ".previous-btn",
      nextButton: ".next-btn",
      auto: true,
      speed: 2000,
      pagination: true,
      paginationContainer: ".pagination-ctn",
      circular: true,
      slidesContainer: ".slides",
      slideSelector: "li",
      onChangeHook: function(index) {}
    }, options);

    var $container = $(this),
        $nextButton = $container.find(config.nextButton),
        $previousButton = $container.find(config.previousButton),
        $paginationContainer = $container.find(config.paginationContainer),
        $slidesContainer = $container.find(config.slidesContainer),
        $slides = $slidesContainer.children(config.slideSelector);

    var SliderModule = (function() {
      // Module
      var m = {};

      m.init = function() {
        var transitionStrategy = new SamSlider.FadeTransition($slidesContainer, $slides);
        m.controller =
          new SamSlider.Controller(transitionStrategy, $slides.length, { circular: options.circular });

        m.showItem(0);
        buildPagination();
        attachControlsClickHandler();

        if(config.auto) { carousel(); }

        return m;
      };

      m.goToNextSlide = function() {
        m.controller.showNextNode();
        if (config.auto) { startCarousel(); }
      };

      m.goToPreviousSlide = function() {
        m.controller.showPreviousNode();
        if (config.auto) { startCarousel(); }
      };

      m.showItem = function (slideIndex) {
        m.controller.showNode(slideIndex);
      };

      var buildPagination = function() {
        if(!config.pagination) return;

        $paginationContainer.html("<ul></ul>");

        var $pagination = $paginationContainer.find("ul");

        $slides.each( function(i) {
          $pagination.append("<li><a href=\"#\">"+(i+1)+"</a></li>");
        });

        $pagination.find("li:eq(0)").addClass("active");

        attachPaginationClickHandler();
      };

      var attachPaginationClickHandler = function() {
        $paginationContainer.on("click", "a", function() {
          var $pageCtn = $(this).parents("li");

          m.showItem($pageCtn.index());

          return false;
        });
      };

      var attachControlsClickHandler = function() {
        $nextButton.on("click", function() {
          m.goToNextSlide();
          return false;
        });

        $previousButton.on("click", function() {
          m.goToPreviousSlide();
          return false;
        });
      };

      var carousel =  function() {
        $slides.
          mouseenter(function(){ clearInterval(m.carouselRotator); }).
          mouseleave(startCarousel);

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
  };
})(jQuery);
