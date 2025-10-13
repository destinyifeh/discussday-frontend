import {extractLinks, extractLinks2} from '@/lib/formatter';
import React from 'react';

export const PostContent3 = ({content}: {content: string}) => {
  return (
    <div
      className="text-base leading-relaxed"
      style={{
        margin: 0,
        padding: 0,
        // lineHeight: '1.25rem',
        whiteSpace: 'pre-wrap',
      }}>
      <div dangerouslySetInnerHTML={{__html: extractLinks2(content)}} />
    </div>
  );
};
export const PostContent = React.memo(({content}: {content: string}) => {
  return (
    <div className="text-base leading-normal" style={{whiteSpace: 'pre-wrap'}}>
      <div dangerouslySetInnerHTML={{__html: extractLinks2(content)}} />
    </div>
  );
});

export const PostContent2 = ({content}: {content: string}) => {
  return (
    <div
      className="text-base leading-relaxed"
      style={{
        margin: 0,
        padding: 0,
        //lineHeight: '1.25rem',
        whiteSpace: 'pre-wrap',
      }}>
      <div dangerouslySetInnerHTML={{__html: extractLinks(content)}} />
    </div>
  );
};
