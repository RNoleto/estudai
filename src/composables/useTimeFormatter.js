export function useTimeFormatter() {
  /**
   * Converte segundos inteiros para o formato de "Xh Ymin Zs"
   * @param {number} seconds - Valor inteiro representando segundos
   * @returns {string} - Tempo formatado em "Xh Ymin Zs"
   */
  const formatStudyTime = (seconds) => {
    if (isNaN(seconds) || seconds < 0) return '0h 0min 0s';

    const hours = Math.floor(seconds / 3600); // 1 hora = 3600 segundos
    const remainingSecondsAfterHours = seconds % 3600;
    const minutes = Math.floor(remainingSecondsAfterHours / 60); // 1 minuto = 60 segundos
    const remainingSeconds = remainingSecondsAfterHours % 60;

    return `${hours}h ${minutes}min ${remainingSeconds}s`;
  };

  return { formatStudyTime };
}
