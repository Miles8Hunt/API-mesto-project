import { model, Schema } from 'mongoose';
import validator from 'validator';
import { IUser } from '../types/types';

const avatarRegExp : RegExp = /^(https?:\/\/)?(www\.)?[a-zA-Z0-9._~:/?#[\]@!$&'()*+,;=-]+(#)?$/;

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 200,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    validate: {
      validator: (v: any) => avatarRegExp.test(v),
      message: 'Некорректный формат ссылки',
    },
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate(value: string) {
      if (!validator.isEmail(value)) {
        throw new Error('Некорректный email');
      }
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

export default model<IUser>('user', userSchema);
