// Main application logic
class App {
    static init() {
        // Initialize sample data
        Storage.initializeSampleData();
        
        // Initialize event handlers
        initAuthHandlers();
        initEmailHandlers();
        initNavigationHandlers();
        initModalHandlers();
        
        // Check if user is already logged in
        if (Auth.isLoggedIn()) {
            showDashboard();
        } else {
            showAuthSection();
        }
    }
}

function initNavigationHandlers() {
    // Navigation items
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const viewName = item.dataset.view;
            if (viewName) {
                switchView(viewName);
                
                // Update active nav item
                navItems.forEach(nav => nav.classList.remove('active'));
                item.classList.add('active');
            }
        });
    });

    // Logout button
    const logoutBtn = document.getElementById('logoutBtn');
    logoutBtn.addEventListener('click', () => {
        Auth.logout();
        showAuthSection();
        showToast('Logged out successfully', 'success');
    });
}

function initModalHandlers() {
    const modal = document.getElementById('emailModal');
    const closeBtn = document.getElementById('closeModal');

    closeBtn.addEventListener('click', hideEmailModal);

    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            hideEmailModal();
        }
    });

    // Close modal on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
            hideEmailModal();
        }
    });
}

function showAuthSection() {
    const authSection = document.getElementById('auth-section');
    const dashboardSection = document.getElementById('dashboard-section');
    
    authSection.classList.remove('hidden');
    dashboardSection.classList.add('hidden');
    
    // Clear forms
    document.getElementById('loginForm').reset();
    document.getElementById('registerForm').reset();
    
    // Show login form by default
    switchToForm('login');
}

function showDashboard() {
    const authSection = document.getElementById('auth-section');
    const dashboardSection = document.getElementById('dashboard-section');
    
    authSection.classList.add('hidden');
    dashboardSection.classList.remove('hidden');
    
    // Update user info
    const currentUser = Auth.getCurrentUser();
    document.getElementById('userName').textContent = currentUser.name;
    
    // Initialize email data
    updateEmailLists();
    
    // Show inbox by default
    switchView('inbox');
}

function switchView(viewName) {
    const views = document.querySelectorAll('.view');
    views.forEach(view => view.classList.remove('active'));
    
    const targetView = document.getElementById(`${viewName}-view`);
    if (targetView) {
        targetView.classList.add('active');
    }
    
    // Update navigation
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        if (item.dataset.view === viewName) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icon = type === 'success' ? '✅' : '❌';
    toast.innerHTML = `
        <span>${icon}</span>
        <span>${message}</span>
    `;
    
    container.appendChild(toast);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        if (toast.parentNode) {
            toast.style.animation = 'toastSlide 0.3s ease-out reverse';
            setTimeout(() => {
                if (toast.parentNode) {
                    container.removeChild(toast);
                }
            }, 300);
        }
    }, 3000);
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});

// Handle page visibility changes to update email lists
document.addEventListener('visibilitychange', () => {
    if (!document.hidden && Auth.isLoggedIn()) {
        updateEmailLists();
    }
});