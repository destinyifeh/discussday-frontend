'use client';

import {truncateText} from '@/lib/formatter';
import {cn} from '@/lib/utils';
import {useRouter} from 'next/navigation';
import {Avatar, AvatarFallback, AvatarImage} from '../ui/avatar';
import {Button} from '../ui/button';

type UserCardProps = {
  user: any;
  isCurrentUser: boolean;
  handleFollowUser: () => void;
  isFollowing: boolean | undefined;
};

export const UserCard = ({
  user,
  isCurrentUser,
  handleFollowUser,
  isFollowing,
}: UserCardProps) => {
  const navigate = useRouter();
  return (
    <div key={user._id} className="flex items-center justify-between p-4">
      <div className="flex items-center gap-3 cursor-pointer flex-1">
        <Avatar
          className="cursor-pointer active:scale-90 transition-transform duration-150"
          onClick={() => navigate.push(`/user/${user.username}`)}>
          <AvatarImage src={user.avatar} />
          <AvatarFallback className="capitalize text-app text-2xl">
            {user.username.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-bold capitalize">
              {truncateText(user.username, 20)}
            </h3>
          </div>

          {user.bio && (
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
              {user.bio.slice(0, 25)}
              {user.bio.length > 25 && '...'}
            </p>
          )}
          <div className="flex items-center gap-4 mt-1 text-xs text-app-gray">
            <span>{user.followers?.length || 0} followers</span>
            <span>{user.following?.length || 0} following</span>
          </div>
        </div>
      </div>
      {!isCurrentUser && (
        <Button
          className={`rounded-full ml-3 active:scale-90 transition-transform duration-150 ${
            isFollowing
              ? 'bg-transparent text-black border border-gray-300 hover:bg-red-50 hover:text-red-600 hover:border-red-300 dark:text-white'
              : 'bg-app text-white hover:bg-app/90'
          }`}
          size="sm"
          onClick={e => {
            e.stopPropagation();
            handleFollowUser();
          }}>
          {isFollowing ? 'Following' : 'Follow'}
        </Button>
      )}
      {isCurrentUser && (
        <Button
          disabled={true}
          className={cn(
            'rounded-full',
            'bg-transparent text-black border border-gray-300 hover:bg-gray-100 hover:text-black dark:text-white',
          )}
          size="sm">
          You
        </Button>
      )}
    </div>
  );
};
