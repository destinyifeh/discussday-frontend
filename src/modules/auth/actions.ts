import {toast} from '@/components/ui/toast';
import api from '@/lib/auth/api';
import {
  removeCookieAccessToken,
  removeCookieRefreshToken,
} from '@/lib/server/cookies';
import {AxiosResponse} from 'axios';
import {redirect} from 'next/navigation';
import {
  LoginRequestProps,
  RegisterRequestProps,
  ResetRequestProps,
  UserUpdateRequestProps,
} from './types';

export async function registerRequestAction(
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

export async function emailVerificationRequestAction(
  token: string | null,
): Promise<AxiosResponse> {
  return await api.post(`/auth/verify-email?token=${token}`);
}

export async function resendEmailVerificationLinkRequestAction(data: object) {
  return await api.post('/auth/resend-verification', data);
}

export async function loginRequestAction(data: LoginRequestProps) {
  return await api.post('/auth/login', data);
}

export async function logoutRequest() {
  const res = await logoutRequestAction();
  if (res?.data?.code === '200') {
    removeCookieAccessToken();
    removeCookieRefreshToken();
    toast.success('Successfully logged out.');
    redirect('/login');
  } else {
    toast.error(
      'Something went wrong while logging you out. Please try again.',
    );
  }
}

export async function forgotPasswordRequestAction(
  data: object,
): Promise<AxiosResponse> {
  return await api.post('/auth/forgot-password', data);
}

export async function logoutRequestAction(): Promise<AxiosResponse> {
  return await api.post('/auth/logout');
}

export async function googleSignInRequestAction(): Promise<AxiosResponse> {
  return await api.get('/auth/google/login');
}

export async function resetPasswordRequestAction(
  data: ResetRequestProps,
): Promise<AxiosResponse> {
  return await api.post('/auth/reset-password', data);
}

export async function updateUserRequest(
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

export async function deleteUserRequest(
  userId: string,
): Promise<AxiosResponse> {
  return await api.delete(`/user/${userId}`);
}

export async function changePasswordRequestAction(
  data: object,
): Promise<AxiosResponse> {
  return await api.patch('/auth/change-password', data);
}

export async function getGoogleUser() {
  const response = await api.get(`/auth/google-user`);
  return response.data;
}
export async function setGoogleUserUsername(data: object) {
  const response = await api.patch(`/auth/set-google-username`, data);
  return response.data;
}
