// Импортируем хук useLocation из react-router-dom
import { useLocation } from 'react-router-dom';

// Определяем пользовательский хук useQuery
export const useQuery = () => {
  // Используем хук useLocation для получения текущего URL и его параметров
  return new URLSearchParams(useLocation().search);
};

// Экспортируем хук useQuery по умолчанию
export default useQuery;
