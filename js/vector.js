function Vector(x, y) { // sometimes a vector takes the place of a point.
  this.x = x;
  this.y = y;
}

Vector.prototype.getPrincipalArgument = function () { // 获得主辐角，范围：(-PI, PI]。
  var x = this.x,
    y = this.y;
  var principalArgument = Math.atan(y / x);
  if (x < 0 && y >= 0) {
    principalArgument += Math.PI;
  } else if (x < 0 && y < 0) {
    principalArgument -= Math.PI;
  } else if (x === 0 && y > 0) {
    principalArgument = Math.PI / 2;
  } else if (x === 0 && y < 0) {
    principalArgument = -Math.PI / 2;
  }
  return principalArgument;
}