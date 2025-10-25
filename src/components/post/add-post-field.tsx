'use client';

import {Textarea} from '../ui/textarea';

export const AddPostField = ({
  setContent,
  content,
}: {
  setContent: (text: string) => void;
  content: string;
}) => {
  return (
    <div className="relative w-full">
      <Textarea
        autoFocus
        placeholder="Start a discussion…"
        className="border-0 bg-transparent resize-none focus-visible:ring-0 focus-visible:ring-offset-0 p-0 min-h-20"
        value={content}
        onChange={e => setContent(e.target.value)}
      />
    </div>
  );
};
