'use client';

import {useEffect, useState} from 'react';

import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';

import {FileText, LayoutDashboard, Shield, Users} from 'lucide-react';

import {PageHeader} from '@/components/app-headers';
import AdminDashboardSkeleton from '@/components/skeleton/admin-dashboard-skeleton';
import {useAdminGuard} from '@/hooks/guards/useAdminGuard';
import {useAuthStore} from '@/hooks/stores/use-auth-store';
import {useRouter} from 'next/navigation';
import {AdminFilter} from './components/filter';
import {AdminSearch} from './components/searchbar';
import {AdTab} from './components/tabs/ads';
import {ContentTab} from './components/tabs/content';
import {OverViewTab} from './components/tabs/overview';
import {ReportsTab} from './components/tabs/reports';
import {UsersTab} from './components/tabs/users/users-tab';

// Suspension period options
const suspensionPeriods = [
  {value: '1', label: '1 day'},
  {value: '3', label: '3 days'},
  {value: '7', label: '7 days'},
  {value: '14', label: '14 days'},
  {value: '30', label: '30 days'},
  {value: 'permanent', label: 'Permanent'},
];

export const AdminDashboardPage = () => {
  const navigate = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentTab, setCurrentTab] = useState('overview');
  const [filterIsOpen, setFilterIsOpen] = useState(false);
  const [filterSection, setFilterSection] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDateRange, setFilterDateRange] = useState('all');
  const {currentUser} = useAuthStore(state => state);
  const [isLoading, setIsLoading] = useState(true);
  useAdminGuard(currentUser);
  useEffect(() => {
    // Simulate loading

    setTimeout(() => setIsLoading(false), 800);
  }, []);

  const COLORS = [
    '#0088FE',
    '#00C49F',
    '#FFBB28',
    '#FF8042',
    '#8884d8',
    '#82ca9d',
  ];

  if (isLoading) {
    return <AdminDashboardSkeleton />;
  }
  return (
    <div>
      <PageHeader
        title="Admin Dashboard"
        description="Manage content, users, and advertisements"
      />

      <div className="p-4">
        <Tabs
          value={currentTab}
          className="w-full"
          onValueChange={setCurrentTab}>
          <div className="border-b mb-4 border-app-border">
            <TabsList className="flex overflow-x-auto">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <LayoutDashboard size={16} /> Overview
              </TabsTrigger>
              <TabsTrigger value="ads" className="flex items-center gap-2">
                <FileText size={16} /> Advertisements
              </TabsTrigger>
              <TabsTrigger value="users" className="flex items-center gap-2">
                <Users size={16} /> Users
              </TabsTrigger>
              <TabsTrigger value="reports" className="flex items-center gap-2">
                <Shield size={16} /> Reports
              </TabsTrigger>
              <TabsTrigger value="content" className="flex items-center gap-2">
                <FileText size={16} /> Content
              </TabsTrigger>
            </TabsList>
          </div>

          <AdminSearch
            searchTerm={searchTerm}
            setFilterIsOpen={setFilterIsOpen}
            setSearchTerm={setSearchTerm}
            filterIsOpen={filterIsOpen}
          />

          {filterIsOpen && (
            <AdminFilter
              filterSection={filterSection}
              filterStatus={filterStatus}
              setFilterDateRange={setFilterDateRange}
              setFilterSection={setFilterSection}
              setFilterStatus={setFilterStatus}
              setFilterIsOpen={setFilterIsOpen}
              filterDateRange={filterDateRange}
            />
          )}
          <TabsContent value="overview">
            <OverViewTab
              filterSection={filterSection}
              filterStatus={filterStatus}
              setCurrentTab={setCurrentTab}
              searchTerm={searchTerm}
            />
          </TabsContent>
          <TabsContent value="ads">
            <AdTab
              filterSection={filterSection}
              filterStatus={filterStatus}
              searchTerm={searchTerm}
            />
          </TabsContent>
          <TabsContent value="users">
            <UsersTab
              filterSection={filterSection}
              filterStatus={filterStatus}
              searchTerm={searchTerm}
            />
          </TabsContent>
          <TabsContent value="reports">
            <ReportsTab
              filterSection={filterSection}
              filterStatus={filterStatus}
              searchTerm={searchTerm}
            />
          </TabsContent>
          <TabsContent value="content">
            <ContentTab
              filterSection={filterSection}
              filterStatus={filterStatus}
              searchTerm={searchTerm}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
