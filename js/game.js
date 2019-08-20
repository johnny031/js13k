let {
  init,
  Sprite,
  SpriteSheet,
  GameLoop,
  load,
  setImagePath,
  imageAssets,
  initKeys,
  keyPressed,
  bindKeys,
  unbindKeys,
  initPointer,
  pointerPressed
} = kontra;

let { canvas, context } = init();
initKeys();
initPointer();
setImagePath("assets/images/");
load("map.png", "enemy.png", "character.png").then(function() {
  // Image asset can be accessed by both
  // name: imageAssets['character_walk_sheet']
  // path: imageAssets['character_walk_sheet.png']

  let map = Sprite({
    x: 0, // starting x,y position of the sprite
    y: 0,
    image: kontra.imageAssets["map"]
  });
  let character = Sprite({
    x: 20,
    y: 300,
    dx: 1,
    ddy: 0.5,
    image: kontra.imageAssets["character"]
  });

  let enemies = [
    Sprite({
      x: 150,
      y: 300,
      image: kontra.imageAssets["enemy"],
      dy: 5
    }),
    Sprite({
      x: 300,
      y: 300,
      image: kontra.imageAssets["enemy"],
      dy: 3
    }),
    Sprite({
      x: 500,
      y: 300,
      image: kontra.imageAssets["enemy"],
      dy: 8
    })
  ];

  let loop = GameLoop({
    // create the main game loop

    update: function() {
      if (character.dx >= 0) {
        if (keyPressed("left") || pointerPressed("left")) {
          character.dx -= 0.05;
        }
      }
      if (!keyPressed("left") || !pointerPressed("left")) {
        character.dx += 0.03;
      }

      if (character.dx >= 1) {
        character.dx = 1;
      }
      if (character.x >= 570) {
        loop.stop();
        alert("You win!");
        window.location = "";
      }
      if (character.y >= 470) {
        character.y = 470;
        character.dy = -Math.abs(character.dy) - 0.5;
      }
      character.update();

      enemies.forEach(function(enemy) {
        if (enemy.y < 100) {
          enemy.y = 100;
          enemy.dy = Math.abs(enemy.dy); //absolute value 絕對值
        } else if (enemy.y > 310) {
          enemy.y = 310;
          enemy.dy = -Math.abs(enemy.dy);
        }
        enemy.update();

        if (enemy.collidesWith(character)) {
          loop.stop();
          alert("GAME OVER!");
          window.location = "";
        }
      });

      map.update();

      // wrap the sprites position when it reaches
      // the edge of the screen
    },
    render: function() {
      // render the game state

      map.render();
      character.render();
      enemies.forEach(function(enemy) {
        enemy.render();
      });
    }
  });

  loop.start(); // start the game
});
