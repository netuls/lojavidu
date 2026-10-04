// ── Pix (BR Code / Copia e Cola) ──
function pixCRC(s) {
  let c = 0xFFFF;
  for (let i = 0; i < s.length; i++) {
    c ^= s.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) c = (c & 0x8000) ? ((c << 1) ^ 0x1021) & 0xFFFF : (c << 1) & 0xFFFF;
  }
  return c.toString(16).toUpperCase().padStart(4, '0');
}
function gerarPix(chave, nome, cidade, valor, txid) {
  const f = (id, v) => id + String(v.length).padStart(2, '0') + v;
  const limpa = s => String(s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^A-Za-z0-9 ]/g, '').toUpperCase().trim();
  const conta = f('00', 'br.gov.bcb.pix') + f('01', chave);
  const tx = String(txid || '').replace(/[^A-Za-z0-9]/g, '').slice(0, 25) || '***';
  let p = f('00', '01') + f('26', conta) + f('52', '0000') + f('53', '986');
  if (valor > 0) p += f('54', Number(valor).toFixed(2));
  p += f('58', 'BR') + f('59', limpa(nome).slice(0, 25)) + f('60', limpa(cidade).slice(0, 15)) + f('62', f('05', tx));
  p += '6304';
  return p + pixCRC(p);
}

