import { BulletPosition, PlayerPositions } from "@/utils/constants";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type InitialState = {
  player1: PlayerPositions;
  player2: PlayerPositions;
  bullet1: BulletPosition;
  bullet2: BulletPosition;
};

const initialState = {
  player1: { x: 20, y: 200 },
  player2: { x: 1400, y: 200 },
  bullet1: { x: 0, y: undefined },
  bullet2: { x: 0, y: undefined },
} as InitialState;

export const position = createSlice({
  name: "positions",
  initialState,
  reducers: {
    logOut: () => {
      return initialState;
    },
    setPositions: (state, action: PayloadAction<any>) => {
      state = { ...state, ...action.payload };
      return state;
    },
  },
});

export const { setPositions } = position.actions;
export default position.reducer;
