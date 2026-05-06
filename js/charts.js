// ============================================================
//  Nomadic Ecology — charts.js
//  Chart.js initializations — called lazily by main.js
// ============================================================

// ---- Global defaults ----
Chart.defaults.color = '#5B6E8C';
Chart.defaults.borderColor = 'rgba(27,54,105,0.10)';
Chart.defaults.font.family = "'Space Mono', monospace";
Chart.defaults.font.size = 10;

// Shared tooltip style
const tooltipStyle = {
  backgroundColor: '#1B3669',
  borderColor: 'rgba(62,119,195,0.4)',
  borderWidth: 1,
  titleColor: '#93b8f0',
  bodyColor: '#e8eaf0',
  padding: 10,
  cornerRadius: 6,
};

// ============================================================
//  Section 1 Charts
// ============================================================
function initSection1Charts() {

  // ----------------------------------------------------------
  //  Chart 1 · Global Temperature Anomaly (line)
  // ----------------------------------------------------------
  const ctxTemp = document.getElementById('chart-temp');
  if (ctxTemp && !ctxTemp._chartInstance) {
    const chart = new Chart(ctxTemp, {
      type: 'line',
      data: {
        labels: ['2015','2016','2017','2018','2019','2020','2021','2022','2023','2024','2025'],
        datasets: [
          {
            label: 'Temp. anomaly (°C)',
            data: [0.87, 1.01, 0.92, 0.83, 0.98, 1.02, 0.85, 0.89, 1.17, 1.55, 1.44],
            borderColor: '#E85A1A',
            backgroundColor: function(ctx) {
              const chart = ctx.chart;
              const { ctx: c, chartArea } = chart;
              if (!chartArea) return 'transparent';
              const gradient = c.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
              gradient.addColorStop(0, 'rgba(232,90,26,0.22)');
              gradient.addColorStop(1, 'rgba(232,90,26,0.0)');
              return gradient;
            },
            borderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6,
            pointBackgroundColor: '#E85A1A',
            pointBorderColor: '#FFFFFF',
            pointBorderWidth: 1.5,
            tension: 0.4,
            fill: true,
          },
          // 1.5°C threshold line
          {
            label: '1.5°C threshold',
            data: Array(11).fill(1.5),
            borderColor: 'rgba(200,138,0,0.65)',
            borderWidth: 1,
            borderDash: [5, 4],
            pointRadius: 0,
            fill: false,
            tension: 0,
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 800, easing: 'easeOutQuart' },
        plugins: {
          legend: {
            display: true,
            position: 'bottom',
            labels: { boxWidth: 10, padding: 10, font: { size: 9 } }
          },
          tooltip: {
            ...tooltipStyle,
            callbacks: {
              label: ctx => `  Anomaly: +${ctx.raw}°C`
            }
          }
        },
        scales: {
          x: {
            grid: { color: 'rgba(27,54,105,0.08)' },
            ticks: { font: { size: 9 } }
          },
          y: {
            grid: { color: 'rgba(27,54,105,0.08)' },
            ticks: {
              font: { size: 9 },
              callback: v => `+${v}°C`
            },
            min: 0.5
          }
        }
      }
    });
    ctxTemp._chartInstance = chart;
  }

  // ----------------------------------------------------------
  //  Chart 2 · Sea Level Rise Rate (bar)
  // ----------------------------------------------------------
  const ctxSea = document.getElementById('chart-sea');
  if (ctxSea && !ctxSea._chartInstance) {
    const chart = new Chart(ctxSea, {
      type: 'bar',
      data: {
        labels: [['1993', '–2002'], ['2003', '–2014'], ['2015', '–2024']],
        datasets: [{
          label: 'Mean rise rate (mm/yr)',
          data: [2.1, 3.3, 4.7],
          backgroundColor: [
            'rgba(62,119,195,0.35)',
            'rgba(62,119,195,0.60)',
            'rgba(62,119,195,0.90)',
          ],
          borderColor: '#3E77C3',
          borderWidth: 1,
          borderRadius: 4,
          hoverBackgroundColor: '#3E77C3',
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 800, easing: 'easeOutQuart' },
        plugins: {
          legend: { display: false },
          tooltip: {
            ...tooltipStyle,
            callbacks: {
              label: ctx => `  Rate: ${ctx.raw} mm/yr`
            }
          }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { font: { size: 9 } }
          },
          y: {
            grid: { color: 'rgba(27,54,105,0.08)' },
            ticks: {
              font: { size: 9 },
              callback: v => `${v} mm`
            },
            max: 6
          }
        }
      }
    });
    ctxSea._chartInstance = chart;
  }

  // ----------------------------------------------------------
  //  Chart 3 · Antarctic Station Population (grouped bar)
  // ----------------------------------------------------------
  const ctxStation = document.getElementById('chart-station');
  if (ctxStation && !ctxStation._chartInstance) {
    const preset = antarcticResearchPopulationData.chart_presets.station_seasonal_population;
    const chart = new Chart(ctxStation, {
      type: 'bar',
      data: {
        labels: preset.labels,
        datasets: [
          {
            label: 'Summer',
            data: preset.summer,
            backgroundColor: 'rgba(62,119,195,0.75)',
            borderColor: '#3E77C3',
            borderWidth: 1,
            borderRadius: 3,
            hoverBackgroundColor: '#3E77C3',
          },
          {
            label: 'Winter',
            data: preset.winter,
            backgroundColor: 'rgba(232,90,26,0.55)',
            borderColor: '#E85A1A',
            borderWidth: 1,
            borderRadius: 3,
            hoverBackgroundColor: '#E85A1A',
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 900, easing: 'easeOutQuart' },
        plugins: {
          legend: {
            display: true,
            position: 'bottom',
            labels: { boxWidth: 10, padding: 10, font: { size: 9 } }
          },
          tooltip: {
            ...tooltipStyle,
            callbacks: {
              label: ctx => `  ${ctx.dataset.label}: ${ctx.raw} persons`
            }
          }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { font: { size: 8 } }
          },
          y: {
            grid: { color: 'rgba(27,54,105,0.08)' },
            ticks: {
              font: { size: 9 },
              callback: v => `${v}`
            }
          }
        }
      }
    });
    ctxStation._chartInstance = chart;
  }
}
