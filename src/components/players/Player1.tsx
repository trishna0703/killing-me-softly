import { speed } from "@/utils/constants";
import Image from "next/image";
import React, { Ref, forwardRef, useEffect, useRef, useState } from "react";
import Bullets from "../bullet/Bullets";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setPositions } from "@/redux/feature/positions";

const Player1 = ({
  forwardedRef,
}: {
  forwardedRef: React.MutableRefObject<any>;
}) => {
  const bulletPosition = useAppSelector(
    (state) => state.positionReducer.bullet1
  );
  const playerPosition = useAppSelector(
    (state) => state.positionReducer.player1
  );
  const dispatch = useAppDispatch();
  const [isFired, setIsFired] = useState(false);

  const handleUpMotion = () => {
    if (playerPosition.y >= speed) {
      dispatch(setPositions({ player1: { y: playerPosition.y - speed } }));
    }
  };
  const handleDownMotion = () => {
    if (playerPosition.y <= window.innerHeight - 50) {
      dispatch(setPositions({ player1: { y: playerPosition.y + speed } }));
    }
  };

  useEffect(() => {
    const handleKeyPress = (event: any) => {
      if (event.key === "s") {
        handleDownMotion();
      } else if (event.key === "w") {
        handleUpMotion();
      } else if (event.key === "d") {
        if (!isFired) {
          dispatch(
            setPositions({
              bullet1: { x: 0, y: playerPosition.y },
            })
          );
          setIsFired(true);
        }
      }
    };

    window.addEventListener("keypress", handleKeyPress);

    return () => {
      window.removeEventListener("keypress", handleKeyPress);
    };
  });

  return (
    <div>
      <button style={{ top: `${playerPosition.y}px` }} className="players">
        <Image src={"/player1.jpg"} alt="player1" width={40} height={40} />
      </button>
      {isFired ? (
        <Bullets
          pos={bulletPosition}
          firingMotion={"playerOneFiring"}
          forwardedRef={forwardedRef}
          setIsFired={() => setIsFired(false)}
        />
      ) : null}
    </div>
  );
};
export default Player1;
