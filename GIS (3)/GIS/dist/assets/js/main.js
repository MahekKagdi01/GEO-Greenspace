document.addEventListener('DOMContentLoaded', () => {

    // --- Dark Mode Toggle ---
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const htmlElement = document.documentElement;

    // Check for saved dark mode preference
    if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        htmlElement.classList.add('dark');
    } else {
        htmlElement.classList.remove('dark');
    }

    if(darkModeToggle) {
        darkModeToggle.addEventListener('click', () => {
            htmlElement.classList.toggle('dark');
            // Save preference to localStorage
            if (htmlElement.classList.contains('dark')) {
                localStorage.setItem('theme', 'dark');
            } else {
                localStorage.setItem('theme', 'light');
            }
        });
    }

    // === Real-time location + weather + AQI integration ===
    async function getLocationAndData() {
        if (!navigator.geolocation) {
            console.error('Geolocation not supported by this browser.');
            return;
        }

        navigator.geolocation.getCurrentPosition(async (position) => {
            try {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                console.log('Location:', lat, lon);

                const weather = await getWeatherData(lat, lon);
                const aqi = await getAirQuality(lat, lon);

                if (weather && typeof weather.temp === 'number') {
                    updateUI(weather.temp, aqi);
                }
            } catch (err) {
                console.error('Error in getLocationAndData:', err);
            }
        }, (error) => {
            console.error('Geolocation error:', error);
            alert('Location access denied or unavailable. Please enable geolocation for the best experience.');
        });
    }

    async function getWeatherData(lat, lon) {
        const apiKey = 'ee53583d198bbd674ea20938e8457235';
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;

        try {
            const res = await fetch(url);
            if (!res.ok) throw new Error(`Weather API status ${res.status}`);
            const data = await res.json();

            console.log('Weather Data:', data);

            return {
                temp: data?.main?.temp ?? null,
                raw: data
            };
        } catch (error) {
            console.error('Weather API Error:', error);
            return null;
        }
    }

    async function getAirQuality(lat, lon) {
        const apiKey = 'ee53583d198bbd674ea20938e8457235';
        const url = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`;

        try {
            const res = await fetch(url);
            if (!res.ok) throw new Error(`Air Pollution API status ${res.status}`);
            const data = await res.json();

            const apiScore = data?.list?.[0]?.main?.aqi;
            let aqiValue;
            switch (apiScore) {
                case 1: aqiValue = 40; break; // Good
                case 2: aqiValue = 80; break; // Fair
                case 3: aqiValue = 120; break; // Moderate
                case 4: aqiValue = 170; break; // Poor
                case 5: aqiValue = 240; break; // Very Poor
                default: aqiValue = null;
            }

            return aqiValue || Math.floor(Math.random() * 80) + 75;
        } catch (error) {
            console.warn('AQI lookup failed, using fallback estimate.', error);
            return Math.floor(Math.random() * 80) + 75;
        }
    }

    function calculatePlantationIndex(temp) {
        if (typeof temp !== 'number' || Number.isNaN(temp)) return 'N/A';
        if (temp >= 35) return '2/10';
        if (temp >= 30) return '4/10';
        if (temp >= 25) return '6/10';
        if (temp >= 20) return '8/10';
        return '9/10';
    }

    function updateUI(temp, airQuality) {
        const tempElement = document.getElementById('metric-temp');
        const aqiElement = document.getElementById('metric-aqi');
        const plantElement = document.getElementById('metric-cooling');

        if (tempElement) tempElement.innerText = (typeof temp === 'number' ? `${temp.toFixed(1)}°C` : 'N/A');
        if (aqiElement) aqiElement.innerText = (typeof airQuality === 'number' ? `${airQuality}` : 'N/A');
        if (plantElement) plantElement.innerText = calculatePlantationIndex(temp);

        console.log('UI updated: temp=', temp, 'aqi=', airQuality);
    }

    // Start once, after DOM is ready
    getLocationAndData();

    // --- Impact Simulation Slider ---

    // --- Impact Simulation Slider ---
    const plantationSlider = document.getElementById('plantation-slider');
    const sliderVal = document.getElementById('slider-value');
    const simTemp = document.getElementById('sim-temp');
    const simAqi = document.getElementById('sim-aqi');
    const simComfort = document.getElementById('sim-comfort');

    const updateSimulation = (value) => {
        const percentage = value / 100;
        
        if(sliderVal) sliderVal.textContent = `${value}%`;

        // Get current location baseline
        const selectedLoc = document.getElementById('location-selector')?.value || 'India';
        const base = locationData[selectedLoc] || locationData['India'];

        // Calculate new values for the specific location
        const targetTemp = (base.temp - percentage * 5.2).toFixed(1);
        const targetAQI = Math.round(base.aqi - percentage * 45);
        const targetComfort = Math.min(10, Math.round((base.cooling/2) + percentage * 5.5));

        // GSAP for smooth number animation
        if(simTemp) {
            gsap.to(simTemp, { 
                innerText: targetTemp, 
                duration: 0.4, 
                snap: { innerText: 0.1 }, 
                onUpdate: function() {
                    this.targets()[0].innerText = this.targets()[0].innerText + "°C";
                }
            });
        }
        if(simAqi) {
            gsap.to(simAqi, { 
                innerText: targetAQI, 
                duration: 0.4, 
                snap: { innerText: 1 } 
            });
        }
        if(simComfort) {
            gsap.to(simComfort, { 
                innerText: targetComfort, 
                duration: 0.4, 
                snap: { innerText: 1 }, 
                onUpdate: function() {
                    this.targets()[0].innerText = this.targets()[0].innerText + "/10";
                }
            });
        }
        
        // Update Chart data visualization point
        if (window.impactChart) {
            // Log it for verification as in existing charts.js
            console.log(`Simulation updated to ${value}%`);
        }
    };
    
    if (plantationSlider) {
        plantationSlider.addEventListener('input', (e) => {
            updateSimulation(e.target.value);
        });
        // Initial call to set values
        updateSimulation(plantationSlider.value);
    }

    // --- Dynamic Location Data ---
    const locationData = {
        "India": { 
            name: "India",
            temp: 27.4, ndvi: 0.54, aqi: 112, cooling: 6.8, 
            coords: [20.5937, 78.9629], zoom: 5,
            trend: [20, 23, 28, 34, 37, 35, 30, 29, 29, 28, 25, 21] 
        },
        "Mumbai": { 
            name: "Mumbai, Maharashtra",
            temp: 29.1, ndvi: 0.48, aqi: 135, cooling: 6.1, 
            coords: [19.0760, 72.8777], zoom: 11,
            trend: [24, 25, 27, 29, 31, 30, 28, 27, 27, 28, 27, 25] 
        },
        "New Delhi": { 
            name: "New Delhi, Delhi",
            temp: 31.2, ndvi: 0.42, aqi: 168, cooling: 5.4, 
            coords: [28.6139, 77.2090], zoom: 11,
            trend: [14, 18, 24, 32, 38, 37, 32, 30, 30, 26, 20, 15] 
        },
        "Bengaluru": { 
            name: "Bengaluru, Karnataka",
            temp: 25.3, ndvi: 0.62, aqi: 74, cooling: 7.9, 
            coords: [12.9716, 77.5946], zoom: 11,
            trend: [21, 23, 26, 28, 27, 24, 23, 23, 23, 24, 23, 21] 
        },
        "Chennai": { 
            name: "Chennai, Tamil Nadu",
            temp: 30.4, ndvi: 0.46, aqi: 121, cooling: 6.0, 
            coords: [13.0827, 80.2707], zoom: 11,
            trend: [25, 26, 28, 31, 33, 33, 31, 30, 30, 29, 27, 25] 
        },
        "Ahmedabad": { 
            name: "Ahmedabad, Gujarat",
            temp: 33.0, ndvi: 0.38, aqi: 149, cooling: 5.1, 
            coords: [23.0225, 72.5714], zoom: 11,
            trend: [20, 23, 29, 35, 40, 38, 32, 30, 31, 31, 27, 22] 
        },
        "Kolkata": { 
            name: "Kolkata, West Bengal",
            temp: 30.1, ndvi: 0.50, aqi: 138, cooling: 6.3, 
            coords: [22.5726, 88.3639], zoom: 11,
            trend: [20, 23, 28, 32, 34, 33, 30, 30, 30, 29, 25, 21] 
        },
        "Jaipur": { 
            name: "Jaipur, Rajasthan",
            temp: 32.2, ndvi: 0.41, aqi: 142, cooling: 5.6, 
            coords: [26.9124, 75.7873], zoom: 11,
            trend: [15, 19, 25, 33, 39, 38, 32, 30, 30, 27, 21, 16] 
        }
    };

    const locationSelector = document.getElementById('location-selector');
    if (locationSelector) {
        locationSelector.addEventListener('change', (e) => {
            const city = e.target.value;
            const data = locationData[city];
            if (!data) return;

            // Update Header & Metrics
            document.getElementById('region-name').innerText = data.name;
            document.getElementById('metric-temp').innerText = `${data.temp}°C`;
            document.getElementById('metric-ndvi').innerText = data.ndvi;
            document.getElementById('metric-aqi').innerText = data.aqi;
            document.getElementById('metric-cooling').innerText = `${data.cooling}/10`;

            // Update Chart
            if (window.tempTrendChart) {
                window.tempTrendChart.data.datasets[0].data = data.trend;
                window.tempTrendChart.update();
            }

            // Update Map
            if (window.map) {
                window.map.flyTo(data.coords, data.zoom, {
                    duration: 1.5
                });
            }

            // Update simulation based on new location baseline
            if (plantationSlider) {
                updateSimulation(plantationSlider.value);
            }
        });
    }

    // --- Export Report Functionality ---
    const exportBtn = document.getElementById('export-report-btn');
    if (exportBtn) {
        exportBtn.addEventListener('click', async () => {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF('p', 'mm', 'a4');
            
            const region = document.getElementById('region-name')?.innerText || 'India';
            const temp = document.getElementById('metric-temp')?.innerText || '27.4°C';
            const ndvi = document.getElementById('metric-ndvi')?.innerText || '0.54';
            const aqi = document.getElementById('metric-aqi')?.innerText || '112';
            const cooling = document.getElementById('metric-cooling')?.innerText || '6.8/10';
            const date = new Date().toLocaleDateString();

            // 1. HEADER SECTION
            doc.setFillColor(11, 93, 59); // #0B5D3B
            doc.rect(0, 0, 210, 40, 'F');
            
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(22);
            doc.setFont('helvetica', 'bold');
            doc.text('GreenScape AI Environmental Report', 15, 20);
            
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            doc.text('GIS Based Green Space Optimization Analysis', 15, 28);
            
            doc.setFontSize(9);
            doc.text(`Report Generated: ${date}`, 160, 20);

            // Accent Line
            doc.setDrawColor(183, 231, 120); // #B7E778
            doc.setLineWidth(1.5);
            doc.line(0, 40, 210, 40);

            // 2. LOCATION INFO CARD
            doc.setFillColor(248, 250, 252); // Light slate
            doc.setDrawColor(226, 232, 240);
            doc.setLineWidth(0.2);
            doc.roundedRect(15, 50, 180, 25, 3, 3, 'FD');

            doc.setTextColor(50, 50, 50);
            doc.setFontSize(9);
            doc.setFont('helvetica', 'bold');
            doc.text('Location:', 25, 60);
            doc.text('Analysis Type:', 25, 66);
            doc.text('Generated By:', 25, 72);

            doc.setFont('helvetica', 'normal');
            doc.text(region, 55, 60);
            doc.text('Urban Heat Island Assessment', 55, 66);
            doc.text('GreenScape AI Engine v2.4', 55, 72);

            // 3. METRICS SECTION (GRID)
            const drawMetricBox = (x, y, label, value, status, statusColor) => {
                doc.setDrawColor(226, 232, 240);
                doc.setLineWidth(0.1);
                doc.roundedRect(x, y, 85, 35, 2, 2, 'D');
                
                doc.setFontSize(8);
                doc.setTextColor(100, 100, 100);
                doc.setFont('helvetica', 'bold');
                doc.text(label.toUpperCase(), x + 10, y + 10);
                
                doc.setFontSize(20);
                doc.setTextColor(11, 93, 59);
                doc.text(value, x + 10, y + 22);
                
                doc.setFontSize(8);
                doc.setTextColor(statusColor[0], statusColor[1], statusColor[2]);
                doc.text(status, x + 10, y + 30);
            };

            // Grid Layout 2x2
            drawMetricBox(15, 85, 'Average Temperature', temp, 'Moderately High', [185, 28, 28]);
            drawMetricBox(110, 85, 'NDVI Index', ndvi, 'Vegetation Moderate', [21, 128, 61]);
            drawMetricBox(15, 130, 'AQI Score', aqi, 'Unhealthy for Sensitive Groups', [185, 28, 28]);
            drawMetricBox(110, 130, 'Cooling Potential', cooling, 'Needs Improvement', [234, 179, 8]);

            // 4. CHART SECTION
            doc.setTextColor(15, 23, 42);
            doc.setFontSize(14);
            doc.setFont('helvetica', 'bold');
            doc.text('Temperature Trend (Last 12 Months)', 15, 180);

            const chartCanvas = document.getElementById('temp-trend-chart');
            if (chartCanvas) {
                try {
                    const canvasImg = chartCanvas.toDataURL('image/png', 1.0);
                    doc.setDrawColor(226, 232, 240);
                    doc.rect(15, 185, 180, 50); // Chart Border
                    doc.addImage(canvasImg, 'PNG', 18, 188, 174, 44);
                } catch (e) {
                    console.error('Chart capture failed', e);
                }
            }

            // 5. RECOMMENDATIONS SECTION
            doc.setFontSize(14);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(15, 23, 42);
            doc.text('Strategic Recommendations', 15, 245);

            doc.setFontSize(9);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(50, 50, 50);
            const recommendations = [
                '• Increase roadside tree density along primary corridors',
                '• Introduce urban micro-forests in high-priority zones',
                '• Improve permeable surface coverage to reduce runoff',
                '• Prioritize green infrastructure in zones where AQI > 100'
            ];
            
            recommendations.forEach((rec, index) => {
                doc.text(rec, 20, 255 + (index * 6));
            });

            // 6. FOOTER
            doc.setDrawColor(226, 232, 240);
            doc.setLineWidth(0.5);
            doc.line(15, 280, 195, 280);

            doc.setFontSize(8);
            doc.setTextColor(150, 150, 150);
            doc.text('GreenScape AI — Sustainable Planning Intelligence', 105, 285, { align: 'center' });
            doc.setTextColor(31, 167, 116);
            doc.text('www.greenscape-ai.local', 105, 290, { align: 'center' });

            doc.save(`GreenScape_Report_${region.replace(/\s/g, '_')}.pdf`);
        });
    }
    
});

// --- OPTIMIZATION WORKFLOW ---
document.addEventListener('DOMContentLoaded', () => {
    const optimizeBtn = document.getElementById('optimize-zones-btn');
    const toastContainer = document.getElementById('toast-container');
    const cards = document.querySelectorAll('.glass-panel');
    const closePanelBtn = document.getElementById('close-recommendations');

    if (!optimizeBtn) return;

    // Close panel logic
    if (closePanelBtn) {
        closePanelBtn.onclick = () => {
            document.getElementById('recommendation-panel').classList.remove('panel-show');
            if (window.recommendationMarkers) {
                window.recommendationMarkers.forEach(m => m.remove());
                window.recommendationMarkers = [];
            }
        };
    }

    const generateRecommendedZones = () => {
        const panel = document.getElementById('recommendation-panel');
        const list = document.getElementById('zones-list');
        if (!panel || !list) return;

        // Clear previous
        list.innerHTML = '';
        if (window.recommendationMarkers) {
            window.recommendationMarkers.forEach(m => m.remove());
        }
        window.recommendationMarkers = [];

        const zoneCount = Math.floor(Math.random() * 5) + 5; 
        const center = window.map.getCenter();
        const types = ['Residential', 'Commercial', 'Industrial', 'Roadside', 'Open Land'];
        const priorities = [
            { label: 'High', class: 'priority-high' },
            { label: 'Medium', class: 'priority-medium' },
            { label: 'Low', class: 'priority-low' }
        ];

        for (let i = 0; i < zoneCount; i++) {
            const zoneId = String.fromCharCode(65 + i) + (Math.floor(Math.random() * 9) + 1);
            const type = types[Math.floor(Math.random() * types.length)];
            const priority = priorities[Math.floor(Math.random() * priorities.length)];
            const impact = (Math.random() * (1.2 - 0.3) + 0.3).toFixed(1);
            
            const item = document.createElement('div');
            item.className = 'zone-item group';
            item.innerHTML = `
                <div class="flex justify-between items-start mb-1">
                    <span class="font-bold text-primary dark:text-accent">Zone ${zoneId}</span>
                    <span class="text-[10px] opacity-60 uppercase tracking-tighter">${type}</span>
                </div>
                <div class="flex justify-between items-center">
                    <div class="flex items-center text-xs">
                        <span class="priority-dot ${priority.class}"></span>
                        <span>${priority.label} Priority</span>
                    </div>
                    <span class="text-xs font-semibold text-secondary">−${impact}°C Impact</span>
                </div>
            `;

            const latOffset = (Math.random() - 0.5) * 0.12;
            const lngOffset = (Math.random() - 0.5) * 0.12;
            const markerPos = [center.lat + latOffset, center.lng + lngOffset];
            
            const icon = L.divIcon({
                className: 'pulse-marker-wrapper',
                iconSize: [28, 28],
                iconAnchor: [14, 14]
            });

            const marker = L.marker(markerPos, { icon }).addTo(window.map);
            marker.bindPopup(`
                <div class="p-2">
                    <div class="font-bold text-green-800">Zone ${zoneId}</div>
                    <div class="text-xs text-gray-600">${type}</div>
                    <div class="mt-1 pt-1 border-t text-sm font-bold text-green-700">Impact: -${impact}°C</div>
                </div>
            `);

            window.recommendationMarkers.push(marker);

            item.onclick = () => {
                document.querySelectorAll('.zone-item').forEach(z => z.classList.remove('zone-active'));
                item.classList.add('zone-active');
                window.map.flyTo(markerPos, 14, { duration: 1 });
                marker.openPopup();
            };

            setTimeout(() => {
                list.appendChild(item);
                gsap.from(item, { opacity: 0, x: 20, duration: 0.5 });
            }, i * 150);
        }

        panel.classList.add('panel-show');
    };

    optimizeBtn.addEventListener('click', () => {
        const originalText = optimizeBtn.innerHTML;
        optimizeBtn.classList.add('btn-loading');
        optimizeBtn.innerHTML = '<span class="spinner"></span> Optimizing...';
        
        cards.forEach(card => card.classList.add('dashboard-dimmed'));

        setTimeout(() => {
            optimizeBtn.classList.remove('btn-loading');
            optimizeBtn.innerHTML = originalText;
            cards.forEach(card => card.classList.remove('dashboard-dimmed'));

            const tempEl = document.getElementById('metric-temp');
            const ndviEl = document.getElementById('metric-ndvi');
            const aqiEl = document.getElementById('metric-aqi');
            const coolingEl = document.getElementById('metric-cooling');
            
            if (!tempEl) return;

            const currentTemp = parseFloat(tempEl.innerText);
            const currentNDVI = parseFloat(ndviEl.innerText);
            const currentAQI = parseInt(aqiEl.innerText);
            const currentCooling = parseFloat(coolingEl.innerText);

            const deltaTemp = (Math.random() * (2.2 - 0.5) + 0.5);
            const deltaNDVI = (Math.random() * (0.12 - 0.02) + 0.02);
            const deltaAQI = Math.round(Math.random() * (18 - 4) + 4);
            const deltaCooling = (Math.random() * (1.5 - 0.3) + 0.3);

            const animateMetric = (el, id, start, target, format) => {
                const obj = { val: start };
                gsap.to(obj, {
                    val: target,
                    duration: 2,
                    ease: 'power2.out',
                    onUpdate: () => {
                        if (format === 'temp') el.innerText = obj.val.toFixed(1) + '°C';
                        if (format === 'ndvi') el.innerText = obj.val.toFixed(2);
                        if (format === 'aqi') el.innerText = Math.round(obj.val);
                        if (format === 'cooling') el.innerText = obj.val.toFixed(1) + '/10';
                    }
                });
            };

            animateMetric(tempEl, 'metric-temp', currentTemp - deltaTemp, 'temp');
            animateMetric(ndviEl, 'metric-ndvi', currentNDVI + deltaNDVI, 'ndvi');
            animateMetric(aqiEl, 'metric-aqi', currentAQI - deltaAQI, 'aqi');
            animateMetric(coolingEl, 'metric-cooling', Math.min(10, currentCooling + deltaCooling), 'cooling');

            // --- Extended: Generate Recommended Zones ---
            generateRecommendedZones();

            if (window.tempTrendChart) {
                const newData = window.tempTrendChart.data.datasets[0].data.map(v => v - (Math.random() * 1.5 + 0.5));
                window.tempTrendChart.data.datasets[0].data = newData;
                window.tempTrendChart.update();
            }

            const toast = document.createElement('div');
            toast.className = 'toast-item';
            toast.innerHTML = '<span>✨</span> Optimization Complete — ' + (window.recommendationMarkers?.length || 7) + ' new green zones recommended';
            toastContainer.appendChild(toast);

            setTimeout(() => {
                toast.classList.add('toast-exit');
                setTimeout(() => toast.remove(), 400);
            }, 4000);

        }, 2500);
    });
getLocationAndData();
});
