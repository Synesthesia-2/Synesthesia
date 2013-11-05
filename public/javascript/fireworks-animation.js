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
	intensityTimeout,
	tr, tg, tb,
	px, py, pz,
	rndX = 0,
	rndY = 0,
	rndOn = false,
	rndSX = 0,
	rndSY = 0,
	lastUpdate = 0,
	IDLE_DELAY = 6000,
	touches = [],
	totalLines = 50000,
	renderMode = 0,
	numLines = totalLines,
	then=0,
	lastX,
	lastY=[],
	aZ,
	brushSize,
	brushId;

function initialize (data) {

	// if (Math.abs(data.aX) >2 && Math.abs(data.aZ) >2) {
	// 	px = data.aX+500;
	// 	py = data.aZ+250;
	// 	pz = data.aY;
	// 	brushSize = data.brushSize;
	// 	intensity(pz,brushSize,px,py);
	// }

	var now = new Date();
	var when = now.getTime();
	console.log(when-then, data.hz, data.volume);
	then = when;


	if (data.hz && data.volume>-85) {
		numLines = Math.floor((5000/7)*data.volume) + 65000;
		// console.log(Math.floor(numLines), data.volume);
		
		if (data.hz%55<2) {
			cr=255/256;
			cg=0;
			cb=255/256;
		} else if (data.hz%62<2) {
			cr=255/256;
			cg=165/256;
			cb=0;
		} else if (data.hz%65<2) {
			cr=34/256;
			cg=255/256;
			cb=34/256;
		} else if (data.hz%73<2) {
			cr=187/256;
			cg=0;
			cb=255/256;
		} else if (data.hz%41<2) {
			cr=255/256;
			cg=0;
			cb=0;
		} else if (data.hz%44<2) {
			cr=255/256;
			cg=187/256;
			cb=0;
		} else if (data.hz%49<2) {
			cr=85/256;
			cg=85/256;
			cb=255/256;
		}

		var tempX, tempY;
		lastX = lastX || 0;
		var moving_avg = 0.1;
		var filterFreq = moving_avg*data.hz +(1-moving_avg)*lastX;
		lastX = filterFreq;
		tempX = 1.25*Math.log(filterFreq/55)/Math.log(2)-4.5;

		lastY = lastY || 0;
		var filterVol = moving_avg*data.volume +(1-moving_avg)*lastY;
		lastY = filterVol;
		tempY = (filterVol/30)+2;
		touches[0] = tempY;
		touches[1] = tempX;
	}

    if (data.brushSize) {
		brushSize = data.brushSize;
		brushId = data.brushId;
		px = data.alpha;
		py = data.beta;
		pz = data.gamma;

	    if (brushId.charAt(0)>brushId.charAt(1) && brushId.charAt(2)>brushId.charAt(3)) {
	      px = (px*(5+Math.random()))%cw;
	      py = (py*(5+Math.random()))%ch;
	      pz *= 5;
	    } else if (brushId.charAt(0)<brushId.charAt(1) && brushId.charAt(2)>brushId.charAt(3)) {
	      px = (px*(10+Math.random()))%cw;
	      py = (py*(10+Math.random()))%ch;
	      pz *= 10;
	    } else if (brushId.charAt(0)>brushId.charAt(1) && brushId.charAt(2)<brushId.charAt(3)) {
	      px = (px*(15+Math.random()))%cw;
	      py = (py*(15+Math.random()))%ch;
	      pz *= 15;
	    } else {
	      px = (px*(20+Math.random()))%cw;
	      py = (py*(20+Math.random()))%ch;
	      pz *= 20;
	    }
		
		if (Math.abs(oa-px)>5 && Math.abs(ob-py)>5 && Math.abs(og-pz)>5){
			intensity(px,py,pz);
		} 
		if (data.color === "#8158D9") {
			cr = 129/256;
			cg = 88/256;
			cb = 217/256;
		} else if (data.color === "#D958B1") {
			cr = 217/256;
			cg = 88/256;
			cb = 177/256;
		} else if (data.color === "#82F5E7") {
			cr = 130/256;
			cg = 245/256;
			cb = 231/256;
		} else if (data.color === "#4B61F2") {
			cr = 75/256;
			cg = 97/256;
			cb = 242/256;
		} else if (data.color === "#40DB2C") {
			cr = 64/256;
			cg = 219/256;
			cb = 44/256;
		} else if (data.color === "#EB0C40") {
			cr = 235/256;
			cg = 12/256;
			cb = 64/256;
		}

		oa = px;
		ob = py;
		og = pz;
	}



}
		/*
          #8158D9 .
          #D958B1 .
          #82F5E7 .
          #4B61F2
          #EB0C40
          #40DB2C
		*/
// setup webGL
loadScene();

// add listeners
window.addEventListener( "resize", onResize, false )
document.addEventListener( "mousedown", onMouseDown, false );
document.addEventListener( "keydown", onKey, false );
onResize();

// start animation
animate();

function onResize(e) {
	cw = window.innerWidth; 
	ch = window.innerHeight;
}  

