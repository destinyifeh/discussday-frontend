'use client';

import {Button} from '@/components/ui/button';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Tooltip} from '@/components/ui/tooltip';
import {BellRing} from 'lucide-react';
import {FC, Fragment, useState} from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {getTimeAgo} from '@/lib/formatter';
import {useQuery} from '@tanstack/react-query';

import {adminService} from '@/services/admin-service';
import {COLORS} from '../../data';

type OverviewProps = {
  searchTerm: string;
  filterSection: string;
  filterStatus: string;
  setCurrentTab: (current: string) => void;
};

export const OverViewTab: FC<OverviewProps> = ({
  searchTerm,
  setCurrentTab,
  filterSection,
  filterStatus,
}) => {
  const [searchTerms, setSearchTerms] = useState('');
  const [viewContentDialog, setViewContentDialog] = useState(false);

  const [selectedReportContent, setSelectedReportContent] =
    useState<string>('');
  const [selectedReportType, setSelectedReportType] = useState<string>('');

  const {
    isLoading: loadingUserStats,
    error,
    data: usersData,
  } = useQuery({
    queryKey: ['user-distribution-and-stats'],
    queryFn: () => adminService.getUserDistributionAndStats(),
    retry: true,
  });
  console.log('should query', error);

  console.log(usersData, 'should query dataa');

  const {
    isLoading: loadingSectionStats,
    error: sectionErr,
    data: sectionData,
  } = useQuery({
    queryKey: ['section-post-comment-stats'],
    queryFn: () => adminService.getSectionPostCommentStats(),
    retry: true,
  });
  console.log('section data', sectionErr);

  console.log(sectionData, 'section dataa');

  const {
    isLoading: loadingPostStats,
    error: postStatsErr,
    data: postStatsData,
  } = useQuery({
    queryKey: ['post-stats'],
    queryFn: () => adminService.getPostStats(),
    retry: true,
  });

  const {
    isLoading: loadingAd,
    error: adStatsErr,
    data: pendingAdData,
  } = useQuery({
    queryKey: ['pending-ads'],
    queryFn: () => adminService.getCountAdByStatus('pending'),
    retry: true,
  });
  console.log('ad err', adStatsErr);

  console.log(pendingAdData, 'pending ad dataa');

  const {
    isLoading: loadingSystemNotifications,
    error: systemErr,
    data: systemNotificationsData,
  } = useQuery({
    queryKey: ['system-notifications'],
    queryFn: () => adminService.getSystemNotifications(),
    retry: true,
  });

  console.log(systemNotificationsData, 'systemNotificationsData');
  const userActivityData = [
    {name: 'New Users', value: 45},
    {name: 'Active Users', value: 125},
    {name: 'Inactive', value: 30},
  ];

  const {distribution, growth, totalUsers} = usersData ?? {};

  const userActivityDatas = distribution
    ? [
        {name: 'New Users', value: distribution.newUsers},
        {name: 'Active Users', value: distribution.activeUsers},
        {name: 'Inactive', value: distribution.inactiveUsers},
      ]
    : [];

  const userActivityDatass =
    distribution && totalUsers
      ? [
          {
            name: 'New Users',
            value: Math.round((distribution.newUsers / 100) * totalUsers),
          },
          {
            name: 'Active Users',
            value: Math.round((distribution.activeUsers / 100) * totalUsers),
          },
          {
            name: 'Inactive Users',
            value: Math.round((distribution.inactiveUsers / 100) * totalUsers),
          },
        ]
      : [];

  return (
    <Fragment>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalUsers}</div>
              <p className="text-xs text-muted-foreground">
                {growth}% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Active Posts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {postStatsData?.totalPosts}
              </div>
              <p className="text-xs text-muted-foreground">
                {postStatsData?.growth}% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Pending Ads</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingAdData?.ad}</div>
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => setCurrentTab('ads')}>
                Review
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Section Activity</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={sectionData?.data}
                margin={{top: 20, right: 30, left: 20, bottom: 5}}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="posts" name="Posts" fill="#8884d8" />
                <Bar dataKey="comments" name="Comments" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={userActivityDatas}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({name, percent}) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value">
                  {userActivityDatas?.map((entry: any, index: number) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {systemNotificationsData?.systemNotifications.map((item: any) => {
                console.log(item, 'itemmNote');
                return (
                  <div
                    className="flex items-center gap-4 border-b pb-4"
                    key={item._id}>
                    {[
                      'Content reported',
                      'User reported',
                      'Ad reported',
                      'Abuse reported',
                      'Comment reported',
                    ].includes(item.message) ? (
                      <BellRing className="text-red-500" />
                    ) : (
                      <BellRing className="text-app" />
                    )}
                    <div>
                      <p className="text-sm font-medium">{item.message}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.content}
                      </p>
                    </div>
                    <div className="ml-auto text-xs text-muted-foreground">
                      {/* {moment(item.createdAt).fromNow()} */}
                      {getTimeAgo(item.createdAt)}
                    </div>
                  </div>
                );
              })}
              {!systemNotificationsData?.systemNotifications?.length && (
                <p className="text-xs text-muted-foreground">
                  No recent activity yet
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* View Reported Content Dialog */}
      <Dialog open={viewContentDialog} onOpenChange={setViewContentDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {selectedReportType === 'post'
                ? 'Reported Post'
                : 'Reported Comment'}
            </DialogTitle>
            <DialogDescription>
              Review the reported content below.
            </DialogDescription>
          </DialogHeader>
          <div className="p-4 border rounded-md max-h-96 overflow-y-auto">
            {selectedReportContent}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setViewContentDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Fragment>
  );
};
