import { useCallback, useEffect } from 'react';

import { useMemo } from 'react';

import { useState } from 'react';
import { citiesData } from './data';
import { toast } from 'sonner';

const useCityUnscrambleGame = () => {
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

  const cities = useMemo(() => citiesData, []);

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
      toast.success('Parabéns! 🎉', {
        description: 'Você acertou!',
      });
    } else {
      toast.error('Tente novamente! 🤔', {
        description: 'Não foi dessa vez...',
      });
    }
  }, [input, currentCity, getNewCity]);

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
