kontra.init();
kontra.initKeys();
kontra.initPointer();
kontra.setImagePath("assets/images/");
function degreesToRadians(degrees) {
  return (degrees * Math.PI) / 180;
}
kontra
  .load(
    "map.png",
    "enemy.png",
    "character.png",
    "long_map.png",
    "water1.png",
    "water2.png",
    "fire.png",
    "poison.png",
    "bounce.png",
    "tree.png",
    "tree2.png"
  )
  .then(function() {
    let map = kontra.Sprite({
      x: 0, // starting x,y position of the sprite
      y: 0,
      height: 640,
      width: 1600,
      dx: -2,
      image: kontra.imageAssets["long_map"]
    });
    let character = kontra.Sprite({
      x: 20,
      y: 330,
      dx: 0,
      ddy: 0.5,
      image: kontra.imageAssets["character"]
    });

    let objects = [
      kontra.Sprite({
        type: "water",
        x: 447,
        y: 512,
        width: 96,
        height: 64,
        dx: map.dx,
        image: kontra.imageAssets["water1"]
      }),
      kontra.Sprite({
        type: "water",
        x: 607,
        y: 512,
        width: 32,
        height: 64,
        dx: map.dx,
        image: kontra.imageAssets["water2"]
      }),
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
      objects.push(poison);
    }
    for (var i = 4; i < 8; i++) {
      for (var j = 6; j < 16; j += 3) {
        createpoisons(j, i);
      }
    }

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

    let once = true;
    let loop = kontra.GameLoop({
      update() {
        if (kontra.keyPressed("left") || kontra.pointerPressed("left")) {
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
        } else if (map.dx >= 0) {
          map.dx -= 0.05;
        }
        if (character.x >= 570) {
          loop.stop();
          alert("You win!");
          window.location = "";
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
        character.update();
        enemies.map(enemy => {
          enemy.dx = map.dx;
          if (enemy.y < 100) {
            enemy.y = 100;
            enemy.dy = Math.abs(enemy.dy); //absolute value 絕對值
          } else if (enemy.y > 500) {
            enemy.y = 500;
            enemy.dy = -Math.abs(enemy.dy);
          }
          enemy.update();
          if (enemy.collidesWith(character)) {
            loop.stop();
            alert("GAME OVER!");
            window.location = "";
          }
        });

        objects.map(object => {
          object.dx = map.dx;
          object.update();
          if (object.collidesWith(character)) {
            if (object.type === "water" || object.type === "poison") {
              loop.stop();
              alert("GAME OVER!");
              window.location = "";
            } else if (object.type === "fire") {
              map.dx = -4;
              object.ttl = 0;
            } else if (object.type === "bounce") {
              character.dy = -Math.abs(character.dy) - 3;
            } else if (object.type === "tree") {
              character.dx = -3;
            }
          }
        });
        objects = objects.filter(object => object.isAlive());
      },
      render() {
        map.render();
        character.render();
        enemies.map(enemy => enemy.render());
        objects.map(object => object.render());
      }
    });
    loop.start();
  });
