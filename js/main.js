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

function eraseBackground() {
  context.clearRect(0,0,canvas.width,canvas.height);
}

function drawBackground() {
   
}

function calculateFps() {
   var now = (+new Date),
       fps = 1000 / (now - lastTime);

   lastTime = now;

   return fps;
}

function update() {
  var context = canvas.getContext('2d');
  var collisionDamper = 1;
  var floorFriction = 0.0005 * timeDiff;
  var mouseForceMultiplier = 1 * timeDiff;
  var restoreForce = 0.002 * timeDiff;

  for(var n = 0; n < balls.length; ++n) {
    var ball = balls[n];
    // set ball position based on velocity
    ball.y += ball.vy;
    ball.x += ball.vx;

    if(ball.x > canvas.width || ball.y > canvas.height || ball.x < 0 || ball.y < 0){
      balls.splice(n, 1);
      balls.push(new Ball(200, 60, 0, 0, blue));

    };

    

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
   // var i = numDiscs,
   //     disc = null;

   // while(i--) {
   //    disc = discs[i];

   //    if (disc.x + disc.velocityX + disc.radius > context.canvas.width ||
   //        disc.x + disc.velocityX - disc.radius < 0) 
   //       disc.velocityX = -disc.velocityX;

   //    if (disc.y + disc.velocityY + disc.radius > context.canvas.height ||
   //        disc.y + disc.velocityY - disc.radius  < 0) 
   //       disc.velocityY= -disc.velocityY;

   //    disc.x += disc.velocityX;
   //    disc.y += disc.velocityY;
   // }
}

function drawBall(balls) {
   for(var n = 0; n < balls.length; n++) {
    var ball = balls[n];
    context.beginPath();
    context.arc(ball.x, ball.y, ball.radius, 0, 2 * Math.PI, false);
    context.fillStyle = ball.color;
    context.fill();
  }
}

function draw() {
  for(var n = 0; n < balls.length; n++) {
    var ball = balls[n];
    context.beginPath();
    context.arc(ball.x, ball.y, ball.radius, 0, 2 * Math.PI, false);
    context.fillStyle = ball.color;
    context.fill();
  }
}



function animate() {
   var now = (+new Date),
       fps = 0;

   if (!paused) {
      eraseBackground();
      drawBackground();
      update();
      draw();

      // fps = calculateFps();

      // if (now - lastFpsUpdateTime > 1000) {
      //    lastFpsUpdateTime = now;
      //    lastFpsUpdate = fps;
      // }
      // context.fillStyle = 'cornflowerblue';
      // context.fillText(lastFpsUpdate.toFixed() + ' fps', 45, 50);
   }
   if (window.webkitRequestAnimationFrame !== undefined) {
      window.webkitRequestAnimationFrame(animate);
   }
   else if (window.mozRequestAnimationFrame !== undefined) {
      window.mozRequestAnimationFrame(animate);
   }
}


//global functions
var blue = '#3A5BCD';
var red = '#EF2B36';
var yellow = '#FFC636';
var green = '#02A817';

var canvas = document.querySelector('#canvas'),
  context = canvas.getContext('2d'),
  balls = []

balls.push(new Ball(180, 60, 0, 0, blue));
var numBalls = balls.length;
var date = new Date();
var time = date.getTime();

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

animate();
