'use client';

import {useGlobalStore} from '@/hooks/stores/use-global-store';
import {Info, X} from 'lucide-react';
import {useState} from 'react';

const CommunityGuidelines = ({
  setShowGuidelines,
}: {
  setShowGuidelines?: (showGuidelines: boolean) => void;
}) => {
  const [expanded, setExpanded] = useState(true);
  const {theme} = useGlobalStore(state => state);

  return (
    <div className="flex items-start gap-2">
      <Info className="text-app mt-0.5" size={18} />
      <div className="flex-1">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-medium">Community Guidelines</h3>
          {/* <Button
            variant="ghost"
            size="sm"
            onClick={() => setExpanded(!expanded)}
            className="text-xs h-auto py-1 px-2">
            {expanded ? 'Show less' : 'Read more'}
          </Button> */}
          <div className="">
            <X
              size={18}
              className="cursor-pointer"
              onClick={() => setShowGuidelines?.(false)}
            />
          </div>
        </div>

        <p className="text-xs mt-1">
          Be respectful and thoughtful when posting. Keep your post constructive
          and on topic.
        </p>

        {expanded && (
          <div className="mt-3 space-y-2 text-xs">
            <div>
              <p className="font-medium">Be respectful and inclusive</p>
              <p>
                Treat everyone with respect. Avoid offensive, hateful, or
                discriminatory language.
              </p>
            </div>
            <div>
              <p className="font-medium">Stay on topic</p>
              <p>
                Keep your post relevant to the community’s interests and
                discussions.
              </p>
            </div>
            <div>
              <p className="font-medium">No spam or self-promotion</p>
              <p>
                Avoid repetitive or promotional content unless it genuinely
                contributes to the topic.
              </p>
            </div>
            <div>
              <p className="font-medium">Protect privacy</p>
              <p>Don't share personal information about yourself or others.</p>
            </div>
            <div>
              <p className="font-medium">Post with purpose</p>
              <p>
                Share meaningful thoughts, experiences, or questions that
                encourage discussion and add value to the community.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommunityGuidelines;