// ── Aparência: cores e letra do site, ajustadas pelo painel (guardadas em config/loja → tema) ──
// As cores-base são escritas sem "#" de propósito: o gerador troca qualquer #RRGGBB do modelo pela paleta da loja.
const TEMA_PADRAO = { destaque: '#D9D9D9', fundo: '#101E1A', fonte: 'cinzel' };
const TEMA_FONTES = [
  { id: 'cinzel', nome: 'Cinzel · clássico', fam: 'Cinzel,serif', g: 'Cinzel:wght@400;600' },
  { id: 'playfair', nome: 'Playfair · elegante', fam: "'Playfair Display',serif", g: 'Playfair+Display:wght@400;600' },
  { id: 'cormorant', nome: 'Cormorant · luxo', fam: "'Cormorant Garamond',serif", g: 'Cormorant+Garamond:wght@400;600' },
  { id: 'montserrat', nome: 'Montserrat · moderno', fam: 'Montserrat,sans-serif', g: 'Montserrat:wght@400;600' },
  { id: 'bebas', nome: 'Bebas Neue · streetwear', fam: "'Bebas Neue',sans-serif", g: 'Bebas+Neue' },
  { id: 'poppins', nome: 'Poppins · jovem', fam: 'Poppins,sans-serif', g: 'Poppins:wght@400;600' },
];
const TEMA_PRESETS = [
  { nome: 'Prata e preto', destaque: 'A9A9B2', fundo: '09090A' }, { nome: 'Dourado e preto', destaque: 'D4AF37', fundo: '0B0B0B' },
  { nome: 'Rosé e preto', destaque: 'E3A7A1', fundo: '0D0A0B' }, { nome: 'Vinho e dourado', destaque: 'D4AF37', fundo: '25070F' },
  { nome: 'Azul-noite e prata', destaque: '9FB4E0', fundo: '070E24' }, { nome: 'Verde e dourado', destaque: 'D4AF37', fundo: '06210F' },
  { nome: 'Grafite e laranja', destaque: 'FF8A1F', fundo: '15171C' }, { nome: 'Preto e vermelho', destaque: 'E63946', fundo: '0B0B0F' },
  { nome: 'Preto e verde-limão', destaque: 'B6F500', fundo: '0A0A0A' },
].map(p => ({ nome: p.nome, destaque: '#' + p.destaque, fundo: '#' + p.fundo }));
const TEMA = (() => {
  const NEUTROS = ['09090A','121214','26262A','0C0C0E','1A1A1D','1D1D22','1C1C20','232327','2E2E33','3A3A40','55555C','5A5A62','6B6B73','7A7A83','8B8B93','9A9AA3','B5B5BC','C4C4CC','CFCFD6','D6D6DC','D9D9DF','E8E8EA'].map(c => '#' + c);
  const FUNDO_PADRAO = '#' + '09090A', PRATA = { ac1: '#FFFFFF', ac2: '#A9A9B2', ac3: '#5D5D66' }, CHAVE = 'tema-loja';
  const ehHex = h => /^#[0-9a-fA-F]{6}$/.test(String(h));
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const rgb = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
  function hsl(hex) {
    const [r, g, b] = rgb(hex).map(v => v / 255), mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2, d = mx - mn;
    let h = 0, s = 0;
    if (d) { s = d / (1 - Math.abs(2 * l - 1)); if (mx === r) h = ((g - b) / d) % 6; else if (mx === g) h = (b - r) / d + 2; else h = (r - g) / d + 4; h *= 60; if (h < 0) h += 360; }
    return { h, s, l };
  }
  function hex(h, s, l) {
    h = ((h % 360) + 360) % 360; s = clamp(s, 0, 1); l = clamp(l, 0, 1);
    const c = (1 - Math.abs(2 * l - 1)) * s, x = c * (1 - Math.abs((h / 60) % 2 - 1)), m = l - c / 2;
    let r = 0, g = 0, b = 0;
    if (h < 60) [r, g, b] = [c, x, 0]; else if (h < 120) [r, g, b] = [x, c, 0]; else if (h < 180) [r, g, b] = [0, c, x];
    else if (h < 240) [r, g, b] = [0, x, c]; else if (h < 300) [r, g, b] = [x, 0, c]; else [r, g, b] = [c, 0, x];
    return '#' + [r, g, b].map(v => Math.round((v + m) * 255).toString(16).padStart(2, '0')).join('').toUpperCase();
  }
  function lum(h) { const [r, g, b] = rgb(h).map(v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }); return 0.2126 * r + 0.7152 * g + 0.0722 * b; }
  // mesma conta do gerador de sistemas: tons de cinza do site acompanham o matiz do fundo; o destaque ganha um degradê
  function paleta(destaque, fundo) {
    destaque = destaque.toUpperCase(); fundo = fundo.toUpperCase();
    const hb = hsl(FUNDO_PADRAO), hn = hsl(fundo), mapa = {};
    NEUTROS.forEach(c => {
      if (fundo === FUNDO_PADRAO) { mapa[c] = c; return; }
      const k = hsl(c); let l = k.l, s;
      if (k.l <= 0.30) { l = clamp(k.l + (hn.l - hb.l) * (1 - k.l) / (1 - hb.l), 0, 0.5); s = Math.min(hn.s, 0.55); }
      else if (k.l <= 0.6) s = Math.min(hn.s * 0.3, 0.25);
      else s = Math.min(hn.s * 0.1, 0.08);
      mapa[c] = hex(hn.h, s, l);
    });
    mapa[FUNDO_PADRAO] = fundo;
    let ac;
    if (destaque === PRATA.ac2) ac = { ...PRATA };
    else { const a = hsl(destaque); ac = { ac1: hex(a.h, a.s, clamp(a.l + 0.22, 0.55, 0.92)), ac2: destaque, ac3: hex(a.h, a.s, clamp(a.l - 0.22, 0.12, 0.5)) }; }
    return { mapa, ac, on: lum(ac.ac2) > 0.179 ? '#000' : '#fff' };
  }
  const raiz = document.documentElement;
  const VARS = NEUTROS.map(c => '--n' + c.slice(1).toLowerCase()).concat(['--ac1', '--ac2', '--ac3', '--on', '--fonte']);
  function limpar() {
    VARS.forEach(v => raiz.style.removeProperty(v));
    const l = document.getElementById('tema-fonte'); if (l) l.remove();
    const mt = document.querySelector('meta[name="theme-color"]'); if (mt && mt.dataset.orig) mt.content = mt.dataset.orig;
  }
  function carregarFonte(f) {
    let l = document.getElementById('tema-fonte');
    if (!l) { l = document.createElement('link'); l.id = 'tema-fonte'; l.rel = 'stylesheet'; document.head.appendChild(l); }
    l.href = 'https://fonts.googleapis.com/css2?family=' + f.g + '&display=swap';
  }
  // t = { destaque, fundo, fonte }. semCache: prévia no painel, não guarda nada.
  function aplicar(t, semCache) {
    try {
      if (!semCache) { if (t) localStorage.setItem(CHAVE, JSON.stringify(t)); else localStorage.removeItem(CHAVE); }
    } catch (e) {}
    limpar();
    if (!t) return;
    if (ehHex(t.destaque) && ehHex(t.fundo)) {
      const p = paleta(t.destaque, t.fundo), st = raiz.style;
      NEUTROS.forEach(c => st.setProperty('--n' + c.slice(1).toLowerCase(), p.mapa[c]));
      st.setProperty('--ac1', p.ac.ac1); st.setProperty('--ac2', p.ac.ac2); st.setProperty('--ac3', p.ac.ac3); st.setProperty('--on', p.on);
      const mt = document.querySelector('meta[name="theme-color"]'); if (mt) { if (!mt.dataset.orig) mt.dataset.orig = mt.content; mt.content = p.mapa[FUNDO_PADRAO]; }
    }
    const f = TEMA_FONTES.find(x => x.id === t.fonte);
    if (f) { raiz.style.setProperty('--fonte', f.fam); carregarFonte(f); }
  }
  // fundo precisa ser escuro (o site é de tema escuro)
  const fundoOk = h => ehHex(h) && hsl(h).l <= 0.22;
  try { const c = JSON.parse(localStorage.getItem(CHAVE) || 'null'); if (c) aplicar(c); } catch (e) {}   // aplica o último tema salvo já na abertura, sem piscar
  return { aplicar, fundoOk, ehHex, sujo: false };
})();
// Acompanha o que o painel salvou (vale para o site e para o painel)
if (typeof db !== 'undefined') db.collection('config').doc('loja').onSnapshot(s => { if (!TEMA.sujo) TEMA.aplicar((s.data() || {}).tema || null); }, () => {});
