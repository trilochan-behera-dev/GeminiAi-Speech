import Image from "next/image";
import { Inter } from "next/font/google";
import SpeechRecognition from "../components/SpeechRecognition"

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <main
      className={`min-h-screen w-full}`}
    >
      <SpeechRecognition/>
    </main>
  );
}
