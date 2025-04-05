// api.js - Handles API connections to Klaviyo and OpenAI

// Klaviyo API functions
async function testKlaviyoConnection(apiKey) {
    try {
        // Make a simple request to Klaviyo API to test the connection
        const response = await fetch('https://a.klaviyo.com/api/metrics', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Klaviyo-API-Key ${apiKey}`
            }
        });
        
        const data = await response.json();
        
        if (response.ok) {
            return { success: true, data };
        } else {
            return { success: false, message: data.detail || 'Unknown error' };
        }
    } catch (error) {
        return { success: false, message: error.message };
    }
}

async function getKlaviyoMetrics(apiKey) {
    if (!apiKey) {
        return getSampleKlaviyoMetrics();
    }
    
    try {
        const response = await fetch('https://a.klaviyo.com/api/metrics', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Klaviyo-API-Key ${apiKey}`
            }
        });
        
        const data = await response.json();
        
        if (response.ok) {
            return { success: true, data: data.data };
        } else {
            return { success: false, message: data.detail || 'Unknown error' };
        }
    } catch (error) {
        return { success: false, message: error.message };
    }
}

async function getKlaviyoProfiles(apiKey, limit = 50) {
    if (!apiKey) {
        return getSampleKlaviyoProfiles();
    }
    
    try {
        const response = await fetch(`https://a.klaviyo.com/api/profiles?page[size]=${limit}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Klaviyo-API-Key ${apiKey}`
            }
        });
        
        const data = await response.json();
        
        if (response.ok) {
            return { success: true, data: data.data };
        } else {
            return { success: false, message: data.detail || 'Unknown error' };
        }
    } catch (error) {
        return { success: false, message: error.message };
    }
}

async function getKlaviyoMetricAggregates(apiKey, metricId, interval = 'day', startDate, endDate) {
    if (!apiKey) {
        return getSampleKlaviyoMetricAggregates(metricId);
    }
    
    try {
        // Format dates for API
        const start = startDate ? new Date(startDate).toISOString() : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
        const end = endDate ? new Date(endDate).toISOString() : new Date().toISOString();
        
        const response = await fetch(`https://a.klaviyo.com/api/metric-aggregates?filter=equals(metric_id,"${metricId}")&metric=count&interval=${interval}&page[size]=100&sort=datetime&filter=greater-equals(datetime,"${start}")&filter=less-equals(datetime,"${end}")`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Klaviyo-API-Key ${apiKey}`
            }
        });
        
        const data = await response.json();
        
        if (response.ok) {
            return { success: true, data: data.data };
        } else {
            return { success: false, message: data.detail || 'Unknown error' };
        }
    } catch (error) {
        return { success: false, message: error.message };
    }
}

// OpenAI API functions
async function testOpenAIConnection(apiKey) {
    try {
        // Make a simple request to OpenAI API to test the connection
        const response = await fetch('https://api.openai.com/v1/models', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${apiKey}`
            }
        });
        
        const data = await response.json();
        
        if (response.ok) {
            return { success: true, data };
        } else {
            return { success: false, message: data.error?.message || 'Unknown error' };
        }
    } catch (error) {
        return { success: false, message: error.message };
    }
}

async function analyzeWithOpenAI(apiKey, prompt, data) {
    if (!apiKey) {
        return getSampleOpenAIAnalysis(prompt);
    }
    
    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-4',
                messages: [
                    {
                        role: 'system',
                        content: 'You are an expert in analyzing e-commerce and email marketing data. Your task is to analyze user behavior patterns and identify which subscribers are most likely to make a purchase based on their engagement metrics.'
                    },
                    {
                        role: 'user',
                        content: `${prompt}\n\nData: ${JSON.stringify(data)}`
                    }
                ],
                temperature: 0.3
            })
        });
        
        const result = await response.json();
        
        if (response.ok) {
            return { 
                success: true, 
                analysis: result.choices[0].message.content 
            };
        } else {
            return { success: false, message: result.error?.message || 'Unknown error' };
        }
    } catch (error) {
        return { success: false, message: error.message };
    }
}

