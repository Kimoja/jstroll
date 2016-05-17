# stroll.js
Scroll.js is a small jQuery plugin to quickly create animations via the scroll of the mouse (parallax).

## Animation options
- duration [Number=1500] The duration of the animation
- frameRate [Number=1] Frame peer second
- container [jQuery=$(window)] The scrolling container
- velocity [Number=1] Coefficient to be applied to the initial scrolling
- on [Function] The callback called at the beginning of the scroll
- off [Function] The callback called on the end of the scroll
- scroll [Function] The callback invoked on the change scroll, but when the animation is not completed
- resize [Function] The callback called when the size of the window change
- loop [Function] The callback called every interval
- interpolation [Function] The interpolation function of the time remaining to animate
- fx [Object|Function<Layer>] The transformation function or animated object (see fx)

## Fx options
- origin [Function<HTMLElement>] The function to retrieve the original value of the property to animate
- init [Function<Layer>] The initialization function of the element
- current [Function<Layer] The transform function

## Layer options
- el [HTMLElement] The html element
- velocity [Number] 
- origin  [Number] 
- current [Number] The current camputed value, correspond to the addition aof the origin value more the interpolated state of du défilement 
- last [Number] The lasted computed value
- anim [Animation] The Animation object
- fx [Fx] The Fx object

### Additional Animation property
- interval [Number] The index of the current interval
- frames [Number] The number of frame
- startTime [Number] 
- endTime [Number] 
- currentTime [Number] 
- scrollPos [Number] The current scrolling position
- state [Number]  The interpolated state (0 >= <= 1)

## Example
```html
<!DOCTYPE html>
<html>
    <head>
        <script src="https://code.jquery.com/jquery-2.2.3.min.js"  integrity="sha256-a23g1Nt4dtEYOj7bR+vTu7+T8VP13humZFBJNIYoEJo="   crossorigin="anonymous"></script>
        <script src="../dist/stroll.js"></script>
        
        <style>
        body {
            height : 300vh;
        }

        .layer {
            position : fixed;
            height : 100vh;
            line-height: 100vh;
            width : 100%;
            text-align : center;
            font-size : 25px;
        }
        </style>
        
        <script>
            $(function () {
                $('.layer').stroll({
                    fx : [function(layer, anim){
                        layer.el.css('font-size', (layer.current / 100) + 25 + "px");
                    }]
                });
            });
        </script>
    </head>
    <body>
        <div class="layer">
            STROLL !!!! HELLO WORLD 
        </div>
    </body>
</html>
```
