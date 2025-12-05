/* ---------- Estabelecimentos (nome -> código) ---------- */
const estabelecimentos = {
  "4º DISTRITO - RESTAURANTE": "1006957020",
  "ALBERTO BINS - RESTAURANTE": "2778065800",
  ALEGRETE: "1006957003",
  ANCHIETA: "2895942891",
  AZENHA: "1006956740",
  BAGÉ: "1015704848",
  "BENTO GONÇALVES": "2778140896",
  "CACHOEIRA DO SUL": "1014953569",
  CACHOEIRINHA: "1034211312",
  CAMAQUÃ: "1015704988",
  CANOAS: "1059465350",
  CARAZINHO: "1006957046",
  "CAXIAS DO SUL - RESTAURANTE": "1006956937",
  "CENTRO HISTÓRICO - RESTAURANTE": "1034211290",
  CHUÍ: "1040073198",
  COMUNIDADE: "1034211282",
  "CRUZ ALTA": "1006956929",
  ERECHIM: "1006956910",
  FARROUPILHA: "1012740967",
  "FREDERICO WESTPHALEN": "1043852465",
  "GRAMADO - HOTEL": "1013722784",
  "GRAVATAÍ - RESTAURANTE": "1020269011",
  IJUÍ: "1012456444",
  "ITAQUI (São Borja)": "1067221201",
  JAGUARAO: "2760786956",
  LAJEADO: "1006963038",
  MATRIZ: "1006956708",
  MONTENEGRO: "1012411971",
  "NOVA PRATA": "2900505741",
  "NOVO HAMBURGO": "1006956899",
  OSÓRIO: "1096168615",
  "PALMEIRA DAS MISSÕES": "1096168607",
  "PASSO FUNDO": "1006963020",
  PELOTAS: "1006956880",
  "PROTÁSIO ALVES - HOTEL": "1005526823",
  QUARAÍ: "2897596974",
  "RIO GRANDE": "1014327900",
  "SANTA CRUZ": "1006956961",
  "SANTA MARIA": "1006957143",
  "SANTA ROSA": "1006957135",
  "SANTANA DO LIVRAMENTO": "1012412013",
  SANTIAGO: "1096168623",
  "SANTO ANGELO": "1006957119",
  "SÃO BORJA": "1010678504",
  "SÃO JUDAS": "2898427327",
  "SÃO LEOPOLDO": "1006957100",
  "SÃO LUIZ GONZAGA": "1057448467",
  "SÃO SEBASTIÃO DO CAÍ (São Leopoldo)": "1096780124",
  "SÃO SEPÉ": "1096168658",
  "SESQUINHO LAJEADO": "2896300737",
  TAQUARA: "1014327862",
  "TORRES - HOTEL": "1012195470",
  TRAMANDAÍ: "1027418330",
  "TRÊS DE MAIO": "1067221244",
  "TRES DE MAIO EJA": "2897203069",
  "TRÊS PASSOS": "2898296923",
  URUGUAIANA: "1006957097",
  "VACARIA (Caxias do Sul)": "1067221252",
  "VENÂNCIO AIRES": "1012369401",
  VIAMÃO: "1045331691",
};

/* ---------- State Management (MODIFICADO: NUNCA PERSISTE) ---------- */
let state = {
  step: 1,
  dadosSescnetTable: [],
  dadosSitefWeb: [],
  dadosSitefExpress: {},
  sitefType: null,
  canalVenda: null,
  versao_sitef: null,
  // Campos do Passo 1:
  nomeCliente: null, 
  cpfCliente: null, 
  dataSolicitacao: null, 
  caixa: null, 
  numeroVenda: null, 
  nomeEstabelecimento: null,
  codigoEstabelecimento: null 
};

const STATE_KEY = "SESC_CANC_STATE";

function saveState() {
  // A FUNÇÃO NÃO FAZ NADA: IMPEDE QUALQUER PERSISTÊNCIA.
}

function loadState() {
  // LIMPA O ESTADO INICIAL E GARANTE QUE O LOCAL STORAGE ESTEJA VAZIO
  localStorage.removeItem(STATE_KEY); 
  state = {
    step: 1,
    dadosSescnetTable: [],
    dadosSitefWeb: [],
    dadosSitefExpress: {},
    sitefType: null,
    canalVenda: null,
    versao_sitef: null,
    nomeCliente: null, 
    cpfCliente: null, 
    dataSolicitacao: null, 
    caixa: null, 
    numeroVenda: null, 
    nomeEstabelecimento: null,
    codigoEstabelecimento: null
  };
}

const $ = (id) => document.getElementById(id);

/* ---------- Steps ---------- */
function updateStepIndicator() {
  const el = $("stepIndicator");
  if (el) el.textContent = `Passo ${state.step} de 6`;
}

function mostrarStep(n) {
  state.step = n;
  document
    .querySelectorAll(".step")
    .forEach((s) => s.classList.remove("active"));
  const el = document.querySelector(`#step-${n}`);
  if (el) el.classList.add("active");
  updateStepIndicator();
  saveState(); 
}

// Carrega o estado ao iniciar a aplicação (executa a limpeza)
loadState(); 

function voltar(targetStep) {
  if (targetStep < 1 || targetStep > 6) return;

  // Restrição de navegação para o passo de seleção SiTef (Passo 3)
  if (targetStep === 3 && state.canalVenda === "sitef" && state.versao_sitef) {
      targetStep = 2; 
  }
  
  state.step = targetStep;
  mostrarStep(targetStep);
}


/* ---------- Populate Establishments and Setup Step 1 Listeners ---------- */
function populaEstabelecimentos() {
  const sel = $("nomeEstabelecimento");
  if (!sel) return;
  Object.keys(estabelecimentos).forEach((nome) => {
    const opt = document.createElement("option");
    opt.value = nome;
    opt.textContent = nome;
    sel.appendChild(opt);
  });
}
populaEstabelecimentos();


/**
 * Função para forçar o input a ser um número inteiro positivo
 */
function forceIntegerInput(inputElement, min = 1) {
    let value = inputElement.value.replace(/[^0-9]/g, ''); 
    if (value.startsWith('0') && value.length > 1) {
        value = value.replace(/^0+/, ''); 
    }
    
    let numValue = Number(value);
    if (numValue < min) {
        inputElement.value = value;
    } else {
        inputElement.value = numValue.toString();
    }
    
    if (value === '') {
        inputElement.value = '';
    }
}

