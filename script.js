/* ════════════════════════════════════════════════════
   BarberSchedule — script.js  PREMIUM EDITION v2
   + Fluxo por etapas
   + Imagens Cloudinary
   + WhatsApp do cliente
   + Configuração separada via config.js
   ⚠️  NÃO EDITE ESTE ARQUIVO. Edite apenas config.js
════════════════════════════════════════════════════ */

'use strict';

/* ── Lê configurações do config.js ───────────────── */
if (typeof BARBERSHOP_CONFIG === 'undefined') {
  console.error('[BarberSchedule] config.js não encontrado! Inclua-o antes de script.js no HTML.');
}

const CONFIG = {
  SHEETS_ENDPOINT:   BARBERSHOP_CONFIG.SHEETS_ENDPOINT,
  HORARIOS:          BARBERSHOP_CONFIG.HORARIOS,
  PRECOS:            BARBERSHOP_CONFIG.SERVICOS,
  TOAST_DURATION:    BARBERSHOP_CONFIG.TOAST_DURATION,
  CSV_URL:           BARBERSHOP_CONFIG.CSV_URL,
  POLLING_INTERVAL:  BARBERSHOP_CONFIG.POLLING_INTERVAL,
  IMAGENS: BARBERSHOP_CONFIG.IMAGENS,
};

/* ── Aplica nome do estabelecimento ──────────────── */
document.addEventListener('DOMContentLoaded', () => {
  const nomeEls = document.querySelectorAll('[data-barbershop-name]');
  nomeEls.forEach(el => { el.textContent = BARBERSHOP_CONFIG.NOME; });
  document.title = BARBERSHOP_CONFIG.NOME;
  aplicarTema();
});

/* ── Aplica tema de cores via CSS variables ──────── */
function aplicarTema() {
  if (!BARBERSHOP_CONFIG.CORES) return;
  const root = document.documentElement;
  const c = BARBERSHOP_CONFIG.CORES;

  // Dourados
  if (c.gold300) {
    root.style.setProperty('--gold-300', c.gold300);
    root.style.setProperty('--clr-border-gold', hexToRgba(c.gold300, 0.3));
    root.style.setProperty('--gold-glow',        hexToRgba(c.gold300, 0.10));
    root.style.setProperty('--gold-glow-strong', hexToRgba(c.gold300, 0.22));
    root.style.setProperty('--shadow-gold',      `0 0 32px ${hexToRgba(c.gold300, 0.18)}`);
    root.style.setProperty('--shadow-gold-strong',`0 4px 32px ${hexToRgba(c.gold300, 0.35)}`);
    root.style.setProperty('--grad-gold',        `linear-gradient(135deg, ${c.gold300} 0%, ${c.gold200 || c.gold300} 45%, ${c.gold300} 100%)`);
  }
  if (c.gold200) root.style.setProperty('--gold-200', c.gold200);
  if (c.gold100) root.style.setProperty('--gold-100', c.gold100);

  // Fundos
  if (c.bg)       root.style.setProperty('--clr-bg',        c.bg);
  if (c.surface)  root.style.setProperty('--clr-surface',   c.surface);
  if (c.surface2) root.style.setProperty('--clr-surface-2', c.surface2);

  // Textos
  if (c.texto)      root.style.setProperty('--clr-text',       c.texto);
  if (c.textoMuted) root.style.setProperty('--clr-text-muted', c.textoMuted);
}

