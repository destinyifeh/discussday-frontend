import {APP_NAME} from '@/constants/settings';
import {capitalize} from '@/lib/formatter';
import {SectionPage} from '@/modules/posts/section';

import {Metadata} from 'next';

export async function generateMetadata({params}: any): Promise<Metadata> {
  const {section} = await params;

  return {
    title: `${capitalize(section)} | ${APP_NAME}`,
    description: `${capitalize(section)} section`,
  };
}

export default SectionPage;
