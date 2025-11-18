import ky from "ky";

const baseUrl = process.env.NEXT_PUBLIC_HOST_URL;

const config = {
  timeout: 15000,
};

export const auth = {
  validateLogin: async (
    email: string,
  ): Promise<{
    message: string;
    error?: string;
  }> => {
    return await ky.post(`${baseUrl}/api/auth/validate-login`, { json: { email }, ...config }).json();
  },
};
