import Image from "next/image";
import React, { useEffect, useState, useRef } from "react";
import { useAppSelector } from "@/redux/hooks";

const Player2 = () => {
  const moveUpImages = ["/stepup1.png", "/stepup2.png", "/stepup3.png"];
  const moveDownImages = ["/stepdown1.png", "/stepdown2.png", "/stepdown3.png"];
  const defaultPlayerImage = "/player1.png";
  const [movementDirection, setMovementDirection] = useState<
    "up" | "down" | "default"
  >("default");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const playerPosition = useAppSelector(
    (state) => state.positionReducer.player1
  );
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const getImages = () => {
    if (movementDirection === "up") {
      return moveUpImages;
    } else if (movementDirection === "down") {
      return moveDownImages;
    } else {
      return [defaultPlayerImage];
    }
  };

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === "w") {
        setMovementDirection("up");
        clearTimeout(timeoutRef.current!);
        timeoutRef.current = setTimeout(() => {
          setMovementDirection("default");
        }, moveUpImages.length * 500);
      } else if (event.key === "s") {
        setMovementDirection("down");
        clearTimeout(timeoutRef.current!);
        timeoutRef.current = setTimeout(() => {
          setMovementDirection("default");
        }, moveDownImages.length * 500);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
      clearTimeout(timeoutRef.current!);
    };
  }, [moveUpImages.length, moveDownImages.length]);

  useEffect(() => {
    const switchToNextImage = () => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % getImages().length);
    };

    clearInterval(intervalRef.current!);
    intervalRef.current = setInterval(switchToNextImage, 500);

    return () => {
      clearInterval(intervalRef.current!);
    };
  }, [movementDirection]);

  const images = getImages();

  return (
    <div>
      <button style={{ top: `${playerPosition.y}px` }} className="players">
        <Image
          src={images[currentImageIndex]}
          alt="player1"
          width={40}
          height={40}
        />
      </button>
    </div>
  );
};

export default Player2;
