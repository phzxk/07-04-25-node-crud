document.addEventListener('DOMContentLoaded', function() {
    // Elementos do DOM
    const nomeField = document.getElementById('txtNome');
    const loginField = document.getElementById('txtLogin');
    const senhaField = document.getElementById('txtSenha');
    const btnEditar = document.getElementById('btnEditar');
    const btnVoltar = document.getElementById('btnVoltar');
    
    // Função para exibir mensagens de feedback
    function showAlert(message, type = 'success') {
        // Remove alertas anteriores
        const existingAlert = document.querySelector('.alert');
        if (existingAlert) {
            existingAlert.remove();
        }
        
        // Cria novo alerta
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type} alert-dismissible fade show mt-3`;
        alertDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;
        
        // Insere o alerta após o formulário
        const form = document.getElementById('frmVisualizacao');
        form.parentNode.insertBefore(alertDiv, form.nextSibling);
        
        // Remove automaticamente após 5 segundos
        setTimeout(() => {
            alertDiv.classList.remove('show');
            setTimeout(() => alertDiv.remove(), 150);
        }, 5000);
    }

    // Função para carregar dados do usuário
    async function loadUserData() {
        try {
            // Mostrar estado de carregamento
            nomeField.value = 'Carregando...';
            loginField.value = 'Carregando...';
            
            // Simular requisição à API (substitua pela sua implementação real)
            const response = await fetch('/api/usuario', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            
            if (!response.ok) {
                throw new Error('Erro ao carregar dados do usuário');
            }
            
            const userData = await response.json();
            
            // Preencher campos com os dados recebidos
            nomeField.value = userData.nome || 'Não informado';
            loginField.value = userData.login || 'Não informado';
            senhaField.value = '••••••••'; // Senha mascarada
            
            // Habilitar botão de edição
            btnEditar.disabled = false;
            
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
            showAlert(error.message || 'Erro ao carregar dados do usuário', 'danger');
            
            // Preencher com valores padrão em caso de erro
            nomeField.value = 'Erro ao carregar';
            loginField.value = 'Erro ao carregar';
        }
    }

    // Evento para o botão Editar
    btnEditar.addEventListener('click', function() {
        // Redireciona para a página de edição
        window.location.href = 'atualizacao.html';
    });

    // Evento para o botão Voltar
    btnVoltar.addEventListener('click', function() {
        // Volta para a página anterior ou para o dashboard
        if (document.referrer && document.referrer.includes(window.location.host)) {
            window.history.back();
        } else {
            window.location.href = 'dashboard.html';
        }
    });

    // Opcional: Alternar visibilidade da senha
    const togglePassword = document.createElement('button');
    togglePassword.className = 'btn btn-outline-secondary';
    togglePassword.type = 'button';
    togglePassword.innerHTML = '<i class="fas fa-eye"></i>';
    togglePassword.addEventListener('click', function() {
        if (senhaField.type === 'password') {
            senhaField.type = 'text';
            togglePassword.innerHTML = '<i class="fas fa-eye-slash"></i>';
        } else {
            senhaField.type = 'password';
            togglePassword.innerHTML = '<i class="fas fa-eye"></i>';
        }
    });
    
    // Adiciona o botão de alternar senha ao campo
    senhaField.parentNode.appendChild(togglePassword);

    // Carregar os dados quando a página é aberta
    loadUserData();

    // Opcional: Atualizar dados periodicamente (a cada 30 segundos)
    setInterval(loadUserData, 30000);
});