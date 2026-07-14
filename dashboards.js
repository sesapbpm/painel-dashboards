document.addEventListener('DOMContentLoaded', () => {
    // 1. Verifica se o usuário está logado
    const userLogged = localStorage.getItem('userLogged');
    const allowedDashboards = JSON.parse(localStorage.getItem('allowedDashboards') || '[]');

    if (!userLogged) {
        // Se não estiver logado, redireciona de volta para o login
        window.location.href = 'index.html';
        return;
    }

    document.getElementById('userNameDisplay').textContent = `Usuário: ${userLogged}`;

    // 2. Mapeamento de Links do Banco de Dados Local
    const dashboardLinks = getDashboards();

    const nav = document.getElementById('dashboardNav');
    const iframe = document.getElementById('dashboardFrame');
    const welcomeScreen = document.getElementById('welcomeScreen');

    // 3. Constrói o menu lateral APENAS com as frentes que o usuário tem acesso
    allowedDashboards.forEach(frente => {
        const btn = document.createElement('button');
        btn.className = 'nav-item';
        btn.innerHTML = `<i class="fa-solid fa-chart-pie"></i> ${frente}`;
        
        btn.addEventListener('click', () => {
            // Destaca o botão selecionado
            document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Registra o acesso no log
            addLog(userLogged, frente);
            
            // Esconde a tela de boas vindas e mostra o iframe
            welcomeScreen.classList.add('hidden');
            iframe.classList.remove('hidden');
            
            // Carrega o link do dashboard dentro do iframe
            // Isso impede que a URL da página mude, mantendo o link oculto
            iframe.src = dashboardLinks[frente] || 'about:blank';
        });
        
        nav.appendChild(btn);
    });

    // Botão de Configurações para Admin
    if (userLogged === 'admin') {
        const configBtn = document.createElement('a');
        configBtn.href = 'config.html';
        configBtn.className = 'nav-item';
        configBtn.style.marginTop = '10px';
        configBtn.style.borderTop = '1px solid #e0e0e0';
        configBtn.style.borderRadius = '0';
        configBtn.innerHTML = `<i class="fa-solid fa-gear"></i> Configurações`;
        configBtn.style.textDecoration = 'none';
        nav.appendChild(configBtn);
    }

    // Toggle do Menu Lateral
    const sidebar = document.getElementById('sidebar');
    const toggleBtn = document.getElementById('toggleSidebar');

    toggleBtn.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');
    });

    // 4. Lógica de Logout
    document.getElementById('logoutBtn').addEventListener('click', () => {
        localStorage.removeItem('userLogged');
        localStorage.removeItem('allowedDashboards');
        window.location.href = 'index.html';
    });
});
