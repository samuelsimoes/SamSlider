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
    options = $.extend({
      previousButtonSelector: ".previous-btn",
      nextButtonSelector: ".next-btn",
      auto: true,
      speed: 2000,
      pagination: true,
      paginationContainerSelector: ".pagination-ctn",
      circular: true,
      slidesContainerSelector: ".slides",
      slideSelector: "li"
    }, options);

    var $container = $(this),
        $nextButton = $container.find(options.nextButtonSelector),
        $previousButton = $container.find(options.previousButtonSelector),
        $paginationContainer = $container.find(options.paginationContainerSelector),
        $slidesContainer = $container.find(options.slidesContainerSelector),
        $slides = $slidesContainer.children(options.slideSelector);

    var transitionStrategy = new SamSlider.FadeTransition($slidesContainer, $slides);

    var controller =
      new SamSlider.Controller(
            transitionStrategy,
            $slides.length,
            { circular: options.circular });

    var carouselInterval,
        showingSlideEventName = "sam-slider:showing-slider",
        showSlideEventName = "sam-slider:show-slide";

    var stopCarousel = function () {
      if (!options.auto) { return; }
      clearInterval(carouselInterval);
    };

    var startCarousel = function () {
      if (!options.auto) { return; }
      carouselInterval = setInterval(goToNextSlide, options.speed);
    };

    var restartCarousel = function () {
      stopCarousel();
      startCarousel();
    };

    var markTheActiveItemInPagination = function (index) {
      var links = $paginationContainer.find("a");

      links.removeClass("active");
      links.eq(index).addClass("active");
    };

    var attachControlsEvents = function () {
      $nextButton.on("click", function (evt) {
        evt.preventDefault();
        goToNextSlide();
      });

      $previousButton.on("click", function (evt) {
        evt.preventDefault();
        goToPreviousSlide();
      });
    };

    var buildPagination = function () {
      if (!options.pagination) { return; }

      $slides.each(function(i) {
        $paginationContainer.append("<a href=\"javascript:void(0)\">"+ (i + 1) + "</a>");
      });

      $paginationContainer.on("click", "a", function () {
        showSlide($(this).index());
      });
    };

    var goToNextSlide = function () {
      controller.showNextNode();
      $container.trigger(showingSlideEventName, controller.visibleNodeIndex);
    };

    var goToPreviousSlide = function () {
      controller.showPreviousNode();
      $container.trigger(showingSlideEventName, controller.visibleNodeIndex);
    };

    var showSlide = function (index) {
      controller.showNode(index);
      $container.trigger(showingSlideEventName, index);
    };

    $container.on(showingSlideEventName, function (evt, slideIndex) {
      markTheActiveItemInPagination(slideIndex);
      restartCarousel();
    });

    $container.on(showSlideEventName, function (evt, slideIndex) {
      showSlide(slideIndex);
    });

    $slides.mouseenter(stopCarousel).mouseleave(startCarousel);

    attachControlsEvents();

    buildPagination();

    showSlide(0);

    return $container;
  };
})(jQuery);
