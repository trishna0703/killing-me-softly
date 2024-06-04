import { setPositions } from "@/redux/feature/positions";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fireKeys, playerMovementKeys, speed } from "@/utils/constants";
import React, { useEffect, useState } from "react";

let bulletTimer1: NodeJS.Timeout;
let bulletTimer2: NodeJS.Timeout;

const usePositions = () => {
  const [xPos, setXPos] = useState(0);
  const dispatch = useAppDispatch();
  const player1 = useAppSelector((state) => state.positionReducer.player1);
  const player2 = useAppSelector((state) => state.positionReducer.player2);
  const bullet1 = useAppSelector((state) => state.positionReducer.bullet1);
  const bullet2 = useAppSelector((state) => state.positionReducer.bullet2);
  const [isColliding, setIsColliding] = useState({
    player1Hit: false,
    player2Hit: false,
    bulletsCollided: false,
    bulletCoordinates: { x: 0, y: 0 },
  });

  useEffect(() => {
    setXPos(window.innerWidth - 100);
  }, []);

  const handlePlayerMovement = (key: string) => {
    if (key == "s") {
      if (player1.y <= 200 + 20 * 12) {
        dispatch(
          setPositions({ player1: { x: player1.x, y: player1.y + speed } })
        );
      }
    } else if (key == "w") {
      if (player1.y >= speed) {
        dispatch(
          setPositions({ player1: { x: player1.x, y: player1.y - speed } })
        );
      }
    } else if (key == "ArrowUp") {
      if (player2.y >= speed) {
        dispatch(
          setPositions({ player2: { x: player2.x, y: player2.y - speed } })
        );
      }
    } else if (key == "ArrowDown") {
      if (player2.y <= 200 + 20 * 12) {
        dispatch(
          setPositions({ player2: { x: player2.x, y: player2.y + speed } })
        );
      }
    }
  };

  const handleFiring = (key: string) => {
    if (key == "d") {
      if (!bullet1.y) {
        dispatch(setPositions({ bullet1: { y: player1.y, x: 70 } }));
        handleBulletTraversingRight();
      }
    } else if (key == "ArrowLeft") {
      if (!bullet2.y) {
        dispatch(setPositions({ bullet2: { y: player2.y, x: xPos } }));
        handleBulletTraversingLeft();
      }
    }
  };

  const breakInterval = (timer: NodeJS.Timeout) => {
    clearInterval(timer);
    dispatch(
      setPositions({
        bullet1: { x: undefined, y: undefined },
        bullet2: { x: undefined, y: undefined },
      })
    );
  };

  const handleBulletTraversingLeft = () => {
    let bulletPos = bullet2.x ?? xPos;
    bulletTimer1 = setInterval((): any => {
      let newLeft = 0;

      newLeft = bulletPos - 20;
      bulletPos = newLeft;
      dispatch(
        setPositions({
          bullet2: { x: bulletPos, y: player2.y },
        })
      );

      if (newLeft <= 20) {
        breakInterval(bulletTimer1);
      }
    }, 25);
  };

  const handleBulletTraversingRight = () => {
    let bulletPos1 = bullet1.x ?? 40;
    bulletTimer2 = setInterval(() => {
      let newLeft = 0;

      newLeft = bulletPos1 + 20;
      bulletPos1 = newLeft;
      dispatch(
        setPositions({
          bullet1: { x: bulletPos1, y: player1.y },
        })
      );

      if (newLeft >= xPos + 50) {
        breakInterval(bulletTimer2);
      }
    }, 25);
  };

  const isPlayerInBulletRange = (player: any, bullet: any) => {
    // Calculate the range around the bullet
    let radius = 20;
    const leftBound = player.x - radius;
    const rightBound = player.x + radius;
    const lowerBound = bullet.y - radius;
    const upperBound = bullet.y + radius;

    const isBulletInHitRange = bullet.x >= leftBound && bullet.x <= rightBound;
    const isPlayerInHitRange = player.y >= lowerBound && player.y <= upperBound;

    return isBulletInHitRange && isPlayerInHitRange;
  };

  const areElementsWithinRadius = () => {
    const rect1 = bullet1.x ?? 20;
    const rect2 = bullet2.x ?? xPos;
    const radius1 = 20;
    const radius2 = 20;

    const centerX1 = rect1 + radius1;
    const centerY1 = bullet1.y ?? 0 + radius1;
    const centerX2 = rect2 + radius2;
    const centerY2 = bullet2.y ?? 0 + radius2;

    const distance = Math.sqrt(
      Math.pow(centerX2 - centerX1, 2) + Math.pow(centerY2 - centerY1, 2)
    );

    const sumOfRadii = radius1;

    return distance <= sumOfRadii;
  };

  const checkIfColliding = () => {
    let updatedStates = {};
    if (
      bullet1.y != undefined &&
      bullet2.y != undefined &&
      bullet1.x != undefined &&
      bullet2.x != undefined
    ) {
      if (bullet1.y == bullet2.y) {
        let areBulletsColliding = areElementsWithinRadius();
        if (areBulletsColliding) {
          let x = bullet1.x;
          let y = bullet1.y;
          updatedStates = {
            ...updatedStates,
            bulletsCollided: areBulletsColliding,
            bulletCoordinates: {
              x: x,
              y: y,
            },
          };
          breakInterval(bulletTimer2);
          breakInterval(bulletTimer1);
          setTimeout(() => {
            setIsColliding((prevIsColliding) => ({
              ...prevIsColliding,
              bulletsCollided: false,
              bulletCoordinates: { x: 0, y: 0 },
            }));
          }, 1000);
        }
      }
    }

    if (bullet2.y != undefined) {
      let isPlayerHit = isPlayerInBulletRange(player1, bullet2);
      if (isPlayerHit) {
        breakInterval(bulletTimer1);
        updatedStates = { ...updatedStates, player1Hit: true };
      }
    }
    if (bullet1.y != undefined) {
      let isPlayerHit = isPlayerInBulletRange(player2, bullet1);
      if (isPlayerHit) {
        breakInterval(bulletTimer2);
        updatedStates = { ...updatedStates, player2Hit: true };
      }
    }

    setIsColliding((prevIsColliding) => ({
      ...prevIsColliding,
      ...updatedStates,
    }));
  };

  useEffect(() => {
    checkIfColliding();
  }, [bullet1.x, bullet2.x, player1.y, player2.y]);

  const trackMovements = (key: string) => {
    if (fireKeys.includes(key)) {
      handleFiring(key);
    } else if (playerMovementKeys.includes(key)) {
      handlePlayerMovement(key);
    }
  };
  const handleReset = () => {
    setIsColliding({
      player1Hit: false,
      player2Hit: false,
      bulletsCollided: false,
      bulletCoordinates: { x: 0, y: 0 },
    });
    dispatch(
      setPositions({
        player1: { x: 20, y: 200 },
        player2: { x: xPos, y: 200 },
        bullet1: { x: 0, y: undefined },
        bullet2: { x: 0, y: undefined },
      })
    );
  };
  return { isColliding, trackMovements, handleReset };
};

export default usePositions;
