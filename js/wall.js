function Wall(radius, color, holesOptions, cx) {
  this.radius = radius;
  this.thickness = 0.01 * radius;
  this.color = color;
  this.cx = cx;
  this.holes = [];
  this.setHoles(holesOptions);
}

Wall.prototype.display = function () {
  var cx = this.cx;
  cx.strokeStyle = this.color;
  cx.lineWidth = this.thickness;
  cx.beginPath();
  cx.arc(0, 0, this.radius, 0, 2 * Math.PI);
  cx.stroke();
  this.displayHoles();
}

Wall.prototype.setHoles = function (holesOptions) {
  //尽量不要让x轴穿过洞口
  if (this.holes.length > 0) this.holes.length = 0;
  var gap = 2 * Math.PI / holesOptions.holesNum;
  var sAngle, eAngle;
  for (var i = 0; i < holesOptions.holesNum; i++) {
    sAngle = i * gap + holesOptions.startAngle;
    if (sAngle >= Math.PI) { // >= 不可改成 >
      sAngle -= 2 * Math.PI;//把sAngle控制在[-PI, PI]范围内
    }
    eAngle = sAngle + holesOptions.holeAngle;
    this.holes.push(new Hole(sAngle, eAngle));
  }
}

Wall.prototype.displayHoles = function () {
  var cx = this.cx;
  cx.strokeStyle = cx.canvas.style.backgroundColor;
  cx.lineWidth = this.thickness * 1.5;
  for (var i = 0, n = this.holes.length; i < n; i++) {
    cx.beginPath();
    cx.arc(0, 0, this.radius, this.holes[i].sAngle, this.holes[i].eAngle);
    cx.stroke();
  }
}