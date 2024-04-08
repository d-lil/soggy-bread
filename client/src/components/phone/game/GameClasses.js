const gravity = 0.7;
const enemySpeed = 0.5; // Adjust speed as needed
const attackDistance = 150;
let gameActive = true;

export class Sprite {
    constructor({ position, ctx, imageSrc }) {
      this.position = position;

      this.height = 150;
      this.width = 50;
      this.ctx = ctx;
      this.canvas = ctx.canvas;
      this.image = new Image();
      this.image.src = imageSrc;
    }
  
    draw() {
        this.ctx.drawImage(this.image, this.position.x, this.position.y);
    }
  
    update() {
      this.draw();

    }

    
  

  }

export class Fighter {
  constructor({ position, velocity, ctx, color = "blue", offset }) {
    this.position = position;
    this.velocity = velocity;
    this.height = 150;
    this.width = 50;
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.attackBox = {
      position: {
        x: this.position.x + this.width,
        y: this.position.y,
      },
      offset,
      width: 100,
      height: 50,
    };
    this.color = color;
    this.isAttacking = false;
    this.health = 100;
  }

  draw() {
    this.ctx.fillStyle = this.color;
    this.ctx.fillRect(
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );

    if (this.isAttacking) {
      this.ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
      this.ctx.fillRect(
        this.attackBox.position.x,
        this.attackBox.position.y,
        this.attackBox.width,
        this.attackBox.height
      );
    }
  }

  update() {
    this.draw();
    this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
    this.attackBox.position.y = this.position.y;
    if (this.position.y + this.height + this.velocity.y >= this.canvas.height) {
      this.velocity.y = 0;
      this.position.y = this.canvas.height - this.height;
    } else {
      this.velocity.y += gravity;
    }

    this.position.y += this.velocity.y;
    this.position.x += this.velocity.x;
  }

  aiUpdate(player) {
    if (!gameActive) {
      this.velocity.x = 0;
      return; // Stop AI actions if the game is not active
    }
    // Determine the direction towards the player
    const directionToPlayer = player.position.x > this.position.x ? 1 : -1;

    // Move the enemy towards the player
    this.velocity.x = enemySpeed * directionToPlayer;

    // Check for attack
    const dx = player.position.x - this.position.x;
    const dy = player.position.y - this.position.y;
    const distanceToPlayer = Math.sqrt(dx * dx + dy * dy);
    // Check for attack only if not on cooldown
    if (
      distanceToPlayer < attackDistance &&
      !this.isAttacking &&
      !this.attackCooldown
    ) {
      this.attack();
      // Set the attack cooldown
      this.attackCooldown = true;
      setTimeout(() => {
        this.attackCooldown = false;
      }, 1000); // Cooldown of 2 seconds before next attack is possible
    }

    // Update position and attack box
    this.position.x += this.velocity.x;
    this.attackBox.position.x = this.position.x + this.attackBox.offset.x;

    // Update based on gravity
    if (this.position.y + this.height + this.velocity.y >= this.canvas.height) {
      this.velocity.y = 0;
      this.position.y = this.canvas.height - this.height;
    } else {
      this.velocity.y += gravity;
    }
  }

  attack() {
    if (!this.isAttacking) {
      this.isAttacking = true;
      setTimeout(() => {
        this.isAttacking = false;
      }, 100);
    }
  }

  jump() {
    if (this.position.y === this.canvas.height - this.height) {
      this.velocity.y = -20;
    }
  }
}