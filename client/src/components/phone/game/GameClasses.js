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
    this.lastAttackType = null;
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
    if (!this.sprites[action]) {
        console.error("Action not defined in sprites:", action);
        return false; // Default to not preventing action change if undefined
    }

    if (this.isTakingHit && this.framesCurrent < this.sprites["takeHit"].framesMax - 1) {
        return true; // Prevent changing action while taking a hit and animation is not complete
    }

    // Check if lastAttackType is valid and prevent action change if the attack animation is not complete
    if (this.isAttacking && this.lastAttackType && this.sprites[this.lastAttackType] && this.framesCurrent < this.sprites[this.lastAttackType].framesMax - 1) {
        return true; // Prevent changing action while attacking and animation is not complete
    }

    return false; // Allow action change in other cases
}

  
  

changeSprite(action) {
  if (this.currentAction === action) return; // Add this to prevent unnecessary changes if already in the desired action
  if (this.currentAction === 'takeHit' && this.framesCurrent < this.sprites['takeHit'].framesMax - 1) {

    return; // Do not change sprite if currently taking a hit and animation not complete
  }
  if (!this.sprites[action]) {
    console.log("Attempted to change to undefined sprite:", action);
    return; // Prevent change if action is undefined
  }

  if (this.shouldPreventActionChange(action) && this.currentAction !== 'idle') {
    return; // Only prevent action change if not already in an idle state
  }

  const newAction = this.sprites[action];
  const currentSrc = new URL(this.image.src, document.location).href;
  const newSrc = new URL(newAction.imageSrc, document.location).href;

  if (currentSrc !== newSrc) {
    this.image.src = newSrc;
    this.framesMax = newAction.framesMax;
    this.framesCurrent = 0;
    this.framesElapsed = 0;
    this.framesHold = newAction.framesHold;
    this.currentAction = action;
    this.isAttacking = ['punch', 'kick', 'flash', 'throw'].includes(action);
    this.isTakingHit = action === "takeHit";
  }
}


  update() {
    if (this.targetX !== undefined) {
      // Check if there is a target position to move towards
      if (Math.abs(this.position.x - this.targetX) > enemySpeed) {
          // Move towards the target position by enemySpeed
          this.velocity.x = enemySpeed * (this.position.x < this.targetX ? 1 : -1);
      } else {
          // Close enough to snap to the target position
          this.position.x = this.targetX;
          this.velocity.x = 0; // Stop moving
          this.changeSprite('idle');
          this.throwAttack(); // Start throw attack after reaching the position
          this.targetX = undefined; // Clear the target position
      }
  }
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
    if (!gameActive || this.isAttacking) {
        this.velocity.x = 0;
        return; // Stop AI actions if the game is not active
    }

    // Calculate direction and distance to player
    const directionToPlayer = player.position.x > this.position.x ? 1 : -1;
    const dx = player.position.x - this.position.x;
    const distanceToPlayer = Math.sqrt(dx * dx);

    // Check if the player is moving towards the enemy
    const playerApproaching = Math.abs(player.velocity.x) > 0;

    // Determine if the player is behind the enemy
    const isPlayerBehind = player.position.x > this.position.x;

    // Retreat logic when the player is aggressively moving towards the enemy
    if (playerApproaching && ((directionToPlayer === 1 && this.velocity.x < 0) || (directionToPlayer === -1 && this.velocity.x > 0))) {
        this.velocity.x = -enemySpeed * directionToPlayer; // Run away
        this.changeSprite(directionToPlayer === 1 ? "enemyRunLeft" : "run");
    } else if ((player.isAttacking && distanceToPlayer < retreatDistance) || isPlayerBehind) {
        // Retreat or reposition based on player's attack and position
        this.velocity.x = isPlayerBehind ? enemySpeed * 2 : -enemySpeed * directionToPlayer;
        this.changeSprite(isPlayerBehind ? "run" : (directionToPlayer < 0 ? "enemyRunLeft" : "run"));
    } else {
        // Regular pursuit or idle behavior
        if (distanceToPlayer > attackDistance) {
            this.velocity.x = enemySpeed * directionToPlayer;
            this.changeSprite(directionToPlayer > 0 ? "run" : "enemyRunLeft");
        } else {
            this.velocity.x = 0;
            this.changeSprite("idle");

            this.updateMotionSprite();
      if (distanceToPlayer < attackDistance && !this.attackCooldown) {
        this.flashAttack();      

      } else {

      }


        }
    }

    // Dynamic sprite update based on current motion

}

