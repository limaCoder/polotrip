import { ImageResponse } from "next/og";

export const contentType = "image/png";
export const alt = "Polotrip - Fotos e Memórias de Viagens";

export default async function Image() {
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        backgroundImage: "url(https://polotrip.com/brand/open-graph.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    />,
    {
      width: 2780,
      height: 1450,
    }
  );
}
