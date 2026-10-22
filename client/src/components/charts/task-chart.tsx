import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

export function TaskChart() {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  const { data: stats } = useQuery({
    queryKey: ["/api/stats"],
  });

  useEffect(() => {
    if (!chartRef.current || !stats) return;

    // Destroy existing chart if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext("2d");
    if (!ctx) return;

    chartInstance.current = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: ["Completed", "In Progress", "Overdue"],
        datasets: [
          {
            data: [
              stats.completedTasks,
              stats.inProgressTasks,
              stats.overdueTasks,
            ],
            backgroundColor: [
              "hsl(142, 76%, 36%)",
              "hsl(43, 96%, 56%)",
              "hsl(0, 84%, 60%)",
            ],
            borderWidth: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "bottom",
          },
        },
      },
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [stats]);

  return (
    <div className="relative h-64">
      <canvas ref={chartRef} />
    </div>
  );
}
