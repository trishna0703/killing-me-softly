import Image from "next/image";
import React, { useEffect } from "react";
import { useAppSelector } from "@/redux/hooks";
import usePositions from "@/hooks/usePositions";

const Player1 = () => {
  const playerPosition = useAppSelector(
    (state) => state.positionReducer.player1
  );

  return (
    <div>
      <button style={{ top: `${playerPosition.y}px` }} className="players">
        <Image src={"/player1.jpg"} alt="player1" width={40} height={40} />
      </button>
    </div>
  );
};
export default Player1;
