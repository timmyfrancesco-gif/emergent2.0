import type { GenerateResponse } from './types';

// Smart client-side HTML generator — used as fallback when Gemini API isn't available
export function generateDemoResponse(prompt: string): GenerateResponse {
  const p = prompt.toLowerCase();

  const isNetflix = /netflix|streaming|film|serie|video|watch/i.test(p);
  const isEcommerce = /shop|store|ecommerce|e-commerce|prodott|acquist|cart|negozio/i.test(p);
  const isDashboard = /dashboard|analytic|metric|statistic|chart|admin|pannello/i.test(p);
  const isBlog = /blog|articol|post|cms|notizie|news/i.test(p);
  const isTodo = /todo|task|list|agenda|attivit/i.test(p);
  const isChat = /chat|messag|discord|whatsapp|telegram/i.test(p);
  const isPortfolio = /portfolio|cv|curriculum|personal|developer|designer|freelance/i.test(p);
  const isRestaurant = /ristorante|restaurant|food|menu|pizz|caffe|bar|cucina/i.test(p);

  let html: string;
  let description: string;

  if (isNetflix) {
    html = netflixTemplate(prompt);
    description = 'Ho creato un\'interfaccia streaming in stile Netflix con hero banner, griglia contenuti e overlay interattivi sulle card. Prova a passarci sopra con il mouse!';
  } else if (isEcommerce) {
    html = ecommerceTemplate(prompt);
    description = 'Ho creato un negozio online completo con hero, griglia prodotti con hover effect e pulsante "Aggiungi al carrello" funzionante. Clicca su un prodotto per testarlo!';
  } else if (isDashboard) {
    html = dashboardTemplate(prompt);
    description = 'Ho creato una dashboard analytics con sidebar di navigazione, 4 KPI cards, grafico a barre animato e tabella ordini recenti. Completamente responsiva su mobile.';
  } else if (isBlog) {
    html = blogTemplate(prompt);
    description = 'Ho creato un blog moderno con hero scuro, griglia articoli con card animate e sezione newsletter funzionante. Clicca "Iscriviti" per testarlo!';
  } else if (isTodo) {
    html = todoTemplate(prompt);
    description = 'Ho creato un\'app todo completamente funzionale: aggiungi task, completale, filtra per stato e monitora il progresso con la barra. Prova ad aggiungere una task!';
  } else if (isChat) {
    html = chatTemplate(prompt);
    description = 'Ho creato un\'app di messaggistica con sidebar contatti, area chat con messaggi animati e risposta automatica simulata. Scrivi un messaggio e aspetta la risposta!';
  } else if (isPortfolio) {
    html = portfolioTemplate(prompt);
    description = 'Ho creato un portfolio personale con hero animato, sezione progetti con griglia, skills e form di contatto. Ottimizzato per impressionare i clienti!';
  } else if (isRestaurant) {
    html = restaurantTemplate(prompt);
    description = 'Ho creato un sito ristorante elegante con hero, menu completo con categorie, galleria e sezione prenotazioni. Prova il pulsante "Prenota un tavolo"!';
  } else {
    html = landingTemplate(prompt);
    description = 'Ho creato una landing page moderna con hero gradient, 6 feature cards, sezione prezzi con 3 piani e footer. Ottimizzata per conversioni e completamente responsiva.';
  }

  return {
    files: [{ path: 'index.html', content: html, language: 'html' }],
    summary: description,
    fileChanges: [{ path: 'index.html', action: 'created', description }],
  };
}

const gf = `<link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">`;

const baseStyles = `
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  html{scroll-behavior:smooth}
  body{font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;line-height:1.5}
  a{text-decoration:none;color:inherit}
  button{cursor:pointer;border:none;outline:none;font-family:inherit}
  img{max-width:100%;height:auto;display:block}
  input,textarea,select{font-family:inherit}
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
  const prods = [
    {name:'Sneaker Velocity Pro',price:'€119',orig:'€159',emoji:'👟',bg:'#f5f0eb',tag:'Best Seller'},
    {name:'Trench Coat Premium',price:'€249',orig:'',emoji:'🧥',bg:'#ede8e0',tag:''},
    {name:'Borsa Mini Leather',price:'€189',orig:'€220',emoji:'👜',bg:'#e8dfd5',tag:'Saldo'},
    {name:'Occhiali Shield UV',price:'€95',orig:'',emoji:'🕶️',bg:'#dff0e8',tag:''},
    {name:'Smartwatch Series X',price:'€329',orig:'€399',emoji:'⌚',bg:'#dce8f5',tag:'Novità'},
    {name:'Cappello Logo Cap',price:'€45',orig:'',emoji:'🧢',bg:'#f5dce8',tag:''},
    {name:'Zaino Tech Urban',price:'€135',orig:'',emoji:'🎒',bg:'#e8e8f5',tag:''},
    {name:'Cintura Pelle Nappa',price:'€79',orig:'€99',emoji:'👔',bg:'#f5f0e0',tag:'Saldo'},
  ];
  return `<!DOCTYPE html>
