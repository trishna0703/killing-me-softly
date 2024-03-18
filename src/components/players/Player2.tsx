import { speed } from "@/utils/constants";
import Image from "next/image";
import React, { useEffect, useState } from "react";

const Player2 = () => {
  const [position, setPosition] = useState<number>(0);

  const handleUpMotion = () => {
    if (position >= speed) {
      setPosition(position - speed);
    }
  };
  const handleDownMotion = () => {
    if (position <= window.innerHeight - 50) setPosition(position + speed);
  };

  useEffect(() => {
    const handleKeyPress = (event: any) => {
      if (event.key == "ArrowDown") {
        handleDownMotion();
      } else if (event.key == "ArrowUp") {
        handleUpMotion();
      }
    };

    window.addEventListener("keyup", handleKeyPress);

    return () => {
      window.removeEventListener("keyup", handleKeyPress);
    };
  });

  console.log(position);
  return (
    <button style={{ top: `${position}px` }} className="players">
      <Image src={"/player2.jpg"} alt="player2" width={40} height={40} />
    </button>
  );
};

export default Player2;
