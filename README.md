#jQuery.samSlider

jQuery.samSlider is a lightweight (~191 LOC) jQuery plugin to help you create simple and flexible sliders with slide or fade effect (but you can create your custom slide transition strategy too) with pagination and next/previous button.

##How to use
To use SamSlider, you first need create the basic markup of your slider and add the basic CSS style.

```html
<div class="container" id="slider">
  <div class="slides">
    <img src="1.jpeg" class="slide" />
    <img src="2.jpeg" class="slide" />
  </div>

  <div class="pagination-ctn">
  </div>

  <div class="controls">
    <a href="#" class="previous-btn">
      Previous slide
    </a>
    <a href="#" class="next-btn">
      Next slide
    </a>
  </div>
</div>
```

```css
.container .slides,
.container .slide {
  width: 640px;
  height: 300px;
}

.container .slides {
  overflow: hidden;
  padding: 0px;
  margin: 0px;
  position: relative;
}
```

After this you need call the plugin:

```javascript
$("#slider").samSlider(options);
```

##Options
<table width="100%">
    <thead>
        <tr>
            <th width="30%">Option</th>
            <th>Description</th>
            <th>Default</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>previousButtonSelector, nextButtonSelector</td>
            <td>Previous/Next control buttons.</td>
            <td>.previous-btn, .next-btn</td>
        </tr>
        <tr>
            <td>auto</td>
            <td>Automatic slides change.</td>
            <td>true</td>
        </tr>
        <tr>
            <td>interval</td>
            <td>Slide wait interval in ms.</td>
            <td>2000</td>
        </tr>
        <tr>
            <td>pagination</td>
            <td>If you want generate the slides pagination control.</td>
            <td>true</td>
        </tr>
        <tr>
            <td>paginationContainerSelector</td>
            <td>The pagination container CSS selector.</td>
            <td>.pagination-ctn</td>
        </tr>
        <tr>
            <td>effect</td>
            <td>The slide transition effect.</td>
            <td>slide</td>
        </tr>
        <tr>
            <td>slidesContainerSelector</td>
            <td>The container CSS selector with the slides.</td>
            <td>.slides</td>
        </tr>
        <tr>
            <td>slideSelector</td>
            <td>The node CSS selector of a slide.</td>
            <td>.slide</td>
        </tr>
        <tr>
            <td>customTransitionStrategy</td>
            <td>Your custom slide transition strategy.</td>
            <td>--</td>
        </tr>
    </tbody>
</table>

##Events/Triggers
<table width="100%">
    <thead>
        <tr>
            <th width="30%">Event Name</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>
              sam-slider:showing-slider
            </td>
            <td>
              Triggered when a new slider is shown.
            </td>
        </tr>
        <tr>
            <td>
              sam-slider:show-slide
            </td>
            <td>
              Trigger to show an specific slide based in the index (starting with 0).
            </td>
        </tr>
        <tr>
            <td>
              sam-slider:next-slide,
              sam-slider:previous-slide
            </td>
            <td>
              Trigger to show the next/previous slide.
            </td>
        </tr>
    </tbody>
</table>

##Custom slide transition

You can create custom slide transition strategies and use in SamSlider, below an example, the default fade transition strategy of SamSlider.

```javascript
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
```

-----------------------------------------
**Samuel Simões ~ (@samuelsimoes)**
