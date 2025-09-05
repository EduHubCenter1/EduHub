import { getFieldPopularityOverTime, getTopActiveModules, getResourceTypeUsage, getSearchTrends, getInactiveModulesOrFields, getUserEngagementHeatmap } from "@/lib/data/analytics";
import { AnalyticsCharts } from "@/components/analytics-charts";

export default async function DashboardTestDataPage() {
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
      <h1 className="text-3xl font-bold mb-6">Analytics Dashboard (Test Data)</h1>
      <AnalyticsCharts
        fieldPopularity={fieldPopularity}
        topModules={topModules}
        resourceUsage={resourceUsage}
        searchTrends={searchTrends}
        inactiveModules={inactiveModules}
        inactiveFields={inactiveFields}
        engagementHeatmap={engagementHeatmap}
      />
    </div>
  );
}