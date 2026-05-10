/* ════════════════════════════════════════════════════
   BarberSchedule — config.js
   EDITE APENAS ESTE ARQUIVO para personalizar
   o sistema para cada estabelecimento.
════════════════════════════════════════════════════ */

const BARBERSHOP_CONFIG = {

  /* ── 1. NOME DO ESTABELECIMENTO ─────────────────
     Aparece no titulo da pagina e no comprovante.  */
  NOME: 'Barbshop Dance',

  /* ── 2. SERVICOS E PRECOS ────────────────────────
     Adicione, remova ou renomeie os servicos.
     Formato: 'Nome do Servico': 'XX,XX'           */
  SERVICOS: {
    'Corte Simples': '34,00',
    'Barba': '20,00',
    'Corte + Barba': '34,00',
    'Hidratacao': '34,00',
    'Pigmentacao': '34,00',
  },

  /* ── 3. HORARIOS DISPONIVEIS ─────────────────────
     Liste os horarios no formato 'HH:MM'.
     Adicione ou remova conforme o expediente.     */
  HORARIOS: [
    '08:00', '08:37', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
  ],

  /* ── 4. GOOGLE SHEETS ────────────────────────────
     SHEETS_ENDPOINT: URL do Web App (Apps Script)
     CSV_URL:         URL de exportacao da planilha
     Veja o README.md para configurar.             */
  SHEETS_ENDPOINT: 'https://script.google.com/macros/s/AKfycbzjpX__XgJ3NClXhZlYL9grikejSmeIzFEtSIm4CRqSb7MO26YW_S28MwIXGD7yfvw-/exec',
  CSV_URL: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRgrKP5Cjl5ObhPiVeMrHPWjtM3QH-tQFVf5A3IC4Y_MFm1TnWu6glNs28ph-9GQQ/pub?gid=2009449971&single=true&output=csv',

  /* ── 5. IMAGENS DOS SERVICOS ─────────────────────
     Coloque as fotos dentro da pasta:
       assets/services/

     So coloque o nome do arquivo com a extensao.
     Formatos aceitos: .jpg  .jpeg  .png  .webp   */
  IMAGENS: [
    'assets/services/corte-duplo.jpg',
    'assets/services/barba.jpg',
    'assets/services/corte-barba.jpg',
    'assets/services/hidratacao.jpg',
    'assets/services/pigmentacao.jpg',
  ],

  /* ── 6. TEMA DE CORES ────────────────────────────
     Personalize as cores do estabelecimento.
     Use qualquer valor CSS valido (#hex, rgb, hsl) */
  CORES: {
    gold300: '#c24fc4',
    gold200: '#e8cc7a',
    gold100: '#f5e6b8',
    bg:      '#060606',
    surface: '#0e0e0e',
    surface2:'#141414',
    texto:   '#f0ede6',
    textoMuted:'#6e6860',
  },

  /* ── 7. INTERVALO DE ATUALIZACAO (ms) ───────────
     Com que frequencia verifica novos agendamentos.
     Padrao: 30 segundos.                          */
  POLLING_INTERVAL: 30000,
  TOAST_DURATION:   3500,
};
