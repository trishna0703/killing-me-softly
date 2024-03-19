import { setPositions } from "@/redux/feature/positions";
import { useAppDispatch } from "@/redux/hooks";
import { BulletPosition } from "@/utils/constants";
import Image from "next/image";
import React, { forwardRef, useEffect, useState } from "react";

const Bullets = ({
  pos,
  transform,
}: {
  pos: BulletPosition;
  transform?: string;
}) => {
  return (
    <div
      style={{
        position: "absolute",
        top: `${pos.y}px`,
        left: `${pos.x}px`,
        width: "40px",
        transition: "all .1s ease",
        transform: transform,
      }}
    >
      <Image src={"/bullet.png"} alt="bullet" width={40} height={40} />
    </div>
  );
};

export default Bullets;