function maskCPF(input) {
  let v = input.value.replace(/\D/g, "").slice(0, 11);
  v = v.replace(/^(\d{3})(\d)/, "$1.$2");
  v = v.replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3");
  v = v.replace(/\.(\d{3})(\d)/, ".$1-$2");
  input.value = v;
}

/**
 * Configura os campos do Passo 1:
 */
function setupStep1() {
    const fields = ["nomeCliente", "cpfCliente", "dataSolicitacao", "caixa", "numeroVenda", "nomeEstabelecimento", "canalVenda"];
    
    fields.forEach(id => {
        const el = $(id);
        if (el) {
            // 1. Carrega o valor do State (se existir)
            el.value = state[id] || ""; 
            
            // 2. Adiciona Listener APENAS para Máscaras e Validações de UI (SEM salvar state)
            el.addEventListener("input", () => {
                if (id === "cpfCliente") maskCPF(el);
                if (id === "caixa" || id === "numeroVenda") forceIntegerInput(el, 1);
            });
            
            // 3. Listener específico para Estabelecimento (Preenche Código)
            if (id === "nomeEstabelecimento") {
                 el.addEventListener("change", (e) => {
                    const nome = e.target.value;
                    const codigo = estabelecimentos[nome] || "";
                    if ($("codigoEstabelecimento")) $("codigoEstabelecimento").value = codigo;
                    state.codigoEstabelecimento = codigo; 
                });
            }
        }
    });
    
    // Assegura que o código do estabelecimento seja preenchido ao carregar
    if (state.nomeEstabelecimento && $("codigoEstabelecimento")) {
        $("codigoEstabelecimento").value = estabelecimentos[state.nomeEstabelecimento] || "";
    }
}
setupStep1(); 
mostrarStep(state.step); 

/* ---------- Masks and Input Filters - Format Currency e NSU Normalization ---------- */
function formatCurrencyInput(el) {
  let v = el.value.replace(/\D/g, "");
  if (!v) return (el.value = "");
  while (v.length < 3) v = "0" + v;
  const cents = v.slice(-2);
  let intPart = v.slice(0, -2);
  intPart = intPart.replace(/^0+/, "") || "0";
  intPart = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  el.value = `R$ ${intPart},${cents}`;
}

if ($("valorCancelar")) {
  $("valorCancelar").addEventListener("input", () => {
    formatCurrencyInput($("valorCancelar"));
    montarResumo();
  });
}

function formatarValorSiTef(valorBruto) {
    if (typeof valorBruto !== 'string' && typeof valorBruto !== 'number') return '(Valor Inválido)';
    
    let v = String(valorBruto).replace(/\D/g, "");
    if (!v) return `R$ 0,00`;
    
    const num = Number(v) / 100;
    
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(num);
}

/**
 * Remove zeros iniciais de uma string numérica para garantir a comparação
 * de NSUs (ex: "000180" -> "180").
 */
function normalizeNSU(nsuString) {
    if (typeof nsuString !== 'string' || nsuString.trim() === '') return '';
    
    // Remove caracteres não-numéricos, converte para número (removendo zeros à esquerda)
    // e retorna como string. Se for NaN, retorna string vazia.
    const numericNsu = nsuString.replace(/\D/g, ''); 
    if (numericNsu === '') return '';

    return String(Number(numericNsu));
}

/**
 * Transforma a data de DD/MM/AAAA para 4AAMMDD.
 * Ex: 28/04/2025 -> 4250428
 */
function formatarDataSescnet(dataString) {
    if (!dataString || dataString.length < 10) return '';
    
    // Supondo formato DD/MM/AAAA
    const parts = dataString.split('/');
    if (parts.length === 3) {
        const [dia, mes, ano] = parts;
        // Pega apenas os dois últimos dígitos do ano (AA)
        const anoCurto = ano.slice(-2);
        
        // Monta a string no formato 4AAMMDD
        return `4${anoCurto}${mes}${dia}`;
    }
    
    return ''; 
}

/* ---------- Navegação Step 1 (Captura e Salva o Estado) ---------- */
if ($("btnNext1")) {
  $("btnNext1").addEventListener("click", () => {
    // 1. Captura os valores do DOM e atualiza o estado
    state.nomeCliente = $("nomeCliente") ? $("nomeCliente").value : null;
    state.cpfCliente = $("cpfCliente") ? $("cpfCliente").value : null;
    state.dataSolicitacao = $("dataSolicitacao") ? $("dataSolicitacao").value : null;
    state.caixa = $("caixa") ? $("caixa").value : null;
    state.numeroVenda = $("numeroVenda") ? $("numeroVenda").value : null;
    state.nomeEstabelecimento = $("nomeEstabelecimento") ? $("nomeEstabelecimento").value : null;
    state.canalVenda = $("canalVenda") ? $("canalVenda").value : null;
    state.codigoEstabelecimento = estabelecimentos[state.nomeEstabelecimento] || null;

    // 2. Lógica de validação
    const cpfDigits = (state.cpfCliente || "").replace(/\D/g, "");
    
    if (!state.nomeCliente || !state.nomeCliente.trim())
      return showModal("Atenção", "Preencha o nome do cliente.");
    if (!state.cpfCliente || cpfDigits.length !== 11) 
      return showModal("Atenção", "Preencha o CPF corretamente.");
    if (!state.dataSolicitacao || !state.dataSolicitacao.trim())
      return showModal("Atenção", "Preencha a data.");
    if (!state.caixa || Number(state.caixa) < 1)
      return showModal("Atenção", "O número do caixa deve ser um número inteiro positivo.");
    if (!state.numeroVenda || Number(state.numeroVenda) < 1)
      return showModal("Atenção", "O número da venda deve ser um número inteiro positivo.");
    if (!state.nomeEstabelecimento || !state.nomeEstabelecimento.trim())
      return showModal("Atenção", "Selecione o estabelecimento.");
    if (!state.canalVenda)
      return showModal("Atenção", "Selecione o canal.");
    
    // 3. Salva o estado e prossegue
    saveState();
    mostrarStep(2);
  });
}

/* ---------- Funções de Parseamento e Navegação Step 2 (SescNet) ---------- */

// Novo padrão de colunas esperadas (era 15)
const EXPECTED_COLS_SESCNET = 14; 

