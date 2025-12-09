// Market data and intelligence engine
const marketData = {
    'b2b-smb': { size: 125, growth: 1.15, competition: 0.7, avgCAC: 450 },
    'b2b-enterprise': { size: 450, growth: 1.12, competition: 0.85, avgCAC: 2500 },
    'b2c': { size: 890, growth: 1.22, competition: 0.9, avgCAC: 75 },
    'b2b2c': { size: 320, growth: 1.28, competition: 0.75, avgCAC: 850 },
    'developers': { size: 85, growth: 1.35, competition: 0.8, avgCAC: 120 },
    'marketers': { size: 95, growth: 1.18, competition: 0.82, avgCAC: 180 },
    'designers': { size: 65, growth: 1.25, competition: 0.65, avgCAC: 95 },
    'other': { size: 150, growth: 1.10, competition: 0.7, avgCAC: 200 }
};

const pricingMultipliers = {
    'freemium': { conversion: 0.05, churn: 0.08 },
    'subscription': { conversion: 0.12, churn: 0.06 },
    'usage-based': { conversion: 0.15, churn: 0.07 },
    'one-time': { conversion: 0.08, churn: 0.02 },
    'tiered': { conversion: 0.14, churn: 0.05 }
};

// Form submission handler
document.getElementById('validator-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('idea-name').value,
        description: document.getElementById('idea-description').value,
        targetMarket: document.getElementById('target-market').value,
        pricingModel: document.getElementById('pricing-model').value,
        monthlyPrice: parseFloat(document.getElementById('monthly-price').value),
        devTime: parseInt(document.getElementById('dev-time').value),
        competitors: document.getElementById('competitors').value
    };
    
    // Scroll to results
    document.getElementById('results-section').classList.remove('hidden');
    document.getElementById('results-section').scrollIntoView({ behavior: 'smooth', block: 'start' });
    
    // Simulate analysis delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Calculate and display results
    calculateValidation(formData);
});

function calculateValidation(data) {
    const market = marketData[data.targetMarket];
    const pricing = pricingMultipliers[data.pricingModel];
    
    // Calculate overall score (0-100)
    const marketScore = Math.min(100, (market.size / 10) + (market.growth * 20));
    const pricingScore = (pricing.conversion * 500) + ((1 - pricing.churn) * 50);
    const competitionScore = (1 - market.competition) * 100;
    const speedScore = Math.max(0, 100 - (data.devTime * 5));
    
    const hasCompetitors = data.competitors && data.competitors.trim().length > 0;
    const competitorPenalty = hasCompetitors ? 10 : 0;
    
    const overallScore = Math.round(
        (marketScore * 0.3) + 
        (pricingScore * 0.25) + 
        (competitionScore * 0.25) + 
        (speedScore * 0.2) - 
        competitorPenalty
    );
    
    // Revenue projections
    const marketPenetration = pricing.conversion * (1 - market.competition);
    const year1Customers = Math.round(marketPenetration * 1000 * (1 / data.devTime));
    const monthlyRevenue = year1Customers * data.monthlyPrice;
    const year1Revenue = monthlyRevenue * 12;
    
    // Display overall score
    updateOverallScore(overallScore);
    
    // Display metrics
    updateMetrics(market, data, monthlyRevenue, year1Customers);
    
    // Generate revenue projections
    generateRevenueProjections(data, year1Revenue, pricing.churn, market.growth);
    
    // Generate insights
    generateInsights(overallScore, data, market, hasCompetitors);
}

function updateOverallScore(score) {
    const scoreElement = document.getElementById('overall-score');
    const progressCircle = document.getElementById('score-progress');
    const verdictTitle = document.getElementById('verdict-title');
    const verdictDesc = document.getElementById('verdict-description');
    
    // Animate score
    let currentScore = 0;
    const increment = score / 50;
    const scoreInterval = setInterval(() => {
        currentScore += increment;
        if (currentScore >= score) {
            currentScore = score;
            clearInterval(scoreInterval);
        }
        scoreElement.textContent = Math.round(currentScore);
    }, 30);
    
    // Update progress circle
    const circumference = 326.73;
    const offset = circumference - (score / 100) * circumference;
    progressCircle.style.strokeDashoffset = offset;
    
    // Add gradient to SVG
    const svg = progressCircle.closest('svg');
    if (!svg.querySelector('defs')) {
        const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
        gradient.setAttribute('id', 'score-gradient');
        gradient.setAttribute('x1', '0%');
        gradient.setAttribute('y1', '0%');
        gradient.setAttribute('x2', '100%');
        gradient.setAttribute('y2', '100%');
        
        const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
        stop1.setAttribute('offset', '0%');
        stop1.setAttribute('stop-color', '#667eea');
        
        const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
        stop2.setAttribute('offset', '100%');
        stop2.setAttribute('stop-color', '#764ba2');
        
        gradient.appendChild(stop1);
        gradient.appendChild(stop2);
        defs.appendChild(gradient);
        svg.insertBefore(defs, svg.firstChild);
    }
    
    // Update verdict
    if (score >= 80) {
        verdictTitle.textContent = '🚀 Exceptional Opportunity!';
        verdictDesc.textContent = 'Your idea shows strong market fit with excellent revenue potential. This is a highly viable business opportunity worth pursuing.';
    } else if (score >= 60) {
        verdictTitle.textContent = '✅ Strong Potential';
        verdictDesc.textContent = 'Your idea has solid fundamentals. With proper execution and market positioning, this could be a successful venture.';
    } else if (score >= 40) {
        verdictTitle.textContent = '⚠️ Needs Refinement';
        verdictDesc.textContent = 'Your idea has potential but requires significant refinement. Consider pivoting your approach or target market.';
    } else {
        verdictTitle.textContent = '❌ High Risk';
        verdictDesc.textContent = 'This idea faces significant challenges. We recommend reconsidering your approach or exploring alternative opportunities.';
    }
}

