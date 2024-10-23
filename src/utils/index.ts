export interface Densities {
  [key: string]: number;
}

export const densities: Densities = {
  ldpi: 0.75,
  mdpi: 1,
  hdpi: 1.5,
  xhdpi: 2,
  xxhdpi: 3,
  xxxhdpi: 4
};

export interface Sizes {
  normal: number;
  small: number;
}