function parseSescnetData(rawData) {
    const lines = rawData.split(/\r?\n/).filter(Boolean);

    const firstLine = lines[0]; 
    if (!firstLine) return [];

    const parts = firstLine.split(/\t| {2,}/g).map(p => p.trim());

    // Remove colunas vazias iniciais
    while (parts.length > 0 && parts[0] === "") parts.shift();
    
    const numColunas = parts.length;
    let partsMapeamento = [...parts];

    // LÓGICA DE DETECÇÃO E AJUSTE DE COLUNAS
    let outrosPgto = "";
    let baseIndex = 0;
    
    if (numColunas === 15) {
        // Se houver 15 colunas, a 8ª coluna (índice 7) é 'Outros Pgto' e o array 
        // de mapeamento deve ser baseado no array original. 
        outrosPgto = partsMapeamento[7];
        // Se a coluna 7 existe, todos os campos de índice 8 em diante na visão do usuário
        // estão uma posição à frente.
        baseIndex = 1; 
    } else if (numColunas === 14) {
        // Se houver 14 colunas, o índice 7 é o 'Total Geral'
        outrosPgto = "";
        baseIndex = 0;
    }
    
    // Mapeamento dos índices (Ajustados com base no baseIndex)
    // Índice 0 a 6: Seq até Multa (são fixos)
    // Índice 7: Outros Pgto (se existir, é o parts[7])
    // Índice 8: Total Geral (parts[7] ou parts[8])
    // Índice 9: Tipo Liquidacao (parts[8] ou parts[9])
    
    const idx_total_geral = 7 + baseIndex;
    const idx_tipo_liquidacao = 8 + baseIndex;
    const idx_operacao_contabil = 9 + baseIndex;
    const idx_parcelas = 10 + baseIndex;
    const idx_nsu_tef = 11 + baseIndex;
    const idx_nsu_web = 12 + baseIndex;
    const idx_tid = 13 + baseIndex;
    
    // GARANTIA: Preenche o mapeamento para evitar acessos a índices que não existem
    while (partsMapeamento.length < idx_tid + 1) partsMapeamento.push("");

    const nsu_tef_raw = partsMapeamento[idx_nsu_tef] ? partsMapeamento[idx_nsu_tef].trim() : ""; 
    const nsu_web_raw = partsMapeamento[idx_nsu_web] ? partsMapeamento[idx_nsu_web].trim() : ""; 

    // Lógica para determinar o NSU principal (se houver)
    const nsu_sescnet = (nsu_tef_raw !== "0" && nsu_tef_raw !== "") 
                        ? nsu_tef_raw 
                        : (nsu_web_raw !== "0" && nsu_web_raw !== "" ? nsu_web_raw : "");
                        
    const obj = {
        seq: partsMapeamento[0],
        data_sescnet: partsMapeamento[1],
        caixa_sescnet: partsMapeamento[2],
        valor_sescnet: partsMapeamento[3],
        abatimento: partsMapeamento[4],
        juros: partsMapeamento[5],
        multa: partsMapeamento[6],
        // O campo que você vê como 7 (Outros Pgto)
        outros_pgto: outrosPgto, 
        total_geral: partsMapeamento[idx_total_geral], 
        tipo_liquidacao: partsMapeamento[idx_tipo_liquidacao], 
        operacao_contabil: partsMapeamento[idx_operacao_contabil], 
        parcelas: partsMapeamento[idx_parcelas], 
        nsu_tef: partsMapeamento[idx_nsu_tef], 
        nsu_web: partsMapeamento[idx_nsu_web], 
        nsu_sescnet: nsu_sescnet,
        tid_sescnet: partsMapeamento[idx_tid]
    };

    return [obj]; 
}


if ($("btnNext2")) {
  $("btnNext2").addEventListener("click", () => {
    // Força o processamento dos dados, caso o usuário tenha digitado em vez de colar
    document.getElementById("paste-area").dispatchEvent(new Event('input'));
    
    if (state.dadosSescnetTable.length === 0) {
        return showModal("Atenção", "Cole os dados do SescNet. Não foi possível extrair os dados da tabela.");
    }

    const dadosSescnet = state.dadosSescnetTable[0];

    // NOVO: VALIDAÇÃO PIX NO SESCNET
    const tipoLiquidacao = dadosSescnet.tipo_liquidacao || "";
    const operacaoContabil = dadosSescnet.operacao_contabil || "";
    const pixCheck = "137-PIX VIA TEF/POS";
    
    if (tipoLiquidacao.includes(pixCheck) || operacaoContabil.includes(pixCheck)) {
        return showModal("AVISO", "Operação informada se trata de um PIX, favor prosseguir com uma transação em CARTÃO");
    }

    if (state.canalVenda === "ecommerce") {
        const tid = dadosSescnet.tid_sescnet;
        if (!tid || tid.trim() === "") {
            return showModal("Atenção", 
                "TID da transação não informado. Verifique se o título está correto.<br>" + 
                "<em style='font-size: 0.9em;'>*Toda transação que ocorre no e-commerce possui um TID/Autorizador de pagamento internet</em>"
            );
        }
    }

    if (state.canalVenda === "sitef") {
        if (state.versao_sitef === "web") {
            mostrarStep(4);
        } else if (state.versao_sitef === "express") {
            mostrarStep(5);
        } else {
            mostrarStep(3);
        }
    } else {
        montarResumo();
        mostrarStep(6);
    }
  });
}

// Lógica para preencher os inputs de visualização ao colar no SescNet (Step 2)
document.getElementById("paste-area").addEventListener("paste", function (e) {
    e.preventDefault();

    let text = (e.clipboardData || window.clipboardData).getData("text");
    this.value = text;
    
    // Processa os dados
    state.dadosSescnetTable = parseSescnetData(text);

    // Mapeamento dos inputs de visualização (AJUSTADO PARA A NOVA ESTRUTURA)
    let inputs = document.querySelectorAll("#step-2 .col-input");
    
    if (state.dadosSescnetTable.length > 0) {
        const obj = state.dadosSescnetTable[0];
        // Array com os valores na ordem exata da tela, incluindo 'outros_pgto'
        const valuesInOrder = [
            obj.seq, obj.data_sescnet, obj.caixa_sescnet, obj.valor_sescnet, 
            obj.abatimento, obj.juros, obj.multa, 
            obj.outros_pgto, // NOVO CAMPO
            obj.total_geral, obj.tipo_liquidacao, obj.operacao_contabil, 
            obj.parcelas, obj.nsu_tef, obj.nsu_web, obj.tid_sescnet 
        ];

        inputs.forEach((input, idx) => {
            if (valuesInOrder[idx] !== undefined) {
                input.value = valuesInOrder[idx];
            } else {
                 input.value = '';
            }
        });
    } else {
         inputs.forEach(input => input.value = '');
    }
    
    // Limpa a textarea imediatamente após processar para não exibir o conteúdo colado
    setTimeout(() => { this.value = ''; }, 0); 
});

