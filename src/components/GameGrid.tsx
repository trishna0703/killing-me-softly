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
import Welcome from "./welcome/Welcome";
const GameGrid = ({
  playerKilled,
  showExplosion,
  setShowWinner,
  setShowExplosion,
  setPlayerKilled,
}: {
  playerKilled: any;
  showExplosion: any;
  setShowWinner: (value: string) => void;
  setShowExplosion: (value: any) => void;
  setPlayerKilled: (value: any) => void;
}) => {
  const { isColliding, trackMovements } = usePositions();
  const [startGame, setStartGame] = useState(false);

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

  useEffect(() => {
    const handleKeyPress = (event: any) => {
      if (startGame) {
        trackMovements(event.key);
      }
    };

    window.addEventListener("keyup", handleKeyPress);

    return () => {
      window.removeEventListener("keyup", handleKeyPress);
    };
  });

  useEffect(() => {
    if (isColliding.bulletsCollided) {
      setShowExplosion({
        show: true,
        x: isColliding.bulletCoordinates.x,
        y: isColliding.bulletCoordinates.y,
      });
    } else if (isColliding.player1Hit) {
      setShowExplosion({
        show: true,
        x: player1Position.x - 50,
        y: player1Position.y - 50,
      });
      setPlayerKilled({ ...playerKilled, player1: true });
      setTimeout(() => {
        setShowWinner("Player 2");
      }, 2000);
    } else if (isColliding.player2Hit) {
      setShowExplosion({
        show: true,
        x: player2Position.x - 50,
        y: player2Position.y - 50,
      });
      setPlayerKilled({ ...playerKilled, player2: true });
      setTimeout(() => {
        setShowWinner("Player 1");
      }, 2000);
    } else {
      setShowExplosion({ show: false, x: 0, y: 0 });
    }
  }, [isColliding]);

  // useEffect(() => {
  //   if (bullet1Position.x == undefined && bullet2Position.x == undefined) {
  //     setTimeout(() => {
  //       setShowExplosion({ show: false, x: 0, y: 0 });
  //     }, 2000);
  //   }
  // }, [bullet1Position.x, bullet2Position.x]);

  // useEffect(() => {}, [isColliding.player1Hit, isColliding.player2Hit]);

  useEffect(() => {
    setTimeout(() => {
      setStartGame(true);
    }, 6000);
  }, []);

  return (
    <>
      {startGame ? null : <Welcome />}
      <div className="gameGrid">
        {/* <div className="gri40"></div> */}
        {showExplosion.show ? (
          <div
            className="explosionImg"
            style={{
              top: `${showExplosion.y}px`,
              left: `${showExplosion.x}px`,
            }}
          ></div>
        ) : null}
        <div className="playerPositionsHorizontal leftPlayer">
          {playerKilled?.player1 ? null : <Player1 />}
        </div>
        <div className="playerPositionsHorizontal rightPlayer ">
          {playerKilled?.player2 ? null : <Player2 />}
        </div>
        {bullet1Position.y != undefined && !showExplosion.show ? (
          <Bullets pos={bullet1Position} />
        ) : null}
        {bullet2Position.y != undefined && !showExplosion.show ? (
          <Bullets pos={bullet2Position} transform={"rotate(180deg)"} />
        ) : null}
      </div>
    </>
  );
};

export default GameGrid;
