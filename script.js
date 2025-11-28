/* ----------------------
   script.js — completo
   ---------------------- */

/* ---------- Util: Tabler icons hookup (simple) ---------- */
window.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".icon").forEach((el) => {
    const name = el.getAttribute("data-icon");
    if (!name) return;
    try {
      el.innerHTML = window.TablerIcons[name]().outerHTML;
    } catch (e) {
      // fallback: small square
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

/* ---------- State ---------- */
let state = {
  step: 1,
  dadosSescnetTable: [],
  dadosSitefWeb: [],
  dadosSitefExpress: {}, // map
  sitefType: null, // 'web' or 'express'
};

/* ---------- Helpers: DOM ---------- */
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

/* ---------- Input masks: CPF, currency, number formatting ---------- */
function maskCPF(input) {
  let v = input.value.replace(/\D/g, "").slice(0, 11);
  v = v.replace(/^(\d{3})(\d)/, "$1.$2");
  v = v.replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3");
  v = v.replace(/\.(\d{3})(\d)/, ".$1-$2");
  input.value = v;
}
$("cpfCliente").addEventListener("input", () => maskCPF($("cpfCliente")));

// Currency mask (Brazilian style)
function formatCurrencyInput(el) {
  let v = el.value.replace(/\D/g, "");
  if (!v) {
    el.value = "";
    return;
  }
  while (v.length < 3) v = "0" + v; // guarantee cents
  const cents = v.slice(-2);
  let intPart = v.slice(0, -2);
  intPart = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  el.value = `R$ ${intPart},${cents}`;
}
$("valorCancelar").addEventListener("input", () =>
  formatCurrencyInput($("valorCancelar"))
);

/* Numeric-only masks for venda/caixa */
$("numeroVenda").addEventListener(
  "input",
  (e) => (e.target.value = e.target.value.replace(/\D/g, ""))
);
$("caixa").addEventListener(
  "input",
  (e) => (e.target.value = e.target.value.replace(/\D/g, ""))
);

/* ---------- Navigation buttons ---------- */
document.getElementById("btnNext1").addEventListener("click", () => {
  // validate required fields
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

  // all good
  mostrarStep(2);
});

document.getElementById("btnPreview1").addEventListener("click", () => {
  // quick preview modal-like (simple alert for now)
  const txt = `Cliente: ${$("nomeCliente").value}\nCPF: ${
    $("cpfCliente").value
  }\nEstabelecimento: ${$("nomeEstabelecimento").value}`;
  alert("Preview rápido:\n\n" + txt);
});

/* Step 2 -> Next */
document.getElementById("btnNext2").addEventListener("click", () => {
  const raw = $("sescnetInput").value.trim();
  if (!raw) {
    if (!confirm("Nenhum dado colado. Deseja continuar sem dados SESCNET?"))
      return;
  }
  // parse tabs into array (take first line or multiple lines)
  const lines = raw
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  // we'll store as array of arrays
  const table = lines.map((ln) =>
    ln.includes("\t")
      ? ln.split("\t").map((c) => c.trim())
      : ln.split(/\s+/).map((c) => c.trim())
  );
  state.dadosSescnetTable = table;
  // If canal is sitef, go to step 3, else skip to step 6
  const canal = $("canalVenda").value;
  if (canal === "sitef") mostrarStep(3);
  else {
    montarResumo();
    mostrarStep(6);
  }
});

/* Step 3 choices */
$("sitefWeb").addEventListener("click", () => {
  state.sitefType = "web";
  mostrarStep(4);
});
$("sitefExpress").addEventListener("click", () => {
  state.sitefType = "express";
  mostrarStep(5);
});

/* Step 4 -> process sitef web */
document.getElementById("btnNext4").addEventListener("click", () => {
  const txt = $("sitefWebInput").value.trim();
  if (!txt) {
    alert("Cole os dados do SiTef Web");
    return;
  }
  // assume a single line with tabs
  const arr = txt.split("\t").map((x) => x.trim());
  state.dadosSitefWeb = arr;
  montarResumo();
  mostrarStep(6);
});

/* Step 5 -> process sitef express */
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

/* montarResumo: populate summary UI */
function montarResumo() {
  const nome = $("nomeCliente").value;
  const cpf = $("cpfCliente").value;
  const data = $("dataSolicitacao").value;
  const caixa = $("caixa").value;
  const venda = $("numeroVenda").value;
  const estab = $("nomeEstabelecimento").value;
  const cod = estabelecimentos[estab] || "";
  const canal = $("canalVenda").value;
  // valorTransacao: if old sitef -> DADOS!L15 index 11; if new sitef -> map['Valor']
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

/* Quando o usuário altera o valorCancelar, atualiza o resumo */
$("valorCancelar").addEventListener("input", montarResumo);

/* ---------- Excel manipulation (SheetJS) ---------- */

/*
    Assumptions:
    - template.xlsx is at assets/template.xlsx
    - CAPA sheet exists and we write:
        E16 -> Nome do cliente (string)
        E17 -> CPF do cliente (string)
        E10 -> Data da solicitação (date)
        E11 -> Caixa (int)
        E14 -> Código do estabelecimento (string/int)
        E19 -> Canal de venda (string)
        E23 -> Valor a cancelar (string or number)
    - DADOS sheet exists:
        SESCNET -> write starting at D8 (col D = index 3), row 8 (r index 7)
        SiTef Web -> write starting at B15 (col B index 1), row15 (r index 14)
        SiTef Express -> write keys in P column (col P index 15) and values in Q (index16) starting row22
    - Value from SiTef old: DADOS!L15 -> index col L=11 row15 index14
      Value from SiTef new: DADOS!Q30 -> col Q=16 row30 index29
  */

async function gerarExcelPreenchido() {
  // validations
  const valorRaw = $("valorCancelar").value.trim();
  if (!valorRaw) {
    alert("Informe o valor a cancelar.");
    return;
  }

  // fetch template
  let resp;
  try {
    resp = await fetch("assets/template.xlsx");
    if (!resp.ok)
      throw new Error(
        "Não encontrou assets/template.xlsx (coloque seu template na pasta /assets)."
      );
  } catch (e) {
    alert(
      "Erro ao carregar template.xlsx — verifique assets/template.xlsx\n" +
        e.message
    );
    return;
  }

  const arrayBuffer = await resp.arrayBuffer();
  const workbook = XLSX.read(arrayBuffer, { type: "array" });

  // ensure sheets exist
  const sheetCapa = workbook.Sheets["CAPA"];
  const sheetDados = workbook.Sheets["DADOS"];
  if (!sheetCapa || !sheetDados) {
    alert('Template inválido: precisa das abas "CAPA" e "DADOS".');
    return;
  }

  // ---------- Fill CAPA ----------
  const setCell = (ws, addr, value, typeHint) => {
    // typeHint: 's' string, 'n' number, 'd' date
    const cell = {};
    if (typeHint === "d") {
      cell.t = "d";
      cell.v = new Date(value);
    } else if (typeHint === "n") {
      const n = Number(String(value).replace(/\D/g, ""));
      cell.t = "n";
      cell.v = isNaN(n) ? 0 : n;
    } else {
      cell.t = "s";
      cell.v = String(value);
    }
    ws[addr] = cell;
  };

  setCell(sheetCapa, "E16", $("nomeCliente").value || "", "s");
  setCell(sheetCapa, "E17", $("cpfCliente").value || "", "s");
  // date: try to set as date object; input date is YYYY-MM-DD
  const dt = $("dataSolicitacao").value;
  if (dt) setCell(sheetCapa, "E10", new Date(dt + "T00:00:00"), "d");
  setCell(sheetCapa, "E11", $("caixa").value || "", "n");
  const codEst =
    estabelecimentos[$("nomeEstabelecimento").value] ||
    $("codigoEstabelecimento").value ||
    "";
  setCell(sheetCapa, "E14", codEst, "s");
  setCell(sheetCapa, "E19", $("canalVenda").value || "", "s");

  // Valor a cancelar: convert to number (from R$ format)
  const valorNum = parseCurrencyToNumber($("valorCancelar").value);
  if (!isNaN(valorNum)) {
    sheetCapa["E23"] = { t: "n", v: valorNum };
  } else {
    sheetCapa["E23"] = { t: "s", v: $("valorCancelar").value || "" };
  }

  // update CAPA range if needed
  expandRangeForCell(sheetCapa, "E23");

  // ---------- Fill DADOS (SESCNET) at D8 ----------
  // We'll write the first SESCNET line starting at D8 (col index 3, row 8)
  if (state.dadosSescnetTable && state.dadosSescnetTable.length) {
    // flatten first line(s). If multiple lines, write each into its own row starting row8
    const startRow = 8; // 1-based
    for (let r = 0; r < state.dadosSescnetTable.length; r++) {
      const row = state.dadosSescnetTable[r];
      for (let c = 0; c < row.length; c++) {
        const colIndex = 3 + c; // D = 0:A 1:B 2:C 3:D
        const addr = XLSX.utils.encode_cell({
          r: startRow - 1 + r,
          c: colIndex,
        });
        sheetDados[addr] = { t: "s", v: row[c] };
      }
    }
    // update ref
    expandRangeForSheetRange(
      sheetDados,
      3,
      startRow - 1,
      3 + (state.dadosSescnetTable[0].length || 0) - 1,
      startRow - 1 + state.dadosSescnetTable.length - 1
    );
  }

  // ---------- SiTef Web -> DADOS!B15 (if present) ----------
  if (state.sitefType === "web" && state.dadosSitefWeb.length) {
    const startRow = 15; // 1-based
    for (let c = 0; c < state.dadosSitefWeb.length; c++) {
      const addr = XLSX.utils.encode_cell({ r: startRow - 1, c: 1 + c }); // B = col1
      sheetDados[addr] = { t: "s", v: state.dadosSitefWeb[c] || "" };
    }
    expandRangeForSheetRange(
      sheetDados,
      1,
      startRow - 1,
      1 + state.dadosSitefWeb.length - 1,
      startRow - 1
    );
  }

  // ---------- SiTef Express -> DADOS!P22 (store keys in P, values in Q) ----------
  if (
    state.sitefType === "express" &&
    Object.keys(state.dadosSitefExpress).length
  ) {
    let row = 22; // starting row 22
    Object.entries(state.dadosSitefExpress).forEach(([k, v]) => {
      const addrKey = XLSX.utils.encode_cell({ r: row - 1, c: 15 }); // P col index 15
      const addrVal = XLSX.utils.encode_cell({ r: row - 1, c: 16 }); // Q index 16
      sheetDados[addrKey] = { t: "s", v: k };
      sheetDados[addrVal] = { t: "s", v: v };
      row++;
    });
    expandRangeForSheetRange(sheetDados, 15, 22 - 1, 16, row - 2);
  }

  // ---------- Optionally: Write the "Valor transacao" into DADOS L15/Q30 mapping for easier formulas ----------
  // If SiTef Web and dadosSitefWeb[11] exists, write to L15 (col L index 11, row15 index14)
  if (state.sitefType === "web" && state.dadosSitefWeb[11]) {
    const addr = XLSX.utils.encode_cell({ r: 15 - 1, c: 11 });
    sheetDados[addr] = { t: "s", v: state.dadosSitefWeb[11] };
    expandRangeForCell(sheetDados, addr);
  }
  // If SiTef Express and 'Valor' exists, write to Q30 (col Q index16, row30)
  if (state.sitefType === "express" && state.dadosSitefExpress["Valor"]) {
    const addr = XLSX.utils.encode_cell({ r: 30 - 1, c: 16 });
    sheetDados[addr] = { t: "s", v: state.dadosSitefExpress["Valor"] };
    expandRangeForCell(sheetDados, addr);
  }

  // ---------- Ensure !ref for both sheets ----------
  if (!sheetCapa["!ref"]) sheetCapa["!ref"] = detectSheetRange(sheetCapa);
  if (!sheetDados["!ref"]) sheetDados["!ref"] = detectSheetRange(sheetDados);

  // ---------- Write workbook and trigger download ----------
  const wbout = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const blob = new Blob([wbout], { type: "application/octet-stream" });
  const name = `solicitacao_preenchida_${new Date()
    .toISOString()
    .slice(0, 19)
    .replace(/[:T]/g, "-")}.xlsx`;
  triggerDownload(blob, name);

  alert(
    'Arquivo gerado. Abra no Excel para conferir os dados nas abas "CAPA" e "DADOS".'
  );
}

/* ---------- Utilities: parsing currency to number ---------- */
function parseCurrencyToNumber(str) {
  if (!str) return NaN;
  // ex: "R$ 1.234,56" -> 1234.56
  const cleaned = String(str)
    .replace(/[R$\s]/g, "")
    .replace(/\./g, "")
    .replace(/,/g, ".");
  const n = Number(cleaned);
  return isNaN(n) ? NaN : n;
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
  }, 5000);
}

/* ---------- Utilities: expand ranges (simple helpers) ---------- */
function expandRangeForCell(ws, addr) {
  const ref = ws["!ref"]
    ? XLSX.utils.decode_range(ws["!ref"])
    : { s: { r: 0, c: 0 }, e: { r: 0, c: 0 } };
  const cell = XLSX.utils.decode_cell(addr);
  ref.s.r = Math.min(ref.s.r, cell.r);
  ref.s.c = Math.min(ref.s.c, cell.c);
  ref.e.r = Math.max(ref.e.r, cell.r);
  ref.e.c = Math.max(ref.e.c, cell.c);
  ws["!ref"] = XLSX.utils.encode_range(ref);
}
function expandRangeForSheetRange(ws, c1, r1, c2, r2) {
  const ref = ws["!ref"]
    ? XLSX.utils.decode_range(ws["!ref"])
    : { s: { r: 999999, c: 999999 }, e: { r: 0, c: 0 } };
  ref.s.r = Math.min(ref.s.r, r1);
  ref.s.c = Math.min(ref.s.c, c1);
  ref.e.r = Math.max(ref.e.r, r2);
  ref.e.c = Math.max(ref.e.c, c2);
  ws["!ref"] = XLSX.utils.encode_range(ref);
}
function detectSheetRange(ws) {
  // naive detect - look for min/max cell coordinates (scan keys)
  const coords = Object.keys(ws)
    .filter((k) => k[0] !== "!")
    .map((k) => XLSX.utils.decode_cell(k));
  if (coords.length === 0) return "A1:A1";
  const rs = coords.reduce(
    (acc, c) => {
      acc.minR = Math.min(acc.minR, c.r);
      acc.minC = Math.min(acc.minC, c.c);
      acc.maxR = Math.max(acc.maxR, c.r);
      acc.maxC = Math.max(acc.maxC, c.c);
      return acc;
    },
    { minR: 999999, minC: 999999, maxR: 0, maxC: 0 }
  );
  return XLSX.utils.encode_range({
    s: { r: rs.minR, c: rs.minC },
    e: { r: rs.maxR, c: rs.maxC },
  });
}

/* ---------- Trigger generation ---------- */
document
  .getElementById("btnGenerate")
  .addEventListener("click", gerarExcelPreenchido);

/* ---------- Small UX niceties: Enter next, auto-mount summary on load ---------- */
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

/* Update summaryBox when returning to step 6 */
document.querySelectorAll(".step").forEach((s) => {
  s.addEventListener("transitionend", () => {
    if (s.id === "step-6" && s.classList.contains("active")) montarResumo();
  });
});

/* Initial display */
mostrarStep(1);
updateStepIndicator();

/* End of script.js */
