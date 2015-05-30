(function () {
  if (typeof SnakeGame === "undefined"){
    window.SnakeGame = {};
  }

  var View = SnakeGame.View = function($el){
    this.board = new SnakeGame.Board();
    this.$el = $el;
    this.eventBinder();
    this.game = setInterval(this.step.bind(this), 200);
    this.interval = 0;
    this.scores = [];
    this.bestScore = 0;
    this.paused = false;
  }

  View.prototype.eventBinder = function () {
    $(document).on('keydown', function (event) {
      var key = event.keyCode;
      this.handleKeyEvent(key);
    }.bind(this))
  }
  View.prototype.step = function () {
    this.board.snake.turn = false
    this.interval++;
      this.board.snake.move();
    if (this.board.snake.gameOver) {
        this.$el.html(this.board.render());
        this.drawSnake(this.board.snake.pos,
                      this.board.snake.dir,
                      this.board.snake.segments,
                      true);
        this.tryAgain();
    } else {
      this.$el.html(this.board.render());
      this.drawSnake(this.board.snake.pos,
                    this.board.snake.dir,
                    this.board.snake.segments,
                    false);
      if (this.interval % 5 === 0) {
        this.board.addApple();
      }
      this.drawApple();

    }
  }

  View.prototype.tryAgain = function () {
    this.$el.append("<section class='retry'>Try Again?</section>");
    if (this.board.score > this.bestScore) {
      this.bestScore = this.board.score;
    }
    clearInterval(this.game);
    $(".retry").on('click', function() {
      this.board = new SnakeGame.Board();
      this.game = setInterval(this.step.bind(this), 200);
      this.interval = 0;
    }.bind(this))
  }

  View.prototype.drawApple = function () {
    if (this.board.apple) {
      var $ul = $(this.$el.find('ul').get(this.board.apple[0]));
      var $li = $($ul.find('li').get(this.board.apple[1]));
      $li.addClass('apple');

    }
  };

  View.prototype.drawSnake = function (pos, dir, segments, over) {
    var $ul = $(this.$el.find('ul').get(pos[0]));
    var $li = $($ul.find('li').get(pos[1]));
    $li.addClass('snake-head');
    if (over) {
      if (pos[1] < 0 || pos[0] < 0) {
        $li.addClass('hide');
      } else {
        $li.addClass('dead');
      }

    } else {
      if (dir === "N") {
        $li.addClass('up');
      }
      if (dir === "E") {
        $li.addClass('right');
      }
      if (dir === "S") {
        $li.addClass('down');
      }
      if (dir === "W") {
        $li.addClass('left');
      }
    }
    segments.forEach(function(segment){
      var $ul = $(this.$el.find('ul').get(segment[0][0]));
      var $li = $($ul.find('li').get(segment[0][1]));
      $li.addClass('snake');
      if (over) {
        $li.addClass('dead');
      } else {
        if (segment[1] === "N") {
          $li.addClass('up');
        }
        if (segment[1]  === "E") {
          $li.addClass('right');
        }
        if (segment[1]  === "S") {
          $li.addClass('down');
        }
        if (segment[1]  === "W") {
          $li.addClass('left');
        }
      }
    }.bind(this));
  }

  View.prototype.handleKeyEvent = function (keyCode) {
    var a = 37;
    var s = 40;
    var d = 39;
    var w = 38;
    var space = 32
    var dir;
    switch (keyCode) {
      case a:
        dir = "W";
        break;
      case s:
        dir = "S";
        break;
      case d:
        dir = "E";
        break;
      case w:
        dir = "N";
        break;
      case space:
        if (this.paused) {
          this.resume();
          this.paused = false;
        } else {
          this.pause();
          this.paused = true;
        }
        break;
    }
    if (!this.board.snake.isOpposite(dir) && !this.board.snake.turn) {
      this.board.snake.dir = dir;
      this.board.snake.turn = true
    }
  };

  View.prototype.pause = function () {
    this.$el.append("<section class='pause'>Paused</section>");
    clearInterval(this.game);
  };

  View.prototype.resume = function () {
    $(".pause").remove();
    this.game = setInterval(this.step.bind(this), 200);
  };


})();
