document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const messageDiv = document.getElementById('message');

    // Inicializa o banco de dados na nuvem se for a primeira vez
    initDatabase();

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const usernameInput = document.getElementById('username').value.trim();
        const passwordInput = document.getElementById('password').value;

        // Mostra carregando
        showMessage('Verificando credenciais na nuvem...', false);

        try {
            const users = await getUsers();

            // Verifica as credenciais no banco de dados
            if (users[usernameInput] && users[usernameInput].password === passwordInput) {
                
                // Login com sucesso
                const userDashboards = users[usernameInput].dashboards || [];
            
            // Aqui você pode salvar as permissões no localStorage para usar na próxima página
            localStorage.setItem('userLogged', usernameInput);
            localStorage.setItem('allowedDashboards', JSON.stringify(userDashboards));

            showMessage(`Login aprovado! Acessos permitidos: ${userDashboards.join(', ')}. Redirecionando...`, true);
            
            // Redireciona para a página interna do dashboard
            setTimeout(() => {
                window.location.href = 'dashboards.html';
                }, 1500);

            } else {
                // Falha no login
                showMessage('Usuário ou senha incorretos!', false);
            }
        } catch (error) {
            console.error(error);
            showMessage('Erro ao conectar com o banco de dados.', false);
        }
    });

    function showMessage(text, isSuccess = false, isError = false) {
        if (!text) {
            messageDiv.className = 'message hidden';
            return;
        }

        messageDiv.textContent = text;
        messageDiv.className = 'message';
        
        if (isSuccess) messageDiv.classList.add('success');
        if (isError) messageDiv.classList.add('error');
    }
});
