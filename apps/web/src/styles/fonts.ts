import { Epilogue, Fraunces, Plus_Jakarta_Sans } from "next/font/google";

const fontFraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
});

const fontJakarta = Plus_Jakarta_Sans({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-jakarta",
});

const fontEpilogue = Epilogue({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-epilogue",
});

export const fontFrauncesVariable = fontFraunces.variable;
export const fontJakartaVariable = fontJakarta.variable;
export const fontEpilogueVariable = fontEpilogue.variable;
