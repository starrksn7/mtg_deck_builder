import Chart from 'chart.js/auto'

export const PieChart = ({deckBreakdown}) => {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
      if (!canvasRef.current) return;

      if (chartRef.current) {
          chartRef.current.destroy();
      }

      chartRef.current = new Chart(canvasRef.current, {
          type: 'bar',
          data: {
              labels: manaValues.map(row => row.cardType),
              datasets: [
                  {
                      label: 'Your mana curve',
                      data: manaValues.map(row => row.count),
                      backgroundColor: '#4B80F4'
                  }
              ]
          }
      });

  }, [manaValues]);

  return <canvas id="manaCurve" ref={canvasRef} />;
};
