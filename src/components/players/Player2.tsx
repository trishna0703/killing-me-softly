import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useAppSelector } from "@/redux/hooks";
import usePositions from "@/hooks/usePositions";

const Player2 = () => {
  const playerPosition = useAppSelector(
    (state) => state.positionReducer.player2
  );

  return (
    <div>
      <button style={{ top: `${playerPosition.y}px` }} className="players">
        <Image src={"/player2.jpg"} alt="player1" width={40} height={40} />
      </button>
      {/* {isFired ? <Bullets pos={bulletPosition} /> : null} */}
    </div>
  );
};

export default Player2;
