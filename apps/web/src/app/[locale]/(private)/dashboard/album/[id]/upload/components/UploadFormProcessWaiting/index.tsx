import LottieAnimation from '@/components/LottieAnimation';
import waitingAnimation from '@/assets/lottie/waiting.json';
import { UploadFormProcessWaitingProps } from './types';

function UploadFormProcessWaiting({
  isCompressingState,
  uploadFormState,
}: UploadFormProcessWaitingProps) {
  return (
    <div className="w-full space-y-6 py-4">
      <div className="text-center space-y-2">
        <h3 className="font-title_three text-primary">
          {isCompressingState ? 'Otimizando suas fotos...' : 'Enviando suas fotos...'}
        </h3>
        <p className="text-text/70">
          {isCompressingState
            ? 'Estamos preparando suas fotos para ficarem perfeitas! ✨'
            : `Já enviamos ${uploadFormState.progress}% das suas fotos! ��`}
        </p>
      </div>

      <div className="w-full h-[250px] lg:h-[320px] rounded-lg overflow-hidden">
        <LottieAnimation animationData={waitingAnimation} />
      </div>

      <div className="max-w-md mx-auto text-center space-y-4">
        <p className="text-sm text-text/70">
          {isCompressingState
            ? 'A otimização pode levar alguns minutos. Que tal uma pausa para um ☕️ ou um joguinho enquanto isso?'
            : 'O upload pode demorar um pouquinho. Aproveite para relaxar ou se divertir com nosso mini-game!'}
        </p>

        <a
          href="#waiting-game"
          className="inline-flex items-center gap-2 px-6 py-3 bg-secondary/10 hover:bg-secondary/20 rounded-lg transition-colors"
        >
          <span className="text-sm font-medium">Jogar Word Scramble</span>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 3v3m0 12v3M3 12h3m12 0h3M5.6 5.6l2.1 2.1m8.6 8.6l2.1 2.1M5.6 18.4l2.1-2.1m8.6-8.6l2.1-2.1" />
          </svg>
        </a>
      </div>

      {uploadFormState?.progress > 0 && (
        <div className="max-w-md mx-auto">
          <div className="h-2 w-full bg-secondary/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300 ease-out rounded-full"
              style={{ width: `${uploadFormState.progress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export { UploadFormProcessWaiting };
