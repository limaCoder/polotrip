import { CheckCircle2, Clock, Film, Heart, Loader2, PartyPopper, XCircle } from 'lucide-react';
import type { StatusConfig, VideoProgressProps } from './types';

const STATUS_CONFIG: Record<VideoProgressProps['status'], StatusConfig> = {
  pending: {
    icon: Clock,
    colorClass: 'text-yellow-500',
    bgClass: 'bg-yellow-500/10',
  },
  processing: {
    icon: Loader2,
    colorClass: 'text-blue-500',
    bgClass: 'bg-blue-500/10',
    animate: true,
  },
  success: {
    icon: CheckCircle2,
    colorClass: 'text-green-500',
    bgClass: 'bg-green-500/10',
  },
  failed: {
    icon: XCircle,
    colorClass: 'text-red-500',
    bgClass: 'bg-red-500/10',
  },
};

const STYLE_OPTIONS = [
  {
    value: 'emotional',
    icon: Heart,
    labelKey: 'emotional',
    descriptionKey: 'emotional_description',
  },
  {
    value: 'documentary',
    icon: Film,
    labelKey: 'documentary',
    descriptionKey: 'documentary_description',
  },
  {
    value: 'fun',
    icon: PartyPopper,
    labelKey: 'fun',
    descriptionKey: 'fun_description',
  },
] as const;

export { STATUS_CONFIG, STYLE_OPTIONS };
