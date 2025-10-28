type UserDataState = {
  userAvatar: string | undefined;
  userName: string | undefined;
  usernameInitials: string | undefined;
};

interface HomeContentProps {
  isHome?: boolean;
}

interface HeaderDesktopProps {
  isHome?: boolean;
}

export type { HeaderDesktopProps, HomeContentProps, UserDataState };
