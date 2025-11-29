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

/* ---------- State Management (Com persistência) ---------- */
let state = {
  step: 1,
  dadosSescnetTable: [],
  dadosSitefWeb: [],
  dadosSitefExpress: {},
  sitefType: null,
  canalVenda: null,
  versao_sitef: null, // NOVO: rastreia qual versão do SiTef foi escolhida
};

const STATE_KEY = "SESC_CANC_STATE";

function saveState() {
  localStorage.setItem(STATE_KEY, JSON.stringify(state));
}

function loadState() {
  const savedState = localStorage.getItem(STATE_KEY);
  if (savedState) {
    try {
      const parsed = JSON.parse(savedState);
      // Mantém a chave original se a nova não existir, mas carrega o resto
      state = { ...state, ...parsed };
      // Garante que o estado carregado é válido
      if (!state.step) state.step = 1; 
    } catch (e) {
      console.error("Erro ao carregar o estado:", e);
      // Limpa o estado salvo se for inválido
      localStorage.removeItem(STATE_KEY);
    }
  }
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
  saveState(); // Salva o estado ao mudar de passo
}

// Carrega o estado ao iniciar a aplicação
loadState(); 
mostrarStep(state.step);


function voltar(targetStep) {
  if (targetStep < 1 || targetStep > 6) return;

  // NOVO: Restrição de navegação para o passo de seleção SiTef (Passo 3)
  if (targetStep === 3 && state.canalVenda === "sitef" && state.versao_sitef) {
      // Se o canal é SiTef e a versão já foi escolhida, volta para o Passo 2.
      targetStep = 2;
  }
  
  state.step = targetStep;
  mostrarStep(targetStep);
}

/* ---------- Populate Establishments and Auto-Fill Code ---------- */
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

// NOVO: Adiciona listener para preencher o código ao selecionar o estabelecimento
if ($("nomeEstabelecimento")) {
  $("nomeEstabelecimento").addEventListener("change", (e) => {
    const nome = e.target.value;
    const codigo = estabelecimentos[nome] || "";
    if ($("codigoEstabelecimento")) $("codigoEstabelecimento").value = codigo;
  });
}

// NOVO: Função para carregar os dados dos campos do Passo 1 do state
function loadStep1Data() {
    // Apenas carrega se o estado for maior que 1, para evitar sobrescrever a tela inicial
    if (state.step > 1) {
        if ($("nomeCliente")) $("nomeCliente").value = state.nomeCliente || "";
        if ($("cpfCliente")) $("cpfCliente").value = state.cpfCliente || "";
        if ($("dataSolicitacao")) $("dataSolicitacao").value = state.dataSolicitacao || "";
        if ($("caixa")) $("caixa").value = state.caixa || "";
        if ($("numeroVenda")) $("numeroVenda").value = state.numeroVenda || "";
        if ($("nomeEstabelecimento")) $("nomeEstabelecimento").value = state.nomeEstabelecimento || "";
        if ($("codigoEstabelecimento")) $("codigoEstabelecimento").value = estabelecimentos[state.nomeEstabelecimento] || "";
        if ($("canalVenda")) $("canalVenda").value = state.canalVenda || "";
    }
}
loadStep1Data(); // Chama para carregar os dados no início

/* ---------- Masks and Input Filters ---------- */

