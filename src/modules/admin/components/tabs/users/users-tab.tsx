'use client';

import {Card, CardContent} from '@/components/ui/card';
import {ArrowUp} from 'lucide-react';
import {useDebounce} from 'use-debounce';

import {toast} from '@/components/ui/toast';
import {FC, Fragment, useMemo, useRef, useState} from 'react';

import {LoadingMore, LoadMoreError} from '@/components/feedbacks';
import ErrorFeedback from '@/components/feedbacks/error-feedback';
import {UsersSkeleton} from '@/components/skeleton/users.skeleton';
import {useAuthStore} from '@/hooks/stores/use-auth-store';
import {queryClient} from '@/lib/client/query-client';
import {UserActionType} from '@/modules/admin/admin-types';
import {Role} from '@/types/user.types';
import {useInfiniteQuery, useMutation} from '@tanstack/react-query';
import {useRouter} from 'next/navigation';
import {Virtuoso, VirtuosoHandle} from 'react-virtuoso';

import {adminService} from '@/services/admin-service';
import {AdminUserActionDialog} from './user-action-dialog';
import {AdminUserCard} from './user-card';
import {AdminRoleManagementDialog} from './user-role-dialog';

type UsersProps = {
  searchTerm: string;
  filterSection: string;
  filterStatus: string;
};

