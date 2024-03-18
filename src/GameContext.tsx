import React, { createContext, useContext, useState } from "react";

type Position = {
  x: number;
  y: number;
};

type PlayerPositon = {
  y: number;
};

const GameContext = createContext({});

// Create a custom hook to use the context
export const useGameContext = () => useContext(GameContext);

// Create a provider component
export const GameProvider = ({ children }: any) => {
  const [player1Position, setPlayer1Position] = useState<PlayerPositon>({
    y: 0,
  });
  const [player2Position, setPlayer2Position] = useState<PlayerPositon>({
    y: 0,
  });
  const [bullet1Position, setBullet1Position] = useState<Position>({
    x: 0,
    y: 0,
  });
  const [bullet2Position, setBullet2Position] = useState<Position>({
    x: 0,
    y: 0,
  });

  return (
    <GameContext.Provider
      value={{
        player1Position,
        setPlayer1Position,
        player2Position,
        setPlayer2Position,
        bullet1Position,
        setBullet1Position,
        bullet2Position,
        setBullet2Position,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
