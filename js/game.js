kontra.init();
kontra.initKeys();
kontra.initPointer();
kontra.setImagePath("assets/images/");

//draw starting page
var canvas = document.getElementById("a");
(elemLeft = canvas.offsetLeft), (elemTop = canvas.offsetTop);
var ctx = canvas.getContext("2d");
function init() {
  ctx.font = "60px Arial";
  ctx.strokeText("A NAUGHTY BOY", 80, 200);

  ctx.font = "30px Arial";
  ctx.fillText("HOLD CLICK TO SLOW DOWN", 115, 280);

  ctx.font = "30px Arial";
  ctx.fillText("LEVEL1", 110, 520);

  ctx.moveTo(320, 400);
  ctx.lineTo(320, 640);
  ctx.stroke();
  ctx.moveTo(0, 400);
  ctx.lineTo(640, 400);
  ctx.stroke();

  ctx.font = "30px Arial";
  ctx.fillText("LEVEL2", 430, 520);
}
init();

//0 starting page, 1 loop1, 2 loop2, -1 lose or win
var gameState = 0;
//which define score when wins
var timer = 0;
var delay = true;
//jump higher when stepping on wood the first time
var wood = true;
//ufo
var move_back = true;
//count coins get
var coin = 0;

function degreesToRadians(degrees) {
  return (degrees * Math.PI) / 180;
}

function lose(x, y) {
  var remain = 100 - (Math.abs(x) + y - 20) / 15.05;
  document.getElementById("a").style.background = "lightgray";
  setTimeout(function() {
    gameState = -1;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = "30px Arial";
    ctx.strokeText("FAILED", 280, 250);
    ctx.strokeText("remain: " + Math.round(remain) + "%", 255, 300);
  }, 1000);
}

function win(timer, coin) {
  document.getElementById("a").style.background = "orangered";
  setTimeout(function() {
    gameState = -1;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = "30px Arial";
    ctx.strokeText("VICTORY", 275, 250);
    ctx.strokeText(
      "score: " + Math.round(100 - timer * 2.5 + coin * 2.7),
      278,
      300
    );
  }, 1000);
}

function detectmob() {
  if (
    navigator.userAgent.match(/Android/i) ||
    navigator.userAgent.match(/webOS/i) ||
    navigator.userAgent.match(/iPhone/i) ||
    navigator.userAgent.match(/iPad/i) ||
    navigator.userAgent.match(/iPod/i) ||
    navigator.userAgent.match(/BlackBerry/i) ||
    navigator.userAgent.match(/Windows Phone/i)
  ) {
    return true;
  } else {
    return false;
  }
}

