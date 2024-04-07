import React, { useRef, useState, useEffect } from "react";
import "./css/Game.css";

const gravity = 0.7;
const enemySpeed = 0.5; // Adjust speed as needed
const attackDistance = 150;
let gameActive = true;

class Sprite {
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

const Game = () => {
  const canvasRef = useRef(null);
  const [gameResult, setGameResult] = useState("");
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const width = 553;
    const height = 365;
    canvas.width = width;
    canvas.height = height;

    const player = new Sprite({
      position: {
        x: 20,
        y: 20,
      },
      velocity: {
        x: 0,
        y: 0,
      },
      offset: {
        x: 0,
        y: 0,
      },
      ctx,
      color: "blue",
    });

    const enemy = new Sprite({
      position: {
        x: 280,
        y: 100,
      },
      velocity: {
        x: 0,
        y: 0,
      },
      offset: {
        x: -50,
        y: 0,
      },
      ctx,
      color: "red",
    });

    const keys = {
      ArrowRight: { pressed: false },
      ArrowLeft: { pressed: false },
    };

    function rectangularCollision({ rect1, rect2 }) {
      if (!rect1 || !rect2 || !rect1.attackBox || !rect2.position) {
        console.error("Invalid rectangles:", rect1, rect2);
        return false;
      }

      return (
        rect1.attackBox.position.x + rect1.attackBox.width >=
          rect2.position.x &&
        rect1.attackBox.position.x <= rect2.position.x + rect2.width &&
        rect1.attackBox.position.y + rect1.attackBox.height >=
          rect2.position.y &&
        rect1.attackBox.position.y <= rect2.position.y + rect2.height
      );
    }
    let timer = 10;
    function decreaseTimer() {
      if (timer > 0) {
        setTimeout(decreaseTimer, 1000);
        timer--;
        document.getElementById("timer").innerHTML = timer;
      }
      if (timer === 0) {
        gameActive = false;
        if (player.health === enemy.health) {
          setGameResult("tie");
        } else if (player.health > enemy.health) {
          setGameResult("playerWins");
        } else {
          setGameResult("enemyWins");
        }

      }

    }

    decreaseTimer();

    function animate() {
      requestAnimationFrame(animate);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (keys.ArrowRight.pressed) player.velocity.x = 5;
      else if (keys.ArrowLeft.pressed) player.velocity.x = -5;
      else player.velocity.x = 0;

      enemy.aiUpdate(player);
      player.update();
      enemy.update();

      if (
        rectangularCollision({
          rect1: player,
          rect2: enemy,
        }) &&
        player.isAttacking
      ) {
        player.isAttacking = false;
        enemy.health -= 10;
        document.getElementById("enemy-health").style.width =
          enemy.health + "%";
        // console.log("player hit enemy");
      }

      if (
        rectangularCollision({
          rect1: enemy,
          rect2: player,
        }) &&
        enemy.isAttacking
      ) {
        enemy.isAttacking = false;
        player.health -= 5;
        document.getElementById("player-health").style.width =
          player.health + "%";
        // console.log("enemy hit player");
      }
    }

    animate();

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    function handleKeyDown(e) {
        if (!gameActive) return; 
      switch (e.key) {
        case "ArrowRight":
          keys.ArrowRight.pressed = true;
          break;
        case "ArrowLeft":
          keys.ArrowLeft.pressed = true;
          break;
        case " ":
          player.jump();
          break;
        case "d":
          player.attack();
          break;
      }
    }

    function handleKeyUp(e) {
      switch (e.key) {
        case "ArrowRight":
          keys.ArrowRight.pressed = false;
          player.velocity.x = 0;
          break;
        case "ArrowLeft":
          keys.ArrowLeft.pressed = false;
          player.velocity.x = 0;
          break;
      }
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return (
    <div className="game-canvas">
      <div className="game-header">
        <div className="player-health-divs">
          <div className="player-health">player Health</div>
          <div className="player-health-decrease" id="player-health"></div>
        </div>
        <div className="timer" id="timer">
          60
        </div>
        <div className="enemy-health-divs">
          <div className="enemy-health">Enemy Health</div>
          <div className="enemy-health-decrease" id="enemy-health"></div>
        </div>
      </div>
      <div className={`game-results ${gameResult === "tie" ? "show" : ""}`}>
        Tie
      </div>
      <div
        className={`game-results ${gameResult === "playerWins" ? "show" : ""}`}
      >
        Player Wins
      </div>
      <div
        className={`game-results ${gameResult === "enemyWins" ? "show" : ""}`}
      >
        Enemy Wins
      </div>
      <canvas ref={canvasRef} />
    </div>
  );
};

export default Game;
