// ============================================
// SCRIPT DE CÁLCULO DE MULTA - ACADEMIA SESC
// ============================================

const $ = (id) => document.getElementById(id);

let state = {
  step: 1,
  modalidade: null,
  plano: null,
  num_plano: 0,
};

// ============================================
// NAVEGAÇÃO E CONTROLE DE STEPS
// ============================================

function updateStepIndicator() {
  const el = $("stepIndicator");
  if (el) el.textContent = `Passo ${state.step} de 2`;
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

function voltarStep1() {
  mostrarStep(1);
}

// Função para voltar à página inicial
function voltarPaginaInicial() {
  window.location.href = "/escolha.html";
}

// ============================================
// FORMATAÇÃO DE MOEDA
// ============================================

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

// ============================================
// SETUP INICIAL
// ============================================

function setupStep1() {
  const modalidadeEl = $("modalidade");
  const planoEl = $("plano");

  if (modalidadeEl) {
    modalidadeEl.addEventListener("change", (e) => {
      const valor = e.target.value;
      state.modalidade = valor;

      if (!valor) {
        planoEl.disabled = true;
        planoEl.innerHTML =
          '<option value="">Selecione uma modalidade primeiro</option>';
        return;
      }

      planoEl.disabled = false;
      planoEl.innerHTML = '<option value="">Selecione...</option>';

      if (valor === "recorrencia") {
        planoEl.innerHTML += `
          <option value="trimestral">Trimestral</option>
          <option value="semestral">Semestral</option>
          <option value="anual">Anual</option>
        `;
      } else if (valor === "nao-recorrencia") {
        planoEl.innerHTML += `
          <option value="mensal">Mensal</option>
          <option value="trimestral">Trimestral</option>
          <option value="semestral">Semestral</option>
          <option value="anual">Anual</option>
        `;
      }
    });
  }

  if (planoEl) {
    planoEl.addEventListener("change", (e) => {
      state.plano = e.target.value;
    });
  }
}

setupStep1();

// ============================================
// BOTÃO PRÓXIMO (STEP 1)
// ============================================

if ($("btnNext1")) {
  $("btnNext1").addEventListener("click", () => {
    if (!state.modalidade) {
      return showModal("Atenção", "Selecione a modalidade.");
    }
    if (!state.plano) {
      return showModal("Atenção", "Selecione o plano.");
    }

    // Define num_plano
    switch (state.plano) {
      case "trimestral":
        state.num_plano = 3;
        break;
      case "semestral":
        state.num_plano = 6;
        break;
      case "anual":
        state.num_plano = 12;
        break;
      default:
        state.num_plano = 1;
    }

    montarFormularioCalculo();
    mostrarStep(2);
  });
}

// ============================================
// MONTAGEM DINÂMICA DO FORMULÁRIO (STEP 2)
// ============================================

function montarFormularioCalculo() {
  const formCalculo = $("formCalculo");
  if (!formCalculo) return;

  let html = "";

  // NÃO RECORRÊNCIA + NÃO MENSAL
  if (state.modalidade === "nao-recorrencia" && state.plano !== "mensal") {
    html = `
      <div class="grid-2">
        <label class="field">
          <span>Valor do plano mensal (R$)</span>
          <input id="valor_mensal" type="text" placeholder="R$ 0,00" />
        </label>

        <label class="field">
          <span>Valor do plano escolhido (R$) - Valor total</span>
          <input id="valor_plano" type="text" placeholder="R$ 0,00" />
        </label>

        <label class="field">
          <span>Data da venda</span>
          <input id="data_venda" type="date" />
        </label>

        <label class="field">
          <span>Número de meses utilizados</span>
          <input id="meses_ut" type="number" min="0" placeholder="Ex: 2" />
        </label>

        <label class="field">
          <span>Data da solicitação do cancelamento</span>
          <input id="data_canc" type="date" />
        </label>

        <label class="field">
          <span>O valor da multa será descontado do valor a devolver?</span>
          <select id="descontar_multa">
            <option value="">Selecione...</option>
            <option value="true">Sim</option>
            <option value="false">Não</option>
          </select>
        </label>
      </div>
    `;
  }
  // RECORRÊNCIA
  else if (state.modalidade === "recorrencia") {
    html = `
      <div class="grid-2">
        <label class="field">
          <span>Valor do plano mensal (R$)</span>
          <input id="valor_mensal" type="text" placeholder="R$ 0,00" />
        </label>

        <label class="field">
          <span>Valor do plano escolhido (R$) - Valor total</span>
          <input id="valor_plano" type="text" placeholder="R$ 0,00" />
        </label>

        <label class="field">
          <span>Data da venda</span>
          <input id="data_venda" type="date" />
        </label>

        <label class="field">
          <span>Número de meses utilizados</span>
          <input id="meses_ut" type="number" min="0" placeholder="Ex: 2" />
        </label>

        <label class="field">
          <span>Data da solicitação do cancelamento</span>
          <input id="data_canc" type="date" />
        </label>
      </div>
    `;
  }
  // NÃO RECORRÊNCIA + MENSAL
  else if (state.modalidade === "nao-recorrencia" && state.plano === "mensal") {
    html = `
      <div class="grid-2">
        <label class="field">
          <span>Valor do plano mensal (R$)</span>
          <input id="valor_mensal" type="text" placeholder="R$ 0,00" />
        </label>

        <label class="field">
          <span>Data da venda</span>
          <input id="data_venda" type="date" />
        </label>

        <label class="field">
          <span>Data da solicitação do cancelamento</span>
          <input id="data_canc" type="date" />
        </label>
      </div>
    `;
  }

  formCalculo.innerHTML = html;

  // Adiciona listeners para formatação de moeda e cálculos
  setTimeout(() => {
    const inputs = formCalculo.querySelectorAll("input, select");
    inputs.forEach((input) => {
      // Formatar campos de valor
      if (input.id === "valor_mensal" || input.id === "valor_plano") {
        input.addEventListener("input", (e) => {
          formatCurrencyInput(e.target);
          calcularResultados();
        });
      } else {
        input.addEventListener("input", calcularResultados);
        input.addEventListener("change", calcularResultados);
      }
    });
  }, 100);
}

// ============================================
// CÁLCULO DE RESULTADOS
// ============================================

function parseCurrencyToNumber(value) {
  if (!value) return 0;
  return Number(
    value
      .replace(/[^\d,]/g, "")
      .replace(/\./g, "")
      .replace(",", ".")
  );
}

function calcularResultados() {
  const resultadosBox = $("resultadosCalculo");
  const resultadosContent = $("resultadosContent");

  if (!resultadosBox || !resultadosContent) return;

  // NÃO RECORRÊNCIA + NÃO MENSAL
  if (state.modalidade === "nao-recorrencia" && state.plano !== "mensal") {
    const valor_mensal = parseCurrencyToNumber($("valor_mensal")?.value || "0");
    const valor_plano = parseCurrencyToNumber($("valor_plano")?.value || "0");
    const data_venda = $("data_venda")?.value || "";
    const meses_ut = parseInt($("meses_ut")?.value || 0);
    const data_canc = $("data_canc")?.value || "";
    const descontar_multa = $("descontar_multa")?.value === "true";

    if (!valor_mensal || !valor_plano || !data_venda || !data_canc) {
      resultadosBox.style.display = "none";
      return;
    }

    const meses_disp = calcularMesesDisponibilizados(data_venda, data_canc);
    const dif_plano = state.num_plano - meses_disp;
    const multa_mes = valor_mensal - valor_plano / state.num_plano;
    const multa_total = multa_mes * meses_ut;
    const servico_disp = meses_disp * (valor_plano / state.num_plano);
    const servico_e_multa = servico_disp + multa_total;

    let valor_devolucao;
    if (descontar_multa) {
      valor_devolucao = valor_plano - servico_e_multa;
    } else {
      valor_devolucao = valor_plano - servico_disp;
    }

    if (valor_devolucao > 0) {
      resultadosContent.innerHTML = `
      <div><b>Meses disponibilizados:</b> ${meses_disp}</div>
      <div><b>Meses utilizados:</b> ${meses_ut}</div>
      <div><b>Multa por mês:</b> ${formatarMoeda(multa_mes)}</div>
      <div><b>Valor total da multa:</b> ${formatarMoeda(multa_total)}</div>
      <div><b>Valor do serviço disponibilizado:</b> ${formatarMoeda(
        servico_disp
      )}</div>
      <div><b>Valor do serviço disponibilizado + multa:</b> ${formatarMoeda(
        servico_e_multa
      )}</div>
      <hr style="margin: 12px 0;">
      <div style="font-size: 16px; font-weight: 800; color: var(--blue);">
        <b>Valor a devolver para o cliente:</b> ${formatarMoeda(
          valor_devolucao
        )}
      </div>
    `;
    } else if (valor_devolucao < 0) {
      resultadosContent.innerHTML = `
        <div><b>Meses disponibilizados:</b> ${meses_disp}</div>
        <div><b>Meses utilizados:</b> ${meses_ut}</div>
        <div><b>Multa por mês:</b> ${formatarMoeda(multa_mes)}</div>
        <div><b>Valor total da multa:</b> ${formatarMoeda(multa_total)}</div>
        <div><b>Valor do serviço disponibilizado:</b> ${formatarMoeda(
          servico_disp
        )}</div>
        <div><b>Valor do serviço disponibilizado + multa:</b> ${formatarMoeda(
          servico_e_multa
        )}</div>
        <hr style="margin: 12px 0;">
        <div style="font-size: 16px; font-weight: 800; color: var(--blue);">
          <b>Valor a ser pago pelo cliente:</b> ${formatarMoeda(
            valor_devolucao
          )}
        </div>
      `;
    }
    resultadosBox.style.display = "block";
  }
  // RECORRÊNCIA
  else if (state.modalidade === "recorrencia") {
    const valor_mensal = parseCurrencyToNumber($("valor_mensal")?.value || "0");
    const valor_plano = parseCurrencyToNumber($("valor_plano")?.value || "0");
    const data_venda = $("data_venda")?.value || "";
    const meses_ut = parseInt($("meses_ut")?.value || 0);
    const data_canc = $("data_canc")?.value || "";

    if (!valor_mensal || !valor_plano || !data_venda || !data_canc) {
      resultadosBox.style.display = "none";
      return;
    }

    const meses_disp = calcularMesesDisponibilizados(data_venda, data_canc);
    const dif_plano = state.num_plano - meses_disp;
    const multa_mes = valor_mensal - valor_plano / state.num_plano;
    const multa_total = multa_mes * meses_ut;

    resultadosContent.innerHTML = `
      <div><b>Meses disponibilizados:</b> ${meses_disp}</div>
      <div><b>Meses utilizados:</b> ${meses_ut}</div>
      <div><b>Multa por mês:</b> ${formatarMoeda(multa_mes)}</div>
      <hr style="margin: 12px 0;">
      <div style="font-size: 16px; font-weight: 800; color: var(--blue);">
        <b>Valor total da multa:</b> ${formatarMoeda(multa_total)}
      </div>
    `;

    resultadosBox.style.display = "block";
  }
  // NÃO RECORRÊNCIA + MENSAL
  else if (state.modalidade === "nao-recorrencia" && state.plano === "mensal") {
    const valor_mensal = parseCurrencyToNumber($("valor_mensal")?.value || "0");
    const data_venda = $("data_venda")?.value || "";
    const data_canc = $("data_canc")?.value || "";

    if (!valor_mensal || !data_venda || !data_canc) {
      resultadosBox.style.display = "none";
      return;
    }

    const valor_dia = valor_mensal / 30;
    const dias_disp = calcularDiasDisponibilizados(data_venda, data_canc);
    const valor_devolucao = valor_mensal - valor_dia * dias_disp;

    resultadosContent.innerHTML = `
      <div><b>Valor por dia:</b> ${formatarMoeda(valor_dia)}</div>
      <div><b>Dias disponibilizados:</b> ${dias_disp}</div>
      <hr style="margin: 12px 0;">
      <div style="font-size: 16px; font-weight: 800; color: var(--blue);">
        <b>Valor a devolver para o cliente:</b> ${formatarMoeda(
          valor_devolucao
        )}
      </div>
    `;

    resultadosBox.style.display = "block";
  }
}

// ============================================
// FUNÇÕES AUXILIARES DE CÁLCULO
// ============================================

function calcularMesesDisponibilizados(dataVenda, dataCancelamento) {
  const d1 = new Date(dataVenda + "T00:00:00");
  const d2 = new Date(dataCancelamento + "T00:00:00");

  let meses = 0;
  let dataAtual = new Date(d1);

  while (dataAtual < d2) {
    dataAtual.setMonth(dataAtual.getMonth() + 1);
    if (dataAtual <= d2) {
      meses++;
    }
  }

  // Adiciona 1 mês se o dia do cancelamento for maior que o dia da venda
  if (d2.getDate() > d1.getDate()) {
    meses++;
  }

  return meses;
}

function calcularDiasDisponibilizados(dataVenda, dataCancelamento) {
  const d1 = new Date(dataVenda + "T00:00:00");
  const d2 = new Date(dataCancelamento + "T00:00:00");
  const diffTime = Math.abs(d2 - d1);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

function formatarMoeda(valor) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(valor);
}

// ============================================
// FUNÇÕES DE LIMPEZA
// ============================================

function limparDados() {
  $("modalidade").value = "";
  $("plano").disabled = true;
  $("plano").innerHTML =
    '<option value="">Selecione uma modalidade primeiro</option>';

  state = {
    step: 1,
    modalidade: null,
    plano: null,
    num_plano: 0,
  };

  showModal("Limpeza Concluída", "As informações foram apagadas.");
}

function limparCalculos() {
  const inputs = document.querySelectorAll("#step-2 input, #step-2 select");
  inputs.forEach((input) => (input.value = ""));

  const resultadosBox = $("resultadosCalculo");
  if (resultadosBox) {
    resultadosBox.style.display = "none";
  }

  showModal("Limpeza Concluída", "Os cálculos foram apagados.");
}

// ============================================
// MODAL SYSTEM
// ============================================

function showModal(title, message, options = {}) {
  const modal = $("modal");
  if (!modal) return;

  const titleEl = $("modal-title");
  const msgEl = $("modal-message");
  const okBtn = $("modal-ok");

  if (titleEl) titleEl.textContent = title || "";
  if (msgEl) msgEl.innerHTML = message || "";

  if (okBtn) {
    okBtn.textContent = options.okText || "OK";
  }

  modal.classList.remove("hidden");
  modal.setAttribute("aria-hidden", "false");

  const cleanup = () => {
    if (okBtn) okBtn.onclick = null;
    modal.classList.add("hidden");
    modal.setAttribute("aria-hidden", "true");
  };

  if (okBtn) {
    okBtn.onclick = () => {
      cleanup();
      if (typeof options.onOk === "function") options.onOk();
    };
  }
}
