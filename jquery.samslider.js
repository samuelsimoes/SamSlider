(function($){
	$.fn.samSlider = function( options ) {

		var config = $.extend( {
			previous_button: '.previous-btn',
			next_button: '.next-btn',
			auto: true,
			speed: 2000,
			pagination: true,
			pagination_container: '.pagination-ctn',
			circular: true,
			slides_container: '.slides',
			slide_selector: 'li'
		}, options );

		var $container = $(this);
		var $nextButton = $container.find(config.next_button);
		var $previousButton = $container.find(config.previous_button);
		var $paginationContainer = $container.find(config.pagination_container);
		var $slidesContainer = $container.find(config.slides_container);
		var $slides = $slidesContainer.children(config.slide_selector);

		var SliderModule = ( function() {
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
			};

			m.goToPreviousSlide = function() {

				var $visibleItemIndex = m.visibleSlide.index();
				var $previousSlide = $slides.eq($visibleItemIndex-1);

				m.showItem($previousSlide.index());

			};

			m.showItem = function (slide_index) {

				var $visibleSlide = $slides.filter(':visible');

				if($visibleSlide.index() != slide_index) {

					$visibleSlide.fadeOut(250);
					$slides.eq(slide_index).delay(250).fadeIn(500);

					m.visibleSlide = $slides.eq(slide_index);

					$paginationContainer.find('.active').removeClass('active');
					$paginationContainer.find(':eq('+slide_index+')').addClass('active');
				}
			};

			var buildPagination = function() {

				$paginationContainer.html('<ul></ul>');

				var $pagination = $paginationContainer.find('ul');

				$slides.each( function(i) {
					$pagination.append('<li><a href="#">'+(i++)+'</a></li>');
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

				$nextButton.on('click', startCarousel);
				$previousButton.on('click', startCarousel);
				$paginationContainer.on('click', 'a', startCarousel);

				//Para o Slider quando o mouse passa pelo slider.
				$slides
					.mouseenter(function(){ clearInterval(m.carouselRotator); })
					.mouseleave(startCarousel);

				function startCarousel()
				{
					clearInterval(m.carouselRotator);

					m.carouselRotator = setInterval( function() {
						m.goToNextSlide();
					}, config.speed );
				}

				startCarousel();
			}

			return m.init();
		})();
	}
})(jQuery);
