angular
	.module(APPNAME)
	.service('CanvasService', ['Utils', function(Utils)
	{
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
				h = (this.pixelHeight/(m+1))*(m-n) |0;
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

		this.setTheme = function( value )
		{
			if ( this.theme == value )
				return;

			this.theme = value;
			var n = this.layers.length;
			while( n-- )
			{
				this.layers[n].setColor( this.theme.colors[n] );
			}
		}

		/**
		 *	Init the canvas
		 *
		 *	@param canvas JQueryElement
		 *	@param container JQueryElement
		 *	@param value Window
		 *	@param theme Object
		 **/
		this.init = function( canvas, container, window, theme )
		{
			this.canvas = jQuery(canvas);
			this.context = canvas[0].getContext('2d');
			this.stage = new createjs.Stage( canvas[0] );
			createjs.Ticker.addEventListener("tick", onTickHandler.bind(this));

			this.container = container;

			this.window = jQuery(window).on('resize', onResizeHandler.bind(this));

			this.theme = theme;

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
				addLayer.call( this, this.theme.colors[0], 'first' ),
				addLayer.call( this, this.theme.colors[1], 'second' ),
				addLayer.call( this, this.theme.colors[2], 'third' ),
				addLayer.call( this, this.theme.colors[3], 'fours' )
			];
		};

		/**
		 *	The value have change, needs to adapt to the new values
		 *	
		 *	@param options Object
		 **/
		this.update = function( options )
		{
			this.setThickness( options.thickness );
			this.setAmplitude( options.amplitude );
			this.setFrequency( options.frequency );
			this.setSize( options.stageWidth, options.stageHeight );
			this.setTheme( options.theme );
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
			this.draw();
			this.stage.update();
		}

		/**
		 *	Add a new layer
		 *
		 *	@param color Number
		 *	@param name String
		 *	@return Layer
		 **/
		function addLayer( color, name )
		{
			var l = new Layer( color, name );
			l.setUtils( Utils );
			this.stage.addChild( l.getDisplayObject() );

			return l;
		}

		

	}]);