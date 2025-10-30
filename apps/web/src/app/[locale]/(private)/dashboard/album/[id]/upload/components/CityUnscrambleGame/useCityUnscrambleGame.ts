import { useCallback, useEffect } from 'react';

import { useMemo } from 'react';

import { useState } from 'react';
import { cities as cityNames } from './data';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';

const useCityUnscrambleGame = () => {
  const t = useTranslations('CityUnscrambleGameHook');
  const tHints = useTranslations('CityHints');
  const [score, setScore] = useState(0);
  const [input, setInput] = useState('');
  const [currentCity, setCurrentCity] = useState<{
    original: string;
    scrambled: string;
    hint: string;
  }>({
    original: '',
    scrambled: '',
    hint: '',
  });

  const cities = useMemo(
    () => cityNames.map(city => ({ name: city, hint: tHints(city) })),
    [tHints],
  );

  const scrambleWord = useCallback((word: string) => {
    return word
      .split('')
      .sort(() => Math.random() - 0.5)
      .join('');
  }, []);

  const getNewCity = useCallback(() => {
    const city = cities[Math.floor(Math.random() * cities.length)];
    setCurrentCity({
      original: city.name,
      scrambled: scrambleWord(city.name),
      hint: city.hint,
    });
    setInput('');
  }, [scrambleWord, cities]);

  const checkAnswer = useCallback(() => {
    if (input.toUpperCase() === currentCity.original) {
      setScore(prev => prev + 10);
      getNewCity();
      toast.success(t('success_title'), {
        description: t('success_description'),
      });
    } else {
      toast.error(t('error_title'), {
        description: t('error_description'),
      });
    }
  }, [input, currentCity, getNewCity, t]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  }, []);

  useEffect(() => {
    getNewCity();
  }, [getNewCity]);

  return {
    score,
    input,
    currentCity,
    checkAnswer,
    handleInputChange,
  };
};

export { useCityUnscrambleGame };
