// Импортируем библиотеку Google libphonenumber для работы с телефонными номерами
import { PhoneNumberUtil } from 'google-libphonenumber';
import { useRef } from 'preact/hooks';

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
  if (size?.width < 992 && size?.landscape) return 5;
  if (size?.width >= 1920) return 9;
  if (size?.width >= 1440) return 8;
  if (size?.width >= 1390) return 7;
  if (size?.width >= 1210) return 6;
  if (size?.width >= 1032) return 5;
  if (size?.width >= 992) return 4;
  if (size?.width >= 768) return 5;
  if (size?.width >= 425) return 3;
  if (size?.width <= 424 && bonus) return 2;
  if (size?.width <= 375) return 2;
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
export function translateField(name, fieldPath, words, rename = true) {
  name = name?.toLowerCase();
  const keys = fieldPath.split('.');

  // Проверяем сначала серверный локал для 'name'
  if (words.server && words.server[name]) {
    return rename ? `${words?.server[name]}` : words?.server[name];
  }

  // Итерируем по локали 'local', если не найдено на сервере
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

    // Если поле 'name' найдено, возвращаем его значение
    if (currentObj && currentObj[name]) {
      if (rename) {
        return `${currentObj[name]}`;
      } else {
        return currentObj[name];
      }
    }
  }

  // В случае отсутствия поля 'name' возвращаем указанное значение или значение по умолчанию
  const result = rename ? `lang->${name}` : name?.replace(/_/g, ' ');
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
  const executeScroll = () => window.scrollTo({ behavior: 'smooth', top: elRef.current?.offsetTop });

  return [executeScroll, elRef];
};

// setTimeout(() => {
//   if (settings.theOldTheme) scrollToSection('.providers-with-slider__title', !size.mobile ? header.height + 20 : header.height + 25);
//   else scrollToSection('.providers-with-slider__title', !size.mobile ? header.height * 2 + 30 : header.height * 2 + 5);
// }, 100);
