define(['jQuery'], function($) {
;(function ( $, window, document ) {

/*
* ----------------------------------------------------------------------------
* "THE BEER-WARE LICENSE" (Revision 42):
* michael.poschacher@gmail.com wrote this file. As long as you retain this 
* notice you can do whatever you want with this stuff. If we meet some day, 
* and you think this stuff is worth it, you can buy me a beer in return.
* Michael Poschacher
* ----------------------------------------------------------------------------
*/

  // defaults
  var pluginName = "loadicon",
      defaults = {
        size:          0.85,  // size of circle in percent of canvas height/width,
                              // depends on what is smaller... 1 = 100%
        amount:        10,    // number of circles
        circleSize:    0.5,
        fillColor:     "#ff0",
        strokeColor:   "#FFA200",
        tail:          0.75,  //taillength in percent... 1 = 100%
        speed:         75,
        shadowColor:   "#000",
        shadowOffsetX: 0,
        shadowOffsetY: 0,
        shadowBlur:    3,
        width:         undefined,
        height:        undefined,
        active:        0,
        // center of canvas
        center:        {x:undefined,y:undefined},
        // radius of "big" circles
        r:             undefined,
        // radius of each circle
        circle_size:   undefined
      };

  // Plugin constructor
  function Plugin( element, options ) {
    this.element = $(element);

    this.canvas = this.element[0].getContext("2d");

    // merge options with defaults, first {} needed cause we don't want to override defaults
    this.options = $.extend( {}, defaults, this.element.data(), options ) ;

    this._defaults = defaults;
    this._name = pluginName;
    // init
    this.init();
  }

  Plugin.prototype = {
    init: function () {
      if ( this.options.width == undefined ) {
        this.options.width = this.element.width();
      }

      if ( this.options.height == undefined ) {
        this.options.height = this.element.height();
      }

      // center of canvas
      if ( this.options.center.x == undefined ) {
        this.options.center.x = Math.floor( this.options.width/2 );
      }

      if ( this.options.center.y == undefined ) {
        this.options.center.y = Math.floor( this.options.height/2 );
      }

      // radius of "big" circles
      if ( this.options.r == undefined ) {
        if ( this.options.height > this.options.width ) {
          this.options.r = Math.floor( this.options.center.x*this.options.size );
        } else {
          this.options.r = Math.floor( this.options.center.y*this.options.size );
        }
      }

      if ( this.options.circle_size == undefined ) {
        this.options.circle_size = (2*Math.PI*this.options.r)/this.options.amount * this.options.circleSize/2;
      }

      this.Counter = 0;
      this.interval = null;
    },
    start: function() {
      var that = this;
      if ( this.Counter <= 0 ) {
        this.Counter = 0;
        this.interval = setInterval(function() { that.element.loadicon("redraw"); }, this.options.speed);
      }
      this.Counter++;
    },
    stop: function() {
      this.Counter--;
      if ( this.Counter <= 0 ) {
        this.Counter = 0;
        clearInterval( this.interval );
      }
    },
    redraw: function() {
      var canv = this.canvas;
      var opt = this.options;

      // reset canvas
      this.element[0].width = this.element[0].width;

      canv.fillStyle     = opt.fillColor;
      canv.strokeStyle   = opt.strokeColor;
      canv.shadowOffsetX = opt.shadowOffsetX;
      canv.shadowOffsetY = opt.shadowOffsetY;
      canv.shadowColor   = opt.shadowColor;
      canv.shadowBlur    = opt.shadowBlur;

      canv.translate( opt.center.x, opt.center.y );

      canv.rotate( ((2*Math.PI) / opt.amount)*opt.active );

      for ( var i = 0; i < (Math.floor(opt.amount*opt.tail)); i++ ) {
        canv.beginPath();
        canv.arc(-opt.r, 0, opt.circle_size, 0, 2*Math.PI, true);
        canv.closePath();

        canv.globalAlpha = i/(opt.amount-1);

        canv.stroke();
        canv.fill();
        canv.rotate( (2*Math.PI) / opt.amount);
      }
      opt.active = (opt.active >= opt.amount-1) ? 0 : opt.active+1;

    },
    active: function() {
      return (this.Counter >0) ? true : false;
    }
  }
  // wrap the plugin
  $.fn[pluginName] = function ( options ) {
    var args = arguments;

    // if undefined or object (literal) is given, treat it as initialization
    if ( options === undefined || typeof options === "object" ) {
      return this.each( function () {
        if ( !$.data(this, "plugin_" + pluginName) ) {
          $.data( this, "plugin_" + pluginName, new Plugin(this, options) );
        }
      });

    // else treat it as function call
    } else if ( typeof options === "string" && options[0] !== "_" && options !== "init") {
      // cause this.each returns an jQuery object, we have to store the return value
      var ret = null;

      this.each( function() {
        var data = $.data( this, "plugin_" + pluginName );

        if ( !data ) { 
          $.data( this, "plugin_" + pluginName, new Plugin(this, options) );
        }

        if ( data instanceof Plugin && typeof data[options] === 'function' ) {
          ret = data[options].apply( data, Array.prototype.slice.call( args, 1 ) );
        }
      });

      // if there is no return value, return jQuery object to preserve chaining
      if ( ret !== undefined ) {
        return ret;
      } else {
        return this;
      }
    }
  }

}($, window, document));
});