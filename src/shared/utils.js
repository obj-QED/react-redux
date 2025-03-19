// Импортируем библиотеку Google libphonenumber для работы с телефонными номерами
import { PhoneNumberUtil } from 'google-libphonenumber';
import React, { useRef } from 'react';

// Создаем экземпляр PhoneNumberUtil
const phoneUtil = PhoneNumberUtil.getInstance();
// Функция isPhoneValid проверяет, является ли переданный телефонный номер допустимым
export const isPhoneValid = (phone) => {
  try {
    // Пытаемся распарсить и проверить валидность телефонного номера
    return phoneUtil.isValidNumber(phoneUtil.parseAndKeepRawInput(phone));
  } catch (error) {
    // В случае ошибки возвращаем false
    return false;
  }
};

// Функция camelToFlat преобразует строку из camelCase в flat case
export const camelToFlat = (camel) => {
  // Разбиваем camelCase на отдельные слова
  const camelCase = camel
    ?.replace(/([a-z])([A-Z])/g, '$1 $2')
    ?.replace(/(_|\s)+/g, ' ')
    .split(' ');

  let flat = '';

  // Преобразуем каждое слово, делая первую букву заглавной
  camelCase?.forEach((word) => {
    flat = flat + word.charAt(0).toUpperCase() + word.slice(1) + ' ';
  });
  return flat;
};

// Функция inViewGames определяет количество видимых игр на странице в зависимости от размера экрана
export const inViewGames = (size, bonus) => {
  if (size?.width <= 993 && size?.landscape) return 5;
  if (size?.width <= 1024 && size?.landscape) return 5;
  if (size?.width >= 1920) return 9;
  // if (size?.width >= 1440) return 8;
  if (size?.width >= 1390) return 7;
  if (size?.width >= 1210) return 6;
  if (size?.width >= 1032) return 5;
  if (size?.width >= 993) return 5;
  if (size?.width >= 768) return 5;
  if (size?.width >= 575) return 5;
  if (size?.width >= 475) return 4;
  if (size?.width >= 320) return 3;
  if (size?.width >= 0) return 2;

  return 3;
};

// export function translateField(name, fieldPath, words, rename = true) {
//   name = name?.toLowerCase();
//   const keys = fieldPath.split('.');

//   for (const locale of ['server', 'local']) {
//     let currentObj = words[locale];

//     for (const key of keys) {
//       if (currentObj && currentObj[key]) {
//         currentObj = currentObj[key];
//       } else {
//         currentObj = null;
//         break;
//       }
//     }

//     if (currentObj && currentObj[name]) {
//       if (rename) {
//         return `${currentObj[name]}`;
//       } else {
//         return currentObj[name];
//       }
//     }
//   }

//   const result = rename ? `lang->${name}` : name?.replace(/_/g, ' ');
//   return result;
// }

// Функция translateField переводит поле 'name' по указанному пути 'fieldPath' в объекте 'words'
export function translateField(name, fieldPath, words, rename = true, lower = true) {
  const nameToString = (() => {
    if (name === null || name === undefined) {
      return 'alert_null_or_undefined';
    }
    if (typeof name === 'object' && Object.keys(name).length === 0 && name.constructor === Object) {
      return 'alert_empty_object';
    }
    return name.toString();
  })();

  const formattedName = lower ? nameToString.toLowerCase() : nameToString;
  const keys = fieldPath.split('.');

  // Проверяем сначала серверный локал для 'name'
  if (words.server && words.server[formattedName]) {
    return rename ? `${words?.server[formattedName]}` : words?.server[formattedName];
  }

  // Итерируем по локалке 'local', если не найдено на сервере
  for (const locale of ['local']) {
    let currentObj = words[locale];

    // Проходим по ключам в объекте
    for (const key of keys) {
      if (currentObj && currentObj[key]) {
        currentObj = currentObj[key];
      } else {
        currentObj = null;
        break;
      }
    }

    // Если поле 'formattedName' найдено, возвращаем его значение
    if (currentObj && currentObj[formattedName]) {
      if (rename) {
        return `${currentObj[formattedName]}`;
      } else {
        return currentObj[formattedName];
      }
    }
  }

  // В случае отсутствия поля 'formattedName' возвращаем указанное значение или значение по умолчанию
  const result = rename ? `lang->${formattedName}` : formattedName?.replace(/_/g, ' ');
  return result;
}

// Функция getUniqArr возвращает уникальные элементы массива по указанному полю 'idName'
export function getUniqArr(arr, idName) {
  // Преобразуем массив в Set для удаления дубликатов
  let arrFromSet = Array.from(new Set(arr));

  // Преобразуем объекты в строки для корректной работы с Set
  arrFromSet = arrFromSet.map((el) => {
    return typeof el === 'object' ? JSON.stringify(el) : el;
  });

  // Возвращаем массив снова, преобразуя строки обратно в объекты
  const result = Array.from(new Set(arrFromSet));

  return result.map((el) => JSON.parse(el));
}

// Функция scrollToSectionUtils прокручивает страницу к указанному разделу
export const scrollToSectionUtils = (section, setHeight, func) => {
  func(section, setHeight);
};

export const ScrollToRefElement = () => {
  const elRef = useRef(null);
  // const executeScroll = () => window.scrollTo({ behavior: 'smooth', top: elRef.current?.offsetTop });
  const executeScroll = () => {
    if (elRef.current) {
      elRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };
  return [executeScroll, elRef];
};

export const deepEqual = (obj1, obj2) => {
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  if (keys1.length !== keys2.length) {
    return false;
  }
  for (const key of keys1) {
    if (!obj2.hasOwnProperty(key)) {
      return false;
    }
    if (obj1[key] !== null && obj2[key] !== null && typeof obj1[key] === 'object' && typeof obj2[key] === 'object') {
      if (!deepEqual(obj1[key], obj2[key])) {
        return false;
      }
    } else {
      if (obj1[key] !== obj2[key]) {
        return false;
      }
    }
  }
  return true;
};

export const getParsedJsonFromLocalStorage = (key) => {
  try {
    return JSON.parse(localStorage.getItem(key));
  } catch (error) {
    return null;
  }
};

export const debounce = (func, delay) => {
  let timerId;

  return function (...args) {
    clearTimeout(timerId);

    timerId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
};

export const getCssVariableValue = (variable) => {
  return getComputedStyle(document.documentElement).getPropertyValue(variable);
};