function updateMetrics(market, data, monthlyRevenue, customers) {
    // Revenue projection
    document.getElementById('revenue-projection').textContent = 
        `$${(monthlyRevenue / 1000).toFixed(1)}K`;
    
    // Market size
    document.getElementById('market-size').textContent = 
        `$${market.size}B`;
    
    const marketTrend = document.getElementById('market-trend');
    if (market.growth > 1.2) {
        marketTrend.innerHTML = '<span>↗</span> High growth market';
        marketTrend.classList.add('positive');
    } else if (market.growth > 1.1) {
        marketTrend.innerHTML = '<span>→</span> Growing market';
    } else {
        marketTrend.innerHTML = '<span>→</span> Stable market';
    }
    
    // Competition level
    const competitionLevel = document.getElementById('competition-level');
    const competitionDetail = document.getElementById('competition-detail');
    
    if (market.competition < 0.6) {
        competitionLevel.textContent = 'Low';
        competitionDetail.innerHTML = '<span>✓</span> Excellent opportunity';
        competitionDetail.classList.add('positive');
    } else if (market.competition < 0.8) {
        competitionLevel.textContent = 'Medium';
        competitionDetail.innerHTML = '<span>→</span> Competitive but viable';
    } else {
        competitionLevel.textContent = 'High';
        competitionDetail.innerHTML = '<span>!</span> Saturated market';
        competitionDetail.classList.add('negative');
    }
    
    // Time to market
    document.getElementById('time-to-market').textContent = 
        `${data.devTime} months`;
    
    const speedVerdict = document.getElementById('speed-verdict');
    if (data.devTime <= 3) {
        speedVerdict.innerHTML = '<span>⚡</span> Fast to market';
        speedVerdict.classList.add('positive');
    } else if (data.devTime <= 6) {
        speedVerdict.innerHTML = '<span>→</span> Average timeline';
    } else {
        speedVerdict.innerHTML = '<span>!</span> Long development';
        speedVerdict.classList.add('negative');
    }
}

function generateRevenueProjections(data, year1Revenue, churn, growth) {
    const projectionDetails = document.getElementById('projection-details');
    projectionDetails.innerHTML = '';
    
    const periods = [
        { label: 'Year 1', multiplier: 1 },
        { label: 'Year 2', multiplier: growth * (1 - churn * 0.5) },
        { label: 'Year 3', multiplier: growth * growth * (1 - churn * 0.3) },
        { label: 'Year 5', multiplier: Math.pow(growth, 4) * (1 - churn * 0.1) }
    ];
    
    periods.forEach(period => {
        const revenue = year1Revenue * period.multiplier;
        const item = document.createElement('div');
        item.className = 'projection-item';
        item.innerHTML = `
            <span class="projection-label">${period.label} ARR</span>
            <span class="projection-value">$${(revenue / 1000000).toFixed(2)}M</span>
        `;
        projectionDetails.appendChild(item);
    });
    
    // Simple bar chart visualization
    const canvas = document.getElementById('revenue-canvas');
    if (canvas) {
        drawRevenueChart(canvas, periods, year1Revenue);
    }
}

function drawRevenueChart(canvas, periods, baseRevenue) {
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth * 2;
    canvas.height = canvas.offsetHeight * 2;
    ctx.scale(2, 2);
    
    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;
    const padding = 40;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;
    
    const maxRevenue = baseRevenue * Math.max(...periods.map(p => p.multiplier));
    const barWidth = chartWidth / periods.length / 1.5;
    const spacing = chartWidth / periods.length;
    
    // Draw bars
    periods.forEach((period, i) => {
        const revenue = baseRevenue * period.multiplier;
        const barHeight = (revenue / maxRevenue) * chartHeight;
        const x = padding + i * spacing + (spacing - barWidth) / 2;
        const y = padding + chartHeight - barHeight;
        
        // Gradient
        const gradient = ctx.createLinearGradient(x, y, x, y + barHeight);
        gradient.addColorStop(0, '#667eea');
        gradient.addColorStop(1, '#764ba2');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(x, y, barWidth, barHeight);
        
        // Label
        ctx.fillStyle = '#a1a1aa';
        ctx.font = '11px Inter';
        ctx.textAlign = 'center';
        ctx.fillText(period.label, x + barWidth / 2, height - 10);
    });
}

