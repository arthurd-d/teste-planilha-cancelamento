/* ----------------------
    script.js — completo e usando ExcelJS (v3: Correção de Moeda)
    ---------------------- */

/* ---------- Util: Tabler icons hookup (simple) ---------- */
/*window.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".icon").forEach((el) => {
    const name = el.getAttribute("data-icon");
    if (!name) return;
    try {
      // Assumindo que window.TablerIcons está disponível
      el.innerHTML = window.TablerIcons[name]().outerHTML;
    } catch (e) {
      el.innerHTML =
        '<svg width="16" height="16"><rect width="16" height="16" fill="#ccc"/></svg>';
    }
  });
});

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

/* ---------- State and DOM Helpers ---------- */
let state = {
  step: 1,
  dadosSescnetTable: [],
  dadosSitefWeb: [],
  dadosSitefExpress: {}, // map
  sitefType: null, // 'web' or 'express'
};

const $ = (id) => document.getElementById(id);
const stepsTotal = 6;

function updateStepIndicator() {
  $("stepIndicator").textContent = `Passo ${state.step} de ${stepsTotal}`;
}

function mostrarStep(n) {
  state.step = n;
  document
    .querySelectorAll(".step")
    .forEach((s) => s.classList.remove("active"));
  const el = document.querySelector(`#step-${n}`);
  if (el) el.classList.add("active");
  updateStepIndicator();
  // small animation
  el && (el.style.transform = "translateY(6px)");
  setTimeout(() => el && (el.style.transform = "translateY(0)"), 120);
}

function voltar(n) {
  mostrarStep(n);
}

/* ---------- Preencher select de estabelecimentos ---------- */
function populaEstabelecimentos() {
  const sel = $("nomeEstabelecimento");
  Object.keys(estabelecimentos).forEach((nome) => {
    const opt = document.createElement("option");
    opt.value = nome;
    opt.textContent = nome;
    sel.appendChild(opt);
  });
}
populaEstabelecimentos();
$("nomeEstabelecimento").addEventListener("change", () => {
  const val = $("nomeEstabelecimento").value;
  $("codigoEstabelecimento").value = estabelecimentos[val] || "";
});

/* ---------- Input masks and Navigation Buttons ---------- */
function maskCPF(input) {
  let v = input.value.replace(/\D/g, "").slice(0, 11);
  v = v.replace(/^(\d{3})(\d)/, "$1.$2");
  v = v.replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3");
  v = v.replace(/\.(\d{3})(\d)/, ".$1-$2");
  input.value = v;
}
$("cpfCliente").addEventListener("input", () => maskCPF($("cpfCliente")));

// MÁSCARA DE MOEDA (FORMATTER)
// MÁSCARA DE MOEDA (FORMATTER)
// MÁSCARA DE MOEDA (FORMATTER)
function formatCurrencyInput(el) {
  let v = el.value.replace(/\D/g, ""); // Remove tudo que não for dígito
  if (!v) {
    el.value = "";
    return;
  }

  // Se houver menos de 3 dígitos, preenche com zero na frente para ter a formatação mínima (ex: '1' vira '001')
  while (v.length < 3) {
    v = "0" + v;
  }

  // Parte dos centavos (últimos 2 dígitos)
  const cents = v.slice(-2);

  // Parte inteira (dígitos restantes)
  let intPart = v.slice(0, -2);

  // CORREÇÃO AQUI: Remove zeros à esquerda da parte inteira,
  // exceto se o resultado for apenas '0'.
  // Ex: '001' -> '1'
  // Ex: '0100' -> '100'
  intPart = intPart.replace(/^0+/, "") || "0";

  // Aplica a máscara de milhar (ponto)
  intPart = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  // Formata e define o valor no input
  el.value = `R$ ${intPart},${cents}`;
}
$("valorCancelar").addEventListener("input", () =>
  formatCurrencyInput($("valorCancelar"))
);

$("numeroVenda").addEventListener(
  "input",
  (e) => (e.target.value = e.target.value.replace(/\D/g, ""))
);
$("caixa").addEventListener(
  "input",
  (e) => (e.target.value = e.target.value.replace(/\D/g, ""))
);

document.getElementById("btnNext1").addEventListener("click", () => {
  const nome = $("nomeCliente").value.trim();
  const cpf = $("cpfCliente").value.trim();
  const data = $("dataSolicitacao").value.trim();
  const caixa = $("caixa").value.trim();
  const venda = $("numeroVenda").value.trim();
  const estab = $("nomeEstabelecimento").value;
  const canal = $("canalVenda").value;

  const faltando = [];
  if (!nome) faltando.push("Nome do cliente");
  if (!cpf) faltando.push("CPF do cliente");
  if (!data) faltando.push("Data da solicitação");
  if (!caixa) faltando.push("Caixa");
  if (!venda) faltando.push("Número da venda");
  if (!estab) faltando.push("Nome do estabelecimento");
  if (!canal) faltando.push("Canal de venda");

  if (faltando.length) {
    alert("Preencha os seguintes campos:\n• " + faltando.join("\n• "));
    return;
  }

  mostrarStep(2);
});

