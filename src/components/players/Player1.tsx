import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useAppSelector } from "@/redux/hooks";
import usePositions from "@/hooks/usePositions";

const Player1 = () => {
  const moveUpImages = ["/stepup1.png", "/stepup2.png", "/stepup3.png"];
  const moveDownImages = ["/stepdown1.png", "/stepdown2.png", "/stepdown3.png"];
  const [movementDirection, setMovementDirection] = useState<
    "up" | "down" | "default"
  >("default");
  const defaultPlayerImage = "/player1.png";
  let images;
  if (movementDirection === "up") {
    images = moveUpImages;
  } else if (movementDirection === "down") {
    images = moveDownImages;
  } else {
    images = [defaultPlayerImage]; // Use default player image if no movement
  }
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const playerPosition = useAppSelector(
    (state) => state.positionReducer.player1
  );

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === "w") {
        setMovementDirection("up");
        setTimeout(() => {
          setMovementDirection("default"); // Switch back to default image after animation is over
        }, moveUpImages.length * 500);
      } else if (event.key === "s") {
        setMovementDirection("down");
        setTimeout(() => {
          setMovementDirection("default"); // Switch back to default image after animation is over
        }, moveDownImages.length * 500);
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  });

  useEffect(() => {
    const switchToNextImage = () => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    const intervalId = setInterval(switchToNextImage, 500);

    return () => {
      clearInterval(intervalId);
      // setMovementDirection("");
    };
  }, [images.length]);

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
export default Player1;
