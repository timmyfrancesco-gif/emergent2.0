import type { GenerateResponse } from './types';

// Smart client-side HTML generator — used as fallback when Gemini API isn't available
export function generateDemoResponse(prompt: string): GenerateResponse {
  const p = prompt.toLowerCase();

  const isNetflix = /netflix|streaming|film|serie|video|watch/i.test(p);
  const isEcommerce = /shop|store|ecommerce|e-commerce|prodott|acquist|cart|negozio/i.test(p);
  const isDashboard = /dashboard|analytic|metric|statistic|chart|admin|pannello/i.test(p);
  const isBlog = /blog|articol|post|cms|notizie|news/i.test(p);
  const isLanding = /landing|marketing|startup|saas|prodotto|product/i.test(p);
  const isTodo = /todo|task|list|agenda|attivit/i.test(p);
  const isChat = /chat|messag|discord|whatsapp|telegram/i.test(p);

  let html: string;
  let description: string;

  if (isNetflix) {
    html = netflixTemplate(prompt);
    description = 'Interfaccia streaming con griglia di contenuti e hero banner';
  } else if (isEcommerce) {
    html = ecommerceTemplate(prompt);
    description = 'Negozio online con griglia prodotti e carrello';
  } else if (isDashboard) {
    html = dashboardTemplate(prompt);
    description = 'Dashboard analytics con metriche e grafici';
  } else if (isBlog) {
    html = blogTemplate(prompt);
    description = 'Blog/CMS con lista articoli e hero';
  } else if (isTodo) {
    html = todoTemplate(prompt);
    description = 'App todo list con gestione attività';
  } else if (isChat) {
    html = chatTemplate(prompt);
    description = 'Interfaccia chat in tempo reale';
  } else {
    html = landingTemplate(prompt);
    description = 'Landing page moderna con hero e sezioni';
  }

  return {
    files: [{ path: 'index.html', content: html, language: 'html' }],
    summary: description,
    fileChanges: [{ path: 'index.html', action: 'created', description }],
  };
}

const baseStyles = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; -webkit-font-smoothing: antialiased; }
  a { text-decoration: none; color: inherit; }
  button { cursor: pointer; border: none; outline: none; }
  img { max-width: 100%; }
`;

function netflixTemplate(prompt: string): string {
  const items = ['Stranger Things', 'The Crown', 'Squid Game', 'Wednesday', 'Ozark', 'Dark', 'Money Heist', 'Peaky Blinders'];
  const cards = items.map((title, i) => {
    const colors = ['#e50914','#b09070','#2d6a4f','#1a1a2e','#6b2d8b','#1b4332','#c0392b','#2c3e50'];
    return `<div class="card" onclick="this.style.transform='scale(1.05)'" style="background:${colors[i]}">
      <div class="card-overlay"><span class="card-title">${title}</span><div class="card-btns">
        <button class="play-btn">▶ Play</button><button class="info-btn">ⓘ Info</button>
      </div></div></div>`;
  }).join('');

  return `<!DOCTYPE html><html lang="it"><head><meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escHtml(prompt.slice(0,50))}</title>
