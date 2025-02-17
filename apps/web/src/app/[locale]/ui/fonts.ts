import { Epilogue } from 'next/font/google';

const fontEpilogue = Epilogue({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-epilogue',
});

export const fontEpilogueVariable = fontEpilogue.variable;
