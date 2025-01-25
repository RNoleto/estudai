export function useCurrentDate() {
  const daysOfWeek = [
    'Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'
  ];
  
  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];
  
  const currentDate = new Date();
  
  const dayOfWeek = daysOfWeek[currentDate.getDay()];
  const day = String(currentDate.getDate()).padStart(2, '0');
  const monthNumeric = String(currentDate.getMonth() + 1).padStart(2, '0'); // Meses começam em 0
  const monthFull = months[currentDate.getMonth()];
  const year = currentDate.getFullYear();
  
  const formatDate = (format = 'DD/MM/YYYY') => {
    const mapping = {
      DD: day,
      dddd: dayOfWeek,
      MM: monthNumeric,
      MO: monthFull,
      YYYY: year,
    };
    
    // Substitui os tokens no formato especificado
    return format.replace(/DD|dddd|MM|MO|YYYY/g, (match) => mapping[match]);
  };
  
  return { formatDate };
}
