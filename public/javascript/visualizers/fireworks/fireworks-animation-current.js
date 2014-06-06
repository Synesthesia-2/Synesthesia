/**
 * Most of the WebGL-related code in this demo 
 * comes from this tutorial by Dennis Ippel (thanks!) :
 * http://www.rozengain.com/blog/2010/02/22/beginning-webgl-step-by-step-tutorial/
 */

var canvas, gl,
	ratio,
	vertices,
	velocities,
	colorHz,
	colorLoc,
	countdown,
	oa, ob, //og, for old alpha, old beta, old gamma
	cw, ch, //canvas width and height
	cr=0, cg=0, cb=0, //for color-red, -green, -blue
	px, pz, //py, position-x, -y, -z
	modifier, //converts from frequency to color
	touches = [], //analogue to mouse press
	totalLines = 60000,
	numLinesGoal,
	numLines = totalLines,
	zFilterLines=0.95, //Between 0 and 1. Higher is slower change.
	zFilterColor=0.95;

function initialize (data) {

	touches[0] = 0;
	touches[1] = 0;

	if (data.alpha) {
		// py = 2.25*(data.alpha-180)/360; //0 to 360
		px = data.beta/120; //-90 to +90
		pz = data.gamma/180; //-180 to +180

		touches[0]=px;
		touches[1]=pz;

		oa = px;
		ob = pz;
		// og = pz;
	}

	if (data.hz) {
		numLinesGoal = 1000*data.volume + 60000;
		numLines = numLines*zFilterLines + numLinesGoal*(1-zFilterLines);
		if (numLines>totalLines) {numLines=totalLines;}
		// console.log(numLines,data.volume);
		
		modifier = (Math.log(data.hz/110)/Math.log(2) % 1) * (-360);
		colorHz = pusher.color('yellow').hue(modifier.toString());

		cr=cr*zFilterColor+(1-zFilterColor)*colorHz.rgb()[0]/256;
		cg=cg*zFilterColor+(1-zFilterColor)*colorHz.rgb()[1]/256;
		cb=cb*zFilterColor+(1-zFilterColor)*colorHz.rgb()[2]/256;

		function setDisappear() {
			countdown = setTimeout(function(){touches=[];},1000);
		}

		function clearDisappear() {
			clearTimeout(countdown);
		}

		if (countdown) {clearDisappear();}
		setDisappear();
	}

}

// setup webGL
loadScene();

// add listeners
window.addEventListener( "resize", onResize, false );
onResize();

function onResize(e) {
	cw = window.innerWidth;
	ch = window.innerHeight;
}

// start animation
animate();

function animate() {
  requestAnimationFrame( animate );
  redraw();
}

function redraw() {

	var dx, dy, d,
		bp, p,
		i = 0, nt = touches.length, j;
	
	// animate color
	cr = (cr * 0.94).toFixed(3);
	cg = (cg * 0.94).toFixed(3);
	cb = (cb * 0.95).toFixed(3);
	gl.uniform4f( colorLoc, cr, cg, cb, Math.random()+0.35 );
	
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
		p += velocities[bp+1]*1.5;
		if ( p < -0.9 ) {
			p = -0.9;
			velocities[bp+1] = Math.abs(velocities[bp+1]);
		} else if ( p > 0.9 ) {
			p = 0.9;
			velocities[bp+1] = -Math.abs(velocities[bp+1]);
			
		}
		vertices[bp+4] = p;
		
		if ( nt ) // attraction when audio input
		{
			for( j=0; j<nt; j+=2 )
			{
				dx = touches[j+1] - vertices[bp];
				dy = touches[j] - vertices[bp+1];
				d = Math.sqrt(dx * dx + dy * dy);
				
				if ( d < 1 )
				{
					if ( d < 0.03 )
					{
						vertices[bp] = (Math.random() * 2 - 1)*ratio;
						vertices[bp+1] = Math.random() * 2 - 1;
						vertices[bp+3] = (vertices[bp+3] + vertices[bp]) * 0.5;
						vertices[bp+4] = (vertices[bp+4] + vertices[bp+1]) * 0.5;
						velocities[bp] = Math.random()*0.4-0.2;
						velocities[bp+1] = Math.random()*0.4-0.1;
					} else {
						dx /= d;
						dy /= d;
						d = ( 2 - d ) / 2;
						d *= d;
						velocities[bp] += dx * d * 0.025;
						velocities[bp+1] += dy * d * 0.015;
					}
				}
			}
		}
	}

	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.DYNAMIC_DRAW);
		
	gl.lineWidth(1);
	gl.drawArrays( gl.LINES, 0, numLines );
	
	gl.flush();
}


