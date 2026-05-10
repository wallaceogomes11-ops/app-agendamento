# BarberSchedule — Sistema de Agendamento para Barbearias

> Sistema de agendamento online profissional, integrado com Google Sheets e WhatsApp.
> Pronto para ser configurado e vendido para qualquer estabelecimento.

---

## Funcionalidades

- Agendamento em 2 etapas (servico > data/horario)
- Integracao com Google Sheets (sem backend)
- Comprovante com botao de compartilhar no WhatsApp
- Atualizacao automatica de horarios ocupados
- Imagens dos servicos direto da pasta do projeto
- Tema de cores 100% personalizavel
- Design responsivo (mobile first)

---

## Estrutura de Arquivos

```
barberschedule/
├── index.html               <- estrutura da pagina
├── style.css                <- estilo visual (nao editar)
├── config.js                <- UNICO ARQUIVO QUE O CLIENTE EDITA
├── script.js                <- logica principal (nao editar)
└── assets/
    └── services/
        ├── corte-simples.jpg
        ├── barba.jpg
        └── ...              <- fotos dos servicos aqui
```

---

## Como configurar para um novo cliente

### 1. Edite o config.js

Abra o arquivo `config.js` e preencha as informacoes do estabelecimento:

```js
const BARBERSHOP_CONFIG = {
  NOME: 'Barbearia do Cliente',

  SERVICOS: {
    'Corte Simples': '35,00',
    'Barba':         '25,00',
    // adicione ou remova servicos aqui
  },

  HORARIOS: ['08:00', '09:00', '10:00', ...],

  SHEETS_ENDPOINT: 'https://...',   // URL do Apps Script
  CSV_URL: 'https://...',           // URL de exportacao CSV

  IMAGENS: [
    'assets/services/corte-simples.jpg',
    'assets/services/barba.jpg',
    // uma linha por servico, mesma ordem de SERVICOS
  ],

  CORES: {
    gold300: '#c5a050',   // cor principal dourada
    bg:      '#060606',   // fundo da pagina
    // ...
  },
};
```

---

### 2. Configure o Google Sheets

Cada cliente precisa de sua propria planilha. Siga os passos:

#### 2.1 Crie a planilha

1. Acesse sheets.google.com e crie uma planilha nova
2. Na primeira linha, adicione os cabecalhos:
   ```
   A1: nome | B1: horario | C1: data | D1: valor | E1: telefone | F1: tipoServico
   ```

#### 2.2 Crie o Google Apps Script

1. Na planilha, va em Extensoes > Apps Script
2. Cole o codigo abaixo e clique em Salvar:

```javascript
function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const dados = JSON.parse(e.postData.contents);
  sheet.appendRow([
    dados.nome,
    dados.horario,
    dados.data,
    dados.valor,
    dados.telefone,
    dados.tipoServico,
    new Date().toLocaleString('pt-BR')
  ]);
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok' }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

3. Clique em Implantar > Nova implantacao
4. Tipo: App da Web | Acesso: Qualquer pessoa
5. Copie a URL gerada e cole em SHEETS_ENDPOINT no config.js

#### 2.3 Pegue a URL do CSV

1. Na planilha, va em Arquivo > Compartilhar > Publicar na web
2. Escolha a aba e formato CSV > clique em Publicar
3. Copie a URL e cole em CSV_URL no config.js

---

### 3. Fotos dos servicos

Coloque os arquivos de imagem dentro da pasta `assets/services/` e atualize os nomes no `config.js`:

```js
IMAGENS: [
  'assets/services/corte-simples.jpg',
  'assets/services/barba.jpg',
  // ...
],
```

Formatos aceitos: .jpg .jpeg .png .webp

Se nao quiser foto em algum servico, coloque null:

```js
IMAGENS: [
  'assets/services/corte-simples.jpg',
  null,   // sem foto para este servico — exibe emoji
  ...
],
```

---

### 4. Inclua os scripts no HTML

No seu index.html, inclua os scripts NESTA ORDEM:

```html
<!-- config.js SEMPRE antes do script.js -->
<script src="config.js"></script>
<script src="script.js"></script>
```

---

### 5. Nome dinamico no HTML

Para que o nome do estabelecimento apareca automaticamente em qualquer elemento HTML, adicione o atributo data-barbershop-name:

```html
<h1 data-barbershop-name></h1>
<title data-barbershop-name></title>
```

---

## Como alterar fotos e servicos

### Trocar a foto de um servico

1. Coloque a nova foto dentro de `assets/services/`
2. Atualize o nome do arquivo na linha correspondente em IMAGENS no config.js:

```js
IMAGENS: [
  'assets/services/novo-nome.jpg',   // <- trocou a foto aqui
  ...
],
```

---

### Renomear um servico

Mude o nome em DOIS lugares no config.js: em SERVICOS e em IMAGENS.
A ordem dos dois blocos deve sempre ser igual.

```js
SERVICOS: {
  'Degrade':  '40,00',   // <- novo nome
  ...
},

