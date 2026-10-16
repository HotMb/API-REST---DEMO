// Application data
const appData = {
  "project": {
    "title": "Simulateur d’API REST",
    "shortDescription": "Interface pédagogique de réponses API simulées",
    "fullDescription": "Une page HTML, CSS et JavaScript qui illustre des parcours d’authentification et des réponses JSON sans backend, stockage durable ni requêtes réseau.",
    "technologies": ["HTML", "CSS", "JavaScript"],
    "features": [
      "Inscription et connexion simulées",
      "État de session temporaire en mémoire",
      "Exemples de réponses JSON",
      "Jeton factice clairement identifié",
      "Aucune donnée envoyée à un serveur"
    ]
  },
  "endpoints": [
    {
      "method": "POST",
      "path": "/api/auth/register",
      "description": "Inscription d'un nouvel utilisateur",
      "protected": false,
      "parameters": {
        "name": "string",
        "email": "string", 
        "password": "string"
      },
      "response": {
        "success": true,
        "user": {
          "id": "507f1f77bcf86cd799439011",
          "name": "John Doe",
          "email": "john@example.com"
        },
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
      }
    },
    {
      "method": "POST", 
      "path": "/api/auth/login",
      "description": "Connexion d'un utilisateur",
      "protected": false,
      "parameters": {
        "email": "string",
        "password": "string"
      },
      "response": {
        "success": true,
        "user": {
          "id": "507f1f77bcf86cd799439011",
          "name": "John Doe",
          "email": "john@example.com"
        },
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
      }
    },
    {
      "method": "GET",
      "path": "/api/users/profile",
      "description": "Récupération du profil utilisateur",
      "protected": true,
      "parameters": {},
      "response": {
        "success": true,
        "user": {
          "id": "507f1f77bcf86cd799439011",
          "name": "John Doe",
          "email": "john@example.com",
          "createdAt": "2023-01-15T10:30:00Z"
        }
      }
    },
    {
      "method": "GET",
      "path": "/api/users",
      "description": "Liste de tous les utilisateurs (admin)",
      "protected": true,
      "parameters": {
        "page": "number",
        "limit": "number"
      },
      "response": {
        "success": true,
        "users": [
          {
            "id": "507f1f77bcf86cd799439011",
            "name": "John Doe", 
            "email": "john@example.com"
          },
          {
            "id": "507f1f77bcf86cd799439012",
            "name": "Jane Smith", 
            "email": "jane@example.com"
          }
        ],
        "pagination": {
          "page": 1,
          "limit": 10,
          "total": 50
        }
      }
    },
    {
      "method": "PUT",
      "path": "/api/users/profile", 
      "description": "Mise à jour du profil utilisateur",
      "protected": true,
      "parameters": {
        "name": "string",
        "email": "string"
      },
      "response": {
        "success": true,
        "user": {
          "id": "507f1f77bcf86cd799439011",
          "name": "John Updated",
          "email": "john.updated@example.com"
        }
      }
    },
    {
      "method": "DELETE",
      "path": "/api/users/profile",
      "description": "Suppression du compte utilisateur",
      "protected": true,
      "parameters": {},
      "response": {
        "success": true,
        "message": "Compte supprimé avec succès"
      }
    }
  ]
};

// Application state
let appState = {
  currentUser: null,
  isAuthenticated: false,
  currentToken: null
};

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing application...');
    
    // Initialize functionality
    initializeNavigation();
    initializeAuthentication();
    generateEndpoints();
    populateTestEndpoints();
    updateAuthStatus();
});

// Navigation functionality
function initializeNavigation() {
    const tabButtons = document.querySelectorAll('.nav-tab');
    const tabContents = document.querySelectorAll('.tab-content');
    
    console.log('Found tab buttons:', tabButtons.length);
    console.log('Found tab contents:', tabContents.length);
    
    if (!tabButtons.length || !tabContents.length) {
        console.error('Tab elements not found');
        return;
    }
    
    tabButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const targetTab = button.getAttribute('data-tab');
            console.log('Switching to tab:', targetTab);
            switchTab(targetTab);
        });
    });
}

function switchTab(targetTab) {
    const tabButtons = document.querySelectorAll('.nav-tab');
    const tabContents = document.querySelectorAll('.tab-content');
    
    console.log('switchTab called with:', targetTab);
    
    if (!tabButtons.length || !tabContents.length) {
        console.error('Tab elements not found in switchTab');
        return;
    }
    
    // Update active tab button
    tabButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-tab') === targetTab) {
            btn.classList.add('active');
        }
    });
    
    // Update active tab content
    tabContents.forEach(content => {
        content.classList.remove('active', 'fade-in');
    });
    
    const targetContent = document.getElementById(targetTab);
    if (targetContent) {
        console.log('Showing content for:', targetTab);
        targetContent.classList.add('active');
        // Add fade in animation after a small delay
        setTimeout(() => {
            targetContent.classList.add('fade-in');
        }, 10);
    } else {
        console.error('Target content not found:', targetTab);
    }
}

