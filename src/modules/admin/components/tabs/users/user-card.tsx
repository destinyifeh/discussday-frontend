'use client';

import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';
import {Badge} from '@/components/ui/badge';
import {Button} from '@/components/ui/button';
import {Ban, Calendar, Crown, Shield, User} from 'lucide-react';

import {useAuthStore} from '@/hooks/stores/use-auth-store';
import {UserActionType} from '@/modules/admin/admin-types';
import {AdminUserProps} from '@/services/admin-service';
import {Role} from '@/types/user.types';

export const AdminUserCard = ({
  user,
  handleOpenUserActionDialog,
  handleOpenRoleManagementDialog,
}: {
  user: AdminUserProps;
  handleOpenRoleManagementDialog: (user: any) => void;
  handleOpenUserActionDialog: (user: string, action: UserActionType) => void;
}) => {
  const {currentUser} = useAuthStore(state => state);
  return (
    <div className="divide-y divide-app-border border border-app-border">
      <div
        //key={user._id}
        className="grid grid-cols-1 md:grid-cols-6 items-center p-4">
        <div className="flex items-center gap-2 mb-2 md:mb-0">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.avatar} />
            <AvatarFallback className="capitalize text-app text-2xl">
              {user.username?.charAt(0) || 'U'}
            </AvatarFallback>
          </Avatar>
        </div>
        <div className="mb-2 md:mb-0 truncate w-[80px]">{user.username}</div>
        <div className="hidden md:block">{user.postCount}</div>
        <div className="hidden md:block">
          <Badge variant="outline" className="border-app-border">
            {user.status}
          </Badge>
        </div>

        <div className="hidden md:block">
          <Badge
            variant={
              user.role === Role.SUPER_ADMIN
                ? 'destructive'
                : user.role === Role.ADMIN
                ? 'default'
                : 'secondary'
            }
            className="flex items-center gap-1">
            {user.role === Role.SUPER_ADMIN && <Crown size={12} />}
            {user.role === Role.ADMIN && <Shield size={12} />}
            {user.role === Role.USER && <User size={12} />}
            {user.role === Role.SUPER_ADMIN
              ? 'Super Admin'
              : user.role === Role.ADMIN
              ? 'Admin'
              : Role.USER}
          </Badge>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              handleOpenUserActionDialog(user.username, UserActionType.VIEW)
            }>
            <User size={14} className="mr-1" /> View
          </Button>
          {currentUser?.role === Role.SUPER_ADMIN && (
            <Button
              variant="ghost"
              size="sm"
              className="text-blue-500"
              onClick={() => handleOpenRoleManagementDialog(user)}>
              <Crown size={14} className="mr-1" /> Role
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="text-yellow-500"
            onClick={() =>
              handleOpenUserActionDialog(
                user._id,
                user.status === 'suspended'
                  ? UserActionType.UNSUSPEND
                  : UserActionType.SUSPEND,
              )
            }>
            <Calendar size={14} className="mr-1" />{' '}
            {user.status === 'suspended'
              ? UserActionType.UNSUSPEND
              : UserActionType.SUSPEND}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-red-500"
            onClick={() =>
              handleOpenUserActionDialog(
                user._id,
                user.status === 'banned'
                  ? UserActionType.UNBAN
                  : UserActionType.BAN,
              )
            }>
            <Ban size={14} className="mr-1" />{' '}
            {user.status === 'banned'
              ? UserActionType.UNBAN
              : UserActionType.BAN}
          </Button>
        </div>
      </div>
    </div>
  );
};
