class Form {
  constructor() {
    this.input = createInput("Enter your name");
    this.playButton = createButton("Play");
    this.greeting = createElement("h2");
    this.titleImage = createImg("LavaClimberText.png")
  }

  setElementsPosition() {
   
    this.input.position(width / 2 - 110, height / 2 - 80);
    this.playButton.position(width / 2 -25, height / 2 - 20);
    this.greeting.position(width / 2-140, height / 2 +100);
    this.titleImage.position(width/2 - 200, height/2 - 200)
    this.titleImage.size(400,50)
  }

  setElementsStyle() {

  this.greeting.class("greeting");
  }

  hide() {
  
    this.playButton.hide();
    this.input.hide();
  }

  handleMousePressed() {
    this.playButton.mousePressed(() => {
      this.input.hide();
      this.playButton.hide();
      var message = `
      Hello ${this.input.value()}
      </br>wait for another player to join...`;
      this.greeting.html(message);
      playerCount += 1;
      player.index = playerCount
      player.name = this.input.value()
       player.addPlayer()
      player.updateCount(playerCount)
    

    });
  }

  display() {
    this.setElementsPosition();
    this.setElementsStyle();
    this.handleMousePressed();
  }
}
