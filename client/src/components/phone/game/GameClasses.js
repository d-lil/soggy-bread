import loveBomb from "./assets/phone_game_love_bomb.png"
import { rectangularCollision } from "./utils/RectangularCollision";

const gravity = 0.7;
const enemySpeed = 4;
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
      let frameWidth = this.width * this.scale * 1.5;
      if (this.currentAction === "kick") {
   
        frameWidth = this.sprites.kick.width * this.scale * 1; 
      }

      if (this.currentAction === "punch") {
        frameWidth = this.sprites.punch.width * this.scale * 1.1;
      }

      this.ctx.drawImage(
        this.image,
        this.framesCurrent * (this.image.width / this.framesMax),
        0,
        this.image.width / this.framesMax,
        this.image.height,
        this.position.x - this.offset.x,
        this.position.y - this.offset.y,

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
        this.framesCurrent = 0;
        if (this.isAttacking) {
          this.isAttacking = false;
          this.changeSprite("idle");
        }
      }
    }
  }


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
    stunnedSrc,
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
    this.attackCooldown = false;

    this.sprites = {
      idle: { imageSrc: idleSrc, framesMax: 6, framesHold: 10, width: 75 },
      jump: { imageSrc: jumpSrc, framesMax: 2, framesHold: 10, width: 75 },
      fall: { imageSrc: fallSrc, framesMax: 2, framesHold: 10, width: 75 },
      runLeft: {imageSrc: runLeftSrc, framesMax: 9, framesHold: 10, width: 75 },
      run: { imageSrc: runSrc, framesMax: 6, framesHold: 10, width: 75 },
      punch: { imageSrc: punchSrc, framesMax: 4, framesHold: 10, width: 75 },
      kick: { imageSrc: kickSrc, framesMax: 6, framesHold: 10, width: 103 },
      takeHit: { imageSrc: takeHitSrc, framesMax: 3, framesHold: 10, width: 75 },
      enemyRunLeft: { imageSrc: runLeftSrc, framesMax: 6, framesHold: 10, width: 75 },
      flash: { imageSrc: flashSrc, framesMax: 8, framesHold: 10, width: 75 },
      throw: { imageSrc: throwSrc, framesMax: 10, framesHold: 10, width: 75 },
      stunned: { imageSrc: stunnedSrc, framesMax: 4, framesHold: 10, width: 75}
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
        return false;
    }

    if (this.isTakingHit && this.framesCurrent < this.sprites["takeHit"].framesMax - 1) {
        return true;
    }

   
    if (this.isAttacking && this.lastAttackType && this.sprites[this.lastAttackType] && this.framesCurrent < this.sprites[this.lastAttackType].framesMax - 1) {
        return true;
    }

    return false;
}

  
  

