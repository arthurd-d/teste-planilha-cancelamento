exports.handler = async (event) => {
    const DOMINIOS_AUTORIZADOS = [
        "sesc-rs.com.br",
        "senacrs.com.br",
        "SESC-RS.COM.BR",
        "SENACRS.COM.BR"
    ];

    // Página de destino após login autorizado
    const PAGINA_DESTINO = "src/sesc.html";

    // Verifica método e corpo
    if (event.httpMethod !== 'POST' || !event.body) {
        return {
            statusCode: 405,
            body: JSON.stringify({ message: "Método não permitido ou corpo vazio" })
        };
    }

    // Lê o JSON enviado pelo front-end
    const { email } = JSON.parse(event.body);

    if (!email) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: "E-mail não enviado." })
        };
    }

    // Extrai o domínio do e-mail
    const partes = email.split('@');
    const dominio = partes[1]?.toLowerCase();

    if (!dominio) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: "Formato de e-mail inválido." })
        };
    }

    // Valida domínio
    if (DOMINIOS_AUTORIZADOS.includes(dominio)) {
        return {
            statusCode: 200,
            body: JSON.stringify({
                status: "autorizado",
                redirect: PAGINA_DESTINO
            })
        };
    }

    // Se não autorizado
    return {
        statusCode: 200,
        body: JSON.stringify({
            status: "negado",
            message: "Acesso não autorizado."
        })
    };
};