updateMotionSprite() {
    if (this.velocity.y < 0) {
        this.changeSprite("jump");
    } else if (this.velocity.y > 0) {
        this.changeSprite("fall");
    } else if (Math.abs(this.velocity.x) > 0) {
        this.changeSprite(this.velocity.x > 0 ? "run" : "enemyRunLeft");
    } else {
        this.changeSprite("idle");
    }
}

  flashAttack() {

    if (this.attackCooldown || this.isAttacking || !gameActive) {
      return; // Block the attack if cooldown is active, or already attacking, or game is inactive
  }
    if (!this.isAttacking && !this.attackCooldown && gameActive) {
        this.attackCooldown = true;
        this.isAttacking = true;
        this.changeSprite('flash');

        this.lastAttackType = 'flash';
        // Implement the flash effect or other visual feedback
        this.flashEffect();


        
        setTimeout(() => {
                this.isAttacking = false;
                this.changeSprite('idle');
                this.moveToThrowPosition(); // Move to throw position after flash attack
            }, 700); // Duration of the flash attack

            setTimeout(() => {
                this.attackCooldown = false; // Reset cooldown after specified time

            }, 5000); // Cooldown duration to prevent next attack
    }
}


freezeControls(freeze) {
  // Implementation of how controls should be frozen or unfrozen
  this.controlsFrozen = freeze;
}
moveToThrowPosition() {
  const throwPositionX = 350; // Desired X position for throw
  this.targetX = throwPositionX; // Set a target position that the update loop will use to move towards
  this.velocity.x =0;
}


throwAttack() {

    
  if (!gameActive || this.isAttacking) return;
  this.isAttacking = true;
  this.velocity.x = 0; // Ensure enemy stops moving
  this.changeSprite("throw");
  this.lastAttackType = "throw";

  setTimeout(() => {
        this.launchBomb({
          bombPosition: { x: this.position.x + this.width - 30, y: this.position.y + this.height / 4 },
          bombVelocity: { x: -5, y: -15 } // Adjust direction and speed as needed
      });
      this.isAttacking = false;
      this.changeSprite("idle");
  }, 700); // Ensure this matches the throw animation duration
}

launchBomb({ bombPosition, bombVelocity, player }) {

  const newBomb = new Bomb({
    position: bombPosition,
    velocity: bombVelocity,
    width: 40,
    height: 40,
    ctx: this.ctx,
    imageSrc: loveBomb,
    collisionCheck: rectangularCollision,
    target: player,
    scale: 1.5,
    framesMax: 14 // Ensure this matches your bomb sprite sheet
  });

  this.bombs.push(newBomb);
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
  constructor({ position, velocity, ctx, imageSrc, scale, framesMax, framesHold=11 }) {
    super({ position, ctx, imageSrc, scale, framesMax, });
    this.velocity = velocity;
    this.active = true;
    this.gravity = .7;
    this.attackBox = { // Ensure the bomb has an attackBox if used in collisions
      position: {x: 0,
        y: 0
      },
      width: this.width * scale,
      height: this.height * scale
    };
    this.offset = { x: 0, y: 0 };
    this.framesHold = framesHold;
    this.framesElapsed = 0;
  }

  update() {
    if (!this.active) return;
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    this.velocity.y += this.gravity;

    const groundLevel = this.ctx.canvas.height - this.height + 50;
    if (this.position.y >= groundLevel) {
      this.position.y = groundLevel;
      this.velocity.y = 0;
      this.velocity.x = 0;
      if (this.deactivationTimer === undefined) { // Initialize deactivation timer if not already set
        this.deactivationTimer = 30; // Delay before deactivating, adjust as needed
    }
    }

    if (this.deactivationTimer !== undefined) {
      this.deactivationTimer--;
      if (this.deactivationTimer <= 0) {
          this.active = false; // Deactivate the bomb
      } else {
          this.animateFrames(); // Continue animating only while active
      }
  } else {
      this.animateFrames(); // Continue animating if not hitting the ground yet
  }

    this.animateFrames();
    this.draw();
  }

  draw() {
    super.draw();
    if (this.active) {
      // Optionally draw the attack box for debugging
      this.ctx.strokeStyle = 'red';
      this.ctx.strokeRect(
          this.attackBox.position.x,
          this.attackBox.position.y,
          this.attackBox.width,
          this.attackBox.height
      );
  }
    if (!this.active && this.deactivationTimer <= 0) return;
    
    const frameWidth = this.image.width / this.framesMax;
    const frameHeight = this.image.height;
    const sx = this.framesCurrent * frameWidth;
    const sy = 0;
    this.ctx.drawImage(
      this.image,
      sx, sy, frameWidth, frameHeight,
      this.position.x, this.position.y,
      frameWidth * this.scale, frameHeight * this.scale
    );
  }


}


