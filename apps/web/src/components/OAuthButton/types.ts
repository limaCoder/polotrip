import type { ButtonProps } from "../Button/types";

type OAuthButtonProps = ButtonProps & {
  provider: "google";
};

export type { OAuthButtonProps };
