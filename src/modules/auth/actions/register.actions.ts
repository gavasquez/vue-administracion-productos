import { tesloApi } from '@/api/tesloApi';
import type { User } from '../interfaces';
import { isAxiosError } from 'axios';

interface RegisterError {
  ok: false;
  message: string;
}

interface RegisterSuccess {
  ok: true;
  user: User;
  token: string;
}

export const registerAction = async (
  fullName: string,
  email: string,
  password: string,
): Promise<RegisterError | RegisterSuccess> => {
  try {
    const { data } = await tesloApi.post('/auth/register', { fullName, email, password });
    return {
      ok: true,
      user: data.user,
      token: data.token,
    };
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 400) {
      return {
        ok: false,
        message: error.response.data.message[0],
      };
    }

    return {
      ok: false,
      message: 'No se pudo crear el usuario',
    };
  }
};
