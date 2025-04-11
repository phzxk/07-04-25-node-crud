document.getElementById('frmCadastro').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    try {
        // Obter elementos uma vez
        const elements = {
            nome: document.getElementById('txtNome'),
            login: document.getElementById('txtLogin'),
            senha: document.getElementById('txtSenha')
        };

        // Validação básica
        if (!elements.nome.value || !elements.login.value || !elements.senha.value) {
            throw new Error('Todos os campos são obrigatórios');
        }

        // Feedback visual durante o envio
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Cadastrando...';
        submitBtn.disabled = true;

        // Envio dos dados
        const response = await fetch('/api/mysql', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                nome: elements.nome.value.trim(),
                login: elements.login.value.trim(),
                senha: elements.senha.value
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Erro no cadastro');
        }

        const result = await response.json();
        
        // Feedback visual de sucesso
        submitBtn.innerHTML = '<i class="fas fa-check"></i> Cadastrado!';
        submitBtn.style.backgroundColor = '#2ecc71';
        
        // Reset do formulário após 2 segundos
        setTimeout(() => {
            e.target.reset();
            submitBtn.innerHTML = originalBtnText;
            submitBtn.style.backgroundColor = '';
            submitBtn.disabled = false;
        }, 2000);

        // Exibir mensagem para o usuário
        alert(result.message || 'Cadastro realizado com sucesso!');

    } catch (error) {
        console.error('Erro no cadastro:', error.message);
        
        // Restaurar botão
        const submitBtn = e.target.querySelector('button[type="submit"]');
        submitBtn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Tentar novamente';
        submitBtn.disabled = false;
        
        // Exibir mensagem de erro
        alert(error.message || 'Ocorreu um erro durante o cadastro');
    }
});