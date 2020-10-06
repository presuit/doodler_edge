import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { authService, dbService } from "../fbase";

const GameContainer = styled.div`
    width: 400px;
    height: 600px;
    background-color: yellow;
    position: relative;
    font-size: 200px;
    text-align: center;
    .doodler {
        width: 80px;
        height: 80px;
        background-color: black;
        color: white;
        position: absolute;
        border-radius: 50%;
        font-size: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
        border: none;
        box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
    }

    .platform {
        width: 85px;
        height: 15px;
        background-color: green;
        position: absolute;
    }
`;

const Game = () => {
    const [score, setScore] = useState(0);
    const startGame = () => {
        const grid = document.querySelector(".grid");
        const doodler = document.createElement("div");
        let doodlerLeftSpace = 50;
        let startPoint = 150;
        let doodlerBottomSpace = startPoint;
        let isGameOver = false;
        let platformCount = 5;
        let platforms = [];
        let upTimerId;
        let downTimerid;
        let isJumping = true;
        let isGoingLeft = false;
        let isGoingRight = false;
        let leftTimerId;
        let rightTimerId;
        let score = 0;
        let gameControl = "";

        function createDoodler() {
            grid.appendChild(doodler);
            doodler.classList.add("doodler");
            doodler.innerText = "(´◡`)";
            doodlerLeftSpace = platforms[0].left;
            doodler.style.left = doodlerLeftSpace + "px";
            doodler.style.bottom = doodlerBottomSpace + "px";
        }

        class Platform {
            constructor(newPlatBottom) {
                this.bottom = newPlatBottom;
                this.left = Math.random() * 315;
                this.visual = document.createElement("div");

                const visual = this.visual;
                visual.classList.add("platform");
                visual.style.left = this.left + "px";
                visual.style.bottom = this.bottom + "px";
                grid.appendChild(visual);
            }
        }

        function createPlatforms() {
            for (let i = 0; i < platformCount; i++) {
                let platformGap = 600 / platformCount;
                let newPlatBottom = 100 + i * platformGap;
                let newPlatform = new Platform(newPlatBottom);
                platforms.push(newPlatform);
                console.log(platforms);
            }
        }

        function movePlatforms() {
            if (doodlerBottomSpace > 200) {
                platforms.forEach((platform) => {
                    platform.bottom -= 4;
                    let visual = platform.visual;
                    visual.style.bottom = platform.bottom + "px";

                    if (platform.bottom < 10) {
                        let firstPlatform = platforms[0].visual;
                        firstPlatform.classList.remove("platform");
                        platforms.shift();
                        score++;
                        setScore(score);
                        console.log(platforms);
                        let newPlatform = new Platform(600);
                        platforms.push(newPlatform);
                    }
                });
            }
        }

        function jump() {
            clearInterval(downTimerid);
            isJumping = true;
            upTimerId = setInterval(function () {
                doodlerBottomSpace += 20;
                doodler.style.bottom = doodlerBottomSpace + "px";
                if (doodlerBottomSpace > 350) {
                    fall();
                }
            }, 30);
        }

        function fall() {
            clearInterval(upTimerId);
            isJumping = false;
            downTimerid = setInterval(function () {
                doodlerBottomSpace -= 5;
                doodler.style.bottom = doodlerBottomSpace + "px";
                if (doodlerBottomSpace <= 0) {
                    gameOver();
                }
                platforms.forEach((platform) => {
                    if (
                        doodlerBottomSpace >= platform.bottom &&
                        doodlerBottomSpace <= platform.bottom + 15 &&
                        doodlerLeftSpace + 60 >= platform.left &&
                        doodlerLeftSpace <= platform.left + 85 &&
                        !isJumping
                    ) {
                        console.log("landed");
                        startPoint = doodlerLeftSpace;
                        jump();
                    }
                });
            }, 20);
        }

        function gameOver() {
            console.log("Game Over!");
            isGameOver = true;
            while (grid.firstChild) {
                grid.removeChild(grid.firstChild);
            }
            grid.innerHTML = score;

            setScore(score);
            saveToDb(score);

            clearInterval(upTimerId);
            clearInterval(downTimerid);
            clearInterval(leftTimerId);
            clearInterval(rightTimerId);
        }

        function control(e) {
            if (isGameOver === false) {
                if (e.key === "ArrowLeft") {
                    if (gameControl === "ArrowLeft") {
                        return;
                    }
                    moveLeft();
                    gameControl = "ArrowLeft";
                } else if (e.key === "ArrowRight") {
                    if (gameControl === "ArrowRight") {
                        return;
                    }
                    moveRight();
                    gameControl = "ArrowRight";
                } else if (e.key === "ArrowUp") {
                    if (gameControl === "ArrowUp") {
                        return;
                    }
                    moveStraight();
                    gameControl = "ArrowUp";
                }
            }
            console.log(gameControl);
        }

        function moveLeft() {
            if (isGoingRight) {
                clearInterval(rightTimerId);
                isGoingRight = false;
            }
            // if (isGoingLeft === true) {
            //     return;
            // }
            // isGoingRight = false;
            isGoingLeft = true;
            leftTimerId = setInterval(function () {
                if (doodlerLeftSpace >= 0) {
                    doodlerLeftSpace -= 5;
                    doodler.style.left = Math.floor(doodlerLeftSpace) + "px";
                } else {
                    doodler.style.left = "0px";
                    // moveRight();
                }
            }, 20);
        }

        function moveRight() {
            if (isGoingLeft) {
                clearInterval(leftTimerId);
                isGoingLeft = false;
            }
            // if (isGoingRight) {
            //     return;
            // }
            // isGoingLeft = false;
            isGoingRight = true;
            rightTimerId = setInterval(function () {
                if (doodlerLeftSpace <= 340) {
                    doodlerLeftSpace += 5;
                    doodler.style.left = Math.floor(doodlerLeftSpace) + "px";
                } else {
                    doodler.style.left = "340px";
                    // moveLeft();
                }
            }, 20);
        }

        function moveStraight() {
            isGoingRight = false;
            isGoingLeft = false;
            clearInterval(rightTimerId);
            clearInterval(leftTimerId);
        }

        function start() {
            if (!isGameOver) {
                createPlatforms();
                createDoodler();
                setInterval(movePlatforms, 15);
                jump();
                document.addEventListener("keydown", control);
            }
        }
        // attach to button

        start();
    };

    const saveToDb = async (score) => {
        await dbService.collection("scores").add({ userId: authService.currentUser.uid, score, createdAt: Date.now() });
    };

    useEffect(() => {
        startGame();
    }, []);
    return (
        <>
            <GameContainer className="grid"></GameContainer>
            <h3>Score: {score}</h3>
        </>
    );
};

export default Game;
