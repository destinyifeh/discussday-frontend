'use client';
import React from 'react';

import {AppFooter} from '@/components/app-footer';
import {AppHeader} from '@/components/app-headers';
import {useGlobalStore} from '@/hooks/stores/use-global-store';
import AppContainer from '..';

type PublicLayoutProps = {
  children: React.ReactNode;
};

export const PublicLayout = ({children}: PublicLayoutProps) => {
  const {theme} = useGlobalStore(state => state);
  return (
    <AppContainer>
      <AppHeader />
      <main className="">{children}</main>
      <AppFooter />
    </AppContainer>
  );
};
