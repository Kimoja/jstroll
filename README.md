# jstroll.js
jstroll.js is a small jQuery plugin to quickly create animations with the scroll of the mouse (parallax).

## Animation options
- animate [Boolean=true] Create or not a scrolling animation
- duration [Number=1500] The duration of the animation
- frameRate [Number=1] Frame peer second
- container [jQuery=$(window)] The scrolling container
- velocity [Number=1] Coefficient to be applied to the initial scrolling
- on [Function] The callback called at the beginning of the scroll
- off [Function] The callback called on the end of the scroll
- scroll [Function] The callback invoked on the change scroll, but when the animation is not completed
- resize [Function] The callback called when the size of the window change
- loop [Function] The callback called every frame
- interpolation [Function] The interpolation function of the animation state
- fx [Object|Function<Layer>] The transformation function or animated object (see fx)

## Fx options
- origin [Function<HTMLElement>] The function to retrieve the original value of the property to animate
- init [Function<Layer>] The initialization function of the element
- current [Function<Layer] The transform function

## Layer options
- el [jQuery] The jquery element
- velocity [Number] Coefficient to be applied to the initial scrolling
- origin  [Number] the origin value of the element style attribute
- current [Number] The current computed value, corresponding to the addition of the origin value more the interpolated state of the scrolling 
- last [Number] The lasted computed value
- anim [Animation] The Animation object
- fx [Fx] The Fx object

### Additional Animation property
- interval [Number] The index of the current interval
- frames [Number] The number of frame
- startTime [Number] The date of the beginning of the animation
- endTime [Number] The end date of the animation
- currentTime [Number] The current date
- scrollPos [Number] The current scrolling position
- state [Number]  The interpolated state (0 >= ? <= 1)

## Example
```html
<!DOCTYPE html>
<html>
    <head>
        <script src="https://code.jquery.com/jquery-2.2.3.min.js"  integrity="sha256-a23g1Nt4dtEYOj7bR+vTu7+T8VP13humZFBJNIYoEJo="   crossorigin="anonymous"></script>
        <script src="../dist/jstroll.js"></script>
        
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
                $('.layer').jstroll({
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
