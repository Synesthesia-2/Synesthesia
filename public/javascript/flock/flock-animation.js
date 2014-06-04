(function() {
  var size = {
    width: window.innerWidth,
    height: window.innerHeight
  };
  // create an new instance of a pixi _stage - and set it to be interactive
  var _stage = new PIXI.Stage(0xd9e2cc);
  _stage.setInteractive(true);

  // create a _renderer instance
  var _renderer = PIXI.autoDetectRenderer(size.width, size.height);

  _renderer.view.style.width = size.width + "px";
  _renderer.view.style.height = size.height + "px";

  _renderer.view.style.display = "block";

  requestAnimFrame(animate);
  var renderTexture = new PIXI.RenderTexture(size.width, size.height);

  var _target = new PIXI.DisplayObjectContainer();
  _stage.addChild(_target);
  var count = 0;

  // add render view to DOM
  document.body.appendChild(_renderer.view);

  var boids = [];
  var groupTogether = false;
  var opticalFlowVector = new PIXI.Vector(0, 0);
  var borderFactor = 10;
  var path = []; 
  
  // Create a path. This is for testing. Ideally we should detect an outline with an IR camera and using that data for the path.
  var steps = 90;
  for (var i = 0; i < steps; i++) {
    path.push(new PIXI.Vector(
      (size.width / 2) + 300 * Math.cos(2 * Math.PI * i / steps),
      (size.height / 2) + 300 * Math.sin(2 * Math.PI * i / steps)
     ));
  }

  var Boid = function(position, maxSpeed, maxForce) {
    var strength = Math.random() + 1.5;
    this.acceleration = new PIXI.Vector();
    this.vector = new PIXI.Vector(Math.random(), Math.random()).multiplyScalar(50).add(new PIXI.Vector(10,10));
    this.position = position.clone();
    this.radius = 30;
    this.maxSpeed = maxSpeed + strength;
    this.maxForce = maxForce + strength;
    this.amount = strength * 10 + 10;
    this.count = 0;
    this.flap = Math.random() * 0.5 + 0.5;
  };

  Boid.prototype.run = function(boids) {
    if (!groupTogether) {
      this.flock(boids);
    } else {
      this.align(boids);
    }
    this.update();
  };

  // We accumulate a new acceleration each time based on several rules
  Boid.prototype.flock = function(boids) {
    var separation = this.separate(boids).multiplyScalar(1);
    var alignment = this.align(boids).multiplyScalar(20);
    var cohesion = this.cohesion(boids).multiplyScalar(0.5);
    var borders = this.borders().multiplyScalar(2);
    this.acceleration.add(separation).add(alignment).add(cohesion).add(borders);
  };

  Boid.prototype.opticalFlow = function() {
    if (window.boidData && window.boidData.u) {
      var u = window.boidData.u;
      var v = window.boidData.v;
      opticalFlowVector.x -= u;
      opticalFlowVector.y += v;
    }
    return vector;
  };

  Boid.prototype.update = function() {
    // Update velocity
    this.vector.add(this.acceleration);
    // Limit speed (vector#limit?)
    this.vector.setLength(Math.min(this.maxSpeed, this.vector.length()));
    this.position.add(this.vector);
    // Reset acceleration to 0 each cycle
    // The closer to 0 this is, the more insect like the behavior
    // with sudden changes in direction
    this.acceleration.multiplyScalar(0.95);
  };

  Boid.prototype.seek = function(target) {
    this.acceleration.add(this.steer(target, false));
  };

  Boid.prototype.arrive = function(target) {
    this.acceleration.add(this.steer(target, true));
  };

  Boid.prototype.borders = function() {

    var vector = new PIXI.Vector(0, 0);
    var position = this.position;
    var radius = this.radius;

    if (position.x < -radius) {
      vector.x = borderFactor * (-radius - position.x);
    }
    if (position.y < -radius){
      vector.y = borderFactor * (-radius - position.y);
    }
    if (position.x > size.width + radius){
      vector.x = -borderFactor * (position.x - size.width - radius);
    }
    if (position.y > size.height + radius) {
      vector.y = -borderFactor * (position.y - size.height - radius);
    }

    return vector;
  };

  // A method that calculates a steering vector towards a target
  // Takes a second argument, if true, it slows down as it approaches
  // the target
  Boid.prototype.steer = function(target, slowdown) {
    var steer;
    var desired = target.clone().sub(this.position);
    var distance = desired.length();
    // Two options for desired vector magnitude
    // (1 -- based on distance, 2 -- maxSpeed)
    if (slowdown && distance < 20) {
      // This damping is somewhat arbitrary:
      desired.setLength(this.maxSpeed * (1 / distance));
    } else {
      // desired.setLength(this.maxSpeed);
    }
    steer = desired.clone().sub(this.vector);
    steer.setLength(Math.min(this.maxForce, steer.length()));

    return steer;
  };

  Boid.prototype.separate = function(boids) {
    var desiredSeperation = Math.pow(100, 2);
    var steer = new PIXI.Vector(0, 0);
    var count = 0;
    // For every boid in the system, check if it's too close
    for (var i = 0, l = boids.length; i < l; i++) {
      var other = boids[i];
      // since this. and other. poisition are PIXI.Points, need to create a new Vector out of that point
      var vector = new PIXI.Vector(this.position.clone().sub(other.position));
      var distanceSq = vector.lengthSq();
      if (distanceSq > 0 && distanceSq < desiredSeperation) {
        // Calculate vector pointing away from neighbor
        steer.add(vector.multiplyScalar(1 / (distanceSq * distanceSq)));
        count++;
      }
    }
    // Average -- divide by how many
    if (count > 0)
      steer.divideScalar(count);
    if (steer.length() !== 0) {
      // Implement Reynolds: Steering = Desired - Velocity
      steer.setLength(this.maxSpeed);
      steer.sub(this.vector);
      steer.setLength(Math.min(steer.length(), this.maxForce));
    }
    return steer;
  };

  // Alignment
  // For every nearby boid in the system, calculate the average velocity
  Boid.prototype.align = function(boids) {
    // Using square of distance to ease calculations
    var neighborDist = Math.pow(250, 2);
    var steer = new PIXI.Vector(0, 0);
    var count = 0;
    for (var i = 0, l = boids.length; i < l; i++) {
      var other = boids[i];
      // We just need to find the square of the distance — less calculation
      var distanceSq = this.position.distanceToSq(other.position);
      // debugger;
      if (distanceSq > 0 && distanceSq < neighborDist) {
        steer.add(other.vector);
        count++;
      }
    }

    if (count > 0)
      steer.divideScalar(count);
    if (! (steer.length() === 0)) {
      // Implement Reynolds: Steering = Desired - Velocity
      steer.setLength(this.maxSpeed);
      steer.sub(this.vector);
      steer.setLength(Math.min(steer.length(), this.maxForce));
    }
    return steer;
  };

  // Cohesion
  // For the average location (i.e. center) of all nearby boids,
  // calculate steering vector towards that location
  Boid.prototype.cohesion = function(boids) {
    // Using square of distance to ease calculations
    var neighborDist = Math.pow(600, 2);
    var sum = new PIXI.Vector(0, 0);
    var count = 0;
    for (var i = 0, l = boids.length; i < l; i++) {
      var other = boids[i];
      var distanceSq = this.position.distanceToSq(other.position);
      if (distanceSq > 0 && distanceSq < neighborDist) {
        sum.add(other.position); // Add location
        count++;
      }
    }
    if (count > 0) {
      sum.divideScalar(count);
      // Steer towards the location
      return this.steer(sum, false);
    }
    return sum;
  };

  //Main loop -
  init();

  function init() {
    var boidContainers = [];

    // Add the boids:
    for (var i = 0; i < 100; i++) {
      var position = new PIXI.Point(Math.random() * size.width, Math.random() * size.height);
      var boid = new Boid(position, 2, 1);
      var boidContainer = new PIXI.DisplayObjectContainer();
      var boidGraphic = new PIXI.Graphics();
      boidGraphic.beginFill(0x002244);
      boidGraphic.drawCircle(0, 0, 5);
      boidGraphic.lineTo(3.5,0);
      boidGraphic.endFill();


      boidContainer.addChild(boidGraphic);
      boidContainer.alpha = boid.vector.length() / boid.maxSpeed;

      boid.container = boidContainer;
      boidContainers.push(boidContainer);

      boids.push(boid);
      
      _target.addChild(boidContainer);
      _stage.addChild(boidContainer);
    }
  _stage.setInteractive(true);
  _stage.mousedown = _stage.touchstart = onMouseDown;
  }

  function onMouseDown() {
    groupTogether = !groupTogether;
  }

  function animate() {
    requestAnimFrame(animate);

    count += 1;
    _renderer.render(_stage);

    for (var i = 0, l = boids.length; i < l; i++) {
      var boid = boids[i];

      if (groupTogether) {
        var index = parseInt( ((i + boid.count / 6) % l) / l * path.length);
        var point = path[index];
        boid.seek(point);
      }
      boid.container.position = boid.position;
      boid.vector.normalize();

      boid.count += (1 + boid.flap);
      boid.container.alpha = 1.1 - (1 / (boid.vector.lengthSq() + .5)) ;
      boid.container.rotation = -boid.vector.rad();

      var flapFactor = boid.count * boid.vector.lengthSq() * 0.2;
      boid.container.scale = new PIXI.Point(Math.sin(flapFactor)*.25 + 0.85, 0.6);

      boid.run(boids);
    }
  }
})();