document.getElementById("btnPreview1").addEventListener("click", () => {
  const txt = `Cliente: ${$("nomeCliente").value}\nCPF: ${
    $("cpfCliente").value
  }\nEstabelecimento: ${$("nomeEstabelecimento").value}`;
  alert("Preview rápido:\n\n" + txt);
});

document.getElementById("btnNext2").addEventListener("click", () => {
  const raw = $("sescnetInput").value.trim();
  if (!raw) {
    if (!confirm("Nenhum dado colado. Deseja continuar sem dados SESCNET?"))
      return;
  }
  const lines = raw
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  const table = lines.map((ln) =>
    ln.includes("\t")
      ? ln.split("\t").map((c) => c.trim())
      : ln.split(/\s+/).map((c) => c.trim())
  );
  state.dadosSescnetTable = table;
  const canal = $("canalVenda").value;
  if (canal === "sitef") mostrarStep(3);
  else {
    montarResumo();
    mostrarStep(6);
  }
});

$("sitefWeb").addEventListener("click", () => {
  state.sitefType = "web";
  mostrarStep(4);
});
$("sitefExpress").addEventListener("click", () => {
  state.sitefType = "express";
  mostrarStep(5);
});

document.getElementById("btnNext4").addEventListener("click", () => {
  const txt = $("sitefWebInput").value.trim();
  if (!txt) {
    alert("Cole os dados do SiTef Web");
    return;
  }
  const arr = txt.split("\t").map((x) => x.trim());
  state.dadosSitefWeb = arr;
  montarResumo();
  mostrarStep(6);
});

document.getElementById("btnNext5").addEventListener("click", () => {
  const txt = $("sitefExpressInput").value.trim();
  if (!txt) {
    alert("Cole os dados do SiTef Express");
    return;
  }
  const lines = txt
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  const map = {};
  lines.forEach((line) => {
    const parts = line.split("\t");
    if (parts.length >= 2) {
      const key = parts[0].replace(/:$/, "").trim();
      const val = parts.slice(1).join("\t").trim();
      map[key] = val;
    }
  });
  state.dadosSitefExpress = map;
  montarResumo();
  mostrarStep(6);
});

function montarResumo() {
  const nome = $("nomeCliente").value;
  const cpf = $("cpfCliente").value;
  const data = $("dataSolicitacao").value;
  const caixa = $("caixa").value;
  const venda = $("numeroVenda").value;
  const estab = $("nomeEstabelecimento").value;
  const cod = estabelecimentos[estab] || "";
  const canal = $("canalVenda").value;
  let valorTransacao = "";
  if (state.sitefType === "web" && state.dadosSitefWeb.length > 11)
    valorTransacao = state.dadosSitefWeb[11];
  if (state.sitefType === "express" && state.dadosSitefExpress["Valor"])
    valorTransacao = state.dadosSitefExpress["Valor"];
  const summary = `
      <div><b>Data envio:</b> ${data}</div>
      <div><b>Caixa:</b> ${caixa}</div>
      <div><b>Nro do título:</b> ${venda}</div>
      <div><b>Nome estabelecimento:</b> ${estab}</div>
      <div><b>Cód. Estabelecimento:</b> ${cod}</div>
      <hr/>
      <div><b>Nome do Cliente:</b> ${nome}</div>
      <div><b>CPF do Cliente:</b> ${cpf}</div>
      <hr/>
      <div><b>Canal de venda:</b> ${canal}</div>
      <div><b>Valor transação do cartão:</b> ${
        valorTransacao || "(não detectado)"
      }</div>
      <div><b>Valor a cancelar:</b> ${
        $("valorCancelar").value || "(pendente)"
      }</div>
  `;
  $("summaryBox").innerHTML = summary;
}
$("valorCancelar").addEventListener("input", montarResumo);

/* -------------------------------------------
  Excel manipulation (ExcelJS)
  ------------------------------------------- */
