import { Children } from 'react';
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

export const isChildNull = (children: React.ReactNode) => {
  return Children.count(children) < 1;
};

export const ignoreWarning = () => {
  const suppressedWarnings = [
    'Received `false` for a non-boolean attribute `copied`',
    'React does not recognize the `codeBlock` prop on a DOM element.',
  ];
  const backup = console.warn;
  console.warn = function filterWarnings(msg) {
    if (!suppressedWarnings.some((entry) => msg.includes(entry))) {
      backup.apply(console, []);
    }
  };
  const backup2 = console.error;
  console.error = function filterWarnings(msg) {
    if (!suppressedWarnings.some((entry) => msg.includes(entry))) {
      backup2.apply(console, []);
    }
  };
};
