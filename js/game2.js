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

// function mouseEvent(){
//   canvas.addEventListener('mousemove', function(evt) {
//     var pos = getMousePos(canvas, evt);
//     mousePos.currX = pos.x;
//     mousePos.currY = pos.y;
//   });

//   canvas.addEventListener('mouseout', function(evt) {
//     mousePos.x = 9999;
//     mousePos.y = 9999;
//   });

//   //calculate mouse velocity do this globally
//   //mouseDisX = currX - prevX
//   //mouseDisY = currY - prevY

//   //mouseVx = mouseDisX / timeDiff
//   //mouseVy = mouseDixy / timeDiff

//   //check mouse collision with ball
//   var distX = ball.x - mousePOS.currX;
//   var distY = ball.y - mousePOS.currY;

//   if(disX < ball.radius){
//     ball.vx = 
//   }

    
// }

function updateBalls(canvas, balls, timeDiff, mousePos) {
  var context = canvas.getContext('2d');
  

  for(var n = 0; n < balls.length; n++) {
    var ball = balls[n];

    ball.y += ball.vy;
    ball.x += ball.vx;

    if(ball.x > canvas.width || ball.y > canvas.height || ball.x < 0 || ball.y < 0){
      balls.splice(n, 1);
      balls.push(new Ball(200, 60, 0, 0, blue));
    }

    ball.x += (mouseVel.x / 60);
    ball.y += (mouseVel.y / 60);

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
var balls = initBalls(173,60,0,0,blue);
var date = new Date();
var time = date.getTime();
var timeDiff = 0;
var lastTime = time;
/*
 * set mouse position really far away
 * so the mouse forces are nearly obsolete
 */
var mouseVel = {
  x: 0,
  y: 0
}

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
    if(timeDiff > 10){
      mouseVel.x = (mousePos.currX - mousePos.prevX) / timeDiff * 1000;
      mouseVel.y = (mousePos.currY - mousePos.prevY) / timeDiff * 1000;
    }
    mousePos.prevX = mousePos.currX;
    mousePos.prevY = mousePos.currY;
    // if((mousePos.prevX === mousePos.currX) && (mousePos.prevY === mousePos.currY)){
    //   mouseVel.x = 0;
    //   mouseVel.y = 0;
    // }
    console.log(mouseVel.x);
    console.log(mouseVel.y);
    console.log('--------');
    // console.log(mousePos.currX);
    // console.log(mousePos.currY);
    // console.log(timeDiff);
  });

  canvas.addEventListener('mouseout', function(evt) {
    mousePos.currX = 9999;
    mousePos.currY = 9999;
    mousePos.prevX = 9999,
    mousePos.prevY = 9999,
    mouseVel.x = 0;
    mouseVel.y = 0;
  });

animate(canvas, balls, time, mousePos);