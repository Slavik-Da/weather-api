import { hash } from "argon2";

export const hashData = (data: string): Promise<string> => {
  return hash(data);
};
