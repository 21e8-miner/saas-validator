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

// Cache DOM elements for better performance
let monthlyPricesCache = null;
let annualPricesCache = null;

const cachePricingDOM = () => {
    if (!monthlyPricesCache) {
        monthlyPricesCache = document.querySelectorAll('.monthly-price');
        annualPricesCache = document.querySelectorAll('.annual-price');
    }
};

// Billing toggle
const billingToggle = document.getElementById('billing-toggle');
if (billingToggle) {
    billingToggle.addEventListener('change', (e) => {
        isAnnual = e.target.checked;
        updatePricing();
    });
}

function updatePricing() {
    cachePricingDOM();

    if (isAnnual) {
        monthlyPricesCache.forEach(el => el.classList.add('hidden'));
        annualPricesCache.forEach(el => el.classList.remove('hidden'));
    } else {
        monthlyPricesCache.forEach(el => el.classList.remove('hidden'));
        annualPricesCache.forEach(el => el.classList.add('hidden'));
    }
}

// Handle plan selection with event delegation for better performance
document.addEventListener('click', async (e) => {
    const planButton = e.target.closest('[data-plan]');
    if (planButton) {
        const plan = planButton.dataset.plan;
        const billingPeriod = isAnnual ? 'annual' : 'monthly';

        // Check if user is logged in
        const user = localStorage.getItem('saas_validator_user');
        if (!user) {
            window.location.href = 'auth.html?redirect=pricing';
            return;
        }

        // TODO: Implement actual Stripe checkout
        await handleCheckout(plan, billingPeriod);
    }
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

// CSS is now in external stylesheet (style.css) for better performance
