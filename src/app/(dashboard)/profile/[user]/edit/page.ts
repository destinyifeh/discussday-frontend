import {APP_NAME} from '@/constants/settings';
import {EditProfilePage} from '@/modules/dashboard/profile/edit';
import {Metadata} from 'next';

export const metadata: Metadata = {
  title: `Edit Profile | ${APP_NAME}`,
  description: `Update your personal information, profile picture, and account details on ${APP_NAME}.`,
};

export default EditProfilePage;
