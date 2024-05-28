// // Импортируем хуки и функцию для HTTP-запросов из Preact
// import React, { useEffect, useState } from 'react';
// import { baseApiGet } from '../api/baseApi';

// // Определяем пользовательский хук useIpUser
// export const useIpUser = () => {
//   // Инициализируем состояние для хранения информации об IP-адресе
//   const [ipInfo, setIpInfo] = useState(null);

//   // Используем эффект для выполнения HTTP-запроса при монтировании компонента
//   useEffect(() => {
//     // Выполняем GET-запрос к внешнему API, получая информацию об IP-адресе
//     baseApiGet({ api: 'https://ipapi.co/json/' })
//       .then((response) => {
//         // Обновляем состояние с полученной информацией
//         setIpInfo(response);

//         // Если информация не получена, устанавливаем значение по умолчанию
//         if (!response) setIpInfo({ country: 'US' });
//       })
//       .catch((data, status) => {
//         // В случае ошибки обработки запроса также обновляем состояние
//         setIpInfo(data);
//       });
//   }, []); // Пустой массив зависимостей гарантирует выполнение эффекта только при монтировании компонента

//   // Возвращаем объект с информацией об IP-адресе
//   return { ipInfo };
// };

import { useSelector } from 'react-redux';

export const useIpUser = () => {
  const ipInfo = useSelector((state) => state.api.visitor);
  return { ipInfo };
};
