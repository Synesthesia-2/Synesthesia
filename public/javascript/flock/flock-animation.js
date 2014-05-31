// // Adapted from Flocking Processing example by Daniel Schiffman:
// // http://processing.org/learning/topics/flocking.html

var view = {
  size: {
    width: window.innerWidth,
    height: window.innerHeight
  }
};

var boids = [];
var groupTogether = false;


var Boid = function(position, maxSpeed, maxForce) {
    var strength = Math.random()*2 + 2;
    this.acceleration = new PIXI.Vector();
    this.vector = new PIXI.Vector(Math.random(), Math.random()).multiplyScalar(50).add(new PIXI.Vector(10,10));
    this.position = position.clone();
    this.radius = 30;
    this.maxSpeed = maxSpeed + strength;
    this.maxForce = maxForce + strength;
    this.amount = strength * 10 + 10;
    this.count = 0;
    this.flap = Math.random() * .5 + .5;
    this.createItems();
};

Boid.prototype.run = function(boids) {
  this.lastLoc = this.position.clone();
  if (!groupTogether) {
    this.flock(boids);
  } else {
    this.align(boids);
  }
  // this.borders();
  this.update();
  // this.moveHead();
};

Boid.prototype.createItems = function() {
  // this.head = new PIXI.Circle(0,0,5);

};

Boid.prototype.moveHead = function() {
  // this.head.position = this.position;
  // this.head.rotation = this.vector.angle;
};

// We accumulate a new acceleration each time based on three rules
Boid.prototype.flock = function(boids) {
  var separation = this.separate(boids).multiplyScalar(40);
  var alignment = this.align(boids).multiplyScalar(50);
  var cohesion = this.cohesion(boids).multiplyScalar(40);
  var borders = this.borders().multiplyScalar(2.5);
  this.acceleration.add(separation).add(alignment).add(cohesion).add(borders);
};

Boid.prototype.update = function() {
  // Update velocity
  this.vector.add(this.acceleration);
  // Limit speed (vector#limit?)
  this.vector.setLength( Math.min(this.maxSpeed, this.vector.length()) );
  this.position.add(this.vector);
  // Reset acceleration to 0 each cycle
  // this.acceleration = new PIXI.Vector(0,0);
  this.acceleration.multiplyScalar(.5);
};

Boid.prototype.seek = function(target) {
  this.acceleration.add(this.steer(target, false));
};

Boid.prototype.arrive = function(target) {
  this.acceleration.add(this.steer(target, true)).multiplyScalar(50);
};

Boid.prototype.borders = function() {

  var vector = new PIXI.Vector(0, 0);
  var position = this.position;
  var radius = this.radius;
  // var size = view.size;

  if (position.x < -radius) {
    vector.x = borderFactor * (-radius - position.x);
    // console.log('off left', this.container.position);
  }
  if (position.y < -radius){
    vector.y = borderFactor * (-radius - position.y);
    // console.log('off top', this.container.position);
  }
  if (position.x > size.x + radius){
    vector.x = -borderFactor * (position.x - size.x - radius);
    // console.log('off right', this.container.position);
  }
  if (position.y > size.y + radius) {
    vector.y = -borderFactor * (position.y - size.y - radius);

    // console.log('off bottom', this.container.position);
  }
  // if (! (vector.length() === 0) ) {
  //   this.position.add(vector);
    // var segments = this.path.segments;
    // for (var i = 0; i < this.amount; i++) {
    //   segments[i].point += vector;
    // }
  // }
  // if (vector.length() !== 0) console.log('border vector ', vector);
  return vector;
};

// A method that calculates a steering vector towards a target
// Takes a second argument, if true, it slows down as it approaches
// the target
Boid.prototype.steer = function(target, slowdown) {
  var steer,
    desired = target.clone().sub(this.position);
    // console.log('desired is vector? ', desired instanceof PIXI.Vector);
  var distance = desired.length();
  // Two options for desired vector magnitude
  // (1 -- based on distance, 2 -- maxSpeed)
  if (slowdown && distance < 100) {
    // This damping is somewhat arbitrary:
    desired.setLength( this.maxSpeed * (1 / distance ) );
  } else {
    // desired.setLength( this.maxSpeed );
  }
  steer = desired.clone().sub(this.vector);
  steer.setLength( Math.min(this.maxForce, steer.length()) );

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
      steer.add( vector.multiplyScalar(1 / (distanceSq * distanceSq) ) );
      count++;
    }
  }
  // Average -- divide by how many
  if (count > 0)
    // console.log("separate steer count: " + count + " steer: " + steer.x + " " + steer.y);
    steer.divideScalar(count);
  if ( steer.length() !== 0 ) {
    // Implement Reynolds: Steering = Desired - Velocity
    steer.setLength(this.maxSpeed);
    steer.sub(this.vector);
    steer.setLength( Math.min(steer.length(), this.maxForce) );
    
    // console.log('steer length ', steer.length());
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
      // console.log(steer);
      count++;
    }
  }

  if (count > 0)
    steer.divideScalar(count);
  if (! (steer.length() === 0) ) {
    // Implement Reynolds: Steering = Desired - Velocity
    steer.setLength(this.maxSpeed);
    steer.sub(this.vector);
    steer.setLength( Math.min(steer.length(), this.maxForce) );
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
    // Square of distance to ease calculations
    var distanceSq = this.position.distanceToSq(other.position);
    if (distanceSq > 0 && distanceSq < neighborDist) {
      sum.add(other.position); // Add location
      count++;
    }
  }
  if (count > 0) {
    // console.log('sum ', sum, ' count', count);
    sum.divideScalar(count);
    // Steer towards the location
    return this.steer(sum, false);
  }
  return sum;
};

