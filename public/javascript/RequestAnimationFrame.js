// (function(){
	function initialize (data) {
		console.log("Data from fire server: ", data);
	};	

	var offset = 0,
		deadTimeOut = 1000,
		i, n,
		connectDiv,
		canvas, gl,
		ratio,
		vertices,
		velocities,
		colorLoc,
		cw, 
		ch, 
		cr = 0, cg = 0, cb = 0,
		tr, tg, tb,
		rndX = 0,
		rndY = 0,
		rndOn = false,
		rndSX = 0,
		rndSY = 0,
		lastUpdate = 0,
		IDLE_DELAY = 6000,
		touches = [],
		totalLines = 60000,
		renderMode = 0,
		numLines = totalLines;

	// setup webGL
	loadScene();

	// add listeners
	window.addEventListener( "resize", onResize, false );
	// window.addEventListener( "paint", function(data) {
 //    	console.log("Painting in the window: ", data);
 //    }, false);
    document.addEventListener( "mousedown", onMouseDown, false );
    // document.addEventListener( "paint", onPhoneMove, false);
	onResize();

	// start animation
	animate();

	function onResize(e) {
		cw = window.innerWidth; 
		ch = window.innerHeight;
	}  

	function normalize(px, py){
		console.log("normalize is called");
		touches[0] = (px/cw-.5)*3;
		touches[1] = (py/ch-.5)*-2;
	}

	function onMouseDown(e){
		normalize(e.pageX,e.pageY);
		document.addEventListener( "mousemove", onMouseMove );
		document.addEventListener( "mouseup", onMouseUp );
		e.preventDefault();
	}

	function onMouseMove(e) {
		normalize(e.pageX,e.pageY);
	}

	function onMouseUp(e) {
		touches.length = 0;
		document.removeEventListener( "mousemove", onMouseMove );
		document.removeEventListener( "mouseup", onMouseUp );
	}

	function assign(data) {
		console.log(data);
	}

	function onPhoneMove(data) {
		normalize();
    	console.log("Painting in the document: ", data);
    }

	function animate() {
		requestAnimationFrame( animate );
		redraw();
	}


	function redraw()
	{

		// declarations
		var player, dx, dy, d,
				tx, ty, bp, p, 
				i = 0, nt, j,
				now = new Date().getTime();
		
		nt = touches.length;
		
		// animate color
		cr = cr * .99 + tr * .01;
		cg = cg * .99 + tg * .01;
		cb = cb * .99 + tb * .01;
		//gl.uniform4f( colorLoc, cr, cg, cb, .5 );
				gl.uniform4f( colorLoc, 1, 0, 0, .5 );

		// animate and attract particles
		for( i = 0; i < numLines; i+=2 )
		{
			bp = i*3;
			// copy old positions
			vertices[bp] = vertices[bp+3];
			vertices[bp+1] = vertices[bp+4];
			
			// inertia
			velocities[bp] *= velocities[bp+2];
			velocities[bp+1] *= velocities[bp+2];
			
			// horizontal
			p = vertices[bp+3];
			p += velocities[bp];
			if ( p < -ratio ) {
				p = -ratio;
				velocities[bp] = Math.abs(velocities[bp]);
			} else if ( p > ratio ) {
				p = ratio;
				velocities[bp] = -Math.abs(velocities[bp]);
			}
			vertices[bp+3] = p;
			
			// vertical
			p = vertices[bp+4];
			p += velocities[bp+1];
			if ( p < -1 ) {
				p = -1;
				velocities[bp+1] = Math.abs(velocities[bp+1]);
			} else if ( p > 1 ) {
				p = 1;
				velocities[bp+1] = -Math.abs(velocities[bp+1]);
				
			}
			vertices[bp+4] = p;
			
			if ( nt ) // attraction when touched
			{
				for( j=0; j<nt; j+=2 )
				{
					dx = touches[j] - vertices[bp];
					dy = touches[j+1] - vertices[bp+1];
					d = Math.sqrt(dx * dx + dy * dy);
					
					if ( d < 2 )
					{
						if ( d < .03 )
						{
							//vertices[bp] = vertices[bp+3] = (Math.random() * 2 - 1)*ratio;
							//vertices[bp+1] = vertices[bp+4] = Math.random() * 2 - 1;
							vertices[bp] = (Math.random() * 2 - 1)*ratio;
							vertices[bp+1] = Math.random() * 2 - 1;
							vertices[bp+3] = (vertices[bp+3] + vertices[bp]) * .5;
							vertices[bp+4] = (vertices[bp+4] + vertices[bp+1]) * .5;
							velocities[bp] = Math.random()*.4-.2;
							velocities[bp+1] = Math.random()*.4-.2;
						} else {
							dx /= d;
							dy /= d;
							d = ( 2 - d ) / 2;
							d *= d;
							velocities[bp] += dx * d * .01;
							velocities[bp+1] += dy * d * .01;
						}
					}
				}
			}
		}

		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.DYNAMIC_DRAW);
			
		switch( renderMode ) {
			case 0 :
				gl.lineWidth(1);
				gl.drawArrays( gl.LINES, 0, numLines );
				break;
				
			case 1:
				gl.drawArrays( gl.TRIANGLE_STRIP, 0, numLines ); 
				break;
				
			case 2 :
				gl.lineWidth(1);
				gl.drawArrays( gl.LINE_STRIP, 0, numLines );
				break;
				
			case 3:
				gl.drawArrays( gl.TRIANGLE_FAN, 0, numLines ); 
				break;
		}
		
		gl.flush();
	}

	var colorTimeout;

	function switchColor() {
		var a = .5,
			c1 = .3+Math.random()*.2,
			c2 = Math.random()*.06+0.01,
			c3 = Math.random()*.06+0.02;
			
		switch( Math.floor( Math.random() * 3 ) ) {
			case 0 :
				//gl.uniform4f( colorLoc, c1, c2, c3, a );
				tr = c1;
				tg = c2;
				tb = c3;
				break;
			case 1 :
				//gl.uniform4f( colorLoc, c2, c1, c3, a );
				tr = c2;
				tg = c1;
				tb = c3;
				break;
			case 2 :
				//gl.uniform4f( colorLoc, c3, c2, c1, a );
				tr = c3;
				tg = c2;
				tb = c1;
				break;
		}

		if ( colorTimeout ) clearTimeout( colorTimeout );
		colorTimeout = setTimeout( switchColor, 500 + Math.random() * 4000 );
	}

	function loadScene()
	{
		connectDiv = document.getElementById("connectImg");

		//    Get the canvas element
		canvas = document.getElementById("webGLCanvas");
		//    Get the WebGL context
		gl = canvas.getContext("experimental-webgl");
		//    Check whether the WebGL context is available or not
		//    if it's not available exit
		if(!gl)
		{
			alert("There's no WebGL context available.");
			return;
		}
		//    Set the viewport to the canvas width and height
		cw = window.innerWidth;
		ch = window.innerHeight;
		canvas.width = cw;
		canvas.height = ch;
		gl.viewport(0, 0, canvas.width, canvas.height);
		
		//    Load the vertex shader that's defined in a separate script
		//    block at the top of this page.
		
		//    Grab the script element
		var vertexShaderScript = document.getElementById("shader-vs");
		var vertexShader = gl.createShader(gl.VERTEX_SHADER);
		gl.shaderSource(vertexShader, vertexShaderScript.text);
		gl.compileShader(vertexShader);
		if(!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
			alert("Couldn't compile the vertex shader");
			gl.deleteShader(vertexShader);
			return;
		}
		
		//    Load the fragment shader that's defined in a separate script
		//    More info about fragment shaders: http://en.wikipedia.org/wiki/Fragment_shader
		var fragmentShaderScript = document.getElementById("shader-fs");
		
		var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
		gl.shaderSource(fragmentShader, fragmentShaderScript.text);
		gl.compileShader(fragmentShader);
		if(!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
			alert("Couldn't compile the fragment shader");
			gl.deleteShader(fragmentShader);
			return;
		}

		//    Create a shader program. 
		gl.program = gl.createProgram();
		gl.attachShader(gl.program, vertexShader);
		gl.attachShader(gl.program, fragmentShader);
		gl.linkProgram(gl.program);
		if (!gl.getProgramParameter(gl.program, gl.LINK_STATUS)) {
			alert("Unable to initialise shaders");
			gl.deleteProgram(gl.program);
			gl.deleteProgram(vertexShader);
			gl.deleteProgram(fragmentShader);
			return;
		}
		//    Install the program as part of the current rendering state
		gl.useProgram(gl.program);
		
		
		// get the color uniform location
		colorLoc = gl.getUniformLocation( gl.program, "color" );
		gl.uniform4f( colorLoc, 0.4, 0.01, 0.08, 0.5 );
		
		
		var vertexPosition = gl.getAttribLocation(gl.program, "vertexPosition");
		gl.enableVertexAttribArray(vertexPosition);
		
		gl.clearColor(0.0, 0.0, 0.0, 1.0);
		gl.clearDepth(1.0);
		gl.enable(gl.BLEND);
		gl.disable(gl.DEPTH_TEST);
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
		
		//    Now create a shape.
		//    First create a vertex buffer in which we can store our data.
		var vertexBuffer = gl.createBuffer();
		//    Bind the buffer object to the ARRAY_BUFFER target.
		gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);


		//    
		vertices = [];
		ratio = cw / ch;
		velocities = [];
		for ( var i=0; i<totalLines; i++ )
		{
			vertices.push( 0, 0, 1.83 );
			velocities.push( (Math.random() * 2 - 1)*.05, (Math.random() * 2 - 1)*.05, .93 + Math.random()*.02 );
		}
		vertices = new Float32Array( vertices );
		velocities = new Float32Array( velocities );

		gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.DYNAMIC_DRAW);
		
		//    Clear the color buffer and the depth buffer
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		
		//    Define the viewing frustum parameters
		var fieldOfView = 30.0;
		var aspectRatio = canvas.width / canvas.height;
		var nearPlane = 1.0;
		var farPlane = 10000.0;
		var top = nearPlane * Math.tan(fieldOfView * Math.PI / 360.0);
		var bottom = -top;
		var right = top * aspectRatio;
		var left = -right;

		//     Create the perspective matrix. 
		var a = (right + left) / (right - left);
		var b = (top + bottom) / (top - bottom);
		var c = (farPlane + nearPlane) / (farPlane - nearPlane);
		var d = (2 * farPlane * nearPlane) / (farPlane - nearPlane);
		var x = (2 * nearPlane) / (right - left);
		var y = (2 * nearPlane) / (top - bottom);
		var perspectiveMatrix = [
			x, 0, a, 0,
			0, y, b, 0,
			0, 0, c, d,
			0, 0, -1, 0
		];
		
		//     Create the modelview matrix
		var modelViewMatrix = [
			1, 0, 0, 0,
			0, 1, 0, 0,
			0, 0, 1, 0,
			0, 0, 0, 1
		];
		//     Get the vertex position attribute location from the shader program
		var vertexPosAttribLocation = gl.getAttribLocation(gl.program, "vertexPosition");
		gl.vertexAttribPointer(vertexPosAttribLocation, 3.0, gl.FLOAT, false, 0, 0);
		var uModelViewMatrix = gl.getUniformLocation(gl.program, "modelViewMatrix");
		var uPerspectiveMatrix = gl.getUniformLocation(gl.program, "perspectiveMatrix");

		gl.uniformMatrix4fv(uModelViewMatrix, false, new Float32Array(perspectiveMatrix));
		gl.uniformMatrix4fv(uPerspectiveMatrix, false, new Float32Array(modelViewMatrix));
		
		switchColor();
	}

// }());