/* ---------- Step 3 → Tipo SiTef ---------- */
if ($("sitefWeb")) {
  $("sitefWeb").addEventListener("click", () => {
    state.sitefType = "web";
    state.versao_sitef = "web"; 
    state.dadosSitefExpress = {}; // Limpa o express
    saveState();
    mostrarStep(4);
  });
}
if ($("sitefExpress")) {
  $("sitefExpress").addEventListener("click", () => {
    state.sitefType = "express";
    state.versao_sitef = "express"; 
    state.dadosSitefWeb = []; // Limpa o web
    saveState();
    mostrarStep(5);
  });
}

/* ---------- Step 4 → SiTef Web (Antigo) ---------- */

const sitefWebColumnMap = [
    // Índice 7: Produto
    { label: "Produto", index: 7, id: null }, 
    { label: "Data", index: 1, id: "data_sitef" },
    { label: "NSU", index: 4, id: "nsu_sitef" },
    { label: "Documento", index: 9, id: "n_cartao" },
    { label: "Valor", index: 10, id: "valor_sitef" },
    { label: "Cód. Autor", index: 14, id: "aut" },
    // O resto é mapeado implicitamente
    { label: "Loja", index: 0, id: null },
    { label: "Hora", index: 2, id: null },
    { label: "PDV", index: 3, id: null },
    { label: "NSU Host", index: 5, id: null },
    { label: "Rede", index: 6, id: null },
    { label: "Transação", index: 8, id: null },
    { label: "Estado Transação", index: 11, id: null },
    { label: "Cod. Resp.", index: 12, id: null },
    { label: "Doc Cancel", index: 13, id: null },
    { label: "No. Parc.", index: 15, id: null },
    { label: "Data do lanc", index: 16, id: null },
    { label: "Usuário Pend", index: 17, id: null },
    { label: "Data Pend", index: 18, id: null },
    { label: "Hora Pend", index: 19, id: null },
    { label: "Tempo Resp. Rede", index: 20, id: null },
    { label: "Bandeira", index: 21, id: null },
    { label: "Term. Lógico", index: 22, id: null },
    { label: "Operador", index: 23, id: null },
];

if ($("sitefWebInput")) {
    $("sitefWebInput").addEventListener("input", function() {
        const inputEl = this;
        const raw = inputEl.value.trim();
        
        document.querySelectorAll("#step-4 .col-input-sitef-web").forEach(input => input.value = '');
        state.dadosSitefWeb = []; 

        if (!raw) {
             inputEl.value = ''; // Limpa o campo de texto
             return;
        }

        const valores = raw.split(/\r?\n/)[0].split(/\t/g).map(v => v.trim());
        while (valores.length > 0 && valores[0] === "") valores.shift();

        state.dadosSitefWeb = valores;
        saveState();

        document.querySelectorAll("#step-4 .label").forEach(labelEl => {
            const labelText = labelEl.textContent.trim().replace(/\.$/, '');
            
            const mapEntry = sitefWebColumnMap.find(item => item.label.replace(/\./g, '').trim() === labelText.replace(/\./g, '').trim());

            if (mapEntry) {
                let valor = valores[mapEntry.index]; // Usa 'let' para permitir modificação
                const inputResultEl = labelEl.nextElementSibling;
                
                if (inputResultEl && inputResultEl.classList.contains("col-input-sitef-web") && valor !== undefined) {
                    
                    // >> ALTERAÇÃO SOLICITADA: TRATAMENTO DA DATA (Limita aos 10 primeiros caracteres) <<
                    if (mapEntry.id === "data_sitef" && valor.length > 10) {
                        valor = valor.substring(0, 10);
                    }
                    // >> FIM DA ALTERAÇÃO <<

                    // Verifica se é valor para formatar (índice 10)
                    if (mapEntry.index === 10) {
                        inputResultEl.value = formatarValorSiTef(valor);
                    } else {
                        inputResultEl.value = valor;
                    }
                }
            }
        });

        // Limpa a textarea imediatamente após processar e atualizar o state
        inputEl.value = ''; 
    });
}

if ($("btnNext4")) {
  $("btnNext4").addEventListener("click", () => {
    // AGORA SÓ VALIDA O ESTADO ANTERIORMENTE PREENCHIDO
    
    const dados = state.dadosSitefWeb;
    const dadosSescnet = state.dadosSescnetTable[0];
    
    if (dados.length === 0) {
        return showModal("Atenção", "Cole a linha tabulada do SiTef Web (Antigo) na caixa de texto.");
    }
    // Verificação relaxada para permitir menos colunas, mas avisa se faltarem as críticas
    if (dados.length < 15) showModal("Aviso", "Os dados do SiTef Web parecem incompletos (menos de 15 colunas). Verifique a cópia."); 

    const nsuSitefRaw = dados[4] ? dados[4].trim() : '';
    const nsuSescnetRaw = dadosSescnet.nsu_sescnet ? dadosSescnet.nsu_sescnet.trim() : '';
    
    // Normaliza ambos os NSUs para comparação
    const nsuSitef = normalizeNSU(nsuSitefRaw);
    const nsuSescnet = normalizeNSU(nsuSescnetRaw);

    // VALIDAÇÃO PIX NO SITEF WEB
    const produtoSitefWeb = dados[7] ? dados[7].trim() : ''; // Index 7 é Produto
    if (produtoSitefWeb.toUpperCase() === "PIX") {
        return showModal("AVISO", "Operação informada se trata de um PIX, favor prosseguir com uma transação em CARTÃO");
    }

    if (nsuSitef !== nsuSescnet) {
        return showModal("AVISO", 
            `O NSU do SiTef informado não corresponde ao NSU Sescnet. <br>
            <br>
            <b>NSU SITEF (Normalizado):</b> ${nsuSitef} (Original: ${nsuSitefRaw})<br>
            <b>NSU SESCNET (Normalizado):</b> ${nsuSescnet} (Original: ${nsuSescnetRaw})<br>
            <br>
            Favor revisar as informações`
        );
    }
    
    if (!dados[1] || !dados[4] || !dados[14]) {
        return showModal("Atenção", "Dados críticos (Data, NSU e/ou Cód. Autor) não encontrados nos dados colados do SiTef Web. Verifique se o relatório está completo.");
    }

    montarResumo();
    mostrarStep(6);
  });
}

/* ---------- Step 5 → SiTef Express (Novo) ---------- */


