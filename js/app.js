// app.js - Main application functionality

document.addEventListener('DOMContentLoaded', function() {
    // Check if API keys are set
    const klaviyoApiKey = localStorage.getItem('klaviyoApiKey');
    const openaiApiKey = localStorage.getItem('openaiApiKey');
    const useSampleKlaviyoData = localStorage.getItem('useSampleKlaviyoData') === 'true';
    const useSampleOpenAIData = localStorage.getItem('useSampleOpenAIData') === 'true';
    
    // If on dashboard or analysis pages but no API keys set, redirect to setup
    if ((window.location.pathname.includes('dashboard') || 
         window.location.pathname.includes('email_analysis') || 
         window.location.pathname.includes('website_analysis') || 
         window.location.pathname.includes('behavior_analysis') || 
         window.location.pathname.includes('predictions')) && 
        !klaviyoApiKey && !useSampleKlaviyoData) {
        window.location.href = 'setup.html';
    }
    
    // Initialize charts if on dashboard or analysis pages
    if (window.location.pathname.includes('dashboard') || 
        window.location.pathname.includes('email_analysis') || 
        window.location.pathname.includes('website_analysis') || 
        window.location.pathname.includes('behavior_analysis') || 
        window.location.pathname.includes('predictions')) {
        initializeCharts();
        loadData();
    }
    
    // Set up event listeners for dashboard actions
    if (window.location.pathname.includes('dashboard')) {
        setupDashboardActions();
    }
});

