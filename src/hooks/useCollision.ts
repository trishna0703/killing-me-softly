import { useAppSelector } from "@/redux/hooks";
import { useEffect, useState } from "react";

const useCollision = () => {
  const [isColliding, setIsColliding] = useState({
    player1Hit: false,
    player2Hit: false,
    bulletsCollided: false,
  });

  const bullet1Position = useAppSelector(
    (state) => state.positionReducer.bullet1
  );
  const bullet2Position = useAppSelector(
    (state) => state.positionReducer.bullet2
  );
  const player1Position = useAppSelector(
    (state) => state.positionReducer.player1
  );
  const player2Position = useAppSelector(
    (state) => state.positionReducer.player2
  );

  const checkIfColliding = () => {
    let updatedStates = {};
    if (bullet1Position.y && bullet2Position.y) {
      if (bullet1Position.y == bullet2Position.y) {
        updatedStates = { ...updatedStates, bulletsCollided: true };
      }
    }
    if (bullet2Position.y) {
      if (player1Position.y == bullet2Position.y) {
        updatedStates = { ...updatedStates, player1Hit: true };
      }
    }
    if (bullet1Position.y) {
      if (player2Position.y == bullet1Position.y) {
        updatedStates = { ...updatedStates, player2Hit: true };
      }
    }

    setIsColliding({ ...isColliding, ...updatedStates });
  };

  useEffect(() => {
    checkIfColliding();
  }, [bullet1Position, bullet2Position, player1Position, player2Position]);

  return isColliding;
};

export default useCollision;
