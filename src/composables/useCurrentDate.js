export function useCurrentDate() {
    const daysOfWeek = [
      'Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'
    ];
  
    const currentDate = new Date();
    
    const dayOfWeek = daysOfWeek[currentDate.getDay()];
    const day = String(currentDate.getDate()).padStart(2, '0');
    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Os meses começam em 0
    const year = currentDate.getFullYear();
  
    const formattedDate = `${dayOfWeek} ${day}/${month}/${year}`;
  
    return { formattedDate };
  }