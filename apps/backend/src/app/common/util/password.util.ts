import * as bcrypt from 'bcrypt';

const hashPassword = async (password: string) => {
  const saltOrRounds = 10;
  return await bcrypt.hash(password, saltOrRounds);
};
const isMatchPassword = async (password: string, hash: string) =>
  await bcrypt.compare(password, hash);
export { hashPassword, isMatchPassword };
