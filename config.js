document.addEventListener('DOMContentLoaded', () => {
    // 1. Verifica Acesso
    const userLogged = localStorage.getItem('userLogged');
    if (userLogged !== 'admin') {
        window.location.href = 'index.html';
        return;
    }

    // 2. Navegação em Abas
    const btnTabUsers = document.getElementById('btnTabUsers');
    const btnTabDashboards = document.getElementById('btnTabDashboards');
    const btnTabLogs = document.getElementById('btnTabLogs');
    const tabUsers = document.getElementById('tabUsers');
    const tabDashboards = document.getElementById('tabDashboards');
    const tabLogs = document.getElementById('tabLogs');

    btnTabUsers.addEventListener('click', () => {
        btnTabUsers.classList.add('active');
        btnTabDashboards.classList.remove('active');
        btnTabLogs.classList.remove('active');
        tabUsers.classList.remove('hidden');
        tabDashboards.classList.add('hidden');
        tabLogs.classList.add('hidden');
    });

    btnTabDashboards.addEventListener('click', () => {
        btnTabDashboards.classList.add('active');
        btnTabUsers.classList.remove('active');
        btnTabLogs.classList.remove('active');
        tabDashboards.classList.remove('hidden');
        tabUsers.classList.add('hidden');
        tabLogs.classList.add('hidden');
    });

    btnTabLogs.addEventListener('click', () => {
        btnTabLogs.classList.add('active');
        btnTabUsers.classList.remove('active');
        btnTabDashboards.classList.remove('active');
        tabLogs.classList.remove('hidden');
        tabUsers.classList.add('hidden');
        tabDashboards.classList.add('hidden');
        renderLogs();
    });

    // 3. Gerenciamento de Usuários
    const formUser = document.getElementById('formUser');
    const userList = document.getElementById('userList');
    const dashboardCheckboxes = document.getElementById('dashboardCheckboxes');

    function renderUserList() {
        const users = getUsers();
        userList.innerHTML = '';
        for (const [username, data] of Object.entries(users)) {
            if (username === 'admin') continue; // Não permite excluir o admin
            
            const li = document.createElement('li');
            li.innerHTML = `
                <div>
                    <strong>${username}</strong><br>
                    <small>Dashboards: ${data.dashboards.join(', ')}</small>
                </div>
                <button class="btn-danger" onclick="deleteUser('${username}')"><i class="fa-solid fa-trash"></i></button>
            `;
            userList.appendChild(li);
        }
    }

    function renderDashboardCheckboxes() {
        const dashboards = getDashboards();
        dashboardCheckboxes.innerHTML = '';
        for (const name of Object.keys(dashboards)) {
            const label = document.createElement('label');
            label.className = 'checkbox-label';
            label.innerHTML = `
                <input type="checkbox" name="dashboards" value="${name}"> ${name}
            `;
            dashboardCheckboxes.appendChild(label);
        }
    }

    formUser.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('newUsername').value.trim();
        const password = document.getElementById('newPassword').value;
        const selectedDashboards = Array.from(document.querySelectorAll('input[name="dashboards"]:checked')).map(cb => cb.value);

        if (!username || !password) return;

        const users = getUsers();
        users[username] = {
            password: password,
            dashboards: selectedDashboards
        };
        saveUsers(users);
        
        document.getElementById('newUsername').value = '';
        document.getElementById('newPassword').value = '';
        document.querySelectorAll('input[name="dashboards"]').forEach(cb => cb.checked = false);
        
        renderUserList();
        alert('Usuário salvo com sucesso!');
    });

    window.deleteUser = function(username) {
        if(confirm(`Tem certeza que deseja excluir o usuário ${username}?`)) {
            const users = getUsers();
            delete users[username];
            saveUsers(users);
            renderUserList();
        }
    };

    // 4. Gerenciamento de Dashboards
    const formDashboard = document.getElementById('formDashboard');
    const dashboardList = document.getElementById('dashboardList');

    function renderDashboardList() {
        const dashboards = getDashboards();
        dashboardList.innerHTML = '';
        for (const [name, link] of Object.entries(dashboards)) {
            const li = document.createElement('li');
            li.innerHTML = `
                <div>
                    <strong>${name}</strong><br>
                    <small>${link}</small>
                </div>
                <button class="btn-danger" onclick="deleteDashboard('${name}')"><i class="fa-solid fa-trash"></i></button>
            `;
            dashboardList.appendChild(li);
        }
    }

    formDashboard.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('newDashName').value.trim();
        const link = document.getElementById('newDashLink').value.trim();

        if (!name || !link) return;

        const dashboards = getDashboards();
        dashboards[name] = link;
        saveDashboards(dashboards);
        
        document.getElementById('newDashName').value = '';
        document.getElementById('newDashLink').value = '';
        
        renderDashboardList();
        renderDashboardCheckboxes(); // Atualiza os checkboxes da aba de usuários
        alert('Frente salva com sucesso!');
    });

    window.deleteDashboard = function(name) {
        if(confirm(`Tem certeza que deseja excluir a frente ${name}?`)) {
            const dashboards = getDashboards();
            delete dashboards[name];
            saveDashboards(dashboards);
            renderDashboardList();
            renderDashboardCheckboxes();
        }
    };

    // 5. Relatório de Acessos
    function renderLogs() {
        const logsTableBody = document.getElementById('logsTableBody');
        const logs = getLogs();
        
        logsTableBody.innerHTML = '';
        
        if (logs.length === 0) {
            logsTableBody.innerHTML = '<tr><td colspan="3" style="padding: 15px; text-align: center; color: #888;">Nenhum acesso registrado ainda.</td></tr>';
            return;
        }
        
        logs.forEach(log => {
            const tr = document.createElement('tr');
            tr.style.borderBottom = '1px solid #eee';
            tr.innerHTML = `
                <td style="padding: 12px; font-size: 14px; color: #555;">${log.time}</td>
                <td style="padding: 12px; font-size: 14px; font-weight: 500; color: #333;">${log.user}</td>
                <td style="padding: 12px; font-size: 14px; color: var(--accent-color);">${log.dashboard}</td>
            `;
            logsTableBody.appendChild(tr);
        });
    }

    // Inicialização da UI
    renderUserList();
    renderDashboardCheckboxes();
    renderDashboardList();
});
