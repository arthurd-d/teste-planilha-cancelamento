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

/* ---------- Masks and Input Filters - Format Currency ---------- */
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

function parseSescnetData(rawData) {
    const lines = rawData.split(/\r?\n/).filter(Boolean);
    const EXPECTED_COLS = 15;

    const firstLine = lines[0]; 
    if (!firstLine) return [];

    const parts = firstLine.split(/\t| {2,}/g).map(p => p.trim());

    while (parts.length > 0 && parts[0] === "") parts.shift();
    
    while (parts.length < EXPECTED_COLS) parts.push("");

    const nsu_tef_raw = parts[11] ? parts[11].trim() : "0";
    const nsu_web_raw = parts[12] ? parts[12].trim() : "0";

    const nsu_sescnet = (nsu_tef_raw !== "0" && nsu_tef_raw !== "") 
                        ? nsu_tef_raw 
                        : (nsu_web_raw !== "0" && nsu_web_raw !== "" ? nsu_web_raw : "");
                        
    const obj = {
        seq: parts[0],
        data_sescnet: parts[1],
        caixa_sescnet: parts[2],
        valor_sescnet: parts[3],
        abatimento: parts[4],
        juros: parts[5],
        multa: parts[6],
        total_geral: parts[7],
        tipo_liquidacao: parts[8], 
        operacao_contabil: parts[9], 
        parcelas: parts[10],
        nsu_tef: parts[11], 
        nsu_web: parts[12], 
        nsu_sescnet: nsu_sescnet,
        tid_sescnet: parts[13],
        data_transacao: parts[14] 
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
    
    let valores = text.split(/\r?\n/)[0].split(/\t/g).map(v => v.trim());
    while (valores.length > 0 && valores[0] === "") valores.shift();

    let inputs = document.querySelectorAll("#step-2 .col-input");
    state.dadosSescnetTable = parseSescnetData(text);

    inputs.forEach((input, idx) => {
        if (state.dadosSescnetTable.length > 0) {
            // Mapeamento explícito baseado no parseSescnetData para garantir a ordem
            const obj = state.dadosSescnetTable[0];
            let value = '';
            
            // Índices de 0 a 14 na tela
            switch(idx) {
                case 0: value = obj.seq; break;
                case 1: value = obj.data_sescnet; break;
                case 2: value = obj.caixa_sescnet; break;
                case 3: value = obj.valor_sescnet; break;
                case 4: value = obj.abatimento; break;
                case 5: value = obj.juros; break;
                case 6: value = obj.multa; break;
                case 7: value = obj.total_geral; break;
                case 8: value = obj.tipo_liquidacao; break;
                case 9: value = obj.operacao_contabil; break;
                case 10: value = obj.parcelas; break;
                case 11: value = obj.nsu_tef; break;
                case 12: value = obj.nsu_web; break;
                case 13: value = obj.tid_sescnet; break;
                case 14: value = obj.data_transacao; break;
                default: value = '';
            }
            input.value = value;
        } else {
             input.value = '';
        }
    });
    
    // Limpa a textarea imediatamente após processar
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

        if (!raw) return;

        const valores = raw.split(/\r?\n/)[0].split(/\t/g).map(v => v.trim());
        while (valores.length > 0 && valores[0] === "") valores.shift();

        state.dadosSitefWeb = valores;
        saveState();

        document.querySelectorAll("#step-4 .label").forEach(labelEl => {
            const labelText = labelEl.textContent.trim().replace(/\.$/, '');
            
            const mapEntry = sitefWebColumnMap.find(item => item.label.replace(/\./g, '').trim() === labelText.replace(/\./g, '').trim());

            if (mapEntry) {
                const valor = valores[mapEntry.index];
                const inputResultEl = labelEl.nextElementSibling;
                
                if (inputResultEl && inputResultEl.classList.contains("col-input-sitef-web") && valor !== undefined) {
                    // Verifica se é valor para formatar (índice 10)
                    if (mapEntry.index === 10) {
                        inputResultEl.value = formatarValorSiTef(valor);
                    } else {
                        inputResultEl.value = valor;
                    }
                }
            }
        });

        // REMOVIDO: setTimeout para limpar a textarea
        // Se limparmos aqui, a chamada dispatchEvent em btnNext4 esvazia o state.
    });
}

