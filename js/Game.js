class Game {
  constructor() {
    this.resetTitle = createElement("h2");
    this.resetButton = createButton("RESET");

    this.leadeboardTitle = createElement("h2");

    this.leader1 = createElement("h2");
    this.leader2 = createElement("h2");
    this.playerMoving = false;
   
  }

  getState() {
    var gameStateRef = database.ref("gameState");
    gameStateRef.on("value", function(data) {
      gameState = data.val();
    });
  }
  update(state) {
    database.ref("/").update({
      gameState: state
    });
  }

  start() {
      player = new Player();
      playerCount = player.getCount();

    form = new Form();
    form.display();

    climber1 = createSprite(30,320)
    climber1.addAnimation("p1",player1Img)
    climber1.scale = 0.2

    climber2 = createSprite(470,320)
    climber2.addAnimation("p2",player2Img)
    climber2.scale = 0.2

    climbers = [climber1, climber2]

    
    boulderGroup = new Group();
    fireballGroup = new Group();
    this.addSprites(boulderGroup, 10, boulderImg, 0.01);

   
  }

  addSprites(spriteGroup, numberOfSprites, spriteImage, scale, positions = []) {
    for (var i = 0; i < numberOfSprites; i++) {
      var x, y;

      if (positions.length > 0) {
        x = positions[i].x;
        y = positions[i].y;
        spriteImage = positions[i].image;
      } else {
        var positionInX = [width/2+200, width/2-200]
        var positionInY = [-height*4.5, -height*4, -height*3.5, -height*3, -height*2.5, -height*2, -height*1.5]
        x = random(positionInX);
        y = random(positionInY);
      }
      var sprite = createSprite(x, y);
      sprite.addAnimation("sprite", spriteImage);

      sprite.scale = scale;
      spriteGroup.add(sprite);
      spriteGroup.velocityY = 2;
    }
  }

  handleElements() {
    form.hide();
 

    //C39
    this.resetTitle.html("Reset Game");
    this.resetTitle.class("resetText");
    this.resetTitle.position(width / 2 + 300, 40);

    this.resetButton.class("resetButton");
    this.resetButton.position(width / 2 + 330, 100);

    // this.leadeboardTitle.html("Leaderboard");
    // this.leadeboardTitle.class("resetText");
    // this.leadeboardTitle.position(width / 3 - 60, 40);

  //   this.leader1.class("leadersText");
  this.leader1.position(width / 3 - 50, 80);

  //   this.leader2.class("leadersText");
  this.leader2.position(width / 3 - 50, 130);
   }

  play() {
    this.handleElements();
    this.handleResetButton();


    Player.getPlayersInfo();
    player.getPlayersAtEnd();

    if (allPlayers !== undefined) {
       image(wall, 0, -height * 4, width, height * 6);


      //index of the array
      var index = 0;
      for (var plr in allPlayers) {
        //add 1 to the index for every loop
        index = index + 1;

        //use data form the database to display the cars in x and y direction
        var x = allPlayers[plr].positionX;
        var y = height - allPlayers[plr].positionY;

        climbers[index-1].position.x = x;
        climbers[index-1].position.y = y;

        var currentlife = allPlayers[plr].life;

        // if (currentlife <= 0) {
        //   cars[index - 1].changeImage("blast");
        //   cars[index - 1].scale = 0.3;
        // }

        // players[index - 1].position.x = x;
        // players[index - 1].position.y = y;

        if (index === player.index) {
          stroke(3);
          fill("white");
          ellipse(x, y, 30, 30);

          // this.handleFuel(index);
          // this.handlePowerCoins(index);
          // this.handleCarACollisionWithCarB(index);
          // this.handleObstacleCollision(index);
          this.handleBoulder(index);
          this.showLife();
       

          // Changing camera position in y direction
          if(climbers[index-1].position.y< 200){
          camera.position.y = climbers[index - 1].position.y;
          }
      }
      }


      // handling keyboard events
      this.handlePlayerControls();

      // Finshing Line
      const finishLine = height * 6 - 700;

      if (player.positionY > finishLine) {
        gameState = 2;
        player.rank += 1;
        Player.updatePlayersAtEnd(player.rank);
        player.update();
        this.showRank();
      }
  
      drawSprites();
    }
  }

  handleResetButton() {
    this.resetButton.mousePressed(() => {
      database.ref("/").set({
        playerCount: 0,
        gameState: 0,
        players: {},
        playersAtEnd: 0
      });
      window.location.reload();
    });
  }

  showLife() {
    push();
    text("LIFE", width / 2 - 130, height - player.positionY - 90);
    //image(lifeImage, width / 2 - 130, height - player.positionY - 400, 20, 20);
    fill("white");
    rect(width / 2 - 100, height - player.positionY - 100, 200, 20);
    fill("green");
    rect(width / 2 - 100, height - player.positionY - 100, player.life, 20);
    noStroke();
    pop();
  }

  // showFuelBar() {
  //   push();
  //   image(fuelImage, width / 2 - 130, height - player.positionY - 350, 20, 20);
  //   fill("white");
  //   rect(width / 2 - 100, height - player.positionY - 350, 185, 20);
  //   fill("#ffc400");
  //   rect(width / 2 - 100, height - player.positionY - 350, player.fuel, 20);
  //   noStroke();
  //   pop();
  // }

  showLeaderboard() {
    var leader1, leader2;
    var players = Object.values(allPlayers);
    if (
      (players[0].rank === 0 && players[1].rank === 0) ||
      players[0].rank === 1
    ) {
      // &emsp;    This tag is used for displaying four spaces.
      leader1 =
        players[0].rank +
        "&emsp;" +
        players[0].name 

      leader2 =
        players[1].rank +
        "&emsp;" +
        players[1].name 
        
    }

    if (players[1].rank === 1) {
      leader1 =
        players[1].rank +
        "&emsp;" +
        players[1].name 
      
      leader2 =
        players[0].rank +
        "&emsp;" +
        players[0].name 
        
    }

    this.leader1.html(leader1);
    this.leader2.html(leader2);
  }

  handlePlayerControls() {
      if (keyIsDown(UP_ARROW)) {
        player.positionY += 3;
        player.update();
      }

      if (keyIsDown(LEFT_ARROW)) {
        player.positionX -= 2;
        player.update();
      }

      if (keyIsDown(RIGHT_ARROW)) {
        player.positionX += 2;
        player.update();
      }
  }

  handleBoulder(index) {
    // Remove boulder
    climbers[index - 1].overlap(boulder, function(collector, collected) {
      player.life -= 200/4
      player.update()
      collected.remove();
    });

  // // Reducing Player car fuel
  //   if (player.life > 0) {
  //     player.life -= 200/4;
  //   }

    if (player.life <= 0) {
      gameState = 2;
      this.gameOver();
    }
  }

  // handlePowerCoins(index) {
  //   cars[index - 1].overlap(powerCoins, function(collector, collected) {
  //     player.score += 21;
  //     player.update();
  //     //collected is the sprite in the group collectibles that triggered
  //     //the event
  //     collected.remove();
  //   });
  // }

  // handleObstacleCollision(index) {
  //   if (cars[index - 1].collide(obstacles)) {
  //     if (this.leftKeyActive) {
  //       player.positionX += 100;
  //     } else {
  //       player.positionX -= 100;
  //     }

  //     //Reducing Player Life
  //     if (player.life > 0) {
  //       player.life -= 185 / 4;
  //     }

  //     player.update();
  //   }
  // }

  // handleCarACollisionWithCarB(index) {
  //   if (index === 1) {
  //     if (cars[index - 1].collide(cars[1])) {
  //       if (this.leftKeyActive) {
  //         player.positionX += 100;
  //       } else {
  //         player.positionX -= 100;
  //       }

  //       //Reducing Player Life
  //       if (player.life > 0) {
  //         player.life -= 185 / 4;
  //       }

  //       player.update();
  //     }
  //   }
  //   if (index === 2) {
  //     if (cars[index - 1].collide(cars[0])) {
  //       if (this.leftKeyActive) {
  //         player.positionX += 100;
  //       } else {
  //         player.positionX -= 100;
  //       }

  //       //Reducing Player Life
  //       if (player.life > 0) {
  //         player.life -= 185 / 4;
  //       }

  //       player.update();
  //     }
  //   }
  //}


  showRank() {
    swal({
      title: `Awesome!${"\n"}Rank${"\n"}${player.rank}`,
      text: "You reached the finish line successfully",
      imageUrl:
        "https://raw.githubusercontent.com/vishalgaddam873/p5-multiplayer-car-race-game/master/assets/cup.png",
      imageSize: "100x100",
      confirmButtonText: "Ok"
    });
  }

  gameOver() {
    swal({
      title: `Game Over`,
      text: "Oops you lost the race....!!!",
      imageUrl:
        "https://cdn.shopify.com/s/files/1/1061/1924/products/Thumbs_Down_Sign_Emoji_Icon_ios10_grande.png",
      imageSize: "100x100",
      confirmButtonText: "Thanks For Playing"
    });
  }
}