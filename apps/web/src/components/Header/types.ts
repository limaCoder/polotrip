type UserDataState = {
  userAvatar: string | undefined;
  userName: string | undefined;
  usernameInitials: string | undefined;
};

type HomeContentProps = {
  isHome?: boolean;
};

type HeaderDesktopProps = {
  isHome?: boolean;
};

export type { HeaderDesktopProps, HomeContentProps, UserDataState };
