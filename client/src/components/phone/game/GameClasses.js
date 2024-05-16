import loveBomb from "./assets/phone_game_love_bomb.png"
import { rectangularCollision } from "./utils/RectangularCollision";

const gravity = 0.7;
const enemySpeed = 2; // Adjust speed as needed
const attackDistance = 150;
const retreatDistance = 100;
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
      let frameWidth = this.width * this.scale * 1.5; // Default frame width scaled
      if (this.currentAction === "kick") {
        // Only modify frameWidth if the current action is 'kick'
        frameWidth = this.sprites.kick.width * this.scale * 1; // Specific width for kick
      }

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
        // this.width * this.scale * 1.5,
        frameWidth,
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
    takeHitSrc,
    flashEffect,
    flashSrc,
    throwSrc,
    options,
    target,
  }) {
    super({
      position,
      imageSrc: idleSrc,
      framesMax: 6,
      ctx,
      scale,
      offset,
      options,
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
    this.isTakingHit = false;
    this.flashEffect = flashEffect;
    this.freezeControls = false;
    this.target = target;
    this.bombs = [];
    // this.sprites = sprites;
    this.sprites = {
      idle: { imageSrc: idleSrc, framesMax: 6, framesHold: 10, width: 75 },
      jump: { imageSrc: jumpSrc, framesMax: 2, framesHold: 10, width: 75 }, // Increased for longer jumps
      fall: { imageSrc: fallSrc, framesMax: 2, framesHold: 10, width: 75 }, // Increased for longer falls
      runLeft: {imageSrc: runLeftSrc, framesMax: 9, framesHold: 10, width: 75 },
      run: { imageSrc: runSrc, framesMax: 6, framesHold: 10, width: 75 },
      punch: { imageSrc: punchSrc, framesMax: 4, framesHold: 10, width: 75 },
      kick: { imageSrc: kickSrc, framesMax: 6, framesHold: 10, width: 103 },
      takeHit: { imageSrc: takeHitSrc, framesMax: 3, framesHold: 10, width: 75 },
      enemyRunLeft: { imageSrc: runLeftSrc, framesMax: 6, framesHold: 10, width: 75 },
      flash: { imageSrc: flashSrc, framesMax: 8, framesHold: 10, width: 75 },
      throw: { imageSrc: throwSrc, framesMax: 10, framesHold: 10, width: 75 },
    };
  }

  isCurrentAction(action) {
    const currentSrc = new URL(this.image.src, document.location).href;
    const actionSrc = new URL(this.sprites[action].imageSrc, document.location)
      .href;
    return currentSrc === actionSrc;
  }

  shouldPreventActionChange(action) {
    if (
      this.isTakingHit &&
      this.framesCurrent < this.sprites["takeHit"].framesMax - 1
    ) {
      return true; // Prevent changing action while taking a hit and animation is not complete
    }
    if (
      this.isAttacking &&
      this.framesCurrent < this.sprites[this.lastAttackType].framesMax - 1
    ) {
      return true; // Prevent changing action while attacking and animation is not complete
    }
    return false; // Allow action change in other cases
  }

  changeSprite(action) {
    if (this.shouldPreventActionChange(action)) {
      return;
    }

    const newAction = this.sprites[action];
    const currentSrc = new URL(this.image.src, document.location).href; // Normalize current src to absolute URL
    const newSrc = new URL(newAction.imageSrc, document.location).href; // Normalize new src to absolute URL

    if (
      newAction &&
      (currentSrc !== newSrc ||
        this.framesHold !== newAction.framesHold ||
        this.framesCurrent >= this.framesMax)
    ) {
      this.image.src = newSrc;
      this.framesMax = newAction.framesMax;
      this.framesCurrent = 0;
      this.framesElapsed = 0;
      this.framesHold = newAction.framesHold;
      this.currentAction = action;
      this.isAttacking = action === "punch" || action === "kick" || action === "flash";
      this.isTakingHit = action === "takeHit";
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
    
    if (this.isAttacking) {
      this.velocity.x = 0;  // Ensure velocity is zero if in an attack mode
    }

    // Calculate direction and distance to player
    const directionToPlayer = player.position.x > this.position.x ? 1 : -1;
    const dx = player.position.x - this.position.x;
    const distanceToPlayer = Math.sqrt(dx * dx);

    // Determine if the player is behind the enemy
    const isPlayerBehind = player.position.x > this.position.x;


    
    // Modify retreat or repositioning logic to use increased speed
    if (
      (player.isAttacking && distanceToPlayer < retreatDistance) ||
      isPlayerBehind
    ) {
      // If the player is behind, retreat or reposition faster towards the right of the screen
      this.velocity.x = isPlayerBehind
        ? enemySpeed * 2
        : -enemySpeed * directionToPlayer; // Increase speed when repositioning
      this.runningDirection = isPlayerBehind
        ? "run"
        : directionToPlayer < 0
        ? "enemyRunLeft"
        : "run";
    } else {
      // Regular pursuit towards the player
      this.velocity.x = enemySpeed * directionToPlayer;
      this.runningDirection = directionToPlayer > 0 ? "run" : "enemyRunLeft";
    }
    // Dynamic sprite update based on the velocity
    if (Math.abs(this.velocity.x) > 0) {
        this.runningDirection = directionToPlayer > 0 ? "run" : "enemyRunLeft";
        this.changeSprite(this.runningDirection);
    } else {
        this.changeSprite("idle");
    }
    if (!this.isJumping && Math.random() < 0.1) {
      // Reduce the chance to 5%
      if (
        (player.isAttacking && distanceToPlayer < retreatDistance) ||
        (this.velocity.x < 0 && directionToPlayer > 0)
      ) {
        // Jump when retreating or player is attacking
        this.jump();
      }
    }


    // AI decision to attack
    if (
      distanceToPlayer < attackDistance &&
      !this.isAttacking &&
      !this.attackCooldown
    ) {
      if (Math.random() < 0.5) {
        this.flashAttack();
      } else {
        this.throwAttack();
      }
      this.attackCooldown = true;
      setTimeout(() => {
        this.attackCooldown = false;
      }, 1000); // Cooldown of 1 second before next attack is possible
    }
  }


  flashAttack() {
    if (!this.isAttacking && !this.attackCooldown && gameActive) {
        this.isAttacking = true;
        this.lastAttackType = 'flash';
        this.changeSprite('flash');

        // Check if target and freezeControls function exist before calling
        if (this.target && typeof this.target.freezeControls === 'function') {
            this.target.freezeControls(true); // Freeze player controls

            setTimeout(() => {
                this.isAttacking = false;
                this.changeSprite('idle');
                if (this.target && typeof this.target.freezeControls === 'function') {
                    this.target.freezeControls(false); // Unfreeze player controls
                }
                this.attackCooldown = true;
                setTimeout(() => {
                    this.attackCooldown = false;
                }, 1000); // Cooldown before next attack
            }, 2000); // Duration of control freeze
        } else {
            console.error("Target or freezeControls function is undefined.");
        }
    }
}


freezeControls(freeze) {
  // Implementation of how controls should be frozen or unfrozen
  this.controlsFrozen = freeze;
}

throwAttack() {
  if (!gameActive || this.isAttacking) return;

  console.log("Starting throw attack");
  this.lastAttackType = "throw";
  this.changeSprite("throw");
  this.isAttacking = true;
  this.velocity.x = 0; // Ensure enemy stops moving

  setTimeout(() => {
    this.launchBomb();
    this.isAttacking = false;
    this.changeSprite("idle");
    console.log("Throw attack completed and bomb launched");
  }, 3000); // Ensure this matches the throw animation duration
}

launchBomb() {
  console.log("Launching bomb");
  const bombPosition = {
    x: this.position.x + (this.direction === 1 ? this.width : -50),
    y: this.position.y + this.height / 2,
  };
  const bombVelocity = {
    x: this.direction * 5,
    y: 0
  };

  const newBomb = new Bomb({
    position: bombPosition,
    velocity: bombVelocity,
    ctx: this.ctx,
    imageSrc: loveBomb,
    collisionCheck: rectangularCollision,
    target: this.target,
    framesMax: 5 // Ensure this matches your bomb sprite sheet
  });

  this.bombs.push(newBomb);
  console.log("Bomb added to array, total bombs: ", this.bombs.length);
}



  updateSprite() {
    if (this.isAttacking) {
      this.changeSprite(this.lastAttackType === "kick" ? "kick" : "punch");
    } else if (this.isJumping) {
      this.changeSprite("jump");
    } else if (Math.abs(this.velocity.x) > 0) {
      this.changeSprite(this.runningDirection);
    } else {
      this.changeSprite("idle");
    }
  }

  attack() {
    if (!gameActive) {
      return; // Stop AI actions if the game is not active
    }
    if (!this.isAttacking) {
      this.lastAttackType = "punch"; // Set the attack type
      this.changeSprite("punch");
      this.isAttacking = true;
    }
  }

  kick() {
    if (!gameActive) {
      return; // Stop AI actions if the game is not active
    }
    if (!this.isAttacking) {
      this.lastAttackType = "kick"; // Set the attack type
      this.changeSprite("kick");
      this.isAttacking = true;
    }
  }

  jump() {
    if (!gameActive) {
      return; // Stop AI actions if the game is not active
    }
    const groundLevel = this.canvas.height - this.height - 20;
    if (this.position.y >= groundLevel) {
      this.velocity.y = -15; // Apply an upward velocity to simulate jumping
      this.position.y = groundLevel; // Optional: Reset position to ensure it's exactly on the ground
    }
  }

  takeHit() {
    this.health -= 10;
    this.changeSprite("takeHit");
  }

  animateFrames() {
    this.framesElapsed++;

    if (this.framesElapsed % this.framesHold === 0) {
      // First, handle the taking hit animation because it should have priority over others
      if (this.isTakingHit) {
        if (this.framesCurrent < this.sprites["takeHit"].framesMax - 1) {
          this.framesCurrent++;
        } else {
          // Reset once the taking hit animation is done
          this.framesCurrent = 0;
          this.isTakingHit = false;
          this.changeSprite("idle");
        }
      }
      // Then handle the attacking animation
      else if (this.isAttacking && this.lastAttackType) {
        if (
          this.framesCurrent <
          this.sprites[this.lastAttackType].framesMax - 1
        ) {
          this.framesCurrent++;
        } else {
          
          if (this.isAttacking && this.currentAction === 'flash') {
            this.framesCurrent = 0; // Continue looping flash while attacking
        } else {
          // Reset once the attacking animation is done
          this.framesCurrent = 0;
          this.isAttacking = false;
          this.damageDealt = false;
          this.changeSprite("idle");
        }
      }
      }
      // Handle idle and running animations
      else {
        // Assume this.currentAction holds the current sprite key (e.g., "idle", "running")
        // Ensure this.currentAction is valid and defaults to "idle" if undefined or not active
        if (!this.currentAction || !this.sprites[this.currentAction]) {
          this.currentAction = "idle";
        }

        // Loop through the current action animation
        if (
          this.framesCurrent <
          this.sprites[this.currentAction].framesMax - 1
        ) {
          this.framesCurrent++;
        } else {
          this.framesCurrent = 0; // Loop the animation from start
        }
      }
    }
  }
}

export class Bomb extends Sprite {
  constructor({ position, velocity, ctx, imageSrc, collisionCheck, target, framesMax }) {
    super({
      position,
      ctx,
      imageSrc,
      framesMax,  // Pass the number of frames in the sprite sheet
      scale: 1,   // Adjust scale as necessary
    });
    this.velocity = velocity;
    this.collisionCheck = collisionCheck;
    this.target = target;
    this.active = true;
  }

  update() {
    if (!this.active) return;
    super.update();  // This will handle animation frames
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    // Additional logic to handle collision or going off screen
    if (this.collisionCheck({ rect1: this, rect2: this.target })) {
      console.log('Bomb hits player!');
      this.active = false;  // Deactivate the bomb on collision
    }

    if (this.position.x < 0 || this.position.x > this.ctx.canvas.width ||
        this.position.y < 0 || this.position.y > this.ctx.canvas.height) {
      this.active = false;
    }

    if (this.bombs && Array.isArray(this.bombs)) {
      this.bombs.forEach((bomb, index) => {
        bomb.update();
        if (!bomb.active) {  // Assuming each bomb has an 'active' property
          this.bombs.splice(index, 1);
        }
      });
    }
  }
}


