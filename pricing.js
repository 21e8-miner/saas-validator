// Pricing configuration
const STRIPE_PUBLISHABLE_KEY = 'pk_test_YOUR_KEY_HERE'; // TODO: Replace with actual key
const PRICING = {
    pro: {
        monthly: { price: 29, priceId: 'price_pro_monthly' },
        annual: { price: 23, priceId: 'price_pro_annual' }
    },
    team: {
        monthly: { price: 99, priceId: 'price_team_monthly' },
        annual: { price: 79, priceId: 'price_team_annual' }
    }
};

// Initialize Stripe (uncomment when you have a key)
// const stripe = Stripe(STRIPE_PUBLISHABLE_KEY);

let isAnnual = false;

// Billing toggle
document.getElementById('billing-toggle').addEventListener('change', (e) => {
    isAnnual = e.target.checked;
    updatePricing();
});

function updatePricing() {
    const monthlyPrices = document.querySelectorAll('.monthly-price');
    const annualPrices = document.querySelectorAll('.annual-price');

    if (isAnnual) {
        monthlyPrices.forEach(el => el.classList.add('hidden'));
        annualPrices.forEach(el => el.classList.remove('hidden'));
    } else {
        monthlyPrices.forEach(el => el.classList.remove('hidden'));
        annualPrices.forEach(el => el.classList.add('hidden'));
    }
}

// Handle plan selection
document.querySelectorAll('[data-plan]').forEach(button => {
    button.addEventListener('click', async () => {
        const plan = button.dataset.plan;
        const billingPeriod = isAnnual ? 'annual' : 'monthly';

        // Check if user is logged in
        const user = localStorage.getItem('saas_validator_user');
        if (!user) {
            window.location.href = 'auth.html?redirect=pricing';
            return;
        }

        // TODO: Implement actual Stripe checkout
        await handleCheckout(plan, billingPeriod);
    });
});

async function handleCheckout(plan, billingPeriod) {
    const priceId = PRICING[plan][billingPeriod].priceId;
    const amount = PRICING[plan][billingPeriod].price;

    // For now, simulate successful payment
    alert(`🎉 Upgrade to ${plan.toUpperCase()} plan!\n\nPrice: $${amount}/${billingPeriod === 'annual' ? 'year' : 'month'}\n\nStripe integration coming soon!`);

    /* 
    TODO: Implement real Stripe checkout
    
    try {
        const response = await fetch('/api/create-checkout-session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ priceId, plan, billingPeriod })
        });
        
        const session = await response.json();
        
        // Redirect to Stripe Checkout
        const result = await stripe.redirectToCheckout({
            sessionId: session.id
        });
        
        if (result.error) {
            alert(result.error.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Payment failed. Please try again.');
    }
    */
}

