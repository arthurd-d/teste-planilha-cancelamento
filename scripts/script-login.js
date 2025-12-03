document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('emailInput');
    const btnLogin = document.getElementById('btnLogin');
    const mensagemErro = document.getElementById('mensagemErro');

    // Funções para resetar o estado visual do erro
    const resetError = () => {
        mensagemErro.textContent = '';
        mensagemErro.style.display = 'none';
    }

    const showError = (message) => {
        mensagemErro.textContent = message;
        mensagemErro.style.display = 'block';
    }

    async function validarAcesso(e) {
        // ESSENCIAL: Previne o envio padrão do formulário, que recarrega a página
        if (e && e.type === 'submit') {
            e.preventDefault(); 
        }

        const email = emailInput.value.trim();
        resetError();

        if (!email) {
            showError("Por favor, insira um e-mail.");
            return;
        }

        // Desabilita o botão para evitar cliques múltiplos
        btnLogin.disabled = true;

        try {
            // CORREÇÃO CRÍTICA: A URL para a Netlify Function deve ser /..netlify/functions/<nome-da-funcao>
            const response = await fetch('/.netlify/functions/validar-acesso', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: email }),
            });

            // Verifica se a resposta HTTP é OK, senão a função falhou
            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status}`);
            }

            const data = await response.json();

            // 2. Lida com a resposta do servidor
            if (data.status === 'autorizado') {
                // Redireciona APENAS se o servidor autorizou
                window.location.href = data.redirect;
            } else {
                // Exibe a mensagem de erro fornecida pelo servidor
                showError(data.message || "Acesso negado por erro desconhecido.");
            }

        } catch (error) {
            console.error('Erro de comunicação ou no servidor:', error);
            showError("Falha ao comunicar com o servidor de validação. Verifique o console.");
        } finally {
            // Reabilita o botão
            btnLogin.disabled = false;
        }
    }

    // Ouve o evento de submit do formulário, que é mais robusto que o clique isolado no botão
    loginForm.addEventListener('submit', validarAcesso);

    // Ouve a tecla Enter no campo de email
    emailInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            // Chama a função, mas o evento 'submit' também é acionado
        }
    });
});