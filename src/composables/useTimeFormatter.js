export function useTimeFormatter() {
  /**
   * Converte segundos inteiros para o formato de "Xh Ymin Zs", ignorando campos com valor 0
   * @param {number} seconds - Valor inteiro representando segundos
   * @returns {string} - Tempo formatado, omitindo campos zerados
   */
  const formatStudyTime = (seconds) => {
    if (isNaN(seconds) || seconds < 0) return '0s';

    // Calcula as horas, minutos e segundos corretamente
    const hours = Math.floor(seconds / 3600); // Cada hora tem 3600 segundos
    const minutes = Math.floor((seconds % 3600) / 60); // Cada minuto tem 60 segundos
    const remainingSeconds = seconds % 60; // Segundos restantes após horas e minutos

    // Constrói o tempo formatado apenas com os valores maiores que 0
    const timeParts = [];
    if (hours > 0) timeParts.push(`${hours}h`);
    if (minutes > 0) timeParts.push(`${minutes}min`);
    if (remainingSeconds > 0 || timeParts.length === 0) timeParts.push(`${remainingSeconds}s`);

    return timeParts.join(' ');
  };

  return { formatStudyTime };
}