if ($("btnNext4")) {
  $("btnNext4").addEventListener("click", () => {
    $("sitefWebInput").dispatchEvent(new Event('input')); 

    const dados = state.dadosSitefWeb;
    const dadosSescnet = state.dadosSescnetTable[0];
    
    if (dados.length === 0) {
        return showModal("Atenção", "Cole a linha tabulada do SiTef Web (Antigo) na caixa de texto.");
    }
    if (dados.length < 15) return showModal("Atenção", "Dados do SiTef Web incompletos. Cole a linha tabulada completa (esperado pelo menos 15 colunas).");

    const nsuSitef = dados[4] ? dados[4].trim() : '';
    const nsuSescnet = dadosSescnet.nsu_sescnet ? dadosSescnet.nsu_sescnet.trim() : '';
    
    // NOVO: VALIDAÇÃO PIX NO SITEF WEB
    const produtoSitefWeb = dados[7] ? dados[7].trim() : ''; // Index 7 é Produto
    if (produtoSitefWeb.toUpperCase() === "PIX") {
        return showModal("AVISO", "Operação informada se trata de um PIX, favor prosseguir com uma transação em CARTÃO");
    }

    if (nsuSitef !== nsuSescnet) {
        return showModal("AVISO", 
            `O NSU do SiTef informado não corresponde ao NSU Sescnet. <br>
            <br>
            <b>NSU SITEF:</b> ${nsuSitef}<br>
            <b>NSU SESCNET:</b> ${nsuSescnet}<br>
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

        if (!raw) return;

        const map = {};
        raw.split(/\r?\n/).forEach((ln) => {
            const parts = ln.split(/:\s*|\t/, 2); 
            if (parts.length === 2) {
                let k = normalizeKey(parts[0]);
                let v = parts[1].trim();

                if (k && v) {
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
                    
                    if (inputResultEl.id === "data_sitef_express" && valor.length >= 10) {
                        inputResultEl.value = valor.substring(0, 10);
                    } else {
                        inputResultEl.value = valor;
                    }
                }
            }
        });
        
        state.dadosSitefExpress = map; 
        saveState();

        // REMOVIDO: setTimeout para limpar a textarea
        // Se limparmos aqui, a chamada dispatchEvent em btnNext5 esvazia o state.
    });
}

if ($("btnNext5")) {
  $("btnNext5").addEventListener("click", () => {
    $("sitefExpressInput").dispatchEvent(new Event('input')); 

    const dadosSescnet = state.dadosSescnetTable[0];

    // Aqui usamos o estado que foi populado pelo 'input' disparado
    if (Object.keys(state.dadosSitefExpress).length === 0) {
        return showModal("Atenção", "Cole os dados do SiTef Express. Não foi possível extrair os dados. Verifique o formato.");
    }

    if (!state.dadosSitefExpress["Data"] || !state.dadosSitefExpress["NSU"]) {
         return showModal("Atenção", "Não foi possível extrair os dados críticos (Data e NSU) do SiTef Express. Verifique a formatação colada.");
    }
    
    // NOVO: VALIDAÇÃO PIX NO SITEF EXPRESS
    const tipoProdutoExpress = state.dadosSitefExpress["Tipo produto"] ? state.dadosSitefExpress["Tipo produto"].trim() : '';
    if (tipoProdutoExpress.toUpperCase() === "PIX") {
        return showModal("AVISO", "Operação informada se trata de um PIX, favor prosseguir com uma transação em CARTÃO");
    }

    const nsuSitef = state.dadosSitefExpress["NSU"] ? state.dadosSitefExpress["NSU"].trim() : '';
    const nsuSescnet = dadosSescnet.nsu_sescnet ? dadosSescnet.nsu_sescnet.trim() : '';

    if (nsuSitef !== nsuSescnet) {
        return showModal("AVISO", 
            `O NSU do SiTef informado não corresponde ao NSU Sescnet. <br>
            <br>
            <b>NSU SITEF:</b> ${nsuSitef}<br>
            <b>NSU SESCNET:</b> ${nsuSescnet}<br>
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

  if (isSescnetOnly || (state.dadosSescnetTable.length > 0 && state.canalVenda !== "sitef")) {
     // APLICANDO A REGRA: E-commerce e POS usam o valor_sescnet.
     valorCardFormatado = state.dadosSescnetTable[0]?.valor_sescnet || "(não encontrado)";
     valorTransacaoNum = parseCurrencyToNumber(state.dadosSescnetTable[0]?.valor_sescnet);
  
  } else if (state.canalVenda === "sitef") {
    
    if (state.versao_sitef === "web") {
      const valorBrutoSitef = $("valor_sitef") ? $("valor_sitef").value : '0';
      valorTransacaoNum = parseCurrencyToNumber(valorBrutoSitef); // Pega o valor formatado e converte
      valorCardFormatado = valorBrutoSitef; // Já está formatado
      
    } else if (state.versao_sitef === "express") {
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
    }
  } 
  
  // Se for SiTef mas não encontrou o valor em SiTef (ex: usuário ainda não colou), retorna para o Sescnet.
  if (valorTransacaoNum === 0 && state.dadosSescnetTable.length > 0 && !isSescnetOnly) {
     valorCardFormatado = state.dadosSescnetTable[0].valor_sescnet || "(não encontrado)";
     valorTransacaoNum = parseCurrencyToNumber(state.dadosSescnetTable[0].valor_sescnet);
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

/* ---------- ExcelJS Export (Restante da lógica) ---------- */
async function gerarExcelPreenchido() {
  const valorCancelarRaw = $("valorCancelar") ? $("valorCancelar").value.trim() : "";
  const valorCancelarNum = parseCurrencyToNumber(valorCancelarRaw);

  if (!valorCancelarRaw || valorCancelarNum <= 0) 
    return showModal("Atenção", "Informe um valor a cancelar válido e maior que zero.");

  let valorTransacaoNum = 0;

  // 1. Determinar o valor máximo da transação (valor de referência)
  if (state.canalVenda === "sitef") {
    if (state.versao_sitef === "web") {
      const valorBrutoSitef = $("valor_sitef") ? $("valor_sitef").value : '0';
      valorTransacaoNum = parseCurrencyToNumber(valorBrutoSitef);
    } else if (state.versao_sitef === "express") {
      const valorBrutoExpress = state.dadosSitefExpress["Valor"] || "0";
      const valorParaParse = valorBrutoExpress.replace(/[^\d,]/g, "").replace(",", ".");
      valorTransacaoNum = Number(valorParaParse) || 0;
    }
  } else if (state.dadosSescnetTable.length > 0) {
     valorTransacaoNum = parseCurrencyToNumber(state.dadosSescnetTable[0].valor_sescnet);
  }
  
  if (valorCancelarNum > valorTransacaoNum) {
      // Para exibir a mensagem, re-formata os números para R$
      const formatadoCancelar = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valorCancelarNum);
      const formatadoTransacao = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valorTransacaoNum);

      return showModal("AVISO", 
          `O valor a cancelar (${formatadoCancelar}) é maior que o valor original da transação (${formatadoTransacao}). <br><br>
          Favor ajustar o valor.`
      );
  }

  const workbook = new ExcelJS.Workbook();

  try {
    showLoading(true, "Carregando template...");
    // AQUI: Assumimos que 'template.xlsx' está acessível.
    const resp = await fetch("template.xlsx"); 
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const buffer = await resp.arrayBuffer();
    await workbook.xlsx.load(buffer);
  } catch (e) {
    showLoading(false);
    return showModal("Erro", "Erro carregando template.xlsx<br>" + (e.message || e));
  }

  try {
    const sheetCapa = workbook.getWorksheet("CAPA");
    
    // Preenche a CAPA
    sheetCapa.getCell("E16").value = state.nomeCliente || "";
    sheetCapa.getCell("E17").value = state.cpfCliente || "";
    sheetCapa.getCell("E14").value = estabelecimentos[state.nomeEstabelecimento] || "";

    // Converte a data do formato yyyy-mm-dd para objeto Date
    const [year, month, day] = (state.dataSolicitacao || "").split('-').map(Number);
    if (year && month && day) {
        // ExcelJS espera um objeto Date (Date(ano, mês-1, dia))
        sheetCapa.getCell("E10").value = new Date(year, month - 1, day); 
    } else {
         sheetCapa.getCell("E10").value = ""; 
    }
    
    sheetCapa.getCell("E11").value = Number(state.caixa || 0);

    sheetCapa.getCell("E23").value = valorCancelarNum; // Usa o valor numérico (90.00)

    const out = await workbook.xlsx.writeBuffer();
    triggerDownload(
      new Blob([out], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      }),
      "solicitacao_cancelamento_sesc.xlsx"
    );

    showLoading(false);
    showModal("Sucesso", "Arquivo gerado com sucesso!");
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