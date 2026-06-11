"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { LabelList } from "recharts";

type WaitEvent = {
  event: string;
  pctDbTime: number;
};

export default function WaitEventsChart({
  data,
}: {
  data: WaitEvent[];
}) {

const chartData = data
  .filter((x) => x.pctDbTime > 0.5)
  .sort((a, b) => b.pctDbTime - a.pctDbTime)
  .slice(0, 10);
  
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6">
		<p className="mb-2 text-sm text-slate-400">
		  Primary Bottleneck Analysis
		</p>	
      <h3 className="mb-4 text-lg font-semibold">
        Wait Event Distribution
      </h3>

      <div style={{ width: "100%", height: 350 }}>
        <ResponsiveContainer>           
			<BarChart
			  layout="vertical"
			  data={chartData}
			>		  
			<CartesianGrid
			  stroke="#1E293B"
			  strokeDasharray="3 3"
			/>
			<XAxis
			  type="number"
			  stroke="#94A3B8"
			/>

			<YAxis
			  type="category"
			  dataKey="event"
			  width={220}
			  stroke="#94A3B8"
			/>
			<Tooltip
			  formatter={(value) => [`${Number(value ?? 0).toFixed(1)}%`,"DB Time",]}
			  contentStyle={{
				backgroundColor: "#0F172A",
				border: "1px solid #3B82F6",
				borderRadius: "8px",
				color: "#FFFFFF",
			  }}
			/>
			<Bar
			  dataKey="pctDbTime"
			  fill="#3B82F6"
			  radius={[0, 4, 4, 0]}
			  activeBar={{
				fill: "#3B82F6"
			  }}
			>			
			  <LabelList
				dataKey="pctDbTime"
				position="right"
				formatter={(v: number) => `${v.toFixed(1)}%`}
			  />
			</Bar>			
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}