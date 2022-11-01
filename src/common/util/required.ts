export const required = (key: string): never => {
  throw new Error(`${key} is required`);
};