// Authentication functionality
function initializeAuthentication() {
    const registerForm = document.getElementById('register-form');
    const loginForm = document.getElementById('login-form');
    const logoutBtn = document.getElementById('logout-btn');
    
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
}

function handleRegister(e) {
    e.preventDefault();
    
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    
    if (!name || !email || !password) {
        showNotification('Veuillez remplir tous les champs', 'error');
        return;
    }
    
    // Simulate registration
    const userData = {
        id: generateId(),
        name: name,
        email: email,
        createdAt: new Date().toISOString()
    };
    
    const token = generateDemoToken(userData);
    
    // Update app state
    appState.currentUser = userData;
    appState.isAuthenticated = true;
    appState.currentToken = token;
    
    // Update UI
    updateAuthStatus();
    showTokenDisplay(token, userData);
    
    // Clear form
    document.getElementById('register-form').reset();
    
    // Show success message
    showNotification('Inscription simulée réussie (non enregistrée).', 'success');
}

function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    if (!email || !password) {
        showNotification('Veuillez remplir tous les champs', 'error');
        return;
    }
    
    // Simulate login validation
    const userData = {
        id: '507f1f77bcf86cd799439011',
        name: 'John Doe',
        email: email,
        createdAt: '2023-01-15T10:30:00Z'
    };
    
    const token = generateDemoToken(userData);
    
    // Update app state
    appState.currentUser = userData;
    appState.isAuthenticated = true;
    appState.currentToken = token;
    
    // Update UI
    updateAuthStatus();
    showTokenDisplay(token, userData);
    
    // Show success message
    showNotification('Connexion simulée réussie.', 'success');
}

function handleLogout() {
    // Reset app state
    appState.currentUser = null;
    appState.isAuthenticated = false;
    appState.currentToken = null;
    
    // Update UI
    updateAuthStatus();
    hideTokenDisplay();
    
    // Clear forms
    const registerForm = document.getElementById('register-form');
    const loginForm = document.getElementById('login-form');
    if (registerForm) registerForm.reset();
    if (loginForm) loginForm.reset();
    
    // Show success message
    showNotification('Session locale terminée.', 'success');
}

function updateAuthStatus() {
    const authStatus = document.getElementById('auth-status');
    const logoutBtn = document.getElementById('logout-btn');
    
    if (!authStatus) return;
    
    if (appState.isAuthenticated && appState.currentUser) {
        authStatus.textContent = `Session locale : ${appState.currentUser.name}`;
        if (logoutBtn) logoutBtn.classList.remove('hidden');
    } else {
        authStatus.textContent = 'Simulation inactive';
        if (logoutBtn) logoutBtn.classList.add('hidden');
    }
}

function showTokenDisplay(token, userData) {
    const tokenDisplay = document.getElementById('token-display');
    const jwtToken = document.getElementById('jwt-token');
    const userDetails = document.getElementById('user-details');
    
    if (!tokenDisplay || !jwtToken || !userDetails) return;
    
    tokenDisplay.classList.remove('hidden');
    jwtToken.value = token;
    
    userDetails.innerHTML = `
        <p><strong>ID:</strong> ${userData.id}</p>
        <p><strong>Nom:</strong> ${userData.name}</p>
        <p><strong>Email:</strong> ${userData.email}</p>
        <p><strong>Date de création:</strong> ${new Date(userData.createdAt).toLocaleDateString('fr-FR')}</p>
    `;
}

function hideTokenDisplay() {
    const tokenDisplay = document.getElementById('token-display');
    const jwtToken = document.getElementById('jwt-token');
    const userDetails = document.getElementById('user-details');
    
    if (!tokenDisplay || !jwtToken || !userDetails) return;
    
    tokenDisplay.classList.add('hidden');
    jwtToken.value = '';
    userDetails.innerHTML = '';
}

function generateDemoToken(userData) {
    return JSON.stringify({
        demo: true,
        signed: false,
        subject: userData.id,
        name: userData.name,
        email: userData.email,
        createdAt: userData.createdAt
    }, null, 2);
}

function generateId() {
    return Math.random().toString(16).slice(2) + Math.random().toString(16).slice(2);
}

// Copy token functionality
function copyToken() {
    const jwtToken = document.getElementById('jwt-token');
    if (!jwtToken) return;
    
    jwtToken.select();
    jwtToken.setSelectionRange(0, 99999); // For mobile devices
    
    try {
        document.execCommand('copy');
        showNotification('Jeton fictif copié.', 'success');
    } catch (err) {
        showNotification('Erreur lors de la copie', 'error');
    }
}

