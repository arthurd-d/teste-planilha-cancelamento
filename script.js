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

/* ---------- State ---------- */
let state = {
  step: 1,
  dadosSescnetTable: [],
  dadosSitefWeb: [],
  dadosSitefExpress: {},
  sitefType: null,
};

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
}

mostrarStep(1);
updateStepIndicator();

function voltar(targetStep) {
  if (targetStep < 1 || targetStep > 6) return;

  state.step = targetStep;
  mostrarStep(targetStep);
}

/* ---------- Populate Establishments ---------- */
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

/* ---------- Masks ---------- */
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

/* ---------- Navegação Step 1 ---------- */
if ($("btnNext1")) {
  $("btnNext1").addEventListener("click", () => {
    if (!$("nomeCliente") || !$("nomeCliente").value.trim())
      return showModal("Atenção", "Preencha o nome do cliente.");
    if (!$("cpfCliente") || !$("cpfCliente").value.trim())
      return showModal("Atenção", "Preencha o CPF.");
    // Corrigida verificação do CPF para checar quantidade de dígitos
    const cpfDigits = ($("cpfCliente").value || "").replace(/\D/g, "");
    if (cpfDigits.length !== 11) return showModal("Atenção", "CPF incompleto");
    if (!$("dataSolicitacao") || !$("dataSolicitacao").value.trim())
      return showModal("Atenção", "Preencha a data.");
    if (!$("caixa") || !$("caixa").value.trim())
      return showModal("Atenção", "Preencha o caixa.");
    if (!$("numeroVenda") || !$("numeroVenda").value.trim())
      return showModal("Atenção", "Preencha o número da venda.");
    if (!$("nomeEstabelecimento") || !$("nomeEstabelecimento").value.trim())
      return showModal("Atenção", "Selecione o estabelecimento.");
    if (!$("canalVenda") || !$("canalVenda").value.trim())
      return showModal("Atenção", "Selecione o canal.");

    mostrarStep(2);
  });
}

/* ---------- Step 2 ---------- */
/* ---------- Step 2 ---------- */
if ($("btnNext2")) {
  $("btnNext2").addEventListener("click", () => {

    const raw = $("sescnetInput") ? $("sescnetInput").value.trim() : "";
    if (!raw) return showModal("Atenção", "Dados do SescNet vazios.");

    const lines = raw.split(/\r?\n/).filter(Boolean);

    // Define quantidade esperada de colunas
    const EXPECTED_COLS = 15;

    state.dadosSescnetTable = lines.map((ln) => {
      const parts = ln.split(/\t| +/g);

      // Completa linhas menores
      while (parts.length < EXPECTED_COLS) parts.push("");

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
        nsu_sescnet: parts[11] !== "0" && parts[11] !== "" ? parts[11] : (parts[12] !== "0" ? parts[12] : ""),
        tid_sescnet: parts[13],
        data_transacao: parts[14]
      };

      return obj;
    });

    console.log("SescNet parseado:", state.dadosSescnetTable);

    const canal = $("canalVenda") ? $("canalVenda").value : "";
    if (canal === "sitef") mostrarStep(3);
    else {
      montarResumo();
      mostrarStep(6);
    }
  });
}


/* ---------- Step 3 → Tipo SiTef ---------- */
if ($("sitefWeb")) {
  $("sitefWeb").addEventListener("click", () => {
    state.sitefType = "web";
    mostrarStep(4);
  });
}
if ($("sitefExpress")) {
  $("sitefExpress").addEventListener("click", () => {
    state.sitefType = "express";
    mostrarStep(5);
  });
}

/* ---------- Step 4 → SiTef Web ---------- */
if ($("btnNext4")) {
  $("btnNext4").addEventListener("click", () => {
    const txt = $("sitefWebInput") ? $("sitefWebInput").value.trim() : "";
    if (!txt) return showModal("Atenção", "Cole os dados do SiTef Web.");

    state.dadosSitefWeb = txt.split("\t");
    montarResumo();
    mostrarStep(6);
  });
}

/* ---------- Step 5 → SiTef Express ---------- */
if ($("btnNext5")) {
  $("btnNext5").addEventListener("click", () => {
    const txt = $("sitefExpressInput") ? $("sitefExpressInput").value.trim() : "";
    if (!txt) return showModal("Atenção", "Cole os dados do SiTef Express.");

    const map = {};
    txt.split(/\r?\n/).forEach((ln) => {
      const [k, v] = ln.split("\t");
      if (k && v) map[k.replace(/:$/, "")] = v.trim();
    });

    state.dadosSitefExpress = map;
    montarResumo();
    mostrarStep(6);
  });
}
document.getElementById("paste-area").addEventListener("paste", function (e) {
    e.preventDefault();

    let text = (e.clipboardData || window.clipboardData).getData("text");

    // divide por TAB
    let valores = text.split("\t");

    // pega todos os inputs
    let inputs = document.querySelectorAll(".col-input");

    inputs.forEach((input, idx) => {
        if (valores[idx] !== undefined) {
            input.value = valores[idx].trim();
        }
    });
});

/* ---------- Montar Resumo ---------- */
function parseCurrencyToNumber(value) {
  if (!value) return 0;
  return Number(
    value
      .replace(/\./g, "")
      .replace(",", ".")
      .replace(/[^\d.]/g, "")
  );
}

