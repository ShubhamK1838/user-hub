
"use client"

import { Pie, PieChart, Tooltip, ResponsiveContainer, Cell } from "recharts"
import type { User } from "@/lib/types"
import { ChartConfig, ChartContainer, ChartTooltipContent } from "@/components/ui/chart"
import { useEffect, useState } from "react"


const chartColors = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
  "hsl(190, 70%, 50%)", // Additional distinct colors
  "hsl(340, 70%, 50%)",
];

interface RolesDistributionChartProps {
  users: User[]
}

export function RolesDistributionChart({ users }: RolesDistributionChartProps) {
  const [chartData, setChartData] = useState<any[]>([]);
  const [config, setConfig] = useState<ChartConfig>({});


  useEffect(() => {
    const rolesCount: Record<string, number> = {};
    users.forEach(user => {
      user.roles.split(',').map(r => r.trim()).forEach(role => {
        if (role) {
          rolesCount[role] = (rolesCount[role] || 0) + 1;
        }
      });
    });

    const currentChartData = Object.entries(rolesCount).map(([name, value], index) => ({
      name,
      value,
      fill: chartColors[index % chartColors.length],
    })).sort((a,b) => b.value - a.value); // Sort by value
    
    const currentConfig = currentChartData.reduce((acc, item, index) => {
      acc[item.name] = {
        label: item.name.replace('ROLE_', '').replace('_', ' '),
        color: chartColors[index % chartColors.length],
      };
      return acc;
    }, {} as ChartConfig);

    setChartData(currentChartData);
    setConfig(currentConfig);

  }, [users]);

  if (chartData.length === 0) {
    return <div className="flex items-center justify-center h-64 text-muted-foreground">Loading chart data...</div>;
  }

  return (
    <ChartContainer config={config} className="min-h-[250px] w-full">
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <ChartTooltip content={<ChartTooltipContent nameKey="name" hideLabel />} />
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            labelLine={false}
            label={({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
              const RADIAN = Math.PI / 180;
              const radius = innerRadius + (outerRadius - innerRadius) * 1.2; // Position label outside
              const x = cx + radius * Math.cos(-midAngle * RADIAN);
              const y = cy + radius * Math.sin(-midAngle * RADIAN);
              const roleName = chartData[index].name.replace('ROLE_', '').replace('_', ' ');
              
              return (
                <text x={x} y={y} fill="hsl(var(--foreground))" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" className="text-xs">
                  {`${roleName} (${(percent * 100).toFixed(0)}%)`}
                </text>
              );
            }}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
