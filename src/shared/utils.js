import { PhoneNumberUtil } from 'google-libphonenumber';

const phoneUtil = PhoneNumberUtil.getInstance();
export const isPhoneValid = (phone) => {
  try {
    return phoneUtil.isValidNumber(phoneUtil.parseAndKeepRawInput(phone));
  } catch (error) {
    return false;
  }
};

export const camelToFlat = (camel) => {
  const camelCase = camel
    ?.replace(/([a-z])([A-Z])/g, '$1 $2')
    ?.replace(/(_|\s)+/g, ' ')
    .split(' ');

  let flat = '';

  camelCase?.forEach((word) => {
    flat = flat + word.charAt(0).toUpperCase() + word.slice(1) + ' ';
  });
  return flat;
};
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

export function translateField(name, fieldPath, words, rename = true) {
  name = name?.toLowerCase();
  const keys = fieldPath.split('.');

  // Check server locale for 'name' first
  if (words.server && words.server[name]) {
    return rename ? `${words?.server[name]}` : words?.server[name];
  }

  // Iterate over only the local locale if not found on server
  for (const locale of ['local']) {
    let currentObj = words[locale];

    for (const key of keys) {
      if (currentObj && currentObj[key]) {
        currentObj = currentObj[key];
      } else {
        currentObj = null;
        break;
      }
    }

    if (currentObj && currentObj[name]) {
      if (rename) {
        return `${currentObj[name]}`;
      } else {
        return currentObj[name];
      }
    }
  }

  // Fallback: if not found anywhere, use specified rename or default behavior
  const result = rename ? `lang->${name}` : name?.replace(/_/g, ' ');
  return result;
}

export function getUniqArr(arr, idName) {
  let arrFromSet = Array.from(new Set(arr));

  arrFromSet = arrFromSet.map((el) => {
    return typeof el === 'object' ? JSON.stringify(el) : el;
  });

  const result = Array.from(new Set(arrFromSet));

  return result.map((el) => JSON.parse(el));
}

export const scrollToSectionUtils = (section, setHeight, func) => {
  func(section, setHeight);
};

// setTimeout(() => {
//   if (settings.theOldTheme) scrollToSection('.providers-with-slider__title', !size.mobile ? header.height + 20 : header.height + 25);
//   else scrollToSection('.providers-with-slider__title', !size.mobile ? header.height * 2 + 30 : header.height * 2 + 5);
// }, 100);
