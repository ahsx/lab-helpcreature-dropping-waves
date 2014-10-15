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

		return this;
	}

	/**
	 *	Compute the values
	 *
	 *	@return Layer
	 **/
	p.compute = function()
	{
		this.list = [];

		var length = (this.width / this.thickness) | 0
		var i = -1;
		var r, x, y, h;

		var phase = this.utils.range(0, 1000); // phase angle
		var originx = 0;
		var originy = 0;
		var n;

		while( i++ < length )
		{
			x = i * this.thickness;
			y = Math.sin(this.frequency * (x + phase)) * this.amplitude + originy;
			h = this.height + y;

			r = new createjs.Rectangle(x, 0, this.thickness, h);
			this.list.push( r );
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
		console.log('draw', this.thickness);
		this.shape.graphics.clear();

		var n = this.list.length;
		var r;
		var a;
		var o = this.thickness;
		while (n--)
		{
			r = this.list[n];
			a = this.thickness>>1;

			if ( n & 1 )
			{
				this.shape.graphics
									.beginFill( this.color )
									.moveTo( r.x, r.y )
									.lineTo( r.x, r.y + r.height-o)
									.arc( r.x + a, r.height-o, a+1, Math.PI, 0)
									.lineTo( r.x+this.thickness, r.y )
									.lineTo( r.x, r.y )
									.endFill()
				;
			}
			else
			{

				this.shape.graphics
									.beginFill( this.color )
									// .beginStroke('#f00')
									.moveTo( r.x, r.y )
									.lineTo( r.x, r.y + r.height)
									.arc( r.x+a, r.height, a, 0, Math.PI)
									.lineTo( r.x + this.thickness, r.y + r.height )
									.lineTo( r.x + this.thickness, r.y )
									// .endStroke()
									.endFill()
									.closePath()
				;

			}

		}

		return this;
	}

	

	window.Layer = Layer;
})(window);