document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('frmRemocao');
    const btnRemover = form.querySelector('button[type="submit"]');
    const btnCancelar = document.getElementById('btnCancelar');
    const originalBtnContent = btnRemover.innerHTML;

    // Função para exibir feedback visual
    function showAlert(message, type = 'success') {
        // Remove alertas anteriores
        const existingAlert = document.querySelector('.alert-dismissible');
        if (existingAlert) {
            existingAlert.remove();
        }

        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type} alert-dismissible fade show mt-3`;
        alertDiv.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'} me-2"></i>
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;
        
        form.parentNode.insertBefore(alertDiv, form.nextSibling);
    }

    // Função para validar os dados
    function validateForm(login, senha) {
        if (!login || !senha) {
            throw new Error('Por favor, preencha todos os campos');
        }
        
        if (login.length < 4) {
            throw new Error('O login deve ter pelo menos 4 caracteres');
        }
        
        if (senha.length < 6) {
            throw new Error('A senha deve ter pelo menos 6 caracteres');
        }
    }

    // Confirmação de remoção
    async function confirmRemoval() {
        return new Promise((resolve) => {
            // Usando o SweetAlert2 para confirmação (opcional)
            if (typeof Swal !== 'undefined') {
                Swal.fire({
                    title: 'Tem certeza?',
                    text: "Esta ação não pode ser desfeita!",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#dc3545',
                    cancelButtonColor: '#6c757d',
                    confirmButtonText: 'Sim, remover!',
                    cancelButtonText: 'Cancelar'
                }).then((result) => {
                    resolve(result.isConfirmed);
                });
            } else {
                // Fallback para o confirm padrão
                resolve(confirm('Tem certeza que deseja remover sua conta permanentemente?'));
            }
        });
    }

    // Manipulador do envio do formulário
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        try {
            const login = document.getElementById('txtLogin').value.trim();
            const senha = document.getElementById('txtSenha').value;

            // Validar os dados
            validateForm(login, senha);

            // Confirmar a remoção
            const isConfirmed = await confirmRemoval();
            if (!isConfirmed) return;

            // Mostrar estado de carregamento
            btnRemover.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Removendo...';
            btnRemover.disabled = true;
            btnCancelar.disabled = true;

            // Simular requisição à API (substitua pela sua implementação real)
            const response = await fetch('/api/remover', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ login, senha })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Erro ao remover conta');
            }

            const result = await response.json();
            
            // Feedback de sucesso
            showAlert(result.message || 'Conta removida com sucesso', 'success');
            btnRemover.innerHTML = '<i class="fas fa-check-circle me-2"></i>Removido!';
            btnRemover.classList.add('disabled');

            // Redirecionar após 2 segundos
            setTimeout(() => {
                window.location.href = 'login.html'; // Redirecionar para a página de login
            }, 2000);

        } catch (error) {
            console.error('Erro na remoção:', error);
            showAlert(error.message || 'Erro ao remover conta', 'danger');
            
            // Restaurar botões
            btnRemover.innerHTML = originalBtnContent;
            btnRemover.disabled = false;
            btnCancelar.disabled = false;
        }
    });

    // Carregar dados do usuário logado (opcional)
    async function loadUserData() {
        try {
            // Simulação - substitua pela sua chamada real à API
            const mockUser = {
                login: 'usuario.exemplo'
            };
            
            document.getElementById('txtLogin').value = mockUser.login;
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
        }
    }

    // Carregar dados ao iniciar
    loadUserData();
});