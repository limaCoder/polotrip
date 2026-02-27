import Image from "next/image";

export default function AlbumLoading() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center gap-10 bg-background">
      <div className="flex flex-col items-center gap-8">
        <div className="relative h-16 w-16 animate-pulse">
          <Image
            alt="Polotrip Logo"
            className="object-contain"
            fill
            priority
            src="/brand/polotrip-icon.png"
          />
        </div>

        <div className="relative h-1 w-48 overflow-hidden rounded-full bg-primary/10">
          <div
            className="absolute h-full w-full origin-left bg-primary"
            style={{
              animation: "progress-fill 1s infinite ease-in-out",
              boxShadow: "0 0 10px var(--primary)",
            }}
          />
        </div>
      </div>
    </div>
  );
}
