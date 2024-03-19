import { setPositions } from "@/redux/feature/positions";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fireKeys, playerMovementKeys, speed } from "@/utils/constants";
import React, { useEffect, useState } from "react";

var bulletTimer1: NodeJS.Timeout;
var bulletTimer2: NodeJS.Timeout;
const usePositions = () => {
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

  const handlePlayerMovement = (key: string) => {
    console.log("called  ", key);
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
      // console.log("player 1 position ", player1);
      console.log("fire bullet 1");
      dispatch(setPositions({ bullet1: { y: player1.y, x: 40 } }));
      handleBulletTraversingRight();
    } else if (key == "ArrowLeft") {
      console.log("fire bullet 2");
      dispatch(setPositions({ bullet2: { y: player2.y, x: 920 } }));
      handleBulletTraversingLeft();
    }
  };

  const breakInterval = (timer: NodeJS.Timeout) => {
    console.log("break interval");
    clearInterval(timer);
    dispatch(
      setPositions({
        bullet1: { x: undefined, y: undefined },
        bullet2: { x: undefined, y: undefined },
      })
    );
  };

  const handleBulletTraversingLeft = () => {
    let bulletPos = bullet2.x || 920;
    bulletTimer1 = setInterval((): any => {
      let newLeft = 0;

      newLeft = bulletPos - 20;
      bulletPos = newLeft;
      dispatch(
        setPositions({
          bullet2: { x: bulletPos, y: player2.y },
        })
      );

      if (newLeft <= 40) {
        breakInterval(bulletTimer1);
      }
    }, 25);
  };
  const handleBulletTraversingRight = () => {
    let bulletPos1 = bullet1.x || 40;
    bulletTimer2 = setInterval(() => {
      let newLeft = 0;

      newLeft = bulletPos1 + 20;
      bulletPos1 = newLeft;
      dispatch(
        setPositions({
          bullet1: { x: bulletPos1, y: player1.y },
        })
      );

      if (newLeft >= 960) {
        breakInterval(bulletTimer2);
      }
    }, 25);
  };
  const isPlayerInBulletRange = (player: any, bullet: any) => {
    // Calculate the range around the bullet
    let radius = 20;
    console.log({ player });
    const leftBound = player.x - radius;
    const rightBound = player.x + radius;
    const lowerBound = bullet.y - radius;
    const upperBound = bullet.y + radius;

    const isBulletInHitRange = bullet.x >= leftBound && bullet.x <= rightBound;
    const isPlayerInHitRange = player.y >= lowerBound && player.y <= upperBound;

    console.log({
      isBulletInHitRange,
      isPlayerInHitRange,
      leftBound,
      rightBound,
    });
    // Check if player.y falls within the range
    return isBulletInHitRange && isPlayerInHitRange;
  };

  const areElementsWithinRadius = () => {
    const rect1 = bullet1.x || 40;
    const rect2 = bullet2.x || 960;
    const radius1 = 20;
    const radius2 = 20;

    const centerX1 = rect1 + radius1;
    const centerY1 = bullet1.y || 0 + radius1;
    const centerX2 = rect2 + radius2;
    const centerY2 = bullet2.y || 0 + radius2;

    const distance = Math.sqrt(
      Math.pow(centerX2 - centerX1, 2) + Math.pow(centerY2 - centerY1, 2)
    );

    const sumOfRadii = radius1;
    console.log("distance ", distance, rect1, rect2, distance <= sumOfRadii);
    return distance <= sumOfRadii;
  };

  const checkIfColliding = () => {
    let updatedStates = {};
    // console.log("checking hits ", bullet1.y, bullet2.y);
    if (
      bullet1.y != undefined &&
      bullet2.y != undefined &&
      bullet1.x != undefined &&
      bullet2.x != undefined
    ) {
      if (bullet1.y == bullet2.y) {
        // console.log("step bullets true ");
        let areBulletsColliding = areElementsWithinRadius();
        if (areBulletsColliding) {
          let x = bullet1.x;
          let y = bullet1.y;
          console.log("detected collision 1 =>", areBulletsColliding, x, y);
          updatedStates = {
            ...updatedStates,
            bulletsCollided: areBulletsColliding,
            bulletCoordinates: {
              x: x,
              y: y,
            },
          };
          // setBreakBulletTraversal(true);
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
      // console.log("player 1 hit check");
      let isPlayerHit = isPlayerInBulletRange(player1, bullet2);
      // console.log({ isPlayerHit }, "player 1");
      if (isPlayerHit) {
        updatedStates = { ...updatedStates, player1Hit: true };
      }
    }
    if (bullet1.y != undefined) {
      // console.log("player 2 hit check");
      let isPlayerHit = isPlayerInBulletRange(player2, bullet1);
      // console.log({ isPlayerHit }, "player 2");
      if (isPlayerHit) {
        updatedStates = { ...updatedStates, player2Hit: true };
      }
    }
    console.log("detected collision step updated states", { updatedStates });
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
        bullet1: { x: undefined, y: undefined },
        bullet2: { x: undefined, y: undefined },
        player1: { x: 40, y: 230 },
        player2: { x: 960, y: 230 },
      })
    );
  };
  return { isColliding, trackMovements, handleReset };
};

export default usePositions;
