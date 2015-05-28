;(function() {
  if (typeof SnakeGame === "undefined"){
    window.SnakeGame = {};
  }

  var Snake = SnakeGame.Snake = function() {
    this.dir = "N";
    this.pos = [5,5];
    this.segments = [];
    this.snakeLength = 0;
    this.gameOver = false;
    this.turn = false;
  };

  Snake.DIRECTIONS = {
    "N": [-1, 0],
    "E": [0,  1],
    "S": [1,  0],
    "W": [0, -1],
  };

  var plus = function(position, velocity) {
    return [position[0] + velocity[0], position[1] + velocity[1]];
  };

  var equals = function(pos1, pos2) {
    return pos1[0] === pos2[0] && pos1[1] === pos2[1];
  };

  Snake.prototype.isOpposite = function(dir2) {
    var vel1 = Snake.DIRECTIONS[this.dir];
    var vel2 = Snake.DIRECTIONS[dir2];
    return (vel1[0] === vel2[0] * -1) && (vel1[0] === vel2[0] * -1);
  };

  Snake.prototype.offBoard = function () {

    if (this.pos[0] < 0 || this.pos[0] == 10) {
      return true;
    }
    if (this.pos[1] < 0 || this.pos[1] == 10) {
      return true;
    }
    return false;
  }

  Snake.prototype.intersect = function(pos) {
    var result = false
    this.segments.forEach(function(segment){
      var position = segment[0];
      if (equals(pos, position)) {
        result = true;
      }
    })
    return result;
  }

  Snake.prototype.move = function() {
    var dir = Snake.DIRECTIONS[this.dir];
    this.segments.push([this.pos, this.dir]);
    if (this.snakeLength < this.segments.length) {
      this.segments.shift(1);
    }
    this.pos = plus(this.pos, dir);


    if (this.offBoard() || (this.intersect(this.pos))) {
      this.gameOver = true;
    }
  };


  Snake.prototype.grow = function() {
    this.snakeLength += 2;
  }
  // BOARD STUFF

  var Board = SnakeGame.Board = function() {
    this.snake = new SnakeGame.Snake();
    this.board = []
    this.createBoard();
    this.render();
    this.apple = null
    this.score = 0
  }

  Board.prototype.eat = function () {
    if (this.apple) {
      if (equals(this.snake.pos, this.apple)) {
        this.apple = null;
        this.score += 10;
        this.snake.grow();
      }
    }
  };


  Board.prototype.addApple = function() {
    if (!this.apple) {
      var apple = [Math.floor(Math.random()*10), Math.floor(Math.random()*10)]
      while(equals(this.snake.pos, apple) || this.snake.intersect(apple) ) {
        apple = [Math.floor(Math.random()*10), Math.floor(Math.random()*10)]
      }
      this.apple = apple;
    }
  }

  Board.prototype.render = function() {
    this.eat();

    var display = "<div class='score'>Score: " +this.score +"</div>";
    for (var row = 0; row < this.board.length; row++){
      display += "<ul>"
      for (var col = 0; col < this.board[0].length; col++){
        display += "<li></li>"
      }
      display += "</ul>"
    }

    return display;
  }

  Board.prototype.createBoard = function () {
    for(var i = 0; i < 10; i++) {
      this.board.push(new Array(10));
    }
  }

})();
