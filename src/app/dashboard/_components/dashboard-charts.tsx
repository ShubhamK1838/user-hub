"use client";

import dynamic from "next/dynamic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { User } from "@/lib/types";

const ActivityLogChart = dynamic(() => import("./activity-log-chart").then(mod => mod.ActivityLogChart), { 
  ssr: false 
});

const RolesDistributionChart = dynamic(() => import("./roles-distribution-chart").then(mod => mod.RolesDistributionChart), { 
  ssr: false 
});

interface DashboardChartsProps {
  users: User[];
}

export function DashboardCharts({ users }: DashboardChartsProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="pl-2">
          <ActivityLogChart />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>User Roles Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <RolesDistributionChart users={users} />
        </CardContent>
      </Card>
    </div>
  );
}