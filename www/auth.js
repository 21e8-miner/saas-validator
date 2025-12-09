// Auth state management
let currentUser = null;

// Check for existing session
function checkAuth() {
    const user = localStorage.getItem('saas_validator_user');
    if (user) {
        currentUser = JSON.parse(user);
        return true;
    }
    return false;
}

// Tab switching
document.querySelectorAll('.auth-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        const target = tab.dataset.tab;

        // Update tabs
        document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        // Update forms
        document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
        document.getElementById(`${target}-form`).classList.add('active');
    });
});

// Sign In
document.getElementById('signin-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('signin-email').value;
    const password = document.getElementById('signin-password').value;

    // Simulate API call (replace with actual auth service)
    try {
        // TODO: Replace with actual authentication (Firebase, Supabase, etc.)
        const user = {
            email: email,
            name: email.split('@')[0],
            plan: 'free',
            validationsRemaining: 3,
            createdAt: new Date().toISOString()
        };

        localStorage.setItem('saas_validator_user', JSON.stringify(user));
        currentUser = user;

        // Redirect to main app
        window.location.href = 'index.html';
    } catch (error) {
        alert('Sign in failed. Please try again.');
    }
});

// Sign Up
document.getElementById('signup-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;

    try {
        // TODO: Replace with actual authentication
        const user = {
            email: email,
            name: name,
            plan: 'free',
            validationsRemaining: 3,
            createdAt: new Date().toISOString()
        };

        localStorage.setItem('saas_validator_user', JSON.stringify(user));
        currentUser = user;

        // Redirect to main app
        window.location.href = 'index.html';
    } catch (error) {
        alert('Sign up failed. Please try again.');
    }
});

// Google Sign In
document.getElementById('google-signin').addEventListener('click', () => {
    // TODO: Implement Google OAuth
    alert('Google Sign-In coming soon! For now, use email/password.');
});

// GitHub Sign In
document.getElementById('github-signin').addEventListener('click', () => {
    // TODO: Implement GitHub OAuth
    alert('GitHub Sign-In coming soon! For now, use email/password.');
});
