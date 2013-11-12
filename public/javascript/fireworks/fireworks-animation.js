// (function(){
/**
 * Most of the WebGL-related code in this demo 
 * comes from this tutorial by Dennis Ippel (thanks!) :
 * http://www.rozengain.com/blog/2010/02/22/beginning-webgl-step-by-step-tutorial/
 * 
 */


var offset = 0,

	// deadTimeOut = 1000,
	i, n,
	connectDiv,
	canvas, gl,
	ratio,
	vertices,
	velocities,
	colorLoc,
	oa, ob, og, //for old alpha, old beta, old gamma
	cw,
	ch,
	cr = 0, cg = 0, cb = 0,
	tr, tg, tb,
	px, py, pz,
	touches = [],
	totalLines = 60000,
	renderMode = 0,
	numLines = totalLines,
	// lastX,
	// lastY,
	aZ;

function initialize (data) {

	touches[0] = 0;
	touches[1] = 0;

	if (data.alpha) {
		px = data.alpha;
		py = data.beta;
		pz = data.gamma;

		px = (px*(5+Math.random()))%cw;
		py = (py*(5+Math.random()))%ch;
		pz *= 5;
		
		if (Math.abs(oa-px)>5 && Math.abs(ob-py)>5 && Math.abs(og-pz)>5){
			touches[0]=px;
			touches[1]=py;
		}

		oa = px;
		ob = py;
		og = pz;
	}


	if (data.hz && data.volume>-40) {
		numLines = Math.floor((5000/7)*data.volume) + 65000;
		if (numLines>totalLines) {numLines=totalLines;}
		
		if (data.hz%38.9<2) {
			cr=255/256;
			cg=51/256;
			cb=51/256;
		} else if (data.hz%41.2<2) {
			cr=255/256;
			cg=153/256;
			cb=51/256;
		} else if (data.hz%43.6<2) {
			cr=255/256;
			cg=255/256;
			cb=51/256;
		} else if (data.hz%46.2<2) {
			cr=153/256;
			cg=255/256;
			cb=51/256;
		} else if (data.hz%49.0<2) {
			cr=51/256;
			cg=255/256;
			cb=51/256;
		} else if (data.hz%51.9<2) {
			cr=51/256;
			cg=255/256;
			cb=153/256;
		} else if (data.hz%55.0<2) {
			cr=51/256;
			cg=255/256;
			cb=255/256;
		} else if (data.hz%58.3<2) {
			cr=51/256;
			cg=153/256;
			cb=255/256;
		} else if (data.hz%61.7<2) {
			cr=51/256;
			cg=51/256;
			cb=255/256;
		} else if (data.hz%65.4<2) {
			cr=153/256;
			cg=51/256;
			cb=255/256;
		} else if (data.hz%69.3<2) {
			cr=255/256;
			cg=51/256;
			cb=255/256;
		} else if (data.hz%73.4<2) {
			cr=255/256;
			cg=51/256;
			cb=153/256;
		}

	} else if (data.hz && data.volume<-40) {
		touches = [];
	}
	
}

// setup webGL
loadScene();

// add listeners
window.addEventListener( "resize", onResize, false );
onResize();

// start animation
animate();

function onResize(e) {
	cw = window.innerWidth;
	ch = window.innerHeight;
}

function animate() {
        requestAnimationFrame( animate );
        redraw();
}


function redraw()
{

	var player, dx, dy, d,
			tx, ty, bp, p,
			i = 0, nt = touches.length, j;
	
	// animate color
	cr = cr * 0.94;
	cg = cg * 0.94;
	cb = cb * 0.94;
	gl.uniform4f( colorLoc, cr, cg, cb, Math.random()+0.3 );
	
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
				dx = touches[j+1] - vertices[bp];
				dy = touches[j] - vertices[bp+1];
				d = Math.sqrt(dx * dx + dy * dy);
				
				if ( d < 2.5 )
				{
					if ( d < 0.03 )
					{
						vertices[bp] = (Math.random() * 2 - 1)*ratio;
						vertices[bp+1] = Math.random() * 2 - 1;
						vertices[bp+3] = (vertices[bp+3] + vertices[bp]) * 0.5;
						vertices[bp+4] = (vertices[bp+4] + vertices[bp+1]) * 0.5;
						velocities[bp] = Math.random()*0.4-0.2;
						velocities[bp+1] = Math.random()*0.4-0.2;
					} else {
						dx /= d;
						dy /= d;
						d = ( 2 - d ) / 2;
						d *= d;
						if (Math.abs(aZ)<10) {
							velocities[bp] += dx * d * 0.03;
						} else {
							velocities[bp] += Math.random() * dx * d * 0.03;
						}
						velocities[bp+1] += dy * d * 0.01;
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
	}
	
	gl.flush();
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
	
	//    Now create a shape.
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
	
	//    Define the viewing frustum parameters
	var fieldOfView = 30.0;
	var aspectRatio = canvas.width / canvas.height;
	var nearPlane = 1.0;
	var farPlane = 10000.0;
	var top = nearPlane * Math.tan(fieldOfView * Math.PI / 360.0);
	var bottom = -top;
	var right = top * aspectRatio;
	var left = -right;

	//     Create the perspective matrix. The OpenGL function that's normally used for this,
	//     glFrustum() is not included in the WebGL API. That's why we have to do it manually here.
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
//				colorLoc = gl.getVaryingLocation(gl.program, "vColor");
//				alert("color loc : " + colorLoc );
	//     Specify the location and format of the vertex position attribute
	gl.vertexAttribPointer(vertexPosAttribLocation, 3.0, gl.FLOAT, false, 0, 0);
	//gl.vertexAttribPointer(colorLoc, 4.0, gl.FLOAT, false, 0, 0);
	//     Get the location of the "modelViewMatrix" uniform variable from the 
	//     shader program
	var uModelViewMatrix = gl.getUniformLocation(gl.program, "modelViewMatrix");
	//     Get the location of the "perspectiveMatrix" uniform variable from the 
	//     shader program
	var uPerspectiveMatrix = gl.getUniformLocation(gl.program, "perspectiveMatrix");
	//     Set the values
	gl.uniformMatrix4fv(uModelViewMatrix, false, new Float32Array(perspectiveMatrix));
	gl.uniformMatrix4fv(uPerspectiveMatrix, false, new Float32Array(modelViewMatrix));
	
}

function onKey( e ) {
        // setRenderMode( ++renderMode % 2 );
}

function setRenderMode( n ) {

	renderMode = n;
	switch(renderMode) {
	case 0: // lines
		numLines = totalLines;
		break;
	}
}
// }());
