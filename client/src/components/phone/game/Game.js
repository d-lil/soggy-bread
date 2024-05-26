import React, { useRef, useState, useEffect } from "react";
import "./css/Game.css";
import { Sprite, Bomb, Fighter } from "./GameClasses";
import { rectangularCollision } from "./utils/RectangularCollision";
import gameBackground from "./assets/phone_game_background.png";
import fighterIdle from "./assets/phone_fighter_idle.png";
import fighterJump from "./assets/phone_fighter_jumping.png";
import fighterFall from "./assets/player_fall.png";
import fighterRunLeft from "./assets/phone_fighter_run_left.png";
import fighterPunch from "./assets/phone_fighter_punch.png";
import fighterKick from "./assets/phone_fighter_kick.png";
import fighterRunRight from "./assets/phone_fighter_run_right.png";
import fighterTakeHit from "./assets/phone_fighter_take_hit.png";
import fighterStunned from "./assets/phone_fighter_stunned.png";
import enemyIdle from "./assets/phone_game_enemy_idle.png";
import enemyRunRight from "./assets/phone_game_enemy_run_right.png";
import enemyRunLeft from "./assets/phone_game_enemy_run.png";
import enemyFlash from "./assets/phone_game_enemy_flash.png";
import enemyThrow from "./assets/phone_game_enemy_throw.png";
import enemyTakeHit from "./assets/phone_game_enemy_takehit.png";
import enemyJump from "./assets/phone_game_enemy_jump.png";
import enemyFall from "./assets/phone_game_enemy_fall.png";

import gameSong from "./assets/Vierre_Cloud_moment.mp3";

let animationFrameId;
let gameActive = true;
let freezeControls = false;

