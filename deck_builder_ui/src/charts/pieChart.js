import Chart from 'chart.js/auto'
import { useEffect, useRef } from 'react';
import { createDeckBreakdown } from '../helperFunctions';

export const PieChart = ({groupedCards}) => {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
      if (!canvasRef.current) return;

      if (chartRef.current) {
          chartRef.current.destroy();
      }

      const deckBreakdown = createDeckBreakdown(groupedCards)

      chartRef.current = new Chart(canvasRef.current, {
          type: 'pie',
          data: {
              labels: deckBreakdown.map(row => row.cardType),
              datasets: [
                  {
                      label: 'Your deck breakdown by type',
                      data: deckBreakdown.map(row => row.count)
                  }
              ]
          },
          options: {
            responsive: false,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    // Position of the legend: 'top', 'bottom', 'left', 'right', or 'chartArea'
                    position: 'bottom', // Example position
                    // Alignment of the legend: 'start', 'center', or 'end'
                    align: 'center', // Example alignment
                }
            }
        }
      });

  }, [groupedCards]);

  return <canvas id="manaCurve" ref={canvasRef} width={400} height={300} />;
};
