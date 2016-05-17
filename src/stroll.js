(function ($) {
    
    var win = $(window);
    
    var animDefault = {
        duration : 1500,
        frameRate : 1,
        container : win,
        velocity : 1,
        on : null,
        off : null,
        scroll : null,
        resize : null,
        loop : null,
        interval : 0,
        frames : 0,
        startTime : 0,
        endTime : 0,
        currentTime : 0,
        scrollPos :0,
        state : 0,
        interpolation : function sinInterpolation(t) {
            return Math.sin(t * Math.PI / 2);
        },
        fx : [function(layer, anim){
            layer.el.css('background-position-y', (layer.current - anim.scrollPos) + 'px');
        }]
    };
    
    $.fn.stroll = function (anim) {
        
        var key;
        if(!anim){
            anim = animDefault;
        }
        else {
            for(key in animDefault){
                if(!(key in anim)) {
                    anim[key] = animDefault[key];
                }
            }
        }
        
        if(!anim.fx) {
            anim.fx = $.fn.stroll.defaultFx;
        }
        
        if(!(anim.fx instanceof Array)) {
            anim.fx = [anim.fx];
        }
        
        anim.fx = anim.fx.map(function(fx){
            return typeof fx === 'function' ? {current : fx} : fx;
        });
        
        anim.els = this;
        anim.layers = [];

        anim.els.each(function () {
            var el = $(this),
                fxs = [];
            $.each(anim.fx, function(){
                var origin = this.origin ? this.origin(el) : 0,
                    layer = {
                        el : el,
                        velocity : Number(el.data('stroll-velocity')) || anim.velocity,
                        origin : origin,
                        current : origin,
                        last : 0,
                        anim : anim,
                        fx : this
                    };
                fxs.push(layer);
                if(this.init){
                    this.init(layer, el);
                }
            });
            anim.layers.push(fxs);
        });

        function loop() {
            
            anim.currentTime = new Date().getTime();
            var off = anim.currentTime > anim.endTime;
            
            if (off) {
                clearInterval(anim.interval);
                anim.interval = null;
                anim.state = 1;
            } else {
                anim.state = anim.interpolation((anim.currentTime - anim.startTime) / anim.frameRate / anim.frames);
            }
            
            if(anim.loop){
                anim.loop();
            }
            
            $.each(anim.layers, function () {
                $.each(this, function(){
                    this.current = Math.round(this.last + this.offset * anim.state);
                    this.fx.current(this, anim);
                });
            });
            
            if(off && anim.off){
                anim.off();
            }
        }
        
        win.resize(resize);
        anim.container.on('scroll', scroll);
        
        if(anim.init){
            anim.init();
        }
        
        function scroll(e){
            anim.startTime = new Date().getTime();
            anim.endTime = anim.startTime + anim.duration;
            anim.frames = (anim.endTime - anim.startTime) / anim.frameRate;
            anim.scrollPos = anim.container.scrollTop();
            
            $.each(anim.layers, function () {
                $.each(this, function(){
                    this.last = this.current;
                    this.offset = (this.origin - this.last) + anim.scrollPos * this.velocity;
                    if(this.fx.scroll){
                        this.fx.scroll(this);
                    }
                });
            });
            
            if (!anim.interval) {
                if(anim.on){
                    anim.on();
                }
                anim.interval = setInterval(loop, anim.frameRate);
            }
            
            loop();
            
            if(anim.scrool){
                anim.scrool(e);
            }
        }
        
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