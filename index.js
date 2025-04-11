document.getElementById('frmCadastro').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Elementos da interface
    const form = e.target;
    const btnSubmit = form.querySelector('button[type="submit"]');
    const originalBtnContent = btnSubmit.innerHTML;
    
    // Ativar estado de carregamento
    btnSubmit.disabled = true;
    btnSubmit.innerHTML = `
        <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
        Cadastrando...
    `;
    btnSubmit.classList.add('processing');
    
    try {
        // Obter valores do formulário
        const nome = document.getElementById('txtNome').value.trim();
        const login = document.getElementById('txtLogin').value.trim();
        const senha = document.getElementById('txtSenha').value;
        const tipo = 'cadastro';
        
        // Validação básica
        if (!nome || !login || !senha) {
            throw new Error('Por favor, preencha todos os campos');
        }
        
        if (senha.length < 6) {
            throw new Error('A senha deve ter pelo menos 6 caracteres');
        }
        
        // Enviar dados para a API
        const response = await fetch('/api/mysql', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: JSON.stringify({ nome, login, senha, tipo })
        });
        
        // Verificar resposta
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Erro ao cadastrar usuário');
        }
        
        const result = await response.json();
        
        // Feedback visual de sucesso
        showFeedback('success', result.message || 'Cadastro realizado com sucesso!');
        
        // Limpar formulário após sucesso
        form.reset();
        
        // Efeito visual no botão
        btnSubmit.classList.add('success');
        setTimeout(() => btnSubmit.classList.remove('success'), 2000);
        
    } catch (error) {
        // Feedback visual de erro
        showFeedback('danger', error.message);
        console.error('Erro no cadastro:', error);
        
    } finally {
        // Restaurar botão
        btnSubmit.disabled = false;
        btnSubmit.innerHTML = originalBtnContent;
        btnSubmit.classList.remove('processing');
    }
});

// Função para mostrar feedback
function showFeedback(type, message) {
    // Remove feedbacks anteriores
    const oldFeedback = document.querySelector('.feedback-message');
    if (oldFeedback) oldFeedback.remove();
    
    // Cria novo elemento de feedback
    const feedback = document.createElement('div');
    feedback.className = `feedback-message alert alert-${type} mt-3`;
    feedback.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-triangle'} me-2"></i>
        ${message}
    `;
    
    // Adiciona ao formulário
    const form = document.getElementById('frmCadastro');
    form.appendChild(feedback);
    
    // Remove após 5 segundos
    setTimeout(() => {
        feedback.classList.add('fade-out');
        setTimeout(() => feedback.remove(), 300);
    }, 5000);
}