export const isProduction = (): boolean => {
  return import.meta.env.PROD;
};