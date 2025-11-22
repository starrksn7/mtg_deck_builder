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
          }
      });

  }, [groupedCards]);

  return <canvas id="manaCurve" ref={canvasRef} />;
};
