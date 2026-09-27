document.addEventListener('DOMContentLoaded', () => {
    const isDark = document.documentElement.classList.contains('dark');
    
    // --- Chart.js Global Configuration ---
    Chart.defaults.font.family = 'Manrope';
    Chart.defaults.color = isDark ? '#94a3b8' : '#64748b';
    Chart.defaults.plugins.tooltip.backgroundColor = isDark ? '#1e293b' : '#ffffff';
    Chart.defaults.plugins.tooltip.titleColor = isDark ? '#f8fafc' : '#0f172a';
    Chart.defaults.plugins.tooltip.bodyColor = isDark ? '#94a3b8' : '#64748b';
    Chart.defaults.plugins.tooltip.borderColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
    Chart.defaults.plugins.tooltip.borderWidth = 1;
    Chart.defaults.plugins.tooltip.padding = 12;
    Chart.defaults.plugins.tooltip.cornerRadius = 12;

    const colors = {
        primary: '#0B5D3B',
        secondary: '#1FA774',
        accent: '#B7E778',
        grid: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'
    };
    
    // --- Impact Simulation Chart (`#impact-chart`) ---
    const impactChartCtx = document.getElementById('impact-chart')?.getContext('2d');
    if (impactChartCtx) {
        const gradient = impactChartCtx.createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, 'rgba(31, 167, 116, 0.2)');
        gradient.addColorStop(1, 'rgba(31, 167, 116, 0)');

        window.impactChart = new Chart(impactChartCtx, {
            type: 'line',
            data: {
                labels: ['0%', '20%', '40%', '60%', '80%', '100%'],
                datasets: [
                    {
                        label: 'Temperature (°C)',
                        data: [25.1, 24.2, 23.3, 22.4, 21.5, 20.6],
                        borderColor: colors.primary,
                        backgroundColor: 'transparent',
                        borderWidth: 4,
                        pointBackgroundColor: colors.primary,
                        pointRadius: 0,
                        pointHoverRadius: 6,
                        tension: 0.4,
                        yAxisID: 'y'
                    },
                    {
                        label: 'AQI Index',
                        data: [85, 77, 69, 61, 53, 45],
                        borderColor: colors.secondary,
                        backgroundColor: 'transparent',
                        borderWidth: 4,
                        pointBackgroundColor: colors.secondary,
                        pointRadius: 0,
                        pointHoverRadius: 6,
                        tension: 0.4,
                        yAxisID: 'y1'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: {
                    duration: 2500,
                    easing: 'easeInOutQuart'
                },
                interaction: {
                    mode: 'index',
                    intersect: false,
                },
                scales: {
                    x: {
                        grid: { display: false },
                        ticks: { font: { size: 10 } }
                    },
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        grid: { color: colors.grid },
                        ticks: { font: { size: 10 } }
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        grid: { display: false },
                        ticks: { font: { size: 10 } }
                    }
                },
                plugins: {
                    legend: {
                        display: true,
                        position: 'bottom',
                        labels: { usePointStyle: true, padding: 20, font: { size: 12, weight: '600' } }
                    }
                }
            }
        });
    }

    // --- Dashboard Temperature Trend Chart (`#temp-trend-chart`) ---
    const tempTrendCtx = document.getElementById('temp-trend-chart')?.getContext('2d');
    if (tempTrendCtx) {
        const gradient = tempTrendCtx.createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, isDark ? 'rgba(31, 167, 116, 0.4)' : 'rgba(11, 93, 59, 0.2)');
        gradient.addColorStop(1, 'rgba(31, 167, 116, 0)');

        window.tempTrendChart = new Chart(tempTrendCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                datasets: [{
                    label: 'Avg. Temp',
                    data: [18, 19, 21, 23, 25, 28, 31, 30, 27, 24, 20, 18],
                    borderColor: colors.secondary,
                    backgroundColor: gradient,
                    fill: true,
                    tension: 0.4,
                    borderWidth: 3,
                    pointRadius: 0,
                    pointHoverRadius: 6,
                    pointHoverBorderWidth: 2,
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: colors.secondary,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                drawOnChartArea: true,
                animation: {
                    duration: 3000,
                    easing: 'easeOutQuart'
                },
                scales: { 
                    y: { 
                        grid: { color: colors.grid, drawBorder: false }, 
                        ticks: { font: { size: 10, weight: '600' }, padding: 10 } 
                    },
                    x: { 
                        grid: { display: false }, 
                        ticks: { font: { size: 10, weight: '600' }, padding: 10 } 
                    }
                },
                plugins: { 
                    legend: { display: false },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        backgroundColor: isDark ? 'rgba(30, 41, 59, 0.9)' : 'rgba(255, 255, 255, 0.9)',
                        backdropFilter: 'blur(8px)',
                        displayColors: false,
                        callbacks: {
                            label: (ctx) => `${ctx.parsed.y}°C`
                        }
                    }
                }
            }
        });
    }

    // --- Dashboard Vegetation Coverage Chart (`#vegetation-pie-chart`) ---
    const vegPieCtx = document.getElementById('vegetation-pie-chart')?.getContext('2d');
    if (vegPieCtx) {
        new Chart(vegPieCtx, {
            type: 'doughnut',
            data: {
                labels: ['Trees', 'Grass', 'Shrubs', 'Non-Green'],
                datasets: [{
                    label: 'Coverage',
                    data: [42, 28, 12, 18],
                    backgroundColor: [colors.primary, colors.secondary, colors.accent, isDark ? '#1e293b' : '#f1f5f9'],
                    hoverBackgroundColor: [colors.primary, colors.secondary, colors.accent, isDark ? '#334155' : '#e2e8f0'],
                    borderWidth: 0,
                    hoverOffset: 15,
                    borderRadius: 8,
                    spacing: 5
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '80%',
                animation: {
                    animateScale: true,
                    animateRotate: true,
                    duration: 2500,
                    easing: 'easeOutElastic'
                },
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { 
                            usePointStyle: true, 
                            pointStyle: 'circle',
                            padding: 25, 
                            font: { size: 11, weight: '600' },
                            color: isDark ? '#94a3b8' : '#64748b'
                        }
                    },
                    tooltip: {
                        backgroundColor: isDark ? 'rgba(30, 41, 59, 0.9)' : 'rgba(255, 255, 255, 0.9)',
                        titleColor: isDark ? '#f8fafc' : '#0f172a',
                        bodyColor: isDark ? '#94a3b8' : '#64748b',
                        padding: 12,
                        cornerRadius: 12,
                        displayColors: true,
                        usePointStyle: true
                    }
                }
            }
        });
    }

});
