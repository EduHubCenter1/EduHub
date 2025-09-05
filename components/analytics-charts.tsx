'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface AnalyticsChartsProps {
  fieldPopularity: { fieldId: string; fieldName: string; views: number }[];
  topModules: { moduleId: string; moduleName: string; views: number }[];
  resourceUsage: { type: string; count: number }[];
  searchTrends: { query: string; count: number }[];
  inactiveModules: { id: string; name: string; type: string }[];
  inactiveFields: { id: string; name: string; type: string }[];
  engagementHeatmap: { [day: string]: { [hour: string]: number } };
}

export function AnalyticsCharts({
  fieldPopularity,
  topModules,
  resourceUsage,
  searchTrends,
  inactiveModules,
  inactiveFields,
  engagementHeatmap,
}: AnalyticsChartsProps) {
  return (
    <div className="space-y-8">
      {/* Field Popularity Over Time */}
      <Card>
        <CardHeader>
          <CardTitle>Field Popularity Over Time</CardTitle>
          <CardDescription>Views per field in the last 90 days.</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={fieldPopularity}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="fieldName" angle={-45} textAnchor="end" height={80} interval={0} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="views" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Top 5 Active Modules */}
      <Card>
        <CardHeader>
          <CardTitle>Top 5 Active Modules</CardTitle>
          <CardDescription>Most viewed modules in the last 90 days.</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topModules}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="moduleName" angle={-45} textAnchor="end" height={80} interval={0} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="views" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Resource Type Usage */}
      <Card>
        <CardHeader>
          <CardTitle>Resource Type Usage</CardTitle>
          <CardDescription>Distribution of downloaded resource types in the last 90 days.</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={resourceUsage}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="type" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#ffc658" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Search Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Search Trends</CardTitle>
          <CardDescription>Top search queries in the last 90 days.</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={searchTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="query" angle={-45} textAnchor="end" height={80} interval={0} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#ff7300" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Inactive Modules and Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Inactive Modules</CardTitle>
            <CardDescription>Modules with no views in the last 90 days.</CardDescription>
          </CardHeader>
          <CardContent>
            {inactiveModules.length > 0 ? (
              <ul className="list-disc pl-5">
                {inactiveModules.map((item) => (
                  <li key={item.id}>{item.name}</li>
                ))}
              </ul>
            ) : (
              <p>No inactive modules found.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Inactive Fields</CardTitle>
            <CardDescription>Fields with no views in the last 90 days.</CardDescription>
          </CardHeader>
          <CardContent>
            {inactiveFields.length > 0 ? (
              <ul className="list-disc pl-5">
                {inactiveFields.map((item) => (
                  <li key={item.id}>{item.name}</li>
                ))}
              </ul>
            ) : (
              <p>No inactive fields found.</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* User Engagement Heatmap */}
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
