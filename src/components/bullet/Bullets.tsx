import { BulletPosition } from "@/utils/constants";
import Image from "next/image";
import React, { forwardRef, useEffect, useState } from "react";

const Bullets = ({
  pos,
  firingMotion,
  forwardedRef,
  setIsFired,
}: {
  pos: BulletPosition;
  firingMotion: string;
  forwardedRef: any;
  setIsFired: () => void;
}) => {
  useEffect(() => {
    window.addEventListener("animationend", setIsFired);

    return () => {
      window.removeEventListener("animationend", setIsFired);
    };
  }, [forwardedRef, setIsFired]);

  return (
    <div
      style={{ position: "absolute", top: pos.y }}
      className={firingMotion}
      ref={forwardedRef}
    >
      <Image src={"/bullet.jpg"} alt="player1" width={40} height={40} />
    </div>
  );
};

export default Bullets;
