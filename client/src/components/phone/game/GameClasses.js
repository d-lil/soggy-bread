const gravity = 0.7;
const enemySpeed = 0.5; // Adjust speed as needed
const attackDistance = 150;
let gameActive = true;

export class Sprite {
  constructor({
    position,
    ctx,
    imageSrc,
    scale = 1,
    framesMax = 1,
    offset = { x: 0, y: 0 },
  }) {
    this.position = position;

    this.height = 150;
    this.width = 75;
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.image = new Image();
    this.image.src = imageSrc;
    this.scale = scale;
    this.framesMax = framesMax;
    this.framesCurrent = 0;
    this.framesElapsed = 0;
    this.framesHold = 10;
    this.offset = offset;
  }

  draw() {
    if (this.scale === "fitHeight") {
      this.ctx.drawImage(
        this.image,
        this.framesCurrent * (this.image.width / this.framesMax),
        0,
        this.image.width / this.framesMax,
        this.image.height,
        this.position.x,
        this.position.y,
        this.canvas.width,
        this.canvas.height
      );
    } else {
      this.ctx.drawImage(
        this.image,
        this.framesCurrent * (this.image.width / this.framesMax),
        0,
        this.image.width / this.framesMax,
        this.image.height,
        this.position.x - this.offset.x,
        this.position.y - this.offset.y,
        // this.position.x,
        // this.position.y,
        this.width * this.scale * 1.5,
        this.height * this.scale
      );
    }
  }

  animateFrames() {
    this.framesElapsed++;

    if (this.framesElapsed % this.framesHold === 0) {
      if (this.framesCurrent < this.framesMax - 1) {
        this.framesCurrent++;
      } else {
        this.framesCurrent = 0; // Reset frames to loop or stop the animation
        if (this.isAttacking) {
          console.log("Attack complete");
          this.isAttacking = false; // Stop attacking once the animation cycle is complete
          this.changeSprite("idle"); // Reset to idle animation
        }
      }
    }
  }

  // animateFrames() {
  //   this.framesElapsed++;

  //   if (this.framesElapsed % this.framesHold === 0) {
  //     this.framesCurrent = (this.framesCurrent + 1) % this.framesMax;

  //     this.framesElapsed = 0;
  //   }
  // }

  update() {
    this.draw();
    this.animateFrames();
  }
}

export class Fighter extends Sprite {
  constructor({
    position,
    velocity,
    ctx,
    color = "blue",
    imageSrc,
    scale = 1,
    framesMax = 1,
    offset = { x: 0, y: 0 },
    // sprites
    idleSrc,
    jumpSrc,
    fallSrc,
    runLeftSrc,
    runSrc,
    punchSrc,
    kickSrc,
  }) {
    super({
      position,
      imageSrc: idleSrc,
      framesMax: 6,
      ctx,
      scale,
      offset,
    });

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
    this.framesCurrent = 0;
    this.framesElapsed = 0;
    this.framesHold = 10;
    this.damageDealt = false;
    // this.sprites = sprites;
    this.sprites = {
      idle: { imageSrc: idleSrc, framesMax: 6, framesHold: 10 },
      jump: { imageSrc: jumpSrc, framesMax: 2, framesHold: 10 }, // Increased for longer jumps
      fall: { imageSrc: fallSrc, framesMax: 2, framesHold: 10 }, // Increased for longer falls
      runLeft: { imageSrc: runLeftSrc, framesMax: 9, framesHold: 10 },
      run: { imageSrc: runSrc, framesMax: 6, framesHold: 10 },
      punch: { imageSrc: punchSrc, framesMax: 4, framesHold: 10 },
      kick: { imageSrc: kickSrc, framesMax: 6, framesHold: 10 },
    };
  }

  isCurrentAction(action) {
    const currentSrc = new URL(this.image.src, document.location).href;
    const actionSrc = new URL(this.sprites[action].imageSrc, document.location)
      .href;
    return currentSrc === actionSrc;
  }

  shouldPreventActionChange(action) {
    // Allow sprite change if not attacking, regardless of the frame count
    if (!this.isAttacking) return false;

    // Otherwise, only prevent change if still within the animation frames
    return (
      (this.isCurrentAction("punch") || this.isCurrentAction("kick")) &&
      this.framesCurrent < this.sprites[action].framesMax - 1
    );
  }

  changeSprite(action) {
    if (this.shouldPreventActionChange(action)) {
      return;
    }
    if (
      this.isAttacking &&
      this.framesCurrent < this.sprites[action].framesMax - 1
    ) {
      return; // Avoid changing the sprite if the current attack animation hasn't finished
    }

    const newAction = this.sprites[action];
    const currentSrc = new URL(this.image.src, document.location).href; // Normalize current src to absolute URL
    const newSrc = new URL(newAction.imageSrc, document.location).href; // Normalize new src to absolute URL

    // Check both source change and framesHold change or if the animation should be reset forcefully if it has completed.
    if (
      newAction &&
      (currentSrc !== newSrc ||
        this.framesHold !== newAction.framesHold ||
        this.framesCurrent >= this.framesMax)
    ) {
      this.image.src = newSrc; // Use normalized newSrc
      this.framesMax = newAction.framesMax;
      this.framesCurrent = 0; // Reset the frame counter to start the new animation
      this.framesElapsed = 0; // Reset the elapsed frames to start the hold count afresh
      this.framesHold = newAction.framesHold; // Update framesHold based on the action
      this.isAttacking = false; // Reset attacking status
    }
  }

  update() {
    this.draw();
    this.animateFrames();
    this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
    this.attackBox.position.y = this.position.y;

    if (
      this.position.y + this.height + this.velocity.y >=
      this.canvas.height - 20
    ) {
      this.velocity.y = 0;
      this.position.y = this.canvas.height - this.height - 20;
      // this.position.y = something;
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
      this.lastAttackType = "punch"; // Set the attack type
      this.changeSprite("punch");
      this.isAttacking = true;
    }
  }

  kick() {
    if (!this.isAttacking) {
      this.lastAttackType = "kick"; // Set the attack type
      this.changeSprite("kick");
      this.isAttacking = true;
    }
  }

  jump() {
    const groundLevel = this.canvas.height - this.height - 20;
    if (this.position.y >= groundLevel) {
      this.velocity.y = -15; // Apply an upward velocity to simulate jumping
      this.position.y = groundLevel; // Optional: Reset position to ensure it's exactly on the ground
    }
  }

  animateFrames() {
    this.framesElapsed++;

    if (this.framesElapsed % this.framesHold === 0) {
      if (this.isAttacking && this.lastAttackType) {
        if (
          this.framesCurrent <
          this.sprites[this.lastAttackType].framesMax - 1
        ) {
          this.framesCurrent++;
        } else {
          // Reset only if it's the last frame of the attack
          this.framesCurrent = 0;
          this.isAttacking = false;
          this.changeSprite("idle");
          this.damageDealt = false; // Consider resetting damage flag here too
        }
      } else {
        // Handle non-attack animations or idle state
        this.framesCurrent = (this.framesCurrent + 1) % this.framesMax;
      }
    }
  }
}
