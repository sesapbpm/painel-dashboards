// Inicializa o banco de dados se não existir
function initDatabase() {
    if (!localStorage.getItem('db_dashboards')) {
        const defaultDashboards = {
            'Sistemas': 'https://sesapbpm.github.io/DashboardContratos/',
            'Aquisições': 'https://sesapbpm.github.io/Dashs---Aquisi-es/',
            'Compras': 'em-construcao.html',
            'Manutenção': 'em-construcao.html'
        };
        localStorage.setItem('db_dashboards', JSON.stringify(defaultDashboards));
    }

    if (!localStorage.getItem('db_users')) {
        const defaultUsers = {
            'admin': {
                password: '123',
                dashboards: ['Sistemas', 'Aquisições', 'Compras', 'Manutenção']
            },
            'maria': {
                password: 'senha_maria',
                dashboards: ['Aquisições']
            }
        };
        localStorage.setItem('db_users', JSON.stringify(defaultUsers));
    }

    if (!localStorage.getItem('db_logs')) {
        localStorage.setItem('db_logs', JSON.stringify([]));
    }
}

function getDashboards() {
    return JSON.parse(localStorage.getItem('db_dashboards')) || {};
}

function saveDashboards(dashboards) {
    localStorage.setItem('db_dashboards', JSON.stringify(dashboards));
}

function getUsers() {
    return JSON.parse(localStorage.getItem('db_users')) || {};
}

function saveUsers(users) {
    localStorage.setItem('db_users', JSON.stringify(users));
}

function getLogs() {
    return JSON.parse(localStorage.getItem('db_logs')) || [];
}

function addLog(username, dashboardName) {
    const logs = getLogs();
    const now = new Date();
    // Formata a data para DD/MM/YYYY HH:MM:SS
    const timestamp = now.toLocaleString('pt-BR');
    
    logs.unshift({
        user: username,
        dashboard: dashboardName,
        time: timestamp
    });
    
    // Mantém no máximo 500 logs para não pesar
    if(logs.length > 500) {
        logs.pop();
    }
    
    localStorage.setItem('db_logs', JSON.stringify(logs));
}

// Inicializa automaticamente
initDatabase();