function normalize(px, py){
	touches[0] = (px/cw-.65)*3;
	touches[1] = (py/ch-.4)*-2;
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

function intensity(px, py, pz) {
    // if (!intensityTimeout) {
	//   if (pz>50) {
	//    normalize(0,pz*10);
	//    intensityTimeout = setTimeout( function() {
	// intensityTimeout=0;
	//    }, 1000 + Math.random() * 1000 );
	//  } else {
	normalize(px,py);
	//     }
	// }
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
			// now = new Date().getTime();
	
	nt = touches.length;
	
	// animate color
	cr = cr * .99 + tr * .01;
	cg = cg * .99 + tg * .01;
	cb = cb * .99 + tb * .01;
	gl.uniform4f( colorLoc, cr, cg, cb, Math.random()+0.3 );
	// gl.uniform4f( colorLoc, 1, 0, 0, Math.random()+0.5 );
	
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
						if (Math.abs(aZ)<10) {
    						velocities[bp] += dx * d * 0.03;
    					} else {
    						velocities[bp] += Math.random() * dx * d * 0.03;
    					}
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
	//    More info about shaders: http://en.wikipedia.org/wiki/Shader_Model
	//    More info about GLSL: http://en.wikipedia.org/wiki/GLSL
	//    More info about vertex shaders: http://en.wikipedia.org/wiki/Vertex_shader
	
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
	//var fragmentShaderScript = document.getElementById("shader-fs");
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
	
	//    Clear the color buffer (r, g, b, a) with the specified color
	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	//    Clear the depth buffer. The value specified is clamped to the range [0,1].
	//    More info about depth buffers: http://en.wikipedia.org/wiki/Depth_buffer
	gl.clearDepth(1.0);
	//    Enable depth testing. This is a technique used for hidden surface removal.
	//    It assigns a value (z) to each pixel that represents the distance from this
	//    pixel to the viewer. When another pixel is drawn at the same location the z
	//    values are compared in order to determine which pixel should be drawn.
	//gl.enable(gl.DEPTH_TEST);
	gl.enable(gl.BLEND);
	gl.disable(gl.DEPTH_TEST);
	gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
	//    Specify which function to use for depth buffer comparisons. It compares the
	//    value of the incoming pixel against the one stored in the depth buffer.
	//    Possible values are (from the OpenGL documentation):
	//    GL_NEVER - Never passes.
	//    GL_LESS - Passes if the incoming depth value is less than the stored depth value.
	//    GL_EQUAL - Passes if the incoming depth value is equal to the stored depth value.
	//    GL_LEQUAL - Passes if the incoming depth value is less than or equal to the stored depth value.
	//    GL_GREATER - Passes if the incoming depth value is greater than the stored depth value.
	//    GL_NOTEQUAL - Passes if the incoming depth value is not equal to the stored depth value.
	//    GL_GEQUAL - Passes if the incoming depth value is greater than or equal to the stored depth value.
	//    GL_ALWAYS - Always passes.                        
	//gl.depthFunc(gl.LEQUAL);
	
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
		velocities.push( (Math.random() * 2 - 1)*.05, (Math.random() * 2 - 1)*.05, .93 + Math.random()*.03 );
	}
	vertices = new Float32Array( vertices );
	velocities = new Float32Array( velocities );

	//    Creates a new data store for the vertices array which is bound to the ARRAY_BUFFER.
	//    The third paramater indicates the usage pattern of the data store. Possible values are
	//    (from the OpenGL documentation):
	//    The frequency of access may be one of these:       
	//    STREAM - The data store contents will be modified once and used at most a few times.
	//    STATIC - The data store contents will be modified once and used many times.
	//    DYNAMIC - The data store contents will be modified repeatedly and used many times.
	//    The nature of access may be one of these:
	//    DRAW - The data store contents are modified by the application, and used as the source for 
	//           GL drawing and image specification commands.
	//    READ - The data store contents are modified by reading data from the GL, and used to return 
	//           that data when queried by the application.
	//    COPY - The data store contents are modified by reading data from the GL, and used as the source 
	//           for GL drawing and image specification commands.                        
	gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.DYNAMIC_DRAW);
	
	//    Clear the color buffer and the depth buffer
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	
	//    Define the viewing frustum parameters
	//    More info: http://en.wikipedia.org/wiki/Viewing_frustum
	//    More info: http://knol.google.com/k/view-frustum
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
	//     More info: http://www.cs.utk.edu/~vose/c-stuff/opengl/glFrustum.html
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
	//     More info about the modelview matrix: http://3dengine.org/Modelview_matrix
	//     More info about the identity matrix: http://en.wikipedia.org/wiki/Identity_matrix
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
//	gl.varyingVector4fv( 
	//     Draw the triangles in the vertex buffer. The first parameter specifies what
	//     drawing mode to use. This can be GL_POINTS, GL_LINE_STRIP, GL_LINE_LOOP, 
	//     GL_LINES, GL_TRIANGLE_STRIP, GL_TRIANGLE_FAN, GL_TRIANGLES, GL_QUAD_STRIP, 
	//     GL_QUADS, and GL_POLYGON
	
	switchColor();
}

function onKey( e ) {
	// setRenderMode( ++renderMode % 4 );
}

function setRenderMode( n ) {
	renderMode = n;
	switch(renderMode) {
		case 0: // lines
			numLines = totalLines;
			break;
		case 1: // triangle strip
			numLines = 600;
			break;
		case 2: // lines strip
			numLines = 7000;
			break;
		case 3: // quad strip
			numLines = 400;
			break;
	}
}
// }());