/* Converte #hex para rgba(r,g,b,a) */
function hexToRgba(hex, alpha) {
  const r = parseInt(hex.slice(1,3), 16);
  const g = parseInt(hex.slice(3,5), 16);
  const b = parseInt(hex.slice(5,7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}


/* ── ESTADO ─────────────────────────────────────── */
const state = {
  horarioSelecionado: null,
  diaSelecionado: null,
  horariosOcupadosPorDia: {},
  horariosOcupados: new Set(),
  servicoAtivo: null,
  precoAtivo: null,
  carregando: false,
  pollingTimer: null,
  ultimoAgendamento: null,
  etapaAtual: 1,
};

/* ── REFERÊNCIAS DOM ─────────────────────────────── */
const dom = {
  statusTime:   document.getElementById('statusTime'),
  headerDay:    document.getElementById('headerDay'),
  headerDate:   document.getElementById('headerDate'),
  slotsCount:   document.getElementById('slotsCount'),

  stepView1:        document.getElementById('stepView1'),
  stepView2:        document.getElementById('stepView2'),
  stepIndicator1:   document.getElementById('stepIndicator1'),
  stepIndicator2:   document.getElementById('stepIndicator2'),
  btnBack:          document.getElementById('btnBack'),
  ssbName:          document.getElementById('ssbName'),
  ssbPrice:         document.getElementById('ssbPrice'),

  diasGrid:     document.getElementById('diasGrid'),
  slotsGrid:    document.getElementById('slotsGrid'),

  overlay:          document.getElementById('modalOverlay'),
  sheet:            document.getElementById('modalSheet'),
  modalClose:       document.getElementById('modalClose'),
  modalTimeDisplay: document.getElementById('modalTimeDisplay'),

  inputNome:      document.getElementById('inputNome'),
  inputTelefone:  document.getElementById('inputTelefone'),
  inputServico:   document.getElementById('inputServico'),
  inputValor:     document.getElementById('inputValor'),

  summaryData:    document.getElementById('summaryData'),
  summaryHorario: document.getElementById('summaryHorario'),

  btnConfirm: document.getElementById('btnConfirm'),
  btnLoader:  document.getElementById('btnLoader'),

  receiptModal:   document.getElementById('receiptModal'),
  receiptNome:    document.getElementById('receiptNome'),
  receiptServico: document.getElementById('receiptServico'),
  receiptData:    document.getElementById('receiptData'),
  receiptHorario: document.getElementById('receiptHorario'),
  receiptValor:   document.getElementById('receiptValor'),
  btnWhatsapp:    document.getElementById('btnWhatsapp'),
  btnReceiptClose:document.getElementById('btnReceiptClose'),

  toast:    document.getElementById('toast'),
  toastMsg: document.getElementById('toastMsg'),
  toastIcon:document.getElementById('toastIcon'),
};


/* ══════════════════════════════════════════════════
   CABEÇALHO — Aplica nome, subtítulo e logo do config
══════════════════════════════════════════════════ */
function aplicarCabecalho() {
  const cfg = BARBERSHOP_CONFIG;
  const brandName = document.querySelector('.brand-name');
  const brandSub  = document.querySelector('.brand-sub');
  if (brandName && cfg.BRAND_NAME) brandName.textContent = cfg.BRAND_NAME;
  if (brandSub  && cfg.BRAND_SUB)  brandSub.textContent  = cfg.BRAND_SUB;

  const brandIcon = document.querySelector('.brand-icon');
  if (!brandIcon) return;

  // Tenta carregar a logo: primeiro pelo LOGO_FILENAME, depois tenta assets/logo.*
  const filename = cfg.LOGO_FILENAME;
  if (filename) {
    const logoSrc = 'assets/' + filename;
    const img = new Image();
    img.onload = () => {
      brandIcon.innerHTML = '<img src="' + logoSrc + '" alt="Logo" style="width:100%;height:100%;object-fit:cover;border-radius:6px;" />';
    };
    img.src = logoSrc;
  }
}

/* ══════════════════════════════════════════════════
   SERVIÇOS — Gera os cards e o select a partir do config
══════════════════════════════════════════════════ */
function gerarServicos() {
  const container = document.querySelector('.services-scroll');
  const select    = document.getElementById('inputServico');
  if (!container || !select) return;

  const servicos = BARBERSHOP_CONFIG.SERVICOS;
  const imagens  = BARBERSHOP_CONFIG.IMAGENS || [];

  const lista = Array.isArray(servicos)
    ? servicos
    : Object.entries(servicos).map(([nome, preco]) => ({ nome, preco }));

  container.innerHTML = '';
  lista.forEach((svc, i) => {
    const imgSrc   = imagens[i] || '';
    const precoNum = parseFloat(String(svc.preco).replace(',', '.'));
    const precoInt = Math.round(precoNum);

    const chip = document.createElement('div');
    chip.className = 'service-chip';
    chip.dataset.service = svc.nome;
    chip.dataset.price   = precoInt;
    chip.setAttribute('role', 'button');
    chip.setAttribute('tabindex', '0');
    chip.setAttribute('aria-pressed', 'false');

    const imgHTML = imgSrc
      ? '<img src="' + imgSrc + '" alt="' + svc.nome + '" class="chip-img-photo" onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'flex\';" /><div class="chip-image-inner" style="display:none">✂️</div>'
      : '<div class="chip-image-inner">✂️</div>';

    chip.innerHTML =
      '<div class="chip-active-bar"></div>' +
      '<div class="chip-image">' + imgHTML + '</div>' +
      '<div class="chip-content">' +
        '<span class="chip-label">' + svc.nome + '</span>' +
        '<div class="chip-meta">' +
          '<span class="chip-price">R$ ' + precoInt + '</span>' +
        '</div>' +
      '</div>' +
      '<div class="chip-check">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>' +
      '</div>';

    container.appendChild(chip);
  });

  select.innerHTML = '<option value="">Selecione o serviço…</option>';
  lista.forEach(svc => {
    const opt = document.createElement('option');
    opt.value       = svc.nome;
    opt.textContent = svc.nome + ' — R$ ' + svc.preco;
    select.appendChild(opt);
  });
}


/* ══════════════════════════════════════════════════
   FLUXO POR ETAPAS
══════════════════════════════════════════════════ */
function irParaEtapa2(servico, preco) {
  state.servicoAtivo = servico;
  state.precoAtivo   = preco;
  state.etapaAtual   = 2;

  dom.ssbName.textContent  = servico;
  const lista = Array.isArray(BARBERSHOP_CONFIG.SERVICOS)
    ? BARBERSHOP_CONFIG.SERVICOS
    : Object.entries(BARBERSHOP_CONFIG.SERVICOS).map(([nome, preco]) => ({ nome, preco }));
  const svcEncontrado = lista.find(s => s.nome === servico);
  dom.ssbPrice.textContent = `R$ ${svcEncontrado ? svcEncontrado.preco : preco}`;

  dom.stepIndicator1.classList.remove('active');
  dom.stepIndicator1.classList.add('done');
  dom.stepIndicator2.classList.add('active');

  dom.stepView1.classList.add('slide-out');

  setTimeout(() => {
    dom.stepView1.classList.remove('active', 'slide-out');
    dom.stepView2.classList.add('slide-in');
    dom.stepView2.style.display = 'block';

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        dom.stepView2.classList.remove('slide-in');
        dom.stepView2.classList.add('active');
      });
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, 220);
}

function voltarParaEtapa1() {
  state.servicoAtivo = null;
  state.etapaAtual   = 1;

  dom.stepIndicator2.classList.remove('active');
  dom.stepIndicator1.classList.remove('done');
  dom.stepIndicator1.classList.add('active');

  dom.stepView2.classList.add('slide-out');
  dom.stepView2.classList.remove('active');

  setTimeout(() => {
    dom.stepView2.classList.remove('slide-out');
    dom.stepView2.style.display = 'none';

    dom.stepView1.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, 220);
}


/* ══════════════════════════════════════════════════
   INICIALIZAÇÃO
══════════════════════════════════════════════════ */
async function init() {
  atualizarRelogio();
  atualizarDataHeader();
  aplicarCabecalho();
  gerarServicos();   // gera cards e select ANTES de bindEventos
  bindEventos();
  await carregarCSV();
  renderizarDias();
  setInterval(atualizarRelogio, 30_000);

  state.pollingTimer = setInterval(() => {
    if (!dom.overlay.classList.contains('active')) {
      carregarCSV().then(() => renderizarSlots());
    }
  }, CONFIG.POLLING_INTERVAL);
}


/* ══════════════════════════════════════════════════
   RELÓGIO E DATA
══════════════════════════════════════════════════ */
function atualizarRelogio() {
  const agora = new Date();
  const hh = String(agora.getHours()).padStart(2, '0');
  const mm = String(agora.getMinutes()).padStart(2, '0');
  dom.statusTime.textContent = `${hh}:${mm}`;
}

function atualizarDataHeader() {
  const agora = new Date();
  const dias   = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const meses  = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
                   'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  dom.headerDay.textContent  = dias[agora.getDay()].toUpperCase();
  dom.headerDate.textContent = `${agora.getDate()} ${meses[agora.getMonth()]}`;
}


/* ══════════════════════════════════════════════════
   CSV — PLANILHA
══════════════════════════════════════════════════ */
async function carregarCSV() {
  try {
    const url = `${CONFIG.CSV_URL}&t=${Date.now()}`;
    const res  = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const texto  = await res.text();
    const linhas = texto.trim().split('\n').slice(1);

    const novo = {};
    for (const linha of linhas) {
      const cols    = linha.split(',').map(c => c.replace(/^"|"$/g, '').trim());
      const horario = cols[1];
      const data    = cols[2];
      if (!horario || !data) continue;
      if (!novo[data]) novo[data] = new Set();
      novo[data].add(horario);
    }

    state.horariosOcupadosPorDia = novo;

    if (state.diaSelecionado) {
      const chave = state.diaSelecionado.toLocaleDateString('pt-BR');
      state.horariosOcupados = state.horariosOcupadosPorDia[chave] || new Set();
    }
  } catch (err) {
    console.warn('[BarberSchedule] Falha ao carregar CSV:', err.message);
  }
}


/* ══════════════════════════════════════════════════
   DIAS
══════════════════════════════════════════════════ */
function renderizarDias() {
  dom.diasGrid.innerHTML = '';

  const DIAS_SEMANA = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  for (let i = 0; i < 7; i++) {
    const data = new Date(hoje);
    data.setDate(hoje.getDate() + i);

    const btn = document.createElement('button');
    btn.classList.add('dia-btn');
    btn.dataset.ts = data.getTime();

    const diaSemana = DIAS_SEMANA[data.getDay()];
    const dia       = String(data.getDate()).padStart(2, '0');
    const mes       = String(data.getMonth() + 1).padStart(2, '0');

    btn.innerHTML = `
      <span class="dia-semana">${i === 0 ? 'Hoje' : diaSemana}</span>
      <span class="dia-numero">${dia}/${mes}</span>
    `;

    btn.addEventListener('click', () => selecionarDia(data, btn));
    dom.diasGrid.appendChild(btn);
  }

  const primeiro = dom.diasGrid.querySelector('.dia-btn');
  if (primeiro) primeiro.click();
}

async function selecionarDia(data, btn) {
  state.diaSelecionado = data;
  const chave = data.toLocaleDateString('pt-BR');

  dom.diasGrid.querySelectorAll('.dia-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  dom.summaryData.textContent = chave;

  if (!state.horariosOcupadosPorDia[chave]) {
    state.horariosOcupadosPorDia[chave] = new Set();
  }

  state.horariosOcupados = state.horariosOcupadosPorDia[chave];
  renderizarSlots();

  await carregarCSV();
  renderizarSlots();
}


/* ══════════════════════════════════════════════════
   SLOTS DE HORÁRIO
══════════════════════════════════════════════════ */
function renderizarSlots() {
  dom.slotsGrid.innerHTML = '';
  CONFIG.HORARIOS.forEach((horario, index) => {
    dom.slotsGrid.appendChild(criarBotaoSlot(horario, index));
  });
  atualizarContadorSlots();
}

function criarBotaoSlot(horario, index) {
  const ocupado = state.horariosOcupados.has(horario);
  const periodo = getPeriodo(horario);

  const btn = document.createElement('button');
  btn.classList.add('slot-btn');
  if (ocupado) btn.classList.add('booked');

  btn.style.animationDelay = `${index * 60}ms`;
  btn.dataset.horario = horario;
  btn.setAttribute('aria-label', `Agendar às ${horario}${ocupado ? ' — já agendado' : ''}`);
  btn.disabled = ocupado;

  btn.innerHTML = `
    <div class="slot-badge"></div>
    <span class="slot-time">${horario}</span>
    <span class="slot-period">${periodo}</span>
    ${ocupado ? '<span class="slot-booked-label">Agendado</span>' : ''}
  `;

  if (!ocupado) {
    btn.addEventListener('click', () => abrirModal(horario));
  }
  return btn;
}

function getPeriodo(horario) {
  const hora = parseInt(horario.split(':')[0], 10);
  if (hora < 12) return 'Manhã';
  if (hora < 18) return 'Tarde';
  return 'Noite';
}

function atualizarContadorSlots() {
  const disponiveis = CONFIG.HORARIOS.length - state.horariosOcupados.size;
  dom.slotsCount.textContent = `${disponiveis} horário${disponiveis !== 1 ? 's' : ''}`;
}


/* ══════════════════════════════════════════════════
   MODAL — ABRIR / FECHAR
══════════════════════════════════════════════════ */
function abrirModal(horario) {
  state.horarioSelecionado = horario;

  dom.modalTimeDisplay.textContent = horario;
  dom.summaryHorario.textContent   = horario;

  if (state.servicoAtivo) {
    const lista = Array.isArray(BARBERSHOP_CONFIG.SERVICOS)
      ? BARBERSHOP_CONFIG.SERVICOS
      : Object.entries(BARBERSHOP_CONFIG.SERVICOS).map(([nome, preco]) => ({ nome, preco }));
    const svc = lista.find(s => s.nome === state.servicoAtivo);
    dom.inputServico.value = state.servicoAtivo;
    dom.inputValor.value   = svc ? svc.preco : '';
  }

  dom.inputNome.value      = '';
  dom.inputTelefone.value  = '';
  limparErros();

  dom.overlay.classList.add('active');
  dom.overlay.setAttribute('aria-hidden', 'false');
  setTimeout(() => dom.inputNome.focus(), 350);
}

function fecharModal() {
  dom.overlay.classList.remove('active');
  dom.overlay.setAttribute('aria-hidden', 'true');
  state.horarioSelecionado = null;
  restaurarBotaoConfirmar();
}


/* ══════════════════════════════════════════════════
   COMPROVANTE
══════════════════════════════════════════════════ */
function abrirComprovante(dados) {
  dom.receiptNome.textContent    = dados.nome;
  dom.receiptServico.textContent = dados.tipoServico;
  dom.receiptData.textContent    = dados.data;
  dom.receiptHorario.textContent = dados.horario;
  dom.receiptValor.textContent   = `R$ ${dados.valor}`;
  state.ultimoAgendamento = dados;

  dom.receiptModal.classList.add('active');
  dom.receiptModal.setAttribute('aria-hidden', 'false');
}

function fecharComprovante() {
  dom.receiptModal.classList.remove('active');
  dom.receiptModal.setAttribute('aria-hidden', 'true');
}

function abrirWhatsApp() {
  if (!state.ultimoAgendamento) return;
  const d = state.ultimoAgendamento;
  const msg = encodeURIComponent(
    `✂️ *AGENDAMENTO CONFIRMADO*\n\n` +
    `👤 *Nome:* ${d.nome}\n` +
    `💈 *Serviço:* ${d.tipoServico}\n` +
    `📅 *Data:* ${d.data}\n` +
    `⏰ *Horário:* ${d.horario}\n` +
    `💰 *Valor:* R$ ${d.valor}\n\n` +
    `_Agendado via ${BARBERSHOP_CONFIG.NOME}_`
  );
  window.open(`https://api.whatsapp.com/send?text=${msg}`, '_blank');
}


/* ══════════════════════════════════════════════════
   VALIDAÇÃO
══════════════════════════════════════════════════ */
function validarFormulario() {
  limparErros();

  const nome     = dom.inputNome.value.trim();
  const telefone = dom.inputTelefone.value.trim();
  const servico  = dom.inputServico.value;
  const valor    = dom.inputValor.value.trim();
  let valido = true;

  if (nome.length < 2)            { marcarErro(dom.inputNome, 'Informe seu nome completo'); valido = false; }
  if (!validarTelefone(telefone)) { marcarErro(dom.inputTelefone, 'Informe um telefone válido'); valido = false; }
  if (!servico)                   { marcarErro(dom.inputServico, 'Selecione o tipo de serviço'); valido = false; }
  if (!valor)                     { marcarErro(dom.inputValor, 'Informe o valor do serviço'); valido = false; }

  if (!valido) return { valido: false, dados: null };

  const dataSelecionada = state.diaSelecionado
    ? state.diaSelecionado.toLocaleDateString('pt-BR')
    : new Date().toLocaleDateString('pt-BR');

  return {
    valido: true,
    dados: { nome, horario: state.horarioSelecionado, data: dataSelecionada, valor, telefone, tipoServico: servico },
  };
}

function validarTelefone(tel) {
  const limpo = tel.replace(/\D/g, '');
  return limpo.length >= 10 && limpo.length <= 11;
}

function marcarErro(input, mensagem) {
  input.classList.add('error');
  if (!input.nextElementSibling?.classList?.contains('error-msg')) {
    const msg = document.createElement('span');
    msg.classList.add('field-hint', 'error-msg');
    msg.style.color   = 'var(--clr-error)';
    msg.style.opacity = '1';
    msg.textContent   = mensagem;
    input.insertAdjacentElement('afterend', msg);
  }
}

function limparErros() {
  document.querySelectorAll('.field-input.error').forEach(el => el.classList.remove('error'));
  document.querySelectorAll('.error-msg').forEach(el => el.remove());
}


/* ══════════════════════════════════════════════════
   ENVIO PARA GOOGLE SHEETS
══════════════════════════════════════════════════ */
async function confirmarAgendamento() {
  if (state.carregando) return;

  const { valido, dados } = validarFormulario();
  if (!valido) return;

  if (state.horariosOcupados.has(dados.horario)) {
    exibirToast('⚠️ Este horário acabou de ser ocupado. Escolha outro.', 'error');
    fecharModal();
    await carregarCSV();
    renderizarSlots();
    return;
  }

  state.carregando = true;
  iniciarCarregamento();

  try {
    await enviarParaSheets(dados);

    state.horariosOcupados.add(dados.horario);
    fecharModal();
    marcarSlotComoOcupado(dados.horario);
    atualizarContadorSlots();
    abrirComprovante(dados);

    setTimeout(() => carregarCSV().then(() => renderizarSlots()), 5000);
  } catch (err) {
    console.error('[BarberSchedule] Erro ao enviar para Sheets:', err);
    restaurarBotaoConfirmar();
    exibirToast('❌ Erro ao confirmar. Tente novamente.', 'error');
  } finally {
    state.carregando = false;
  }
}

async function enviarParaSheets(dados) {
  return fetch(CONFIG.SHEETS_ENDPOINT, {
    method:  'POST',
    mode:    'no-cors',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({
      nome:        dados.nome,
      horario:     dados.horario,
      data:        dados.data,
      valor:       dados.valor,
      telefone:    dados.telefone,
      tipoServico: dados.tipoServico,
    }),
  });
}


/* ══════════════════════════════════════════════════
   UI HELPERS
══════════════════════════════════════════════════ */
function iniciarCarregamento() {
  dom.btnConfirm.disabled = true;
  dom.btnConfirm.querySelector('.btn-text').hidden = true;
  dom.btnLoader.hidden = false;
}

function restaurarBotaoConfirmar() {
  dom.btnConfirm.disabled = false;
  dom.btnConfirm.querySelector('.btn-text').hidden = false;
  dom.btnLoader.hidden = true;
}

function marcarSlotComoOcupado(horario) {
  const btn = dom.slotsGrid.querySelector(`[data-horario="${horario}"]`);
  if (!btn) return;
  btn.classList.add('just-booked');
  setTimeout(() => {
    const index = CONFIG.HORARIOS.indexOf(horario);
    const novo  = criarBotaoSlot(horario, index);
    novo.style.animationDelay = '0ms';
    btn.replaceWith(novo);
  }, 500);
}

function exibirToast(mensagem, tipo = 'success') {
  dom.toastMsg.textContent = mensagem;
  dom.toast.className = `toast ${tipo} show`;
  clearTimeout(dom.toast._timeout);
  dom.toast._timeout = setTimeout(() => {
    dom.toast.classList.remove('show');
  }, CONFIG.TOAST_DURATION);
}


/* ══════════════════════════════════════════════════
   FORMATAÇÃO AUTOMÁTICA
══════════════════════════════════════════════════ */
function formatarTelefone(e) {
  let val = e.target.value.replace(/\D/g, '');
  if (val.length > 11) val = val.slice(0, 11);
  if (val.length <= 10) {
    val = val.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
  } else {
    val = val.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
  }
  e.target.value = val;
}

function autoPreencherValor(e) {
  const servico = e.target.value;
  if (!servico) return;
  const lista = Array.isArray(BARBERSHOP_CONFIG.SERVICOS)
    ? BARBERSHOP_CONFIG.SERVICOS
    : Object.entries(BARBERSHOP_CONFIG.SERVICOS).map(([nome, preco]) => ({ nome, preco }));
  const svc = lista.find(s => s.nome === servico);
  if (svc) dom.inputValor.value = svc.preco;
}


/* ══════════════════════════════════════════════════
   BIND DE EVENTOS
══════════════════════════════════════════════════ */
function bindEventos() {

  document.querySelectorAll('.service-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const servico = chip.dataset.service;
      const preco   = chip.dataset.price;

      chip.classList.add('selecting');
      setTimeout(() => {
        chip.classList.remove('selecting');
        irParaEtapa2(servico, preco);
      }, 150);
    });

    chip.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        chip.click();
      }
    });
  });

  dom.btnBack.addEventListener('click', voltarParaEtapa1);

  dom.modalClose.addEventListener('click', fecharModal);
  dom.overlay.addEventListener('click', e => { if (e.target === dom.overlay) fecharModal(); });
  dom.btnConfirm.addEventListener('click', confirmarAgendamento);

  dom.inputTelefone.addEventListener('input', formatarTelefone);
  dom.inputServico.addEventListener('change', autoPreencherValor);
  [dom.inputNome, dom.inputTelefone, dom.inputValor].forEach(input => {
    input.addEventListener('keydown', e => { if (e.key === 'Enter') confirmarAgendamento(); });
  });

  dom.btnWhatsapp.addEventListener('click', abrirWhatsApp);
  dom.btnReceiptClose.addEventListener('click', fecharComprovante);
  dom.receiptModal.addEventListener('click', e => { if (e.target === dom.receiptModal) fecharComprovante(); });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      if (dom.receiptModal.classList.contains('active')) fecharComprovante();
      else if (dom.overlay.classList.contains('active'))  fecharModal();
    }
  });
}


/* ══════════════════════════════════════════════════
   ARRANQUE
══════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', init);
