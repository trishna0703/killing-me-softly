import React, { useEffect, useRef, useState } from "react";
import Player1 from "./players/Player1";
import Player2 from "./players/Player2";
import { useGameContext } from "@/GameContext";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setPositions } from "@/redux/feature/positions";
import useCollision from "@/hooks/useCollision";
import Image from "next/image";
import { BulletPosition } from "@/utils/constants";

const GameGrid = () => {
  const collisions = useCollision();
  const bullet1Position = useAppSelector(
    (state) => state.positionReducer.bullet1
  );
  const [playerKilled, setPlayerKilled] = useState({
    player1: false,
    player2: false,
  });
  const dispatch = useAppDispatch();
  const bulletRef = useRef<any>(null);
  const bulletTwoRef = useRef<any>(null);
  const [showExplosion, setShowExplosion] = useState<
    BulletPosition & { show: boolean }
  >({
    x: 0,
    y: 0,
    show: false,
  });

  useEffect(() => {
    if (collisions.bulletsCollided) {
      const positionOfPlayerOneBullet =
        bulletRef.current.getBoundingClientRect();
      const positionOfPlayerTwoBullet =
        bulletTwoRef.current.getBoundingClientRect();

      const intersectionLeft = Math.max(
        positionOfPlayerOneBullet.left,
        positionOfPlayerTwoBullet.left
      );
      const intersectionRight = Math.min(
        positionOfPlayerOneBullet.right,
        positionOfPlayerTwoBullet.right
      );

      const intersectionCenterX = (intersectionLeft + intersectionRight) / 2;
      setShowExplosion({
        x: intersectionCenterX,
        y: bullet1Position.y,
        show: true,
      });

      dispatch(
        setPositions({
          bullet1: { x: 0, y: 0 },
          bullet2: { x: 0, y: 0 },
        })
      );
    }
  }, [collisions.bulletsCollided]);

  useEffect(() => {
    if (collisions.player1Hit) {
      setPlayerKilled({ ...playerKilled, player1: true });
    }
  }, [collisions.player1Hit]);

  useEffect(() => {
    if (collisions.player2Hit) {
      setPlayerKilled({ ...playerKilled, player2: true });
    }
  }, [collisions.player2Hit]);

  console.log({ collisions, showExplosion });

  return (
    // <>
    <div className="gameGrid">
      {showExplosion.show ? (
        <Image
          style={{
            position: "absolute",
            top: `${showExplosion.y}px`,
            left: `${showExplosion.x}px`,
            transition: "all .2s ease",
          }}
          src="/explosion.jpg"
          alt="explosion"
          width={50}
          height={50}
        ></Image>
      ) : null}
      <div className="playerPositionsHorizontal ">
        {playerKilled?.player1 ? null : <Player1 forwardedRef={bulletRef} />}
      </div>
      <div className="playerPositionsHorizontal ">
        {playerKilled?.player1 ? null : <Player2 forwardedRef={bulletTwoRef} />}
      </div>
    </div>
    // </>
  );
};

export default GameGrid;
