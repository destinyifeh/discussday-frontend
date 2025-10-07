import {AdEditPage} from '@/modules/dashboard/advertise/edit';

type PageParams = {
  adId: string;
};

export default async function Page({params}: {params: Promise<PageParams>}) {
  const {adId} = await params;

  return <AdEditPage params={{adId}} />;
}
