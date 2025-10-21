import {getDeviceId} from '@/lib/auth/device';
import api from '@/lib/client/api';
import {AxiosResponse} from 'axios';

export interface UserUpdateRequestProps {
  username?: string;
  avatar?: File | null;
  bio?: string;
  dob?: string;
  gender?: string;
  website?: string;
  location?: string;
  coverAvatar?: File | null;
}

export interface RegisterRequestProps {
  username: string;
  avatar?: File | null;
  password: string;
  email: string;
  confirmPassword?: string;
}

export interface LoginRequestProps {
  username: string;
  password: string;
  deviceId: string;
}

export interface ResetRequestProps {
  token: string;
  password: string;
}

class AuthService {
  async registerRequestAction(
    data: RegisterRequestProps,
  ): Promise<AxiosResponse> {
    const formData = new FormData();

    formData.append('username', data.username);
    formData.append('email', data.email);
    formData.append('password', data.password);

    if (data.avatar) {
      formData.append('avatar', data.avatar);
    }

    return await api.post('/auth/register', formData, {
      headers: {'Content-Type': 'multipart/form-data'},
    });
  }

  async emailVerificationRequestAction(token: string | null) {
    try {
      const response = await api.get(`/auth/verify-email?token=${token}`);
      return response.data;
    } catch (err: any) {
      throw err?.response?.data ?? err;
    }
  }

  async resendEmailVerificationLinkRequestAction(data: object) {
    return await api.post('/auth/resend-verification', data);
  }

  async loginRequestAction(data: LoginRequestProps) {
    return await api.post('/auth/login', data);
  }

  async forgotPasswordRequestAction(data: object): Promise<AxiosResponse> {
    return await api.post('/auth/forgot-password', data);
  }

  async logoutRequestAction(): Promise<AxiosResponse> {
    return await api.post('/auth/logout');
  }

  async googleSignInRequestAction(): Promise<AxiosResponse> {
    return await api.get('/auth/google/login');
  }

  async resetPasswordRequestAction(
    data: ResetRequestProps,
  ): Promise<AxiosResponse> {
    return await api.post('/auth/reset-password', data);
  }

  async updateUserRequest(
    data: UserUpdateRequestProps,
  ): Promise<AxiosResponse> {
    const form = new FormData();

    // ---- string fields -------------------------------------------------
    if (data.username) form.append('username', data.username);
    if (data.bio) form.append('bio', data.bio);
    if (data.dob) form.append('dob', data.dob);
    if (data.gender) form.append('gender', data.gender);
    if (data.website) form.append('website', data.website);
    if (data.location) form.append('location', data.location);

    // ---- file fields ---------------------------------------------------
    if (data.avatar) form.append('avatar', data.avatar); // File
    if (data.coverAvatar) form.append('coverAvatar', data.coverAvatar); // File

    return await api.patch('/users/update', form, {
      headers: {'Content-Type': 'multipart/form-data'},
    });
  }

  async deleteUserRequest(userId: string): Promise<AxiosResponse> {
    return await api.delete(`/user/${userId}`);
  }

  async changePasswordRequestAction(data: object): Promise<AxiosResponse> {
    return await api.patch('/auth/change-password', data);
  }

  async getGoogleUser() {
    const deviceId = getDeviceId();
    console.log(deviceId, 'deviceerr');
    const response = await api.get(`/auth/google-user`, {
      headers: {'x-device-id': deviceId},
    });
    return response.data;
  }
  async setGoogleUserUsername(data: object) {
    const deviceId = getDeviceId();
    const response = await api.patch(`/auth/set-google-username`, data, {
      headers: {'x-device-id': deviceId},
    });
    return response.data;
  }
}

export const authService = new AuthService();
