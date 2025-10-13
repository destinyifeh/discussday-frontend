'use client';

import {Button} from '@/components/ui/button';
import {useGlobalStore} from '@/hooks/stores/use-global-store';
import {Info} from 'lucide-react';
import {useState} from 'react';

const CommunityGuidelines = () => {
  const [expanded, setExpanded] = useState(false);
  const {theme} = useGlobalStore(state => state);

  return (
    <div className="flex items-start gap-2">
      <Info className="text-app mt-0.5" size={18} />
      <div className="flex-1">
        <div className="flex justify-between items-center">
          <h3 className="font-medium">Community Guidelines</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExpanded(!expanded)}
            className="text-xs h-auto py-1 px-2">
            {expanded ? 'Show less' : 'Read more'}
          </Button>
        </div>

        <p className="text-xs mt-1">
          Be respectful and kind to others. Keep discussions constructive.
        </p>

        {expanded && (
          <div className="mt-3 space-y-2 text-xs">
            <div>
              <p className="font-medium">Be respectful and inclusive</p>
              <p>
                Treat others with respect. Harassment, hate speech, and
                discrimination will not be tolerated.
              </p>
            </div>
            <div>
              <p className="font-medium">Stay on topic</p>
              <p>
                Keep comments relevant to the post topic to maintain productive
                conversations.
              </p>
            </div>
            <div>
              <p className="font-medium">No spam or self-promotion</p>
              <p>
                Don't post promotional content unless it's relevant and adds
                value to the discussion.
              </p>
            </div>
            <div>
              <p className="font-medium">Protect privacy</p>
              <p>Don't share personal information about yourself or others.</p>
            </div>
            <div>
              <p className="font-medium">Quality contributions</p>
              <p>
                Make an effort to contribute meaningfully to discussions with
                well-thought-out comments.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommunityGuidelines;
