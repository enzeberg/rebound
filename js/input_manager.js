function InputManager() {
  this.events = {};
  this.listenToButtons();
  this.listenToKeyboard();
  this.listenToScreen();
}

InputManager.prototype.on = function (event, callback) {
  if (!this.events[event]) {
    this.events[event] = [];
  }
  this.events[event].push(callback);
}

InputManager.prototype.emit = function (event, data) {
  var callbacks = this.events[event];
  if (callbacks) {
    callbacks.forEach(function (callback) {
      callback(data);
    });
  }
}

InputManager.prototype.listenToButtons = function () {
  this.bindButtonPress('.replay-btn', this.replay);
  this.bindButtonPress('.next-level-btn', this.gotoNextLevel);
}

InputManager.prototype.listenToKeyboard = function () {
  var self = this;

  var map = {
    65: 'clockwise',    //A
    68: 'anticlockwise' //D
  };

  document.addEventListener('keydown', function (event) {
    var modifiers = event.altKey || event.ctrlKey || event.metaKey ||
      event.shiftKey;
    var mapped = map[event.which]; // rotate direction

    if (!modifiers) {
      if (mapped !== undefined) {
        event.preventDefault();
        self.emit('rotateBaffle', mapped);
      }
    }
  });

  document.addEventListener('keyup', function (event) {
    var modifiers = event.altKey || event.ctrlKey || event.metaKey ||
      event.shiftKey;
    var mapped = map[event.which]; // rotate direction

    if (!modifiers) {
      if (mapped !== undefined) { // 'A' or 'D' up
        event.preventDefault();
        self.emit('stopRotatingBaffle');
      }
    }
  });

}

InputManager.prototype.listenToScreen = function () {
  var self = this;
  var touchStartClientX,
    touchStartClientY;
  var gameCanvas = document.querySelector('.game-canvas');
  gameCanvas.addEventListener('touchstart', function (event) {
    if (event.touches.length > 1 || event.targetTouches.length > 1) return;
    event.preventDefault();
    touchStartClientX = event.touches[0].clientX;
    self.emit('rotateBaffle', (touchStartClientX < screen.width / 2 ? 'clockwise' : 'anticlockwise'))
  });

  gameCanvas.addEventListener('touchmove', function (event) {
    event.preventDefault();
    console.log(event.touches[0].clientX);
  });

  gameCanvas.addEventListener('touchend', function (event) {
    if (event.touches.length > 1 || event.targetTouches.length > 1) return;
    event.preventDefault();
    self.emit('stopRotatingBaffle');
  });
}

InputManager.prototype.replay = function (event) {
  event.preventDefault();
  this.emit('replay');
}

InputManager.prototype.gotoNextLevel = function (event) {
  event.preventDefault();
  this.emit('gotoNextLevel');
}

InputManager.prototype.bindButtonPress = function (selector, fn) {
  var button = document.querySelector(selector);
  button.addEventListener('click', fn.bind(this));
  button.addEventListener('touchend', fn.bind(this));
}