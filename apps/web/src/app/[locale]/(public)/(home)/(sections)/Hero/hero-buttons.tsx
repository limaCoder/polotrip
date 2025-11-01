'use client';

import { ButtonNavigation } from '@/components/ButtonNavigation';
import { usePostHog } from '@/hooks/usePostHog';
import { HeroButtonsProps } from './types';

export function HeroButtons({
  howItWorksText,
  howItWorksAria,
  seeExampleText,
  seeExampleAria,
}: HeroButtonsProps) {
  const { capture } = usePostHog();

  const handleHowItWorksClick = () => {
    capture('hero_how_it_works_clicked', {
      button_text: howItWorksText,
      target: '#how-it-works',
    });
  };

  const handleSeeExampleClick = () => {
    capture('hero_see_example_clicked', {
      button_text: seeExampleText,
      target: '/album/a9jrss8qhxerqnsglmpks2da',
    });
  };

  return (
    <>
      <ButtonNavigation
        href="#how-it-works"
        className="bg-primary text-white button-shadow"
        aria-label={howItWorksAria}
        onClick={handleHowItWorksClick}
      >
        <span className="font-bold">{howItWorksText}</span>
      </ButtonNavigation>
      <ButtonNavigation
        href="/album/a9jrss8qhxerqnsglmpks2da"
        className="bg-yellow text-black button-shadow"
        aria-label={seeExampleAria}
        onClick={handleSeeExampleClick}
      >
        <span className="font-bold">{seeExampleText}</span>
      </ButtonNavigation>
    </>
  );
}
