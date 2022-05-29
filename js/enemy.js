function Enemy(d2origin, argument, radius, color, cx) {
  this.d2origin = d2origin;
  this.argument = argument;
  this.radius = radius;
  this.color = color;
  this.cx = cx;
}

Enemy.prototype.display = function () {
  var cx = this.cx;
  // cx.fillStyle='orange';
  cx.fillStyle = this.color;
  cx.beginPath();
  var center = this.getCenter();
  cx.arc(center.x, center.y, this.radius, 0, 2 * Math.PI, true);
  cx.closePath();
  cx.fill();
};

// Enemy.prototype.setCenter = function(x, y) {
//  this.center.x = x; this.center.y = y;
// }

Enemy.prototype.getCenter = function () {
  return new Vector(this.d2origin * Math.cos(this.argument), this.d2origin * Math.sin(this.argument));
}

Enemy.prototype.becomeBigger = function () {
  this.radius += this.radius / 8;
}

Enemy.prototype.changeArgument = function (game_level) {
  this.argument = game_level;
  var center = this.getCenter();

  // 避免敌人出现在小球竖直向上运动的轨迹附近
  if (Math.abs(center.getPrincipalArgument() - (-Math.PI / 2)) < Math.PI / 6) {
    this.argument += Math.PI / 3;
  }
}