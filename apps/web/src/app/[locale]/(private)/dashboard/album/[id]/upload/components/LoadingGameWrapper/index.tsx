import { LoadingGameWrapperProps } from './types';

export function LoadingGameWrapper({
  isCompressing,
  isUploading,
  children,
  className,
}: LoadingGameWrapperProps) {
  if (!isCompressing && !isUploading) return null;

  return (
    <div className={`${className} bg-secondary/5 rounded-xl p-2 mt-8`} id="waiting-game">
      <div className="mx-auto">
        <div className="text-center space-y-3 mb-6">
          <h4 className="font-title_three text-primary">Hora do Word Scramble! 🎮</h4>
          <p className="text-sm text-text/70">
            {isCompressing
              ? 'Enquanto nossas engrenagens mágicas otimizam suas fotos, que tal exercitar seu vocabulário?'
              : 'Enquanto suas fotos viajam pela internet, vamos testar suas habilidades com palavras!'}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">{children}</div>
      </div>
    </div>
  );
}
