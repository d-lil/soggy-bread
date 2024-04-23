import React, { useRef, useState, useEffect } from "react";
import "./css/Game.css";
import { Sprite, AnimatedSprite, Fighter } from "./GameClasses";
import gameBackground from "./assets/phone_game_background.png";
import fighterIdle from "./assets/phone_fighter_idle.png";
import fighterJump from "./assets/phone_fighter_jumping.png";
import fighterFall from "./assets/player_fall.png";
import fighterJump2 from "./assets/phone_fighter_jumping2.png";
import fighterRunLeft from "./assets/phone_fighter_run_left.png";
import fighterPunch from "./assets/phone_fighter_punch.png";
import fighterKick from "./assets/phone_fighter_kick.png";
import fighterRunRight from "./assets/phone_fighter_run_right.png";
import fighterTakeHit from "./assets/phone_fighter_take_hit.png";

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
      scale: "fitHeight",
      framesMax: 5,
    });

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
      scale: 1.5,
      offset: {
        x: 10,
        y: 70,
      },

      idleSrc: fighterIdle,
      framesMax: 6,
      jumpSrc: fighterJump,
      runLeftSrc: fighterRunLeft,
      fallSrc: fighterFall,
      runSrc: fighterRunRight,
      punchSrc: fighterPunch,
      kickSrc: fighterKick,
      takeHitSrc: fighterTakeHit,
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

      scale: 1.5,
      offset: {
        x: 10,
        y: 70,
      },
      idleSrc: fighterIdle,
      framesMax: 6,
      jumpSrc: fighterJump,
      fallSrc: fighterFall,
      runLeftSrc: fighterRunLeft,
      runSrc: fighterRunRight,
      punchSrc: fighterPunch,
      kickSrc: fighterKick,
      takeHitSrc: fighterTakeHit,
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
      window.requestAnimationFrame(animate);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      background.update();
      enemy.aiUpdate(player);

      let newAction = "idle";

      if (player.isAttacking) {
        if (player.lastAttackType === "punch") {
          newAction = "punch";
        } else if (player.lastAttackType === "kick") {
          newAction = "kick";
        }
      } else {
        // Update player sprite based on vertical movement
        if (player.velocity.y < 0) {
          newAction = "jump";
        } else if (player.velocity.y > 0) {
          newAction = "fall";
        } else {
          if (keys.ArrowRight.pressed) {
            player.velocity.x = 5;
            newAction = "run"; // Assuming you have a running sprite animation
          } else if (keys.ArrowLeft.pressed) {
            player.velocity.x = -5;
            newAction = "runLeft"; // Assuming you have a running sprite animation
          } else {
            newAction = "idle";
          }
        }
        player.changeSprite(newAction);
      }

      player.changeSprite(newAction);
      player.update();
      enemy.update();

      if (
        rectangularCollision({ rect1: player, rect2: enemy }) &&
        player.isAttacking &&
        !player.damageDealt
      ) {
        enemy.takeHit();

        document.getElementById("enemy-health").style.width =
          enemy.health + "%";
        player.damageDealt = true;
      }

      if (
        player.isAttacking &&
        player.framesCurrent ===
          player.sprites[player.lastAttackType].framesMax - 1
      ) {
        setTimeout(() => {
          if (player.isAttacking) {
            // Double-check to avoid conflicts with other state changes
            player.isAttacking = false;
            player.changeSprite("idle");
            player.damageDealt = false; // Reset damage flag here to allow for subsequent attacks
          }
        }, 100);
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
        player.health -= 5;
        document.getElementById("player-health").style.width =
          player.health + "%";
        player.changeSprite("takeHit");
        enemy.damageDealt = true;
        enemy.isAttacking = false;
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
          if (!player.isAttacking) {
            player.attack();
            player.isAttacking = true;
          }
          break;
        case "a":
          if (!player.isAttacking) {
            player.kick();
            player.isAttacking = true;
          }
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
