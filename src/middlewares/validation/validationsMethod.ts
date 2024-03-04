import validator from 'validator';

const isUrlMethod = (value: string) => {
  const result = validator.isURL(value);
  if (result) {
    return value;
  }
  throw new Error('некорретный формат URL');
};

const isEmailMethod = (value: string) => {
  const result = validator.isEmail(value);
  if (result) {
    return value;
  }
  throw new Error('некорретный email');
};

export default { isUrlMethod, isEmailMethod };
