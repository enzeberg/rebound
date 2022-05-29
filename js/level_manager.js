function LevelManager() {
  this.level = 1;
  this.levelConfig = {
    1: {
      holesOptions: { holesNum: 4, startAngle: Math.PI / 6, holeAngle: Math.PI / 16 }
      // enemyOptions
    },
    2: {
      holesOptions: { holesNum: 3, startAngle: 0, holeAngle: Math.PI / 18 }
      // enemyOptions
    },
    3: {
      holesOptions: { holesNum: 2, startAngle: 0, holeAngle: Math.PI / 20 }
      // enemyOptions
    },
    4: {
      holesOptions: { holesNum: 1, startAngle: 0, holeAngle: Math.PI / 22 },
      // enemyOptions
    },
    5: {
      holesOptions: { holesNum: 1, startAngle: Math.PI / 2, holeAngle: Math.PI / 24 },
      // enemyOptions:
    },
    6: {
      holesOptions: { holesNum: 1, startAngle: Math.PI / 4, holeAngle: Math.PI / 26 },
      // enemyOptions:
    }
  }
}

LevelManager.prototype.getLevelHolesOptions = function () {
  // return this.levelConfig[this.level][holesOptions];
  return this.levelConfig[this.level]['holesOptions'];
}

LevelManager.prototype.getLevelEnemyOptions = function () {
  return this.levelConfig[this.level]['enemyOptions'];
}

LevelManager.prototype.nextLevel = function () {
  this.level++;
}

LevelManager.prototype.levelsOver = function () {
  return this.levelConfig[this.level + 1] === undefined ? true : false;
}