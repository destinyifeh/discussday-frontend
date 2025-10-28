'use client';

import {useRouter} from 'next/navigation';

interface AuthPromptProps {
  page: 'create' | 'bookmarks' | 'profile';
}

export default function AuthPrompt({page}: AuthPromptProps) {
  const router = useRouter();

  const content = {
    create: {
      title: 'Sign in to create a post',
      message:
        'Log in to start new discussions, share your thoughts, and join the conversation.',
    },
    bookmarks: {
      title: 'Sign in to view your bookmarks',
      message:
        'Log in to access your saved discussions and keep track of your favorite posts.',
    },
    profile: {
      title: 'Sign in to view your profile',
      message:
        'Log in to see your posts, likes, and activity history on Discussday.',
    },
  };

  const {title, message} = content[page];

  return (
    <div className="text-center py-12 px-3">
      <h2 className="text-xl font-bold mb-2">{title}</h2>
      <p className="text-app-gray mb-4">{message}</p>
      <button
        className="bg-app hover:bg-app/90 text-white px-5 py-2 rounded-full text-sm font-medium active:scale-95 transition-transform"
        onClick={() => router.push('/login')}>
        Log In
      </button>
    </div>
  );
}