function normalizeKey(key) {
    if (!key) return '';
    return key
        .trim()
        .replace(/\.$/, '') 
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, ' '); 
}

if ($("sitefExpressInput")) {
    $("sitefExpressInput").addEventListener("input", function() {
        const inputEl = this;
        const raw = inputEl.value.trim();
        
        document.querySelectorAll("#step-5 .col-input-sitef").forEach(input => input.value = '');
        state.dadosSitefExpress = {}; 

        if (!raw) {
             inputEl.value = ''; // Limpa o campo de texto
             return;
        }

        const map = {};
        raw.split(/\r?\n/).forEach((ln) => {
            const parts = ln.split(/:\s*|\t/, 2); 
            if (parts.length === 2) {
                let k = normalizeKey(parts[0]);
                let v = parts[1].trim();

                if (k && v) {
                    // >> ALTERAÇÃO SOLICITADA: TRATAMENTO DA DATA (Limita aos 10 primeiros caracteres) <<
                    if (k === "Data" && v.length > 10) {
                        v = v.substring(0, 10);
                    }
                    // >> FIM DA ALTERAÇÃO <<
                    
                    map[k] = v;
                }
            }
        });

        document.querySelectorAll("#step-5 .label").forEach(labelEl => {
            const labelText = normalizeKey(labelEl.textContent); 

            const valor = map[labelText];
            if (valor !== undefined) {
                const inputResultEl = labelEl.nextElementSibling;
                if (inputResultEl && inputResultEl.classList.contains("col-input-sitef")) {
                    
                    // A LÓGICA ANTIGA FOI REMOVIDA POIS AGORA O CORTE É FEITO NO 'map'
                    inputResultEl.value = valor;
                }
            }
        });
        
        state.dadosSitefExpress = map; 
        saveState();

        // Limpa a textarea imediatamente após processar e atualizar o state
        inputEl.value = ''; 
    });
}

if ($("btnNext5")) {
  $("btnNext5").addEventListener("click", () => {


    const dadosSescnet = state.dadosSescnetTable[0];

    // Valida se o estado foi preenchido
    if (Object.keys(state.dadosSitefExpress).length === 0) {
        return showModal("Atenção", "Cole os dados do SiTef Express. Não foi possível extrair os dados. Verifique o formato.");
    }

    if (!state.dadosSitefExpress["Data"] || !state.dadosSitefExpress["NSU"]) {
         return showModal("Atenção", "Não foi possível extrair os dados críticos (Data e NSU) do SiTef Express. Verifique a formatação colada.");
    }
    
    // VALIDAÇÃO PIX NO SITEF EXPRESS
    const tipoProdutoExpress = state.dadosSitefExpress["Tipo Produto"] ? state.dadosSitefExpress["Tipo Produto"].trim() : '';
    if (tipoProdutoExpress.toUpperCase() === "PIX") {
        return showModal("AVISO", "Operação informada se trata de um PIX, favor prosseguir com uma transação em CARTÃO");
    }

    const nsuSitefRaw = state.dadosSitefExpress["NSU"] ? state.dadosSitefExpress["NSU"].trim() : '';
    const nsuSescnetRaw = dadosSescnet.nsu_sescnet ? dadosSescnet.nsu_sescnet.trim() : '';

    // Normaliza ambos os NSUs para comparação
    const nsuSitef = normalizeNSU(nsuSitefRaw);
    const nsuSescnet = normalizeNSU(nsuSescnetRaw);

    if (nsuSitef !== nsuSescnet) {
        return showModal("AVISO", 
            `O NSU do SiTef informado não corresponde ao NSU Sescnet. <br>
            <br>
            <b>NSU SITEF (Normalizado):</b> ${nsuSitef} (Original: ${nsuSitefRaw})<br>
            <b>NSU SESCNET (Normalizado):</b> ${nsuSescnet} (Original: ${nsuSescnetRaw})<br>
            <br>
            Favor revisar as informações`
        );
    }

    montarResumo();
    mostrarStep(6);
  });
}

/* ---------- Montar Resumo ---------- */
function parseCurrencyToNumber(value) {
  if (!value) return 0;
  return Number(
    value
      .replace(/[^\d,]/g, "") 
      .replace(/\./g, "") 
      .replace(",", ".") 
  );
}

function montarResumo() {
  const summaryBox = $("summaryBox");
  if (!summaryBox) return;

  let valorCardFormatado = "(Não aplicável)";
  let valorTransacaoNum = 0;
  
  // Condições que usam dados Sescnet: E-commerce, POS, ou qualquer outro canal que não seja SiTef,
  // ou se for SiTef e os dados dele não foram preenchidos (o que não deve acontecer na navegação normal)
  const isSescnetOnly = state.canalVenda === "ecommerce" || state.canalVenda === "pos";
  const dadosSescnet = state.dadosSescnetTable[0];

  if (dadosSescnet) {
      if (isSescnetOnly) {
         // APLICANDO A REGRA: E-commerce e POS usam o valor_sescnet.
         valorCardFormatado = dadosSescnet.valor_sescnet || "(não encontrado)";
         valorTransacaoNum = parseCurrencyToNumber(dadosSescnet.valor_sescnet);
      
      } else if (state.canalVenda === "sitef") {
        
        if (state.versao_sitef === "web" && state.dadosSitefWeb.length > 0) {
          const valorBrutoSitef = $("valor_sitef") ? $("valor_sitef").value : '0';
          valorTransacaoNum = parseCurrencyToNumber(valorBrutoSitef); // Pega o valor formatado e converte
          valorCardFormatado = valorBrutoSitef; // Já está formatado
          
        } else if (state.versao_sitef === "express" && Object.keys(state.dadosSitefExpress).length > 0) {
          const valorBrutoExpress = state.dadosSitefExpress["Valor"] || "0";
          // Tenta extrair o valor numérico da string SiTef Express
          const valorParaParse = valorBrutoExpress.replace(/[^\d,]/g, "").replace(",", ".");
          valorTransacaoNum = Number(valorParaParse) || 0;
          
          // Formata apenas se for um valor limpo de SiTef. Se for formatado como R$, usa direto
          if (valorBrutoExpress.includes('R$')) {
               valorCardFormatado = valorBrutoExpress;
          } else {
               valorCardFormatado = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valorTransacaoNum);
          }
        } else {
             // Fallback para Sescnet se SiTef não carregou
             valorCardFormatado = dadosSescnet.valor_sescnet || "(não encontrado)";
             valorTransacaoNum = parseCurrencyToNumber(dadosSescnet.valor_sescnet);
        }
      } 
  }

  const nomeCliente = state.nomeCliente || "";
  const cpfCliente = state.cpfCliente || "";
  const nomeEstabelecimento = state.nomeEstabelecimento || "";
  const caixa = state.caixa || "";
  const numeroVenda = state.numeroVenda || "";
  const valorCancelar = $("valorCancelar") ? $("valorCancelar").value : "(pendente)";

  summaryBox.innerHTML = `
    <div><b>Cliente:</b> ${nomeCliente}</div>
    <div><b>CPF:</b> ${cpfCliente}</div>
    <hr>
    <div><b>Estabelecimento:</b> ${nomeEstabelecimento}</div>
    <div><b>Caixa:</b> ${caixa}</div>
    <div><b>Venda:</b> ${numeroVenda}</div>
    <hr>
    <div><b>Valor transação cartão/pago:</b> ${valorCardFormatado}</div>
    <div><b>Valor a cancelar:</b> ${valorCancelar}</div>
  `;
}

