'use client';

import {Search} from 'lucide-react';
import React, {forwardRef} from 'react';
import {Input} from '../ui/input';

type Props = {
  searchTerm?: string;
  setSearchTerm?: (search: string) => void;
};

// Forward the ref to the input element
const SearchBarList = forwardRef<HTMLInputElement, Props>(
  ({searchTerm, setSearchTerm}, ref) => {
    return (
      <div className="p-4">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-app-gray"
            size={20}
          />
          <Input
            placeholder="Search"
            className="bg-gray-100 border-0 rounded-full pl-10 form-input"
            value={searchTerm}
            onChange={e => setSearchTerm?.(e.target.value)}
            ref={ref}
          />
        </div>
      </div>
    );
  },
);

export default React.memo(SearchBarList);
