exports.handler = async (event) => {
    //Definições de segurança
    const DOMINIOS_AUTORIZADOS = ["sesc-rs.com.br", "SESC-RS.COM.BR", "senacrs.com.br", "SENACRS.COM.BR"];
    //futuramente, quando implementado o cancelamento senac, será casa.html
    const PAGINA_DESTINO = "sesc.html"

    //garante que o método é POST e há um corpo
    if (event.httpMethod !== 'POST' || !event.body){
        return{
            statusCode: 405,
            body: JSON.stringify({message: "Método não permitido ou corpo vazio"})
        };
    }
    const partes = email.split('@');
    const dominio = partes[1];

    if (DOMINIOS_AUTORIZADOS.includes(dominio)){
        return{
            //acesso concedido
            statusCode: 200,
            body: JSON.stringify({status: 'autorizado', redirect: PAGINA_DESTINO })
        };

        }else{
            //acesso negado
            return{
                statusCode: 200,
                body: JSON.stringify({status: 'negado', message: "Acesso não autorizado"})
            };
    }
}