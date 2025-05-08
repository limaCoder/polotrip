import { LoadingGameWrapperProps } from './types';

export function LoadingGameWrapper({
  isCompressing,
  isUploading,
  children,
  className,
}: LoadingGameWrapperProps) {
  if (!isCompressing && !isUploading) return null;

  return (
    <div className={className}>
      <div className="border-t pt-4">
        <p className="text-center text-sm text-gray-500 mb-4">
          {isCompressing
            ? 'Enquanto otimizamos suas fotos, vamos jogar um jogo!'
            : 'Enquanto suas fotos estão sendo enviadas, vamos jogar um jogo!'}
        </p>
        {children}
      </div>
    </div>
  );
}
