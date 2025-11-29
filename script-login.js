document.addEventListener('DOMContentLoaded', () => {
    const emailInput = document.getElementById('emailInput');
    const btnLogin = document.getElementById('btnLogin');
    const mensagemErro = document.getElementById('mensagemErro');

    const dominiosAutorizados = ["sesc-rs.com.br", "senacrs.com.br"];
    const paginaDestino = "casa.html"; // O nome do seu arquivo principal

    function validarAcesso() {
        const email = emailInput.value.trim().toLowerCase();
        mensagemErro.style.display = 'none';

        if (!email.includes('@')) {
            mensagemErro.textContent = "Por favor, insira um endereço de e-mail válido.";
            mensagemErro.style.display = 'block';
            return;
        }

        const partes = email.split('@');
        const dominio = partes[1];

        if (dominiosAutorizados.includes(dominio)) {
            // Acesso concedido
            window.location.href = paginaDestino; 
        } else {
            // Acesso negado
            mensagemErro.textContent = "Acesso não autorizado.";
            mensagemErro.style.display = 'block';
        }
    }

    // Listener para o botão de acesso
    btnLogin.addEventListener('click', validarAcesso);

    // Opcional: Listener para a tecla Enter
    emailInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            validarAcesso();
        }
    });
});