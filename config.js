document.addEventListener('DOMContentLoaded', async () => {
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

    btnTabLogs.addEventListener('click', async () => {
        btnTabLogs.classList.add('active');
        btnTabUsers.classList.remove('active');
        btnTabDashboards.classList.remove('active');
        tabLogs.classList.remove('hidden');
        tabUsers.classList.add('hidden');
        tabDashboards.classList.add('hidden');
        
        // Exibe "Carregando..." enquanto busca da nuvem
        const logsTableBody = document.getElementById('logsTableBody');
        logsTableBody.innerHTML = '<tr><td colspan="3" style="padding: 15px; text-align: center; color: #888;">Carregando acessos da nuvem...</td></tr>';
        
        await renderLogs();
    });

    // 3. Gerenciamento de Usuários
    const formUser = document.getElementById('formUser');
    const userList = document.getElementById('userList');
    const dashboardCheckboxes = document.getElementById('dashboardCheckboxes');

    async function renderUserList() {
        const users = await getUsers();
        userList.innerHTML = '';
        for (const [username, data] of Object.entries(users)) {
            if (username === 'admin') continue; // Não permite excluir o admin
            
            const li = document.createElement('li');
            const userDashs = data.dashboards ? data.dashboards.join(', ') : 'Nenhum';
            li.innerHTML = `
                <div>
                    <strong>${username}</strong><br>
                    <small>Dashboards: ${userDashs}</small>
                </div>
                <button class="btn-danger" onclick="deleteUser('${username}')"><i class="fa-solid fa-trash"></i></button>
            `;
            userList.appendChild(li);
        }
    }

    async function renderDashboardCheckboxes() {
        const dashboards = await getDashboards();
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

    formUser.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('newUsername').value.trim();
        const password = document.getElementById('newPassword').value;
        const selectedDashboards = Array.from(document.querySelectorAll('input[name="dashboards"]:checked')).map(cb => cb.value);

        if (!username || !password) return;

        const users = await getUsers();
        users[username] = {
            password: password,
            dashboards: selectedDashboards
        };
        await saveUsers(users);
        
        document.getElementById('newUsername').value = '';
        document.getElementById('newPassword').value = '';
        document.querySelectorAll('input[name="dashboards"]').forEach(cb => cb.checked = false);
        
        await renderUserList();
        alert('Usuário salvo na nuvem com sucesso!');
    });

    window.deleteUser = async function(username) {
        if(confirm(`Tem certeza que deseja excluir o usuário ${username}?`)) {
            const users = await getUsers();
            delete users[username];
            await saveUsers(users);
            await renderUserList();
        }
    };

    // 4. Gerenciamento de Dashboards
    const formDashboard = document.getElementById('formDashboard');
    const dashboardList = document.getElementById('dashboardList');

    async function renderDashboardList() {
        const dashboards = await getDashboards();
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

    formDashboard.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('newDashName').value.trim();
        const link = document.getElementById('newDashLink').value.trim();

        if (!name || !link) return;

        const dashboards = await getDashboards();
        dashboards[name] = link;
        await saveDashboards(dashboards);
        
        document.getElementById('newDashName').value = '';
        document.getElementById('newDashLink').value = '';
        
        await renderDashboardList();
        await renderDashboardCheckboxes(); // Atualiza os checkboxes da aba de usuários
        alert('Frente salva na nuvem com sucesso!');
    });

    window.deleteDashboard = async function(name) {
        if(confirm(`Tem certeza que deseja excluir a frente ${name}?`)) {
            const dashboards = await getDashboards();
            delete dashboards[name];
            await saveDashboards(dashboards);
            await renderDashboardList();
            await renderDashboardCheckboxes();
        }
    };

    // 5. Relatório de Acessos
    async function renderLogs() {
        const logsTableBody = document.getElementById('logsTableBody');
        const logs = await getLogs();
        
        logsTableBody.innerHTML = '';
        
        if (logs.length === 0) {
            logsTableBody.innerHTML = '<tr><td colspan="3" style="padding: 15px; text-align: center; color: #888;">Nenhum acesso registrado na nuvem ainda.</td></tr>';
            return;
        }
        
        logs.forEach(log => {
            const tr = document.createElement('tr');
            tr.style.borderBottom = '1px solid #eee';
            tr.innerHTML = `
                <td style="padding: 12px; font-size: 14px; color: #555;">${log.time || 'N/A'}</td>
                <td style="padding: 12px; font-size: 14px; font-weight: 500; color: #333;">${log.user || 'N/A'}</td>
                <td style="padding: 12px; font-size: 14px; color: var(--accent-color);">${log.dashboard || 'N/A'}</td>
            `;
            logsTableBody.appendChild(tr);
        });
    }

    // Inicialização da UI
    userList.innerHTML = '<li>Carregando...</li>';
    dashboardList.innerHTML = '<li>Carregando...</li>';
    
    await renderUserList();
    await renderDashboardCheckboxes();
    await renderDashboardList();
});