// (function() {
    var size = {
      x: window.innerWidth,
      y: window.innerHeight
    };
    // create an new instance of a pixi _stage - and set it to be interactive
    var _stage = new PIXI.Stage(0xd9e2cc);
    _stage.setInteractive(true);

    // create a _renderer instance
    var _renderer = PIXI.autoDetectRenderer(size.x, size.y);
    
    _renderer.view.style.width = size.x + "px";
    _renderer.view.style.height = size.y + "px";

    _renderer.view.style.display = "block";

    requestAnimFrame(animate);
    var renderTexture = new PIXI.RenderTexture(size.x, size.y);
    var renderTexture2 = new PIXI.RenderTexture(size.x, size.y);
    var currentTexture = renderTexture;

    var _target = new PIXI.DisplayObjectContainer();
    // _target.pivot = new PIXI.Point(LINE_SIZE / 2, LINE_SIZE / 2);
    // _target.position.x = size.x / 2;
    // _target.position.y = size.y / 2;
    // _target.rotation = degreesToRadians(45);
    _stage.addChild(_target);
    var outputSprite = new PIXI.Sprite(currentTexture);
    var count = 0;

    // _stage.addChild(outputSprite);

    // add render view to DOM
    // document.getElementById("canvas-holder").appendChild(_renderer.view);
    document.body.appendChild(_renderer.view);
    //Constants -
    var borderFactor = 3;
    var GRID_LINES = 17;
    var BOX_SIZE = 11;
    var BOX_PADDING = 3;
    var LINE_SIZE = GRID_LINES * (BOX_SIZE + BOX_PADDING);
    var HALF_BOX_SIZE = BOX_SIZE / 2;
    var BOX_COLOUR = 0x1f333a;
    var BOX_TWEEN_TIME = .1;
    var BOX_TWEEN_DELAY_STEP = 0.02;

    var BOX_REMOVE_TWEEN_TIME = .1;
    var BOX_REMOVE_TWEEN_TIME_STEP = 0.05;

    var _boxes = [];
    var _totalBoxes = GRID_LINES * 2;


    //Main loop -
    init();
    _stage.setInteractive(true);
    _stage.mousedown = _stage.touchstart = onMouseDown;


    function bringBoxesBackOn() {
        _boxes = shuffle(_boxes);

        for (var k = 0; k < _totalBoxes; k++) {
            var box = _boxes[k];
            _target.removeChild(box);
            _target.addChild(box);
            TweenLite.to(box.position, 1, {
                x: box.origX,
                y: box.origY,
                delay: (0.01 * k)
            });
        }
    }

    function init() {
      var boidContainers = [];
        // for (var i = 0; i < GRID_LINES; i++) {
        //     makeBox(i, false);
        //     makeBox(i, true);
        // }

        // _boxes = shuffle(_boxes);
        // var thisBox;
        // var boxDelay;

        // for (var k = 0; k < _totalBoxes; k++) {

        //     thisBox = _boxes[k];
        //     boxDelay = 1 + (BOX_TWEEN_DELAY_STEP * k);

        //     _target.addChild(thisBox);

        //     //fade them in, in order -
        //     TweenLite.to(thisBox, BOX_TWEEN_TIME / 2, {
        //         alpha: 1,
        //         delay: boxDelay
        //     });
        //     TweenLite.to(thisBox.myGraphics.scale, BOX_TWEEN_TIME, {
        //         x: 1,
        //         delay: boxDelay
        //     });
        // }

        // Add the boids:
        for (var i = 0; i < 200; i++) {
          var position = new PIXI.Point(Math.random() * size.x, Math.random() * size.y);
          // var position = new PIXI.Point(size.x/2 + Math.random(), size.y/2 + Math.random());
          var boid = new Boid(position, 4, 2);
          var boidContainer = new PIXI.DisplayObjectContainer();
          var boidGraphic = new PIXI.Graphics();
          boidGraphic.beginFill(0x002244);
          boidGraphic.drawCircle(0, 0, 4);
          boidGraphic.endFill();


          boidContainer.addChild(boidGraphic);
          boidContainer.alpha = boid.vector.length() / boid.maxSpeed;

          boid.container = boidContainer;
          boidContainers.push(boidContainer);

          boids.push(boid);
          
          _target.addChild(boidContainer);
          _stage.addChild(boidContainer);
        }
    }

    function makeBox(i, isVerticalBox) {

        var thisBox = new PIXI.DisplayObjectContainer();
        var boxGraphics = new PIXI.Graphics();
        boxGraphics.lineStyle(BOX_PADDING, 0xffffff, 1);
        boxGraphics.beginFill(BOX_COLOUR);
        boxGraphics.drawRect(-LINE_SIZE / 2, -HALF_BOX_SIZE - BOX_PADDING, LINE_SIZE, BOX_SIZE + BOX_PADDING);
        boxGraphics.endFill();

        boxGraphics.scale.x = 0;

        thisBox.addChild(boxGraphics);
        thisBox.myGraphics = boxGraphics;
        thisBox.myID = i;
        thisBox.isVertical = isVerticalBox;

        if (!isVerticalBox) {
            thisBox.position.y = i * (BOX_SIZE + BOX_PADDING) - HALF_BOX_SIZE;
            thisBox.position.x = Math.floor(GRID_LINES / 2) * (BOX_SIZE + BOX_PADDING) - HALF_BOX_SIZE;
        } else {
            thisBox.rotation = degreesToRadians(90);
            thisBox.position.y = Math.floor(GRID_LINES / 2) * (BOX_SIZE + BOX_PADDING) - HALF_BOX_SIZE;
            thisBox.position.x = i * (BOX_SIZE + BOX_PADDING) - HALF_BOX_SIZE;
        }

        thisBox.origY = thisBox.position.y;
        thisBox.origX = thisBox.position.x;

        thisBox.alpha = 0;

        _boxes.push(thisBox);
    }

    function onMouseDown() {
        groupTogether = !groupTogether;
    }

    function animate() {
        // var stats = document.getElementById('stats');
        // stats.innerHTML = '';
        requestAnimFrame(animate);

        // var temp = renderTexture;
        // renderTexture = renderTexture2;
        // renderTexture2 = temp;
        // _target.worldAlpha = .5;
        count += .01;
        // outputSprite.alpha *= Math.sin(count);
        // _target.rotation -= 0.01;
        // renderTexture.render(_stage, true);
        // outputSprite.setTexture(renderTexture);
        // outputSprite.scale.x = outputSprite.scale.y  = 1 + Math.sin(count) * .2;
        // renderTexture2.render(_stage, false);
        // outputSprite.alpha = .5;
        // outputSprite.scale = new PIXI.Point(.5,.5);
        // _renderer.render(_stage);

        // temp.render(outputSprite);
        // outputSprite.setTexture(temp);
        _renderer.render(_stage);

        for (var i = 0, l = boids.length; i < l; i++) {
          var boid = boids[i];

          if (groupTogether) {
            // boid.arrive(new PIXI.Vector(view.size.width/2, view.size.height/2))
            for (var i = 0, l = boids.length; i < l; i++) {
              var length = ((i + (count * 100)) / 30) % l * heartPath.length;
              var vector = heartPath[length];
              if (vector) {
                boid.arrive(vector);
              }
            }
          }
          boid.container.position = boid.position;
          boid.vector.normalize();

          boid.count += (1 + boid.flap);
          boid.container.alpha = 1.1 - ( 1 / (boid.vector.lengthSq() + 1) ) ;
          boid.container.rotation = boid.vector.rad() + .7707;

          var flapFactor = boid.count * boid.vector.lengthSq() * .3;
          boid.container.scale = new PIXI.Point(Math.sin(flapFactor) + .85, .6);

          boid.run(boids);
          // msg = stats.innerHTML;
          // stats.innerHTML = msg + '<p>' + boid.container.rotation + '</p>';
        }
    }

    //Helper function to convert degrees to radians.
    function degreesToRadians(deg) {
        return (deg * (Math.PI / 180));
    }

    //+ Jonas Raoni Soares Silva
    //@ http://jsfromhell.com/array/shuffle [v1.0]
    function shuffle(o) { //v1.0
        for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
        return o;
    }

// })();




var heartPath = [];
var steps = 30;
for (var i = 0; i < steps; i++) {
  heartPath.push(new PIXI.Vector(
    (view.size.width / 2) + 300 * Math.cos(2 * Math.PI * i / steps),
    (view.size.height / 2) + 300 * Math.sin(2 * Math.PI * i / steps)
  ));
}
console.log(heartPath);

// function onFrame(event) {
  // for (var i = 0, l = boids.length; i < l; i++) {
  //   if (groupTogether) {
  //     var length = ((i + event.count / 30) % l) / l * heartPath.length;
  //     var point = heartPath.getPointAt(length);
  //     if (point)
  //       boids[i].arrive(point);
  //   }
  //   boids[i].run(boids);
  // }
// }

// // Reposition the heart path whenever the window is resized:
// function onResize(event) {
//   heartPath.fitBounds(view.bounds);
//   heartPath.scale(0.8);
// }

// function onMouseDown(event) {
//   groupTogether = !groupTogether;
// }

// function onKeyDown(event) {
//   if (event.key == 'space') {
//     var layer = project.activeLayer;
//     layer.selected = !layer.selected;
//     return false;
//   }
// }