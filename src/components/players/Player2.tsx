import { BulletPosition, speed } from "@/utils/constants";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Bullets from "../bullet/Bullets";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setPositions } from "@/redux/feature/positions";

const Player2 = ({
  forwardedRef,
}: {
  forwardedRef: React.MutableRefObject<any>;
}) => {
  const playerPosition = useAppSelector(
    (state) => state.positionReducer.player2
  );
  const dispatch = useAppDispatch();
  const bulletPosition = useAppSelector(
    (state) => state.positionReducer.bullet2
  );
  const [isFired, setIsFired] = useState(false);

  const handleUpMotion = () => {
    if (playerPosition.y >= speed) {
      dispatch(setPositions({ player2: { y: playerPosition.y - speed } }));
    }
  };
  const handleDownMotion = () => {
    if (playerPosition.y <= window.innerHeight - 50) {
      dispatch(setPositions({ player2: { y: playerPosition.y + speed } }));
    }
  };

  useEffect(() => {
    const handleKeyPress = (event: any) => {
      if (event.key == "ArrowDown") {
        handleDownMotion();
      } else if (event.key == "ArrowUp") {
        handleUpMotion();
      } else if (event.key === "ArrowLeft") {
        if (!isFired) {
          dispatch(
            setPositions({
              bullet2: { x: 0, y: playerPosition.y },
            })
          );
          setIsFired(true);
        }
      }
    };

    window.addEventListener("keyup", handleKeyPress);

    return () => {
      window.removeEventListener("keyup", handleKeyPress);
    };
  });

  return (
    <div>
      <button style={{ top: `${playerPosition.y}px` }} className="players">
        <Image src={"/player2.jpg"} alt="player1" width={40} height={40} />
      </button>
      {isFired ? (
        <Bullets
          pos={bulletPosition}
          firingMotion={"playerTwoFiring"}
          forwardedRef={forwardedRef}
          setIsFired={() => setIsFired(false)}
        />
      ) : null}
    </div>
  );
};

export default Player2;