function loadScene() {
	//    Get the canvas element
	canvas = document.getElementById("webGLCanvas");
	//    Get the WebGL context
	gl = canvas.getContext("experimental-webgl");

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
	
	//    Load the vertex shader
	var vertexShaderScript = document.getElementById("shader-vs");

	var vertexShader = gl.createShader(gl.VERTEX_SHADER);
	gl.shaderSource(vertexShader, vertexShaderScript.text);
	gl.compileShader(vertexShader);
	if(!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
		alert("Couldn't compile the vertex shader");
		gl.deleteShader(vertexShader);
		return;
	}
	
	//    Load the fragment shader
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
	gl.useProgram(gl.program);
	
	// get the color uniform location
	colorLoc = gl.getUniformLocation( gl.program, "color" );
	gl.uniform4f( colorLoc, 0.4, 0.01, 0.08, 0.3 );
	
	
	//    Get the vertexPosition attribute from the linked shader program
	var vertexPosition = gl.getAttribLocation(gl.program, "vertexPosition");
	//    Enable the vertexPosition vertex attribute array. If enabled, the array
	//    will be accessed an used for rendering when calls are made to commands like
	//    gl.drawArrays, gl.drawElements, etc.
	gl.enableVertexAttribArray(vertexPosition);
	
	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.clearDepth(1.0);
	gl.enable(gl.BLEND);
	gl.disable(gl.DEPTH_TEST);
	gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
	
	//    First create a vertex buffer in which we can store our data.
	var vertexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

	//    
	vertices = [];
	ratio = cw / ch;
	velocities = [];
	for ( var i=0; i<totalLines; i++ )
	{
		vertices.push( 0, 0, 1.83 );
		velocities.push( (Math.random() * 2 - 1)*.05, (Math.random() * 2 - 1)*.05, .93 + Math.random()*.03 );
	}
	vertices = new Float32Array( vertices );
	velocities = new Float32Array( velocities );
                     
	gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.DYNAMIC_DRAW);
	
	//    Clear the color buffer and the depth buffer
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	
	//    Define the viewing parameters
	var fieldOfView = 30.0;
	var aspectRatio = canvas.width / canvas.height;
	var nearPlane = 1.0;
	var farPlane = 10000.0;
	var top = nearPlane * Math.tan(fieldOfView * Math.PI / 360.0);
	var bottom = -top;
	var right = top * aspectRatio;
	var left = -right;

	// Create the perspective matrix. The OpenGL function that's normally used for this,
	// glFrustum() is not included in the WebGL API. 
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

	//     Specify the location and format of the vertex position attribute
	gl.vertexAttribPointer(vertexPosAttribLocation, 3.0, gl.FLOAT, false, 0, 0);

	// Get the location of the "modelViewMatrix" and "perspectiveMatrix"
	// uniform variables from the shader program
	var uModelViewMatrix = gl.getUniformLocation(gl.program, "modelViewMatrix");
	var uPerspectiveMatrix = gl.getUniformLocation(gl.program, "perspectiveMatrix");

	//     Set the values
	gl.uniformMatrix4fv(uModelViewMatrix, false, new Float32Array(perspectiveMatrix));
	gl.uniformMatrix4fv(uPerspectiveMatrix, false, new Float32Array(modelViewMatrix));
	
}