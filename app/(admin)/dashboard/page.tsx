import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { SectionCards } from "@/components/section-cards"
import { getResourceUploadsOverTime } from "@/lib/data-stats"

export const dynamic = 'force-dynamic';

export default async function Page() {
  const chartData = await getResourceUploadsOverTime()

  return (
    <>
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <SectionCards />
        <div className="px-4 lg:px-6">
          <ChartAreaInteractive chartData={chartData} />
        </div>
      </div>
    </>
  )
}