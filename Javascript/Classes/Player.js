export default class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.speedX = 0; // Speed on X-axis
    this.speedY = 0; // Speed on Y-axis
    this.maxSpeed = 3; // Maximum speed
    this.maxSpeedDiagonal = this.maxSpeed - 0.1;
    this.acceleration = 0.05; // Acceleration value
    this.deceleration = 0.02; // Deceleration value
    this.direction = { x: 0, y: 0 };
    this.isMovingUp = false;
    this.isMovingDown = false;
    this.isMovingLeft = false;
    this.isMovingRight = false;
    this.element = document.createElement("div");
    this.element.classList.add("player");
    document.getElementById("gameContainer").appendChild(this.element);
    this.draw();
  }

  draw() {
    this.element.style.left = this.x + "px";
    this.element.style.top = this.y + "px";

    // document.querySelector(".speedXCounter").innerHTML = this.speedX.toFixed(2);
    // document.querySelector(".speedYCounter").innerHTML = this.speedY.toFixed(2);
  }

  setDirection(direction, value) {
    switch (direction) {
      case "up":
        this.isMovingUp = value;
        break;
      case "down":
        this.isMovingDown = value;
        break;
      case "left":
        this.isMovingLeft = value;
        break;
      case "right":
        this.isMovingRight = value;
        break;
      default:
        break;
    }

    // Update the movement direction based on the pressed keys
    const moveX = (this.isMovingLeft ? -1 : 0) + (this.isMovingRight ? 1 : 0);
    const moveY = (this.isMovingUp ? -1 : 0) + (this.isMovingDown ? 1 : 0);

    // Update the movement direction only if a key is pressed
    if (
      this.isMovingUp ||
      this.isMovingDown ||
      this.isMovingLeft ||
      this.isMovingRight
    ) {
      this.direction.x = moveX;
      this.direction.y = moveY;
    } else {
      // If no keys are pressed, stop movement
      this.direction.x = 0;
      this.direction.y = 0;
    }
  }

  update(canvasWidth, canvasHeight) {
    // Check if two directions are pressed simultaneously
    const isDiagonal =
      (this.isMovingUp || this.isMovingDown) &&
      (this.isMovingLeft || this.isMovingRight);

    // Set maxSpeed based on whether it's diagonal movement
    this.maxSpeed = isDiagonal ? this.maxSpeedDiagonal : 3;

    // Accelerate in the X direction
    if (
      this.isMovingLeft &&
      !this.isMovingRight &&
      this.speedX > -this.maxSpeed
    ) {
      this.speedX -= this.acceleration;
    }
    if (
      this.isMovingRight &&
      !this.isMovingLeft &&
      this.speedX < this.maxSpeed
    ) {
      this.speedX += this.acceleration;
    }

    // Accelerate in the Y direction
    if (this.isMovingUp && !this.isMovingDown && this.speedY > -this.maxSpeed) {
      this.speedY -= this.acceleration;
    }
    if (this.isMovingDown && !this.isMovingUp && this.speedY < this.maxSpeed) {
      this.speedY += this.acceleration;
    }

    // Check if the player is moving diagonally and the speed exceeds maxSpeedDiagonal
    const diagonalSpeed = Math.sqrt(this.speedX ** 2 + this.speedY ** 2);
    if (isDiagonal && diagonalSpeed > this.maxSpeedDiagonal) {
      // Normalize the speed vector to maxSpeedDiagonal
      const factor = this.maxSpeedDiagonal / diagonalSpeed;
      this.speedX *= factor;
      this.speedY *= factor;
    }

    // Decelerate until speed becomes 0 in the X direction
    if (
      (!this.isMovingLeft && !this.isMovingRight) ||
      (this.isMovingLeft && this.isMovingRight)
    ) {
      if (this.speedX !== 0) {
        this.speedX -= this.deceleration * Math.sign(this.speedX);
        if (Math.abs(this.speedX) < 0.01) this.speedX = 0;
      }
    }

    // Decelerate until speed becomes 0 in the Y direction
    if (
      (!this.isMovingUp && !this.isMovingDown) ||
      (this.isMovingUp && this.isMovingDown)
    ) {
      if (this.speedY !== 0) {
        this.speedY -= this.deceleration * Math.sign(this.speedY);
        if (Math.abs(this.speedY) < 0.01) this.speedY = 0;
      }
    }

    // Calculate the next position based on speed and direction
    const nextX = this.x + this.speedX;
    const nextY = this.y + this.speedY;

    // Check if the next position is within the canvas boundaries
    if (nextX >= 0 && nextX + this.element.clientWidth <= canvasWidth) {
      this.x = nextX;
    } else {
      this.speedX = 0; // Hit the wall, set speed to 0 in the X direction
    }

    if (nextY >= 0 && nextY + this.element.clientHeight <= canvasHeight) {
      this.y = nextY;
    } else {
      this.speedY = 0; // Hit the wall, set speed to 0 in the Y direction
    }

    // Draw the player
    this.draw();
  }
}
