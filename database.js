// Configuração do Firebase que você me enviou
const firebaseConfig = {
    apiKey: "AIzaSyAbSRhdyQnTk26LDa3Lf-oSnySt_3XoWzU",
    authDomain: "painel-sesap.firebaseapp.com",
    databaseURL: "https://painel-sesap-default-rtdb.firebaseio.com",
    projectId: "painel-sesap",
    storageBucket: "painel-sesap.firebasestorage.app",
    messagingSenderId: "743723513834",
    appId: "1:743723513834:web:a0fa0ff85be0f8b25ae493"
};

// Inicializa o Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const database = firebase.database();

async function initDatabase() {
    // Tenta pegar os usuários. Se não tiver admin, cria os padrões.
    const usersSnap = await database.ref('users').once('value');
    if (!usersSnap.exists()) {
        const defaultUsers = {
            'admin': {
                password: '123',
                dashboards: ['Sistemas', 'Aquisições', 'Compras', 'Manutenção']
            },
            'joao': {
                password: 'senha_joao',
                dashboards: ['Financeiro']
            },
            'maria': {
                password: 'senha_maria',
                dashboards: ['RH', 'Aquisições']
            }
        };
        await database.ref('users').set(defaultUsers);
    }

    const dashSnap = await database.ref('dashboards').once('value');
    if (!dashSnap.exists()) {
        const defaultDashboards = {
            'Sistemas': 'https://sesapbpm.github.io/DashboardContratos/',
            'Aquisições': 'https://sesapbpm.github.io/Dashs---Aquisi-es/',
            'Compras': 'em-construcao.html',
            'Manutenção': 'em-construcao.html'
        };
        await database.ref('dashboards').set(defaultDashboards);
    }
}

async function getDashboards() {
    const snap = await database.ref('dashboards').once('value');
    return snap.val() || {};
}

async function saveDashboards(dashboards) {
    await database.ref('dashboards').set(dashboards);
}

async function getUsers() {
    const snap = await database.ref('users').once('value');
    return snap.val() || {};
}

async function saveUsers(users) {
    await database.ref('users').set(users);
}

async function getLogs() {
    // Busca ordenado pela data
    const snap = await database.ref('logs').orderByChild('timestampValue').once('value');
    const logsObj = snap.val() || {};
    // Converte o objeto do Firebase (que usa IDs aleatórios) para array e inverte (mais novos primeiro)
    return Object.values(logsObj).reverse();
}

async function addLog(username, dashboardName) {
    const now = new Date();
    const timestamp = now.toLocaleString('pt-BR');
    
    // O push cria um ID único garantindo que acessos simultâneos não se sobrescrevam
    await database.ref('logs').push({
        user: username,
        dashboard: dashboardName,
        time: timestamp,
        timestampValue: now.getTime()
    });
}
