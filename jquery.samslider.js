(function($){
	$.fn.samSlider = function(opcoes){
		return this.each(function() {

			var configuracao = $.extend( {
				botao_anterior: '.slider-btn-anterior',
				botao_proximo: '.slider-btn-proximo',
				auto: true,
				velocidade: 2000,
				paginacao: true,
				paginacao_ctn_class: '.slider-paginacao',
				carrossel: false,
				slides_ctn: '.slides'
			}, opcoes);

			var $container = $(this);
			var $botao_proximo = $container.find(configuracao.botao_proximo);
			var $botao_anterior = $container.find(configuracao.botao_anterior);
			var $ctn_paginacao = $container.find(configuracao.paginacao_ctn_class);
			var $slides_ctn = $container.find(configuracao.slides_ctn);
			var $slides = $slides_ctn.find('li');

			var Slider = {

				init: function()
				{
					Slider.mostrar_item(0);
					Slider.montar_paginacao();

					if(configuracao.auto) Slider.auto_carrossel();

					$botao_proximo.on('click', function(){
						Slider.ir_para_proximo(true);
						return false;
					});
					
					$botao_anterior.on('click', function(){
						Slider.ir_para_anterior(true);
						return false;
					});
				},

				montar_paginacao: function()
				{
					$ctn_paginacao.html('<ul></ul>');
					var $ul = $ctn_paginacao.find('ul');

					$slides.each(function(i){
						$ul.append('<li><a href="#">'+(i++)+'</a></li>');
					});

					$ul.find('li:eq(0)').addClass('ativo');

					Slider.manejar_paginacao_click();
				},

				manejar_paginacao_click: function()
				{
					$ctn_paginacao.on('click', 'a', function(){
						var $li = $(this).parents('li');
						Slider.mostrar_item($li.index());
						return false;
					});
				},

				mostrar_item: function(index)
				{
					var $slide_visivel = $slides.filter(':visible');

					//Se não for o item que já está visível faz as devidas mudanças
					if($slide_visivel.index() != index) {

						$slide_visivel.fadeOut(250);
						$slides.eq(index).delay(250).fadeIn(500);

						Slider.slide_visivel = $slides.eq(index);

						$ctn_paginacao.find('li.ativo').removeClass('ativo');
						$ctn_paginacao.find('li:eq('+index+')').addClass('ativo');
					}
				},

				/**
				 * Funções responsáveis por mostrar o próximo slide ou o anterior.
				 * 
				 * @param  {bool}  circular  Caso esteja no último ou primeiro slode
				 * faz o "retorno" para o primeiro ou último, respectivamente.
				 */
				ir_para_proximo: function(circular)
				{
					var $index_item_visivel = Slider.slide_visivel.index();
					var $proximo_item = $slides.eq($index_item_visivel+1);

					if($proximo_item.length > 0)
						Slider.mostrar_item($index_item_visivel+1);
					else if (circular && $proximo_item.length == 0)
						Slider.mostrar_item(0);
				},

				ir_para_anterior: function(circular)
				{
					var $index_item_visivel = Slider.slide_visivel.index();
					var $item_anterior = $slides.eq($index_item_visivel-1);

					if(circular)
						Slider.mostrar_item($index_item_visivel-1);
					else if (index_item_visivel != 0)
						Slider.mostrar_item($index_item_visivel-1);
				},

				auto_carrossel: function()
				{
					$botao_anterior.on('click', iniciar_carrossel);
					$botao_proximo.on('click', iniciar_carrossel);
					$ctn_paginacao.on('click', 'a', iniciar_carrossel);

					//Para o Slider quando o mouse passa pelo slider.
					$slides
						.mouseenter(function(){clearInterval(Slider.auto_carrossel_func)})
						.mouseleave(iniciar_carrossel);

					function iniciar_carrossel()
					{
						clearInterval(Slider.auto_carrossel_func);

						Slider.auto_carrossel_func = setInterval(function(){
							Slider.ir_para_proximo(true);
						}, configuracao.velocidade);
					}
					iniciar_carrossel();
				}
			}
			Slider.init();
		});
	}
})(jQuery);