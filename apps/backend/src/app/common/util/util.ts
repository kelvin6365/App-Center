export const maskingString = (str: string, start: number, end: number) => {
  if (
    !str ||
    start < 0 ||
    start >= str.length ||
    end < 0 ||
    end > str.length ||
    start >= end
  ) {
    return str;
  }
  const maskLength = end - start;
  const maskedStr =
    str.substring(0, start) + '*'.repeat(maskLength) + str.substring(end);
  return maskedStr;
};