<html lang="it">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escHtml(prompt.slice(0,50))}</title>
${gf}
<style>
${baseStyles}
:root{--bg:#fafaf9;--card:#ffffff;--text:#111;--text2:#555;--text3:#999;--br:#e5e5e5;--acc:#111;--radius:14px}
body{background:var(--bg);color:var(--text);min-height:100vh}

/* ANNOUNCE BAR */
.announce{background:#111;color:#fff;text-align:center;padding:10px 16px;font-size:.8125rem;font-weight:500;letter-spacing:.02em}
.announce span{color:#f59e0b;margin:0 4px}

/* NAV */
nav{background:#fff;border-bottom:1px solid var(--br);padding:0 max(20px,calc((100vw - 1280px)/2));height:68px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:100}
.n-logo{font-size:1.3rem;font-weight:900;letter-spacing:-.03em;color:#111}
.n-cats{display:flex;gap:0}
.n-cats a{padding:8px 16px;font-size:.875rem;color:var(--text2);cursor:pointer;transition:color .15s;position:relative}
.n-cats a:hover{color:var(--text)}
.n-cats a.active::after{content:'';position:absolute;bottom:-1px;left:16px;right:16px;height:2px;background:#111;border-radius:1px}
.n-right{display:flex;align-items:center;gap:4px}
.n-ico{width:38px;height:38px;display:flex;align-items:center;justify-content:center;border-radius:9px;cursor:pointer;transition:background .15s;color:var(--text2);font-size:.9375rem;position:relative}
.n-ico:hover{background:#f5f5f5;color:var(--text)}
.cart-badge{position:absolute;top:7px;right:7px;width:14px;height:14px;background:#ef4444;color:#fff;border-radius:50%;font-size:9px;display:flex;align-items:center;justify-content:center;font-weight:700}

/* HERO */
.hero{display:grid;grid-template-columns:1fr 1fr;min-height:600px;overflow:hidden}
.hero-left{background:#111;display:flex;flex-direction:column;justify-content:center;padding:80px max(40px,calc((100vw - 1280px)/2 + 40px)) 80px max(40px,calc((100vw - 1280px)/2));color:#fff}
.hero-sub{font-size:.8125rem;font-weight:600;text-transform:uppercase;letter-spacing:.18em;color:rgba(255,255,255,.5);margin-bottom:20px}
.hero h1{font-size:clamp(2.25rem,4vw,3.75rem);font-weight:900;line-height:1.05;letter-spacing:-.04em;margin-bottom:20px}
.hero h1 em{font-style:normal;color:#d4af37}
.hero p{color:rgba(255,255,255,.55);font-size:1rem;line-height:1.7;margin-bottom:36px;max-width:380px}
.hero-btns{display:flex;gap:10px;flex-wrap:wrap}
.hb-p{background:#fff;color:#111;padding:14px 30px;border-radius:8px;font-weight:700;font-size:.9375rem;cursor:pointer;transition:all .2s}
.hb-p:hover{background:#f0f0f0;transform:translateY(-1px)}
.hb-s{background:transparent;color:#fff;border:1px solid rgba(255,255,255,.25);padding:14px 28px;border-radius:8px;font-weight:500;font-size:.9375rem;cursor:pointer;transition:all .2s}
.hb-s:hover{background:rgba(255,255,255,.08)}
.hero-right{background:#f5f0e8;display:flex;align-items:center;justify-content:center;font-size:11rem;position:relative;overflow:hidden}
.hero-right::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse at 50% 70%,rgba(212,175,55,.15),transparent 70%)}
.hero-label{position:absolute;bottom:24px;left:24px;background:#fff;border-radius:10px;padding:12px 16px;box-shadow:0 4px 20px rgba(0,0,0,.1)}
.hl-name{font-size:.875rem;font-weight:700;color:#111;margin-bottom:2px}
.hl-price{font-size:1rem;font-weight:800;color:#111}
.hl-orig{font-size:.8125rem;color:#999;text-decoration:line-through;margin-left:6px;font-weight:400}

/* PROMOS */
.promos{display:grid;grid-template-columns:repeat(3,1fr);gap:0;border-top:1px solid var(--br);border-bottom:1px solid var(--br)}
.promo-item{display:flex;align-items:center;gap:12px;padding:18px max(20px,calc((100vw - 1280px)/2 + 20px));border-right:1px solid var(--br)}
.promo-item:last-child{border-right:none}
.promo-ico{font-size:1.25rem}
.promo-text{font-size:.8125rem;font-weight:600;color:var(--text);margin-bottom:1px}
.promo-sub{font-size:.75rem;color:var(--text3)}

/* SECTIONS */
.section{max-width:1280px;margin:0 auto;padding:60px 20px}
.sec-hd{display:flex;justify-content:space-between;align-items:center;margin-bottom:32px}
.sec-hd h2{font-size:1.5rem;font-weight:800;letter-spacing:-.025em}
.see-all{font-size:.875rem;color:var(--text2);cursor:pointer;display:flex;align-items:center;gap:4px;transition:color .15s}
.see-all:hover{color:var(--text)}

/* CATEGORIES */
.cat-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}
.cat-card{border-radius:var(--radius);overflow:hidden;cursor:pointer;position:relative;aspect-ratio:3/4;display:flex;align-items:flex-end;transition:transform .2s}
.cat-card:hover{transform:translateY(-4px)}
.cat-card:hover .cat-img{transform:scale(1.05)}
.cat-img{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:5rem;transition:transform .4s ease;z-index:0}
.cat-card:nth-child(1) .cat-img{background:linear-gradient(135deg,#f5f0eb,#ede8e0)}
.cat-card:nth-child(2) .cat-img{background:linear-gradient(135deg,#dce8f5,#c8d8ec)}
.cat-card:nth-child(3) .cat-img{background:linear-gradient(135deg,#f5dce8,#ecced8)}
.cat-card:nth-child(4) .cat-img{background:linear-gradient(135deg,#dff0e8,#c8e8d5)}
.cat-label{position:relative;z-index:1;width:100%;background:linear-gradient(to top,rgba(0,0,0,.7),transparent);padding:28px 16px 16px;color:#fff}
.cat-label h3{font-size:1rem;font-weight:700;margin-bottom:2px}
.cat-label span{font-size:.8125rem;opacity:.75}

/* PRODUCTS */
.prod-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px}
.prod-card{background:var(--card);border-radius:var(--radius);overflow:hidden;cursor:pointer;transition:box-shadow .2s;position:relative}
.prod-card:hover{box-shadow:0 8px 32px rgba(0,0,0,.1)}
.prod-card:hover .prod-add{opacity:1;transform:translateY(0)}
.prod-img{height:240px;display:flex;align-items:center;justify-content:center;font-size:4.5rem;position:relative;overflow:hidden}
.prod-tag{position:absolute;top:10px;left:10px;background:#111;color:#fff;font-size:.6875rem;font-weight:700;padding:3px 8px;border-radius:4px;letter-spacing:.04em}
.prod-tag.sale{background:#ef4444}
.prod-tag.new{background:#059669}
.prod-wish{position:absolute;top:10px;right:10px;width:30px;height:30px;background:#fff;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:.875rem;box-shadow:0 2px 8px rgba(0,0,0,.1);cursor:pointer;transition:all .15s}
.prod-wish:hover{background:#fee2e2}
.prod-info{padding:14px 14px 0}
.prod-info h3{font-size:.9375rem;font-weight:600;margin-bottom:6px;color:var(--text)}
.prod-pricing{display:flex;align-items:center;gap:8px;margin-bottom:14px}
.prod-price{font-size:1rem;font-weight:800}
.prod-orig{font-size:.875rem;color:var(--text3);text-decoration:line-through}
.prod-add{background:#111;color:#fff;width:100%;padding:11px;font-size:.875rem;font-weight:600;cursor:pointer;transition:all .2s;opacity:0;transform:translateY(4px);border-radius:0 0 var(--radius) var(--radius)}
@media(max-width:1024px){.prod-add{opacity:1;transform:none}}
.prod-add:hover{background:#333}

/* BANNER */
.promo-banner{background:linear-gradient(135deg,#111 0%,#2a2a2a 100%);color:#fff;border-radius:var(--radius);padding:48px 40px;display:grid;grid-template-columns:1fr auto;align-items:center;gap:24px;overflow:hidden;position:relative}
.promo-banner::before{content:'SALE';position:absolute;right:-20px;top:50%;transform:translateY(-50%);font-size:8rem;font-weight:900;opacity:.07;letter-spacing:-.05em;pointer-events:none}
.pb-label{font-size:.8125rem;font-weight:700;text-transform:uppercase;letter-spacing:.15em;color:#d4af37;margin-bottom:10px}
.pb-title{font-size:clamp(1.5rem,3vw,2.5rem);font-weight:900;letter-spacing:-.03em;margin-bottom:8px}
.pb-sub{color:rgba(255,255,255,.55);font-size:.9375rem}
.pb-cta{background:#d4af37;color:#111;padding:14px 28px;border-radius:8px;font-weight:700;font-size:.9375rem;cursor:pointer;white-space:nowrap;transition:all .2s;flex-shrink:0}
.pb-cta:hover{background:#b8942a;transform:translateY(-1px)}

/* NEWSLETTER */
.newsletter{background:var(--card);border:1px solid var(--br);border-radius:var(--radius);padding:48px;text-align:center;max-width:620px;margin:0 auto}
.nl-icon{font-size:2rem;margin-bottom:16px}
.newsletter h3{font-size:1.375rem;font-weight:800;letter-spacing:-.025em;margin-bottom:8px}
.newsletter p{color:var(--text2);font-size:.9375rem;margin-bottom:24px;line-height:1.6}
.nl-row{display:flex;gap:8px;max-width:380px;margin:0 auto}
.nl-in{flex:1;padding:11px 15px;border:1px solid var(--br);border-radius:8px;font-size:.9375rem;outline:none;transition:border-color .2s}
.nl-in:focus{border-color:#111}
.nl-btn{background:#111;color:#fff;padding:11px 22px;border-radius:8px;font-weight:600;font-size:.9375rem;cursor:pointer;white-space:nowrap;transition:background .2s}
.nl-btn:hover{background:#333}

/* FOOTER */
footer{background:#111;color:#fff;padding:56px max(20px,calc((100vw - 1280px)/2)) 24px;margin-top:0}
.ft{display:grid;grid-template-columns:260px repeat(3,1fr);gap:40px;margin-bottom:40px}
.fb-logo{font-size:1.2rem;font-weight:900;letter-spacing:-.025em;margin-bottom:10px}
.fb p{font-size:.875rem;color:rgba(255,255,255,.4);line-height:1.65;max-width:200px}
.fc h4{font-size:.75rem;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:rgba(255,255,255,.3);margin-bottom:14px}
.fc a{display:block;font-size:.875rem;color:rgba(255,255,255,.5);margin-bottom:9px;cursor:pointer;transition:color .15s}
.fc a:hover{color:#fff}
.ft-bot{border-top:1px solid rgba(255,255,255,.08);padding-top:22px;display:flex;justify-content:space-between;align-items:center;font-size:.8125rem;color:rgba(255,255,255,.3);flex-wrap:wrap;gap:10px}

@media(max-width:1024px){.prod-grid{grid-template-columns:repeat(2,1fr)}.hero{grid-template-columns:1fr}.hero-right{min-height:340px}.cat-grid{grid-template-columns:repeat(2,1fr)}.ft{grid-template-columns:1fr 1fr}}
@media(max-width:640px){.prod-grid{grid-template-columns:repeat(2,1fr)}.promos{grid-template-columns:1fr}.n-cats{display:none}.promo-banner{grid-template-columns:1fr}.ft{grid-template-columns:1fr}}
</style>
</head>
<body>

<div class="announce">🎉 Spedizione gratuita su tutti gli ordini sopra <span>€99</span> — Solo per questa settimana</div>

<nav>
  <div class="n-logo">MAISON</div>
  <div class="n-cats">
    <a class="active">Donna</a><a>Uomo</a><a>Bambino</a><a>Accessori</a><a>Saldi</a>
  </div>
  <div class="n-right">
    <div class="n-ico">🔍</div>
    <div class="n-ico">♡</div>
    <div class="n-ico" onclick="this.textContent='🛒 (1)';setTimeout(()=>this.innerHTML='🛒<div class=\\'cart-badge\\'>1</div>',0)" style="position:relative">🛒<div class="cart-badge">0</div></div>
    <div class="n-ico">👤</div>
  </div>
</nav>

<div class="hero">
  <div class="hero-left">
    <div class="hero-sub">Nuova Collezione · Primavera 2025</div>
    <h1>Eleganza<br>senza<br><em>compromessi</em></h1>
    <p>Scopri i pezzi iconici della stagione. Tessuti selezionati, artigianato italiano, design senza tempo.</p>
    <div class="hero-btns">
      <button class="hb-p">Scopri la collezione</button>
      <button class="hb-s">Saldi fino al 40% →</button>
    </div>
  </div>
  <div class="hero-right">
    👟
    <div class="hero-label">
      <div class="hl-name">Sneaker Velocity Pro</div>
      <div><span class="hl-price">€119</span><span class="hl-orig">€159</span></div>
    </div>
  </div>
</div>

<div class="promos">
  ${[['🚚','Spedizione rapida','Consegna in 24-48h'],['↩️','30 giorni resi','Resi gratuiti e semplici'],['🔒','Pagamento sicuro','Stripe, PayPal, Apple Pay']].map(([ic,t,s])=>`<div class="promo-item"><div class="promo-ico">${ic}</div><div><div class="promo-text">${t}</div><div class="promo-sub">${s}</div></div></div>`).join('')}
</div>

<div class="section">
  <div class="sec-hd"><h2>Esplora le categorie</h2></div>
  <div class="cat-grid">
    ${[['👗','Abbigliamento Donna','324 prodotti'],['👔','Abbigliamento Uomo','218 prodotti'],['👠','Calzature','156 prodotti'],['👜','Accessori','89 prodotti']].map(([ic,t,s])=>`
    <div class="cat-card">
      <div class="cat-img">${ic}</div>
      <div class="cat-label"><h3>${t}</h3><span>${s}</span></div>
    </div>`).join('')}
  </div>
</div>

<div class="section" style="padding-top:0">
  <div class="sec-hd"><h2>🔥 I più venduti</h2><span class="see-all">Vedi tutti →</span></div>
  <div class="prod-grid">
    ${prods.map(p=>`
    <div class="prod-card">
      <div class="prod-img" style="background:${p.bg}">
        ${p.tag?`<div class="prod-tag${p.tag==='Saldo'?' sale':p.tag==='Novità'?' new':''}">${p.tag}</div>`:''}
        <div class="prod-wish">♡</div>
        ${p.emoji}
      </div>
      <div class="prod-info">
        <h3>${p.name}</h3>
        <div class="prod-pricing">
          <span class="prod-price">${p.price}</span>
          ${p.orig?`<span class="prod-orig">${p.orig}</span>`:''}
        </div>
      </div>
      <button class="prod-add" onclick="this.textContent='✓ Aggiunto al carrello';this.style.background='#059669'">+ Aggiungi al carrello</button>
    </div>`).join('')}
  </div>
</div>

<div class="section" style="padding-top:0">
  <div class="promo-banner">
    <div>
      <div class="pb-label">Offerta esclusiva</div>
      <div class="pb-title">Saldi di Stagione<br>fino al 40% di sconto</div>
      <div class="pb-sub">Selezionati centinaia di articoli. Solo fino al 30 giugno.</div>
    </div>
    <button class="pb-cta">Scopri i saldi →</button>
  </div>
</div>

<div class="section" style="padding-top:0">
  <div class="newsletter">
    <div class="nl-icon">📬</div>
    <h3>Iscriviti alla newsletter</h3>
    <p>Ricevi le ultime novità, offerte esclusive e i nostri editoriali di stile direttamente nella tua inbox.</p>
    <div class="nl-row">
      <input class="nl-in" placeholder="La tua email" type="email">
      <button class="nl-btn" onclick="this.textContent='✓ Iscritto!'">Iscriviti</button>
    </div>
  </div>
</div>

<footer>
  <div class="ft">
    <div class="fb">
      <div class="fb-logo">MAISON</div>
      <p>Moda italiana di qualità dal 1987. Artigianato, stile e sostenibilità.</p>
    </div>
    ${[['Informazioni',['Chi siamo','Sostenibilità','Stampa','Lavora con noi']],['Assistenza',['Guida alle taglie','Resi e cambi','Spedizioni','FAQ']],['Legale',['Privacy Policy','Termini di servizio','Cookie','Accessibilità']]].map(([col,links])=>`<div class="fc"><h4>${col}</h4>${(links as string[]).map(l=>`<a>${l}</a>`).join('')}</div>`).join('')}
  </div>
  <div class="ft-bot">
    <span>© 2025 Maison Italia S.r.l. — P.IVA 12345678901</span>
    <div style="display:flex;gap:12px;font-size:1rem">${['💳','🅿️','🍎','💰'].map(s=>`<span style="opacity:.5;cursor:pointer">${s}</span>`).join('')}</div>
  </div>
</footer>

</body>
</html>`;
}

function dashboardTemplate(prompt: string): string {
  const barData = [42,58,38,72,50,84,64,78,56,90,68,82];
  const months = ['Gen','Feb','Mar','Apr','Mag','Giu','Lug','Ago','Set','Ott','Nov','Dic'];
  const navItems = [
    {ico:'⊞',label:'Dashboard',active:true},
    {ico:'📈',label:'Analytics',active:false},
    {ico:'👥',label:'Clienti',active:false},
    {ico:'📦',label:'Prodotti',active:false},
    {ico:'💳',label:'Ordini',active:false},
    {ico:'📣',label:'Marketing',active:false},
  ];
  const orders = [
    {id:'#4821',name:'Marco Romano',email:'m.romano@gmail.com',plan:'Pro Annual',amount:'€348',status:'Completato',color:'#16a34a',bg:'#dcfce7'},
    {id:'#4820',name:'Sofia Bianchi',email:'s.bianchi@tech.it',plan:'Starter',amount:'€49',status:'In attesa',color:'#ca8a04',bg:'#fef9c3'},
    {id:'#4819',name:'Luca Ferrari',email:'l.ferrari@startup.io',plan:'Enterprise',amount:'€1.188',status:'Completato',color:'#16a34a',bg:'#dcfce7'},
    {id:'#4818',name:'Anna Russo',email:'a.russo@design.co',plan:'Pro Monthly',amount:'€29',status:'Fallito',color:'#dc2626',bg:'#fee2e2'},
    {id:'#4817',name:'Gioia Martini',email:'g.martini@agency.eu',plan:'Pro Annual',amount:'€348',status:'Completato',color:'#16a34a',bg:'#dcfce7'},
  ];
  return `<!DOCTYPE html>
<html lang="it">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escHtml(prompt.slice(0,50))}</title>
${gf}
<style>
${baseStyles}
:root{--bg:#0d1117;--bg2:#161b22;--bg3:#21262d;--br:#30363d;--br2:#484f58;--acc:#3b82f6;--acc2:#2563eb;--tx:#e6edf3;--tx2:#c9d1d9;--tx3:#8b949e;--tx4:#6e7681;--green:#22c55e;--amber:#f59e0b;--red:#ef4444;--purple:#a78bfa}
body{background:var(--bg);color:var(--tx2);display:flex;min-height:100vh;font-size:14px}

/* SIDEBAR */
.sb{width:240px;background:var(--bg2);border-right:1px solid var(--br);display:flex;flex-direction:column;flex-shrink:0;position:fixed;height:100vh;overflow-y:auto;z-index:50}
.sb-top{padding:20px 16px;border-bottom:1px solid var(--br)}
.sb-logo{display:flex;align-items:center;gap:10px;font-size:1rem;font-weight:700;color:var(--tx);margin-bottom:0}
.sb-logo-ico{width:32px;height:32px;background:var(--acc);border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:.875rem}
.sb-search{margin-top:14px;background:var(--bg3);border:1px solid var(--br);border-radius:7px;height:32px;display:flex;align-items:center;padding:0 10px;gap:7px;color:var(--tx4);font-size:.8125rem}
.sb-body{flex:1;padding:12px 8px;overflow-y:auto}
.sb-label{font-size:.6875rem;font-weight:600;text-transform:uppercase;letter-spacing:.1em;color:var(--tx4);padding:6px 10px 4px;margin-top:8px}
.sb-item{display:flex;align-items:center;gap:10px;padding:8px 12px;border-radius:7px;color:var(--tx3);cursor:pointer;transition:all .15s;margin-bottom:1px;font-size:.875rem}
.sb-item:hover{background:var(--bg3);color:var(--tx2)}
.sb-item.active{background:rgba(59,130,246,.15);color:var(--acc)}
.sb-item-ico{width:16px;text-align:center;font-size:.875rem;flex-shrink:0}
.sb-bot{padding:12px 8px;border-top:1px solid var(--br)}
.user-card{display:flex;align-items:center;gap:10px;padding:8px 10px;border-radius:8px;cursor:pointer;transition:background .15s}
.user-card:hover{background:var(--bg3)}
.user-av{width:32px;height:32px;border-radius:50%;background:linear-gradient(135deg,#6366f1,#8b5cf6);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:.8125rem;color:#fff;flex-shrink:0}
.user-name{font-size:.875rem;font-weight:600;color:var(--tx);line-height:1.2}
.user-role{font-size:.75rem;color:var(--tx4)}
.user-more{margin-left:auto;color:var(--tx4);font-size:.875rem}

/* MAIN */
.main{flex:1;margin-left:240px;display:flex;flex-direction:column;min-height:100vh;overflow:hidden}
.topbar{background:var(--bg2);border-bottom:1px solid var(--br);padding:0 24px;height:56px;display:flex;align-items:center;justify-content:space-between;flex-shrink:0;position:sticky;top:0;z-index:40}
.tb-left{display:flex;align-items:center;gap:8px;font-size:.875rem;color:var(--tx4)}
.tb-left strong{color:var(--tx2)}
.tb-right{display:flex;align-items:center;gap:8px}
.tb-btn{padding:6px 14px;border-radius:7px;font-size:.8125rem;font-weight:600;cursor:pointer;transition:all .15s;display:flex;align-items:center;gap:6px}
.tb-btn-prim{background:var(--acc);color:#fff;border:none}
.tb-btn-prim:hover{background:var(--acc2)}
.tb-btn-sec{background:var(--bg3);color:var(--tx2);border:1px solid var(--br)}
.tb-btn-sec:hover{background:rgba(255,255,255,.05);border-color:var(--br2)}
.tb-notif{width:32px;height:32px;border-radius:7px;background:var(--bg3);border:1px solid var(--br);display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:.875rem;position:relative;transition:background .15s}
.tb-notif:hover{background:rgba(255,255,255,.05)}
.notif-dot{position:absolute;top:7px;right:7px;width:7px;height:7px;background:var(--red);border-radius:50%;border:1.5px solid var(--bg2)}
.content{padding:24px;flex:1;overflow-y:auto}

/* PAGE HEADER */
.ph{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:24px;flex-wrap:wrap;gap:12px}
.ph-text h1{font-size:1.375rem;font-weight:700;color:var(--tx);margin-bottom:3px;letter-spacing:-.02em}
.ph-text p{font-size:.8125rem;color:var(--tx3)}
.ph-period{display:flex;background:var(--bg3);border:1px solid var(--br);border-radius:7px;overflow:hidden;font-size:.8125rem}
.ph-period button{padding:5px 12px;cursor:pointer;color:var(--tx3);transition:all .15s;border:none;background:none;font-family:inherit}
.ph-period button.a{background:var(--acc);color:#fff}

/* KPIs */
.kpis{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:20px}
.kpi{background:var(--bg2);border:1px solid var(--br);border-radius:10px;padding:18px 20px;position:relative;overflow:hidden;transition:border-color .2s}
.kpi:hover{border-color:var(--br2)}
.kpi::before{content:'';position:absolute;top:0;left:0;right:0;height:2px}
.kpi:nth-child(1)::before{background:var(--acc)}
.kpi:nth-child(2)::before{background:var(--green)}
.kpi:nth-child(3)::before{background:var(--purple)}
.kpi:nth-child(4)::before{background:var(--amber)}
.kpi-hd{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px}
.kpi-label{font-size:.75rem;font-weight:600;color:var(--tx4);text-transform:uppercase;letter-spacing:.06em}
.kpi-ico{width:28px;height:28px;border-radius:7px;display:flex;align-items:center;justify-content:center;font-size:.8125rem}
.kpi-val{font-size:1.625rem;font-weight:800;color:var(--tx);letter-spacing:-.03em;margin-bottom:5px}
.kpi-change{font-size:.75rem;display:flex;align-items:center;gap:4px;font-weight:500}
.kpi-change.up{color:var(--green)}.kpi-change.dn{color:var(--red)}.kpi-change.nt{color:var(--tx4)}

/* CHARTS ROW */
.charts-row{display:grid;grid-template-columns:1fr 320px;gap:14px;margin-bottom:20px}
.chart-box{background:var(--bg2);border:1px solid var(--br);border-radius:10px;padding:20px}
.cb-hd{display:flex;justify-content:space-between;align-items:center;margin-bottom:20px}
.cb-hd h3{font-size:.9375rem;font-weight:600;color:var(--tx);letter-spacing:-.01em}
.cb-meta{font-size:.75rem;color:var(--tx4)}
.bar-chart{display:flex;align-items:flex-end;gap:6px;height:160px;padding-bottom:24px;position:relative}
.bar-chart::before{content:'';position:absolute;bottom:24px;left:0;right:0;height:1px;background:var(--br)}
.bc-col{flex:1;display:flex;flex-direction:column;align-items:center;gap:5px;height:100%}
.bc-bar{width:100%;border-radius:4px 4px 0 0;transition:opacity .2s;position:relative;min-height:4px}
.bc-col:hover .bc-bar{opacity:.8}
.bc-lbl{font-size:9px;color:var(--tx4);white-space:nowrap}
.donut-wrap{display:flex;flex-direction:column;align-items:center}
.donut-ring{width:120px;height:120px;border-radius:50%;margin-bottom:20px;position:relative;box-shadow:inset 0 0 0 32px var(--bg2)}
.d-legend{width:100%;display:flex;flex-direction:column;gap:10px}
.d-li{display:flex;align-items:center;justify-content:space-between;font-size:.8125rem}
.d-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0;margin-right:8px}
.d-lbl{display:flex;align-items:center;color:var(--tx3);flex:1}
.d-val{font-weight:600;color:var(--tx2)}

/* TABLE */
.table-box{background:var(--bg2);border:1px solid var(--br);border-radius:10px;overflow:hidden;margin-bottom:20px}
.tb-hd2{padding:16px 20px;border-bottom:1px solid var(--br);display:flex;justify-content:space-between;align-items:center}
.tb-hd2 h3{font-size:.9375rem;font-weight:600;color:var(--tx);letter-spacing:-.01em}
.tb-search{background:var(--bg3);border:1px solid var(--br);border-radius:6px;height:28px;display:flex;align-items:center;padding:0 10px;gap:6px;color:var(--tx4);font-size:.75rem}
table{width:100%;border-collapse:collapse}
thead th{padding:10px 20px;text-align:left;font-size:.6875rem;font-weight:600;color:var(--tx4);text-transform:uppercase;letter-spacing:.07em;background:rgba(255,255,255,.015);border-bottom:1px solid var(--br);white-space:nowrap}
tbody td{padding:13px 20px;font-size:.875rem;border-bottom:1px solid rgba(48,54,61,.5)}
tbody tr:last-child td{border-bottom:none}
tbody tr:hover td{background:rgba(255,255,255,.025)}
.td-order{color:var(--tx4);font-family:monospace}
.td-user{display:flex;align-items:center;gap:10px}
.tu-av{width:30px;height:30px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:.75rem;flex-shrink:0}
.tu-name{font-weight:500;color:var(--tx);margin-bottom:1px;font-size:.875rem}
.tu-email{font-size:.75rem;color:var(--tx4)}
.stat-badge{display:inline-flex;align-items:center;gap:5px;padding:3px 9px;border-radius:5px;font-size:.75rem;font-weight:600}

/* BOTTOM ROW */
.bottom-row{display:grid;grid-template-columns:1fr 1fr;gap:14px}
.mini-box{background:var(--bg2);border:1px solid var(--br);border-radius:10px;padding:18px 20px}
.mini-box h3{font-size:.9375rem;font-weight:600;color:var(--tx);margin-bottom:16px;letter-spacing:-.01em}
.activity-item{display:flex;align-items:flex-start;gap:12px;padding:9px 0;border-bottom:1px solid rgba(48,54,61,.4)}
.activity-item:last-child{border-bottom:none}
.act-ico{width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:.75rem;flex-shrink:0;margin-top:1px}
.act-text{font-size:.8125rem;color:var(--tx3);line-height:1.5;flex:1}
.act-text strong{color:var(--tx2)}
.act-time{font-size:.75rem;color:var(--tx4);white-space:nowrap}

@media(max-width:1280px){.kpis{grid-template-columns:repeat(2,1fr)}.charts-row{grid-template-columns:1fr}}
@media(max-width:768px){.sb{display:none}.main{margin-left:0}.kpis{grid-template-columns:repeat(2,1fr)}.bottom-row{grid-template-columns:1fr}}
</style>
</head>
<body>

<aside class="sb">
  <div class="sb-top">
    <div class="sb-logo"><div class="sb-logo-ico">📊</div>${escHtml(prompt.split(' ').slice(0,2).join(' ').slice(0,12)) || 'Analytics'}</div>
    <div class="sb-search">🔍 <span>Cerca...</span></div>
  </div>
  <div class="sb-body">
    <div class="sb-label">Principale</div>
    ${navItems.map(i=>`<div class="sb-item${i.active?' active':''}"><span class="sb-item-ico">${i.ico}</span>${i.label}</div>`).join('')}
    <div class="sb-label" style="margin-top:12px">Report</div>
    ${[{ico:'📋',label:'Fatturazione'},{ico:'📁',label:'Esportazioni'},{ico:'🔔',label:'Notifiche',badge:3}].map(i=>`<div class="sb-item"><span class="sb-item-ico">${i.ico}</span>${i.label}${('badge' in i)?`<span style="margin-left:auto;background:var(--acc);color:#fff;border-radius:9999px;padding:1px 7px;font-size:10px;font-weight:700">${i.badge}</span>`:''}</div>`).join('')}
    <div class="sb-label" style="margin-top:12px">Altro</div>
    ${[{ico:'⚙️',label:'Impostazioni'},{ico:'🛟',label:'Supporto'}].map(i=>`<div class="sb-item"><span class="sb-item-ico">${i.ico}</span>${i.label}</div>`).join('')}
  </div>
  <div class="sb-bot">
    <div class="user-card">
      <div class="user-av">TF</div>
      <div><div class="user-name">Timmy Francesco</div><div class="user-role">Admin</div></div>
      <div class="user-more">⋯</div>
    </div>
  </div>
</aside>

<div class="main">
  <div class="topbar">
    <div class="tb-left">🏠 <span>Home</span> / <strong>Dashboard</strong></div>
    <div class="tb-right">
      <div class="tb-notif">🔔<div class="notif-dot"></div></div>
      <button class="tb-btn tb-btn-sec">📅 Ultimi 30 giorni</button>
      <button class="tb-btn tb-btn-prim">+ Nuovo Report</button>
    </div>
  </div>
  <div class="content">
    <div class="ph">
      <div class="ph-text"><h1>Panoramica Dashboard</h1><p>Aggiornato oggi alle ${new Date().getHours()}:${String(new Date().getMinutes()).padStart(2,'0')} · Giugno 2025</p></div>
      <div class="ph-period">
        <button>7g</button><button>14g</button><button class="a">30g</button><button>90g</button><button>1a</button>
      </div>
    </div>

    <div class="kpis">
      ${[
        {label:'Ricavi Totali',val:'€48.240',change:'+12.5%',dir:'up',note:'vs mese scorso',ico:'💰',ibg:'rgba(59,130,246,.15)'},
        {label:'Utenti Attivi',val:'2.840',change:'+8.1%',dir:'up',note:'nuovi: +234',ico:'👥',ibg:'rgba(34,197,94,.15)'},
        {label:'Tasso Conversione',val:'3.24%',change:'+0.4pp',dir:'up',note:'benchmark: 2.8%',ico:'🎯',ibg:'rgba(167,139,250,.15)'},
        {label:'Ticket Aperti',val:'17',change:'-4',dir:'nt',note:'risolti oggi: 23',ico:'🎫',ibg:'rgba(245,158,11,.15)'},
      ].map(k=>`
      <div class="kpi">
        <div class="kpi-hd">
          <div class="kpi-label">${k.label}</div>
          <div class="kpi-ico" style="background:${k.ibg}">${k.ico}</div>
        </div>
        <div class="kpi-val">${k.val}</div>
        <div class="kpi-change ${k.dir}">${k.dir==='up'?'↑':k.dir==='dn'?'↓':'—'} ${k.change} <span style="color:var(--tx4);font-weight:400">${k.note}</span></div>
      </div>`).join('')}
    </div>

    <div class="charts-row">
      <div class="chart-box">
        <div class="cb-hd"><h3>Ricavi mensili 2025</h3><span class="cb-meta">Aggiornato in tempo reale</span></div>
        <div class="bar-chart">
          ${barData.map((h,i)=>`<div class="bc-col"><div class="bc-bar" style="height:${h}%;background:${i===11?'var(--acc)':'rgba(59,130,246,.35)'};border:${i===11?'none':'none'}"></div><span class="bc-lbl">${months[i]}</span></div>`).join('')}
        </div>
      </div>
      <div class="chart-box">
        <div class="cb-hd"><h3>Fonti di traffico</h3></div>
        <div class="donut-wrap">
          <div class="donut-ring" style="background:conic-gradient(#3b82f6 0% 38%,#a78bfa 38% 58%,#22c55e 58% 74%,#f59e0b 74% 100%)"></div>
          <div class="d-legend">
            ${[['#3b82f6','Organico','38%'],['#a78bfa','Direct','20%'],['#22c55e','Social','16%'],['#f59e0b','Referral','26%']].map(([c,l,v])=>`<div class="d-li"><div class="d-lbl"><div class="d-dot" style="background:${c}"></div>${l}</div><div class="d-val">${v}</div></div>`).join('')}
          </div>
        </div>
      </div>
    </div>

    <div class="table-box">
      <div class="tb-hd2">
        <h3>Transazioni recenti</h3>
        <div style="display:flex;gap:8px;align-items:center">
          <div class="tb-search">🔍 Cerca transazioni...</div>
          <button class="tb-btn tb-btn-sec" style="padding:4px 10px;font-size:.75rem">Esporta CSV</button>
        </div>
      </div>
      <table>
        <thead><tr><th>ID</th><th>Cliente</th><th>Piano</th><th>Importo</th><th>Stato</th><th>Data</th></tr></thead>
        <tbody>
          ${orders.map(o=>`
          <tr>
            <td class="td-order">${o.id}</td>
            <td><div class="td-user"><div class="tu-av" style="background:${o.color}22;color:${o.color}">${o.name[0]}</div><div><div class="tu-name">${o.name}</div><div class="tu-email">${o.email}</div></div></div></td>
            <td style="color:var(--tx3)">${o.plan}</td>
            <td style="font-weight:700;color:var(--tx)">${o.amount}</td>
            <td><span class="stat-badge" style="background:${o.bg};color:${o.color}">● ${o.status}</span></td>
            <td style="color:var(--tx4)">${new Date(Date.now()-Math.random()*7*86400000).toLocaleDateString('it-IT')}</td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>

    <div class="bottom-row">
      <div class="mini-box">
        <h3>Attività recente</h3>
        ${[['#059669','rgba(5,150,105,.15)','Marco Romano ha sottoscritto il piano Pro Annual','2 min fa'],['#3b82f6','rgba(59,130,246,.15)','Nuovo bug report aperto: #BG-924','15 min fa'],['#f59e0b','rgba(245,158,11,.15)','Deploy completato su produzione v2.4.1','1 ora fa'],['#a78bfa','rgba(167,139,250,.15)','Sofia Bianchi ha aggiornato il profilo','3 ore fa'],['#ef4444','rgba(239,68,68,.15)','Pagamento fallito: Anna Russo — riprovare','5 ore fa']].map(([c,bg,txt,t])=>`
        <div class="activity-item">
          <div class="act-ico" style="background:${bg};color:${c}">●</div>
          <div class="act-text">${txt}</div>
          <div class="act-time">${t}</div>
        </div>`).join('')}
      </div>
      <div class="mini-box">
        <h3>Top Prodotti</h3>
        ${[['Pro Annual','€348/a','342 vendite',88],['Enterprise','€99/m','67 vendite',54],['Pro Monthly','€29/m','891 vendite',100],['Starter','Gratis','1.240 utenti',72]].map(([n,p,s,pct])=>`
        <div style="margin-bottom:14px">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:5px">
            <span style="font-size:.875rem;font-weight:500;color:var(--tx2)">${n}</span>
            <span style="font-size:.75rem;color:var(--tx4)">${s}</span>
          </div>
          <div style="background:var(--bg3);border-radius:9999px;height:5px;overflow:hidden">
            <div style="width:${pct}%;height:100%;background:var(--acc);border-radius:9999px;transition:width .5s"></div>
          </div>
          <div style="font-size:.75rem;color:var(--tx4);margin-top:3px">${p}</div>
        </div>`).join('')}
      </div>
    </div>
  </div>
</div>

<script>
document.querySelectorAll('.ph-period button').forEach(function(b){
  b.addEventListener('click',function(){
    document.querySelectorAll('.ph-period button').forEach(function(x){x.classList.remove('a')});
    b.classList.add('a');
  });
});
document.querySelectorAll('.sb-item').forEach(function(i){
  i.addEventListener('click',function(){
    document.querySelectorAll('.sb-item').forEach(function(x){x.classList.remove('active')});
    i.classList.add('active');
  });
});
</script>
</body>
</html>`;
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
  const title = escHtml(prompt.slice(0, 55));
  const brand = prompt.split(' ').filter(w => w.length > 2).slice(0, 2).map(w => w[0].toUpperCase() + w.slice(1)).join('') || 'Nexus';
  return `<!DOCTYPE html>
<html lang="it">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title}</title>
${gf}
<style>
${baseStyles}
:root{--bg:#09090b;--bg2:#111113;--bg3:#18181b;--br:rgba(255,255,255,.07);--br2:rgba(255,255,255,.13);--acc:#7c3aed;--acc2:#6d28d9;--glow:rgba(124,58,237,.22);--tx:#fafafa;--tx2:#e4e4e7;--tx3:#a1a1aa;--tx4:#71717a;--tx5:#52525b;--green:#22c55e;--blue:#3b82f6}
body{background:var(--bg);color:var(--tx2);overflow-x:hidden}

/* NAV */
nav{position:fixed;top:0;left:0;right:0;z-index:200;height:64px;border-bottom:1px solid var(--br);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);background:rgba(9,9,11,.82);display:flex;align-items:center;justify-content:space-between;padding:0 max(20px,calc((100vw - 1180px)/2))}
.n-logo{font-size:1.1rem;font-weight:800;color:var(--tx);display:flex;align-items:center;gap:9px;letter-spacing:-.02em}
.n-icon{width:30px;height:30px;background:var(--acc);border-radius:7px;display:flex;align-items:center;justify-content:center;font-size:.8rem;flex-shrink:0}
.n-links{display:flex;gap:2px}
.n-links a{padding:6px 13px;border-radius:7px;color:var(--tx4);font-size:.875rem;cursor:pointer;transition:all .15s}
.n-links a:hover{color:var(--tx2);background:rgba(255,255,255,.05)}
.n-right{display:flex;gap:8px;align-items:center}
.n-login{font-size:.875rem;color:var(--tx4);padding:7px 15px;border-radius:7px;cursor:pointer;transition:all .15s}
.n-login:hover{color:var(--tx2);background:rgba(255,255,255,.05)}
.n-cta{background:var(--tx);color:var(--bg);padding:8px 18px;border-radius:8px;font-size:.875rem;font-weight:600;cursor:pointer;transition:all .15s}
.n-cta:hover{background:#e4e4e7;transform:translateY(-1px)}

/* HERO */
.hero{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:100px 24px 70px;position:relative;overflow:hidden}
.h-bg{position:absolute;inset:0;pointer-events:none;overflow:hidden}
.h-g1{position:absolute;top:15%;left:50%;transform:translate(-50%,-50%);width:900px;height:700px;background:radial-gradient(ellipse,rgba(124,58,237,.17) 0%,transparent 65%);filter:blur(50px)}
.h-g2{position:absolute;bottom:5%;left:15%;width:500px;height:500px;background:radial-gradient(ellipse,rgba(59,130,246,.1) 0%,transparent 70%);filter:blur(60px)}
.h-grid{position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,.018) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.018) 1px,transparent 1px);background-size:64px 64px;mask-image:radial-gradient(ellipse 80% 60% at 50% 0%,black 30%,transparent 80%)}
.h-badge{display:inline-flex;align-items:center;gap:8px;background:rgba(124,58,237,.1);border:1px solid rgba(124,58,237,.22);color:#c4b5fd;padding:7px 16px;border-radius:9999px;font-size:.8125rem;font-weight:500;margin-bottom:28px;position:relative;z-index:1}
.h-dot{width:6px;height:6px;background:var(--green);border-radius:50%;animation:pdot 2s infinite}
@keyframes pdot{0%,100%{opacity:1}50%{opacity:.4}}
.hero h1{font-size:clamp(2.8rem,7vw,5.5rem);font-weight:900;line-height:1.05;letter-spacing:-.04em;max-width:860px;margin-bottom:22px;position:relative;z-index:1}
.gtxt{background:linear-gradient(135deg,#c4b5fd 0%,#818cf8 50%,#38bdf8 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.hero p{font-size:clamp(1rem,2vw,1.2rem);color:var(--tx3);max-width:540px;margin:0 auto 40px;line-height:1.75;position:relative;z-index:1}
.h-acts{display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin-bottom:48px;position:relative;z-index:1}
.btn-p{background:var(--acc);color:#fff;padding:14px 30px;border-radius:10px;font-size:1rem;font-weight:600;cursor:pointer;transition:all .2s;display:inline-flex;align-items:center;gap:8px}
.btn-p:hover{background:var(--acc2);transform:translateY(-2px);box-shadow:0 10px 32px var(--glow)}
.btn-g{background:rgba(255,255,255,.06);color:var(--tx2);border:1px solid var(--br2);padding:14px 28px;border-radius:10px;font-size:1rem;font-weight:500;cursor:pointer;transition:all .2s;display:inline-flex;align-items:center;gap:8px}
.btn-g:hover{background:rgba(255,255,255,.1);transform:translateY(-2px)}
.h-proof{display:flex;align-items:center;justify-content:center;gap:10px;color:var(--tx4);font-size:.875rem;position:relative;z-index:1}
.pavs{display:flex}
.pav{width:28px;height:28px;border-radius:50%;border:2px solid var(--bg);margin-left:-7px;font-size:10px;display:flex;align-items:center;justify-content:center;font-weight:700}

/* PREVIEW MOCKUP */
.mockup{margin-top:64px;position:relative;max-width:820px;width:100%;z-index:1}
.mock-bar{background:var(--bg3);border:1px solid var(--br);border-bottom:none;border-radius:12px 12px 0 0;height:38px;display:flex;align-items:center;padding:0 14px;gap:7px}
.d-r{width:10px;height:10px;border-radius:50%;background:#ef4444}.d-y{width:10px;height:10px;border-radius:50%;background:#f59e0b}.d-g{width:10px;height:10px;border-radius:50%;background:#22c55e}
.mock-url{flex:1;background:rgba(255,255,255,.05);border-radius:5px;height:20px;display:flex;align-items:center;justify-content:center;font-size:10px;color:var(--tx5);margin:0 12px}
.mock-body{background:var(--bg2);border:1px solid var(--br);border-radius:0 0 12px 12px;height:280px;display:grid;grid-template-columns:200px 1fr;overflow:hidden}
.mock-sb{background:rgba(255,255,255,.018);border-right:1px solid var(--br);padding:14px;display:flex;flex-direction:column;gap:3px}
.msb-i{padding:7px 9px;border-radius:6px;font-size:11px;color:var(--tx5);display:flex;align-items:center;gap:7px}
.msb-i.a{background:rgba(124,58,237,.12);color:#c4b5fd}
.mock-main{padding:18px;overflow:hidden}
.mm-kpis{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:12px}
.mm-kpi{background:rgba(255,255,255,.04);border:1px solid var(--br);border-radius:7px;padding:10px}
.mm-kv{font-size:1.1rem;font-weight:700;color:var(--tx);margin-bottom:1px}
.mm-kl{font-size:9px;color:var(--tx5)}
.mm-chart{background:rgba(255,255,255,.04);border:1px solid var(--br);border-radius:7px;height:110px;display:flex;align-items:flex-end;padding:10px 10px 6px;gap:5px}
.mm-b{flex:1;border-radius:3px 3px 0 0;min-height:4px}

/* TRUSTED */
.trusted{border-top:1px solid var(--br);border-bottom:1px solid var(--br);padding:30px 24px}
.trusted-inner{max-width:1000px;margin:0 auto;display:flex;align-items:center;gap:16px;flex-wrap:wrap;justify-content:center}
.t-label{font-size:.8125rem;color:var(--tx5);white-space:nowrap;margin-right:8px}
.clogo{font-size:.9rem;font-weight:700;color:var(--tx5);padding:7px 18px;border-radius:7px;cursor:pointer;transition:color .2s;letter-spacing:-.01em}
.clogo:hover{color:var(--tx3)}

/* SECTIONS */
.sec{max-width:1180px;margin:0 auto;padding:96px 24px}
.s-eyebrow{font-size:.75rem;font-weight:700;text-transform:uppercase;letter-spacing:.14em;color:var(--acc);margin-bottom:10px;display:flex;align-items:center;gap:8px}
.s-eyebrow::before{content:'';width:18px;height:2px;background:var(--acc);border-radius:1px}
h2.sh{font-size:clamp(1.8rem,4vw,3rem);font-weight:800;letter-spacing:-.035em;line-height:1.12;margin-bottom:14px}
p.sd{font-size:1.05rem;color:var(--tx3);max-width:520px;line-height:1.7}

/* FEATURES */
.f-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-top:52px}
.f-card{background:var(--bg2);border:1px solid var(--br);border-radius:18px;padding:26px;transition:all .25s;cursor:default}
.f-card:hover{border-color:rgba(124,58,237,.3);background:rgba(124,58,237,.04);transform:translateY(-4px);box-shadow:0 16px 48px rgba(0,0,0,.25)}
.f-ico{width:46px;height:46px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:1.2rem;margin-bottom:18px}
.f-card h3{font-size:1rem;font-weight:700;margin-bottom:7px;color:var(--tx)}
.f-card p{font-size:.875rem;color:var(--tx4);line-height:1.65}

/* METRICS */
.m-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:1px;background:var(--br);border:1px solid var(--br);border-radius:18px;overflow:hidden;margin-top:52px}
.m-card{background:var(--bg2);padding:32px 20px;text-align:center}
.m-num{font-size:2.25rem;font-weight:900;letter-spacing:-.04em;margin-bottom:5px;background:linear-gradient(135deg,#c4b5fd,#60a5fa);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.m-lbl{font-size:.875rem;color:var(--tx4);font-weight:500}

/* STEPS */
.steps{display:grid;grid-template-columns:repeat(3,1fr);gap:28px;margin-top:52px;position:relative}
.steps::before{content:'';position:absolute;top:26px;left:calc(16.7%);right:calc(16.7%);height:1px;background:linear-gradient(90deg,rgba(124,58,237,.4),rgba(59,130,246,.4));z-index:0}
.step{text-align:center;position:relative;z-index:1}
.step-n{width:52px;height:52px;border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 18px;font-size:1rem;font-weight:800;position:relative}
.step:nth-child(1) .step-n{background:rgba(124,58,237,.12);border:2px solid rgba(124,58,237,.4);color:#c4b5fd}
.step:nth-child(2) .step-n{background:rgba(59,130,246,.12);border:2px solid rgba(59,130,246,.4);color:#93c5fd}
.step:nth-child(3) .step-n{background:rgba(34,197,94,.12);border:2px solid rgba(34,197,94,.4);color:#86efac}
.step h3{font-size:1.025rem;font-weight:700;margin-bottom:7px;color:var(--tx)}
.step p{font-size:.875rem;color:var(--tx4);line-height:1.65}

/* TESTIMONIALS */
.t-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-top:52px}
.t-card{background:var(--bg2);border:1px solid var(--br);border-radius:18px;padding:26px;transition:all .2s}
.t-card:hover{border-color:var(--br2);transform:translateY(-3px)}
.t-stars{color:#f59e0b;font-size:.9375rem;margin-bottom:14px;letter-spacing:2px}
.t-text{font-size:.9375rem;color:var(--tx2);line-height:1.7;margin-bottom:18px;font-style:italic}
.t-auth{display:flex;align-items:center;gap:10px}
.t-av{width:38px;height:38px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:.875rem;flex-shrink:0}
.t-name{font-size:.9375rem;font-weight:600;color:var(--tx);margin-bottom:1px}
.t-role{font-size:.8125rem;color:var(--tx4)}

/* PRICING */
.p-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-top:52px}
.p-card{background:var(--bg2);border:1px solid var(--br);border-radius:18px;padding:30px;position:relative;transition:all .2s}
.p-card.feat{border-color:var(--acc);background:rgba(124,58,237,.06);transform:scale(1.03)}
.p-badge{position:absolute;top:-11px;left:50%;transform:translateX(-50%);background:var(--acc);color:#fff;font-size:.75rem;font-weight:700;padding:3px 13px;border-radius:9999px;white-space:nowrap}
.p-tier{font-size:.75rem;font-weight:700;text-transform:uppercase;letter-spacing:.12em;color:var(--tx4);margin-bottom:10px}
.p-price{font-size:2.75rem;font-weight:900;letter-spacing:-.04em;color:var(--tx);margin-bottom:3px}
.p-price sub{font-size:.9375rem;font-weight:400;color:var(--tx4);vertical-align:baseline}
.p-desc{font-size:.875rem;color:var(--tx4);padding-bottom:20px;margin-bottom:20px;border-bottom:1px solid var(--br)}
.p-feats{display:flex;flex-direction:column;gap:9px;margin-bottom:24px}
.p-feat{display:flex;align-items:center;gap:9px;font-size:.875rem;color:var(--tx3)}
.p-feat::before{content:'✓';color:var(--green);font-weight:700;font-size:.8125rem;flex-shrink:0}
.pb{width:100%;padding:12px;border-radius:9px;font-weight:600;font-size:.9375rem;cursor:pointer;transition:all .2s}
.pb-def{background:rgba(255,255,255,.06);color:var(--tx2);border:1px solid var(--br)}.pb-def:hover{background:rgba(255,255,255,.1)}
.pb-feat{background:var(--acc);color:#fff;border:none}.pb-feat:hover{background:var(--acc2);transform:translateY(-1px)}

/* FAQ */
.faq{max-width:700px;margin:52px auto 0;display:flex;flex-direction:column;gap:8px}
.fi{background:var(--bg2);border:1px solid var(--br);border-radius:12px}
.fq{padding:18px 22px;display:flex;justify-content:space-between;align-items:center;cursor:pointer;font-weight:600;font-size:.9375rem;color:var(--tx);gap:14px;transition:color .15s}
.fq:hover{color:#c4b5fd}
.fi-ico{width:20px;height:20px;border-radius:50%;background:rgba(255,255,255,.06);display:flex;align-items:center;justify-content:center;font-size:.75rem;flex-shrink:0;transition:transform .25s,background .15s}
.fi.open .fi-ico{transform:rotate(45deg);background:rgba(124,58,237,.2)}
.fa{max-height:0;overflow:hidden;transition:max-height .35s ease,padding .25s;font-size:.875rem;color:var(--tx4);line-height:1.75;padding:0 22px}
.fi.open .fa{max-height:180px;padding-bottom:18px}

/* CTA */
.cta-wrap{max-width:1180px;margin:0 auto;padding:0 24px 80px}
.cta-box{border-radius:24px;background:linear-gradient(135deg,rgba(124,58,237,.22) 0%,rgba(59,130,246,.15) 60%,rgba(16,185,129,.1) 100%);border:1px solid rgba(124,58,237,.22);padding:68px 40px;text-align:center;position:relative;overflow:hidden}
.cta-box::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse at 50% 0%,rgba(124,58,237,.12),transparent 70%);pointer-events:none}
.cta-box h2{font-size:clamp(1.75rem,4vw,2.75rem);font-weight:800;letter-spacing:-.03em;margin-bottom:14px;position:relative}
.cta-box p{color:var(--tx3);font-size:1.05rem;margin-bottom:34px;max-width:460px;margin-left:auto;margin-right:auto;position:relative}
.cta-row{display:flex;gap:8px;max-width:420px;margin:0 auto;flex-wrap:wrap;justify-content:center;position:relative}
.cta-in{flex:1;min-width:180px;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.14);color:var(--tx);padding:12px 16px;border-radius:9px;font-size:.9375rem;outline:none;transition:border-color .2s}
.cta-in:focus{border-color:var(--acc)}
.cta-in::placeholder{color:var(--tx5)}
.cta-sb{background:var(--tx);color:var(--bg);padding:12px 22px;border-radius:9px;font-weight:700;font-size:.9375rem;cursor:pointer;white-space:nowrap;transition:all .2s}
.cta-sb:hover{background:#e4e4e7}

/* FOOTER */
footer{border-top:1px solid var(--br);padding:56px max(20px,calc((100vw - 1180px)/2)) 28px;margin-top:0}
.ft{display:grid;grid-template-columns:220px repeat(3,1fr);gap:36px;margin-bottom:44px}
.fb p{font-size:.875rem;color:var(--tx4);margin-top:10px;line-height:1.65;max-width:190px}
.fc h4{font-size:.75rem;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:var(--tx3);margin-bottom:14px}
.fc a{display:block;font-size:.875rem;color:var(--tx4);margin-bottom:9px;cursor:pointer;transition:color .15s}
.fc a:hover{color:var(--tx2)}
.fb-bot{border-top:1px solid var(--br);padding-top:22px;display:flex;justify-content:space-between;align-items:center;font-size:.8125rem;color:var(--tx5);flex-wrap:wrap;gap:10px}
.socials{display:flex;gap:10px}
.sl{width:30px;height:30px;border-radius:7px;background:rgba(255,255,255,.05);border:1px solid var(--br);display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all .15s;font-size:.8125rem}
.sl:hover{background:rgba(255,255,255,.1);border-color:var(--br2)}

@media(max-width:1024px){.f-grid{grid-template-columns:repeat(2,1fr)}.m-grid{grid-template-columns:repeat(2,1fr)}.p-grid{grid-template-columns:1fr}.p-card.feat{transform:none}.ft{grid-template-columns:1fr 1fr}}
@media(max-width:768px){.n-links,.n-login{display:none}.hero h1{font-size:2.5rem}.mockup{display:none}.t-grid{grid-template-columns:1fr}.steps{grid-template-columns:1fr}.steps::before{display:none}.ft{grid-template-columns:1fr}.f-grid{grid-template-columns:1fr}.sec{padding:60px 18px}}
@keyframes fup{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
.h-badge{animation:fup .6s ease both}.hero h1{animation:fup .7s .1s ease both}.hero p{animation:fup .7s .2s ease both}.h-acts{animation:fup .7s .3s ease both}
</style>
</head>
<body>
<nav>
  <div class="n-logo"><div class="n-icon">⚡</div>${escHtml(brand)}</div>
  <div class="n-links"><a>Prodotto</a><a>Soluzioni</a><a>Prezzi</a><a>Docs</a><a>Blog</a></div>
  <div class="n-right">
    <button class="n-login">Accedi</button>
    <button class="n-cta" onclick="document.querySelector('.cta-box').scrollIntoView({behavior:'smooth'})">Inizia gratis</button>
  </div>
</nav>

<section class="hero">
  <div class="h-bg"><div class="h-g1"></div><div class="h-g2"></div><div class="h-grid"></div></div>
  <div class="h-badge"><div class="h-dot"></div> Nuovo — Versione 2.0 disponibile ora</div>
  <h1>${title}<br><span class="gtxt">in pochi minuti</span></h1>
  <p>La piattaforma più avanzata per trasformare le tue idee in prodotti digitali reali. Zero configurazione, qualità professionale garantita.</p>
  <div class="h-acts">
    <button class="btn-p" onclick="document.querySelector('.cta-box').scrollIntoView({behavior:'smooth'})">Inizia gratis — nessuna carta →</button>
    <button class="btn-g">▶ Guarda la demo (2 min)</button>
  </div>
  <div class="h-proof">
    <div class="pavs">${['#7c3aed','#2563eb','#059669','#d97706','#db2777'].map((c,i)=>`<div class="pav" style="background:${c}">${['M','S','L','A','G'][i]}</div>`).join('')}</div>
    <span>Usato da <strong style="color:var(--tx2)">+4.200 team</strong> in tutto il mondo</span>
  </div>
  <div class="mockup">
    <div class="mock-bar"><div class="d-r"></div><div class="d-y"></div><div class="d-g"></div><div class="mock-url">${escHtml(brand.toLowerCase())}.app/dashboard</div></div>
    <div class="mock-body">
      <div class="mock-sb">${[['🏠','Dashboard',true],['📈','Analytics',false],['👥','Utenti',false],['📦','Prodotti',false],['⚙️','Impost.',false]].map(([ic,lb,ac])=>`<div class="msb-i${ac?' a':''}">${ic} ${lb}</div>`).join('')}</div>
      <div class="mock-main">
        <div class="mm-kpis">${[['€48.2K','Ricavi'],['2.840','Utenti'],['94%','Sodd.']].map(([v,l])=>`<div class="mm-kpi"><div class="mm-kv">${v}</div><div class="mm-kl">${l}</div></div>`).join('')}</div>
        <div class="mm-chart">${[38,62,44,78,54,88,68,82,73,90].map((h,i)=>`<div class="mm-b" style="height:${h}%;background:linear-gradient(to top,#7c3aed${i===9?'':'99'},#818cf866)"></div>`).join('')}</div>
      </div>
    </div>
  </div>
</section>

<div class="trusted">
  <div class="trusted-inner">
    <span class="t-label">Fidato da team di:</span>
    ${['Telecom Italia','Generali','UniCredit','Enel','Pirelli','Ferrero','Luxottica'].map(n=>`<span class="clogo">${n}</span>`).join('')}
  </div>
</div>

<div class="sec">
  <div style="display:flex;justify-content:space-between;align-items:flex-end;flex-wrap:wrap;gap:16px">
    <div><div class="s-eyebrow">Funzionalità</div><h2 class="sh">Tutto ciò che ti serve<br>per crescere più veloce</h2></div>
    <p class="sd">Ogni funzionalità è pensata per farti risparmiare ore e consegnare prodotti migliori.</p>
  </div>
  <div class="f-grid">
    ${[['⚡','Performance al massimo','Build istantanee. TTFB &lt;100ms, Lighthouse score 99+.','rgba(245,158,11,.13)'],['🔒','Sicurezza enterprise','SOC 2 Type II, GDPR, crittografia end-to-end.','rgba(239,68,68,.13)'],['🌐','Deploy globale istantaneo','CDN con 200+ edge location in tutto il mondo.','rgba(59,130,246,.13)'],['🎨','Design system completo','Componenti UI, dark mode e tema personalizzabile.','rgba(168,85,247,.13)'],['📊','Analytics real-time','Funnel, heatmap, sessioni e metriche personalizzate.','rgba(16,185,129,.13)'],['🔗','600+ integrazioni','Slack, Stripe, Notion, GitHub e molto altro.','rgba(236,72,153,.13)']].map(([ic,t,d,bg])=>`
    <div class="f-card"><div class="f-ico" style="background:${bg}">${ic}</div><h3>${t}</h3><p>${d}</p></div>`).join('')}
  </div>
</div>

<div style="background:var(--bg2);border-top:1px solid var(--br);border-bottom:1px solid var(--br)">
  <div class="sec" style="padding-top:60px;padding-bottom:60px">
    <div style="text-align:center"><div class="s-eyebrow" style="justify-content:center">Numeri reali</div><h2 class="sh" style="margin-bottom:0">I risultati parlano chiaro</h2></div>
    <div class="m-grid">${[['99.9%','Uptime garantito da SLA'],['4.200+','Team attivi ogni giorno'],['2.1M+','Richieste gestite al giorno'],['138ms','Latenza media globale']].map(([n,l])=>`<div class="m-card"><div class="m-num">${n}</div><div class="m-lbl">${l}</div></div>`).join('')}</div>
  </div>
</div>

<div class="sec">
  <div style="text-align:center;max-width:540px;margin:0 auto"><div class="s-eyebrow" style="justify-content:center">Come funziona</div><h2 class="sh">Attivo in 3 semplici passi</h2><p class="sd" style="margin:0 auto">Da zero a produzione in meno di 5 minuti, senza installazioni.</p></div>
  <div class="steps">${[['01','Crea il tuo account','Registrati in 30 secondi. Nessuna carta di credito, accesso immediato a tutte le funzionalità.'],['02','Configura il progetto','Scegli template, personalizza impostazioni e collega i tuoi strumenti in pochi click.'],['03','Pubblica e scala','Deploy con un click. Monitora in real-time e scala automaticamente col traffico.']].map(([n,t,d])=>`<div class="step"><div class="step-n">${n}</div><h3>${t}</h3><p>${d}</p></div>`).join('')}</div>
</div>

<div style="background:var(--bg2);border-top:1px solid var(--br);border-bottom:1px solid var(--br)">
  <div class="sec">
    <div style="text-align:center;max-width:540px;margin:0 auto"><div class="s-eyebrow" style="justify-content:center">Testimonianze</div><h2 class="sh">I nostri clienti ci adorano</h2></div>
    <div class="t-grid">${[['★★★★★','"Abbiamo ridotto i tempi di sviluppo del 70%. Il ROI è stato visibile già nel primo mese."','Marco Rossi','CTO @ TechVenture','#7c3aed'],['★★★★★','"Finalmente un prodotto che mantiene le promesse. Il supporto è eccezionale e sempre disponibile."','Sofia Bianchi','Lead Dev @ Innovacode','#2563eb'],['★★★★★','"Da quando lo usiamo il team ha triplicato la velocità di delivery. Semplicemente incredibile."','Luca Ferrari','VP Engineering @ ScaleUp','#059669']].map(([s,t,n,r,c])=>`
    <div class="t-card"><div class="t-stars">${s}</div><p class="t-text">${t}</p><div class="t-auth"><div class="t-av" style="background:${c}22;color:${c}">${n[0]}</div><div><div class="t-name">${n}</div><div class="t-role">${r}</div></div></div></div>`).join('')}
    </div>
  </div>
</div>

<div class="sec">
  <div style="text-align:center;max-width:540px;margin:0 auto"><div class="s-eyebrow" style="justify-content:center">Prezzi</div><h2 class="sh">Semplice. Trasparente. Scalabile.</h2><p class="sd" style="margin:0 auto">Inizia gratis, paga solo quando cresci. Nessun costo nascosto.</p></div>
  <div class="p-grid">${[{t:'Starter',p:'€0',s:'/mese',d:'Per iniziare e sperimentare.',f:['3 progetti attivi','5 GB storage','Deploy illimitati','Supporto community'],btn:'Inizia gratis',feat:false},{t:'Pro',p:'€29',s:'/mese',d:'Per freelancer e team in crescita.',f:['Progetti illimitati','50 GB storage','Custom domain','Supporto 24/7','Analytics avanzate','Accesso API'],btn:'Prova gratis 14 giorni',feat:true,badge:'Più popolare'},{t:'Enterprise',p:'€99',s:'/mese',d:'Per aziende con esigenze avanzate.',f:['Tutto di Pro','SSO/SAML','SLA 99.9%','Onboarding dedicato','Fatturazione annuale'],btn:'Parla con il team',feat:false}].map(c=>`
  <div class="p-card${c.feat?' feat':''}">
    ${c.badge?`<div class="p-badge">${c.badge}</div>`:''}
    <div class="p-tier">${c.t}</div><div class="p-price">${c.p}<sub>${c.s}</sub></div>
    <p class="p-desc">${c.d}</p>
    <div class="p-feats">${c.f.map(f=>`<div class="p-feat">${f}</div>`).join('')}</div>
    <button class="pb ${c.feat?'pb-feat':'pb-def'}" onclick="this.textContent='✓ '+this.textContent">${c.btn}</button>
  </div>`).join('')}
  </div>
</div>

<div class="sec" style="padding-top:0">
  <div style="text-align:center;max-width:540px;margin:0 auto"><div class="s-eyebrow" style="justify-content:center">FAQ</div><h2 class="sh">Domande frequenti</h2></div>
  <div class="faq">${[['Posso cancellare in qualsiasi momento?','Sì. Nessun contratto a lungo termine. Cancella dal pannello in qualsiasi momento, senza penali.'],['Avete supporto in italiano?','Sì, il team di supporto è disponibile in italiano dal lunedì al venerdì 9-18, risposta garantita entro 4h sui piani Pro ed Enterprise.'],['Posso migrare da un\'altra piattaforma?','Sì. Offriamo strumenti di migrazione automatica e, per i piani Enterprise, migrazione assistita completamente gratuita.'],['I miei dati sono al sicuro?','Assolutamente. Crittografia AES-256, backup giornalieri, certificati SOC 2 Type II e conformità GDPR.'],['Posso avere una demo personalizzata?','Certo! Prenota una chiamata con il nostro team e ti mostreremo come adattiamo la piattaforma al tuo business.']].map(([q,a])=>`
  <div class="fi"><div class="fq" onclick="var i=this.parentElement;var o=i.classList.contains('open');document.querySelectorAll('.fi').forEach(x=>x.classList.remove('open'));if(!o)i.classList.add('open')">${q}<div class="fi-ico">+</div></div><div class="fa">${a}</div></div>`).join('')}
  </div>
</div>

<div class="cta-wrap">
  <div class="cta-box">
    <h2>Pronto a costruire qualcosa di straordinario?</h2>
    <p>Unisciti a migliaia di team che usano la nostra piattaforma per accelerare la crescita.</p>
    <div class="cta-row">
      <input class="cta-in" placeholder="La tua email di lavoro" type="email">
      <button class="cta-sb" onclick="this.textContent='✓ Controlla la tua email!'">Inizia gratis</button>
    </div>
    <p style="margin-top:12px;font-size:.8125rem;color:var(--tx5);position:relative">Nessuna carta di credito · Setup in 2 minuti · Cancella quando vuoi</p>
  </div>
</div>

<footer>
  <div class="ft">
    <div class="fb">
      <div class="n-logo" style="font-size:1rem"><div class="n-icon" style="width:26px;height:26px;font-size:.75rem">⚡</div>${escHtml(brand)}</div>
      <p>La piattaforma per team ambiziosi che vogliono costruire prodotti eccezionali, più velocemente.</p>
      <div class="socials" style="margin-top:14px">${['𝕏','in','gh','yt'].map(s=>`<div class="sl">${s}</div>`).join('')}</div>
    </div>
    ${[['Prodotto',['Funzionalità','Integrazioni','Prezzi','Roadmap','Changelog']],['Risorse',['Documentazione','Tutorial','Blog','Community','Status']],['Azienda',['Chi siamo','Lavora con noi','Press','Partner','Contatti']]].map(([col,links])=>`<div class="fc"><h4>${col}</h4>${(links as string[]).map(l=>`<a>${l}</a>`).join('')}</div>`).join('')}
  </div>
  <div class="fb-bot">
    <span>© 2025 ${escHtml(brand)}. Tutti i diritti riservati.</span>
    <div style="display:flex;gap:18px"><a style="cursor:pointer">Privacy</a><a style="cursor:pointer">Termini</a><a style="cursor:pointer">Cookie</a></div>
  </div>
</footer>

<script>
(function(){
  var obs=new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(e.isIntersecting){e.target.style.opacity='1';e.target.style.transform='translateY(0)'}
    });
  },{threshold:.1});
  document.querySelectorAll('.f-card,.t-card,.p-card,.step,.m-card').forEach(function(el){
    el.style.opacity='0';el.style.transform='translateY(16px)';
    el.style.transition='opacity .5s ease,transform .5s ease';
    obs.observe(el);
  });
})();
</script>
</body>
</html>`;
}

function portfolioTemplate(prompt: string): string {
  const projects = [
    { title: 'E-commerce Platform', desc: 'Full-stack shop con React e Node.js', tags: ['React','Node','MongoDB'], color: '#6366f1' },
    { title: 'AI Dashboard', desc: 'Analytics real-time con integrazione ML', tags: ['Python','D3.js','FastAPI'], color: '#22c55e' },
    { title: 'Mobile Banking App', desc: 'App finanziaria con React Native', tags: ['React Native','Supabase'], color: '#f59e0b' },
    { title: 'SaaS Landing Page', desc: 'Landing ad alta conversione per startup', tags: ['Next.js','Tailwind'], color: '#ec4899' },
  ];
  return `<!DOCTYPE html><html lang="it"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escHtml(prompt.slice(0,50))}</title>
<style>${baseStyles}
:root{--accent:#6366f1}
body{background:#09090b;color:#e4e4e7}
nav{position:fixed;top:0;left:0;right:0;z-index:100;backdrop-filter:blur(12px);background:rgba(9,9,11,.8);border-bottom:1px solid rgba(255,255,255,.06);padding:0 40px;height:64px;display:flex;align-items:center;justify-content:space-between}
.logo{font-weight:900;font-size:1.1rem;background:linear-gradient(135deg,#a78bfa,#60a5fa);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.nav-links{display:flex;gap:28px;font-size:14px;color:#71717a}
.nav-links a:hover{color:#fff;cursor:pointer;transition:color .2s}
.hire-btn{background:var(--accent);color:#fff;padding:8px 20px;border-radius:8px;font-size:13px;font-weight:600;cursor:pointer;transition:background .2s}
.hire-btn:hover{background:#4f46e5}
.hero{min-height:100vh;display:flex;align-items:center;padding:0 40px;max-width:1100px;margin:0 auto;gap:60px}
.hero-left{flex:1}
.hero-tag{display:inline-flex;align-items:center;gap:8px;background:rgba(99,102,241,.1);border:1px solid rgba(99,102,241,.2);color:#a78bfa;padding:6px 14px;border-radius:9999px;font-size:13px;margin-bottom:24px}
.hero-tag-dot{width:8px;height:8px;border-radius:50%;background:#22c55e;animation:pulse 2s infinite}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}
.hero h1{font-size:clamp(2.5rem,5vw,4rem);font-weight:900;line-height:1.1;margin-bottom:16px}
.hero h1 span{background:linear-gradient(135deg,#a78bfa,#60a5fa);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.hero p{color:#71717a;font-size:1.05rem;line-height:1.7;margin-bottom:32px;max-width:480px}
.hero-actions{display:flex;gap:12px;flex-wrap:wrap}
.btn-primary{background:var(--accent);color:#fff;padding:13px 28px;border-radius:10px;font-weight:700;cursor:pointer;transition:all .2s}
.btn-primary:hover{background:#4f46e5;transform:translateY(-2px)}
.btn-secondary{background:rgba(255,255,255,.06);color:#fff;border:1px solid rgba(255,255,255,.1);padding:13px 28px;border-radius:10px;font-weight:600;cursor:pointer;transition:all .2s}
.btn-secondary:hover{background:rgba(255,255,255,.1)}
.skills-row{display:flex;flex-wrap:wrap;gap:8px;margin-top:32px}
.skill{background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08);color:#a1a1aa;padding:6px 14px;border-radius:7px;font-size:12px;font-weight:500}
.hero-right{flex-shrink:0}
.avatar-box{width:280px;height:280px;border-radius:24px;background:linear-gradient(135deg,rgba(99,102,241,.3),rgba(96,165,250,.2));border:1px solid rgba(99,102,241,.2);display:flex;align-items:center;justify-content:center;font-size:6rem;position:relative}
.avatar-badge{position:absolute;bottom:-12px;right:-12px;background:#18181b;border:1px solid rgba(255,255,255,.1);border-radius:12px;padding:10px 16px;font-size:12px;font-weight:700;color:#22c55e;white-space:nowrap}
.section{max-width:1100px;margin:0 auto;padding:80px 40px}
.section-label{font-size:12px;font-weight:700;color:var(--accent);text-transform:uppercase;letter-spacing:.15em;margin-bottom:12px}
.section h2{font-size:clamp(1.75rem,3vw,2.5rem);font-weight:800;margin-bottom:40px}
.projects-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:20px}
.project-card{background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.07);border-radius:16px;padding:24px;cursor:pointer;transition:all .25s}
.project-card:hover{background:rgba(255,255,255,.06);border-color:rgba(99,102,241,.3);transform:translateY(-4px)}
.project-icon{width:48px;height:48px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:1.3rem;margin-bottom:16px}
.project-card h3{font-size:1.05rem;font-weight:700;margin-bottom:8px;color:#fff}
.project-card p{font-size:.875rem;color:#71717a;line-height:1.6;margin-bottom:16px}
.project-tags{display:flex;gap:6px;flex-wrap:wrap}
.project-tag{background:rgba(255,255,255,.06);color:#a1a1aa;padding:3px 10px;border-radius:5px;font-size:11px;font-weight:500}
.contact{background:linear-gradient(135deg,rgba(99,102,241,.15),rgba(96,165,250,.08));border:1px solid rgba(99,102,241,.2);border-radius:24px;padding:60px;text-align:center;max-width:700px;margin:0 auto}
.contact h2{font-size:2rem;font-weight:800;margin-bottom:12px}
.contact p{color:#71717a;margin-bottom:32px}
.contact-form{display:flex;flex-direction:column;gap:12px;max-width:400px;margin:0 auto}
.form-input{background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);color:#fff;padding:12px 16px;border-radius:10px;font-size:14px;outline:none;transition:border-color .2s}
.form-input:focus{border-color:var(--accent)}
.form-input::placeholder{color:#52525b}
.submit-btn{background:var(--accent);color:#fff;padding:13px;border-radius:10px;font-weight:700;font-size:14px;cursor:pointer;transition:background .2s}
.submit-btn:hover{background:#4f46e5}
@media(max-width:768px){.hero{flex-direction:column;padding:100px 24px 60px;text-align:center}.hero-right{display:none}.projects-grid{grid-template-columns:1fr}.nav-links{display:none}.section{padding:60px 24px}.hero-actions{justify-content:center}}
</style></head><body>
<nav>
  <div class="logo">devname.io</div>
  <div class="nav-links"><a>Chi sono</a><a>Progetti</a><a>Skills</a><a>Contatti</a></div>
  <button class="hire-btn" onclick="document.querySelector('.contact').scrollIntoView({behavior:'smooth'})">Assumimi →</button>
</nav>
<section class="hero">
  <div class="hero-left">
    <div class="hero-tag"><div class="hero-tag-dot"></div>Disponibile per nuovi progetti</div>
    <h1>Ciao, sono<br/><span>Full-Stack Developer</span></h1>
    <p>Creo applicazioni web moderne, veloci e scalabili. Da startup a enterprise, trasformo idee in prodotti digitali che funzionano davvero.</p>
    <div class="hero-actions">
      <button class="btn-primary" onclick="document.querySelector('.projects-grid').scrollIntoView({behavior:'smooth'})">Vedi i miei progetti</button>
      <button class="btn-secondary">Scarica CV</button>
    </div>
    <div class="skills-row">
      ${['React','Next.js','TypeScript','Node.js','Python','PostgreSQL','Tailwind','Docker'].map(s=>`<span class="skill">${s}</span>`).join('')}
    </div>
  </div>
  <div class="hero-right">
    <div class="avatar-box">👨‍💻<div class="avatar-badge">🟢 Open to work</div></div>
  </div>
</section>
<div class="section">
  <div class="section-label">Portfolio</div>
  <h2>Progetti recenti</h2>
  <div class="projects-grid">
    ${projects.map(p=>`<div class="project-card">
      <div class="project-icon" style="background:${p.color}22">${p.color==='#6366f1'?'🛒':p.color==='#22c55e'?'📊':p.color==='#f59e0b'?'📱':'🚀'}</div>
      <h3>${p.title}</h3><p>${p.desc}</p>
      <div class="project-tags">${p.tags.map(t=>`<span class="project-tag">${t}</span>`).join('')}</div>
    </div>`).join('')}
  </div>
</div>
<div class="section">
  <div class="contact">
    <h2>Lavoriamo insieme?</h2>
    <p>Sono disponibile per progetti freelance, consulenze e posizioni full-time.</p>
    <div class="contact-form">
      <input class="form-input" placeholder="Il tuo nome" type="text">
      <input class="form-input" placeholder="La tua email" type="email">
      <textarea class="form-input" placeholder="Raccontami del tuo progetto..." rows="4" style="resize:none"></textarea>
      <button class="submit-btn" onclick="this.textContent='✓ Messaggio inviato!'">Invia messaggio</button>
    </div>
  </div>
</div>
</body></html>`;
}

function restaurantTemplate(prompt: string): string {
  const menuItems = {
    antipasti: [
      { name: 'Bruschetta al pomodoro', desc: 'Pane tostato, pomodorini, basilico fresco', price: '€8' },
      { name: 'Tagliere misto', desc: 'Salumi DOP, formaggi stagionati, miele', price: '€16' },
      { name: 'Carpaccio di manzo', desc: 'Rucola, grana, limone e olio EVO', price: '€14' },
    ],
    primi: [
      { name: 'Spaghetti cacio e pepe', desc: 'Ricetta romana tradizionale', price: '€14' },
      { name: 'Risotto ai funghi porcini', desc: 'Porcini freschi, burro, parmigiano', price: '€16' },
      { name: 'Pappardelle al ragù', desc: 'Ragù di cinghiale, 4 ore di cottura', price: '€15' },
    ],
    secondi: [
      { name: 'Bistecca alla fiorentina', desc: 'Chianina IGP, al sangue, 600g', price: '€38' },
      { name: 'Branzino all\'acqua pazza', desc: 'Pomodorini, capperi, olive', price: '€24' },
      { name: 'Pollo alla cacciatora', desc: 'Olive, rosmarino, pomodoro', price: '€18' },
    ],
  };

  return `<!DOCTYPE html><html lang="it"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escHtml(prompt.slice(0,50))}</title>
<style>${baseStyles}
body{background:#0c0a09;color:#e7e5e4;font-family:'Georgia',serif}
nav{position:fixed;top:0;left:0;right:0;z-index:100;background:rgba(12,10,9,.9);backdrop-filter:blur(12px);border-bottom:1px solid rgba(255,255,255,.08);padding:0 48px;height:72px;display:flex;align-items:center;justify-content:space-between}
.logo{font-size:1.4rem;font-weight:700;letter-spacing:.05em;color:#d4af37}
.nav-links{display:flex;gap:28px;font-size:14px;color:#a8a29e;font-family:sans-serif}
.nav-links a:hover{color:#fff;cursor:pointer;transition:color .2s}
.book-btn{background:#d4af37;color:#0c0a09;padding:10px 24px;border-radius:6px;font-size:13px;font-weight:700;cursor:pointer;font-family:sans-serif;letter-spacing:.05em;transition:background .2s}
.book-btn:hover{background:#b8942a}
.hero{height:100vh;display:flex;align-items:center;justify-content:center;text-align:center;padding:0 24px;background:linear-gradient(to bottom,rgba(12,10,9,0) 0%,rgba(12,10,9,.7) 60%,rgba(12,10,9,1) 100%),url('https://picsum.photos/1920/1080?random=5') center/cover no-repeat;position:relative}
.hero-content{position:relative;z-index:1}
.hero-label{font-family:sans-serif;font-size:12px;font-weight:600;letter-spacing:.25em;color:#d4af37;text-transform:uppercase;margin-bottom:20px}
.hero h1{font-size:clamp(3rem,8vw,6rem);font-weight:700;line-height:1.05;margin-bottom:20px;color:#fafaf9;letter-spacing:-.02em}
.hero p{color:#a8a29e;font-size:1.1rem;font-family:sans-serif;margin-bottom:40px;max-width:500px;margin:0 auto 40px;line-height:1.6}
.hero-actions{display:flex;gap:12px;justify-content:center}
.btn-gold{background:#d4af37;color:#0c0a09;padding:14px 32px;border-radius:6px;font-weight:700;font-size:1rem;cursor:pointer;font-family:sans-serif;transition:all .2s}
.btn-gold:hover{background:#b8942a;transform:translateY(-2px)}
.btn-outline{background:transparent;border:1px solid rgba(212,175,55,.4);color:#d4af37;padding:14px 32px;border-radius:6px;font-size:1rem;cursor:pointer;font-family:sans-serif;transition:all .2s}
.btn-outline:hover{background:rgba(212,175,55,.1)}
.divider{text-align:center;padding:48px 0 0;color:#d4af37;letter-spacing:.2em;font-size:12px;font-family:sans-serif;text-transform:uppercase}
.divider::before,.divider::after{content:'——————  '}
.menu-section{max-width:900px;margin:0 auto;padding:48px 24px}
.menu-category{margin-bottom:48px}
.cat-title{font-size:1.5rem;letter-spacing:.05em;color:#d4af37;margin-bottom:8px;border-bottom:1px solid rgba(212,175,55,.2);padding-bottom:12px}
.menu-items{display:flex;flex-direction:column;gap:0}
.menu-item{display:flex;align-items:flex-start;justify-content:space-between;gap:20px;padding:16px 0;border-bottom:1px solid rgba(255,255,255,.05)}
.menu-item:last-child{border-bottom:none}
.item-info h4{font-size:1rem;font-weight:600;color:#fafaf9;margin-bottom:4px}
.item-info p{font-size:.875rem;color:#78716c;font-family:sans-serif;line-height:1.5}
.item-price{color:#d4af37;font-size:1rem;font-weight:600;white-space:nowrap;margin-top:2px;font-family:sans-serif}
.booking{background:rgba(212,175,55,.05);border:1px solid rgba(212,175,55,.15);border-radius:16px;padding:48px;text-align:center;max-width:700px;margin:0 auto 80px;font-family:sans-serif}
.booking h2{font-size:1.75rem;font-weight:700;margin-bottom:8px;color:#fafaf9}
.booking p{color:#78716c;margin-bottom:32px}
.booking-form{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px}
.form-input{background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);color:#e7e5e4;padding:12px 16px;border-radius:8px;font-size:14px;outline:none;transition:border-color .2s}
.form-input:focus{border-color:#d4af37}
.form-input::placeholder{color:#57534e}
footer{border-top:1px solid rgba(255,255,255,.06);padding:32px 48px;display:flex;justify-content:space-between;align-items:center;font-family:sans-serif;font-size:13px;color:#57534e}
@media(max-width:768px){.booking-form{grid-template-columns:1fr}.nav-links{display:none}.menu-section{padding:32px 16px}}
</style></head><body>
<nav>
  <div class="logo">La Trattoria</div>
  <div class="nav-links"><a>Menu</a><a>Chi siamo</a><a>Galleria</a><a>Contatti</a></div>
  <button class="book-btn" onclick="document.querySelector('.booking').scrollIntoView({behavior:'smooth'})">Prenota</button>
</nav>
<section class="hero">
  <div class="hero-content">
    <div class="hero-label">Dal 1987 · Cucina italiana autentica</div>
    <h1>Sapori<br/>di casa</h1>
    <p>Ogni piatto racconta una storia. Ingredienti freschi, ricette di famiglia, passione per la buona tavola.</p>
    <div class="hero-actions">
      <button class="btn-gold" onclick="document.querySelector('.booking').scrollIntoView({behavior:'smooth'})">Prenota un tavolo</button>
      <button class="btn-outline" onclick="document.querySelector('.menu-section').scrollIntoView({behavior:'smooth'})">Scopri il menu</button>
    </div>
  </div>
</section>
<div class="divider">Il nostro menu</div>
<div class="menu-section">
  ${Object.entries(menuItems).map(([cat, items]) => `
  <div class="menu-category">
    <div class="cat-title">${cat.charAt(0).toUpperCase()+cat.slice(1)}</div>
    <div class="menu-items">
      ${items.map(item => `<div class="menu-item">
        <div class="item-info"><h4>${item.name}</h4><p>${item.desc}</p></div>
        <div class="item-price">${item.price}</div>
      </div>`).join('')}
    </div>
  </div>`).join('')}
</div>
<div style="max-width:900px;margin:0 auto;padding:0 24px">
  <div class="booking">
    <h2>Prenota il tuo tavolo</h2>
    <p>Siamo aperti dal martedì alla domenica, a pranzo e a cena. Prenotare è consigliato.</p>
    <div class="booking-form">
      <input class="form-input" placeholder="Nome e cognome" type="text">
      <input class="form-input" placeholder="Numero di telefono" type="tel">
      <input class="form-input" placeholder="Data" type="date">
      <input class="form-input" placeholder="Numero di persone" type="number" min="1" max="20">
    </div>
    <button class="btn-gold" style="width:100%;padding:14px" onclick="this.textContent='✓ Prenotazione confermata! Ti ricontatteremo presto.'">Conferma prenotazione</button>
  </div>
</div>
<footer>
  <div>© 2025 La Trattoria · Via Roma 12, Milano</div>
  <div style="display:flex;gap:20px"><span style="cursor:pointer">📍 Indicazioni</span><span style="cursor:pointer">📞 02 1234567</span></div>
</footer>
</body></html>`;
}

function escHtml(s: string): string {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
