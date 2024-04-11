import React, { useRef, useState, useEffect } from "react";
import "./css/Game.css";
import { Sprite, AnimatedSprite, Fighter } from "./GameClasses";
import gameBackground from "./assets/phone_game_background.png";
import backgroundFrames from "./assets/phoneGameBackground.json";


let gameActive = true;



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

    const background = new Sprite({
      position: {
        x: 0,
        y: 0,
      },
      ctx,
      imageSrc: gameBackground,
      scale: 'fitHeight',
      framesMax: 5,

    })


    const player = new Fighter({
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

    const enemy = new Fighter({
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
    let timerId;
    function determineWinner({ player, enemy, timerId }) {
      clearTimeout(timerId);
      gameActive = false;
      if (player.health === enemy.health) {
        setGameResult("tie");
      } else if (player.health > enemy.health) {
        setGameResult("playerWins");
      } else {
        setGameResult("enemyWins");
      }
    }

    let timer = 60;


    function decreaseTimer() {
        if (gameActive === false) {
            return;
        }
      if (timer > 0) {
        timerId = setTimeout(decreaseTimer, 1000);
        timer--;
        document.getElementById("timer").innerHTML = timer;
      }
      if (timer === 0) {
        gameActive = false;
        determineWinner({ player, enemy, timerId });
      }
    }

    decreaseTimer();

    function animate() {
      if (!gameActive) return;
      requestAnimationFrame(animate);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (keys.ArrowRight.pressed) player.velocity.x = 5;
      else if (keys.ArrowLeft.pressed) player.velocity.x = -5;
      else player.velocity.x = 0;
      background.update();
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
        if (enemy.health <= 0 || player.health <= 0) {
          determineWinner({ player, enemy, timerId });
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
        if (enemy.health <= 0 || player.health <= 0) {
          determineWinner({ player, enemy, timerId });
        }
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