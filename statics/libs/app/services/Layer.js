(function(window) {
	'use strict';

	/**
	 *	Layer
	 *
	 *	@param color int
	 **/
	function Layer( color )
	{
		this.color = color;
		this.shape = new createjs.Shape();
		this.list = [];
		// this.shape.shadow = new createjs.Shadow("rgba(0, 0, 0, .3)", 0, 0, 20);
	}

	/** 
	 *	Prototype
	 **/
	var p = Layer.prototype;

	/**
	 *	Return the display object
	 *	
	 *	@return DisplayObject
	 **/
	p.getDisplayObject = function()
	{
		return this.shape;
	}

	/**
	 *	Define the utility methods
	 *
	 *	@param utils Utils
	 **/
	p.setUtils = function( utils )
	{
		this.utils = utils;
	}

	/**
	 *	Define the size of the layer
	 *
	 *	@param width Number
	 *	@param height Number
	 *	@return Layer
	 **/
	p.setSize = function( width, height )
	{
		this.width = width;
		this.height = height;
		this.compute();

		return this;
	}

	/**
	 *	Define the thickness
	 *		
	 *	@param value Number
	 *	@return Layer
	 **/
	p.setThickness = function( value )
	{
		this.thickness = value | 0;
		this.compute();

		return this;
	}

	/**
	 *	Define the amplitude
	 *
	 *	@param value {Number}
	 *	@return Layer
	 **/
	p.setAmplitude = function( value )
	{
		this.amplitude = value | 0;
		this.compute();

		return this;
	}

	/**
	 *	Define the frequency
	 *
	 *	@param value {Number}
	 *	@return Layer
	 **/
	p.setFrequency = function( value )
	{
		this.frequency = value;
		this.compute();

		return this;
	}

	/**
	 *	Compute the values
	 *
	 *	@return Layer
	 **/
	p.compute = function()
	{
		var length = (this.width / this.thickness) | 0
		var i = -1;
		var r, x, y, h;

		var phase = this.utils.range(0, 1000); // phase angle
		var originx = 0;
		var originy = 0;
		var n;

		while( i++ < length )
		{
			r = this.list[i];
			x = i * this.thickness;
			y = Math.sin(this.frequency * (x + phase)) * this.amplitude + originy;
			h = this.height + y;
			if ( i & 1 )
				h -= this.utils.range(this.thickness>>1, this.thickness<<1);

			// creation
			if (!r)
			{
				r = new createjs.Rectangle(x, 0, this.thickness, 0);
				this.list.push( r );	
			}

			TweenMax.killTweensOf(r);
			TweenMax.to( 
				r, 
				this.utils.range(.5, 4), 
				{
					width: this.thickness, 
					height: h, 
					ease: Strong.easeInOut
				}
			);

			r.x = x;
		}

		// hide the rest
		length = this.list.length - length;
		while (i++ < length )
		{
			TweenMax.to(
				this.list[i],
				.3,
				{
					width: this.thickness,
					height: 0,
					ease: Strong.easeInOut
				}
			)
		}

		return this;
	}

	/**
	 *	Draw the layer
	 *
	 *	@return Layer
	 **/
	p.draw = function()
	{
		this.shape.graphics.clear();

		var n = this.list.length;
		var r;
		var a;
		while (n--)
		{
			r = this.list[n];
			a = this.thickness>>1;

			if ( n & 1 )
			{
				this.shape.graphics
									.beginFill( this.color )
									.moveTo( r.x, r.y )
									.lineTo( r.x, r.y + r.height)
									.arc( r.x + a, r.height, a+1, Math.PI, 0)
									.lineTo( r.x+this.thickness, r.y )
									.lineTo( r.x, r.y )
									.endFill()
				;
			}
			else
			{

				this.shape.graphics
									.beginFill( this.color )
									.moveTo( r.x, r.y )
									.lineTo( r.x, r.y + r.height)
									.arc( r.x+a, r.height, a, 0, Math.PI)
									.lineTo( r.x + this.thickness, r.y + r.height )
									.lineTo( r.x + this.thickness, r.y )
									.endFill()
									.closePath()
				;

			}

		}

		return this;
	}

	

	window.Layer = Layer;
})(window);