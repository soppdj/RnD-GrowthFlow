import confetti from 'canvas-confetti';

export function useConfetti() {
  const triggerConfetti = (origin = { x: 0.5, y: 0.6 }) => {
    try {
      // Multiple bursts for high-satisfaction micro-interaction
      confetti({
        particleCount: 50,
        spread: 60,
        origin,
        colors: ['#0d9488', '#10b981', '#34d399', '#f59e0b', '#6366f1'],
        disableForReducedMotion: true
      });

      setTimeout(() => {
        confetti({
          particleCount: 30,
          angle: 60,
          spread: 45,
          origin: { x: 0.2, y: 0.7 },
          colors: ['#0f766e', '#14b8a6', '#fcd34d']
        });
      }, 100);

      setTimeout(() => {
        confetti({
          particleCount: 30,
          angle: 120,
          spread: 45,
          origin: { x: 0.8, y: 0.7 },
          colors: ['#059669', '#3b82f6', '#a855f7']
        });
      }, 200);
    } catch (e) {
      console.warn('Confetti trigger failed:', e);
    }
  };

  const triggerSmallSparkle = (clientX, clientY) => {
    try {
      const x = clientX ? clientX / window.innerWidth : 0.5;
      const y = clientY ? clientY / window.innerHeight : 0.5;
      confetti({
        particleCount: 25,
        spread: 40,
        startVelocity: 20,
        origin: { x, y },
        colors: ['#10b981', '#0d9488', '#fbbf24']
      });
    } catch (e) {
      console.warn('Sparkle failed:', e);
    }
  };

  return {
    triggerConfetti,
    triggerSmallSparkle
  };
}
