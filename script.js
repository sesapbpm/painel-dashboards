document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const messageDiv = document.getElementById('message');

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const usernameInput = document.getElementById('username').value.trim();
        const passwordInput = document.getElementById('password').value;

        // Limpa mensagens anteriores
        showMessage('', false);

        const users = getUsers();

        // Verifica as credenciais no "banco de dados" local
        if (users[usernameInput] && users[usernameInput].password === passwordInput) {
            
            // Login com sucesso
            const userDashboards = users[usernameInput].dashboards;
            
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
            showMessage('Usuário ou senha inválidos.', false, true);
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
