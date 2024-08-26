import Image from "next/image";
import Game from "./component/Game";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
     <Game />
    </main>
  );
}
