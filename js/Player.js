class Player {
  constructor() {
    this.name = "";
    this.index = 0;
    this.positionX = 0;
    this.positionY = 0;
    this.rank = 0;
    this.life = 200;
  }

  addPlayer() {
    var playerIndex = "players/player" + this.index;

    if (this.index === 1) {
      this.positionX = width / 2 - 100;
      this.positionY = 420
    } else {
      this.positionX = width / 2 + 100;
      this.positionY = 420
    }
    
    database.ref(playerIndex).set({
      name: this.name,
      positionX: this.positionX,
      positionY: this.positionY,
      rank: this.rank,
      life: this.life
    });
  }

  getDistance() {
    var playerDistanceRef = database.ref("players/player" + this.index);
    playerDistanceRef.on("value", data => {
      var data = data.val();
      this.positionX = data.positionX;
      this.positionY = data.positionY;
    });
  }

  getCount() {
    var playerCountRef = database.ref("playerCount");
    playerCountRef.on("value", data => {
      playerCount = data.val();
    });
  }

  updateCount(count) {
    database.ref("/").update({
      playerCount: count
    });
  }

  update() {
    var playerIndex = "players/player" + this.index;
    database.ref(playerIndex).update({
      positionX: this.positionX,
      positionY: this.positionY,
      rank: this.rank
    });
  }

  static getPlayersInfo() {
    var playerInfoRef = database.ref("players");
    playerInfoRef.on("value", data => {
      allPlayers = data.val();
    });
  }

  getPlayersAtEnd() {
    database.ref("playersAtEnd").on("value", data => {
      this.rank = data.val();
    });
  }

  static updatePlayersAtEnd(rank) {
    database.ref("/").update({
      playersAtEnd: rank
    });
  }
}
