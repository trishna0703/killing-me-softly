import Image from "next/image";
import { Inter } from "next/font/google";
import Player1 from "@/components/players/Player1";
import Player2 from "@/components/players/Player2";
import GameGrid from "@/components/GameGrid";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <>
      {/* <div>KILLING ME SOFTLY</div> */}
      <GameGrid />
    </>
  );
}
