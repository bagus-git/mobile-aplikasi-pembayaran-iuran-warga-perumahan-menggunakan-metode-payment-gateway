import { PixelRatio } from 'react-native';
import { BankMap } from '../models/Model';

export const Theme = {
  FONT_SIZE_XXX_SMALL: PixelRatio.getPixelSizeForLayoutSize(6),
  FONT_SIZE_XX_SMALL: PixelRatio.getPixelSizeForLayoutSize(8),
  FONT_SIZE_X_SMALL: PixelRatio.getPixelSizeForLayoutSize(10),
  FONT_SIZE_SMALL: PixelRatio.getPixelSizeForLayoutSize(12),
  FONT_SIZE_MEDIUM: PixelRatio.getPixelSizeForLayoutSize(14),
  FONT_SIZE_LARGE: PixelRatio.getPixelSizeForLayoutSize(16),
  PRIMARY_COLOR: '#107C10',
  SECONDARY_COLOR: '#37474fd9',
  WHITE_COLOR: '#fff',
  GRAY: '#e5e5e5',
  BLACK_COLOR: '#00000',
  FONT_WEIGHT_LIGHT: 200,
  FONT_WEIGHT_MEDIUM: 600,
  FONT_WEIGHT_HEAVY: 800,
};

export type Nav = {
  navigate: (value: string) => void;
};

export const BANK_LIST_MAP: BankMap[] = [
  {
    key: 'bri',
    value: 'BANK BRI',
  },
  {
    key: 'bni',
    value: 'BANK BNI',
  },
  {
    key: 'bca',
    value: 'BANK BCA',
  },
  {
    key: 'mandiri',
    value: 'BANK MANDIRI',
  },
];
