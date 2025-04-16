import { WEB_FONTS } from './strings';

export const getRotationDegrees = (prizeNumber, numberOfPrizes, randomDif = true) => {
  const degreesPerPrize = 360 / numberOfPrizes;

  const initialRotation = 43 + degreesPerPrize / 2;

  const randomDifference = (-1 + Math.random() * 2) * degreesPerPrize * 0.35;

  const perfectRotation = degreesPerPrize * (numberOfPrizes - prizeNumber) - initialRotation;

  const imperfectRotation = degreesPerPrize * (numberOfPrizes - prizeNumber) - initialRotation + randomDifference;

  const prizeRotation = randomDif ? imperfectRotation : perfectRotation;

  return numberOfPrizes - prizeNumber > numberOfPrizes / 2 ? -360 + prizeRotation : prizeRotation;
};

export const clamp = (min, max, val) => Math.min(Math.max(min, +val), max);

export const isCustomFont = (font) => !!font && !WEB_FONTS.includes(font.toLowerCase());

export const getQuantity = (prizeMap) => prizeMap.slice(-1)[0].slice(-1)[0] + 1;

const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

export const makeClassKey = (length) => {
  let result = '';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
};
