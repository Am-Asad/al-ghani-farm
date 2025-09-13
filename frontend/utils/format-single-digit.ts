export const formatSingleDigit = (digit: number | string) => {
  return digit?.toString().length === 1 ? `0${digit}` : digit;
};
