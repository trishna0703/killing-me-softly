import Image from "next/image";
import { Inter } from "next/font/google";
import Player1 from "@/components/players/Player1";
import Player2 from "@/components/players/Player2";
import GameGrid from "@/components/GameGrid";
import { useState } from "react";
import usePositions from "@/hooks/usePositions";
import { BulletPosition } from "@/utils/constants";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const { handleReset } = usePositions();
  const [showWinner, setShowWinner] = useState("");
  const [playerKilled, setPlayerKilled] = useState({
    player1: false,
    player2: false,
  });

  const [showExplosion, setShowExplosion] = useState<
    BulletPosition & { show: boolean }
  >({
    x: 0,
    y: 0,
    show: false,
  });
  const handleRestart = () => {
    handleReset();
    setShowWinner("");
    setShowExplosion({ show: false, x: 0, y: 0 });
    setPlayerKilled({ player1: false, player2: false });
  };

  return (
    <>
      {showWinner ? (
        <div className="resetScreen">
          <img src="/winner.png" alt="winner" />
          <h3>Congratulations {showWinner}!</h3>
          <p>You won this match.</p>
          <button onClick={handleRestart}>Restart Match</button>
        </div>
      ) : (
        <GameGrid
          {...{ showExplosion, playerKilled }}
          setShowWinner={(val: string) => setShowWinner(val)}
          setPlayerKilled={(val: any) => setPlayerKilled(val)}
          setShowExplosion={(val: any) => setShowExplosion(val)}
        />
      )}
    </>
  );
}
