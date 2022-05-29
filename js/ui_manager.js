function UIManager() {
  this.cv = document.querySelector('canvas');
  this.dialogContainer = document.querySelector('.dialog-container')
  this.dialog = this.dialogContainer.querySelector('.dialog');

  this.dialogMsg = this.dialog.querySelector('.msg');
  this.nextLevelBtn = this.dialog.querySelector('.next-level-btn');
  this.replayBtn = this.dialog.querySelector('.replay-btn');
  // this.dialogBtn = dialog.querySelector('.btn');
  // this.dialogImg = dialog.querySelector('img');
}

UIManager.prototype.win = function () {
  this.dialogMsg.innerText = 'Congratulations, you win!';
  // this.dialogBtn.innerText = 'Next Level';
  // this.dialogImg.src = './images/next_level.png';
  this.nextLevelBtn.style.display = 'block';
  this.dialogContainer.style.display = 'block';
}

UIManager.prototype.lose = function () {
  // cx.clearRect(-cv.width/2, -cv.height/2, cv.width, cv.height);
  this.dialogMsg.innerText = 'Oops, you lose!';
  // this.dialogBtn.innerText='Replay';
  // this.dialogImg.src='./images/play_again.png';
  if (this.nextLevelBtn.style.display === 'block') {
    this.nextLevelBtn.style.display = 'none';
  }
  this.dialogContainer.style.display = 'block';
}

UIManager.prototype.passAllLevels = function () {
  this.dialogMsg.innerText = 'Wow, you have passed all levels!';
  if (this.nextLevelBtn.style.display === 'block') {
    this.nextLevelBtn.style.display = 'none';
  }
  this.dialogContainer.style.display = 'block';
}

UIManager.prototype.clearContext = function (cx) {
  cx.clearRect(-cx.canvas.width / 2, -cx.canvas.height / 2,
    cx.canvas.width, cx.canvas.height);
}

UIManager.prototype.removeDialog = function () {
  this.dialogContainer.style.display = 'none';
}

UIManager.prototype.updateLevel = function (level) {
  var levelContainer = document.querySelector('.level-value');
  levelContainer.innerHTML = level;
}