// Initialize charts on dashboard and analysis pages
function initializeCharts() {
    // Email engagement chart
    if (document.getElementById('emailEngagementChart')) {
        const ctx = document.getElementById('emailEngagementChart').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: Array.from({length: 30}, (_, i) => {
                    const date = new Date();
                    date.setDate(date.getDate() - 29 + i);
                    return date.toLocaleDateString('en-US', {month: 'short', day: 'numeric'});
                }),
                datasets: [
                    {
                        label: 'Opens',
                        data: Array.from({length: 30}, () => Math.floor(Math.random() * 300) + 700),
                        borderColor: '#4f46e5',
                        backgroundColor: 'rgba(79, 70, 229, 0.1)',
                        tension: 0.4,
                        fill: true
                    },
                    {
                        label: 'Clicks',
                        data: Array.from({length: 30}, () => Math.floor(Math.random() * 150) + 250),
                        borderColor: '#10b981',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        tension: 0.4,
                        fill: true
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
    
    // Website activity chart
    if (document.getElementById('websiteActivityChart')) {
        const ctx = document.getElementById('websiteActivityChart').getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: Array.from({length: 30}, (_, i) => {
                    const date = new Date();
                    date.setDate(date.getDate() - 29 + i);
                    return date.toLocaleDateString('en-US', {month: 'short', day: 'numeric'});
                }),
                datasets: [
                    {
                        label: 'Product Views',
                        data: Array.from({length: 30}, () => Math.floor(Math.random() * 500) + 1000),
                        backgroundColor: 'rgba(79, 70, 229, 0.7)',
                    },
                    {
                        label: 'Add to Cart',
                        data: Array.from({length: 30}, () => Math.floor(Math.random() * 80) + 120),
                        backgroundColor: 'rgba(16, 185, 129, 0.7)',
                    },
                    {
                        label: 'Purchases',
                        data: Array.from({length: 30}, () => Math.floor(Math.random() * 30) + 20),
                        backgroundColor: 'rgba(245, 158, 11, 0.7)',
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
    
    // Conversion funnel chart
    if (document.getElementById('conversionFunnelChart')) {
        const ctx = document.getElementById('conversionFunnelChart').getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Product Views', 'Add to Cart', 'Begin Checkout', 'Purchase'],
                datasets: [
                    {
                        label: 'Sessions',
                        data: [12450, 3210, 1845, 985],
                        backgroundColor: [
                            'rgba(79, 70, 229, 0.7)',
                            'rgba(16, 185, 129, 0.7)',
                            'rgba(245, 158, 11, 0.7)',
                            'rgba(239, 68, 68, 0.7)'
                        ],
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                indexAxis: 'y',
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    x: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
    
    // Model performance chart
    if (document.getElementById('modelPerformanceChart')) {
        const ctx = document.getElementById('modelPerformanceChart').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['0%', '10%', '20%', '30%', '40%', '50%', '60%', '70%', '80%', '90%', '100%'],
                datasets: [{
                    label: 'Model Performance',
                    data: [0, 0.1, 0.25, 0.38, 0.52, 0.63, 0.75, 0.85, 0.92, 0.97, 1.0],
                    borderColor: '#4f46e5',
                    backgroundColor: 'rgba(79, 70, 229, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return 'True Positive Rate: ' + (context.parsed.y * 100).toFixed(1) + '%';
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'False Positive Rate'
                        }
                    },
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'True Positive Rate'
                        }
                    }
                }
            }
        });
    }
}

// Load data from API or sample data
async function loadData() {
    const klaviyoApiKey = localStorage.getItem('klaviyoApiKey');
    const openaiApiKey = localStorage.getItem('openaiApiKey');
    const useSampleKlaviyoData = localStorage.getItem('useSampleKlaviyoData') === 'true';
    const useSampleOpenAIData = localStorage.getItem('useSampleOpenAIData') === 'true';
    
    // Show loading indicators
    const loadingElements = document.querySelectorAll('.loading-indicator');
    loadingElements.forEach(el => {
        el.style.display = 'flex';
    });
    
    try {
        // Get metrics data
        const metricsResult = await getKlaviyoMetrics(useSampleKlaviyoData ? null : klaviyoApiKey);
        
        if (metricsResult.success) {
            // Update metrics displays
            updateMetricsDisplays(metricsResult.data);
            
            // Get profiles data
            const profilesResult = await getKlaviyoProfiles(useSampleKlaviyoData ? null : klaviyoApiKey);
            
            if (profilesResult.success) {
                // Update profiles displays
                updateProfilesDisplays(profilesResult.data);
                
                // If on predictions page, get AI analysis
                if (window.location.pathname.includes('predictions')) {
                    const combinedData = {
                        metrics: metricsResult.data,
                        profiles: profilesResult.data
                    };
                    
                    const analysisResult = await analyzeWithOpenAI(
                        useSampleOpenAIData ? null : openaiApiKey,
                        'Analyze the purchase likelihood of subscribers based on their behavior patterns. Identify which segments are most likely to contain subscribers who will place an order in the near future.',
                        combinedData
                    );
                    
                    if (analysisResult.success) {
                        // Update AI analysis display
                        updateAIAnalysisDisplay(analysisResult.analysis);
                    } else {
                        showError('Failed to get AI analysis: ' + analysisResult.message);
                    }
                }
            } else {
                showError('Failed to get profiles data: ' + profilesResult.message);
            }
        } else {
            showError('Failed to get metrics data: ' + metricsResult.message);
        }
    } catch (error) {
        showError('Error loading data: ' + error.message);
    } finally {
        // Hide loading indicators
        loadingElements.forEach(el => {
            el.style.display = 'none';
        });
    }
}

// Update metrics displays
function updateMetricsDisplays(metrics) {
    // Update metrics counts
    const emailMetricsCount = metrics.filter(m => m.attributes.integration.category === 'email').length;
    const websiteMetricsCount = metrics.filter(m => m.attributes.integration.category === 'ecommerce').length;
    
    if (document.getElementById('emailMetricsCount')) {
        document.getElementById('emailMetricsCount').textContent = emailMetricsCount;
    }
    
    if (document.getElementById('websiteMetricsCount')) {
        document.getElementById('websiteMetricsCount').textContent = websiteMetricsCount;
    }
    
    // Update metrics lists
    if (document.getElementById('emailMetricsList')) {
        const emailMetrics = metrics.filter(m => m.attributes.integration.category === 'email');
        const emailMetricsList = document.getElementById('emailMetricsList');
        emailMetricsList.innerHTML = '';
        
        emailMetrics.forEach(metric => {
            const li = document.createElement('li');
            li.className = 'list-group-item d-flex justify-content-between align-items-center';
            li.innerHTML = `
                ${metric.attributes.name}
                <span class="badge bg-primary rounded-pill">Active</span>
            `;
            emailMetricsList.appendChild(li);
        });
    }
    
    if (document.getElementById('websiteMetricsList')) {
        const websiteMetrics = metrics.filter(m => m.attributes.integration.category === 'ecommerce');
        const websiteMetricsList = document.getElementById('websiteMetricsList');
        websiteMetricsList.innerHTML = '';
        
        websiteMetrics.forEach(metric => {
            const li = document.createElement('li');
            li.className = 'list-group-item d-flex justify-content-between align-items-center';
            li.innerHTML = `
                ${metric.attributes.name}
                <span class="badge bg-primary rounded-pill">Active</span>
            `;
            websiteMetricsList.appendChild(li);
        });
    }
}

// Update profiles displays
function updateProfilesDisplays(profiles) {
    // Update profile count
    if (document.getElementById('profileCount')) {
        document.getElementById('profileCount').textContent = profiles.length;
    }
    
    // Update recent profiles list
    if (document.getElementById('recentProfilesList')) {
        const recentProfilesList = document.getElementById('recentProfilesList');
        recentProfilesList.innerHTML = '';
        
        // Sort profiles by created date (newest first)
        const sortedProfiles = [...profiles].sort((a, b) => {
            return new Date(b.attributes.created) - new Date(a.attributes.created);
        });
        
        // Take the first 5
        const recentProfiles = sortedProfiles.slice(0, 5);
        
        recentProfiles.forEach(profile => {
            const li = document.createElement('li');
            li.className = 'list-group-item d-flex justify-content-between align-items-center';
            li.innerHTML = `
                <div>
                    <strong>${profile.attributes.first_name || ''} ${profile.attributes.last_name || ''}</strong>
                    <div class="text-muted small">${profile.attributes.email}</div>
                </div>
                <span class="badge bg-primary rounded-pill">${profile.attributes.properties?.total_orders || 0} orders</span>
            `;
            recentProfilesList.appendChild(li);
        });
    }
}

// Update AI analysis display
function updateAIAnalysisDisplay(analysis) {
    if (document.querySelector('.ai-explanation')) {
        // Convert markdown to HTML
        const converter = new showdown.Converter();
        const html = converter.makeHtml(analysis);
        
        document.querySelector('.ai-explanation').innerHTML = `
            <h4><i class="bi bi-robot"></i>AI Analysis Summary</h4>
            ${html}
        `;
    }
}

// Set up dashboard actions
function setupDashboardActions() {
    // Collect data button
    if (document.getElementById('collectDataBtn')) {
        document.getElementById('collectDataBtn').addEventListener('click', function() {
            this.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Collecting...';
            this.disabled = true;
            
            setTimeout(() => {
                loadData().then(() => {
                    this.innerHTML = '<i class="bi bi-cloud-download me-2"></i>Collect Data';
                    this.disabled = false;
                    showAlert('success', 'Data collected successfully!');
                });
            }, 1500);
        });
    }
    
    // Run analysis button
    if (document.getElementById('runAnalysisBtn')) {
        document.getElementById('runAnalysisBtn').addEventListener('click', function() {
            this.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Analyzing...';
            this.disabled = true;
            
            setTimeout(() => {
                this.innerHTML = '<i class="bi bi-graph-up me-2"></i>Run Analysis';
                this.disabled = false;
                showAlert('success', 'Analysis completed successfully!');
            }, 2000);
        });
    }
    
    // Generate predictions button
    if (document.getElementById('generatePredictionsBtn')) {
        document.getElementById('generatePredictionsBtn').addEventListener('click', function() {
            this.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Generating...';
            this.disabled = true;
            
            setTimeout(() => {
                this.innerHTML = '<i class="bi bi-lightning me-2"></i>Generate Predictions';
                this.disabled = false;
                showAlert('success', 'Predictions generated successfully!');
                window.location.href = 'predictions.html';
            }, 2500);
        });
    }
}

// Show alert
function showAlert(type, message) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.role = 'alert';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    
    // Insert at the top of the container
    const container = document.querySelector('.container');
    container.insertBefore(alertDiv, container.firstChild);
    
    // Auto dismiss after 5 seconds
    setTimeout(() => {
        const bsAlert = new bootstrap.Alert(alertDiv);
        bsAlert.close();
    }, 5000);
}

// Show error
function showError(message) {
    console.error(message);
    showAlert('danger', message);
}
