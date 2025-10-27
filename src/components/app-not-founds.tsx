'use client';

import {useRouter} from 'next/navigation';
import {Button} from './ui/button';

export const SectionNotFound = ({section}: {section: string}) => {
  const navigate = useRouter();
  return (
    <div className="p-8 text-center">
      <h2 className="text-xl font-bold mb-2">Section not found {section}</h2>
      <Button variant="outline" onClick={() => navigate.push('/')}>
        Back to Home
      </Button>
    </div>
  );
};
