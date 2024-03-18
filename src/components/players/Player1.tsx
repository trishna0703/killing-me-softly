import { speed } from "@/utils/constants";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";

const Player1 = () => {
  
  const [position, setPosition] = useState<number>(1);

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
      if (event.key === "s") {
        handleDownMotion();
      } else if (event.key === "w") {
        handleUpMotion();
      }
    };

    window.addEventListener("keypress", handleKeyPress);

    return () => {
      window.removeEventListener("keypress", handleKeyPress);
    };
  });

  return (
    <button style={{ top: `${position}px` }} className="players">
      <Image src={"/player1.jpg"} alt="player1" width={40} height={40} />
    </button>
  );
};

export default Player1;