/* ---------- Limpar Step Atual (NOVO BOTÃO) ---------- */
function limparStepAtual() {
    switch (state.step) {
        case 1:
            // Limpa inputs do Passo 1 e reseta o state
            document.querySelectorAll("#step-1 input, #step-1 select").forEach(input => input.value = '');
            document.querySelectorAll("#step-1 select").forEach(select => select.selectedIndex = 0);
            state = { ...state, 
                nomeCliente: null, cpfCliente: null, dataSolicitacao: null, caixa: null, numeroVenda: null, 
                nomeEstabelecimento: null, canalVenda: null, versao_sitef: null, codigoEstabelecimento: null
            };
            setupStep1(); // Re-configura listeners e valores iniciais
            break;
        case 2:
            // Limpa dados do Sescnet
            document.querySelectorAll("#step-2 .col-input").forEach(input => input.value = '');
            if ($("paste-area")) $("paste-area").value = '';
            state.dadosSescnetTable = [];
            break;
        case 3:
            // Limpa seleção SiTef, forçando o usuário a re-selecionar ao retornar
            state.sitefType = null;
            state.versao_sitef = null;
            break;
        case 4:
            // Limpa SiTef Web
            document.querySelectorAll("#step-4 .col-input-sitef-web").forEach(input => input.value = '');
            if ($("sitefWebInput")) $("sitefWebInput").value = '';
            state.dadosSitefWeb = [];
            state.versao_sitef = null; 
            break;
        case 5:
            // Limpa SiTef Express
            document.querySelectorAll("#step-5 .col-input-sitef").forEach(input => input.value = '');
            if ($("sitefExpressInput")) $("sitefExpressInput").value = '';
            state.dadosSitefExpress = {};
            state.versao_sitef = null; 
            break;
        case 6:
            // Limpa valor a cancelar
            if ($("valorCancelar")) $("valorCancelar").value = '';
            montarResumo(); 
            break;
    }
    showModal("Limpeza Concluída", `As informações do **Passo ${state.step}** foram apagadas.`);
    saveState();
}

/* ------------------------------------------------------------------ */
/* ---------- NOVA FUNÇÃO: Obter prefixo do email do usuário ---------- */
/* ------------------------------------------------------------------ */
function getUserPrefix() {
    // A chave 'userEmail' deve ter sido salva no localStorage pelo script-login.js
    const email = localStorage.getItem('userEmail');
    if (email) {
        // Extrai a parte antes do '@'
        const prefixo = email.split('@')[0];
        // Remove a chave do localStorage após o uso (boa prática)
        localStorage.removeItem('userEmail'); 
        return prefixo;
    }
    return "usuario_nao_identificado";
}


/**
 * Converte um ArrayBuffer (como o retornado por fetch) para uma string Base64.
 * @param {ArrayBuffer} buffer - O buffer de dados binários da imagem.
 * @param {string} mimeType - O tipo MIME da imagem (ex: 'image/png').
 * @returns {string} String Base64 formatada com o tipo MIME.
 */
function arrayBufferToBase64(buffer, mimeType) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    // Retorna a string Base64 completa com o prefixo do tipo MIME
    return `data:${mimeType};base64,${btoa(binary)}`;
}


