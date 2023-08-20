import axios from 'axios';
import React from 'react';
import { Children } from 'react';
import { useLocation } from 'react-router-dom';
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
    if (
      !suppressedWarnings.some((entry) => {
        return !axios.isAxiosError(msg) ? msg.includes(entry) : false;
      })
    ) {
      backup2.apply(console, []);
    }
  };
};

export function useQuery() {
  const { search } = useLocation();

  return React.useMemo(() => new URLSearchParams(search), [search]);
}

export default function isUuid(uuid: string, isNullable = false): boolean {
  return isNullable
    ? /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
        uuid
      )
    : /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
        uuid
      );
}
