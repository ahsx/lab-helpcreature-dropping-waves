angular
	.module(APPNAME)
	.service('CanvasService', ['Utils', function(Utils)
	{
		/**
		 *	Colors used througout the app
		 **/
		this.darkPurple = "#563b8a";
		this.lightPurple = "#a5468f";
		this.pink = "#f17e93";
		this.red = "#eb3549";

		/**
		 *	Return the url of the image of the canvas
		 *
		 *	@return {String}
		 **/
		this.getURL = function()
		{
			return this.canvas[0].toDataURL('image/png').replace("image/png", "image/octet-stream");;
		};

		/**
		 *	Define the size of the canvas
		 *
		 *	@param width Number %
		 *	@param height Number %
		 **/	
		this.setSize = function( width, height )
		{
			if ( this.width == width && this.height == height )
				return;

			console.log('setSize: %sx%s', width, height);

			this.width = width;
			this.height = height;

			var offset = 70;
			this.pixelWidth = this.windowWidth * (width*.01) - offset;
			this.pixelHeight = this.windowHeight * (height*.01);

			// container
			this.container.css({
				width: "calc("+width+"% - "+offset+"px)",
				height: height +'%'
			});

			// canvas
			this.canvas.attr({
				width: this.pixelWidth,
				height: this.pixelHeight
			});

			// layers
			var n = this.layers.length;
			var m = this.layers.length;
			var h;
			while( n-- )
			{
				// amplitude 0 - 200
				// 4 layers => height / 4

				// h = (this.pixelHeight / 4 * n) + this.amplitude;
				h = (this.pixelHeight/(m+1))*(m-n) |0;
				console.log(this.layers[n].color, h);

				this.layers[n].setSize( this.pixelWidth, h );
			}

			// draw
			this.draw();
		};

		/** 
		 *	Define the thickness
		 *
		 *	@param value int
		 **/
		this.setThickness = function( value )
		{
			if ( this.thickness == value )
				return;

			this.thickness = value;
			var n = this.layers.length;
			while( n-- )
			{
				this.layers[n].setThickness( this.thickness );
			}

			this.draw();
		};

		/**
		 *	Define the amplitude
		 *
		 *	@param value Number
		 **/
		this.setAmplitude = function ( value )
		{
			if ( this.amplitude == value )
				return;

			this.amplitude = value;
			var n = this.layers.length;
			while( n-- )
			{
				this.layers[n].setAmplitude( value );
			}

			this.draw();
		};

		/** 
		 *	Define the frequency 
		 *
		 *	@param value {Number}
		 **/
		this.setFrequency = function( value )
		{
			if ( this.frequency == value )
				return;

			this.frequency = value;
			var n = this.layers.length;
			while( n-- )
			{
				this.layers[n].setFrequency( value );
			}

			this.draw();
		}

		/**
		 *	Init the canvas
		 *
		 *	@param canvas JQueryElement
		 *	@param container JQueryElement
		 *	@param value Window
		 **/
		this.init = function( canvas, container, window )
		{
			this.canvas = jQuery(canvas);
			this.context = canvas[0].getContext('2d');
			this.stage = new createjs.Stage( canvas[0] );
			createjs.Ticker.addEventListener("tick", onTickHandler.bind(this));

			this.container = container;

			this.window = jQuery(window).on('resize', onResizeHandler.bind(this));
			this.refresh();
			this.create();
		};

		/**
		 *	Refresh the value // on resize window
		 **/
		this.refresh = function()
		{
			this.windowWidth = this.window.width();
			this.windowHeight = this.window.height();
		};

		/** 
		 *	Create the objects
		 **/
		this.create = function()
		{
			this.layers = [
				addLayer.call( this, this.darkPurple ),
				addLayer.call( this, this.lightPurple ),
				addLayer.call( this, this.pink ),
				addLayer.call( this, this.red )
			];
		};

		/**
		 *	The value have change, needs to adapt to the new values
		 *	
		 *	@param options Object
		 **/
		this.update = function( options )
		{
			this.setSize( options.stageWidth, options.stageHeight );
			this.setThickness( options.thickness );
			this.setAmplitude( options.amplitude );
			this.setFrequency( options.frequency );
		};		

		/**
		 *	Called every frame
		 **/
		this.draw = function()
		{
			var n = this.layers.length;
			while( n-- )
			{
				this.layers[n]
					.compute()
					.draw()
			}
		};

		/**
		 *	Resize handler
		 *
		 *	@param event
		 **/
		function onResizeHandler(event)
		{
			this.refresh();
			this.width !== null && this.setSize( this.width, this.height );
		}

		/**
		 *	Tick handler
		 *	
		 *	@param event TickEvent
		 **/
		function onTickHandler(event)
		{
			// this.draw();
			this.stage.update();
		}

		/**
		 *	Add a new layer
		 *
		 *	@param color Number
		 *	@return Layer
		 **/
		function addLayer( color )
		{
			var l = new Layer( color );
			l.setUtils( Utils );
			this.stage.addChild( l.getDisplayObject() );

			return l;
		}

		

	}]);