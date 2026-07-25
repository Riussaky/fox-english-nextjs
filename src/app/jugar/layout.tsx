import { SoundControls } from "@/components/games/SoundControls";

export default function JugarLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <SoundControls />
    </>
  );
}