// Generate endpoints display
function generateEndpoints() {
    const endpointsList = document.getElementById('endpoints-list');
    if (!endpointsList) return;
    
    endpointsList.innerHTML = '';
    
    appData.endpoints.forEach((endpoint, index) => {
        const endpointElement = createEndpointElement(endpoint, index);
        endpointsList.appendChild(endpointElement);
    });
}

function createEndpointElement(endpoint, index) {
    const div = document.createElement('div');
    div.className = 'endpoint-item';
    
    div.innerHTML = `
        <div class="endpoint-header" onclick="toggleEndpointDetails(${index})">
            <div class="endpoint-info">
                <span class="http-method method-${endpoint.method}">${endpoint.method}</span>
                <code class="endpoint-path">${endpoint.path}</code>
                <span class="endpoint-description">${endpoint.description}</span>
                ${endpoint.protected ? '<span class="protected-badge">Protégé</span>' : ''}
            </div>
            <i class="fas fa-chevron-down"></i>
        </div>
        <div id="endpoint-details-${index}" class="endpoint-details">
            <div class="endpoint-section">
                <h4>Paramètres</h4>
                <pre><code>${JSON.stringify(endpoint.parameters, null, 2)}</code></pre>
            </div>
            <div class="endpoint-section">
                <h4>Réponse exemple</h4>
                <pre><code>${JSON.stringify(endpoint.response, null, 2)}</code></pre>
            </div>
            <div class="endpoint-section">
                <h4>Code d'exemple</h4>
                <pre><code>fetch('${endpoint.path}', {
  method: '${endpoint.method}',
  headers: {
    'Content-Type': 'application/json'${endpoint.protected ? ',\n    \'Authorization\': \'Bearer \' + token' : ''}
  }${Object.keys(endpoint.parameters).length > 0 && (endpoint.method === 'POST' || endpoint.method === 'PUT') ? ',\n  body: JSON.stringify(' + JSON.stringify(endpoint.parameters, null, 4) + ')' : ''}
})
.then(response => response.json())
.then(data => console.log(data));</code></pre>
            </div>
            <button class="btn btn--primary" onclick="testEndpoint(${index})">
                <i class="fas fa-play"></i> Tester cet endpoint
            </button>
        </div>
    `;
    
    return div;
}

function toggleEndpointDetails(index) {
    const details = document.getElementById(`endpoint-details-${index}`);
    if (!details) return;
    
    const isActive = details.classList.contains('active');
    
    // Close all other details
    document.querySelectorAll('.endpoint-details').forEach(detail => {
        detail.classList.remove('active');
    });
    
    // Toggle current one
    if (!isActive) {
        details.classList.add('active');
        details.classList.add('slide-in');
    }
}

function testEndpoint(index) {
    const endpoint = appData.endpoints[index];
    
    // Check if endpoint is protected and user is not authenticated
    if (endpoint.protected && !appState.isAuthenticated) {
        showNotification('Vous devez être connecté pour tester cet endpoint protégé', 'error');
        return;
    }
    
    // Simulate API call
    const testResult = document.getElementById('test-result');
    if (testResult) {
        testResult.innerHTML = '<div class="loading">Test en cours...</div>';
    }
    
    setTimeout(() => {
        const response = {
            status: 200,
            statusText: 'OK',
            data: endpoint.response,
            headers: {
                'Content-Type': 'application/json',
                'X-Response-Time': '45ms'
            }
        };
        
        if (testResult) {
            showTestResult(response, true);
        }
        showNotification(`Test de ${endpoint.method} ${endpoint.path} réussi !`, 'success');
    }, 1000);
}

// Test interface functionality
function populateTestEndpoints() {
    const testEndpoint = document.getElementById('test-endpoint');
    if (!testEndpoint) return;
    
    testEndpoint.innerHTML = '<option value="">Sélectionnez un endpoint</option>';
    
    appData.endpoints.forEach((endpoint, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = `${endpoint.method} ${endpoint.path}`;
        testEndpoint.appendChild(option);
    });
    
    testEndpoint.addEventListener('change', onTestEndpointChange);
}

