'use client';

import { CityUnscrambleGameProps } from './types';
import { useCityUnscrambleGame } from './useCityUnscrambleGame';
import { useTranslations } from 'next-intl';

export function CityUnscrambleGame({ className }: CityUnscrambleGameProps) {
  const t = useTranslations('UploadPage.CityUnscrambleGame');
  const { score, input, currentCity, checkAnswer, handleInputChange } = useCityUnscrambleGame();

  return (
    <div className={className}>
      <div className="text-center mb-4">
        <h3 className="font-medium mb-1">{t('title')}</h3>
        <p className="text-2xl font-bold mb-2">{currentCity.scrambled}</p>
        <p className="text-sm text-gray-500">{currentCity.hint}</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-2 mb-4">
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          onKeyUp={e => e.key === 'Enter' && checkAnswer()}
          className="flex-1 border rounded-md px-3 py-2"
          placeholder={t('placeholder')}
        />
        <button
          onClick={checkAnswer}
          className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
        >
          {t('check_button')}
        </button>
      </div>

      <p className="text-center text-sm">
        {t('score')}: <span className="font-bold">{score}</span>
      </p>
    </div>
  );
}