<style>${baseStyles}
body{background:#141414;color:#fff}
nav{display:flex;align-items:center;justify-content:space-between;padding:16px 48px;position:fixed;top:0;left:0;right:0;z-index:100;background:linear-gradient(to bottom,rgba(0,0,0,.9),transparent)}
.logo{color:#e50914;font-size:2rem;font-weight:900;letter-spacing:-1px}
.nav-links{display:flex;gap:20px;font-size:14px;color:#e5e5e5}
.nav-right{display:flex;align-items:center;gap:16px}
.search-btn,.bell-btn{background:none;color:#fff;font-size:1.1rem;cursor:pointer}
.avatar{width:32px;height:32px;border-radius:4px;background:#e50914;display:flex;align-items:center;justify-content:center;font-weight:700}
.hero{height:100vh;display:flex;align-items:center;padding:0 48px;background:linear-gradient(to right,rgba(0,0,0,.8) 40%,transparent),url('https://picsum.photos/1920/1080?random=1') center/cover}
.hero-content{max-width:500px}
.hero-badge{display:inline-flex;align-items:center;gap:8px;background:rgba(229,9,20,.8);color:#fff;font-size:12px;font-weight:700;padding:6px 12px;border-radius:4px;margin-bottom:20px;text-transform:uppercase;letter-spacing:.1em}
.hero h1{font-size:clamp(2.5rem,6vw,5rem);font-weight:900;line-height:1;margin-bottom:16px}
.hero p{font-size:1.1rem;color:#ddd;margin-bottom:28px;line-height:1.6}
.hero-actions{display:flex;gap:12px}
.btn-play{background:#fff;color:#141414;padding:12px 28px;border-radius:6px;font-size:1.05rem;font-weight:700;display:flex;align-items:center;gap:8px;transition:background .2s}
.btn-play:hover{background:#e5e5e5}
.btn-info{background:rgba(109,109,110,.7);color:#fff;padding:12px 28px;border-radius:6px;font-size:1.05rem;font-weight:600;display:flex;align-items:center;gap:8px;transition:background .2s}
.btn-info:hover{background:rgba(109,109,110,.9)}
.row{padding:0 48px 40px;margin-top:40px}
.row h2{font-size:1.25rem;font-weight:700;margin-bottom:16px;color:#e5e5e5}
.grid{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}
.card{aspect-ratio:16/9;border-radius:6px;overflow:hidden;position:relative;cursor:pointer;transition:transform .2s,box-shadow .2s}
.card:hover{transform:scale(1.05);box-shadow:0 8px 30px rgba(0,0,0,.5);z-index:10}
.card-overlay{position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,.8),transparent);display:flex;flex-direction:column;justify-content:flex-end;padding:12px;opacity:0;transition:opacity .2s}
.card:hover .card-overlay{opacity:1}
.card-title{font-weight:700;font-size:.9rem;margin-bottom:8px}
.card-btns{display:flex;gap:6px}
.play-btn{background:#e50914;color:#fff;padding:4px 12px;border-radius:4px;font-size:.8rem;font-weight:600}
.info-btn{background:rgba(255,255,255,.2);color:#fff;padding:4px 10px;border-radius:4px;font-size:.8rem}
.footer-note{position:fixed;bottom:12px;right:16px;background:rgba(0,0,0,.7);color:#aaa;padding:6px 12px;border-radius:20px;font-size:11px;backdrop-filter:blur(8px)}
@media(max-width:768px){.grid{grid-template-columns:repeat(2,1fr)}.nav-links{display:none}.hero{padding:0 24px}.row{padding:0 24px 32px}}
</style></head><body>
<nav><div class="logo">STREAMIX</div>
<div class="nav-links"><a>Home</a><a>Serie TV</a><a>Film</a><a>Novità</a><a>La mia lista</a></div>
<div class="nav-right"><button class="search-btn">🔍</button><button class="bell-btn">🔔</button><div class="avatar">T</div></div></nav>
<section class="hero"><div class="hero-content">
<div class="hero-badge">⭐ #1 in Italia oggi</div>
<h1>Stranger Things</h1>
<p>Quando una ragazza con poteri soprannaturali scompare, la sua famiglia e i suoi amici scoprono misteri soprannaturali in una piccola città.</p>
<div class="hero-actions"><button class="btn-play">▶ Riproduci</button><button class="btn-info">ⓘ Altre info</button></div>
</div></section>
<div style="margin-top:0">
<div class="row"><h2>🔥 Di tendenza ora</h2><div class="grid">${cards}</div></div>
<div class="row"><h2>▶ Continua a guardare</h2><div class="grid">${cards.split('</div>').slice(0,4).join('</div>')}</div></div>
</div>
<div class="footer-note">⚡ Demo generato con Emergent</div>
</body></html>`;
}

function ecommerceTemplate(prompt: string): string {
  const products = [
    { name: 'Sneaker Pro X1', price: '€89', emoji: '👟', color: '#f0f0f0' },
    { name: 'Giacca Urban', price: '€149', emoji: '🧥', color: '#e8e0d0' },
    { name: 'Borsa Leather', price: '€199', emoji: '👜', color: '#d4c5b5' },
    { name: 'Occhiali Ray', price: '€129', emoji: '🕶️', color: '#c8e6c9' },
    { name: 'Watch Series 5', price: '€299', emoji: '⌚', color: '#bbdefb' },
    { name: 'Cap Classic', price: '€39', emoji: '🧢', color: '#f8bbd9' },
  ];
  const cards = products.map(p => `
    <div class="product-card">
      <div class="product-img" style="background:${p.color}"><span>${p.emoji}</span></div>
      <div class="product-info">
        <h3>${p.name}</h3>
        <div class="product-footer"><span class="price">${p.price}</span>
          <button class="add-btn" onclick="this.textContent='✓ Aggiunto';this.style.background='#22c55e'">+ Carrello</button>
        </div>
      </div>
    </div>`).join('');

  return `<!DOCTYPE html><html lang="it"><head><meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escHtml(prompt.slice(0,50))}</title>
<style>${baseStyles}
body{background:#f8f7f5;color:#1a1a1a;min-height:100vh}
nav{background:#fff;border-bottom:1px solid #e5e5e5;padding:0 24px;height:64px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:100}
.logo{font-size:1.5rem;font-weight:900;letter-spacing:-0.5px}
.nav-center{display:flex;gap:24px;font-size:14px;color:#666}
.nav-center a:hover{color:#000}
.cart-btn{display:flex;align-items:center;gap:8px;background:#000;color:#fff;padding:10px 20px;border-radius:9999px;font-size:14px;font-weight:600;cursor:pointer;transition:background .2s}
.cart-btn:hover{background:#333}
.hero{background:linear-gradient(135deg,#1a1a1a 0%,#333 100%);color:#fff;padding:80px 24px;text-align:center}
.hero-tag{display:inline-block;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.2);color:#fff;padding:6px 16px;border-radius:9999px;font-size:13px;margin-bottom:20px}
.hero h1{font-size:clamp(2rem,5vw,4rem);font-weight:900;margin-bottom:16px;line-height:1.1}
.hero p{color:#aaa;font-size:1.1rem;margin-bottom:32px}
.hero-cta{display:flex;gap:12px;justify-content:center;flex-wrap:wrap}
.btn-white{background:#fff;color:#000;padding:14px 32px;border-radius:9999px;font-weight:700;font-size:1rem;cursor:pointer;transition:transform .2s}
.btn-white:hover{transform:translateY(-2px)}
.btn-outline{background:transparent;color:#fff;border:2px solid rgba(255,255,255,.3);padding:14px 32px;border-radius:9999px;font-weight:600;font-size:1rem;cursor:pointer}
.section{max-width:1200px;margin:0 auto;padding:48px 24px}
.section-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:32px}
.section-header h2{font-size:1.75rem;font-weight:800}
.see-all{color:#666;font-size:14px;cursor:pointer}
.see-all:hover{color:#000}
.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
.product-card{background:#fff;border-radius:16px;overflow:hidden;transition:transform .2s,box-shadow .2s;cursor:pointer}
.product-card:hover{transform:translateY(-4px);box-shadow:0 12px 40px rgba(0,0,0,.1)}
.product-img{height:220px;display:flex;align-items:center;justify-content:center;font-size:5rem}
.product-info{padding:16px}
.product-info h3{font-size:1rem;font-weight:700;margin-bottom:12px}
.product-footer{display:flex;align-items:center;justify-content:space-between}
.price{font-size:1.1rem;font-weight:800}
.add-btn{background:#000;color:#fff;padding:8px 16px;border-radius:9999px;font-size:13px;font-weight:600;cursor:pointer;transition:background .2s}
.banner{background:#f0fdf4;border:1px solid #bbf7d0;padding:20px 24px;border-radius:16px;display:flex;align-items:center;gap:12px;margin:0 24px 48px;max-width:1200px;margin:0 auto 48px}
@media(max-width:768px){.grid{grid-template-columns:repeat(2,1fr)}.nav-center{display:none}}
</style></head><body>
<nav><div class="logo">SHOPIFY</div>
<div class="nav-center"><a>Donna</a><a>Uomo</a><a>Accessori</a><a>Saldi</a></div>
<button class="cart-btn">🛒 Carrello (0)</button></nav>
<section class="hero">
<div class="hero-tag">🆕 Nuova Collezione Primavera 2025</div>
<h1>Stile senza compromessi</h1>
<p>Scopri i pezzi iconici della stagione. Qualità premium, prezzi onesti.</p>
<div class="hero-cta">
<button class="btn-white">Scopri la collezione</button>
<button class="btn-outline">Saldi fino al 50%</button>
</div></section>
<div class="section">
<div class="section-header"><h2>🔥 Più venduti</h2><span class="see-all">Vedi tutti →</span></div>
<div class="grid">${cards}</div>
</div>
<div class="footer-note" style="position:fixed;bottom:12px;right:16px;background:rgba(0,0,0,.7);color:#fff;padding:6px 12px;border-radius:20px;font-size:11px;backdrop-filter:blur(8px)">⚡ Demo Emergent</div>
</body></html>`;
}

function dashboardTemplate(prompt: string): string {
  return `<!DOCTYPE html><html lang="it"><head><meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escHtml(prompt.slice(0,50))}</title>
<style>${baseStyles}
body{background:#0f172a;color:#e2e8f0;display:flex;min-height:100vh;font-size:14px}
.sidebar{width:220px;background:#1e293b;border-right:1px solid #334155;padding:24px 16px;display:flex;flex-direction:column;flex-shrink:0;position:fixed;height:100vh;overflow-y:auto}
.logo{font-size:1.1rem;font-weight:800;color:#fff;margin-bottom:32px;display:flex;align-items:center;gap:8px}
.nav-section{margin-bottom:24px}
.nav-label{font-size:11px;font-weight:600;color:#64748b;text-transform:uppercase;letter-spacing:.1em;margin-bottom:8px;padding:0 8px}
.nav-item{display:flex;align-items:center;gap:10px;padding:9px 12px;border-radius:8px;color:#94a3b8;cursor:pointer;transition:all .15s;margin-bottom:2px}
.nav-item:hover{background:#334155;color:#e2e8f0}
.nav-item.active{background:#3b82f6;color:#fff}
.main{flex:1;margin-left:220px;padding:24px}
.header{display:flex;align-items:center;justify-content:space-between;margin-bottom:28px}
.header h1{font-size:1.5rem;font-weight:800;color:#fff}
.header-right{display:flex;align-items:center;gap:12px}
.btn-primary{background:#3b82f6;color:#fff;padding:9px 20px;border-radius:8px;font-weight:600;font-size:13px;cursor:pointer;transition:background .2s}
.btn-primary:hover{background:#2563eb}
.avatar{width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#6366f1,#8b5cf6);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:15px}
.metrics{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:24px}
.metric-card{background:#1e293b;border:1px solid #334155;border-radius:12px;padding:20px}
.metric-label{font-size:12px;color:#64748b;margin-bottom:8px;display:flex;align-items:center;justify-content:space-between}
.metric-value{font-size:1.75rem;font-weight:800;color:#fff;margin-bottom:4px}
.metric-change{font-size:12px;color:#22c55e;display:flex;align-items:center;gap:4px}
.metric-change.down{color:#ef4444}
.charts{display:grid;grid-template-columns:2fr 1fr;gap:16px;margin-bottom:24px}
.chart-card{background:#1e293b;border:1px solid #334155;border-radius:12px;padding:20px}
.chart-card h3{font-size:.9rem;font-weight:700;color:#fff;margin-bottom:16px}
.chart-bars{display:flex;align-items:flex-end;gap:8px;height:120px}
.bar-wrap{flex:1;display:flex;flex-direction:column;align-items:center;gap:4px;height:100%}
.bar{width:100%;border-radius:4px 4px 0 0;background:linear-gradient(to top,#3b82f6,#6366f1);transition:height .3s;cursor:pointer;min-height:4px}
.bar:hover{filter:brightness(1.2)}
.bar-label{font-size:10px;color:#64748b}
.donut{width:100px;height:100px;border-radius:50%;background:conic-gradient(#3b82f6 0% 35%,#6366f1 35% 55%,#22c55e 55% 75%,#f59e0b 75% 100%);margin:0 auto 16px;box-shadow:inset 0 0 0 30px #1e293b}
.legend{display:flex;flex-direction:column;gap:8px}
.legend-item{display:flex;align-items:center;gap:8px;font-size:12px;color:#94a3b8}
.legend-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0}
.table-card{background:#1e293b;border:1px solid #334155;border-radius:12px;overflow:hidden}
.table-header{padding:16px 20px;border-bottom:1px solid #334155;display:flex;justify-content:space-between;align-items:center}
.table-header h3{font-size:.9rem;font-weight:700;color:#fff}
table{width:100%;border-collapse:collapse}
th{padding:10px 20px;text-align:left;font-size:11px;color:#64748b;text-transform:uppercase;letter-spacing:.05em;font-weight:600}
td{padding:12px 20px;font-size:13px;border-top:1px solid #1e293b}
tr:hover td{background:#263548}
.badge{display:inline-flex;padding:3px 10px;border-radius:9999px;font-size:11px;font-weight:600}
.badge-green{background:#dcfce7;color:#16a34a}
.badge-red{background:#fee2e2;color:#dc2626}
.badge-yellow{background:#fef9c3;color:#ca8a04}
@media(max-width:1024px){.metrics{grid-template-columns:repeat(2,1fr)}.charts{grid-template-columns:1fr}.sidebar{display:none}.main{margin-left:0}}
</style></head><body>
<aside class="sidebar">
  <div class="logo">📊 Analytics</div>
  <div class="nav-section"><div class="nav-label">Principale</div>
    <div class="nav-item active">🏠 Dashboard</div>
    <div class="nav-item">📈 Analytics</div>
    <div class="nav-item">📦 Ordini</div>
    <div class="nav-item">👥 Clienti</div>
  </div>
  <div class="nav-section"><div class="nav-label">Sistema</div>
    <div class="nav-item">⚙️ Impostazioni</div>
    <div class="nav-item">🔔 Notifiche</div>
    <div class="nav-item">📋 Report</div>
  </div>
</aside>
<main class="main">
  <div class="header"><h1>Dashboard</h1>
    <div class="header-right">
      <button class="btn-primary">+ Nuovo Report</button>
      <div class="avatar">T</div>
    </div>
  </div>
  <div class="metrics">
    <div class="metric-card"><div class="metric-label">Ricavi Totali <span>💰</span></div><div class="metric-value">€48.2K</div><div class="metric-change">↑ +12.5% vs mese scorso</div></div>
    <div class="metric-card"><div class="metric-label">Utenti Attivi <span>👥</span></div><div class="metric-value">2,840</div><div class="metric-change">↑ +8.1%</div></div>
    <div class="metric-card"><div class="metric-label">Ordini <span>📦</span></div><div class="metric-value">1,247</div><div class="metric-change down">↓ -2.3%</div></div>
    <div class="metric-card"><div class="metric-label">Tasso Conversione <span>🎯</span></div><div class="metric-value">3.24%</div><div class="metric-change">↑ +0.4%</div></div>
  </div>
  <div class="charts">
    <div class="chart-card"><h3>Andamento Ricavi (ultime 8 settimane)</h3>
      <div class="chart-bars">${[65,45,75,55,85,70,90,80].map((h,i)=>`<div class="bar-wrap"><div class="bar" style="height:${h}%"></div><span class="bar-label">S${i+1}</span></div>`).join('')}</div>
    </div>
    <div class="chart-card"><h3>Distribuzione</h3>
      <div class="donut"></div>
      <div class="legend">
        <div class="legend-item"><div class="legend-dot" style="background:#3b82f6"></div>Desktop 35%</div>
        <div class="legend-item"><div class="legend-dot" style="background:#6366f1"></div>Mobile 20%</div>
        <div class="legend-item"><div class="legend-dot" style="background:#22c55e"></div>Tablet 20%</div>
        <div class="legend-item"><div class="legend-dot" style="background:#f59e0b"></div>Altro 25%</div>
      </div>
    </div>
  </div>
  <div class="table-card">
    <div class="table-header"><h3>Ultimi Ordini</h3><button class="btn-primary" style="padding:6px 14px;font-size:12px">Vedi tutti</button></div>
    <table><tr><th>ID</th><th>Cliente</th><th>Prodotto</th><th>Totale</th><th>Stato</th></tr>
    ${[['#1042','Marco R.','Pro Plan','€149','Completato'],['#1041','Sofia L.','Starter','€49','In Attesa'],['#1040','Luca B.','Enterprise','€499','Completato'],['#1039','Anna M.','Pro Plan','€149','Annullato']].map(r=>`<tr><td style="color:#64748b">${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td><td style="font-weight:700">${r[3]}</td><td><span class="badge badge-${r[4]==='Completato'?'green':r[4]==='In Attesa'?'yellow':'red'}">${r[4]}</span></td></tr>`).join('')}
    </table>
  </div>
</main>
</body></html>`;
}

function blogTemplate(prompt: string): string {
  const posts = [
    { title: 'Come usare l\'AI per accelerare il tuo workflow', date: '12 Giu 2025', cat: 'Tech', emoji: '🤖', read: '5 min' },
    { title: 'Design System moderni: guida completa', date: '8 Giu 2025', cat: 'Design', emoji: '🎨', read: '8 min' },
    { title: 'Next.js 16: tutte le novità', date: '3 Giu 2025', cat: 'Dev', emoji: '⚡', read: '6 min' },
    { title: 'Il futuro del No-Code: tendenze 2025', date: '28 Mag 2025', cat: 'Trends', emoji: '🚀', read: '4 min' },
  ];
  return `<!DOCTYPE html><html lang="it"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escHtml(prompt.slice(0,50))}</title>
<style>${baseStyles}
body{background:#fff;color:#1a1a1a}
nav{border-bottom:1px solid #e5e5e5;padding:0 24px;height:60px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;background:#fff;z-index:100}
.logo{font-size:1.25rem;font-weight:900}
.nav-links{display:flex;gap:24px;font-size:14px;color:#666}
.subscribe-btn{background:#000;color:#fff;padding:9px 20px;border-radius:9999px;font-size:13px;font-weight:600;cursor:pointer}
.hero{background:linear-gradient(135deg,#0f172a,#1e293b);color:#fff;padding:80px 24px;text-align:center}
.hero-tag{display:inline-block;background:rgba(99,102,241,.2);border:1px solid rgba(99,102,241,.3);color:#a5b4fc;padding:6px 16px;border-radius:9999px;font-size:13px;margin-bottom:20px}
.hero h1{font-size:clamp(2rem,5vw,3.5rem);font-weight:900;max-width:700px;margin:0 auto 16px;line-height:1.15}
.hero p{color:#94a3b8;font-size:1.05rem;max-width:500px;margin:0 auto}
.content{max-width:900px;margin:60px auto;padding:0 24px}
.section-title{font-size:1.5rem;font-weight:800;margin-bottom:24px}
.posts-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:24px}
.post-card{border:1px solid #e5e5e5;border-radius:16px;overflow:hidden;cursor:pointer;transition:transform .2s,box-shadow .2s}
.post-card:hover{transform:translateY(-4px);box-shadow:0 12px 40px rgba(0,0,0,.08)}
.post-img{height:180px;background:linear-gradient(135deg,#0f172a,#1e293b);display:flex;align-items:center;justify-content:center;font-size:3rem}
.post-body{padding:20px}
.post-cat{font-size:11px;font-weight:700;color:#6366f1;text-transform:uppercase;letter-spacing:.1em;margin-bottom:8px}
.post-title{font-size:1.05rem;font-weight:700;margin-bottom:12px;line-height:1.4}
.post-meta{display:flex;align-items:center;gap:12px;font-size:12px;color:#94a3b8}
.newsletter{background:#f8faff;border:1px solid #e0e7ff;border-radius:20px;padding:48px;text-align:center;margin-top:60px}
.newsletter h2{font-size:1.75rem;font-weight:800;margin-bottom:12px}
.newsletter p{color:#64748b;margin-bottom:24px}
.email-row{display:flex;gap:8px;max-width:400px;margin:0 auto}
.email-input{flex:1;padding:12px 16px;border:1px solid #e2e8f0;border-radius:9999px;font-size:14px;outline:none}
.email-input:focus{border-color:#6366f1}
.sub-btn{background:#6366f1;color:#fff;padding:12px 24px;border-radius:9999px;font-weight:600;font-size:14px;cursor:pointer;white-space:nowrap}
@media(max-width:640px){.posts-grid{grid-template-columns:1fr}}
</style></head><body>
<nav><div class="logo">✍️ TechBlog</div>
<div class="nav-links"><a>Articoli</a><a>Tutorial</a><a>Newsletter</a></div>
<button class="subscribe-btn">Iscriviti</button></nav>
<section class="hero">
<div class="hero-tag">📰 Il blog per sviluppatori</div>
<h1>Idee, tutorial e tendenze dal mondo tech</h1>
<p>Articoli settimanali su AI, sviluppo web e design</p>
</section>
<div class="content">
<div class="section-title">📌 Articoli recenti</div>
<div class="posts-grid">${posts.map(p=>`<div class="post-card">
<div class="post-img">${p.emoji}</div>
<div class="post-body"><div class="post-cat">${p.cat}</div>
<div class="post-title">${p.title}</div>
<div class="post-meta"><span>${p.date}</span><span>•</span><span>⏱ ${p.read} lettura</span></div>
</div></div>`).join('')}</div>
<div class="newsletter"><h2>📬 Rimani aggiornato</h2>
<p>Ricevi i migliori articoli ogni settimana, direttamente nella tua inbox.</p>
<div class="email-row"><input class="email-input" placeholder="tua@email.com" type="email">
<button class="sub-btn" onclick="this.textContent='✓ Iscritto!'">Iscriviti</button></div>
</div></div>
</body></html>`;
}

function todoTemplate(prompt: string): string {
  return `<!DOCTYPE html><html lang="it"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escHtml(prompt.slice(0,50))}</title>
<style>${baseStyles}
body{background:#0f172a;color:#e2e8f0;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px}
.app{width:100%;max-width:480px}
.header{text-align:center;margin-bottom:32px}
.header h1{font-size:2rem;font-weight:900;color:#fff;margin-bottom:8px}
.header p{color:#64748b;font-size:14px}
.progress-bar{background:#1e293b;border-radius:9999px;height:8px;margin-bottom:32px;overflow:hidden}
.progress-fill{height:100%;background:linear-gradient(to right,#6366f1,#8b5cf6);border-radius:9999px;width:40%;transition:width .5s}
.add-row{display:flex;gap:8px;margin-bottom:24px}
.add-input{flex:1;background:#1e293b;border:1px solid #334155;color:#fff;padding:12px 16px;border-radius:12px;font-size:14px;outline:none;transition:border-color .2s}
.add-input:focus{border-color:#6366f1}
.add-input::placeholder{color:#475569}
.add-btn{background:#6366f1;color:#fff;padding:12px 20px;border-radius:12px;font-weight:600;font-size:14px;cursor:pointer;white-space:nowrap;transition:background .2s}
.add-btn:hover{background:#4f46e5}
.filters{display:flex;gap:8px;margin-bottom:20px}
.filter-btn{padding:6px 16px;border-radius:9999px;font-size:13px;cursor:pointer;border:1px solid transparent;transition:all .15s;background:#1e293b;color:#64748b}
.filter-btn.active{background:#6366f1;color:#fff;border-color:#6366f1}
.task-list{display:flex;flex-direction:column;gap:8px}
.task{display:flex;align-items:center;gap:12px;background:#1e293b;border:1px solid #334155;border-radius:12px;padding:14px 16px;cursor:pointer;transition:all .15s}
.task:hover{border-color:#475569}
.task.done .task-text{text-decoration:line-through;color:#475569}
.check{width:22px;height:22px;border-radius:6px;border:2px solid #334155;flex-shrink:0;display:flex;align-items:center;justify-content:center;transition:all .2s;font-size:12px}
.task.done .check{background:#6366f1;border-color:#6366f1;color:#fff}
.task-text{flex:1;font-size:14px}
.task-tag{font-size:11px;padding:3px 10px;border-radius:9999px;font-weight:600}
.tag-work{background:#dbeafe;color:#1d4ed8}
.tag-personal{background:#dcfce7;color:#15803d}
.tag-urgent{background:#fee2e2;color:#b91c1c}
.del-btn{color:#475569;font-size:16px;padding:2px 6px;cursor:pointer;opacity:0;transition:opacity .15s}
.task:hover .del-btn{opacity:1}
.empty{text-align:center;padding:48px;color:#334155}
.empty div{font-size:3rem;margin-bottom:12px}
.stats{display:flex;gap:12px;margin-top:24px}
.stat{flex:1;background:#1e293b;border:1px solid #334155;border-radius:12px;padding:16px;text-align:center}
.stat-num{font-size:1.5rem;font-weight:800;color:#fff}
.stat-label{font-size:12px;color:#64748b;margin-top:4px}
</style></head><body>
<div class="app">
<div class="header"><h1>✅ Le mie Tasks</h1><p id="date-label"></p></div>
<div class="progress-bar"><div class="progress-fill" id="progress"></div></div>
<div class="add-row">
  <input class="add-input" id="task-input" placeholder="Aggiungi una nuova attività..." onkeydown="if(event.key==='Enter')addTask()">
  <button class="add-btn" onclick="addTask()">+ Aggiungi</button>
</div>
<div class="filters">
  <button class="filter-btn active" onclick="setFilter('all',this)">Tutte</button>
  <button class="filter-btn" onclick="setFilter('active',this)">Da fare</button>
  <button class="filter-btn" onclick="setFilter('done',this)">Completate</button>
</div>
<div class="task-list" id="task-list"></div>
<div class="stats">
  <div class="stat"><div class="stat-num" id="total-count">0</div><div class="stat-label">Totale</div></div>
  <div class="stat"><div class="stat-num" id="done-count">0</div><div class="stat-label">Completate</div></div>
  <div class="stat"><div class="stat-num" id="pct">0%</div><div class="stat-label">Progresso</div></div>
</div>
</div>
<script>
const tags = ['work','personal','urgent','personal','work'];
const tagLabels = {work:'💼 Lavoro',personal:'🏠 Personale',urgent:'🔥 Urgente'};
let tasks = [
  {id:1,text:'Completare il progetto Emergent',done:false,tag:'work'},
  {id:2,text:'Fare la spesa',done:true,tag:'personal'},
  {id:3,text:'Rilasciare la nuova versione',done:false,tag:'urgent'},
  {id:4,text:'Chiamare il cliente',done:false,tag:'work'},
];
let filter = 'all';
let nextId = 5;

document.getElementById('date-label').textContent = new Date().toLocaleDateString('it-IT',{weekday:'long',day:'numeric',month:'long'});

function setFilter(f,btn){
  filter=f;
  document.querySelectorAll('.filter-btn').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  render();
}

function addTask(){
  const input=document.getElementById('task-input');
  const text=input.value.trim();
  if(!text)return;
  tasks.unshift({id:nextId++,text,done:false,tag:tags[Math.floor(Math.random()*tags.length)]});
  input.value='';
  render();
}

function toggle(id){tasks=tasks.map(t=>t.id===id?{...t,done:!t.done}:t);render();}
function del(id){tasks=tasks.filter(t=>t.id!==id);render();}

function render(){
  const shown = filter==='all'?tasks:filter==='done'?tasks.filter(t=>t.done):tasks.filter(t=>!t.done);
  const list = document.getElementById('task-list');
  const done = tasks.filter(t=>t.done).length;
  const pct = tasks.length?Math.round(done/tasks.length*100):0;
  document.getElementById('progress').style.width=pct+'%';
  document.getElementById('total-count').textContent=tasks.length;
  document.getElementById('done-count').textContent=done;
  document.getElementById('pct').textContent=pct+'%';
  if(!shown.length){list.innerHTML='<div class="empty"><div>✨</div><p>Nessuna attività qui</p></div>';return;}
  list.innerHTML=shown.map(t=>\`<div class="task \${t.done?'done':''}" onclick="toggle(\${t.id})">
    <div class="check">\${t.done?'✓':''}</div>
    <span class="task-text">\${t.text}</span>
    <span class="task-tag tag-\${t.tag}">\${tagLabels[t.tag]}</span>
    <span class="del-btn" onclick="event.stopPropagation();del(\${t.id})">✕</span>
  </div>\`).join('');
}
render();
</script></body></html>`;
}

function chatTemplate(prompt: string): string {
  return `<!DOCTYPE html><html lang="it"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escHtml(prompt.slice(0,50))}</title>
<style>${baseStyles}
body{background:#0f172a;color:#e2e8f0;height:100vh;display:flex;overflow:hidden}
.sidebar{width:260px;background:#1e293b;border-right:1px solid #334155;display:flex;flex-direction:column;flex-shrink:0}
.sidebar-header{padding:16px;border-bottom:1px solid #334155;display:flex;align-items:center;justify-content:space-between}
.sidebar-logo{font-size:1.1rem;font-weight:800;color:#fff}
.new-chat-btn{background:#6366f1;color:#fff;padding:6px 14px;border-radius:8px;font-size:12px;font-weight:600;cursor:pointer}
.contacts{flex:1;overflow-y:auto;padding:8px}
.contact{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:10px;cursor:pointer;transition:background .15s;position:relative}
.contact:hover,.contact.active{background:#334155}
.contact-avatar{width:40px;height:40px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:15px;flex-shrink:0}
.contact-info{flex:1;min-width:0}
.contact-name{font-size:13px;font-weight:600;color:#fff;margin-bottom:2px}
.contact-preview{font-size:12px;color:#64748b;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.contact-meta{display:flex;flex-direction:column;align-items:flex-end;gap:4px}
.contact-time{font-size:11px;color:#475569}
.unread-badge{background:#6366f1;color:#fff;width:18px;height:18px;border-radius:50%;font-size:10px;display:flex;align-items:center;justify-content:center;font-weight:700}
.online-dot{width:8px;height:8px;border-radius:50%;background:#22c55e;position:absolute;bottom:14px;left:42px;border:2px solid #1e293b}
.chat-area{flex:1;display:flex;flex-direction:column}
.chat-header{padding:16px 20px;border-bottom:1px solid #334155;display:flex;align-items:center;justify-content:space-between;background:#1e293b}
.chat-user{display:flex;align-items:center;gap:12px}
.chat-user-info h3{font-size:14px;font-weight:700;color:#fff;margin-bottom:2px}
.chat-user-info p{font-size:12px;color:#22c55e}
.chat-actions{display:flex;gap:8px}
.icon-btn{width:36px;height:36px;border-radius:9px;background:#334155;display:flex;align-items:center;justify-content:center;cursor:pointer;color:#94a3b8;font-size:14px;transition:background .15s}
.icon-btn:hover{background:#475569}
.messages{flex:1;overflow-y:auto;padding:20px;display:flex;flex-direction:column;gap:12px}
.msg{max-width:70%;display:flex;gap:8px;align-items:flex-end}
.msg.sent{flex-direction:row-reverse;align-self:flex-end}
.msg-bubble{padding:10px 14px;border-radius:16px;font-size:13px;line-height:1.5}
.msg.received .msg-bubble{background:#1e293b;color:#e2e8f0;border-bottom-left-radius:4px}
.msg.sent .msg-bubble{background:#6366f1;color:#fff;border-bottom-right-radius:4px}
.msg-avatar{width:28px;height:28px;border-radius:50%;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:11px}
.msg-time{font-size:10px;color:#475569;margin-top:4px;text-align:right}
.typing{display:flex;align-items:center;gap:4px;padding:10px 14px;background:#1e293b;border-radius:16px;border-bottom-left-radius:4px;width:fit-content}
.dot{width:6px;height:6px;border-radius:50%;background:#475569;animation:bounce 1.2s infinite}
.dot:nth-child(2){animation-delay:.2s}.dot:nth-child(3){animation-delay:.4s}
@keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}
.input-area{padding:16px 20px;border-top:1px solid #334155;background:#1e293b}
.input-row{display:flex;align-items:center;gap:10px;background:#0f172a;border:1px solid #334155;border-radius:12px;padding:8px 12px}
.msg-input{flex:1;background:transparent;color:#e2e8f0;font-size:14px;outline:none;border:none}
.msg-input::placeholder{color:#475569}
.send-btn{width:36px;height:36px;border-radius:9px;background:#6366f1;color:#fff;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:14px;transition:background .2s}
.send-btn:hover{background:#4f46e5}
@media(max-width:768px){.sidebar{display:none}}
</style></head><body>
<div class="sidebar">
<div class="sidebar-header"><span class="sidebar-logo">💬 Chat</span><button class="new-chat-btn">+ Nuovo</button></div>
<div class="contacts">
${[['Marco','Ciao! Come stai?','10:42','2','#f59e0b'],['Sofia','Ok perfetto, grazie','09:18','','#6366f1'],['Luca','Hai visto il progetto?','Ieri','3','#22c55e'],['Anna','👍','Lun','','#ec4899'],['Team Dev','Meeting domani alle 10','Lun','5','#f97316']].map(([n,p,t,u,c])=>`
<div class="contact ${n==='Marco'?'active':''}">
<div class="contact-avatar" style="background:${c}">${(n as string)[0]}</div>
${n==='Marco'||n==='Luca'?'<div class="online-dot"></div>':''}
<div class="contact-info"><div class="contact-name">${n}</div><div class="contact-preview">${p}</div></div>
<div class="contact-meta"><div class="contact-time">${t}</div>${u?`<div class="unread-badge">${u}</div>`:''}</div>
</div>`).join('')}
</div>
</div>
<div class="chat-area">
<div class="chat-header">
<div class="chat-user">
<div class="contact-avatar" style="background:#f59e0b;width:40px;height:40px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700">M</div>
<div class="contact-info"><div class="chat-user-info"><h3>Marco Rossi</h3><p>● Online</p></div></div>
</div>
<div class="chat-actions"><div class="icon-btn">📞</div><div class="icon-btn">📹</div><div class="icon-btn">⋯</div></div>
</div>
<div class="messages" id="msgs">
<div class="msg received"><div class="msg-avatar" style="background:#f59e0b">M</div><div><div class="msg-bubble">Ciao! Come procede il progetto?</div><div class="msg-time">10:38</div></div></div>
<div class="msg sent"><div class="msg-avatar" style="background:#6366f1">T</div><div><div class="msg-bubble">Tutto bene! Ho quasi finito la parte frontend 🚀</div><div class="msg-time">10:39</div></div></div>
<div class="msg received"><div class="msg-avatar" style="background:#f59e0b">M</div><div><div class="msg-bubble">Ottimo! Quando pensi di finire?</div><div class="msg-time">10:41</div></div></div>
<div class="msg sent"><div class="msg-avatar" style="background:#6366f1">T</div><div><div class="msg-bubble">Entro oggi pomeriggio 💪</div><div class="msg-time">10:42</div></div></div>
</div>
<div class="input-area">
<div class="input-row">
<span style="color:#64748b;font-size:16px;cursor:pointer">📎</span>
<input class="msg-input" id="msg-in" placeholder="Scrivi un messaggio..." onkeydown="if(event.key==='Enter')sendMsg()">
<span style="color:#64748b;font-size:16px;cursor:pointer">😊</span>
<div class="send-btn" onclick="sendMsg()">➤</div>
</div></div>
</div>
<script>
function sendMsg(){
  const i=document.getElementById('msg-in');const t=i.value.trim();if(!t)return;
  const msgs=document.getElementById('msgs');
  const m=document.createElement('div');m.className='msg sent';
  m.innerHTML=\`<div class="msg-avatar" style="background:#6366f1">T</div><div><div class="msg-bubble">\${t}</div><div class="msg-time">\${new Date().toLocaleTimeString('it-IT',{hour:'2-digit',minute:'2-digit'})}</div></div>\`;
  msgs.appendChild(m);i.value='';msgs.scrollTop=msgs.scrollHeight;
  setTimeout(()=>{
    const typing=document.createElement('div');typing.className='msg received';typing.id='typing-indicator';
    typing.innerHTML='<div class="msg-avatar" style="background:#f59e0b">M</div><div class="typing"><div class="dot"></div><div class="dot"></div><div class="dot"></div></div>';
    msgs.appendChild(typing);msgs.scrollTop=msgs.scrollHeight;
    setTimeout(()=>{
      typing.remove();
      const r=document.createElement('div');r.className='msg received';
      const replies=['👍 Perfetto!','Capito, grazie!','Ottima idea!','✅ Ok!','Sì, concordo!'];
      r.innerHTML=\`<div class="msg-avatar" style="background:#f59e0b">M</div><div><div class="msg-bubble">\${replies[Math.floor(Math.random()*replies.length)]}</div><div class="msg-time">\${new Date().toLocaleTimeString('it-IT',{hour:'2-digit',minute:'2-digit'})}</div></div>\`;
      msgs.appendChild(r);msgs.scrollTop=msgs.scrollHeight;
    },1500);
  },800);
}
</script></body></html>`;
}

function landingTemplate(prompt: string): string {
  const title = prompt.slice(0, 50);
  return `<!DOCTYPE html><html lang="it"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escHtml(title)}</title>
<style>${baseStyles}
body{background:#0a0a0a;color:#fff}
nav{display:flex;align-items:center;justify-content:space-between;padding:20px 48px;position:sticky;top:0;background:rgba(10,10,10,.9);backdrop-filter:blur(12px);border-bottom:1px solid rgba(255,255,255,.06);z-index:100}
.logo{font-size:1.25rem;font-weight:900;background:linear-gradient(135deg,#4ADE80,#67E8F9);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.nav-links{display:flex;gap:28px;font-size:14px;color:#888}
.nav-links a:hover{color:#fff;cursor:pointer}
.cta-btn{background:linear-gradient(135deg,#F59E0B,#D97706);color:#000;padding:10px 24px;border-radius:9999px;font-weight:700;font-size:14px;cursor:pointer;transition:transform .2s,box-shadow .2s}
.cta-btn:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(245,158,11,.3)}
.hero{min-height:90vh;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:80px 24px;position:relative;overflow:hidden}
.hero::before{content:'';position:absolute;top:30%;left:50%;transform:translate(-50%,-50%);width:800px;height:800px;background:radial-gradient(circle,rgba(99,102,241,.15) 0%,transparent 70%);pointer-events:none}
.hero-badge{display:inline-flex;align-items:center;gap:8px;background:rgba(99,102,241,.1);border:1px solid rgba(99,102,241,.2);color:#a5b4fc;padding:8px 18px;border-radius:9999px;font-size:13px;font-weight:500;margin-bottom:28px}
.hero h1{font-size:clamp(2.5rem,7vw,5.5rem);font-weight:900;line-height:1.05;max-width:900px;margin-bottom:20px;background:linear-gradient(180deg,#fff 0%,rgba(255,255,255,.6) 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.hero p{color:#666;font-size:1.15rem;max-width:560px;margin:0 auto 40px;line-height:1.7}
.hero-actions{display:flex;gap:12px;justify-content:center;flex-wrap:wrap}
.btn-main{background:linear-gradient(135deg,#F59E0B,#D97706);color:#000;padding:16px 36px;border-radius:9999px;font-weight:700;font-size:1rem;cursor:pointer;transition:all .2s}
.btn-main:hover{transform:translateY(-3px);box-shadow:0 12px 32px rgba(245,158,11,.35)}
.btn-ghost{background:rgba(255,255,255,.05);color:#fff;border:1px solid rgba(255,255,255,.12);padding:16px 32px;border-radius:9999px;font-weight:600;font-size:1rem;cursor:pointer;transition:all .2s}
.btn-ghost:hover{background:rgba(255,255,255,.1)}
.social-proof{color:#555;font-size:13px;margin-top:32px;display:flex;align-items:center;gap:8px;justify-content:center}
.avatars{display:flex}
.av{width:32px;height:32px;border-radius:50%;border:2px solid #0a0a0a;margin-left:-8px;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:12px}
.features{max-width:1100px;margin:0 auto;padding:80px 24px}
.features-header{text-align:center;margin-bottom:60px}
.features-header h2{font-size:clamp(1.75rem,4vw,3rem);font-weight:800;margin-bottom:12px}
.features-header p{color:#555;font-size:1.05rem;max-width:500px;margin:0 auto}
.features-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
.feature-card{background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.07);border-radius:20px;padding:28px;transition:all .2s}
.feature-card:hover{background:rgba(255,255,255,.06);border-color:rgba(99,102,241,.3);transform:translateY(-4px)}
.feature-icon{width:48px;height:48px;border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:1.5rem;margin-bottom:16px}
.feature-card h3{font-size:1.05rem;font-weight:700;margin-bottom:8px}
.feature-card p{font-size:.9rem;color:#555;line-height:1.6}
.pricing{background:rgba(255,255,255,.02);border-top:1px solid rgba(255,255,255,.06);padding:80px 24px;text-align:center}
.pricing h2{font-size:clamp(1.75rem,4vw,3rem);font-weight:800;margin-bottom:12px}
.pricing p{color:#555;margin-bottom:48px}
.plans{display:flex;gap:16px;justify-content:center;flex-wrap:wrap;max-width:900px;margin:0 auto}
.plan{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.09);border-radius:20px;padding:32px;width:260px;transition:transform .2s}
.plan.featured{border-color:#6366f1;background:rgba(99,102,241,.08)}
.plan:hover{transform:translateY(-4px)}
.plan-name{font-size:13px;font-weight:700;color:#888;text-transform:uppercase;letter-spacing:.1em;margin-bottom:12px}
.plan-price{font-size:2.5rem;font-weight:900;margin-bottom:4px}
.plan-price span{font-size:1rem;font-weight:400;color:#666}
.plan-desc{font-size:13px;color:#555;margin-bottom:24px}
.plan-features{text-align:left;margin-bottom:24px}
.plan-feature{font-size:13px;color:#888;padding:6px 0;display:flex;gap:8px}
.plan-feature::before{content:'✓';color:#22c55e;font-weight:700;flex-shrink:0}
.plan-btn{width:100%;padding:12px;border-radius:9999px;font-weight:600;font-size:14px;cursor:pointer;transition:all .2s}
.plan-btn-default{background:rgba(255,255,255,.07);color:#fff;border:1px solid rgba(255,255,255,.1)}
.plan-btn-featured{background:#6366f1;color:#fff}
.footer{border-top:1px solid rgba(255,255,255,.06);padding:32px 48px;display:flex;align-items:center;justify-content:space-between;color:#444;font-size:13px}
@media(max-width:768px){.features-grid{grid-template-columns:1fr}.plans{flex-direction:column;align-items:center}.nav-links{display:none}.hero{padding:60px 16px}.footer{flex-direction:column;gap:12px;text-align:center}}
</style></head><body>
<nav><div class="logo">⚡ ${escHtml(title.split(' ').slice(0,2).join(''))||'Emergent'}</div>
<div class="nav-links"><a>Prodotto</a><a>Prezzi</a><a>Docs</a><a>Blog</a></div>
<button class="cta-btn">Inizia Gratis →</button></nav>
<section class="hero">
<div class="hero-badge">✨ Nuovo — v2.0 disponibile</div>
<h1>${escHtml(prompt.slice(0,60))}</h1>
<p>La piattaforma più veloce per trasformare le tue idee in prodotti reali. Zero configurazione, risultati immediati.</p>
<div class="hero-actions">
<button class="btn-main" onclick="this.textContent='🚀 Reindirizzando...'">Inizia Gratis</button>
<button class="btn-ghost">Guarda la demo ▶</button>
</div>
<div class="social-proof">
<div class="avatars">${['#6366f1','#f59e0b','#22c55e','#ec4899'].map(c=>`<div class="av" style="background:${c}">👤</div>`).join('')}</div>
<span>+2.400 team lo usano già</span>
</div>
</section>
<div class="features">
<div class="features-header"><h2>Tutto quello che ti serve</h2><p>Da zero a produzione in pochi minuti</p></div>
<div class="features-grid">
${[['⚡','Velocissimo','Build istantanee con AI. Nessun tempo di attesa.'],['🔒','Sicuro','Enterprise-grade security out of the box.'],['🌐','Scalabile','Da 0 a milioni di utenti senza configurazioni.'],['🎨','Personalizzabile','Tema e design completamente controllabili.'],['📊','Analytics','Dashboard integrata con metriche in real-time.'],['🔗','Integrazioni','Connetti qualsiasi tool con un click.']].map(([i,t,d])=>`
<div class="feature-card">
<div class="feature-icon" style="background:rgba(99,102,241,.15)">${i}</div>
<h3>${t}</h3><p>${d}</p></div>`).join('')}
</div></div>
<div class="pricing"><h2>Prezzi semplici</h2><p>Nessuna sorpresa. Cancella quando vuoi.</p>
<div class="plans">
<div class="plan"><div class="plan-name">Starter</div><div class="plan-price">€0<span>/mese</span></div><div class="plan-desc">Per iniziare</div>
<div class="plan-features">${['3 progetti','1GB storage','Supporto community'].map(f=>`<div class="plan-feature">${f}</div>`).join('')}</div>
<button class="plan-btn plan-btn-default">Inizia gratis</button></div>
<div class="plan featured"><div class="plan-name">Pro</div><div class="plan-price">€29<span>/mese</span></div><div class="plan-desc">Per professionisti</div>
<div class="plan-features">${['Progetti illimitati','50GB storage','Priorità support','Custom domain'].map(f=>`<div class="plan-feature">${f}</div>`).join('')}</div>
<button class="plan-btn plan-btn-featured">Prova Pro →</button></div>
<div class="plan"><div class="plan-name">Enterprise</div><div class="plan-price">€99<span>/mese</span></div><div class="plan-desc">Per i team</div>
<div class="plan-features">${['Tutto di Pro','SSO/SAML','SLA 99.9%','Onboarding dedicato'].map(f=>`<div class="plan-feature">${f}</div>`).join('')}</div>
<button class="plan-btn plan-btn-default">Contattaci</button></div>
</div></div>
<footer class="footer"><div>© 2025 ${escHtml(title.split(' ')[0])||'Emergent'}. Tutti i diritti riservati.</div>
<div style="display:flex;gap:20px"><a style="cursor:pointer">Privacy</a><a style="cursor:pointer">Termini</a><a style="cursor:pointer">Contatti</a></div></footer>
</body></html>`;
}

function escHtml(s: string): string {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
