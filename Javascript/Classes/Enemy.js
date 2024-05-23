// enemy.js
export default class Enemy {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.speedX = 2; // Adjust enemy speed as needed
    this.speedY = 2; // Adjust enemy speed as needed
    this.element = document.createElement("div");
    this.element.classList.add("enemy");
    document.body.appendChild(this.element);
    // document.getElementById("gameContainer").appendChild(this.element);
    this.draw();
  }

  draw() {
    this.element.style.left = this.x + "px";
    this.element.style.top = this.y + "px";
  }

  update() {
    this.draw();
  }
}
