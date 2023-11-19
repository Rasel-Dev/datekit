import { MonthStyleType, WeekStyleType } from '@/types/util';
import Utils from './util';

export const month = (pos: number, style?: MonthStyleType) => {
  const m =
    'January_February_March_April_May_June_July_August_September_October_November_December'.split(
      '_'
    );

  switch (style) {
    case 'long':
      return m[pos];
    case 'short':
      return m[pos].slice(0, 3);
    case '2-digit':
      return Utils.pad(String(pos + 1));
    case 'numeric':
      return String(pos + 1);

    default:
      return null;
  }
};

export const weekend = (pos: number, style?: WeekStyleType) => {
  const w = 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split(
    '_'
  );

  switch (style) {
    case 'long':
      return w[pos];
    case 'short':
      return w[pos].slice(0, 3);

    default:
      return null;
  }
};
