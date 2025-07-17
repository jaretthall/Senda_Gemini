@@ .. @@
 'use client';

 import React, { useState } from 'react';
 import Sidebar from '@/components/layout/Sidebar';
 import Header from '@/components/layout/Header';
-import OverviewDashboard from '@/components/dashboard/OverviewDashboard';
+import RealTimeOverviewDashboard from '@/components/dashboard/RealTimeOverviewDashboard';
 import { useTheme } from '@/providers/ThemeProvider';

 export default function HomePage() {
@@ .. @@
         />
         <main className="flex-1 overflow-x-hidden overflow-y-auto bg-secondary-100 dark:bg-secondary-900 p-4 md:p-6 lg:p-8">
-          <OverviewDashboard />
+          <RealTimeOverviewDashboard />
         </main>
       </div>
     </div>