function montarResumo() {
  const summaryBox = $("summaryBox");
  if (!summaryBox) return;

  const valorCard =
    state.sitefType === "web"
      ? state.dadosSitefWeb[11] || ""
      : state.dadosSitefExpress["Valor"] || "";

  summaryBox.innerHTML = `
    <div><b>Cliente:</b> ${$("nomeCliente" ? "nomeCliente" : "") ? $("nomeCliente").value : ""}</div>
    <div><b>CPF:</b> ${$("cpfCliente" ? "cpfCliente" : "") ? $("cpfCliente").value : ""}</div>
    <hr>
    <div><b>Estabelecimento:</b> ${$("nomeEstabelecimento" ? "nomeEstabelecimento" : "") ? $("nomeEstabelecimento").value : ""}</div>
    <div><b>Caixa:</b> ${$("caixa" ? "caixa" : "") ? $("caixa").value : ""}</div>
    <div><b>Venda:</b> ${$("numeroVenda" ? "numeroVenda" : "") ? $("numeroVenda").value : ""}</div>
    <hr>
    <div><b>Valor transação cartão:</b> ${valorCard || "(não encontrado)"}</div>
    <div><b>Valor a cancelar:</b> ${$("valorCancelar" ? "valorCancelar" : "") ? $("valorCancelar").value : "(pendente)"}</div>
  `;
}

/* ---------- ExcelJS Export ---------- */
async function gerarExcelPreenchido() {
  console.log("Função gerarExcelPreenchido foi chamada!");

  const valorRaw = $("valorCancelar") ? $("valorCancelar").value.trim() : "";
  if (!valorRaw) return showModal("Atenção", "Informe o valor a cancelar.");

  const workbook = new ExcelJS.Workbook();

  try {
    showLoading(true, "Carregando template...");
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

    sheetCapa.getCell("E16").value = $("nomeCliente") ? $("nomeCliente").value : "";
    sheetCapa.getCell("E17").value = $("cpfCliente") ? $("cpfCliente").value : "";
    sheetCapa.getCell("E14").value =
      estabelecimentos[$("nomeEstabelecimento") ? $("nomeEstabelecimento").value : ""] || "";

    sheetCapa.getCell("E11").value = Number($("caixa") ? $("caixa").value : 0);
    sheetCapa.getCell("E10").value = new Date(($("dataSolicitacao") ? $("dataSolicitacao").value : "") + "T00:00");

    sheetCapa.getCell("E23").value = parseCurrencyToNumber(valorRaw);

    // Salvar
    const out = await workbook.xlsx.writeBuffer();
    triggerDownload(
      new Blob([out], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      }),
      "solicitacao_preenchida.xlsx"
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
  // Simple helper to create element from HTML string
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

  // CONFIRM MODAL (yes/no)
  if (!document.getElementById("modalConfirm")) {
    const confirmHtml = `
      <div id="modalConfirm" class="modal hidden" aria-hidden="true">
        <div class="modal-content" role="dialog" aria-modal="true" aria-labelledby="modalConfirm-title">
          <h3 id="modalConfirm-title" style="margin:0 0 .6rem 0; font-size:18px;"></h3>
          <div id="modalConfirm-message" style="font-size:14px; color:#0b1720; line-height:1.4;"></div>
          <div class="modal-actions" style="display:flex; justify-content:center; gap:12px; margin-top:1rem;">
            <button id="modalConfirm-yes" class="btn success" style="min-width:100px; text-transform:none;">Confirmar</button>
            <button id="modalConfirm-no" class="btn ghost" style="min-width:100px; text-transform:none;">Cancelar</button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(createFromHTML(confirmHtml));
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
  // options: { okText, onOk, allowHtml }
  const modal = document.getElementById("modal");
  if (!modal) return alert(title + "\n\n" + message); // fallback
  const titleEl = document.getElementById("modal-title");
  const msgEl = document.getElementById("modal-message");
  const okBtn = document.getElementById("modal-ok");

  titleEl.textContent = title || "";
  if (options.allowHtml) msgEl.innerHTML = message || "";
  else msgEl.textContent = message || "";

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

// returns a Promise for convenience or accepts callbacks
function showModalConfirm(title, message, onConfirm, onCancel) {
  const modal = document.getElementById("modalConfirm");
  if (!modal) {
    // fallback to confirm
    const ok = confirm(title + "\n\n" + message);
    if (ok && typeof onConfirm === "function") onConfirm();
    else if (!ok && typeof onCancel === "function") onCancel();
    return;
  }
  const titleEl = document.getElementById("modalConfirm-title");
  const msgEl = document.getElementById("modalConfirm-message");
  const yesBtn = document.getElementById("modalConfirm-yes");
  const noBtn = document.getElementById("modalConfirm-no");

  titleEl.textContent = title || "";
  msgEl.textContent = message || "";

  modal.classList.remove("hidden");
  modal.setAttribute("aria-hidden", "false");

  const cleanup = () => {
    yesBtn.onclick = null;
    noBtn.onclick = null;
    modal.classList.add("hidden");
    modal.setAttribute("aria-hidden", "true");
  };

  yesBtn.onclick = () => {
    cleanup();
    if (typeof onConfirm === "function") onConfirm();
  };

  noBtn.onclick = () => {
    cleanup();
    if (typeof onCancel === "function") onCancel();
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
