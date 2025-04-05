// Modified api.js with CORS proxy for Klaviyo API
// This file handles all API connections to Klaviyo and OpenAI

// CORS proxy for Klaviyo API calls
const corsProxy = 'https://cors-anywhere.herokuapp.com/';

// API client for Klaviyo
class KlaviyoClient {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.baseUrl = 'https://a.klaviyo.com/api/';
        this.headers = {
            'Authorization': `Klaviyo-API-Key ${apiKey}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Revision': '2023-02-22'
        };
    }

    // Get metrics list
    async getMetrics() {
        try {
            const response = await fetch(`${corsProxy}${this.baseUrl}metrics`, {
                method: 'GET',
                headers: this.headers
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error fetching metrics:', error);
            throw new Error(`Klaviyo connection failed: ${error.message}`);
        }
    }

    // Get profiles
    async getProfiles(page = 1, pageSize = 50) {
        try {
            const response = await fetch(`${corsProxy}${this.baseUrl}profiles?page[size]=${pageSize}&page=${page}`, {
                method: 'GET',
                headers: this.headers
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error fetching profiles:', error);
            throw new Error(`Klaviyo connection failed: ${error.message}`);
        }
    }

    // Query metric aggregates
    async queryMetricAggregates(metricId, interval = 'day', startDate, endDate) {
        try {
            const body = {
                data: {
                    type: 'metric-aggregate-query',
                    attributes: {
                        metric_id: metricId,
                        interval: interval,
                        measurements: ['count', 'unique'],
                        dimensions: [],
                        filter: {
                            datetime: {
                                after: startDate,
                                before: endDate
                            }
                        }
                    }
                }
            };

            const response = await fetch(`${corsProxy}${this.baseUrl}metric-aggregates`, {
                method: 'POST',
                headers: this.headers,
                body: JSON.stringify(body)
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error querying metric aggregates:', error);
            throw new Error(`Klaviyo connection failed: ${error.message}`);
        }
    }

    // Test connection
    async testConnection() {
        try {
            const response = await fetch(`${corsProxy}${this.baseUrl}metrics?page[size]=1`, {
                method: 'GET',
                headers: this.headers
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            
            return { success: true, message: 'Klaviyo connection successful!' };
        } catch (error) {
            console.error('Error testing Klaviyo connection:', error);
            throw new Error(`Klaviyo connection failed: ${error.message}`);
        }
    }
}

// API client for OpenAI
class OpenAIClient {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.baseUrl = 'https://api.openai.com/v1/';
        this.headers = {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
        };
    }

    // Generate analysis from OpenAI
    async generateAnalysis(data, prompt) {
        try {
            const fullPrompt = `${prompt}\n\nData:\n${JSON.stringify(data, null, 2)}`;
            
            const body = {
                model: "gpt-4",
                messages: [
                    {
                        role: "system",
                        content: "You are an expert in analyzing e-commerce and marketing data. Provide insights and predictions based on the data provided."
                    },
                    {
                        role: "user",
                        content: fullPrompt
                    }
                ],
                temperature: 0.7,
                max_tokens: 1000
            };

            const response = await fetch(`${this.baseUrl}chat/completions`, {
                method: 'POST',
                headers: this.headers,
                body: JSON.stringify(body)
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            
            const result = await response.json();
            return result.choices[0].message.content;
        } catch (error) {
            console.error('Error generating analysis:', error);
            throw new Error(`OpenAI connection failed: ${error.message}`);
        }
    }

    // Test connection
    async testConnection() {
        try {
            const body = {
                model: "gpt-4",
                messages: [
                    {
                        role: "user",
                        content: "Hello, this is a test message. Please respond with 'OpenAI connection successful!'"
                    }
                ],
                temperature: 0.7,
                max_tokens: 50
            };

            const response = await fetch(`${this.baseUrl}chat/completions`, {
                method: 'POST',
                headers: this.headers,
                body: JSON.stringify(body)
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            
            return { success: true, message: 'OpenAI connection successful!' };
        } catch (error) {
            console.error('Error testing OpenAI connection:', error);
            throw new Error(`OpenAI connection failed: ${error.message}`);
        }
    }
}

// Export the API clients
window.KlaviyoClient = KlaviyoClient;
window.OpenAIClient = OpenAIClient;
