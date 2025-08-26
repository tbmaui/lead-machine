import { useMemo, useState } from "react";
import type { Lead } from "@/hooks/useLeadGeneration";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Pie, PieChart, Cell, Label, LabelList, Sector } from "recharts";

// Type definitions for proper type safety
interface AdditionalData {
  Title?: string;
  title?: string;
  [key: string]: unknown;
}

interface SliceLabelProps {
  value?: number;
  percent?: number;
}

interface SectorProps {
  index: number;
  name: string;
  value: number;
  percent: number;
  [key: string]: unknown;
}

type QualitySlice = {
  name: string;
  value: number;
  key: "both" | "emailOnly" | "phoneOnly" | "neither";
};

type TitleSlice = {
  name: string;
  value: number;
};

type ChartData = QualitySlice | TitleSlice;

type ChartMode = "quality" | "titles";

export function computeQualityBreakdown(leads: Lead[]): QualitySlice[] {
  let both = 0;
  let emailOnly = 0;
  let phoneOnly = 0;
  let neither = 0;

  for (const lead of leads) {
    const hasEmail = !!(lead.email && String(lead.email).trim().length > 0);
    const hasPhone = !!(lead.phone && String(lead.phone).trim().length > 0);
    if (hasEmail && hasPhone) {
      both += 1;
    } else if (hasEmail) {
      emailOnly += 1;
    } else if (hasPhone) {
      phoneOnly += 1;
    } else {
      neither += 1;
    }
  }

  return [
    { name: "Both", value: both, key: "both" },
    { name: "Has Email", value: emailOnly, key: "emailOnly" },
    { name: "Has Phone", value: phoneOnly, key: "phoneOnly" },
    { name: "Neither", value: neither, key: "neither" },
  ];
}

function normalizeTitle(raw?: string): string {
  if (!raw) return "Unknown";
  return String(raw).trim();
}

export function computeTitlesBreakdown(leads: Lead[]): TitleSlice[] {
  const counts = new Map<string, number>();
  for (const lead of leads) {
    const additionalData = lead.additional_data as AdditionalData | undefined;
    const normalized = normalizeTitle(lead.title || additionalData?.Title || additionalData?.title);
    counts.set(normalized, (counts.get(normalized) || 0) + 1);
  }
  const entries = Array.from(counts.entries()).sort((a, b) => b[1] - a[1]);
  const topFive = entries.slice(0, 5);
  const otherCount = entries.slice(5).reduce((sum, [, v]) => sum + v, 0);
  const slices: TitleSlice[] = topFive.map(([name, value]) => ({ name, value }));
  if (otherCount > 0) slices.push({ name: "Other", value: otherCount });
  return slices;
}

interface LeadsSummaryChartProps {
  leads: Lead[];
}

const QUALITY_COLORS: Record<QualitySlice["key"], string> = {
  both: "#16a34a", // green-600
  emailOnly: "#f59e0b", // amber-500
  phoneOnly: "#3b82f6", // blue-500
  neither: "#9ca3af", // gray-400
};

const TITLE_COLORS = [
  "#2563eb",
  "#16a34a",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#9ca3af",
];

const LeadsSummaryChart = ({ leads }: LeadsSummaryChartProps) => {
  const [mode, setMode] = useState<ChartMode>("quality");
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // Move all hooks before any early returns to fix React Hook Rules violation
  const qualityData = useMemo(() => computeQualityBreakdown(leads || []), [leads]);
  const titleData = useMemo(() => computeTitlesBreakdown(leads || []), [leads]);
  const total = useMemo(() => leads?.length || 0, [leads]);
  
  const hasData = useMemo(() => {
    const data = mode === "quality" ? qualityData : titleData;
    return data.some((s) => s.value > 0);
  }, [mode, qualityData, titleData]);

  const chartConfig = useMemo(() => {
    if (mode === "quality") {
      return {
        Both: { label: "Both", color: QUALITY_COLORS.both },
        "Has Email": { label: "Has Email", color: QUALITY_COLORS.emailOnly },
        "Has Phone": { label: "Has Phone", color: QUALITY_COLORS.phoneOnly },
        Neither: { label: "Neither", color: QUALITY_COLORS.neither },
      } as const;
    }
    const config: Record<string, { label: string; color: string }> = {};
    titleData.forEach((slice, idx) => {
      config[slice.name] = { label: slice.name, color: TITLE_COLORS[idx % TITLE_COLORS.length] };
    });
    return config;
  }, [mode, titleData]);

  // Early return after all hooks are called
  if (!leads || leads.length === 0) return null;

  const renderSliceLabel = (props: SliceLabelProps) => {
    const value = props?.value;
    const percent = typeof props?.percent === "number" ? Math.round(props.percent * 100) : undefined;
    if (!value) return "";
    return percent !== undefined ? `${value} (${percent}%)` : String(value);
  };

  const renderSector = (props: SectorProps) => {
    const { index, name, value, percent, ...otherProps } = props;
    const pct = typeof percent === "number" ? Math.round(percent * 100) : 0;
    const isActive = activeIndex === index;
    const label = `${name}: ${value} (${pct}%)`;
    return (
      <g
        tabIndex={0}
        role="button"
        aria-label={label}
        onFocus={() => setActiveIndex(index)}
        onBlur={() => setActiveIndex(null)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            setActiveIndex(isActive ? null : index);
            e.preventDefault();
          }
        }}
      >
        <title>{label}</title>
        <Sector {...otherProps} stroke={isActive ? "#0ea5e9" : undefined} strokeWidth={isActive ? 2 : undefined} />
      </g>
    );
  };

  return (
    <div className="neu-card neu-gradient-stroke p-6 max-w-sm mx-auto" role="img" aria-label={mode === "quality" ? "Lead quality summary donut chart" : "Title distribution donut chart"}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Lead Summary</h3>
        <ToggleGroup type="single" value={mode} onValueChange={(v) => v && setMode(v as ChartMode)} className="neu-flat">
          <ToggleGroupItem value="quality" aria-label="Show quality breakdown" className="neu-button text-xs">Quality</ToggleGroupItem>
          <ToggleGroupItem value="titles" aria-label="Show titles breakdown" className="neu-button text-xs">Titles</ToggleGroupItem>
        </ToggleGroup>
      </div>

      {!hasData ? (
        <div className="text-muted-foreground text-sm text-center py-8">No data to display.</div>
      ) : (
        <ChartContainer className="w-full aspect-square max-w-[280px] mx-auto" config={chartConfig}>
          <PieChart width={280} height={280}>
            <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
            <Pie
              data={mode === "quality" ? qualityData : titleData}
              dataKey="value"
              nameKey="name"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              isAnimationActive={false}
              label={renderSliceLabel}
              labelLine={false}
              
              activeIndex={activeIndex === null ? undefined : activeIndex}
            >
              {(mode === "quality" ? qualityData : titleData).map((entry, index) => {
                const color = mode === "quality"
                  ? QUALITY_COLORS[(entry as QualitySlice).key]
                  : TITLE_COLORS[index % TITLE_COLORS.length];
                return <Cell key={entry.name} fill={color} />;
              })}
              <Label
                position="center"
                content={() => (
                  <text x={140} y={140} textAnchor="middle" dominantBaseline="middle" className="fill-foreground text-xl font-bold">
                    {total.toLocaleString()}
                  </text>
                )}
              />
              <LabelList dataKey="value" content={() => null} />
            </Pie>
            <ChartLegend content={<ChartLegendContent nameKey="name" />} />
          </PieChart>
        </ChartContainer>
      )}
    </div>
  );
};

export default LeadsSummaryChart;


