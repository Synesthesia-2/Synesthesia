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
    var strength = Math.random();
    this.acceleration = new PIXI.Vector();
    this.vector = new PIXI.Vector(Math.random(), Math.random()).multiplyScalar(5).add(new PIXI.Vector(4,4));
    this.position = position.clone();
    this.radius = 30;
    this.maxSpeed = maxSpeed + strength;
    this.maxForce = maxForce + strength;
    this.amount = strength * 10 + 10;
    this.count = 0;
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
  var separation = this.separate(boids).multiplyScalar(.03);
  var alignment = this.align(boids).multiplyScalar(.5);
  var cohesion = this.cohesion(boids).multiplyScalar(.8);
  var borders = this.borders().multiplyScalar(1);
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
  if (vector.length() !== 0) console.log('border vector ', vector);
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
    desired.setLength( this.maxSpeed * (distance / 100) );
  } else {
    desired.setLength( this.maxSpeed );
  }
  steer = desired.clone().sub(this.vector);
  steer.setLength( Math.min(this.maxForce, steer.length()) );

  return steer;
};

Boid.prototype.separate = function(boids) {
  var desiredSeperation = 30;
  var steer = new PIXI.Vector(0, 0);
  var count = 0;
  // For every boid in the system, check if it's too close
  for (var i = 0, l = boids.length; i < l; i++) {
    var other = boids[i];
    // since this. and other. poisition are PIXI.Points, need to create a new Vector out of that point
    var vector = new PIXI.Vector(this.position.clone().sub(other.position));
    var distance = vector.length();
    if (distance > 0 && distance < desiredSeperation) {
      // Calculate vector pointing away from neighbor
      steer.add( vector.normalize(1 / distance) );
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
  var neighborDist = 25*25;
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
  var neighborDist = 60 * 60;
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
    var _stage = new PIXI.Stage(0x000000);
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

    var outputSprite = new PIXI.Sprite(currentTexture);
    var count = 0;

    _stage.addChild(outputSprite);

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

    // var _target = new PIXI.DisplayObjectContainer();
    // _target.pivot = new PIXI.Point(LINE_SIZE / 2, LINE_SIZE / 2);
    // _target.position.x = size.x / 2;
    // _target.position.y = size.y / 2;
    // _target.rotation = degreesToRadians(45);
    // _stage.addChild(_target);

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
        for (var i = 0; i < 10; i++) {
          var position = new PIXI.Point(Math.random() * size.x, Math.random() * size.y);
          // var position = new PIXI.Point(size.x/2 + Math.random(), size.y/2 + Math.random());
          var boid = new Boid(position, 6, .5);
          var boidContainer = new PIXI.DisplayObjectContainer();
          var boidGraphic = new PIXI.Graphics();
          boidGraphic.beginFill(0xff00ff);
          boidGraphic.drawCircle(0, 0, 6);
          boidGraphic.endFill();


          boidContainer.addChild(boidGraphic);
          boidContainer.alpha = boid.vector.normalize().length();

          boid.container = boidContainer;
          boidContainers.push(boidContainer);

          boids.push(boid);
          
          // _target.addChild(boidContainer);
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
        var box;
        var mult;
        for (var i = _boxes.length - 1; i >= 0; i--) {
            box = _boxes[i];
            mult = (Math.random() > 0.5) ? -1 : 1;
            if (box.isVertical) {
                TweenLite.to(box.position, BOX_REMOVE_TWEEN_TIME, {
                    y: box.origY + (LINE_SIZE * mult),
                    delay: BOX_REMOVE_TWEEN_TIME_STEP * (_boxes.length - i)
                });
            } else {
                TweenLite.to(box.position, BOX_REMOVE_TWEEN_TIME, {
                    x: box.origX + (LINE_SIZE * mult),
                    delay: BOX_REMOVE_TWEEN_TIME_STEP * (_boxes.length - i)
                });
            }

            if (i === 0) {
                TweenLite.delayedCall((BOX_REMOVE_TWEEN_TIME_STEP * _totalBoxes) + 0.5, bringBoxesBackOn);
            }
        }
    }

    function animate() {
        var stats = document.getElementById('stats');
        stats.innerHTML = '';
        requestAnimFrame(animate);

        // var temp = renderTexture;
        // renderTexture = renderTexture2;
        // renderTexture2 = temp;
        // _stage.worldAlpha = .5;
        count += .01;
        // outputSprite.alpha *= Math.sin(count);
        // _target.rotation -= 0.01;
        // renderTexture.render(_stage, true);
        // outputSprite.setTexture(renderTexture);
        // outputSprite.scale.x = outputSprite.scale.y  = 1 + Math.sin(count) * 0.2;
        // renderTexture2.render(_stage, false);

        _renderer.render(_stage);

        // renderTexture.render(outputSprite);
        // _renderer.render(_stage);

        for (var i = 0, l = boids.length; i < l; i++) {
          if (groupTogether) {
            var length = ((i + event.count / 30) % l) / l * heartPath.length;
            var point = heartPath.getPointAt(length);
            if (point)
              boids[i].arrive(point);
          }
          boids[i].container.position = boids[i].position;

          boids[i].container.alpha = Math.abs(boids[i].vector.normalize().x)/2 + Math.abs(boids[i].vector.normalize().y)/2;
          boids[i].run(boids);
          msg = stats.innerHTML;
          stats.innerHTML = msg + '<p>' + parseInt(boids[i].position.x) + ' ' + parseInt(boids[i].position.y) + '</p>';
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




// var heartPath = new paper.Path('M514.69629,624.70313c-7.10205,-27.02441 -17.2373,-52.39453 -30.40576,-76.10059c-13.17383,-23.70703 -38.65137,-60.52246 -76.44434,-110.45801c-27.71631,-36.64355 -44.78174,-59.89355 -51.19189,-69.74414c-10.5376,-16.02979 -18.15527,-30.74951 -22.84717,-44.14893c-4.69727,-13.39893 -7.04297,-26.97021 -7.04297,-40.71289c0,-25.42432 8.47119,-46.72559 25.42383,-63.90381c16.94775,-17.17871 37.90527,-25.76758 62.87354,-25.76758c25.19287,0 47.06885,8.93262 65.62158,26.79834c13.96826,13.28662 25.30615,33.10059 34.01318,59.4375c7.55859,-25.88037 18.20898,-45.57666 31.95215,-59.09424c19.00879,-18.32178 40.99707,-27.48535 65.96484,-27.48535c24.7373,0 45.69531,8.53564 62.87305,25.5957c17.17871,17.06592 25.76855,37.39551 25.76855,60.98389c0,20.61377 -5.04102,42.08691 -15.11719,64.41895c-10.08203,22.33203 -29.54687,51.59521 -58.40723,87.78271c-37.56738,47.41211 -64.93457,86.35352 -82.11328,116.8125c-13.51758,24.0498 -23.82422,49.24902 -30.9209,75.58594z');

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