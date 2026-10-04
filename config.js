// ═══════════════════════════════════════════════════════════════════
//  CONFIGURAÇÃO DA LOJA — lojavidu
//  Arquivo gerado por criar-loja.html. Nome, WhatsApp, Pix, frete, retirada, logo e mensagens
//  podem ser mudados depois pelo painel (admin.html), sem editar este arquivo.
// ═══════════════════════════════════════════════════════════════════
const LOJA = {
  nome: "lojavidu",
  whatsapp: "5585996870852",            // DDI+DDD+número, só dígitos: recebe o aviso do pedido
  adminEmail: "admin@lojavidu.com",   // e-mail "interno" do admin (não precisa existir); no painel você digita só a senha
  pix: {"tipo":"cpf","chave":"","nome":"LOJAVIDU","cidade":"FORTALEZA"},
  vapidKey: "BKsjT-mH72QeUDQpgePzMoFUB9ryW3dpoCGInZ81iAc44Qc44CmJeXghtLxIfCd4M2VYnVZVcLA5KffVHbHBi7g",   // Firebase > Configurações > Cloud Messaging > Certificados push da Web > Gerar par de chaves
  geradoEm: "2026-10-04",
  versao: "2026.10.8",
  firebase: {
    "apiKey": "AIzaSyA_FEbXILYkJpFuCJ7BEzj2pjmzjYqE_wo",
    "authDomain": "teste-neto-892f3.firebaseapp.com",
    "projectId": "teste-neto-892f3",
    "storageBucket": "teste-neto-892f3.firebasestorage.app",
    "messagingSenderId": "1081270406163",
    "appId": "1:1081270406163:web:0fa256fb80590184c803e6"
  }
};
firebase.initializeApp(LOJA.firebase);
const db = firebase.firestore(), auth = firebase.auth();
const R$ = v => 'R$ ' + Number(v).toFixed(2).replace('.', ',');

// ── Pix copia-e-cola (BR Code) ──
function pixPayload(valor, txid) {
  const t = (i, v) => i + String(v.length).padStart(2, '0') + v;
  const lim = (s, n) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase().slice(0, n);
  const p = t('00','01') + t('26', t('00','br.gov.bcb.pix') + t('01', LOJA.pix.chave)) + t('52','0000') + t('53','986') +
    t('54', valor.toFixed(2)) + t('58','BR') + t('59', lim(LOJA.pix.nome,25)) + t('60', lim(LOJA.pix.cidade,15)) +
    t('62', t('05', (txid || '***').replace(/\W/g,'').slice(0,25) || '***')) + '6304';
  let c = 0xFFFF;
  for (let i = 0; i < p.length; i++) { c ^= p.charCodeAt(i) << 8; for (let j = 0; j < 8; j++) c = (c & 0x8000) ? ((c << 1) ^ 0x1021) & 0xFFFF : (c << 1) & 0xFFFF; }
  return p + c.toString(16).toUpperCase().padStart(4, '0');
}

// ── PWA: registra o service worker (requer HTTPS, como no GitHub Pages/Firebase Hosting) ──
if ('serviceWorker' in navigator) window.addEventListener('load', () => navigator.serviceWorker.register('sw.js?cfg=' + encodeURIComponent(JSON.stringify(LOJA.firebase))).catch(console.error));
