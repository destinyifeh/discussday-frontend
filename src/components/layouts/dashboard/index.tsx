'use client';
import React from 'react';

import AppContainer from '..';
import {MainLayout} from './main-layout';
import {SidebarLayoutLeft, SidebarLayoutRight} from './sidebar-layout';

type DashboardLayoutProps = {
  children: React.ReactNode;
};

export const DashboardLayout = ({children}: DashboardLayoutProps) => {
  return (
    <AppContainer>
      <div className="flex flex-row justify-center pb-4 px-0 gap-8 bg-app-background w-full">
        <SidebarLayoutLeft />
        <MainLayout>{children}</MainLayout>
        <SidebarLayoutRight />
      </div>
    </AppContainer>
  );
};
