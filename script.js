

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
  $("stepIndicator").textContent = `Passo ${state.step} de 6`;
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

function voltar(targetStep){
  if (targetStep <1 || targetStep >6) return;

  state.step =targetStep;
  mostrarStep(targetStep);
}

/* ---------- Populate Establishments ---------- */
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

/* ---------- Masks ---------- */
function maskCPF(input) {
  let v = input.value.replace(/\D/g, "").slice(0, 11);
  v = v.replace(/^(\d{3})(\d)/, "$1.$2");
  v = v.replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3");
  v = v.replace(/\.(\d{3})(\d)/, ".$1-$2");
  input.value = v;
}
$("cpfCliente").addEventListener("input", () => maskCPF($("cpfCliente")));

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

$("valorCancelar").addEventListener("input", () => {
  formatCurrencyInput($("valorCancelar"));
  montarResumo();
});

/* ---------- Navegação Step 1 ---------- */
$("btnNext1").addEventListener("click", () => {
  if (!$("nomeCliente").value.trim()) 
      return alert("Preencha nome do cliente.");
  if (!$("cpfCliente").value.trim()) 
      return alert("Preencha o CPF.");
  if(!$("cpfCliente").length < 1)
    return alert("CPF incompleto");
  if (!$("dataSolicitacao").value.trim()) 
      return alert("Preencha a data.");
  if (!$("caixa").value.trim()) 
      return alert("Preencha o caixa.");
  if (!$("numeroVenda").value.trim())
    return alert("Preencha o número da venda.");
  if (!$("nomeEstabelecimento").value.trim())
    return alert("Selecione o estabelecimento.");
  if (!$("canalVenda").value.trim()) 
      return alert("Selecione o canal.");

  mostrarStep(2);
});

/* ---------- Step 2 ---------- */
$("btnNext2").addEventListener("click", () => {
  const raw = $("sescnetInput").value.trim();
  if (!$("sescnetInput").value.trim())
    return alert("Dados do SescNet vazios.")

  const lines = raw.split(/\r?\n/).filter(Boolean);
  state.dadosSescnetTable = lines.map((ln) => ln.split(/\t| +/g));

  const canal = $("canalVenda").value;
  if (canal === "sitef") mostrarStep(3);
  else {
    montarResumo();
    mostrarStep(6);
  }
});

/* ---------- Step 3 → Tipo SiTef ---------- */
$("sitefWeb").addEventListener("click", () => {
  state.sitefType = "web";
  mostrarStep(4);
});
$("sitefExpress").addEventListener("click", () => {
  state.sitefType = "express";
  mostrarStep(5);
});

/* ---------- Step 4 → SiTef Web ---------- */
$("btnNext4").addEventListener("click", () => {
  const txt = $("sitefWebInput").value.trim();
  if (!txt) return alert("Cole dados do SiTef Web.");

  state.dadosSitefWeb = txt.split("\t");
  montarResumo();
  mostrarStep(6);
});

/* ---------- Step 5 → SiTef Express ---------- */
$("btnNext5").addEventListener("click", () => {
  const txt = $("sitefExpressInput").value.trim();
  if (!txt) return alert("Cole dados do SiTef Express.");

  const map = {};
  txt.split(/\r?\n/).forEach((ln) => {
    const [k, v] = ln.split("\t");
    if (k && v) map[k.replace(/:$/, "")] = v.trim();
  });

  state.dadosSitefExpress = map;
  montarResumo();
  mostrarStep(6);
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
  const valorCard =
    state.sitefType === "web"
      ? state.dadosSitefWeb[11] || ""
      : state.dadosSitefExpress["Valor"] || "";

  $("summaryBox").innerHTML = `
    <div><b>Cliente:</b> ${$("nomeCliente").value}</div>
    <div><b>CPF:</b> ${$("cpfCliente").value}</div>
    <hr>
    <div><b>Estabelecimento:</b> ${$("nomeEstabelecimento").value}</div>
    <div><b>Caixa:</b> ${$("caixa").value}</div>
    <div><b>Venda:</b> ${$("numeroVenda").value}</div>
    <hr>
    <div><b>Valor transação cartão:</b> ${valorCard || "(não encontrado)"}</div>
    <div><b>Valor a cancelar:</b> ${
      $("valorCancelar").value || "(pendente)"
    }</div>
  `;
}

/* ---------- ExcelJS Export ---------- */
async function gerarExcelPreenchido() {
  console.log("Função gerarExcelPreenchido foi chamada!"); // <--- agora aparece

  const valorRaw = $("valorCancelar").value.trim();
  if (!valorRaw) return alert("Informe o valor a cancelar.");

  const workbook = new ExcelJS.Workbook();

  try {
    const resp = await fetch("template.xlsx");
    const buffer = await resp.arrayBuffer();
    await workbook.xlsx.load(buffer);
  } catch (e) {
    return alert("Erro carregando template.xlsx\n" + e.message);
  }

  const sheetCapa = workbook.getWorksheet("CAPA");

  sheetCapa.getCell("E16").value = $("nomeCliente").value;
  sheetCapa.getCell("E17").value = $("cpfCliente").value;
  sheetCapa.getCell("E14").value =
    estabelecimentos[$("nomeEstabelecimento").value] || "";

  sheetCapa.getCell("E11").value = Number($("caixa").value);
  sheetCapa.getCell("E10").value = new Date(
    $("dataSolicitacao").value + "T00:00"
  );

  sheetCapa.getCell("E23").value = parseCurrencyToNumber(valorRaw);

  // Salvar
  const out = await workbook.xlsx.writeBuffer();
  triggerDownload(
    new Blob([out], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    }),
    "solicitacao_preenchida.xlsx"
  );

  alert("Arquivo gerado!");
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
$("btnGenerate").addEventListener("click", gerarExcelPreenchido);