function generateInsights(score, data, market, hasCompetitors) {
    // Strengths
    const strengthsList = document.getElementById('strengths-list');
    strengthsList.innerHTML = '';
    
    const strengths = [];
    
    if (market.growth > 1.2) {
        strengths.push('High-growth market with strong tailwinds');
    }
    if (market.competition < 0.7) {
        strengths.push('Low competition creates opportunity for market leadership');
    }
    if (data.monthlyPrice >= 50) {
        strengths.push('Premium pricing supports healthy unit economics');
    }
    if (data.devTime <= 4) {
        strengths.push('Fast time-to-market enables quick validation');
    }
    if (!hasCompetitors) {
        strengths.push('Potential blue ocean opportunity with limited direct competition');
    }
    
    strengths.forEach(strength => {
        const li = document.createElement('li');
        li.textContent = strength;
        strengthsList.appendChild(li);
    });
    
    // Challenges
    const challengesList = document.getElementById('challenges-list');
    challengesList.innerHTML = '';
    
    const challenges = [];
    
    if (market.competition > 0.8) {
        challenges.push('Highly competitive market requires strong differentiation');
    }
    if (data.monthlyPrice < 20) {
        challenges.push('Low pricing may limit profitability and scalability');
    }
    if (data.devTime > 6) {
        challenges.push('Extended development timeline increases market risk');
    }
    if (hasCompetitors) {
        challenges.push('Established competitors may have strong market position');
    }
    if (market.avgCAC > data.monthlyPrice * 2) {
        challenges.push('Customer acquisition costs may challenge unit economics');
    }
    
    challenges.forEach(challenge => {
        const li = document.createElement('li');
        li.textContent = challenge;
        challengesList.appendChild(li);
    });
    
    // Recommendations
    const recommendationsList = document.getElementById('recommendations-list');
    recommendationsList.innerHTML = '';
    
    const recommendations = [];
    
    if (score >= 70) {
        recommendations.push('Build an MVP and launch within 60 days to validate assumptions');
        recommendations.push('Focus on a narrow niche initially to build traction');
        recommendations.push('Establish thought leadership through content marketing');
    } else if (score >= 50) {
        recommendations.push('Conduct customer interviews to refine your value proposition');
        recommendations.push('Consider pivoting to a less saturated market segment');
        recommendations.push('Test pricing strategies to optimize conversion');
    } else {
        recommendations.push('Explore adjacent markets with better dynamics');
        recommendations.push('Reconsider your core differentiator and unique value');
        recommendations.push('Build a smaller proof-of-concept before full development');
    }
    
    if (data.pricingModel === 'freemium') {
        recommendations.push('Design a compelling upgrade path from free to paid tiers');
    }
    
    if (market.competition > 0.75) {
        recommendations.push('Identify a specific vertical or use case where you can dominate');
    }
    
    recommendations.forEach(recommendation => {
        const li = document.createElement('li');
        li.textContent = recommendation;
        recommendationsList.appendChild(li);
    });
}

// Upgrade button handlers
document.getElementById('upgrade-btn').addEventListener('click', () => {
    alert('🚀 Upgrade to Pro for only $29/month!\n\nIncludes:\n✓ Unlimited validations\n✓ Detailed competitor analysis\n✓ Customer acquisition blueprints\n✓ 5-year financial models\n✓ Priority support\n\nComing soon!');
});

document.querySelectorAll('.btn-upgrade').forEach(btn => {
    btn.addEventListener('click', () => {
        alert('🚀 Upgrade to Pro for only $29/month!\n\nIncludes:\n✓ Unlimited validations\n✓ Detailed competitor analysis\n✓ Customer acquisition blueprints\n✓ 5-year financial models\n✓ Priority support\n\nComing soon!');
    });
});

document.getElementById('pricing-btn').addEventListener('click', () => {
    alert('💎 Pricing Plans:\n\n🆓 Free: 3 validations/month\n💫 Pro: $29/month - Unlimited validations + advanced features\n🚀 Team: $99/month - Up to 10 users + collaboration tools\n\nSign up coming soon!');
});

// Add some interactivity to form inputs
const inputs = document.querySelectorAll('input, textarea, select');
inputs.forEach(input => {
    input.addEventListener('focus', (e) => {
        e.target.parentElement.style.transform = 'translateY(-2px)';
    });
    
    input.addEventListener('blur', (e) => {
        e.target.parentElement.style.transform = 'translateY(0)';
    });
});

// Animate stats on page load
window.addEventListener('load', () => {
    const statValues = document.querySelectorAll('.stat-value');
    statValues.forEach((stat, index) => {
        stat.style.opacity = '0';
        setTimeout(() => {
            stat.style.transition = 'opacity 0.6s ease';
            stat.style.opacity = '1';
        }, index * 100);
    });
});
