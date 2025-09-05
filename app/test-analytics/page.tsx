import { getFieldPopularityOverTime, getTopActiveModules, getResourceTypeUsage, getSearchTrends, getInactiveModulesOrFields, getUserEngagementHeatmap } from "@/lib/data/analytics";

export default async function TestAnalyticsPage() {
  const today = new Date();
  const last90Days = new Date();
  last90Days.setDate(today.getDate() - 90);

  const fieldPopularity = await getFieldPopularityOverTime(last90Days, today);
  const topModules = await getTopActiveModules(5, last90Days, today);
  const resourceUsage = await getResourceTypeUsage(last90Days, today);
  const searchTrends = await getSearchTrends(10, last90Days, today);
  const inactiveModules = await getInactiveModulesOrFields(90, 'module');
  const inactiveFields = await getInactiveModulesOrFields(90, 'field');
  const engagementHeatmap = await getUserEngagementHeatmap(last90Days, today);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Analytics Test Page</h1>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Field Popularity Over Time (Last 90 Days)</h2>
        <pre className="bg-gray-100 p-4 rounded-md overflow-auto text-sm">
          {JSON.stringify(fieldPopularity, null, 2)}
        </pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Top 5 Active Modules (Last 90 Days)</h2>
        <pre className="bg-gray-100 p-4 rounded-md overflow-auto text-sm">
          {JSON.stringify(topModules, null, 2)}
        </pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Resource Type Usage (Last 90 Days)</h2>
        <pre className="bg-gray-100 p-4 rounded-md overflow-auto text-sm">
          {JSON.stringify(resourceUsage, null, 2)}
        </pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Search Trends (Top 10, Last 90 Days)</h2>
        <pre className="bg-gray-100 p-4 rounded-md overflow-auto text-sm">
          {JSON.stringify(searchTrends, null, 2)}
        </pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Inactive Modules (Last 90 Days)</h2>
        <pre className="bg-gray-100 p-4 rounded-md overflow-auto text-sm">
          {JSON.stringify(inactiveModules, null, 2)}
        </pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Inactive Fields (Last 90 Days)</h2>
        <pre className="bg-gray-100 p-4 rounded-md overflow-auto text-sm">
          {JSON.stringify(inactiveFields, null, 2)}
        </pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">User Engagement Heatmap (Last 90 Days)</h2>
        <pre className="bg-gray-100 p-4 rounded-md overflow-auto text-sm">
          {JSON.stringify(engagementHeatmap, null, 2)}
        </pre>
      </section>
    </div>
  );
}
