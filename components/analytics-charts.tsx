'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line, LineChart, Pie, PieChart, Cell, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";

// Define ChartConfig for each chart type
// Note: ChartConfig is primarily for ChartContainer's internal styling and legend generation.
// For dynamic data keys, colors for Line/Bar components might be managed separately.
const fieldPopularityChartConfig = {
  views: {
    label: "Views",
    color: "#4285F4", // Custom color
  },
} satisfies ChartConfig;

const topModulesChartConfig = {
  views: {
    label: "Views",
    color: "#34A853", // Custom color
  },
} satisfies ChartConfig;

const resourceUsageChartConfig = {
  count: {
    label: "Count",
  },
  // Define colors for each resource type if known, or use dynamic assignment
  course: { label: "Course", color: "#FBBC05" }, // Custom color
  exam: { label: "Exam", color: "#EA4335" }, // Custom color
  project: { label: "Project", color: "#4285F4" }, // Custom color
  // ... add other types as needed
} satisfies ChartConfig;

const searchTrendsChartConfig = {
  count: {
    label: "Searches",
    color: "#9C27B0", // Custom color
  },
} satisfies ChartConfig;

interface AnalyticsChartsProps {
  fieldPopularity: { fieldId: string; fieldName: string; views: number }[]; // Reverted type
  topModules: { moduleId: string; moduleName: string; views: number }[];
  resourceUsage: { type: string; count: number }[];
  searchTrends: { query: string; count: number }[];
  inactiveModules: { id: string; name: string; type: string }[];
  inactiveFields: { id: string; name: string; type: string }[];
  engagementHeatmap: { [day: string]: { [hour: string]: number } };
  totalModules: number;
  totalFields: number;
}

// Using a consistent color palette for dynamic lines/bars (Custom Hex Colors)
const CHART_COLORS = [
  "#4285F4", // Google Blue
  "#34A853", // Google Green
  "#FBBC05", // Google Yellow
  "#EA4335", // Google Red
  "#9C27B0", // Deep Purple
  "#00BCD4", // Cyan
];

// Helper function for Pie chart labels
const renderPieLabel = ({ name, percent }: { name: string; percent: number }) => {
  return `${name} (${(percent * 100).toFixed(0)}%)`;
};

export function AnalyticsCharts({
  fieldPopularity,
  topModules,
  resourceUsage,
  searchTrends,
  inactiveModules,
  inactiveFields,
  engagementHeatmap,
  totalModules,
  totalFields,
}: AnalyticsChartsProps) {

  // Calculate percentages for Inactive Modules/Fields
  const inactiveModulesPercentage = totalModules > 0 ? (inactiveModules.length / totalModules) * 100 : 0;
  const activeModulesPercentage = 100 - inactiveModulesPercentage;
  const inactiveModulesData = [
    { name: 'Inactive', value: inactiveModulesPercentage, color: '#EA4335' }, // Custom color
    { name: 'Active', value: activeModulesPercentage, color: '#34A853' }, // Custom color
  ];

  const inactiveFieldsPercentage = totalFields > 0 ? (inactiveFields.length / totalFields) * 100 : 0;
  const activeFieldsPercentage = 100 - inactiveFieldsPercentage;
  const inactiveFieldsData = [
    { name: 'Inactive', value: inactiveFieldsPercentage, color: '#EA4335' }, // Custom color
    { name: 'Active', value: activeFieldsPercentage, color: '#34A853' }, // Custom color
  ];

  return (
    <div className="space-y-8">
      {/* Field Popularity Over Time - Pie Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Total Field Views</CardTitle>
          <CardDescription>Total views per field in the last 90 days.</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={fieldPopularityChartConfig} className="mx-auto aspect-square max-h-[300px]">
            <PieChart>
              <Pie
                data={fieldPopularity}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                dataKey="views"
                nameKey="fieldName"
                label={renderPieLabel}
              >
                {fieldPopularity.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Pie>
              <ChartLegend content={<ChartLegendContent nameKey="fieldName" style={{ color: 'black' }} />} className="flex-wrap gap-2 *:basis-1/4 *:justify-center" />
            </PieChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Top 5 Active Modules - Bar Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Top 5 Active Modules</CardTitle>
          <CardDescription>Most viewed modules in the last 90 days.</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={topModulesChartConfig} className="aspect-auto h-[300px] w-full">
            <BarChart data={topModules}>
              <CartesianGrid vertical={false} />
              <XAxis 
                dataKey="moduleName" 
                angle={-45} 
                textAnchor="end" 
                height={80} 
                interval={0} 
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="views" fill="#34A853" radius={4} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Resource Type Usage - Pie Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Resource Type Usage</CardTitle>
          <CardDescription>Distribution of downloaded resource types in the last 90 days.</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={resourceUsageChartConfig} className="mx-auto aspect-square max-h-[300px]">
            <PieChart>
              <Pie
                data={resourceUsage}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                dataKey="count"
                nameKey="type"
                label={renderPieLabel}
              >
                {resourceUsage.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Pie>
              <ChartLegend content={<ChartLegendContent nameKey="type" style={{ color: 'black' }} />} className="flex-wrap gap-2 *:basis-1/4 *:justify-center" />
            </PieChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Search Trends - Line Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Search Trends</CardTitle>
          <CardDescription>Top search queries in the last 90 days.</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={searchTrendsChartConfig} className="aspect-auto h-[300px] w-full">
            <LineChart data={searchTrends}>
              <CartesianGrid vertical={false} />
              <XAxis 
                dataKey="query" 
                angle={-45} 
                textAnchor="end" 
                height={80} 
                interval={0} 
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
              <Line type="monotone" dataKey="count" stroke="#9C27B0" strokeWidth={2} activeDot={{ r: 8 }} />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Inactive Modules and Fields - Radial/Donut Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Inactive Modules</CardTitle>
            <CardDescription>Percentage of modules with no views in the last 90 days.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={resourceUsageChartConfig} className="mx-auto aspect-square max-h-[200px]">
              <PieChart>
                <Pie
                  data={inactiveModulesData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={renderPieLabel}
                >
                  {inactiveModulesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ChartContainer>
            <p className="text-center text-sm text-muted-foreground">{inactiveModules.length} out of {totalModules} modules are inactive.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Inactive Fields</CardTitle>
            <CardDescription>Percentage of fields with no views in the last 90 days.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={resourceUsageChartConfig} className="mx-auto aspect-square max-h-[200px]">
              <PieChart>
                <Pie
                  data={inactiveFieldsData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={renderPieLabel}
                >
                  {inactiveFieldsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ChartContainer>
            <p className="text-center text-sm text-muted-foreground">{inactiveFields.length} out of {totalFields} fields are inactive.</p>
          </CardContent>
        </Card>
      </div>

      {/* User Engagement Heatmap - Table (keeping for now) */}
      <Card>
        <CardHeader>
          <CardTitle>User Engagement Heatmap</CardTitle>
          <CardDescription>Activity by day of week and hour of day (last 90 days).</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hour</th>
                  {[ 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat' ].map((day, index) => (
                    <th key={index} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{day}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {Object.keys(engagementHeatmap["0"]).map((hour) => (
                  <tr key={hour}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{`${hour}:00`}</td>
                    {[ '0', '1', '2', '3', '4', '5', '6' ].map((day) => (
                      <td key={day} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {engagementHeatmap[day]?.[hour] || 0}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