/* ------------------------------------------------------------------ */
/* -------------------- ExcelJS Export (Gerar Excel) ------------------ */
/* ------------------------------------------------------------------ */
async function gerarExcelPreenchido() {
  const valorCancelarRaw = $("valorCancelar") ? $("valorCancelar").value.trim() : "";
  const valorCancelarNum = parseCurrencyToNumber(valorCancelarRaw);
  
  // INICIALIZAÇÃO DE VARIÁVEIS DE CAPA PARA GARANTIR QUE NÃO SEJAM UNDEFINED
  let n_cartao = "";
  let valorTransacaoFinal = "";
  
  if (!valorCancelarRaw || valorCancelarNum <= 0) 
    return showModal("Atenção", "Informe um valor a cancelar válido e maior que zero.");

  let valorTransacaoNum = 0;
  
  
  const dadosSescnet = state.dadosSescnetTable[0];
  
  // 1. Lógica para determinar o valor de referência e variáveis de CAPA (n_cartao, valor)
  if (state.canalVenda === "sitef") {
    
    if (state.versao_sitef === "web" && state.dadosSitefWeb.length > 0) {
      const valorBrutoSitef = $("valor_sitef") ? $("valor_sitef").value : '0';
      valorTransacaoNum = parseCurrencyToNumber(valorBrutoSitef);
      
      // CAPA
      n_cartao = state.dadosSitefWeb[9] || "";     // Documento (índice 9)
      valorTransacaoFinal = valorBrutoSitef; // Valor formatado

    } else if (state.versao_sitef === "express" && Object.keys(state.dadosSitefExpress).length > 0) {
      const valorBrutoExpress = state.dadosSitefExpress["Valor"] || "0";
      const valorParaParse = valorBrutoExpress.replace(/[^\d,]/g, "").replace(",", ".");
      valorTransacaoNum = Number(valorParaParse) || 0;

      // CAPA
      n_cartao = state.dadosSitefExpress["Número do Cartão"] || "";
      valorTransacaoFinal = valorBrutoExpress; 
    }
  } 
  
  // Se não for SiTef ou se a extração do SiTef falhou (usa SescNet)
  if (valorTransacaoNum === 0 && dadosSescnet) {
     valorTransacaoNum = parseCurrencyToNumber(dadosSescnet.valor_sescnet);
     
     // CAPA
     // Preferência por TID, depois NSU. Se ambos forem vazios, mantém "" (inicializado no topo)
     n_cartao = dadosSescnet.tid_sescnet || dadosSescnet.nsu_sescnet || ""; 
     valorTransacaoFinal = dadosSescnet.valor_sescnet || "";
  }
  
  // 3. Validação do valor
  if (valorCancelarNum > valorTransacaoNum) {
      const formatadoCancelar = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valorCancelarNum);
      const formatadoTransacao = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valorTransacaoNum);
      return showModal("AVISO", 
          `O valor a cancelar (**${formatadoCancelar}**) é maior que o valor original da transação (**${formatadoTransacao}**). <br><br>
          Favor ajustar o valor.`
      );
  }

  const workbook = new ExcelJS.Workbook();
  
  // Variáveis para IDs das Imagens
  let logoSescnetId, logoSescId, sitefAntigoId, sitefNovoId;

  try {
    showLoading(true, "Carregando template e imagens...");
    
    // --- 1. CARREGAMENTO E CONVERSÃO DAS IMAGENS ---
    
    const [templateResp, sescnetResp, sescResp, sitefAntigoResp, sitefNovoResp] = await Promise.all([
        fetch("/excel/template.xlsx"),
        fetch("/assets/logo-sesc.png"),
    ]);

    if (!templateResp.ok) throw new Error(`Erro HTTP ao carregar template: ${templateResp.status}`);
    if (!sescnetResp.ok) throw new Error(`Erro HTTP ao carregar logoSESCNET.png: ${sescnetResp.status}`);
    if (!sescResp.ok) throw new Error(`Erro HTTP ao carregar logo-sesc.png: ${sescResp.status}`);
    if (!sitefAntigoResp.ok) throw new Error(`Erro HTTP ao carregar sitefantigo.jpg: ${sitefAntigoResp.status}`);
    if (!sitefNovoResp.ok) throw new Error(`Erro HTTP ao carregar sitefnovo.jpg: ${sitefNovoResp.status}`);
    
    
    // Converte os buffers das imagens
    const [
        buffer, 
        sescnetBuffer, 
        sescBuffer, 
        sitefAntigoBuffer, 
        sitefNovoBuffer
    ] = await Promise.all([
        templateResp.arrayBuffer(), 
        sescnetResp.arrayBuffer(), 
        sescResp.arrayBuffer(), 
        sitefAntigoResp.arrayBuffer(), 
        sitefNovoResp.arrayBuffer()
    ]);
    
    // Carrega o template
    await workbook.xlsx.load(buffer);
    
    // --- 2. ADICIONAR IMAGENS AO WORKBOOK (Obter IDs) ---
    logoSescnetId = workbook.addImage({
      base64: arrayBufferToBase64(sescnetBuffer, "image/png"),
      extension: 'png',
    });
    
    logoSescId = workbook.addImage({
      base64: arrayBufferToBase64(sescBuffer, "image/png"),
      extension: 'png',
    });
    
    sitefAntigoId = workbook.addImage({
      base64: arrayBufferToBase64(sitefAntigoBuffer, "image/jpeg"),
      extension: 'jpeg',
    });

    sitefNovoId = workbook.addImage({
      base64: arrayBufferToBase64(sitefNovoBuffer, "image/jpeg"),
      extension: 'jpeg',
    });

  } catch (e) {
    showLoading(false);
    return showModal("Erro", "Erro carregando recursos e template.xlsx<br>" + (e.message || e));
  }

  try {
    const sheetCapa = workbook.getWorksheet("CAPA");
    const sheetTransacao = workbook.getWorksheet("TRANSACAO");
    
    // --- 3. INSERÇÃO DAS IMAGENS NA PLANILHA ---

    // /assets/logo-sesc.png em CAPA H9
    // Ajustado para ocupar uma área (H9 a I10, por exemplo) para ser visível
    if (logoSescId) sheetCapa.addImage(logoSescId, 'H9:N18'); 

    
    // =======================================================
    // PREENCHIMENTO DA PLANILHA CAPA
    // =======================================================

    // Preenche a CAPA
    sheetCapa.getCell("E16").value = state.nomeCliente || "";
    sheetCapa.getCell("E17").value = state.cpfCliente || "";
    sheetCapa.getCell("E14").value = estabelecimentos[state.nomeEstabelecimento] || "";

    // Converte a data do formato yyyy-mm-dd para objeto Date
    const [year, month, day] = (state.dataSolicitacao || "").split('-').map(Number);
    
    // >> TRATAMENTO DA DATA DO SITEF WEB/EXPRESS PARA O EXCEL (E10) <<
    let dataReferenciaCapa = state.dataSolicitacao || "";
    
    if (state.canalVenda === "sitef") {
        if (state.versao_sitef === "web" && state.dadosSitefWeb.length > 0) {
            const dataSitefRaw = state.dadosSitefWeb[1] || ""; // Índice 1 é a Data
            if (dataSitefRaw.length > 10) {
                dataReferenciaCapa = dataSitefRaw.substring(0, 10);
            } else {
                dataReferenciaCapa = dataSitefRaw;
            }
        } else if (state.versao_sitef === "express" && Object.keys(state.dadosSitefExpress).length > 0) {
            const dataExpressRaw = state.dadosSitefExpress["Data"] || "";
            if (dataExpressRaw.length > 10) {
                dataReferenciaCapa = dataExpressRaw.substring(0, 10);
            } else {
                dataReferenciaCapa = dataExpressRaw;
            }
        }
    }
    // >> FIM DO TRATAMENTO <<
    
    if (year && month && day) {
        // ExcelJS espera um objeto Date (Date(ano, mês-1, dia))
        sheetCapa.getCell("E10").value = new Date(year, month - 1, day); 
    } else {
         // Se a data de solicitação não estiver preenchida, usa a data do SiTef (se aplicável)
         sheetCapa.getCell("E10").value = dataReferenciaCapa; 
    }
    
    sheetCapa.getCell("E11").value = Number(state.caixa || 0);

    // E23: Valor a Cancelar (Número puro)
    sheetCapa.getCell("E23").value = valorCancelarNum; 
    
    sheetCapa.getCell("E12").value = state.numeroVenda;

    sheetCapa.getCell("E13").value = state.nomeEstabelecimento;

    sheetCapa.getCell("E19").value = state.canalVenda;
    
    // Células da CAPA preenchidas com as variáveis
    sheetCapa.getCell("E20").value = n_cartao;
    sheetCapa.getCell("E22").value = valorTransacaoFinal;

    // =======================================================
    // NOVO: Preenchimento Log do usuário
    // =======================================================
    
    const usuario = getUserPrefix(); // Obtém o prefixo do email
    const now = new Date();
    
    // Formata o horário (HH:MM:SS) e a data (DD/MM/AAAA)
    const horario = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const dataGerada = now.toLocaleDateString('pt-BR');
    
    const logText = `Planilha gerada via site por ${usuario} às ${horario}, dia ${dataGerada}`;
    // CÉLULA ALTERADA DE E25 PARA I23
    sheetCapa.getCell("I23").value = logText;
    
    // =======================================================
    // PREENCHIMENTO DA PLANILHA TRANSACAO 
    // =======================================================

    // 1. SESCNET (C3)
    if (dadosSescnet) {
        // Gera o array de valores na ordem da planilha (C3, D3, E3, etc.)
        const valuesInOrder = [
            dadosSescnet.seq, dadosSescnet.data_sescnet, dadosSescnet.caixa_sescnet, 
            dadosSescnet.valor_sescnet, dadosSescnet.abatimento, dadosSescnet.juros, 
            dadosSescnet.multa, 
            dadosSescnet.outros_pgto, // Índice 7: Outros Pgto
            dadosSescnet.total_geral, dadosSescnet.tipo_liquidacao, dadosSescnet.operacao_contabil, 
            dadosSescnet.parcelas, dadosSescnet.nsu_tef, dadosSescnet.nsu_web, dadosSescnet.tid_sescnet
        ];
        
        const row = sheetTransacao.getRow(3);
        
        // Coluna C é a de índice 3 no ExcelJS
        let colIndex = 3; 
        
        // Preenche C3, D3, E3, F3, ...
        valuesInOrder.forEach(valor => {
            row.getCell(colIndex).value = valor;
            colIndex++;
        });
    }
    
    // 2. SITEF WEB (C6)
    if (state.canalVenda === "sitef" && state.versao_sitef === "web" && state.dadosSitefWeb.length > 0) {
         // Colar valores brutos do SiTef Web na C6 (colunas se expandem)
         sheetTransacao.getRow(6).values = { 3: state.dadosSitefWeb };
         
    } 
    
    // 3. SITEF EXPRESS (C9, quebrando linha - Chave/Valor)
    if (state.canalVenda === "sitef" && state.versao_sitef === "express" && Object.keys(state.dadosSitefExpress).length > 0) {
         // Colar Chave (C) e Valor (D) do SiTef Express a partir da C9
         let rowNum = 9;
         for (const [key, value] of Object.entries(state.dadosSitefExpress)) {
             const row = sheetTransacao.getRow(rowNum);
             row.getCell('C').value = key;
             row.getCell('D').value = value;
             rowNum++;
         }
    }


    const out = await workbook.xlsx.writeBuffer();
    triggerDownload(
      new Blob([out], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      }),
      "solicitacao_cancelamento_sesc.xlsx"
    );

    showLoading(false);
    
    // LIMPA O ESTADO E REINICIA
    loadState(); 
    
    showModal("Sucesso", "Arquivo gerado com sucesso! O sistema será reiniciado.", {
        onOk: () => {
            window.location.href = "/index.html"; 
        }
    });

  } catch (e) {
    showLoading(false);
    showModal("Erro", "Erro ao gerar arquivo: " + (e.message || e));
  }
}

