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
  

  for(var n = 0; n < balls.length; n++) {
    var ball = balls[n];

    if(ball.x > canvas.width || ball.y > canvas.height || ball.x < 0 || ball.y < 0){
      balls.splice(n, 1);
      balls.push(new Ball(500, 300, 0, 0, blue));
    }

    radius = 20

    distanceBallandMouse = Math.sqrt(Math.pow((mousePos.currX-ball.x),2)+Math.pow((mousePos.currY-ball.y),2));

    var angle = 0;
    if (distanceBallandMouse < 20){

      var dirX = mousePos.currX-ball.x;
      var dirY = mousePos.currY-ball.y;
      angle = Math.atan(Math.abs(dirY)/Math.abs(dirX));

      if (dirX > 0){
        ball.vx = -Math.cos(angle)*mouseVelMag;
      }
      else {
        ball.vx = Math.cos(angle)*mouseVelMag;
      }

      if (dirY > 0){
        ball.vy = -Math.sin(angle)*mouseVelMag;  
      }
      else {
        ball.vy = Math.sin(angle)*mouseVelMag;
      }
      // console.log("angle: " + angle);
      // console.log("-----------------");
      // console.log("mousevel.x: " + mouseVel.x);
      // console.log("mousevel.y: " + mouseVel.y);
      // console.log("-----------------");
      // console.log("ball.x: " + ball.vx);
      // console.log("ball.y: " + ball.vy); 
      // console.log("-----------------");
   
    }
      ball.x += ball.vx;
      ball.y += ball.vy;
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
  this.radius = 20;
}

function animate(canvas, balls, lastTime, mousePos) {
  var context = canvas.getContext('2d');

  //time check
  date = new Date();
  time = date.getTime();
  timeDiff = time - lastTime;
  lastTime = time;
  
  //mouse 
  updateBalls(canvas, balls, timeDiff, mousePos);
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

var mouseMass = 10;
var ballMass = 5;
var canvas = document.getElementById('canvas');
var balls = initBalls(500, 300,0,0,blue);
var date = new Date();
var time = date.getTime();
var timeDiff = 0;
var lastTime = time;

var mouseCount = 0;

var mouseVel = {
  x: 0,
  y: 0
}

var mouseVelMag = 0;

var mousePos = {
  currX : 9999,
  currY : 9999,
  prevX : 9999,
  prevY : 9999
};

canvas.addEventListener('mousemove', function(evt) {
  var pos = getMousePos(canvas, evt);
  mousePos.currX = pos.x;
  mousePos.currY = pos.y;
  time = date.getTime();
  timeDiff = time - lastTime;    // right now need to reduce the refresh rate. 
  lastTime = time;
  var stepsize = 10;
  if(timeDiff > stepsize){
    mouseVel.x += ((mousePos.currX - mousePos.prevX) / timeDiff * stepsize);
    mouseVel.y += ((mousePos.currY - mousePos.prevY) / timeDiff * stepsize);
    mouseCount++; 
    if (mouseCount > stepsize){ 
    	mouseVel.x = mouseVel.x/stepsize;
    	mouseVel.y = mouseVel.y/stepsize;
      mouseCount = 0;
    }
  }
  mouseVelMag = Math.sqrt(Math.pow(mouseVel.x, 2)+Math.pow(mouseVel.y, 2));
  mousePos.prevX = mousePos.currX;
  mousePos.prevY = mousePos.currY;
});

canvas.addEventListener('mouseout', function(evt) {
  mouseVel.x = 0;
  mouseVel.y = 0;
});

animate(canvas, balls, time, mousePos);