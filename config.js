/* ════════════════════════════════════════════════════
   BarberSchedule — config.js
   EDITE APENAS ESTE ARQUIVO para personalizar
   o sistema para cada estabelecimento.
════════════════════════════════════════════════════ */

const BARBERSHOP_CONFIG = {

  /* ── 1. NOME DO ESTABELECIMENTO ─────────────────
     Aparece no titulo da pagina e no comprovante.  */
  NOME: 'Barbearia do Joao',

  /* ── 2. SERVICOS E PRECOS ────────────────────────
     Adicione, remova ou renomeie os servicos.
     Formato: 'Nome do Servico': 'XX,XX'           */
  SERVICOS: {
    'Corte Simples': '35,00',
    'Barba':         '25,00',
    'Corte + Barba': '55,00',
    'Hidratacao':    '40,00',
    'Pigmentacao':   '80,00',
  },

  /* ── 3. HORARIOS DISPONIVEIS ─────────────────────
     Liste os horarios no formato 'HH:MM'.
     Adicione ou remova conforme o expediente.     */
  HORARIOS: [
    '08:00', '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00', '17:00',
  ],

  /* ── 4. GOOGLE SHEETS ────────────────────────────
     SHEETS_ENDPOINT: URL do Web App (Apps Script)
     CSV_URL:         URL de exportacao da planilha
     Veja o README.md para configurar.             */
  SHEETS_ENDPOINT: 'https://script.google.com/macros/s/SEU_ENDPOINT_AQUI/exec',
  CSV_URL: 'https://docs.google.com/spreadsheets/d/SEU_ID_AQUI/export?format=csv&gid=0',

  /* ── 5. IMAGENS DOS SERVICOS ─────────────────────
     Coloque as fotos dentro da pasta:
       assets/services/

     So coloque o nome do arquivo com a extensao.
     Formatos aceitos: .jpg  .jpeg  .png  .webp

     A ordem deve ser a mesma dos SERVICOS acima:
       [0] -> Corte Simples
       [1] -> Barba
       [2] -> Corte + Barba
       etc.

     Se nao quiser usar imagem em algum servico,
     substitua o caminho por: null              */
  IMAGENS: [
    'assets/services/corte-simples.jpg',
    'assets/services/barba.jpg',
    'assets/services/corte-barba.jpg',
    'assets/services/hidratacao.jpg',
    'assets/services/pigmentacao.jpg',
  ],

  /* ── 6. TEMA DE CORES ────────────────────────────
     Personalize as cores do estabelecimento.
     Use qualquer valor CSS valido (#hex, rgb, hsl)

     Dica: para manter o tema escuro padrao
     (Obsidian Black + Liquid Gold), altere apenas
     os dourados abaixo.                           */
  CORES: {
    gold300: '#c5a050',    // destaques, bordas ativas
    gold200: '#e8cc7a',    // textos em dourado claro
    gold100: '#f5e6b8',    // textos dourados muito claros

    bg:        '#060606',  // fundo da pagina
    surface:   '#0e0e0e',  // fundo dos cards
    surface2:  '#141414',  // fundo dos inputs

    texto:      '#f0ede6', // texto principal
    textoMuted: '#6e6860', // labels e textos secundarios
  },

  /* ── 7. INTERVALO DE ATUALIZACAO (ms) ───────────
     Com que frequencia verifica novos agendamentos.
     Padrao: 30 segundos.                          */
  POLLING_INTERVAL: 30000,
  TOAST_DURATION:   3500,
};