// Função para forçar o input a ser um número inteiro positivo
function forceIntegerInput(inputElement, min = 1) {
    let value = inputElement.value.replace(/[^0-9]/g, ''); // Remove tudo que não for dígito
    if (value.startsWith('0') && value.length > 1) {
        value = value.replace(/^0+/, ''); // Remove zeros à esquerda, a menos que seja apenas '0'
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

// Aplicar o filtro nos campos de Caixa e Número da Venda
if ($("caixa")) {
    $("caixa").addEventListener("input", () => forceIntegerInput($("caixa"), 1));
}
if ($("numeroVenda")) {
    $("numeroVenda").addEventListener("input", () => forceIntegerInput($("numeroVenda"), 1));
}


function maskCPF(input) {
  let v = input.value.replace(/\D/g, "").slice(0, 11);
  v = v.replace(/^(\d{3})(\d)/, "$1.$2");
  v = v.replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3");
  v = v.replace(/\.(\d{3})(\d)/, ".$1-$2");
  input.value = v;
}
if ($("cpfCliente")) $("cpfCliente").addEventListener("input", () => maskCPF($("cpfCliente")));

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

/* * Função para formatar o valor bruto do SiTef (ex: 9000) em moeda (ex: R$ 90,00)
 */
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


/* ---------- Navegação Step 1 ---------- */
if ($("btnNext1")) {
  $("btnNext1").addEventListener("click", () => {
    const nomeCliente = $("nomeCliente");
    const cpfCliente = $("cpfCliente");
    const dataSolicitacao = $("dataSolicitacao");
    const caixa = $("caixa");
    const numeroVenda = $("numeroVenda");
    const nomeEstabelecimento = $("nomeEstabelecimento");
    const canalVenda = $("canalVenda");

    if (!nomeCliente || !nomeCliente.value.trim())
      return showModal("Atenção", "Preencha o nome do cliente.");
    
    // Validação CPF
    if (!cpfCliente || !cpfCliente.value.trim())
      return showModal("Atenção", "Preencha o CPF.");
    const cpfDigits = (cpfCliente.value || "").replace(/\D/g, "");
    if (cpfDigits.length !== 11) return showModal("Atenção", "CPF incompleto");

    if (!dataSolicitacao || !dataSolicitacao.value.trim())
      return showModal("Atenção", "Preencha a data.");
      
    // Validação Caixa (já forçada no input, mas checa se está vazio/zero)
    if (!caixa || !caixa.value.trim() || Number(caixa.value) < 1)
      return showModal("Atenção", "O número do caixa deve ser um número inteiro positivo.");
      
    // Validação Número da Venda (Título) (já forçada no input, mas checa se está vazio/zero)
    if (!numeroVenda || !numeroVenda.value.trim() || Number(numeroVenda.value) < 1)
      return showModal("Atenção", "O número da venda deve ser um número inteiro positivo.");
      
    if (!nomeEstabelecimento || !nomeEstabelecimento.value.trim())
      return showModal("Atenção", "Selecione o estabelecimento.");
    
    state.canalVenda = canalVenda ? canalVenda.value : "";
    if (!state.canalVenda)
      return showModal("Atenção", "Selecione o canal.");

    // NOVO: Salva os dados do Passo 1 no state para persistência
    state.nomeCliente = nomeCliente.value;
    state.cpfCliente = cpfCliente.value;
    state.dataSolicitacao = dataSolicitacao.value;
    state.caixa = caixa.value;
    state.numeroVenda = numeroVenda.value;
    state.nomeEstabelecimento = nomeEstabelecimento.value;

    mostrarStep(2);
  });
}

/* ---------- Funções de Parseamento e Navegação Step 2 (SescNet) ---------- */

/**
 * Faz o parse dos dados brutos do Sescnet colados.
 */
function parseSescnetData(rawData) {
    // Foca apenas na primeira linha
    const lines = rawData.split(/\r?\n/).filter(Boolean);
    const EXPECTED_COLS = 15;

    const firstLine = lines[0]; 
    if (!firstLine) return [];

    // Divide por tabulação ou múltiplos espaços
    const parts = firstLine.split(/\t| {2,}/g).map(p => p.trim());

    // Remove colunas vazias iniciais se a linha começar com separador
    while (parts.length > 0 && parts[0] === "") parts.shift();
    
    // Completa linha caso tenha menos de 15 colunas esperadas
    while (parts.length < EXPECTED_COLS) parts.push("");

    // O código original tratava o NSU como [11] ou [12]
    const nsu_sescnet = (parts[11] !== "0" && parts[11].trim() !== "") 
                        ? parts[11] 
                        : (parts[12] !== "0" && parts[12].trim() !== "" ? parts[12] : "");
                        
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
        nsu_tef: parts[11], // TEF - Coluna 12
        nsu_web: parts[12], // WEB - Coluna 13
        nsu_sescnet: nsu_sescnet, // NSU consolidado
        tid_sescnet: parts[13], // Coluna 14
        data_transacao: parts[14] // Coluna 15
    };

    return [obj]; // Retorna um array com o objeto de dados da transação
}


if ($("btnNext2")) {
  $("btnNext2").addEventListener("click", () => {
    // Força o preenchimento antes de avançar, no caso de input manual ou erro no paste
    document.getElementById("paste-area").dispatchEvent(new Event('input'));
    
    if (state.dadosSescnetTable.length === 0) {
        return showModal("Atenção", "Cole os dados do SescNet. Não foi possível extrair os dados da tabela.");
    }

    const dadosSescnet = state.dadosSescnetTable[0];

    // NOVO: Validação do TID para e-commerce
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
        // NOVO: Se o canal é SiTef e a versão já foi escolhida, pula o Passo 3
        if (state.versao_sitef === "web") {
            mostrarStep(4);
        } else if (state.versao_sitef === "express") {
            mostrarStep(5);
        } else {
            // Se o canal é SiTef mas a versão ainda não foi escolhida, vai para a seleção (Passo 3)
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

    // Coloca o texto completo na área de texto (Temporário)
    this.value = text;
    
    // Divide por TABs para extrair colunas. Foca na primeira linha.
    let valores = text.split(/\r?\n/)[0].split(/\t/g).map(v => v.trim());

    // Filtra valores vazios iniciais
    while (valores.length > 0 && valores[0] === "") valores.shift();

    // Pega todos os inputs que queremos preencher
    let inputs = document.querySelectorAll("#step-2 .col-input");
    
    state.dadosSescnetTable = parseSescnetData(text);

    inputs.forEach((input, idx) => {
        // idx corresponde ao índice 0-based dos dados na primeira linha tabulada
        if (valores[idx] !== undefined) {
            input.value = valores[idx];
        } else {
             input.value = '';
        }
    });
    
    // Limpa a textarea após o preenchimento
    setTimeout(() => { this.value = ''; }, 0); 
});

/* ---------- Step 3 → Tipo SiTef ---------- */
if ($("sitefWeb")) {
  $("sitefWeb").addEventListener("click", () => {
    state.sitefType = "web";
    state.versao_sitef = "web"; // NOVO: Define a versão
    // Limpa dados do SiTef Express caso o usuário tenha voltado e escolhido o Web
    state.dadosSitefExpress = {}; 
    mostrarStep(4);
  });
}
if ($("sitefExpress")) {
  $("sitefExpress").addEventListener("click", () => {
    state.sitefType = "express";
    state.versao_sitef = "express"; // NOVO: Define a versão
    // Limpa dados do SiTef Web caso o usuário tenha voltado e escolhido o Express
    state.dadosSitefWeb = []; 
    mostrarStep(5);
  });
}

/* ---------- Step 4 → SiTef Web (Antigo) - CORRIGIDO ---------- */

// Mapeamento dos índices da linha tabulada do SiTef Web para os IDs HTML
// Índice: 0	    1	    2	    3	    4	    5	        6	    7	        8	        9	        10	    11	                12	            13	        14	        15	        16	            17	            18	        19	        20	                21	        22	            23
const sitefWebColumnMap = [
    { label: "Loja", index: 0, id: null },
    { label: "Data", index: 1, id: "data_sitef" },
    { label: "Hora", index: 2, id: null },
    { label: "PDV", index: 3, id: null },
    { label: "NSU", index: 4, id: "nsu_sitef" },
    { label: "NSU Host", index: 5, id: null },
    { label: "Rede", index: 6, id: null },
    { label: "Produto", index: 7, id: null },
    { label: "Transação", index: 8, id: null },
    { label: "Documento", index: 9, id: "n_cartao" }, // Número do Cartão
    { label: "Valor", index: 10, id: "valor_sitef" },
    { label: "Estado Transação", index: 11, id: null },
    { label: "Cod. Resp.", index: 12, id: null },
    { label: "Doc Cancel", index: 13, id: null },
    { label: "Cód. Autor", index: 14, id: "aut" },
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

// Listener para preencher a visualização ao colar no SiTef Web
if ($("sitefWebInput")) {
    $("sitefWebInput").addEventListener("input", function() {
        const inputEl = this;
        const raw = inputEl.value.trim();
        
        // Limpa inputs de visualização se o campo estiver vazio
        document.querySelectorAll("#step-4 .col-input-sitef-web").forEach(input => input.value = '');
        state.dadosSitefWeb = []; 

        if (!raw) return;

        // Foca apenas na primeira linha tabulada
        const valores = raw.split(/\r?\n/)[0].split(/\t/g).map(v => v.trim());
        
        // Remove colunas vazias iniciais
        while (valores.length > 0 && valores[0] === "") valores.shift();

        // SALVA OS DADOS NO STATE
        state.dadosSitefWeb = valores;

        // Mapeia os dados para os inputs de visualização (pelos rótulos)
        document.querySelectorAll("#step-4 .label").forEach(labelEl => {
            const labelText = labelEl.textContent.trim().replace(/\.$/, '');
            
            // Encontra o objeto de mapeamento pelo rótulo
            const mapEntry = sitefWebColumnMap.find(item => item.label.replace(/\./g, '').trim() === labelText.replace(/\./g, '').trim());

            if (mapEntry) {
                const valor = valores[mapEntry.index];
                const inputResultEl = labelEl.nextElementSibling;
                
                if (inputResultEl && inputResultEl.classList.contains("col-input-sitef-web") && valor !== undefined) {
                    inputResultEl.value = valor;
                }
            }
        });
    });
}

if ($("btnNext4")) {
  $("btnNext4").addEventListener("click", () => {
    // Garante que o input handler foi executado para preencher o state.dadosSitefWeb
    $("sitefWebInput").dispatchEvent(new Event('input')); 

    const dados = state.dadosSitefWeb;
    const dadosSescnet = state.dadosSescnetTable[0];
    
    if (dados.length === 0) {
        return showModal("Atenção", "Cole a linha tabulada do SiTef Web (Antigo) na caixa de texto.");
    }

    if (dados.length < 15) return showModal("Atenção", "Dados do SiTef Web incompletos. Cole a linha tabulada completa (esperado pelo menos 15 colunas).");

    const nsuSitef = dados[4] ? dados[4].trim() : '';
    const nsuSescnet = dadosSescnet.nsu_sescnet ? dadosSescnet.nsu_sescnet.trim() : '';
    
    // Validação de NSU (Dados SiTef vs Sescnet)
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
    
    // Validação básica de campos críticos pelos novos índices:
    // Data (Index 1), NSU (Index 4), Cód. Autor (Index 14)
    if (!dados[1] || !dados[4] || !dados[14]) {
        return showModal("Atenção", "Dados críticos (Data, NSU e/ou Cód. Autor) não encontrados nos dados colados do SiTef Web. Verifique se o relatório está completo.");
    }

    montarResumo();
    // Limpa a textarea somente APÓS a validação e antes de avançar
    $("sitefWebInput").value = ''; 
    mostrarStep(6);
  });
}

/* ---------- Step 5 → SiTef Express (Novo) - CORRIGIDO ---------- */

/**
 * Função de normalização para chaves de dados colados e labels HTML.
 * Remove ponto final, acentos e substitui múltiplos espaços por um único.
 * @param {string} key 
 * @returns {string} Chave normalizada
 */
function normalizeKey(key) {
    if (!key) return '';
    // Remove ponto final, remove acentos, normaliza e substitui múltiplos espaços por um
    return key
        .trim()
        .replace(/\.$/, '') 
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, ' '); 
}


// Listener para preencher a visualização ao colar no SiTef Express
if ($("sitefExpressInput")) {
    $("sitefExpressInput").addEventListener("input", function() {
        const inputEl = this;
        const raw = inputEl.value.trim();
        
        // Limpa inputs de visualização
        document.querySelectorAll("#step-5 .col-input-sitef").forEach(input => input.value = '');
        state.dadosSitefExpress = {}; 

        if (!raw) return;

        const map = {};
        raw.split(/\r?\n/).forEach((ln) => {
            // Divide por dois pontos (:) seguido por zero ou mais espaços, ou tab
            const parts = ln.split(/:\s*|\t/, 2); 
            if (parts.length === 2) {
                // Normaliza a chave para corresponder ao HTML
                let k = normalizeKey(parts[0]);
                let v = parts[1].trim();

                if (k && v) {
                    map[k] = v;
                }
            }
        });

        // Preenche os campos de visualização
        document.querySelectorAll("#step-5 .label").forEach(labelEl => {
            // Normaliza a label do HTML
            const labelText = normalizeKey(labelEl.textContent); 

            const valor = map[labelText];
            if (valor !== undefined) {
                const inputResultEl = labelEl.nextElementSibling;
                if (inputResultEl && inputResultEl.classList.contains("col-input-sitef")) {
                    
                    if (inputResultEl.id === "data_sitef_express" && valor.length >= 10) {
                        // REQUERIDO: Pega apenas a data (primeiros 10 caracteres)
                        inputResultEl.value = valor.substring(0, 10);
                    } else {
                        inputResultEl.value = valor;
                    }
                }
            }
        });
        
        // SALVA O MAPA COMPLETO NO STATE
        state.dadosSitefExpress = map; 
    });
}

if ($("btnNext5")) {
  $("btnNext5").addEventListener("click", () => {
    // Garante que o input handler foi executado
    $("sitefExpressInput").dispatchEvent(new Event('input')); 

    const dadosSescnet = state.dadosSescnetTable[0];

    if (Object.keys(state.dadosSitefExpress).length === 0) {
        return showModal("Atenção", "Cole os dados do SiTef Express. Não foi possível extrair os dados. Verifique o formato.");
    }

    // Requisito: Apenas verifica se a data e o NSU (campos críticos) foram preenchidos no estado normalizado
    if (!state.dadosSitefExpress["Data"] || !state.dadosSitefExpress["NSU"]) {
         return showModal("Atenção", "Não foi possível extrair os dados críticos (Data e NSU) do SiTef Express. Verifique a formatação colada.");
    }

    const nsuSitef = state.dadosSitefExpress["NSU"] ? state.dadosSitefExpress["NSU"].trim() : '';
    const nsuSescnet = dadosSescnet.nsu_sescnet ? dadosSescnet.nsu_sescnet.trim() : '';

    // Validação de NSU (Dados SiTef vs Sescnet)
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
    // Limpa a textarea somente APÓS a validação e antes de avançar
    $("sitefExpressInput").value = ''; 
    mostrarStep(6);
  });
}

/* ---------- Montar Resumo ---------- */
function parseCurrencyToNumber(value) {
  if (!value) return 0;
  // Remove pontos (milhar) e substitui vírgula (decimal) por ponto
  return Number(
    value
      .replace(/[^\d,]/g, "") // Mantém apenas dígitos e vírgula
      .replace(/\./g, "") // Remove pontos de milhar
      .replace(",", ".") // Troca vírgula por ponto decimal
  );
}

function montarResumo() {
  const summaryBox = $("summaryBox");
  if (!summaryBox) return;

  let valorCardFormatado = "(Não aplicável)";
  let valorTransacaoNum = 0;
  
  if (state.canalVenda === "sitef") {
    if (state.versao_sitef === "web") {
      const valorBrutoSitef = $("valor_sitef") ? $("valor_sitef").value : '0';
      valorTransacaoNum = Number(valorBrutoSitef) / 100;
      valorCardFormatado = formatarValorSiTef(valorBrutoSitef);
    } else if (state.versao_sitef === "express") {
      const valorBrutoExpress = state.dadosSitefExpress["Valor"] || "0";
      valorTransacaoNum = parseCurrencyToNumber(valorBrutoExpress); // Valor numérico para comparação
      
      const valorParaFormatacao = valorBrutoExpress.replace(/[^0-9,.]/g, '').replace(',', '.');
      if (!isNaN(parseFloat(valorParaFormatacao)) && parseFloat(valorParaFormatacao) >= 0 && !valorBrutoExpress.includes('R$')) {
           valorCardFormatado = formatarValorSiTef(valorBrutoExpress.replace(/\D/g, ''));
      } else {
           valorCardFormatado = valorBrutoExpress;
      }
    }
  } else if (state.dadosSescnetTable.length > 0) {
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

/* ---------- ExcelJS Export ---------- */
async function gerarExcelPreenchido() {
  console.log("Função gerarExcelPreenchido foi chamada!");

  const valorCancelarRaw = $("valorCancelar") ? $("valorCancelar").value.trim() : "";
  const valorCancelarNum = parseCurrencyToNumber(valorCancelarRaw);

  if (!valorCancelarRaw || valorCancelarNum <= 0) 
    return showModal("Atenção", "Informe um valor a cancelar válido e maior que zero.");

  let valorTransacaoNum = 0;

  // 1. Determinar o valor máximo da transação (valor de referência)
  if (state.canalVenda === "sitef") {
    if (state.versao_sitef === "web") {
      const valorBrutoSitef = $("valor_sitef") ? $("valor_sitef").value : '0';
      valorTransacaoNum = Number(valorBrutoSitef) / 100;
    } else if (state.versao_sitef === "express") {
      const valorBrutoExpress = state.dadosSitefExpress["Valor"] || "0";
      valorTransacaoNum = parseCurrencyToNumber(valorBrutoExpress);
    }
  } else if (state.dadosSescnetTable.length > 0) {
     valorTransacaoNum = parseCurrencyToNumber(state.dadosSescnetTable[0].valor_sescnet);
  }
  
  // NOVO: Validação: Valor a cancelar não pode ser maior que o valor da transação
  if (valorCancelarNum > valorTransacaoNum) {
      // Usa Math.round para evitar erros de ponto flutuante na formatação do aviso
      const formatadoCancelar = formatarValorSiTef(Math.round(valorCancelarNum * 100));
      const formatadoTransacao = formatarValorSiTef(Math.round(valorTransacaoNum * 100));

      return showModal("AVISO", 
          `O valor a cancelar (${formatadoCancelar}) é maior que o valor original da transação (${formatadoTransacao}). <br><br>
          Favor ajustar o valor.`
      );
  }

  const workbook = new ExcelJS.Workbook();

  try {
    showLoading(true, "Carregando template...");
    // AQUI: Assumimos que 'template.xlsx' está acessível
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

    sheetCapa.getCell("E11").value = Number(state.caixa || 0);
    // Data da Solicitação (assumindo formato yyyy-mm-dd)
    sheetCapa.getCell("E10").value = new Date((state.dataSolicitacao || "") + "T00:00"); 

    sheetCapa.getCell("E23").value = valorCancelarNum; // Usa o valor numérico (90.00)

    // Salvar
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

/* ---------- Botão ---------- */
if ($("btnGenerate")) $("btnGenerate").addEventListener("click", gerarExcelPreenchido);

/* ---------- MODAL SYSTEM (cria dinamicamente se não existir) ---------- */
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

/* ---------- Modal helpers ---------- */
function showModal(title, message, options = {}) {
  const modal = document.getElementById("modal");
  if (!modal) return alert(title + "\n\n" + message); 
  const titleEl = document.getElementById("modal-title");
  const msgEl = document.getElementById("modal-message");
  const okBtn = document.getElementById("modal-ok");

  titleEl.textContent = title || "";
  // Permite HTML para a mensagem
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

/* ---------- End of script ---------- */