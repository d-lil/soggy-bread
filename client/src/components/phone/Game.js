import React, { useRef, useEffect } from "react";

const gravity = 0.7;

class Sprite {
  constructor({ position, velocity, ctx, color = "blue" }) {
    this.position = position;
    this.velocity = velocity;
    this.height = 150;
    this.width = 50;
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.attackBox = {
      position: this.position,
      width: 100,
      height: 50,
    };
    this.color = color;
    this.isAttacking = false;
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
    if (this.position.y + this.height + this.velocity.y >= this.canvas.height) {
      this.velocity.y = 0;
      this.position.y = this.canvas.height - this.height;
    } else {
      this.velocity.y += gravity;
    }

    this.position.y += this.velocity.y;
    this.position.x += this.velocity.x;
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

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const width = 553;
    const height = 365;
    canvas.width = width;
    canvas.height = height;

    const player = new Sprite({
      position: { x: 20, y: 20 },
      velocity: { x: 0, y: 0 },
      ctx,
      color: "blue",
    });

    const enemy = new Sprite({
      position: { x: 280, y: 100 },
      velocity: { x: 0, y: 0 },
      ctx,
      color: "red",
    });

    const keys = {
      ArrowRight: { pressed: false },
      ArrowLeft: { pressed: false },
    };

    function animate() {
      requestAnimationFrame(animate);
      ctx.clearRect(0, 0, canvas.width, canvas.height);


      if (keys.ArrowRight.pressed) player.velocity.x = 5;
      else if (keys.ArrowLeft.pressed) player.velocity.x = -5;
      else player.velocity.x = 0;

      player.update();
      enemy.update();


      if (
        player.attackBox.position.x + player.attackBox.width >=
          enemy.position.x &&
        player.attackBox.position.x <= enemy.position.x + enemy.width &&
        player.attackBox.position.y + player.attackBox.height >=
          enemy.position.y &&
        player.attackBox.position.y <= enemy.position.y + enemy.height &&
        player.isAttacking
      ) {
        player.isAttacking = false;
        console.log("hit");
      }
    }

    animate();

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    function handleKeyDown(e) {
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
      <canvas ref={canvasRef} />
    </div>
  );
};

export default Game;
