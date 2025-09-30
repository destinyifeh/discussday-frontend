import {APP_NAME} from '@/constants/settings';
import {ContactSupportPage} from '@/modules/dashboard/contact-support';
import {Metadata} from 'next';

export const metadata: Metadata = {
  title: `${APP_NAME} | Contact Support`,
  description: `Get in touch with ${APP_NAME} support for any questions, issues, or feedback regarding your account or experience.`,
};

export default ContactSupportPage;
