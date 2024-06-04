export const speed = 20;

export type PlayerPositions = {
  y: number;
  x: number;
};

export type BulletPosition = {
  x: number | undefined;
  y: number | undefined;
};

export const playerMovementKeys = ["s", "w", "ArrowUp", "ArrowDown"];
export const fireKeys = ["d", "ArrowLeft"];