// Sample data functions for demo mode
function getSampleKlaviyoMetrics() {
    return {
        success: true,
        data: [
            {
                id: 'abc123',
                type: 'metric',
                attributes: {
                    name: 'Opened Email',
                    integration: {
                        name: 'Klaviyo',
                        category: 'email'
                    },
                    created: '2023-01-15T12:00:00Z',
                    updated: '2023-01-15T12:00:00Z'
                }
            },
            {
                id: 'def456',
                type: 'metric',
                attributes: {
                    name: 'Clicked Email',
                    integration: {
                        name: 'Klaviyo',
                        category: 'email'
                    },
                    created: '2023-01-15T12:00:00Z',
                    updated: '2023-01-15T12:00:00Z'
                }
            },
            {
                id: 'ghi789',
                type: 'metric',
                attributes: {
                    name: 'Placed Order',
                    integration: {
                        name: 'Shopify',
                        category: 'ecommerce'
                    },
                    created: '2023-01-15T12:00:00Z',
                    updated: '2023-01-15T12:00:00Z'
                }
            },
            {
                id: 'jkl012',
                type: 'metric',
                attributes: {
                    name: 'Added to Cart',
                    integration: {
                        name: 'Shopify',
                        category: 'ecommerce'
                    },
                    created: '2023-01-15T12:00:00Z',
                    updated: '2023-01-15T12:00:00Z'
                }
            },
            {
                id: 'mno345',
                type: 'metric',
                attributes: {
                    name: 'Viewed Product',
                    integration: {
                        name: 'Shopify',
                        category: 'ecommerce'
                    },
                    created: '2023-01-15T12:00:00Z',
                    updated: '2023-01-15T12:00:00Z'
                }
            }
        ]
    };
}

function getSampleKlaviyoProfiles() {
    return {
        success: true,
        data: Array.from({ length: 50 }, (_, i) => ({
            id: `profile${i}`,
            type: 'profile',
            attributes: {
                email: `user${i}@example.com`,
                first_name: ['John', 'Jane', 'Michael', 'Emma', 'William', 'Olivia', 'James', 'Sophia'][Math.floor(Math.random() * 8)],
                last_name: ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Miller', 'Davis', 'Garcia'][Math.floor(Math.random() * 8)],
                created: new Date(Date.now() - Math.floor(Math.random() * 365) * 24 * 60 * 60 * 1000).toISOString(),
                updated: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
                properties: {
                    total_orders: Math.floor(Math.random() * 5),
                    total_spent: Math.floor(Math.random() * 500) + 50,
                    last_order_date: new Date(Date.now() - Math.floor(Math.random() * 60) * 24 * 60 * 60 * 1000).toISOString(),
                    email_open_rate: Math.random() * 0.8 + 0.1,
                    email_click_rate: Math.random() * 0.5 + 0.05
                }
            }
        }))
    };
}

function getSampleKlaviyoMetricAggregates(metricId) {
    const metricNames = {
        'abc123': 'Opened Email',
        'def456': 'Clicked Email',
        'ghi789': 'Placed Order',
        'jkl012': 'Added to Cart',
        'mno345': 'Viewed Product'
    };
    
    const metricName = metricNames[metricId] || 'Unknown Metric';
    
    // Generate 30 days of data
    const data = Array.from({ length: 30 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - 29 + i);
        
        let value;
        switch (metricId) {
            case 'abc123': // Opened Email
                value = Math.floor(Math.random() * 300) + 700;
                break;
            case 'def456': // Clicked Email
                value = Math.floor(Math.random() * 150) + 250;
                break;
            case 'ghi789': // Placed Order
                value = Math.floor(Math.random() * 30) + 20;
                break;
            case 'jkl012': // Added to Cart
                value = Math.floor(Math.random() * 80) + 120;
                break;
            case 'mno345': // Viewed Product
                value = Math.floor(Math.random() * 500) + 1000;
                break;
            default:
                value = Math.floor(Math.random() * 100) + 100;
        }
        
        return {
            id: `agg${i}`,
            type: 'metric-aggregate',
            attributes: {
                metric_id: metricId,
                metric_name: metricName,
                datetime: date.toISOString(),
                value: value
            }
        };
    });
    
    return {
        success: true,
        data: data
    };
}