/* ---------- Download utility ---------- */
function triggerDownload(blob, filename) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 500);
}

/* ---------- Botão Gerar (Step 6) ---------- */
if ($("btnGenerate")) $("btnGenerate").addEventListener("click", gerarExcelPreenchido);

/* ---------- MODAL SYSTEM (cria dinamicamente se não existir) e Helpers ---------- */
(function ensureModalsExist() {
  function createFromHTML(html) {
    const tpl = document.createElement("template");
    tpl.innerHTML = html.trim();
    return tpl.content.firstChild;
  }

  // MESSAGE MODAL (ok)
  if (!document.getElementById("modal")) {
    const modalHtml = `
      <div id="modal" class="modal hidden" aria-hidden="true">
        <div class="modal-content" role="dialog" aria-modal="true" aria-labelledby="modal-title">
          <h3 id="modal-title" style="margin:0 0 .6rem 0; font-size:18px;"></h3>
          <div id="modal-message" style="font-size:14px; color:#0b1720; line-height:1.4;"></div>
          <div class="modal-actions" style="display:flex; justify-content:center; gap:12px; margin-top:1rem;">
            <button id="modal-ok" class="btn primary" style="min-width:100px; text-transform:none;">OK</button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(createFromHTML(modalHtml));
  }

  // LOADING MODAL
  if (!document.getElementById("modalLoading")) {
    const loadingHtml = `
      <div id="modalLoading" class="modal hidden" aria-hidden="true">
        <div class="modal-content" style="display:flex; align-items:center; gap:12px;">
          <div class="spinner" aria-hidden="true" style="width:40px;height:40px;border-radius:50%;border:4px solid #e6eef9;border-top-color:var(--blue); animation:spin 1s linear infinite;"></div>
          <div id="modalLoading-message" style="font-size:14px; color:#0b1720;">Carregando...</div>
        </div>
      </div>
      <style>
        @keyframes spin { to { transform: rotate(360deg); } }
      </style>
    `;
    document.body.appendChild(createFromHTML(loadingHtml));
  }
})();

function showModal(title, message, options = {}) {
  const modal = document.getElementById("modal");
  if (!modal) return; 
  const titleEl = document.getElementById("modal-title");
  const msgEl = document.getElementById("modal-message");
  const okBtn = document.getElementById("modal-ok");

  titleEl.textContent = title || "";
  msgEl.innerHTML = message || "";

  okBtn.textContent = options.okText || "OK";

  modal.classList.remove("hidden");
  modal.setAttribute("aria-hidden", "false");

  const cleanup = () => {
    okBtn.onclick = null;
    modal.classList.add("hidden");
    modal.setAttribute("aria-hidden", "true");
  };

  okBtn.onclick = () => {
    cleanup();
    if (typeof options.onOk === "function") options.onOk();
  };
}

function showLoading(show = true, message = "Carregando...") {
  const modal = document.getElementById("modalLoading");
  if (!modal) return;
  const msg = document.getElementById("modalLoading-message");
  if (msg) msg.textContent = message;
  if (show) {
    modal.classList.remove("hidden");
    modal.setAttribute("aria-hidden", "false");
  } else {
    modal.classList.add("hidden");
    modal.setAttribute("aria-hidden", "true");
  }
}