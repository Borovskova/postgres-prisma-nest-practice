import * as bcrypt from 'bcrypt';

export const getHash = async (
  password: string | undefined,
  salt: number,
): Promise<string> => {
  return bcrypt.hash(password, salt);
};

export const compareHash = async (
  password: string | undefined,
  hash: string | undefined,
): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};