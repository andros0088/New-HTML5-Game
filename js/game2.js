window.requestAnimFrame = (function(callback) {
        return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
        function(callback) {
          window.setTimeout(callback, 1000 / 60);
        };
      })();

  var blue = '#3A5BCD';
  var red = '#EF2B36';
  var yellow = '#FFC636';
  var green = '#02A817';

function initBalls(x, y, vx, vy, color) {
  balls = [];
  balls.push(new Ball(x, y, vx, vy, color));
  return balls;
}

function getMousePos(canvas, evt) {
  // get canvas position
  var obj = canvas;
  var top = 0;
  var left = 0;
  while(obj.tagName != 'BODY') {
    top += obj.offsetTop;
    left += obj.offsetLeft;
    obj = obj.offsetParent;
  }

  // return relative mouse position
  var mouseX = evt.clientX - left + window.pageXOffset;
  var mouseY = evt.clientY - top + window.pageYOffset;
  return {
    x: mouseX,
    y: mouseY
  };
}

function updateBalls(canvas, balls, timeDiff, mousePos) {
  var context = canvas.getContext('2d');
  var collisionDamper = 1;
  var floorFriction = 0.0005 * timeDiff;
  var mouseForceMultiplier = 1 * timeDiff;
  var restoreForce = 0.002 * timeDiff;

  for(var n = 0; n < balls.length; n++) {
    var ball = balls[n];
    // set ball position based on velocity
    ball.y += ball.vy;
    ball.x += ball.vx;

    if(ball.x > canvas.width || ball.y > canvas.height || ball.x < 0 || ball.y < 0){
      balls.splice(n, 1);
      balls.push(new Ball(200, 60, 0, 0, blue));
    }

    // mouse forces
    var mouseX = mousePos.x;
    var mouseY = mousePos.y;

    var distX = ball.x - mouseX;
    var distY = ball.y - mouseY;

    var radius = Math.sqrt(Math.pow(distX, 2) + Math.pow(distY, 2));

    var totalDist = Math.abs(distX) + Math.abs(distY);

    var forceX = (Math.abs(distX) / totalDist) * (1 / radius) * mouseForceMultiplier;
    var forceY = (Math.abs(distY) / totalDist) * (1 / radius) * mouseForceMultiplier;

    if(distX > 0) {// mouse is left of ball
      ball.vx += forceX;
    }
    else {
      ball.vx -= forceX;
    }
    if(distY > 0) {// mouse is on top of ball
      ball.vy += forceY;
    }
    else {
      ball.vy -= forceY;
    }

    // floor friction
    if(ball.vx > 0) {
      ball.vx -= floorFriction;
    }
    else if(ball.vx < 0) {
      ball.vx += floorFriction;
    }
    if(ball.vy > 0) {
      ball.vy -= floorFriction;
    }
    else if(ball.vy < 0) {
      ball.vy += floorFriction;
    }

  }
}

function Ball(x, y, vx, vy, color) {
  this.x = x;
  this.y = y;
  this.vx = vx;
  this.vy = vy;
  this.color = color;
  this.origX = x;
  this.origY = y;
  this.radius = 10;
}

function animate(canvas, balls, lastTime, mousePos) {
  var context = canvas.getContext('2d');

  // update
  var date = new Date();
  var time = date.getTime();
  var timeDiff = time - lastTime;
  updateBalls(canvas, balls, timeDiff, mousePos);
  lastTime = time;

  // clear
  context.clearRect(0, 0, canvas.width, canvas.height);

  // render
  for(var n = 0; n < balls.length; n++) {
    var ball = balls[n];
    context.beginPath();
    context.arc(ball.x, ball.y, ball.radius, 0, 2 * Math.PI, false);
    context.fillStyle = ball.color;
    context.fill();
  }

  // request new frame
  requestAnimFrame(function() {
    animate(canvas, balls, lastTime, mousePos);
  });
}

var canvas = document.getElementById('canvas');
var balls = initBalls(173,60,0,0,blue);
var date = new Date();
var time = date.getTime();
/*
 * set mouse position really far away
 * so the mouse forces are nearly obsolete
 */
var mousePos = {
  x: 9999,
  y: 9999
};

canvas.addEventListener('mousemove', function(evt) {
  var pos = getMousePos(canvas, evt);
  mousePos.x = pos.x;
  mousePos.y = pos.y;
});

canvas.addEventListener('mouseout', function(evt) {
  mousePos.x = 9999;
  mousePos.y = 9999;
});
animate(canvas, balls, time, mousePos);