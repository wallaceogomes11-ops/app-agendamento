/* ════════════════════════════════════════════════════
   BarberSchedule — config.js
   EDITE APENAS ESTE ARQUIVO para personalizar
   o sistema para cada estabelecimento.
════════════════════════════════════════════════════ */

const BARBERSHOP_CONFIG = {

  /* ── 1. NOME DO ESTABELECIMENTO ─────────────────
     Aparece no titulo da pagina e no comprovante.  */
  NOME: 'Thinity code',

  /* ── 2. CABECALHO DO SITE ────────────────────────
     Nome e subtitulo exibidos no topo da pagina.  */
  BRAND_NAME: 'Thinity code',
  BRAND_SUB:  'Agendamento Online',

  /* ── 3. SERVICOS E PRECOS ────────────────────────
     Adicione, remova ou renomeie os servicos.
     Formato: 'Nome do Servico': 'XX,XX'           */
  SERVICOS: {
    'Logo ': '35,00',
    'Criar app': '25,00',
    'Aluguel app': '55,00',
    'Personalizado': '40,00',
    'Kit social midia': '80,00',
  },

  /* ── 4. HORARIOS DISPONIVEIS ─────────────────────
     Liste os horarios no formato 'HH:MM'.
     Adicione ou remova conforme o expediente.     */
  HORARIOS: [
    '08:00', '09:22', '10:00', '11:00', '11:04', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
  ],

  /* ── 5. GOOGLE SHEETS ────────────────────────────
     SHEETS_ENDPOINT: URL do Web App (Apps Script)
     CSV_URL:         URL de exportacao da planilha
     Veja o README.md para configurar.             */
  SHEETS_ENDPOINT: 'https://script.google.com/macros/s/AKfycbzOF5amh1l3dl_FWSmrI7uT9g5VAlWcVGAOCH2Dcow1wSZdtEJ208ZfMnvPm9QIG9ic/exec',
  CSV_URL: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQKWuSY3kIc5R9LW_MN82K_B3HyuZHx0SXTRyDqTmF4yv2alAIIyKaKsCAzdoqiIeDK5mlRNIKYsI98/pub?gid=0&single=true&output=csv',

  /* ── 6. IMAGENS DOS SERVICOS ─────────────────────
     Coloque as fotos dentro da pasta:
       assets/services/

     So coloque o nome do arquivo com a extensao.
     Formatos aceitos: .jpg  .jpeg  .png  .webp   */
  IMAGENS: [
    'assets/services/logo.jpeg',
    'assets/services/criar-app.png',
    'assets/services/aluguel-app.jpg',
    'assets/services/personalizado.jpg',
    'assets/services/kit-social-midia.jpg',
  ],

  /* ── 7. TEMA DE CORES ────────────────────────────
     Personalize as cores do estabelecimento.
     Use qualquer valor CSS valido (#hex, rgb, hsl) */
  CORES: {
    gold300: '#ff2600',
    gold200: '#faf6eb',
    gold100: '#f5e6b8',
    bg:      '#060606',
    surface: '#0e0e0e',
    surface2:'#141414',
    texto:   '#f0ede6',
    textoMuted:'#6e6860',
  },

  /* ── 8. INTERVALO DE ATUALIZACAO (ms) ───────────
     Com que frequencia verifica novos agendamentos.
     Padrao: 30 segundos.                          */
  POLLING_INTERVAL: 30000,
  TOAST_DURATION:   3500,
};
