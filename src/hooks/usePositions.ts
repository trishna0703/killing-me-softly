import { setPositions } from "@/redux/feature/positions";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fireKeys, playerMovementKeys, speed } from "@/utils/constants";
import React, { useEffect, useState } from "react";

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
  });

  const handlePlayerMovement = (key: string) => {
    console.log("called  ", key);
    if (key == "s") {
      dispatch(
        setPositions({ player1: { x: player1.x, y: player1.y + speed } })
      );
    } else if (key == "w") {
      dispatch(
        setPositions({ player1: { x: player1.x, y: player1.y - speed } })
      );
    } else if (key == "ArrowUp") {
      dispatch(
        setPositions({ player2: { x: player2.x, y: player2.y - speed } })
      );
    } else if (key == "ArrowDown") {
      dispatch(
        setPositions({ player2: { x: player2.x, y: player2.y + speed } })
      );
    }
  };

  const handleFiring = (key: string) => {
    if (key == "d") {
      // console.log("player 1 position ", player1);
      console.log("fire bullet 1");
      dispatch(setPositions({ bullet1: { y: player1.y, x: 0 } }));
      handleBulletTraversingRight();
    } else if (key == "ArrowLeft") {
      console.log("fire bullet 2");
      dispatch(setPositions({ bullet2: { y: player2.y, x: 900 } }));
      handleBulletTraversingLeft();
    }
  };

  const handleBulletTraversingLeft = () => {
    let bulletPos = bullet2.x || 900;
    const timer = setInterval(() => {
      let newLeft = 0;

      newLeft = bulletPos - 20;
      bulletPos = newLeft;
      dispatch(
        setPositions({
          bullet2: { x: bulletPos, y: player2.y },
        })
      );

      if (newLeft <= 0) {
        clearInterval(timer);
        dispatch(
          setPositions({
            bullet2: { x: undefined, y: undefined },
          })
        );
      }
    }, 50);
  };
  const handleBulletTraversingRight = () => {
    let bulletPos1 = bullet1.x || 0;
    const timer = setInterval(() => {
      let newLeft = 0;

      newLeft = bulletPos1 + 20;
      bulletPos1 = newLeft;
      dispatch(
        setPositions({
          bullet1: { x: bulletPos1, y: player1.y },
        })
      );

      if (newLeft >= 900) {
        clearInterval(timer);
        dispatch(
          setPositions({
            bullet1: { x: undefined, y: undefined },
          })
        );
      }
    }, 50);
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
        updatedStates = { ...updatedStates, bulletsCollided: true };
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
    // console.log("step updated states", { updatedStates });
    setIsColliding({ ...isColliding, ...updatedStates });
  };

  useEffect(() => {
    checkIfColliding();
  }, [bullet1, bullet2, player1.y, player2.y]);

  const trackMovements = (key: string) => {
    if (fireKeys.includes(key)) {
      handleFiring(key);
    } else if (playerMovementKeys.includes(key)) {
      handlePlayerMovement(key);
    }
  };
  return { isColliding, trackMovements };
};

export default usePositions;
