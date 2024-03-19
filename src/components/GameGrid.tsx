import React, { useEffect, useRef, useState } from "react";
import Player1 from "./players/Player1";
import Player2 from "./players/Player2";
import { useGameContext } from "@/GameContext";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setPositions } from "@/redux/feature/positions";
import useCollision from "@/hooks/useCollision";
import Image from "next/image";
import { BulletPosition } from "@/utils/constants";
import Bullets from "./bullet/Bullets";
import usePositions from "@/hooks/usePositions";
import explosion from "../../public/explosion.jpg";
const GameGrid = () => {
  const { isColliding, trackMovements } = usePositions();
  const dispatch = useAppDispatch();
  const [showWinner, setShowWinner] = useState("");
  // const collisions = useCollision();
  const bullet1Position = useAppSelector(
    (state) => state.positionReducer.bullet1
  );
  const bullet2Position = useAppSelector(
    (state) => state.positionReducer.bullet2
  );
  const player1Position = useAppSelector(
    (state) => state.positionReducer.player1
  );
  const player2Position = useAppSelector(
    (state) => state.positionReducer.player2
  );
  const [playerKilled, setPlayerKilled] = useState({
    player1: false,
    player2: false,
  });

  const [showExplosion, setShowExplosion] = useState<
    BulletPosition & { show: boolean }
  >({
    x: 0,
    y: 0,
    show: false,
  });

  const handleRestart = () => {
    setShowWinner("");
    setShowExplosion({ show: false, x: 0, y: 0 });
    setPlayerKilled({ player1: false, player2: false });
  };

  useEffect(() => {
    const handleKeyPress = (event: any) => {
      trackMovements(event.key);
    };

    window.addEventListener("keyup", handleKeyPress);

    return () => {
      window.removeEventListener("keyup", handleKeyPress);
    };
  });

  function areElementsWithinRadius() {
    const rect1 = bullet1Position.x || 0;
    const rect2 = bullet2Position.x || 0;
    const radius1 = 20; // Assuming circular elements, get radius from width
    const radius2 = 20;

    // Calculate the center coordinates of each element
    const centerX1 = rect1 + radius1;
    const centerY1 = bullet1Position.y || 0 + radius1;
    const centerX2 = rect2 + radius2;
    const centerY2 = bullet2Position.y || 0 + radius2;

    // Calculate the distance between the centers of the elements
    const distance = Math.sqrt(
      Math.pow(centerX2 - centerX1, 2) + Math.pow(centerY2 - centerY1, 2)
    );

    // Compare the distance with the sum of their radii
    const sumOfRadii = radius1;

    return distance <= sumOfRadii;
  }
  useEffect(() => {
    if (isColliding.bulletsCollided) {
      let x = bullet1Position.x;
      let y = bullet1Position.y;
      let areColliding = areElementsWithinRadius();
      if (areColliding) {
        setShowExplosion({
          show: true,
          x: x,
          y: y,
        });
      }
    }
  }, [isColliding.bulletsCollided, bullet1Position.x]);

  useEffect(() => {
    if (
      !bullet1Position.x &&
      !bullet2Position.x &&
      !isColliding.player1Hit &&
      !isColliding.player2Hit
    ) {
      setShowExplosion({ show: false, x: 0, y: 0 });
    }
  }, [bullet1Position.x, bullet2Position.x]);

  useEffect(() => {
    if (isColliding.player1Hit) {
      setShowExplosion({
        show: true,
        x: player1Position.x,
        y: player1Position.y,
      });
      setPlayerKilled({ ...playerKilled, player1: true });
      setTimeout(() => {
        setShowWinner("Player 2");
      }, 2000);
    }
    if (isColliding.player2Hit) {
      setShowExplosion({
        show: true,
        x: player2Position.x,
        y: player2Position.y,
      });
      setPlayerKilled({ ...playerKilled, player2: true });
      setTimeout(() => {
        setShowWinner("Player 1");
      }, 2000);
    }
  }, [isColliding.player1Hit, isColliding.player2Hit]);

  return (
    <>
      {showWinner != "" ? (
        <div>
          <div>{showWinner} won this match.</div>
          <button onClick={handleRestart}>Restart Match</button>
        </div>
      ) : (
        <div className="gameGrid">
          {showExplosion.show ? (
            <div
              className="explosionImg"
              style={{
                top: `${showExplosion.y}px`,
                left: `${showExplosion.x}px`,
              }}
            ></div>
          ) : null}
          <div className="playerPositionsHorizontal ">
            {playerKilled?.player1 ? null : <Player1 />}
          </div>
          <div className="playerPositionsHorizontal ">
            {playerKilled?.player2 ? null : <Player2 />}
          </div>
          {bullet1Position.y != undefined && !showExplosion.show ? (
            <Bullets pos={bullet1Position} />
          ) : null}
          {bullet2Position.y != undefined && !showExplosion.show ? (
            <Bullets pos={bullet2Position} />
          ) : null}
        </div>
      )}
    </>
  );
};

export default GameGrid;
