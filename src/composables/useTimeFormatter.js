export function useTimeFormatter() {
  /**
   * Converte segundos inteiros para o formato de "Xh Ymin Zs", ignorando campos com valor 0
   * @param {number} seconds - Valor inteiro representando segundos
   * @returns {string} - Tempo formatado, omitindo campos zerados
   */
  const formatStudyTime = (seconds) => {
    if (isNaN(seconds) || seconds < 0) return '0s';

    const hours = Math.floor(seconds / 3600); // 1 hora = 3600 segundos
    const remainingSecondsAfterHours = seconds % 3600;
    const minutes = Math.floor(remainingSecondsAfterHours / 60); // 1 minuto = 60 segundos
    const remainingSeconds = remainingSecondsAfterHours % 60;

    // Constrói o tempo formatado apenas com os valores maiores que 0
    const timeParts = [];
    if (hours > 0) timeParts.push(`${hours}h`);
    if (minutes > 0) timeParts.push(`${minutes}min`);
    if (remainingSeconds > 0 || timeParts.length === 0) timeParts.push(`${remainingSeconds}s`);

    return timeParts.join(' ');
  };

  return { formatStudyTime };
}