IMAGENS: [
  'assets/services/degrade.jpg',   // <- foto correspondente
  ...
],
```

---

### Acrescentar um servico

Adicione uma linha nova em SERVICOS e uma linha em IMAGENS na mesma posicao:

```js
SERVICOS: {
  'Corte Simples': '35,00',
  'Barba':         '25,00',
  'Corte + Barba': '55,00',
  'Hidratacao':    '40,00',
  'Pigmentacao':   '80,00',
  'Sobrancelha':   '15,00',   // <- novo servico
},

IMAGENS: [
  'assets/services/corte-simples.jpg',
  'assets/services/barba.jpg',
  'assets/services/corte-barba.jpg',
  'assets/services/hidratacao.jpg',
  'assets/services/pigmentacao.jpg',
  'assets/services/sobrancelha.jpg',   // <- foto do novo servico
],
```

Coloque o arquivo sobrancelha.jpg na pasta assets/services/ e o card aparece automaticamente no site.

---

### Remover um servico

Apague a linha do servico em SERVICOS e a linha correspondente em IMAGENS.
Mantenha a ordem dos dois blocos igual apos remover.

---

## Personalizacao de Cores

Edite a secao CORES no config.js:

| Chave      | O que controla                     | Padrao    |
|------------|------------------------------------|-----------|
| gold300    | Bordas ativas, badges, destaques   | #c5a050   |
| gold200    | Textos em dourado claro            | #e8cc7a   |
| gold100    | Textos dourados muito claros       | #f5e6b8   |
| bg         | Fundo da pagina                    | #060606   |
| surface    | Fundo dos cards e modais           | #0e0e0e   |
| surface2   | Fundo dos campos de formulario     | #141414   |
| texto      | Texto principal                    | #f0ede6   |
| textoMuted | Labels e textos secundarios        | #6e6860   |

Ao alterar gold300, as bordas, gradientes e sombras se atualizam automaticamente.

---

## Deploy

O projeto e 100% estatico — pode ser hospedado em:

- GitHub Pages (gratuito)
- Netlify (gratuito, drag and drop)
- Vercel (gratuito)
- Qualquer hospedagem de arquivos estaticos

---

## Checklist de entrega ao cliente

- [ ] Preencher NOME no config.js
- [ ] Configurar SERVICOS e precos
- [ ] Ajustar HORARIOS de funcionamento
- [ ] Criar planilha no Google Sheets
- [ ] Criar e publicar o Apps Script -> colar SHEETS_ENDPOINT
- [ ] Publicar a planilha como CSV -> colar CSV_URL
- [ ] Colocar fotos dos servicos em assets/services/
- [ ] Atualizar nomes dos arquivos em IMAGENS no config.js
- [ ] Personalizar CORES com identidade visual do cliente
- [ ] Fazer deploy e testar um agendamento completo

---

## Suporte

Duvidas ou problemas? Entre em contato com o desenvolvedor do template.

---

BarberSchedule Premium v2 — Template para revenda
