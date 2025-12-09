document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const emailInput = document.getElementById("emailInput");
  const btnLogin = document.getElementById("btnLogin");
  const mensagemErro = document.getElementById("mensagemErro");

  // MODO DE DESENVOLVIMENTO:
  const DEV_MODE = false;

  const resetError = () => {
    mensagemErro.textContent = "";
    mensagemErro.style.display = "none";
  };

  const showError = (message) => {
    mensagemErro.textContent = message;
    mensagemErro.style.display = "block";
  };

  async function validarAcesso(e) {
    if (e && e.type === "submit") {
      e.preventDefault();
    }

    const email = emailInput.value.trim();
    resetError();

    if (!email) {
      showError("Por favor, insira um e-mail.");
      return;
    }

    btnLogin.disabled = true;

    try {
      let data;

      // MOCK para desenvolvimento local (sem Netlify Functions)
      if (DEV_MODE) {
        // Simula a validação localmente
        const DOMINIOS_AUTORIZADOS = ["sesc-rs.com.br", "senacrs.com.br"];

        await new Promise((resolve) => setTimeout(resolve, 500)); // Simula delay de rede

        const partes = email.split("@");
        const dominio = partes[1]?.toLowerCase();

        if (DOMINIOS_AUTORIZADOS.includes(dominio)) {
          data = {
            status: "autorizado",
            redirect: "escolha.html",
          };
        } else {
          data = {
            status: "negado",
            message: "Acesso não autorizado.",
          };
        }
      } else {
        // Modo PRODUÇÃO: Usa a Netlify Function real
        const response = await fetch("/.netlify/functions/validar-acesso", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: email }),
        });

        if (!response.ok) {
          throw new Error(`Erro HTTP: ${response.status}`);
        }

        data = await response.json();
      }

      if (data.status === "autorizado") {
        localStorage.setItem("userEmail", email);
        window.location.href = data.redirect || "escolha.html";
      } else {
        showError(data.message || "Acesso negado por erro desconhecido.");
      }
    } catch (error) {
      console.error("Erro de comunicação ou no servidor:", error);
      showError(
        "Falha ao comunicar com o servidor de validação. Verifique o console."
      );
    } finally {
      btnLogin.disabled = false;
    }
  }

  loginForm.addEventListener("submit", validarAcesso);

  emailInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      // O submit já será acionado
    }
  });
});
