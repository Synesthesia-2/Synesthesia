var server = io.connect('/flock');

 server.on('welcome', function(data) {
    console.log("particle visualizer welcomed", data);
});



var scene, camera, renderer, stats, stats2, clock, emitter, emitter2, particleGroup;

var mouseX, mouseY, mouseVector = new THREE.Vector3(),
    projector = new THREE.Projector();

    // Setup the scene
        function init() {
            scene = new THREE.Scene();
            camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 10000);
            camera.position.z = 50;
            camera.lookAt( scene.position );

            renderer = new THREE.WebGLRenderer();
            renderer.setSize( window.innerWidth, window.innerHeight );
            renderer.setClearColor(0x000000);

            clock = new THREE.Clock();

            document.body.appendChild( renderer.domElement );
        }

        // Create particle group and emitter
        function initParticles() {
          particleGroup = new SPE.Group({
            texture: THREE.ImageUtils.loadTexture('./images/smokeparticle.png'),
            maxAge: 2
          });

          emitter = new SPE.Emitter({
            position: new THREE.Vector3(0, 0, 0),
                positionSpread: new THREE.Vector3(3, 3, 3),

                acceleration: new THREE.Vector3(0, 0, 0),
                accelerationSpread: new THREE.Vector3(0, 0, 0),

                velocity: new THREE.Vector3(0,0,0),
                velocitySpread: new THREE.Vector3(5,5,5),

                colorStart: (new THREE.Color()).setRGB(0, 0, 0),
                colorStartSpread: new THREE.Vector3(.1, .1, .1),
                colorEnd: (new THREE.Color()).setRGB(0.02, 0.5, 0.06),
                colorEndSpread: new THREE.Vector3(.1, 1, .1),
                sizeStart: 10,
                sizeMiddle: 4,
                sizeEnd: 10,

                particleCount: 100
          });

            emitter2 = new SPE.Emitter({
                position: new THREE.Vector3(0, 0, 0),
                positionSpread: new THREE.Vector3(3, 3, 10),

                acceleration: new THREE.Vector3(0, 0, 0),
                accelerationSpread: new THREE.Vector3(0, 0, 0),

                velocity: new THREE.Vector3(1, 1, 1),
                velocitySpread: new THREE.Vector3(2, 2, 2),

                colorStart: (new THREE.Color()).setRGB(0, 0, 0),
                colorStartSpread: new THREE.Vector3(.1, .1, .1),
                colorEnd: (new THREE.Color()).setRGB(0.02, 0.05, 0.6),
                colorEndSpread: new THREE.Vector3(.1, 1, .1),
                sizeStart: 5,
                sizeMiddle: .1,
                sizeEnd: 3,

                particleCount: 1000
            });

            particleGroup.addEmitter( emitter );

          // particleGroup.addEmitter( emitter2 );
            
          scene.add( particleGroup.mesh );

          document.querySelector('.numParticles').textContent =
            'Total particles: ' + emitter.numParticles;
        }

        var scale = 0.05;

        function animate() {
            requestAnimationFrame( animate );

            // Using a fixed time-step here to avoid pauses
            var now = Date.now();
            now *= scale
                emitter.position.x +=  Math.cos(3 * now + 0.7);
                emitter.position.y +=  Math.cos(2 * now + 0.2);
                emitter.position.z +=  Math.cos(7 * now );

                // emitter.position.x += (Math.random() - 0.5 ) * 5;
            // if (now % 18 === 0 ) {
                // emitter.position.x +=  0.2 * Math.cos(3 * now + 0.7);
                // emitter.position.y +=  Math.cos(2 * now + 0.2);
                // emitter.position.z +=   0.1 * Math.cos(7 * now );
                emitter.position.x = emitter.position.x % window.innerWidth;
                
            // }
            // if (now % 2048 === 0) {
            //     console.log(mouseVector);
            // }
            
            render( 0.128 );
        }


        function render( dt ) {
            particleGroup.tick( dt );
            renderer.render( scene, camera );
        }

        //// data format: [ '#bundle', 2.3283064365386963e-10, [ '/cur', 73, 320, 240 ] ]
        ///// blob data listener
        server.on('blob', function(data) {
            var blobdata = data[2];
            console.log('blobbed!');
            var blobx = blobdata[2];
            var bloby = blobdata[3];
            mouseVector.set(
                (blobx / window.innerWidth) * 2 - 1,
                -(bloby / window.innerHeight) * 2 + 1,
                0.5
            );

            projector.unprojectVector( mouseVector, camera );

            emitter.position.x = mouseVector.x * camera.fov;
            emitter.position.y = mouseVector.y * camera.fov;
            // emitter2.position.x = (mouseVector.x + .0003 ) * camera.fov;
            // emitter2.position.y = (mouseVector.y + .0003) * camera.fov;
        });

        // document.addEventListener( 'mousemove', function( e ) {
        //     mouseVector.set(
        //         (e.clientX / window.innerWidth) * 2 - 1,
        //         -(e.clientY / window.innerHeight) * 2 + 1,
        //         0.5
        //     );

        //     projector.unprojectVector( mouseVector, camera );

        //     emitter.position.x = mouseVector.x * camera.fov;
        //     emitter.position.y = mouseVector.y * camera.fov;
        //     emitter2.position.x = (mouseVector.x + .0003 ) * camera.fov;
        //     emitter2.position.y = (mouseVector.y + .0003) * camera.fov;
        // }, false );


        window.addEventListener( 'resize', function() {
            var w = window.innerWidth,
                h = window.innerHeight;

            camera.aspect = w / h;
            camera.updateProjectionMatrix();

            renderer.setSize( w, h );
        }, false );


        init();
        initParticles();

        setTimeout(animate, 0);