changeSprite(action) {
  if (this.currentAction === action) return;
  if (this.currentAction === 'takeHit' && this.framesCurrent < this.sprites['takeHit'].framesMax - 1) {

    return;
  }
  if (!this.sprites[action]) {
    console.log("Attempted to change to undefined sprite:", action);
    return;
  }

  if (this.shouldPreventActionChange(action) && this.currentAction !== 'idle') {
    return;
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

      if (Math.abs(this.position.x - this.targetX) > enemySpeed) {
          
          this.velocity.x = enemySpeed * (this.position.x < this.targetX ? 1 : -1);
      } else {
        
          this.position.x = this.targetX;
          this.velocity.x = 0;
          this.changeSprite('idle');
          this.throwAttack();
          this.targetX = undefined;
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

    } else {
      this.velocity.y += gravity;
    }

    this.position.y += this.velocity.y;
    this.position.x += this.velocity.x;
  }

  aiUpdate(player) {
    if (!gameActive || this.isAttacking) {
        this.velocity.x = 0;
        return;
    }


    const directionToPlayer = player.position.x > this.position.x ? 1 : -1;
    const dx = player.position.x - this.position.x;
    const distanceToPlayer = Math.sqrt(dx * dx);


    const playerApproaching = Math.abs(player.velocity.x) > 0;

   
    const isPlayerBehind = player.position.x > this.position.x;

   
    if (playerApproaching && ((directionToPlayer === 1 && this.velocity.x < 0) || (directionToPlayer === -1 && this.velocity.x > 0))) {
        this.jump();      
        this.velocity.x = -enemySpeed * directionToPlayer;
        this.changeSprite(directionToPlayer === 1 ? "enemyRunLeft" : "run");
    } else if ((player.isAttacking && distanceToPlayer < retreatDistance) || isPlayerBehind) {
        this.velocity.x = isPlayerBehind ? enemySpeed * 2 : -enemySpeed * directionToPlayer;
        this.changeSprite(isPlayerBehind ? "run" : (directionToPlayer < 0 ? "enemyRunLeft" : "run"));
    } else {

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

    if (this.attackCooldown || this.isAttacking || !gameActive || this.flashActive) {
      return;
  }
    if (!this.isAttacking && !this.attackCooldown && gameActive) {
        this.attackCooldown = true;
        this.isAttacking = true;
        this.flashActive = true;
        this.changeSprite('flash');

        this.lastAttackType = 'flash';

        
        setTimeout(() => {

                this.flashEffect();
                this.isAttacking = false;
                this.changeSprite('idle');
                this.moveToThrowPosition();

            setTimeout(() => {
                this.attackCooldown = false;
                this.flashActive = false;

            }, 5000);         
          }, 700);
    }
}


moveToThrowPosition() {
  const throwPositionX = 350;
  this.targetX = throwPositionX;
  this.velocity.x =0;
}
throwAttack() {
  if (!gameActive || this.isAttacking || this.bombs.length > 0) return;
  this.isAttacking = true;
  this.velocity.x = 0;
  this.changeSprite("throw");
  this.lastAttackType = "throw";

  setTimeout(() => {
      this.launchBomb({
          bombPosition: { x: this.position.x + this.width - 30, y: this.position.y + this.height / 4 },
          bombVelocity: { x: -7, y: -15 }
      });
      this.isAttacking = false;
      this.changeSprite("idle");
  }, 700);
}

launchBomb({ bombPosition, bombVelocity }) {
  const newBomb = new Bomb({
      position: { ...bombPosition },
      velocity: { ...bombVelocity },
      ctx: this.ctx,
      imageSrc: loveBomb,
      scale: 1.5,
      framesMax: 14
  });
  this.bombs = [newBomb]; // Ensure only one bomb is created
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
      return;
    }
    if (!this.isAttacking) {
      this.lastAttackType = "punch";
      this.changeSprite("punch");
      this.isAttacking = true;
    }
  }

  kick() {
    if (!gameActive) {
      return;
    }
    if (!this.isAttacking) {
      this.lastAttackType = "kick";
      this.changeSprite("kick");
      this.isAttacking = true;
    }
  }

  jump() {
    if (!gameActive) {
      return; 
    }
    const groundLevel = this.canvas.height - this.height - 20;
    if (this.position.y >= groundLevel) {
      this.velocity.y = -15;
      this.position.y = groundLevel;
    }
  }

  takeHit() {
    this.health -= 10;
    this.changeSprite("takeHit");
  }

  animateFrames() {
    this.framesElapsed++;

    if (this.framesElapsed % this.framesHold === 0) {

      if (this.isTakingHit) {
        if (this.framesCurrent < this.sprites["takeHit"].framesMax - 1) {
          this.framesCurrent++;
        } else {

          this.framesCurrent = 0;
          this.isTakingHit = false;
          this.changeSprite("idle");
        }
      }

      else if (this.isAttacking && this.lastAttackType) {
        if (
          this.framesCurrent <
          this.sprites[this.lastAttackType].framesMax - 1
        ) {
          this.framesCurrent++;
        } else {
          
          if (this.isAttacking && this.currentAction === 'flash') {
            this.framesCurrent = 0;
        } else {
          this.framesCurrent = 0;
          this.isAttacking = false;
          this.damageDealt = false;
          this.changeSprite("idle");
        }
      }
      }

      else {
 
        if (!this.currentAction || !this.sprites[this.currentAction]) {
          this.currentAction = "idle";
        }

        if (
          this.framesCurrent <
          this.sprites[this.currentAction].framesMax - 1
        ) {
          this.framesCurrent++;
        } else {
          this.framesCurrent = 0;
        }
      }
    }
  }
}

let bombId = 0; // Initialize a bomb ID counter

class Bomb extends Sprite {
  constructor({ position, velocity, ctx, imageSrc, scale, framesMax, framesHold = 11 }) {
    super({ position, ctx, imageSrc, scale, framesMax });
    this.velocity = velocity;
    this.active = true;
    this.gravity = 0.7;
    this.framesHold = framesHold;
    this.framesElapsed = 0;
    this.id = bombId++; // Assign a unique ID to each bomb
    this.hasCollided = false; // Flag to indicate collision
    this.animationCompleted = false; // Flag to indicate if the animation is completed
    
    // Define a larger attack box
    this.attackBox = {
      position: { x: this.position.x, y: this.position.y },
      offset: { x: -10, y: -10 }, // Offset the attack box position slightly if needed
      width: this.width * scale + 25, // Increase the width by 20 pixels
      height: this.height * scale + 25, // Increase the height by 20 pixels
    };
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
      if (this.deactivationTimer === undefined) {
        this.deactivationTimer = this.framesMax * this.framesHold; // Ensure full animation duration
      }
    }

    if (this.deactivationTimer !== undefined) {
      this.deactivationTimer--;
      if (this.deactivationTimer <= 0) {
        this.active = false;
      } else {
        this.animateFrames();
      }
    } else {
      this.animateFrames();
    }

    if (this.framesCurrent === this.framesMax - 1) {
      this.animationCompleted = true; // Mark animation as completed
    }

    // Update the attack box position
    this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
    this.attackBox.position.y = this.position.y + this.attackBox.offset.y;

    console.log(`Bomb updated [ID: ${this.id}] at position:`, this.position, 'Active:', this.active, 'Animation Completed:', this.animationCompleted, 'Attack Box:', this.attackBox);
  }

  draw() {
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
    console.log(`Bomb drawn [ID: ${this.id}] at position:`, this.position, 'Active:', this.active, 'Animation Completed:', this.animationCompleted, 'Attack Box:', this.attackBox);
  }
}
