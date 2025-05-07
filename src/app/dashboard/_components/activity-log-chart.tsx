
"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { subDays, format } from "date-fns"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { useEffect, useState } from "react"

const generateRandomData = () => {
  const data = []
  for (let i = 6; i >= 0; i--) {
    data.push({
      date: format(subDays(new Date(), i), "MMM d"),
      logins: Math.floor(Math.random() * 50) + 10,
      creations: Math.floor(Math.random() * 10) + 1,
      updates: Math.floor(Math.random() * 20) + 5,
    })
  }
  return data
}

const chartConfig = {
  logins: {
    label: "Logins",
    color: "hsl(var(--chart-1))",
  },
  creations: {
    label: "Creations",
    color: "hsl(var(--chart-2))",
  },
  updates: {
    label: "Updates",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig

export function ActivityLogChart() {
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    setChartData(generateRandomData());
  }, []);

  if (chartData.length === 0) {
    return <div className="flex items-center justify-center h-64 text-muted-foreground">Loading chart data...</div>;
  }
  
  return (
    <ChartContainer config={chartConfig} className="min-h-[250px] w-full">
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={chartData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="date"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => value.slice(0, 6)}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickMargin={10}
            allowDecimals={false}
          />
          <ChartTooltip content={<ChartTooltipContent hideLabel />} cursor={false} />
          <Bar dataKey="logins" fill="var(--color-logins)" radius={4} />
          <Bar dataKey="creations" fill="var(--color-creations)" radius={4} />
          <Bar dataKey="updates" fill="var(--color-updates)" radius={4} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}

