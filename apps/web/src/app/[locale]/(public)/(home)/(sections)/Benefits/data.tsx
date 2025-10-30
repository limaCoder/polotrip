import { Camera, Map, Share2, Lock, Cloud, BookOpen } from 'lucide-react';
import { BenefitData } from './types';

export const benefitsData: BenefitData[] = [
  {
    id: 1,
    titleKey: 'organized_memories_title',
    descriptionKey: 'organized_memories_description',
    icon: <Camera />,
  },
  {
    id: 2,
    titleKey: 'interactive_map_title',
    descriptionKey: 'interactive_map_description',
    icon: <Map />,
  },
  {
    id: 3,
    titleKey: 'privacy_guaranteed_title',
    descriptionKey: 'privacy_guaranteed_description',
    icon: <Lock />,
  },
  {
    id: 4,
    titleKey: 'no_space_limitations_title',
    descriptionKey: 'no_space_limitations_description',
    icon: <Cloud />,
  },
  {
    id: 5,
    titleKey: 'narrative_experience_title',
    descriptionKey: 'narrative_experience_description',
    icon: <BookOpen />,
  },
  {
    id: 6,
    titleKey: 'easy_sharing_title',
    descriptionKey: 'easy_sharing_description',
    icon: <Share2 />,
  },
];