const Game = () => {
  const canvasRef = useRef(null);
  const audioRef = useRef(new Audio(gameSong));
  const [volume, setVolume] = useState(0.06);
  const [gameResult, setGameResult] = useState("");
  const [timer, setTimer] = useState(60);

  
  const initialScreen =
    localStorage.getItem("resetToGame") === "true" ? "game" : "loading";
  localStorage.removeItem("resetToGame"); 
  const [screen, setScreen] = useState(initialScreen);

  useEffect(() => {
    audioRef.current.volume = volume; 
  }, [volume]);

  useEffect(() => {
    if (screen === "game") {
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

      const flashEffect = () => {
        if (!canvasRef.current) return;

        freezeControls = true;
        const ctx = canvasRef.current.getContext("2d");
        ctx.save();
        ctx.globalCompositeOperation = "lighter";
        ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
        ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        setTimeout(() => {
          ctx.clearRect(
            0,
            0,
            canvasRef.current.width,
            canvasRef.current.height
          );
          ctx.restore();
        }, 100);
        setTimeout(() => {
          freezeControls = false;
        }, 1000);
      };

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
        stunnedSrc: fighterStunned,
        controlFreeze: null,
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
        idleSrc: enemyIdle,
        framesMax: 6,
        jumpSrc: enemyJump,
        fallSrc: enemyFall,
        runLeftSrc: enemyRunLeft,
        runSrc: enemyRunRight,
        flashSrc: enemyFlash,
        throwSrc: enemyThrow,
        flashEffect: flashEffect,
        takeHitSrc: enemyTakeHit,
        target: player,
      });

      const keys = {
        ArrowRight: { pressed: false },
        ArrowLeft: { pressed: false },
      };

      function determineWinner({ player, enemy, timerId }) {
        clearTimeout(timerId);
        gameActive = false;
        if (player.health === enemy.health) {
          clearTimeout(timerId);
          setGameResult("tie");
        } else if (player.health > enemy.health) {
          clearTimeout(timerId);
          setGameResult("playerWins");
        } else {
          clearTimeout(timerId);
          setGameResult("enemyWins");
        }
      }

      const timerId = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer > 1) return prevTimer - 1;
          clearInterval(timerId);
          gameActive = false;
          determineWinner({ player, enemy, timerId });
          return 0;
        });
      }, 1000);

      function animate() {
        if (!gameActive || !canvasRef.current) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
          return;
        }
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
          if (freezeControls) {
            player.velocity.x = 0;
            newAction = "stunned";
            ///////////////////////////////////////////////////////////////
            // NEED TO ADJUST THIS PART FOR MORE FLUID MOVEMENT //////////////////////////////////////////////////////////////////
            ///////////////////////////////////////////////////////////////
            keys.ArrowRight.pressed = false;
            keys.ArrowLeft.pressed = false;
          } else {
            if (player.velocity.y < 0) {
              newAction = "jump";
            } else if (player.velocity.y > 0) {
              newAction = "fall";
            } else {
              if (keys.ArrowRight.pressed) {
                player.velocity.x = 5;
                newAction = "run";
              } else if (keys.ArrowLeft.pressed) {
                player.velocity.x = -5;
                newAction = "runLeft";
              } else {
                newAction = "idle";
              }
            }
          }
          player.changeSprite(newAction);
        }

        player.changeSprite(newAction);
        player.update();
        enemy.update();
        if (enemy.bombs.length > 0) {
          const bomb = enemy.bombs[0];
          bomb.update();
          bomb.draw();
        

          if (!bomb.hasCollided && bomb.animationCompleted) {
            if (rectangularCollision({ rect1: bomb.attackBox, rect2: player })) {
              player.health -= 15;
              document.getElementById("player-health").style.width = player.health + "%";
              player.changeSprite("takeHit"); 
              bomb.hasCollided = true;
        
             
              if (player.health <= 0) {
                determineWinner({ player, enemy, timerId });
              }
            }
        
            bomb.active = false; 
          }
        
          if (!bomb.active) {
            enemy.bombs = []; 
          }
        }

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
              player.isAttacking = false;
              player.changeSprite("idle");
              player.damageDealt = false;
            }
          }, 100);
        }

        if (enemy.health <= 0 || player.health <= 0) {
          determineWinner({ player, enemy, timerId });
        }
        // if (
        //   rectangularCollision({
        //     rect1: enemy,
        //     rect2: player,
        //   }) &&
        //   enemy.isAttacking
        // ) {
        //   player.health -= 5;
        //   document.getElementById("player-health").style.width =
        //     player.health + "%";
        //   player.changeSprite("takeHit");
        //   enemy.damageDealt = true;
        //   enemy.isAttacking = false;
        //   if (enemy.health <= 0 || player.health <= 0) {
        //     determineWinner({ player, enemy, timerId });
        //   }
        // }
      }

      animate();
      audioRef.current.play();

      window.addEventListener("keydown", handleKeyDown);
      window.addEventListener("keyup", handleKeyUp);

      function handleKeyDown(e) {
        if (!gameActive || freezeControls) return;

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
            if (!player.isAttacking && !player.freezeControls) {
              player.attack();
              player.isAttacking = true;
            }
            break;
          case "a":
            if (!player.isAttacking && !player.freezeControls) {
              player.kick();
              player.isAttacking = true;
            }
            break;
        }
      }

      function handleKeyUp(e) {
        if (!gameActive || freezeControls) return;

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

        clearInterval(timerId);
        window.cancelAnimationFrame(animationFrameId);

        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      };
    }
  }, [screen]);

  useEffect(() => {
    if (screen === "loading") {
      const timer = setTimeout(() => {
        setScreen("title");
      }, 3000); 
      return () => clearTimeout(timer);
    }
  }, [screen]);

  const startGame = () => {
    setScreen("game");
    audioRef.current.play();
  };

  const resetGame = () => {
    localStorage.setItem("resetToGame", "true");
    window.cancelAnimationFrame(animationFrameId);
    audioRef.current.pause();
    audioRef.current.currentTime = 0;

    setTimeout(() => {
      window.location.reload();
    }, 10);
  };

  return (
    <div className="game-container">
      {screen === "loading" && (
        <div className="loading-screen">
          <h1>
            <u>FLASH WARNING</u>
          </h1>
          <h2>
            This application contains occasional flash effects that may effect
            some users
          </h2>
          <br />
          <p>
            <i>This game is designed to be played on a desktop or laptop computer</i>
          </p>
          <h4>All artwork by Daniel Liljegren</h4>
          <h4>Music by Vierre Cloud</h4>
          <p>Copyright for this does not exist. @2024</p>
        </div>
      )}
      {screen === "title" && (
        <div className="title-screen">
          <h1>Game Title</h1>
          <button onClick={startGame}>Play</button>
        </div>
      )}

      {screen === "game" && (
        <div className="game-canvas">
          <div className="game-header">
            <div className="player-health-divs">
              <div className="player-health"></div>
              <div className="player-health-decrease" id="player-health"></div>
            </div>
            <div className="timer" id="timer">
              {timer}
            </div>
            <div className="enemy-health-divs">
              <div className="enemy-health"></div>
              <div className="enemy-health-decrease" id="enemy-health"></div>
            </div>
          </div>
          <div className={`game-results ${gameResult === "tie" ? "show" : ""}`}>
            <div className="game-over">
              <h2>Tie</h2>
              <button className="play-again" onClick={resetGame}>
                Play Again
              </button>
            </div>
          </div>
          <div
            className={`game-results ${
              gameResult === "playerWins" ? "show" : ""
            }`}
          >
            <div className="game-over">
              <h2>You Win!</h2>
              <button className="play-again" onClick={resetGame}>
                Play Again
              </button>
            </div>
          </div>
          <div
            className={`game-results ${
              gameResult === "enemyWins" ? "show" : ""
            }`}
          >
            <div className="game-over">
              <h2>You Lose!</h2>
              <button className="play-again" onClick={resetGame}>
                Play Again
              </button>
            </div>
          </div>
          <canvas ref={canvasRef} />
        </div>
      )}
    </div>
  );
};

export default Game;
