// netlify/validar-acesso.js
exports.handler = async (event) => {
    // 1. Definições de segurança - Estão AGORA no servidor
    const DOMINIOS_AUTORIZADOS = ["sesc-rs.com.br", "senacrs.com.br"];
    const PAGINA_DESTINO = "sesc.html"; 

    // 2. Garante que o método é POST e há um corpo
    if (event.httpMethod !== 'POST' || !event.body) {
        return {
            statusCode: 405,
            body: JSON.stringify({ message: "Método não permitido ou corpo vazio." })
        };
    }

    // 3. Pega o e-mail enviado do frontend
    const data = JSON.parse(event.body);
    const email = data.email ? data.email.trim().toLowerCase() : '';

    // 4. Lógica de validação (aqui é seguro!)
    if (!email.includes('@')) {
        // Retorna um erro amigável ao frontend
        return {
            statusCode: 200, // Usamos 200 e um status 'negado' para não expor a lógica
            body: JSON.stringify({ status: 'negado', message: "E-mail inválido." })
        };
    }

    const partes = email.split('@');
    const dominio = partes[1];

    if (DOMINIOS_AUTORIZADOS.includes(dominio)) {
        // Acesso concedido! Retorna a página de destino.
        return {
            statusCode: 200,
            body: JSON.stringify({ status: 'autorizado', redirect: PAGINA_DESTINO })
        };
    } else {
        // Acesso negado!
        return {
            statusCode: 200,
            body: JSON.stringify({ status: 'negado', message: "Acesso não autorizado." })
        };
    }
};