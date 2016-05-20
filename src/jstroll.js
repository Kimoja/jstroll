(function ($) {
    
    var win = $(window);
    
    var animDefault = {
        //Create or not a scrolling animation
        animate : true,
        //The duration of the animation
        duration : 1500, 
        //Frame peer second
        frameRate : 1, 
        //The scrolling container
        container : win,
        //Coefficient to be applied to the initial scrolling
        velocity : 1,
        //The callback called at the beginning of the scroll
        on : null,
        //The callback called on the end of the scroll
        off : null, 
        //The callback invoked on the change scroll, but when the animation is not completed
        scroll : null,
        //The callback called when the size of the window change
        resize : null,
        //The callback called every frame
        loop : null,
        //The index of the current interval
        interval : 0,
        //The number of frame
        frames : 0,
        //The date of the beginning of the animation
        startTime : 0,
        //The end date of the animation
        endTime : 0,
        //The current date
        currentTime : 0,
        //The current scrolling position
        scrollPos :0,
        //The interpolated state (0 >= ? <= 1)
        state : 0,
        //The interpolation function of the animation state
        interpolation : function sinInterpolation(t) {
            return Math.sin(t * Math.PI / 2);
        },
        //The transformation function or animated object
        fx : [function(layer){
            layer.el.css('background-position-y', (layer.current - layer.anim.scrollPos) + 'px');
        }]
    };
    
    /**
     * The public function of the plugin
     * @param {Object} anim
     * @returns {jQuery}
     */
    $.fn.jstroll = function (anim) {
        
        //add default configuation to the anim object
        var key;
        if(!anim){
            anim = Object.create(animDefault);
        }
        else {
            for(key in animDefault){
                if(!(key in anim)) {
                    anim[key] = animDefault[key];
                }
            }
        }
        
        //an animation can have multiple effect
        if(!(anim.fx instanceof Array)) {
            anim.fx = [anim.fx];
        }
        
        //transforme function effect to object
        anim.fx = anim.fx.map(function(fx){
            return typeof fx === 'function' ? {current : fx} : fx;
        });
        
        //store jquery elements for all items in the current list
        anim.els = this.map(function(){return $(this);});
        
        //An array of array, create for each elements and for each effect an data object
        anim.layers = [];
        
        //fill the anim.layers array
        anim.els.each(function () {
            
            var el = this,
                fxs = [];
            $.each(anim.fx, function(){
                //retrieve the origin value of the element style attribute
                var origin = this.origin ? this.origin(el) : 0,
                    layer = {
                        //The jquery element
                        el : el,
                        //Coefficient to be applied to the initial scrolling
                        velocity : Number(el.data('jstroll-velocity')) || anim.velocity,
                        //the origin value of the element style attribute
                        origin : origin,
                        //The current computed value, corresponding to the addition of the origin value 
                        //more the interpolated state of the scrolling 
                        current : origin,
                        //The lasted computed value
                        last : 0,
                        //The Animation object
                        anim : anim,
                        //The Fx object
                        fx : this
                    };
                fxs.push(layer);
                if(this.init){
                    this.init(layer);
                }
            });
            anim.layers.push(fxs);
        });
        
        //add event listeners 
        win.resize(resize);
        anim.container.on('scroll', scroll);
        
        /**
         * Appliquer tous les effets de chacun des éléments de l'état actuel
         */
        function apply(){
            $.each(anim.layers, function () {
                $.each(this, function(){
                    this.current = Math.round(this.last + this.offset * anim.state);
                    this.fx.current(this);
                });
            });
        }
        
        /**
         * Function called every frame of the animation
         */
        function loop() {
            
            anim.currentTime = new Date().getTime();
            var off = anim.currentTime >= anim.endTime;
            
            //define the state of the amination
            if (off) {
                clearInterval(anim.interval);
                anim.interval = null;
                anim.state = 1;
            } else {
                anim.state = anim.interpolation((anim.currentTime - anim.startTime) / anim.frameRate / anim.frames);
            }
            
            //the loop callback
            if(anim.loop){
                anim.loop();
            }
            
            apply(off);
            
            //the off callback
            if(off && anim.off){
                anim.off();
            }
        }
        
        /**
         * The scrolling event listener
         * @param {Event} e
         */
        function scroll(e){
            
            //retrieve the current scrolling position
            anim.scrollPos = anim.container.scrollTop();
            
            //for each effect of each element, defined the last value 
            //and the offset between the last value and the value at the end of the animation end
            $.each(anim.layers, function () {
                $.each(this, function(){
                    this.last = this.current;
                    this.offset = (this.origin - this.last) + anim.scrollPos * this.velocity;
                    if(this.fx.scroll){
                        this.fx.scroll(this);
                    }
                });
            });
             
            //launch the animation or not
            if(anim.animate){
                
                anim.startTime = new Date().getTime();
                anim.endTime = anim.startTime + anim.duration;
                anim.frames = (anim.endTime - anim.startTime) / anim.frameRate;
                
                //don't create an new animation if one is already playing
                if (!anim.interval) {
                    //the on callback
                    if(anim.on){
                        anim.on();
                    }
                    anim.interval = setInterval(loop, anim.frameRate);
                }
                
                anim.state = 0;
                
            }
            else {
                anim.state = 1;
            }
            
            //the scroll callback
            if(anim.scrool){
                anim.scrool(e);
            }
            
            //apply the effects
            apply(anim.animate);
        }
        
        
        /**
         * The resize event listener
         * @param {Event} e
         */
        function resize(e){
            if(anim.resize){
                anim.resize(e);
            }
            $.each(anim.layers, function () {
                $.each(this, function(){
                    if(this.fx.resize){
                        this.fx.resize(this, e);
                    }
                });
            });
        }
        
        return this;
    };

}(jQuery));