function Ball(center, radius, color, cx) {
  this.center = center;
  this.radius = radius;
  this.cx = cx;
  this.color = color;
  this.goRequest = null;
  this.speed = 3;
  this.velocity = new Vector(0, -1);
  this.last_d2baffle = this.current_d2baffle = Math.abs(center.y);
  this.last_d2origin = this.current_d2origin = Math.abs(center.y);
}

Ball.prototype.display = function () {
  var cx = this.cx;
  // cx.fillStyle='orange';
  cx.fillStyle = this.color;
  cx.beginPath();
  cx.arc(this.center.x, this.center.y, this.radius, 0, 2 * Math.PI, true);
  // cx.closePath();
  cx.fill();
};

Ball.prototype.disappear = function () {
  var cx = this.cx;
  cx.fillStyle = cx.canvas.style.backgroundColor;
  // cx.strokeStyle = cx.canvas.style.backgroundColor;
  // cx.lineWidth = 1.5;
  cx.beginPath();
  cx.arc(this.center.x, this.center.y, this.radius * 1.1, 0, 2 * Math.PI, true);
  // cx.closePath();
  cx.fill();
  // cx.stroke();
};

Ball.prototype.go = function () {
  this.disappear();
  var vx, vy, v;
  vx = this.velocity.x; vy = this.velocity.y;
  v = Math.sqrt(vx * vx + vy * vy);
  vx = this.speed * (vx / v); vy = this.speed * (vy / v);
  this.center.x += vx; this.center.y += vy;
  this.display();
}

// Ball.prototype.stop = function() { 
// 	cancelAnimationFrame(this.goRequest);
// 	// this.goRequest = null;
// }

Ball.prototype.hitsBaffle = function (baffle) {
  var x = this.center.x, y = this.center.y;

  // 球心与原点的连线与x轴正方向的夹角，范围：(-PI, PI].
  var ball_angle = this.center.getPrincipalArgument();
  var d2origin = Math.sqrt(x * x + y * y); // 球心到原点的距离。
  // if (d2origin > baffle.length / 2) this.canHitBaffle = true;//当小球越过那个范围后，让它可以碰撞挡板。
  var d2baffle = d2origin * Math.abs(Math.sin(baffle.theta - ball_angle));
  var d2origin_cos = d2origin * Math.abs(Math.cos(baffle.theta - ball_angle));
  // console.log(d2baffle, ' ', d2origin_cos);
  this.last_d2baffle = this.current_d2baffle;
  this.current_d2baffle = d2baffle;

  // 小球在接近挡板。若不加这条判断，会造成小球沿着挡板缓慢移动的怪异现象。
  if (this.current_d2baffle < this.last_d2baffle) {
    // 有时小球在远离挡板，但也满足下面的条件，这种情况并不是在碰撞挡板。
    if (d2baffle <= baffle.thickness / 2 + this.radius * 1.8 && d2origin_cos <= baffle.length / 2) {
      // this.canHitBaffle = false;
      return true;
    }
  }
}

Ball.prototype.hitsWall = function (wall) {
  // 球心与原点的连线与x轴正方向的夹角，范围：(-PI, PI].
  var ball_angle = this.center.getPrincipalArgument();
  var holes = wall.holes;
  for (var i = 0, n = holes.length; i < n; i++) {
    if (ball_angle < holes[i].sAngle || ball_angle > holes[i].eAngle) continue;
    if (ball_angle >= holes[i].sAngle && ball_angle <= holes[i].eAngle) return false;
  }
  var x = this.center.x, y = this.center.y;
  var d2origin = Math.sqrt(x * x + y * y); // 球心到原点的距离。
  this.last_d2origin = this.current_d2origin;
  this.current_d2origin = d2origin;

  // 小球在远离原点，即在（从内向外）接近墙。若不加这条判断，会造成小球沿着墙缓慢移动的怪异现象。
  if (this.current_d2origin > this.last_d2origin) {
    // 有时小球在靠近原点，但也满足下面的条件，这种情况并不是在（从内向外）碰撞墙。
    if (d2origin + this.radius * 1.5 >= wall.radius) return true;
  }
}

Ball.prototype.hitsEnemy = function (enemy) {
  var enemyCenter = enemy.getCenter();
  var x1 = this.center.x, y1 = this.center.y,
    x2 = enemyCenter.x, y2 = enemyCenter.y;
  var d = Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
  if (d <= this.radius + enemy.radius) return true;
}

Ball.prototype.rebound = function (theta) {
  // 球的速度在以球心为原点的坐标系中的主辐角，范围：(-PI, PI].
  var velocityArg = this.velocity.getPrincipalArgument();
  velocityArg = 2 * theta - velocityArg;
  return new Vector(Math.cos(velocityArg), Math.sin(velocityArg));
}

Ball.prototype.getWallTheta = function () {
  // 球心与原点的连线与x轴正方向的夹角，范围：(-PI, PI].
  var ball_angle = this.center.getPrincipalArgument();
  return ball_angle + Math.PI / 2;
}

Ball.prototype.outsideOfWall = function (wall) {
  var x = this.center.x, y = this.center.y;
  var d2origin = Math.sqrt(x * x + y * y); // 球心到原点的距离。
  if (d2origin - this.radius > wall.radius) return true;
}