export const UsersTab: FC<UsersProps> = ({
  searchTerm,
  filterSection,
  filterStatus,
}) => {
  const navigate = useRouter();
  const [showGoUp, setShowGoUp] = useState(false);
  const {currentUser} = useAuthStore(state => state);
  const virtuosoRef = useRef<VirtuosoHandle>(null);

  // Role management dialog states
  const [roleManagementDialog, setRoleManagementDialog] = useState(false);
  const [selectedUserForRole, setSelectedUserForRole] = useState<any>('');
  const [newRole, setNewRole] = useState<Role>(Role.USER);
  const [currentRole, setCurrentRole] = useState<string>('');

  const [userActionReason, setUserActionReason] = useState('');
  const [actionLoader, setActionLoader] = useState(false);
  const [userActionDialog, setUserActionDialog] = useState(false);
  const [suspensionPeriod, setSuspensionPeriod] = useState('7');
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [fetchNextError, setFetchNextError] = useState<string | null>(null);
  const [userActionType, setUserActionType] = useState<UserActionType>(
    UserActionType.VIEW,
  );
  const [debouncedSearch] = useDebounce(searchTerm, 500);

  const {mutate: fireRestrictionAction} = useMutation({
    mutationFn: adminService.accountRestrictionAction,
  });
  const {mutate: fireRoleChange} = useMutation({
    mutationFn: adminService.updateUserRole,
  });

  const {
    data, // This 'data' contains { pages: [], pageParams: [] }
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetching, // Combines isFetching and isFetchingNextPage
    status,
    error,
    refetch,
  } = useInfiniteQuery({
    queryKey: ['admin-users-with-post-count', debouncedSearch], // Query key includes debouncedSearch
    queryFn: ({pageParam = 1}) =>
      adminService.getAllUsersWithPostCount(pageParam, 10, debouncedSearch),
    initialPageParam: 1,
    getNextPageParam: lastPage => {
      const {page, pages} = lastPage.pagination;
      return page < pages ? page + 1 : undefined;
    },
    placeholderData: previousData => previousData,
    // When the query key changes (i.e., debouncedSearch changes),
    // React Query automatically resets to initialPageParam and refetches.
    // This is perfect for search!
  });

  const users = useMemo(() => {
    return data?.pages?.flatMap(page => page.users) || [];
  }, [data]);

  const totalCount = data?.pages?.[0]?.pagination.total ?? 0;

  console.log(totalCount, 'totalccc');

  if (status === 'pending') {
    return <UsersSkeleton />;
  }

  const handleUserAction = () => {
    if (
      (userActionType === UserActionType.SUSPEND ||
        userActionType === UserActionType.BAN) &&
      !userActionReason
    ) {
      toast.error('Please provide a reason');
      setActionLoader(false);
      return;
    }

    if (userActionType === 'view') {
      setUserActionDialog(false);
      navigate.push(`/user/${selectedUser}`);
    } else {
      setActionLoader(true);
      const payload = {
        action: userActionType,
        period: suspensionPeriod,
        reason: userActionReason,
        userId: selectedUser,
      };

      console.log(payload, 'payloadwe');
      fireRestrictionAction(payload, {
        onSuccess(data, variables, context) {
          console.log(data, 'successdata');
          setActionLoader(false);
          queryClient.invalidateQueries({
            queryKey: ['admin-users-with-post-count', debouncedSearch],
          });

          toast.success(data.message);
        },
        onError(error, variables, context) {
          console.log(error, 'errorsdata');
          setActionLoader(false);
          toast.error(error.message);
        },
        onSettled(data, error, variables, context) {
          setActionLoader(false);
          setUserActionDialog(false);
        },
      });
    }
  };

  const handleOpenUserActionDialog = (
    userId: string,
    action: UserActionType,
  ) => {
    setSelectedUser(userId);
    setUserActionType(action);
    setUserActionReason('');
    setSuspensionPeriod('7');
    setUserActionDialog(true);
  };

  const handleScroll: React.UIEventHandler<HTMLDivElement> = event => {
    const scrollTop = event.currentTarget.scrollTop;

    // Show "go up" button if scrolled more than 300px
    setShowGoUp(scrollTop > 300);
  };

  const handleRoleChange = () => {
    if (!selectedUserForRole) return;

    // Only super admins can change roles
    if (currentUser?.role !== Role.SUPER_ADMIN) {
      toast.error('Only super admins can manage user roles');
      return;
    }

    if (currentRole === newRole) {
      toast.error('The selected role is already assigned to the user.');
      return;
    }

    setActionLoader(true);

    const payload = {
      userId: selectedUserForRole._id,
      role: newRole,
    };
    console.log(payload, 'payloader');
    fireRoleChange(payload, {
      onSuccess(data, variables, context) {
        console.log(data, 'role data');
        queryClient.invalidateQueries({
          queryKey: ['admin-users-with-post-count', debouncedSearch],
        });
        toast.success(
          `${selectedUserForRole.username} has been promoted to ${newRole}`,
        );
      },
      onError(error, variables, context) {
        console.log(error, 'errorsdata');
        setActionLoader(false);
        toast.error(error.message);
      },
      onSettled(data, error, variables, context) {
        setActionLoader(false);
        setRoleManagementDialog(false);
      },
    });
  };

  const handleOpenRoleManagementDialog = (user: any) => {
    setSelectedUserForRole(user);
    setCurrentRole(user.role);
    setRoleManagementDialog(true);
  };
  const handleFetchNext = async () => {
    try {
      setFetchNextError(null);
      await fetchNextPage();
    } catch (err) {
      setFetchNextError('Failed to load more content.');
    }
  };

  return (
    <Fragment>
      <div className="space-y-4">
        <h2 className="text-lg font-bold">All Users</h2>
        {isFetching && !isFetchingNextPage && (
          <div className="my-4">Searching...</div>
        )}

        <Virtuoso
          className="custom-scrollbar"
          //style={{height: '100vh'}}
          style={{height: 'calc(100vh - 100px)'}}
          data={users}
          onScroll={handleScroll}
          ref={virtuosoRef}
          itemContent={(index, user) => {
            return (
              <AdminUserCard
                user={user}
                handleOpenUserActionDialog={handleOpenUserActionDialog}
                handleOpenRoleManagementDialog={handleOpenRoleManagementDialog}
              />
            );
          }}
          endReached={() => {
            if (hasNextPage && !isFetchingNextPage) {
              handleFetchNext();
            }
          }}
          components={{
            EmptyPlaceholder: () =>
              status === 'error' ? null : (
                <Card>
                  <CardContent className="p-6 text-center">
                    <p className="text-app-gray">No users found</p>
                  </CardContent>
                </Card>
              ),

            Header: () => (
              <div className="rounded-md border border-app-border">
                <div className="p-4 bg-app-hover dark:bg-app-dark-bg/10">
                  <div className="grid grid-cols-1 md:grid-cols-6 font-medium">
                    <div>User</div>
                    <div>Username</div>
                    <div className="hidden md:block">Posts</div>
                    <div className="hidden md:block">Status</div>
                    <div className="hidden md:block">Role</div>
                    <div>Actions</div>
                  </div>
                </div>
              </div>
            ),

            Footer: () =>
              status === 'error' ? (
                <ErrorFeedback
                  showRetry
                  onRetry={refetch}
                  message="We encountered an unexpected error. Please try again"
                  variant="minimal"
                />
              ) : isFetchingNextPage ? (
                <LoadingMore />
              ) : fetchNextError ? (
                <LoadMoreError
                  fetchNextError={fetchNextError}
                  handleFetchNext={handleFetchNext}
                />
              ) : null,
          }}
        />

        {showGoUp && (
          <button
            onClick={() => {
              virtuosoRef.current?.scrollTo({top: 0, behavior: 'smooth'});
            }}
            className="fixedBottomBtn z-1 fixed bottom-6 right-5 lg:right-[calc(50%-24rem)] bg-app text-white p-2 rounded-full shadow-lg hover:bg-app/90 transition">
            <ArrowUp size={20} />
          </button>
        )}
      </div>

      {/* User Action Dialog */}

      <AdminUserActionDialog
        userActionType={userActionType}
        setUserActionDialog={setUserActionDialog}
        userActionDialog={userActionDialog}
        setSuspensionPeriod={setSuspensionPeriod}
        suspensionPeriod={suspensionPeriod}
        userActionReason={userActionReason}
        setUserActionReason={setUserActionReason}
        handleUserAction={handleUserAction}
        actionLoader={actionLoader}
      />

      {/* Role mgt Action Dialog */}

      <AdminRoleManagementDialog
        roleManagementDialog={roleManagementDialog}
        newRole={newRole}
        setNewRole={setNewRole}
        setRoleManagementDialog={setRoleManagementDialog}
        handleRoleChange={handleRoleChange}
        actionLoader={actionLoader}
      />
    </Fragment>
  );
};
