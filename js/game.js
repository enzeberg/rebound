function Game(ballRadius, cx) {
  this.ballRadius = ballRadius;
  this.cx = cx;
  this.inputManager = new InputManager();
  this.levelManager = new LevelManager;
  this.uiManager = new UIManager;
  this.prepare();
  this.start();
}

Game.prototype.prepare = function () {
  // this.started = false;
  this.prepareBaffle();
  this.prepareBall();
  this.prepareWall();
  this.prepareEnemy();
}

Game.prototype.start = function () {
  this.moveBall();
  // this.rotateBaffle();
  // this.inputManager.on('rotate', this.baffle.rotate.bind(this.baffle));
  this.inputManager.on('rotateBaffle', this.rotateBaffle.bind(this));
  this.inputManager.on('stopRotatingBaffle', this.stopRotatingBaffle.bind(this));
  this.inputManager.on('replay', this.replay.bind(this));
  this.inputManager.on('gotoNextLevel', this.gotoNextLevel.bind(this));
  // this.started = true;
}

Game.prototype.prepareBaffle = function () {

  this.baffle = new Baffle(10 * this.ballRadius, 'burlywood', this.cx);
  this.baffle.display();
}

Game.prototype.prepareBall = function () {
  var center = new Vector(0, -this.baffle.thickness / 2 - this.ballRadius);
  this.ball = new Ball(center, this.ballRadius, 'lightblue', this.cx);
  this.ball.display();
}

Game.prototype.prepareWall = function () {
  var holesOptions = this.levelManager.getLevelHolesOptions();
  this.wall = new Wall(20 * this.ballRadius, 'olive', holesOptions, this.cx);
  this.wall.display();
}

Game.prototype.prepareEnemy = function () {
  var d2origin = this.wall.radius / 2,
    argument = this.levelManager.level;
  this.enemy = new Enemy(d2origin, argument, this.ballRadius, 'red', this.cx);
  this.enemy.display();
}

Game.prototype.moveBall = function () {
  var ball = this.ball,
    baffle = this.baffle,
    wall = this.wall, enemy = this.enemy;
  var self = this;
  // if (ball.goRequest) cancelAnimationFrame(ball.goRequest);
  var newVelocity;
  function animate() {
    ball.go();
    if (ball.hitsBaffle(baffle)) {
      // baffle.display();
      newVelocity = ball.rebound(baffle.theta);
      ball.velocity.x = newVelocity.x;
      ball.velocity.y = newVelocity.y;
    } else if (ball.hitsWall(wall)) {
      // console.log('hits wall');
      newVelocity = ball.rebound(ball.getWallTheta());
      ball.velocity.x = newVelocity.x;
      ball.velocity.y = newVelocity.y;
    }
    if (ball.outsideOfWall(wall)) {
      self.win();
      // return();
    } else if (ball.hitsEnemy(enemy)) {
      self.lose();
    } else ball.goRequest = requestAnimationFrame(animate);
  }
  ball.goRequest = requestAnimationFrame(animate);
}

Game.prototype.rotateBaffle = function (direction) { // event listener for 'rotateBaffle' event
  if (this.baffle.rotating) return; // if the baffle is rotating, ignore the event
  var baffle = this.baffle;
  baffle.rotating = true;
  function animate() {
    baffle.rotate(direction);
    baffle.rotateRequest = requestAnimationFrame(animate);
  }
  baffle.rotateRequest = requestAnimationFrame(animate);

}

// event listener for 'stopRotatingBaffle' event
Game.prototype.stopRotatingBaffle = function () {
  var baffle = this.baffle;
  baffle.stopRotating();
  baffle.rotating = false;
}

Game.prototype.win = function () {
  // cancelAnimationFrame(this.baffle.rotateRequest);
  cancelAnimationFrame(this.ball.goRequest);
  if (this.levelManager.levelsOver()) this.uiManager.passAllLevels();
  else this.uiManager.win();
}

Game.prototype.lose = function () {
  // cancelAnimationFrame(this.baffle.rotateRequest);
  cancelAnimationFrame(this.ball.goRequest);
  this.uiManager.lose();
}

Game.prototype.replay = function () { // event listener for 'replay' event
  this.uiManager.removeDialog();
  this.uiManager.clearContext(this.cx);
  this.resetCurrentLevel();
  this.moveBall();
}

Game.prototype.gotoNextLevel = function () { // event listener for 'gotoNextLevel' event

  this.levelManager.nextLevel();
  this.uiManager.updateLevel(this.levelManager.level);
  this.uiManager.removeDialog();
  this.uiManager.clearContext(this.cx);
  this.resetBaffleAndBall();

  this.wall.setHoles(this.levelManager.getLevelHolesOptions());
  this.wall.display();

  var wallR = this.wall.radius;
  this.enemy.changeArgument(this.levelManager.level);
  this.enemy.becomeBigger();
  this.enemy.display();

  this.moveBall();
}

Game.prototype.resetCurrentLevel = function () {
  // this.started = false;
  this.resetBaffleAndBall();
  this.enemy.display();
  this.wall.display();
}

Game.prototype.resetBaffleAndBall = function () { // 每一关的baffle和ball的初始状态都是一样的。
  var baffle = this.baffle,
    ball = this.ball;
  baffle.theta = 0;
  baffle.setStartAndEnd();
  ball.center.x = 0;
  ball.center.y = -this.baffle.thickness / 2 - this.ballRadius;
  ball.velocity.x = 0;
  ball.velocity.y = -1;
  baffle.display();
  ball.display();
}