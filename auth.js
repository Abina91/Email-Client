// Authentication management
class Auth {
    static register(name, email, password) {
        const users = Storage.getUsers();
        
        // Check if user already exists
        if (users.find(user => user.email === email)) {
            throw new Error('User already exists with this email');
        }

        // Create new user
        const newUser = {
            id: Date.now(),
            name: name.trim(),
            email: email.toLowerCase().trim(),
            password: password // In a real app, this would be hashed
        };

        users.push(newUser);
        Storage.saveUsers(users);
        
        return { id: newUser.id, name: newUser.name, email: newUser.email };
    }

    static login(email, password) {
        const users = Storage.getUsers();
        const user = users.find(u => 
            u.email === email.toLowerCase().trim() && u.password === password
        );
        
        if (!user) {
            throw new Error('Invalid email or password');
        }
        
        const userInfo = { id: user.id, name: user.name, email: user.email };
        Storage.setCurrentUser(userInfo);
        return userInfo;
    }

    static logout() {
        Storage.clearCurrentUser();
    }

    static getCurrentUser() {
        return Storage.getCurrentUser();
    }

    static isLoggedIn() {
        return Storage.getCurrentUser() !== null;
    }
}

// Authentication form handlers
function initAuthHandlers() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const showRegisterLink = document.getElementById('showRegister');
    const showLoginLink = document.getElementById('showLogin');

    // Form switching
    showRegisterLink.addEventListener('click', (e) => {
        e.preventDefault();
        switchToForm('register');
    });

    showLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        switchToForm('login');
    });

    // Login form submission
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        try {
            const user = Auth.login(email, password);
            showToast('Successfully logged in!', 'success');
            showDashboard();
        } catch (error) {
            showToast(error.message, 'error');
        }
    });

    // Register form submission
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('registerName').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;

        // Basic validation
        if (password.length < 6) {
            showToast('Password must be at least 6 characters', 'error');
            return;
        }

        try {
            const user = Auth.register(name, email, password);
            showToast('Account created successfully!', 'success');
            
            // Auto login after registration
            Auth.login(email, password);
            showDashboard();
        } catch (error) {
            showToast(error.message, 'error');
        }
    });
}

function switchToForm(formType) {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    if (formType === 'register') {
        loginForm.classList.remove('active');
        registerForm.classList.add('active');
    } else {
        registerForm.classList.remove('active');
        loginForm.classList.add('active');
    }
}