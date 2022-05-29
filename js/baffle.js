function Baffle(length, color, cx) {
  this.length = length;
  this.thickness = 2;
  this.cx = cx;
  this.start = new Vector(-this.length / 2, 0);
  this.end = new Vector(this.length / 2, 0);
  this.theta = 0;
  this.color = color;
  this.rotateRequest = null;
  this.rotating = false;
  // this.direction = null;
}

Baffle.prototype.display = function () {
  var cx = this.cx;
  cx.strokeStyle = this.color;
  cx.lineWidth = this.thickness;
  cx.beginPath();
  cx.moveTo(this.start.x, this.start.y);
  cx.lineTo(this.end.x, this.end.y);
  cx.stroke();
}

Baffle.prototype.disappear = function () {
  var cx = this.cx;
  cx.strokeStyle = cx.canvas.style.backgroundColor;
  cx.lineWidth = 4 * this.thickness;
  cx.beginPath();
  cx.moveTo(this.start.x, this.start.y);
  cx.lineTo(this.end.x, this.end.y);
  cx.stroke();
}

Baffle.prototype.rotate0 = function (clockwise) {
  if (this.rotateRequest) cancelAnimationFrame(this.rotateRequest);
  var step = clockwise ? 0.05 : -0.05;
  var self = this;
  function animate() {
    self.disappear();
    self.theta += step;
    self.setStartAndEnd();
    self.display();
    // if (ballHitsBaffle(ball, self))
    // cancelAnimationFrame(self.rotateRequest);
    // else
    self.rotateRequest = requestAnimationFrame(animate);
  }
  this.rotateRequest = requestAnimationFrame(animate);
}

Baffle.prototype.rotate = function (direction) {
  var step;
  if (direction === 'clockwise')
    step = 0.04;
  else if (direction === 'anticlockwise')
    step = -0.04;
  else return;
  this.disappear();
  this.theta += step;
  this.setStartAndEnd();
  this.display();
}

Baffle.prototype.setStartAndEnd = function () {
  this.end.x = this.length / 2 * Math.cos(this.theta);
  this.end.y = this.length / 2 * Math.sin(this.theta);
  this.start.x = -this.end.x;
  this.start.y = -this.end.y;
}

Baffle.prototype.stopRotating = function () {
  cancelAnimationFrame(this.rotateRequest);
  // this.rotateRequest = null;
}

Baffle.prototype.reset = function () {
  this.theta = 0;
  this.setStartAndEnd();
}