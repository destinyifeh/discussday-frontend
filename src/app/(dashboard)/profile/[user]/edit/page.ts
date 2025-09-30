import {APP_NAME} from '@/constants/settings';
import {EditProfilePage} from '@/modules/dashboard/profile/edit';
import {Metadata} from 'next';

export const metadata: Metadata = {
  title: `${APP_NAME} | Edit Profile`,
  description: `Update your personal information, profile picture, and account details on ${APP_NAME}.`,
};

export default EditProfilePage;
