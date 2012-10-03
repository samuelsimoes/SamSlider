#SamSlider

-----------------------------------------

SamSlider é um plugin desenvolvido com jQuery para criação de simples sliders fadein e fadeout, com botão para próximo, anterior e paginação.

O objetivo inicial era exercitar o Javascript daí o nome questionável do plugin, porém o resultado final ficou bem simples e leve, servindo a maioria das minhas necessidades.

##Uso

Para usar o SamSlider inclua a biblioteca jQuery no seu código, posteriormente adicione o seguinte código no seu HTML.

```html
<script type="text/javascript">
jQuery(document).ready(function($) {
    $('.slider-container').samSlider();
});
</script>
```

O SamSlider usa uma marcação HTML bem simples, onde você tem um container principal englobando uma lista e os itens da lista como os slides.

Abaixo um exemplo:

```html
<div class="slider-container">
    <ul class="slides">
        <li><img src="1.jpeg" /></li>
        <li><img src="2.jpeg" /></li>
        <li><strong>HTML</strong> se precisar.</li>
    </ul>
</div>
```

Abaixo o CSS necessário para o funcionamento básico.

```css
.slider-container {
    overflow: hidden;
}

.slider-container > ul,
.slider-container .slides > li {
    width: 960px; /* largura dos slides e do slider */
    height: 300px; /* altura dos slides e do slider */
}

.slider-container ul {
    overflow: hidden;
    padding: 0px;
    margin: 0px;
}

.slider-container .slides > li {
    list-style: none;
    display: none;
}
```

##Opções
<table width="100%">
    <thead>
        <tr>
            <th width="30%">Opção</th>
            <th>Descrição</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>botao_anterior, botao_proximo</td>
            <td>Seletor dos botões de anterior e próximo. Padrão: ".slider-btn-anterior", ".slider-btn-proximo".</td>
        </tr>
        <tr>
            <td>auto</td>
            <td>Se o slider vai trocar os slides automáticamente. Padrão: true.</td>
        </tr>
        <tr>
            <td>velocidade</td>
            <td>Velocidade da troca entre os slides em ms. Padrão: 2000.</td>
        </tr>
        <tr>
            <td>paginacao</td>
            <td>Se deseja gerar paginação dos slides. Padrão: true.</td>
        </tr>
        <tr>
            <td>paginacao_ctn_class</td>
            <td>Seletor do container onde a paginação vai ser gerada. Padrão: ".slider-paginacao".</td>
        </tr>
        <tr>
            <td>carrossel</td>
            <td>Se o slider vai retornar para o primeiro no caso do último ou vice-versa. Padrão: false.</td>
        </tr>
        <tr>
            <td>slides_ctn</td>
            <td>UL contentendo os slides. Padrão: ".slides".</td>
        </tr>
    </tbody>
</table>

-----------------------------------------
**Samuel Simões ~ (@samuelsimoes)**