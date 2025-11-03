"use client";

import { useCallback, useEffect, useState } from "react";
import { InstallPwaModal } from "@/components/InstallPwaModal";
import { usePostHog } from "@/hooks/usePostHog";
import { ONBOARDING_COMPLETED_EVENT } from "./onboarding-modal-wrapper";

const IS_MOBILE_REGEX =
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
const IS_TABLET_REGEX = /iPad|Tablet/i;

export function InstallPwaModalWrapper() {
  const [isOpen, setIsOpen] = useState(false);
  const { capture } = usePostHog();

  const checkAndShowPwaModal = useCallback(() => {
    const hasSeenPwaInstall =
      localStorage.getItem("pwa-install") === "completed";

    const isMobile = IS_MOBILE_REGEX.test(window.navigator.userAgent);

    if (!hasSeenPwaInstall && isMobile) {
      setIsOpen(true);
      capture("pwa_install_prompt_shown", {
        device_type: IS_TABLET_REGEX.test(window.navigator.userAgent)
          ? "tablet"
          : "mobile",
        user_agent: window.navigator.userAgent,
      });
    }
  }, [capture]);

  useEffect(() => {
    const hasSeenOnboarding =
      localStorage.getItem("onboarding") === "completed";

    if (hasSeenOnboarding) {
      checkAndShowPwaModal();
    }

    const handleOnboardingCompleted = () => {
      checkAndShowPwaModal();
    };

    window.addEventListener(
      ONBOARDING_COMPLETED_EVENT,
      handleOnboardingCompleted
    );

    return () => {
      window.removeEventListener(
        ONBOARDING_COMPLETED_EVENT,
        handleOnboardingCompleted
      );
    };
  }, [checkAndShowPwaModal]);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem("pwa-install", "completed");

    capture("pwa_install_dismissed", {
      device_type: IS_TABLET_REGEX.test(window.navigator.userAgent)
        ? "tablet"
        : "mobile",
    });
  };

  const handleInstall = () => {
    capture("pwa_install_accepted", {
      device_type: IS_TABLET_REGEX.test(window.navigator.userAgent)
        ? "tablet"
        : "mobile",
    });
    handleClose();
  };

  return (
    <InstallPwaModal
      isOpen={isOpen}
      onClose={handleClose}
      onInstall={handleInstall}
    />
  );
}
