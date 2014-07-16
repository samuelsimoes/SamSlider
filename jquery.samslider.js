/*
 * jQuery SamSlider v2.0.0
 * https://github.com/samuelsimoes/SamSlider
 */

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

SamSlider.SlideTransition = function(rootNode, childrenNodes) {
  this.nodes = childrenNodes;
  this.nodeWidth = childrenNodes.first().width();
  this.rootNode = rootNode;
  this.markupSetup();
};

SamSlider.SlideTransition.prototype = {
  markupSetup: function () {
    // Wrap all nodes in a single node which will be movemented
    this.slideNode =
      $("<div>").
        html(this.nodes).
        css("position", "absolute").
        width(this.nodeWidth * this.nodes.length);

    this.rootNode.html(this.slideNode);

    // All nodes in a single line inside the root node
    this.nodes.css("display", "inline-block");
  },

  showNode: function (options) {
    var xPosition = -(options.nodeToShowIndex * this.nodeWidth);
    this.slideNode.animate({
      left: xPosition
    });
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
      interval: 2000,
      pagination: true,
      paginationContainerSelector: ".pagination-ctn",
      circular: true,
      slidesContainerSelector: ".slides",
      slideSelector: ".slide",
      effect: "slide"
    }, options);

    var $container = $(this),
        $nextButton = $container.find(options.nextButtonSelector),
        $previousButton = $container.find(options.previousButtonSelector),
        $paginationContainer = $container.find(options.paginationContainerSelector),
        $slidesContainer = $container.find(options.slidesContainerSelector),
        $slides = $slidesContainer.children(options.slideSelector);

    var transitionStrategyFactory = function () {
      var strategy;

      if (options.customTransitionStrategy) {
        strategy = options.customTransitionStrategy;
      } else if (options.effect == "fade") {
        strategy = SamSlider.FadeTransition;
      } else if (options.effect == "slide") {
        strategy = SamSlider.SlideTransition;
      }

      return new strategy($slidesContainer, $slides);
    };

    var transitionStrategy = transitionStrategyFactory();

    var controller =
      new SamSlider.Controller(
            transitionStrategy,
            $slides.length,
            { circular: options.circular });

    var carouselInterval,
        showingSlideEventName = "sam-slider:showing-slider",
        showSlideEventName = "sam-slider:show-slide",
        nextSlideEventName = "sam-slider:next-slide",
        previousSlideEventName = "sam-slider:previous-slide";

    var stopCarousel = function () {
      if (!options.auto) { return; }
      clearInterval(carouselInterval);
    };

    var startCarousel = function () {
      if (!options.auto) { return; }
      carouselInterval = setInterval(goToNextSlide, options.interval);
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

    // Listen external triggers
    $container.on(showSlideEventName, function (evt, slideIndex) {
      showSlide(slideIndex);
    });
    $container.on(nextSlideEventName, goToNextSlide);
    $container.on(previousSlideEventName, goToPreviousSlide);

    $slides.mouseenter(stopCarousel).mouseleave(startCarousel);

    attachControlsEvents();

    buildPagination();

    showSlide(0);

    return $container;
  };
})(jQuery);