async function gerarExcelPreenchido() {
  const valorRaw = $("valorCancelar").value.trim();
  if (!valorRaw) {
    alert("Informe o valor a cancelar.");
    return;
  }

  // 1. Carrega o template
  const workbook = new ExcelJS.Workbook();
  try {
    const resp = await fetch("template.xlsx");
    if (!resp.ok)
      throw new Error(
        "Não encontrou assets/template.xlsx (coloque seu template na pasta /assets)."
      );
    const arrayBuffer = await resp.arrayBuffer();
    await workbook.xlsx.load(arrayBuffer);
  } catch (e) {
    alert(
      "Erro ao carregar template.xlsx ou a biblioteca ExcelJS.\n" + e.message
    );
    return;
  }

  // 2. Acessa as planilhas
  const sheetCapa = workbook.getWorksheet("CAPA");
  const sheetDados = workbook.getWorksheet("DADOS");
  if (!sheetCapa || !sheetDados) {
    alert('Template inválido: precisa das abas "CAPA" e "DADOS".');
    return;
  }

  // Função auxiliar para definir valores em uma célula por endereço (mantida para células fixas)
  const setCellValue = (sheet, address, value) => {
    const cell = sheet.getCell(address);
    cell.value = value;
    return cell;
  };

  // Função auxiliar para definir valores por LINHA e COLUNA (MUITO MAIS SEGURO para preenchimento dinâmico)
  const setCellByIndices = (sheet, row, col, value) => {
    const cell = sheet.getCell(row, col);
    cell.value = value;
    return cell;
  };

  // --- 3. Preenchimento CAPA (Células Fixas) ---

  // Strings
  setCellValue(sheetCapa, "E16", $("nomeCliente").value || "");
  setCellValue(sheetCapa, "E17", $("cpfCliente").value || "");
  const codEst =
    estabelecimentos[$("nomeEstabelecimento").value] ||
    $("codigoEstabelecimento").value ||
    "";
  setCellValue(sheetCapa, "E14", codEst);
  setCellValue(sheetCapa, "E19", $("canalVenda").value || "");

  // Números
  // Coluna 'E' é a 5ª coluna (1=A, 2=B, 3=C, 4=D, 5=E)
  setCellByIndices(sheetCapa, 11, 5, Number($("caixa").value) || 0); // E11 (Caixa)

  // Datas (E10)
  const dt = $("dataSolicitacao").value; // YYYY-MM-DD
  if (dt) {
    setCellByIndices(sheetCapa, 10, 5, new Date(dt + "T00:00:00")); // E10 (Data)
  }

  // Valor a cancelar (E23)
  // *** CORREÇÃO APLICADA AQUI ***
  const valorNum = parseCurrencyToNumber($("valorCancelar").value);
  setCellByIndices(sheetCapa, 23, 5, isNaN(valorNum) ? 0 : valorNum); // E23 (Valor)

  // --- 4. Preenchimento DADOS (Células Variáveis) ---

  // DADOS - SESCNET (A partir de D8: Linha 8, Coluna 4)
  if (state.dadosSescnetTable && state.dadosSescnetTable.length) {
    const startRow = 8;
    const startCol = 4; // D é a 4ª coluna
    for (let r = 0; r < state.dadosSescnetTable.length; r++) {
      const rowData = state.dadosSescnetTable[r];
      if (!rowData || rowData.length === 0) continue;

      for (let c = 0; c < rowData.length; c++) {
        const targetRow = startRow + r;
        const targetCol = startCol + c;
        setCellByIndices(sheetDados, targetRow, targetCol, rowData[c] || "");
      }
    }
  }

  // DADOS - SiTef Web (Linha 15, a partir de B15: Linha 15, Coluna 2)
  if (state.sitefType === "web" && state.dadosSitefWeb.length) {
    const startRow = 15;
    const startCol = 2; // B é a 2ª coluna
    state.dadosSitefWeb.forEach((val, c) => {
      const targetCol = startCol + c;
      setCellByIndices(sheetDados, startRow, targetCol, val || "");
    });

    // Mapeamento de Valor para L15 (Coluna 12)
    if (state.dadosSitefWeb[11]) {
      setCellByIndices(sheetDados, 15, 12, state.dadosSitefWeb[11]);
    }
  }

  // DADOS - SiTef Express (A partir de P22: Colunas 16 e 17)
  if (
    state.sitefType === "express" &&
    Object.keys(state.dadosSitefExpress).length
  ) {
    let row = 22;
    const colKey = 16; // P
    const colVal = 17; // Q

    Object.entries(state.dadosSitefExpress).forEach(([k, v]) => {
      setCellByIndices(sheetDados, row, colKey, k);
      setCellByIndices(sheetDados, row, colVal, v);
      row++;
    });

    // Mapeamento de Valor para Q30 (Coluna 17)
    if (state.dadosSitefExpress["Valor"]) {
      setCellByIndices(sheetDados, 30, 17, state.dadosSitefExpress["Valor"]);
    }
  }

  // --- 5. Grava e baixa o arquivo ---
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  const name = `solicitacao_preenchida_${new Date()
    .toISOString()
    .slice(0, 19)
    .replace(/[:T]/g, "-")}.xlsx`;
  triggerDownload(blob, name);

  alert(
    "Arquivo gerado com ExcelJS! A formatação do template deve ser mantida."
  );
}

/* ---------- Utilities: download ---------- */
function triggerDownload(blob, filename) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    URL.revokeObjectURL(a.href);
    a.remove();
  }, 100);
}

/* ---------- Trigger generation and UX niceties ---------- */
document
  .getElementById("btnGenerate")
  .addEventListener("click", gerarExcelPreenchido);

[
  "nomeCliente",
  "cpfCliente",
  "dataSolicitacao",
  "caixa",
  "numeroVenda",
  "nomeEstabelecimento",
  "canalVenda",
].forEach((id) => {
  const el = $(id);
  el && el.addEventListener("change", montarResumo);
});

document.querySelectorAll(".step").forEach((s) => {
  s.addEventListener("transitionend", () => {
    if (s.id === "step-6" && s.classList.contains("active")) montarResumo();
  });
});

/* Initial display */
mostrarStep(1);
updateStepIndicator();

/* End of script.js */