kontra
  .load(
    "enemy.png",
    "character.png",
    "tile1.png",
    "tile2.png",
    "water.png",
    "fire.png",
    "poison.png",
    "bounce.png",
    "tree.png",
    "tree2.png",
    "wood.png",
    "ufo.png",
    "cockroach.png",
    "button.png",
    "coin.png",
    "dead.png"
  )
  .then(function() {
    let character = kontra.Sprite({
      x: 20,
      y: 330,
      dx: 0,
      ddy: 0.5,
      image: kontra.imageAssets["character"]
    });
    let coin_sign = kontra.Sprite({
      x: 32 * 16,
      y: 32 * 1,
      width: 32,
      height: 32,
      image: kontra.imageAssets["coin"]
    });
    let coin_get = kontra.Sprite({
      x: 32 * 17,
      y: 32 * 2,
      width: 32,
      height: 32,
      render() {
        this.context.fillStyle = "white";
        ctx.font = "30px Arial";
        ctx.fillText("×", this.x + 8, this.y - 5);
        ctx.fillText(coin, this.x + 36, this.y - 5);
      }
    });
    let map = kontra.Sprite({
      x: 0,
      dx: -2
    });

    let tiles = [];
    function createmap(x, y, n) {
      let tile = kontra.Sprite({
        type: "tile",
        x: 32 * x,
        y: 32 * y,
        dx: map.dx,
        height: 32,
        width: 32,
        image: kontra.imageAssets["tile" + n]
      });
      tiles.push(tile);
    }
    for (var i = 0; i < 50; i++) {
      createmap(i, 0, 1);
      createmap(i, 19, 1);
      for (var j = 1; j < 4; j++) {
        createmap(i, j, 2);
        createmap(i, j + 15, 2);
      }
    }
    let objects1 = [
      kontra.Sprite({
        type: "ufo",
        x: 32 * 18,
        y: 32 * 14,
        width: 32,
        height: 32,
        dx: map.dx,
        image: kontra.imageAssets["ufo"]
      }),
      kontra.Sprite({
        type: "button",
        x: 32 * 24,
        y: 32 * 15,
        width: 32,
        height: 32,
        dx: map.dx,
        image: kontra.imageAssets["button"]
      }),
      kontra.Sprite({
        type: "fire",
        x: 32 * 27,
        y: 32 * 15,
        width: 32,
        height: 32,
        dx: map.dx,
        image: kontra.imageAssets["fire"]
      }),
      kontra.Sprite({
        type: "wood_move",
        x: 32 * 31,
        y: 32 * 16,
        width: 32,
        height: 32,
        dx: map.dx,
        image: kontra.imageAssets["wood"]
      }),
      kontra.Sprite({
        type: "bounce",
        x: 32 * 45,
        y: 32 * 15,
        width: 32,
        height: 32,
        dx: map.dx,
        image: kontra.imageAssets["bounce"]
      })
    ];

    let objects2 = [
      kontra.Sprite({
        type: "fire",
        x: 410,
        y: 480,
        width: 32,
        height: 32,
        dx: map.dx,
        image: kontra.imageAssets["fire"]
      }),
      kontra.Sprite({
        type: "bounce",
        x: 316,
        y: 480,
        width: 32,
        height: 32,
        dx: map.dx,
        image: kontra.imageAssets["bounce"]
      }),
      kontra.Sprite({
        type: "bounce",
        x: 1084,
        y: 480,
        width: 32,
        height: 32,
        dx: map.dx,
        image: kontra.imageAssets["bounce"]
      }),
      kontra.Sprite({
        type: "tree",
        x: 1116,
        y: 480,
        width: 32,
        height: 32,
        dx: map.dx,
        image: kontra.imageAssets["tree"]
      }),
      kontra.Sprite({
        type: "tree",
        x: 1212,
        y: 480,
        width: 32,
        height: 32,
        dx: map.dx,
        image: kontra.imageAssets["tree2"]
      }),
      kontra.Sprite({
        type: "tree",
        x: 1308,
        y: 480,
        width: 32,
        height: 32,
        dx: map.dx,
        image: kontra.imageAssets["tree"]
      }),
      kontra.Sprite({
        type: "tree",
        x: 1382,
        y: 480,
        width: 32,
        height: 32,
        dx: map.dx,
        image: kontra.imageAssets["tree2"]
      })
    ];

    function createpoisons(x, y) {
      let poison = kontra.Sprite({
        type: "poison",
        x: 32 * x,
        y: 32 * y,
        height: 32,
        width: 32,
        image: kontra.imageAssets["poison"]
      });
      objects2.push(poison);
    }
    //create poisonous tiles
    for (var i = 4; i < 8; i++) {
      for (var j = 6; j < 16; j += 3) {
        createpoisons(j, i);
      }
    }
    function createwaters(x, y, n) {
      let water = kontra.Sprite({
        type: "water",
        x: 32 * x,
        y: 32 * y,
        height: 32,
        width: 32,
        image: kontra.imageAssets["water"]
      });
      if (n === 1) {
        objects1.push(water);
      } else {
        objects2.push(water);
      }
    }
    for (var i = 16; i < 18; i++) {
      for (var j = 10; j < 17; j++) {
        createwaters(j, i, 1);
      }
    }
    for (var i = 16; i < 18; i++) {
      for (var j = 14; j < 17; j++) {
        createwaters(j, i, 2);
      }
    }
    createwaters(19, 16, 2);
    createwaters(19, 17, 2);

    function createwoods(x, y) {
      let wood = kontra.Sprite({
        type: "wood",
        x: 32 * x,
        y: 32 * y,
        width: 32,
        height: 32,
        dx: map.dx,
        image: kontra.imageAssets["wood"]
      });
      objects1.push(wood);
    }
    for (var i = 10; i < 18; i += 4) {
      createwoods(i, 15);
    }

    function createcockroachs(x, y) {
      let cockroach = kontra.Sprite({
        type: "cockroach",
        x: 32 * x,
        y: 32 * y,
        width: 32,
        height: 32,
        dx: map.dx,
        image: kontra.imageAssets["cockroach"]
      });
      objects1.push(cockroach);
    }
    for (var i = 29; i < 34; i++) {
      createcockroachs(i, 15);
    }

    function createcoins(x, y, n) {
      let coin = kontra.Sprite({
        type: "coin",
        x: 32 * x,
        y: 32 * y,
        width: 28,
        height: 28,
        dx: map.dx,
        image: kontra.imageAssets["coin"]
      });
      if (n === 1) {
        objects1.push(coin);
      } else {
        objects2.push(coin);
      }
    }
    for (var i = 11; i < 16; i += 2) {
      for (var j = 8; j < 11; j++) {
        createcoins(i, j, 1);
      }
    }

    let coin_coordinates = [
      [20, 15, 1],
      [30, 10, 1],
      [31, 9, 1],
      [31, 10, 1],
      [31, 11, 1],
      [32, 10, 1],
      [49, 4, 1],
      [49, 5, 1],
      [49, 6, 1],
      [48, 5, 1],
      [48, 6, 1],
      [48, 15, 1],
      [49, 15, 1],
      [7, 8, 2],
      [8, 7, 2],
      [8, 8, 2],
      [9, 8, 2],
      [10, 8, 2],
      [11, 7, 2],
      [11, 8, 2],
      [12, 8, 2],
      [13, 8, 2],
      [14, 6, 2],
      [14, 7, 2],
      [14, 8, 2],
      [15, 13, 2],
      [16, 13, 2],
      [16, 12, 2],
      [19, 13, 2],
      [24, 15, 2],
      [27, 15, 2],
      [30, 15, 2],
      [36, 5, 2],
      [37, 7, 2],
      [38, 9, 2],
      [39, 7, 2],
      [40, 5, 2],
      [41, 7, 2],
      [42, 9, 2],
      [43, 7, 2],
      [44, 5, 2]
    ];
    coin_coordinates.map(coordinate => {
      createcoins(coordinate[0], coordinate[1], coordinate[2]);
    });

    let enemies = [
      kontra.Sprite({
        x: map.x + 750,
        y: map.y + 150,
        dx: map.dx,
        image: kontra.imageAssets["enemy"],
        dy: 5
      }),
      kontra.Sprite({
        x: map.x + 850,
        y: map.y + 150,
        dx: map.dx,
        image: kontra.imageAssets["enemy"],
        dy: 3
      }),
      kontra.Sprite({
        x: map.x + 950,
        y: map.y + 150,
        dx: map.dx,
        image: kontra.imageAssets["enemy"],
        dy: 8
      })
    ];

    //when map reaches the end, character's speed will plus 2 only for once
    let once = true;

    let loop1 = kontra.GameLoop({
      update() {
        if (kontra.keyPressed("left") || kontra.pointerPressed("left")) {
          if (delay) {
            delay = false;
            timer++;
            setTimeout(function() {
              delay = true;
            }, 1000);
          }
          if (map.x <= -955) {
            //after map reaches the end, change character's speed
            character.dx -= 0.13;
          } else {
            //before, change map's speed
            map.dx += 0.13;
          }
        }
        if (!kontra.keyPressed("left") || !kontra.pointerPressed("left")) {
          if (map.x <= -955 && character.dx < 2) {
            //character's speed cannot greater than 2
            character.dx += 0.1;
          } else {
            map.dx -= 0.1;
          }
        }

        if (map.x <= -955) {
          //when map reaches the end
          map.x = -955;
          map.dx = 0;
          if (once) {
            character.dx += 2;
            once = false;
          }
          if (character.dx < 0) {
            //set the character's speed to 0~2
            character.dx += 0.08;
          } else if (character.dx > 2) {
            character.dx -= 0.05;
          }
        }
        if (map.dx <= -2) {
          //set the map's speed to 0~2
          map.dx += 0.1;
        } else if (map.dx > 0) {
          map.dx -= 0.05;
        }

        if (character.x >= 610) {
          //win
          loop1.stop();
          win(timer, coin);
        }
        if (character.y >= 482) {
          //set the ground level
          character.y = 482;
          if (character.dy > 12.5) {
            //after jumping on the trampoline
            //gradually jump lower
            character.dy = -Math.abs(character.dy) + 2.5;
          }
          //default
          //jump up to constant height
          character.dy = -Math.abs(character.dy) - 0.5;
        }
        if (character.y <= 128) {
          //hit the ceiling
          character.y = 128;
          character.dy = -Math.abs(character.dy) + 1;
        }
        map.update();
        coin_sign.update();
        coin_get.update();
        tiles.map(tile => {
          tile.dx = map.dx;
          tile.update();
        });
        character.update();

        objects1.map(object => {
          object.update();
          if (object.type === "ufo") {
            if (move_back) {
              setTimeout(function() {
                move_back = false;
                object.dx = map.dx + 1.2;
              }, 1300);
            } else {
              setTimeout(function() {
                move_back = true;
                object.dx = map.dx - 1.2;
              }, 1300);
            }
          } else {
            object.dx = map.dx;
          }
          if (object.collidesWith(character)) {
            if (object.type === "wood" || object.type === "wood_move") {
              object.ttl = 0;
              if (wood) {
                character.dy = -Math.abs(character.dy) - 1;
                wood = !wood;
                setTimeout(() => {
                  wood = !wood;
                }, 5000);
              }
              character.dy = -Math.abs(character.dy) - 0.5;
            } else if (
              object.type === "water" ||
              object.type === "ufo" ||
              object.type === "cockroach"
            ) {
              lose(map.x, character.x);
              character.image = kontra.imageAssets["dead"];
              character.width = 32;
              character.height = 32;
              loop1.stop();
            } else if (object.type === "fire") {
              map.dx = -4;
              object.ttl = 0;
            } else if (object.type === "bounce") {
              character.dy = -Math.abs(character.dy) - 3;
            } else if (object.type === "coin") {
              object.ttl = 0;
              coin++;
            } else if (object.type === "button") {
              objects1.map(wood => {
                if (wood.type === "wood_move") {
                  wood.dy -= 0.1;
                  setTimeout(function() {
                    wood.dy = 0;
                  }, 300);
                }
              });
            }
          }
        });
        //clear whose ttl (time to live) = 0
        objects1 = objects1.filter(object => object.isAlive());
      },
      render() {
        tiles.map(tile => tile.render());
        character.render();
        coin_sign.render();
        coin_get.render();
        enemies.map(enemy => enemy.render());
        objects1.map(object => {
          object.render();
        });
      }
    });

    let loop2 = kontra.GameLoop({
      //copy loop1 for testing
      update() {
        if (kontra.keyPressed("left") || kontra.pointerPressed("left")) {
          if (delay) {
            delay = false;
            timer++;
            setTimeout(function() {
              delay = true;
            }, 1000);
          }
          if (map.x <= -955) {
            character.dx -= 0.13;
          } else {
            map.dx += 0.13;
          }
        }
        if (!kontra.keyPressed("left") || !kontra.pointerPressed("left")) {
          if (map.x <= -955 && character.dx < 2) {
            character.dx += 0.1;
          } else {
            map.dx -= 0.1;
          }
        }

        if (map.x <= -955) {
          map.x = -955;
          map.dx = 0;
          if (once) {
            character.dx += 2;
            once = false;
          }
          if (character.dx <= 0) {
            character.dx += 0.08;
          } else if (character.dx > 2) {
            character.dx -= 0.05;
          }
        }
        if (map.dx <= -2) {
          map.dx += 0.1;
        } else if (map.dx > 0) {
          map.dx -= 0.05;
        }
        if (character.x >= 610) {
          loop2.stop();
          win(timer, coin);
        }
        if (character.y >= 482) {
          character.y = 482;
          if (character.dy > 12.5) {
            character.dy = -Math.abs(character.dy) + 2.5;
          }
          character.dy = -Math.abs(character.dy) - 0.5;
        }
        if (character.y <= 128) {
          character.y = 128;
          character.dy = -Math.abs(character.dy) + 1;
        }

        map.update();
        coin_sign.update();
        coin_get.update();
        tiles.map(tile => {
          tile.dx = map.dx;
          tile.update();
        });
        character.update();
        enemies.map(enemy => {
          enemy.dx = map.dx;
          if (enemy.y < 100) {
            enemy.y = 100;
            enemy.dy = Math.abs(enemy.dy);
          } else if (enemy.y > 500) {
            enemy.y = 500;
            enemy.dy = -Math.abs(enemy.dy);
          }
          enemy.update();
          if (enemy.collidesWith(character)) {
            lose(map.x, character.x);
            character.image = kontra.imageAssets["dead"];
            character.width = 32;
            character.height = 32;
            loop2.stop();
          }
        });

        objects2.map(object => {
          object.dx = map.dx;
          object.update();
          if (object.collidesWith(character)) {
            if (object.type === "water" || object.type === "poison") {
              lose(map.x, character.x);
              character.image = kontra.imageAssets["dead"];
              character.width = 32;
              character.height = 32;
              loop2.stop();
            } else if (object.type === "fire") {
              map.dx = -4;
              object.ttl = 0;
            } else if (object.type === "bounce") {
              character.dy = -Math.abs(character.dy) - 3;
            } else if (object.type === "tree") {
              character.dx = -3;
            } else if (object.type === "coin") {
              object.ttl = 0;
              coin++;
            }
          }
        });
        objects2 = objects2.filter(object => object.isAlive());
      },
      render() {
        tiles.map(tile => tile.render());
        character.render();
        coin_sign.render();
        coin_get.render();
        enemies.map(enemy => enemy.render());
        objects2.map(object => object.render());
      }
    });

    if (detectmob()) {
      //detect a mobile
      canvas.addEventListener("touchstart", function(event) {
        //get the x position user touches
        var x = event.changedTouches[0].pageX - elemLeft;
        //get the margin
        var margin = document.getElementById("a").offsetLeft;
        if (gameState === 0) {
          //when starting game
          if (x < (window.innerWidth - margin * 2) / 2) {
            //check left or right is touched
            //left level1
            loop1.start();
            gameState = 1;
          } else {
            //right level2
            loop2.start();
            gameState = 2;
          }
        } else if (gameState === -1) {
          //when lose the game
          window.location = "";
        }
      });
    } else {
      //detect not a mobile
      canvas.addEventListener("click", function(event) {
        var x = event.pageX - elemLeft;

        var margin = document.getElementById("a").offsetLeft;
        if (gameState === 0) {
          //when starting game
          if (x < (window.innerWidth - margin * 2) / 2) {
            //click level1
            loop1.start();
            gameState = 1;
          } else {
            //click level2
            loop2.start();
            gameState = 2;
          }
        } else if (gameState === -1) {
          //when lose the game
          window.location = "";
        }
      });
    }
  });
