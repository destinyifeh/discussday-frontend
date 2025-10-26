import {DashboardLayout} from '@/components/layouts/dashboard';
import {HomePage} from '@/modules/dashboard/home';

export default function Page() {
  return (
    <DashboardLayout>
      <HomePage />
    </DashboardLayout>
  );
}
