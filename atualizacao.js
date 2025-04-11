document.getElementById('frmAtualizacao').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('selId').value;
    const nome = document.getElementById('txtNome').value;
    const login = document.getElementById('txtLogin').value;
    const senha = document.getElementById('txtSenha').value;
    const notificacao = document.getElementById('notificacao');

    if (nome.trim().length == 0) {
        notificacao.innerHTML = "<b class=\"text-danger\">É necessário digitar um nome para continuar.</b>";
        txtNome.focus();
        return false;
    }

    if (login.trim().length == 0) {
        notificacao.innerHTML = "<b class=\"text-danger\">É necessário digitar um login para continuar.</b>";
        txtLogin.focus();
        return false;
    }

    if (senha.trim().length == 0) {
        notificacao.innerHTML = "<b class=\"text-danger\">É necessário digitar uma senha para continuar.</b>";
        txtSenha.focus();
        return false;
    }

    const txtId = document.getElementById("txtId");
    const txtNome = document.getElementById("txtNome");
    const txtLogin = document.getElementById("txtLogin");
    const txtSenha = document.getElementById("txtSenha");
    var selId = document.getElementById("selId");
    selId = selId.options[selId.selectedIndex];

    if (
        selId.text == txtNome.value && 
        selId.dataset.login == txtLogin.value && 
        selId.dataset.senha == txtSenha.value
    ) {
        notificacao.innerHTML = "<b class=\"text-danger\">Não há alteração a ser atualizada no banco de dados.</b>";
        return false;
    }

    const tipo = 'atualizar';

    const response = await fetch('/api/mysql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, login, senha, tipo, id })
    });

    const result = await response.json();
    console.log(result.message);

    notificacao.innerText = result.message;
});

window.addEventListener('load', async (e) => {
    e.preventDefault();

    const nome = document.getElementById('txtNome').value;
    const login = document.getElementById('txtLogin').value;
    const notificacao = document.getElementById('notificacao');
    const senha = document.getElementById('txtSenha').value;
    const id = document.getElementById('txtId').value;
    const selId = document.getElementById('selId');
    const tipo = 'atualizacao';

    const response = await fetch('/api/mysql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, login, senha, tipo, id })
    });

    const result = await response.json();
    // console.log(result.rows.length);
    let optTmp;
    for (let i = 0; i < result.rows.length; i++) {
        // console.log(result.rows[i].id);
        optTmp = document.createElement("option");
        optTmp.value = result.rows[i].id;
        optTmp.text = result.rows[i].nome;
        optTmp.dataset.login = result.rows[i].login;
        optTmp.dataset.senha = result.rows[i].senha;
        selId.add(optTmp);
    }
    notificacao.innerText = "Dados carregados com sucesso!";
});

document.getElementById('selId').addEventListener('change', () => {
    let txtId = document.getElementById("txtId");
    let txtNome = document.getElementById("txtNome");
    let txtLogin = document.getElementById("txtLogin");
    let txtSenha = document.getElementById("txtSenha");
    let selId = document.getElementById("selId");

    selId = selId.options[selId.selectedIndex];
    // console.log(selId);
    if (selId.dataset.login) {
        txtId.value = selId.value;
        txtNome.value = selId.text;
        txtLogin.value = selId.dataset.login;
        txtSenha.value = selId.dataset.senha;
    } else {
        txtId.value = "";
        txtNome.value = "";
        txtLogin.value = "";
        txtSenha.value = "";
    }
});