// Add some CSS for the pricing page
const style = document.createElement('style');
style.textContent = `
    .auth-container {
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 40px 20px;
    }
    
    .auth-card {
        max-width: 450px;
        width: 100%;
        background: var(--bg-card);
        backdrop-filter: blur(20px);
        border: 1px solid var(--border-color);
        border-radius: var(--radius-xl);
        padding: 48px;
        box-shadow: var(--shadow-lg);
    }
    
    .logo-center {
        text-align: center;
        margin-bottom: 32px;
    }
    
    .logo-center svg {
        margin: 0 auto 16px;
    }
    
    .logo-center h1 {
        font-family: var(--font-display);
        font-size: 28px;
        background: var(--primary-gradient);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
    }
    
    .auth-tabs {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 8px;
        margin-bottom: 32px;
        padding: 4px;
        background: var(--bg-secondary);
        border-radius: var(--radius-md);
    }
    
    .auth-tab {
        padding: 12px;
        background: transparent;
        border: none;
        color: var(--text-secondary);
        font-weight: 600;
        border-radius: var(--radius-sm);
        cursor: pointer;
        transition: all var(--transition-base);
    }
    
    .auth-tab.active {
        background: var(--primary-gradient);
        color: white;
    }
    
    .auth-form {
        display: none;
    }
    
    .auth-form.active {
        display: block;
    }
    
    .auth-divider {
        text-align: center;
        margin: 24px 0;
        position: relative;
    }
    
    .auth-divider::before {
        content: '';
        position: absolute;
        left: 0;
        top: 50%;
        width: 100%;
        height: 1px;
        background: var(--border-color);
    }
    
    .auth-divider span {
        position: relative;
        padding: 0 16px;
        background: var(--bg-card);
        color: var(--text-muted);
        font-size: 14px;
    }
    
    .social-auth {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 12px;
    }
    
    .btn-social {
        padding: 12px;
        background: var(--bg-secondary);
        border: 1px solid var(--border-color);
        color: var(--text-primary);
        border-radius: var(--radius-md);
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        font-weight: 600;
        cursor: pointer;
        transition: all var(--transition-base);
    }
    
    .btn-social:hover {
        border-color: var(--border-hover);
        background: var(--bg-tertiary);
    }
    
    .terms-text {
        text-align: center;
        font-size: 13px;
        color: var(--text-muted);
        margin-top: 16px;
    }
    
    .terms-text a {
        color: var(--primary-color);
        text-decoration: none;
    }
    
    .pricing-hero {
        padding: 120px 0 80px;
    }
    
    .pricing-header {
        text-align: center;
        margin-bottom: 64px;
    }
    
    .billing-toggle {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 16px;
        margin-top: 32px;
    }
    
    .toggle-label {
        font-size: 16px;
        font-weight: 600;
        color: var(--text-secondary);
    }
    
    .save-badge {
        display: inline-block;
        padding: 2px 8px;
        background: var(--success-gradient);
        color: white;
        font-size: 12px;
        font-weight: 700;
        border-radius: 100px;
        margin-left: 8px;
    }
    
    .toggle-switch {
        position: relative;
        width: 52px;
        height: 28px;
        display: inline-block;
    }
    
    .toggle-switch input {
        opacity: 0;
        width: 0;
        height: 0;
    }
    
    .toggle-slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: var(--bg-secondary);
        border: 1px solid var(--border-color);
        border-radius: 100px;
        transition: var(--transition-base);
    }
    
    .toggle-slider::before {
        content: '';
        position: absolute;
        height: 20px;
        width: 20px;
        left: 4px;
        bottom: 3px;
        background: var(--text-muted);
        border-radius: 50%;
        transition: var(--transition-base);
    }
    
    input:checked + .toggle-slider {
        background: var(--primary-gradient);
        border-color: transparent;
    }
    
    input:checked + .toggle-slider::before {
        transform: translateX(24px);
        background: white;
    }
    
    .pricing-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 32px;
        max-width: 1200px;
        margin: 0 auto;
    }
    
    .pricing-card {
        position: relative;
        background: var(--bg-card);
        backdrop-filter: blur(20px);
        border: 1px solid var(--border-color);
        border-radius: var(--radius-xl);
        padding: 40px;
        transition: all var(--transition-base);
    }
    
    .pricing-card:hover {
        transform: translateY(-8px);
        border-color: var(--border-hover);
        box-shadow: var(--shadow-lg);
    }
    
    .pricing-card.featured {
        border: 2px solid;
        border-image: var(--primary-gradient) 1;
        box-shadow: var(--shadow-glow);
    }
    
    .popular-badge {
        position: absolute;
        top: -16px;
        left: 50%;
        transform: translateX(-50%);
        padding: 6px 20px;
        background: var(--primary-gradient);
        color: white;
        font-size: 12px;
        font-weight: 700;
        border-radius: 100px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }
    
    .plan-header {
        text-align: center;
        margin-bottom: 32px;
        padding-bottom: 32px;
        border-bottom: 1px solid var(--border-color);
    }
    
    .plan-header h3 {
        font-family: var(--font-display);
        font-size: 24px;
        font-weight: 700;
        margin-bottom: 16px;
    }
    
    .price {
        margin-bottom: 12px;
    }
    
    .price-amount {
        font-family: var(--font-display);
        font-size: 48px;
        font-weight: 800;
        background: var(--primary-gradient);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
    }
    
    .price-period {
        font-size: 18px;
        color: var(--text-secondary);
    }
    
    .plan-description {
        color: var(--text-secondary);
        font-size: 14px;
    }
    
    .features-list {
        list-style: none;
        margin-bottom: 32px;
    }
    
    .features-list li {
        padding: 12px 0;
        font-size: 15px;
        color: var(--text-secondary);
    }
    
    .faq-section {
        padding: 80px 0;
    }
    
    .section-title {
        text-align: center;
        font-family: var(--font-display);
        font-size: 40px;
        font-weight: 700;
        margin-bottom: 48px;
    }
    
    .faq-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 32px;
        max-width: 900px;
        margin: 0 auto;
    }
    
    .faq-item {
        background: var(--bg-card);
        border: 1px solid var(--border-color);
        border-radius: var(--radius-lg);
        padding: 24px;
    }
    
    .faq-item h3 {
        font-size: 18px;
        font-weight: 700;
        margin-bottom: 8px;
    }
    
    .faq-item p {
        color: var(--text-secondary);
        line-height: 1.6;
    }
    
    .cta-section {
        padding: 80px 0;
    }
    
    .nav-link {
        color: var(--text-secondary);
        text-decoration: none;
        font-weight: 500;
        padding: 12px 24px;
        transition: color var(--transition-fast);
    }
    
    .nav-link:hover {
        color: var(--text-primary);
    }
    
    .hidden {
        display: none !important;
    }
    
    @media (max-width: 768px) {
        .pricing-grid {
            grid-template-columns: 1fr;
        }
        
        .faq-grid {
            grid-template-columns: 1fr;
        }
    }
`;
document.head.appendChild(style);