function getSampleOpenAIAnalysis(prompt) {
    // Predefined analyses based on prompt keywords
    if (prompt.includes('purchase likelihood')) {
        return {
            success: true,
            analysis: `# Purchase Likelihood Analysis

Based on the provided data, I've identified several key patterns that indicate purchase likelihood:

## Key Findings

1. **Email Engagement Correlation**: Subscribers with an open rate above 40% and a click rate above 15% are 3.8x more likely to make a purchase within 30 days.

2. **Website Behavior Indicators**: The strongest predictors of purchase are:
   - Viewing the same product multiple times (2.5x higher conversion)
   - Adding items to cart (4.2x higher conversion)
   - Viewing pricing pages (1.8x higher conversion)

3. **Cross-Channel Patterns**: Subscribers who engage with both email campaigns and website content have a 68% higher purchase rate than those who engage with only one channel.

## Recommended High-Value Segments

1. **Cart Abandoners**: Subscribers who added items to cart but didn't purchase (35% predicted conversion rate)
2. **Active Email Clickers**: Subscribers who clicked on product-related emails in the last 14 days (28% predicted conversion rate)
3. **Frequent Site Visitors**: Subscribers who visited the site 3+ times in the last 7 days (22% predicted conversion rate)

## Individual Subscriber Predictions

I've identified the following subscribers as having the highest purchase likelihood:

1. Emma Smith (emma.smith@gmail.com) - 90% likelihood
   - Clicked on 5 product emails in the last week
   - Added items to cart 3 times
   - Viewed 12 products in the last 3 days
   - Previous purchaser (2 orders)

2. Liam Johnson (liam.johnson@yahoo.com) - 85% likelihood
   - Abandoned cart yesterday
   - Returned to website today
   - High email engagement (62% open rate)
   - Previous purchaser (1 order)

3. Olivia Williams (olivia.williams@hotmail.com) - 82% likelihood
   - Viewed same product 4 times
   - Clicked on 3 product emails
   - Added to cart twice
   - New subscriber (high engagement)

These subscribers should be prioritized for targeted marketing efforts to maximize conversion potential.`
        };
    } else if (prompt.includes('email engagement')) {
        return {
            success: true,
            analysis: `# Email Engagement Analysis

Based on the provided data, I've analyzed the email engagement patterns across your subscriber base:

## Overall Engagement Metrics

- **Average Open Rate**: 32.4% (industry average: 21.5%)
- **Average Click Rate**: 4.8% (industry average: 2.3%)
- **Click-to-Open Rate**: 14.8% (industry average: 10.7%)
- **Unsubscribe Rate**: 0.2% (industry average: 0.3%)

Your email performance is significantly above industry averages, particularly in open rates and click rates.

## Engagement Patterns

1. **Time of Day**: Highest engagement occurs between 8-10am and 7-9pm, with morning emails showing 23% higher open rates.

2. **Day of Week**: Tuesday and Thursday show the highest engagement rates, while Saturday has the lowest.

3. **Subject Line Analysis**: 
   - Subject lines with personalization show 18% higher open rates
   - Subject lines with questions show 12% higher open rates
   - Subject lines with emojis show mixed results (positive for promotional content, negative for informational content)

4. **Content Type Performance**:
   - Product announcements: 38.2% open rate, 5.7% click rate
   - Promotional emails: 35.7% open rate, 6.2% click rate
   - Educational content: 41.3% open rate, 4.1% click rate
   - Cart abandonment: 45.8% open rate, 8.9% click rate

## Subscriber Segments by Engagement

1. **Highly Engaged** (28% of subscribers):
   - Open rate > 50%
   - Click rate > 10%
   - Consistent engagement across campaigns

2. **Moderately Engaged** (42% of subscribers):
   - Open rate 20-50%
   - Click rate 2-10%
   - Intermittent engagement

3. **Low Engagement** (30% of subscribers):
   - Open rate < 20%
   - Click rate < 2%
   - Minimal or declining engagement

## Recommendations

1. **Segment Targeting**: Create dedicated re-engagement campaigns for the Low Engagement segment.

2. **Timing Optimization**: Schedule important campaigns during peak engagement times (Tuesday/Thursday mornings).

3. **Content Strategy**: Increase the frequency of cart abandonment and educational content emails, which show the highest engagement.

4. **Subject Line Testing**: Implement A/B testing with personalized question-based subject lines to maximize open rates.`
        };
    } else if (prompt.includes('website activity')) {
        return {
            success: true,
            analysis: `# Website Activity Analysis

Based on the provided data, I've analyzed the website activity patterns and conversion funnel:

## Conversion Funnel Analysis

1. **Product Views**: 12,450 sessions
2. **Add to Cart**: 3,210 sessions (25.8% conversion from product view)
3. **Begin Checkout**: 1,845 sessions (57.5% conversion from add to cart)
4. **Purchase**: 985 sessions (53.4% conversion from begin checkout)

**Overall Conversion Rate**: 7.9% (product view to purchase)

## Key Drop-off Points

1. **Product View to Add to Cart**: 74.2% drop-off
   - Primary reasons: Price concerns, insufficient product information, comparison shopping

2. **Add to Cart to Begin Checkout**: 42.5% drop-off
   - Primary reasons: Shipping costs, account creation requirement, payment method limitations

3. **Begin Checkout to Purchase**: 46.6% drop-off
   - Primary reasons: Technical issues, payment failures, last-minute price comparisons

## User Behavior Patterns

1. **Browsing Patterns**:
   - Average pages per session: 4.3
   - Average session duration: 5:12 minutes
   - Most viewed categories: [Category 1], [Category 2], [Category 3]
   - Most viewed products: [Product 1], [Product 2], [Product 3]

2. **Device Usage**:
   - Mobile: 58% of sessions (5.2% conversion rate)
   - Desktop: 36% of sessions (12.8% conversion rate)
   - Tablet: 6% of sessions (8.5% conversion rate)

3. **Traffic Sources**:
   - Email: 32% of sessions (11.3% conversion rate)
   - Direct: 28% of sessions (9.2% conversion rate)
   - Organic search: 22% of sessions (6.5% conversion rate)
   - Social media: 12% of sessions (4.8% conversion rate)
   - Paid search: 6% of sessions (8.7% conversion rate)

## User Segments by Behavior

1. **Purchasers** (7.9% of visitors):
   - View 6.2 pages on average
   - Spend 8:45 minutes on site
   - 68% return within 30 days

2. **Cart Abandoners** (18.0% of visitors):
   - View 5.1 pages on average
   - Spend 6:32 minutes on site
   - 42% return within 30 days

3. **Browsers** (74.1% of visitors):
   - View 3.2 pages on average
   - Spend 3:45 minutes on site
   - 24% return within 30 days

## Recommendations

1. **Optimize Mobile Experience**: Focus on improving mobile conversion rates through streamlined checkout and improved page load times.

2. **Implement Cart Recovery**: Target cart abandoners with personalized email campaigns highlighting abandoned items.

3. **Enhance Product Pages**: Add more detailed product information, customer reviews, and related product recommendations to improve add-to-cart rates.

4. **Simplify Checkout Process**: Reduce form fields, add guest checkout option, and expand payment methods to reduce checkout abandonment.`
        };
    } else {
        return {
            success: true,
            analysis: `# Subscriber Behavior Analysis

Based on the provided data, I've analyzed the behavior patterns of your subscribers to identify those most likely to purchase:

## Key Behavior Indicators

1. **Email Engagement Metrics**:
   - Subscribers with consistent email opens (>40% open rate) are 2.3x more likely to purchase
   - Click-through behavior on product-related emails is the strongest email indicator of purchase intent
   - Subscribers who engage with both promotional and educational content have 1.8x higher conversion rates

2. **Website Activity Patterns**:
   - Multiple product views in a single session correlates strongly with purchase intent
   - Cart additions, even without purchase, indicate 3.5x higher likelihood of future purchase
   - Returning visitors who view the same product multiple times show 4.2x higher conversion rates

3. **Cross-Channel Behavior**:
   - Subscribers who engage across both email and website have the highest purchase rates
   - The sequence of email click → website visit → product view → cart addition is the most predictive pattern
   - Time between email engagement and website activity is inversely correlated with purchase likelihood

## High-Value Subscriber Segments

Based on these patterns, I've identified three high-value segments with the greatest purchase potential:

1. **Active Browsers** (28% predicted conversion rate):
   - High email engagement (>50% open rate)
   - Multiple website visits in the past 14 days
   - At least one cart addition

2. **Recent Cart Abandoners** (35% predicted conversion rate):
   - Added products to cart within the past 7 days
   - Did not complete purchase
   - Returned to website at least once after abandonment

3. **Engaged New Subscribers** (22% predicted conversion rate):
   - Subscribed within the past 30 days
   - Opened >60% of emails received
   - Clicked through to website at least once

## Individual Purchase Likelihood

The subscribers with the highest individual purchase likelihood are:

1. Emma Smith (emma.smith@gmail.com) - 90% likelihood
   - Clicked on 5 product emails in the last week
   - Added items to cart 3 times
   - Viewed 12 products in the last 3 days
   - Previous purchaser (2 orders)

2. Liam Johnson (liam.johnson@yahoo.com) - 85% likelihood
   - Abandoned cart yesterday
   - Returned to website today
   - High email engagement (62% open rate)
   - Previous purchaser (1 order)

3. Olivia Williams (olivia.williams@hotmail.com) - 82% likelihood
   - Viewed same product 4 times
   - Clicked on 3 product emails
   - Added to cart twice
   - New subscriber (high engagement)

## Recommended Actions

1. **Targeted Email Campaign**: Create a personalized offer for the "Recent Cart Abandoners" segment with a limited-time discount on abandoned items.

2. **Retargeting Strategy**: Implement website retargeting ads for the "Active Browsers" segment featuring products they've viewed multiple times.

3. **Welcome Sequence Enhancement**: Optimize the welcome sequence for new subscribers to encourage website visits and first purchase.

4. **High-Value Nurturing**: Develop a specialized nurturing sequence for the top 5% of subscribers by purchase likelihood score.`
        };
    }
}
