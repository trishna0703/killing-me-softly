import React, { useState } from "react";
import Player1 from "./players/Player1";
import Player2 from "./players/Player2";

const GameGrid = () => {
  return (
    <div className="gameGrid">
      <div className="playerPositionsHorizontal ">
        <Player1 />
      </div>
      <div className="playerPositionsHorizontal ">
        <Player2 />
      </div>
    </div>
  );
};

export default GameGrid;
