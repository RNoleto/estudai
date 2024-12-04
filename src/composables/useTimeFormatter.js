export function useTimeFormatter() {
    /**
     * Converte minutos inteiros para o formato de "Xh Ymin"
     * @param {number} minutes - Valor inteiro representando minutos
     * @returns {string} - Tempo formatado em "Xh Ymin"
     */
    const formatStudyTime = (minutes) => {
      if (isNaN(minutes) || minutes < 0) return '0h 0min';
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return `${hours}h ${remainingMinutes}min`;
    };
  
    return { formatStudyTime };
  }
  