function onTestEndpointChange() {
    const testEndpoint = document.getElementById('test-endpoint');
    const testHeaders = document.getElementById('test-headers');
    const testBody = document.getElementById('test-body');
    
    if (!testEndpoint || !testHeaders || !testBody) return;
    
    const selectedIndex = testEndpoint.value;
    if (!selectedIndex) return;
    
    const endpoint = appData.endpoints[selectedIndex];
    
    // Auto-fill headers for protected endpoints
    if (endpoint.protected && appState.currentToken) {
        const headers = {
            "Authorization": `Bearer ${appState.currentToken}`,
            "Content-Type": "application/json"
        };
        testHeaders.value = JSON.stringify(headers, null, 2);
    } else {
        testHeaders.value = JSON.stringify({
            "Content-Type": "application/json"
        }, null, 2);
    }
    
    // Auto-fill body for POST/PUT endpoints
    if ((endpoint.method === 'POST' || endpoint.method === 'PUT') && Object.keys(endpoint.parameters).length > 0) {
        const body = {};
        Object.keys(endpoint.parameters).forEach(key => {
            if (key === 'name') body[key] = 'John Doe';
            else if (key === 'email') body[key] = 'john@example.com';
            else if (key === 'password') body[key] = 'password123';
            else if (key === 'page') body[key] = 1;
            else if (key === 'limit') body[key] = 10;
            else body[key] = `example_${key}`;
        });
        testBody.value = JSON.stringify(body, null, 2);
    } else {
        testBody.value = '';
    }
}

function executeTest() {
    const testEndpoint = document.getElementById('test-endpoint');
    const testResult = document.getElementById('test-result');
    
    if (!testEndpoint || !testResult) return;
    
    const selectedIndex = testEndpoint.value;
    if (!selectedIndex) {
        showNotification('Veuillez sélectionner un endpoint', 'error');
        return;
    }
    
    const endpoint = appData.endpoints[selectedIndex];
    
    // Check if endpoint is protected and user is not authenticated
    if (endpoint.protected && !appState.isAuthenticated) {
        const errorResponse = {
            status: 401,
            statusText: 'Unauthorized',
            data: {
                error: 'Token d\'authentification requis',
                message: 'Vous devez être connecté pour accéder à cette ressource'
            }
        };
        showTestResult(errorResponse, false);
        showNotification('Authentification requise !', 'error');
        return;
    }
    
    // Simulate loading
    testResult.innerHTML = '<div class="loading">Exécution du test...</div>';
    
    setTimeout(() => {
        const response = {
            status: 200,
            statusText: 'OK',
            data: endpoint.response,
            headers: {
                'Content-Type': 'application/json',
                'X-Response-Time': '45ms'
            }
        };
        
        showTestResult(response, true);
        showNotification(`Test exécuté avec succès !`, 'success');
    }, 1000);
}

function showTestResult(response, isSuccess) {
    const testResult = document.getElementById('test-result');
    if (!testResult) return;
    
    const resultClass = isSuccess ? 'response-success' : 'response-error';
    
    testResult.innerHTML = `
        <div class="response-container ${resultClass}">
            <div class="response-status">
                <strong>Status:</strong> ${response.status} ${response.statusText}
            </div>
            ${response.headers ? `
                <div class="response-headers">
                    <strong>Headers:</strong>
                    <pre class="response-data">${JSON.stringify(response.headers, null, 2)}</pre>
                </div>
            ` : ''}
            <div class="response-body">
                <strong>Body:</strong>
                <pre class="response-data">${JSON.stringify(response.data, null, 2)}</pre>
            </div>
        </div>
    `;
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notif => notif.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add styles for notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--color-surface);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-base);
        padding: var(--space-16);
        box-shadow: var(--shadow-lg);
        z-index: 1000;
        max-width: 400px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--space-12);
        animation: slideIn 0.3s ease-out;
    `;
    
    // Type-specific styling
    if (type === 'success') {
        notification.style.borderColor = 'var(--color-success)';
        notification.style.backgroundColor = 'rgba(var(--color-success-rgb), 0.1)';
    } else if (type === 'error') {
        notification.style.borderColor = 'var(--color-error)';
        notification.style.backgroundColor = 'rgba(var(--color-error-rgb), 0.1)';
    }
    
    const notificationContent = notification.querySelector('.notification-content');
    notificationContent.style.cssText = `
        display: flex;
        align-items: center;
        gap: var(--space-8);
    `;
    
    const notificationClose = notification.querySelector('.notification-close');
    notificationClose.style.cssText = `
        background: none;
        border: none;
        color: var(--color-text-secondary);
        cursor: pointer;
        padding: var(--space-4);
        border-radius: var(--radius-sm);
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

function getNotificationIcon(type) {
    switch (type) {
        case 'success': return 'fa-check-circle';
        case 'error': return 'fa-exclamation-circle';
        case 'warning': return 'fa-exclamation-triangle';
        default: return 'fa-info-circle';
    }
}

// Make functions globally available
window.copyToken = copyToken;
window.toggleEndpointDetails = toggleEndpointDetails;
window.testEndpoint = testEndpoint;
window.executeTest = executeTest;