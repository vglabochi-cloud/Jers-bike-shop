/* ===== MOBILE MENU ===== */
function toggleMenu() {
  document.getElementById('mobileMenu').classList.toggle('open');
}

/* ===== TOAST ===== */
function showToast(msg) {
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toast-msg');
  if (!toast) return;
  toastMsg.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3500);
}

/* ===== FORMS ===== */
function handleNewsletter(e) {
  e.preventDefault();
  showToast("You're subscribed! Watch your inbox for presale alerts.");
  e.target.reset();
}

function handleContact(e) {
  e.preventDefault();
  showToast("Message sent! We'll get back to you within a few hours.");
  e.target.reset();
}

/* ===== SHOP FILTER ===== */
function filterProducts(category, btn) {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('#productsGrid .product-card').forEach(card => {
    const cats = card.dataset.category || '';
    card.style.display = (category === 'all' || cats.includes(category)) ? '' : 'none';
  });
}

function sortProducts(val) {
  const grid = document.getElementById('productsGrid');
  if (!grid) return;
  const cards = Array.from(grid.querySelectorAll('.product-card'));
  cards.sort((a, b) => {
    const pa = parseFloat(a.dataset.price) || 0;
    const pb = parseFloat(b.dataset.price) || 0;
    if (val === 'price-low') return pa - pb;
    if (val === 'price-high') return pb - pa;
    return 0;
  });
  cards.forEach(c => grid.appendChild(c));
}

/* ===== INQUIRY MODAL ===== */
function addToInquiry(bikeName) {
  const modal = document.getElementById('inquiryModal');
  const nameEl = document.getElementById('modalBikeName');
  if (modal && nameEl) {
    nameEl.textContent = bikeName;
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }
}

function closeModal() {
  const modal = document.getElementById('inquiryModal');
  if (modal) {
    modal.style.display = 'none';
    document.body.style.overflow = '';
  }
}

function submitInquiry(e) {
  e.preventDefault();
  closeModal();
  showToast("Inquiry sent! We'll follow up within a few hours.");
}

document.addEventListener('click', (e) => {
  const modal = document.getElementById('inquiryModal');
  if (modal && e.target === modal) closeModal();
});

/* ===== DATA RENDERING ===== */

function categoryLabel(cat) {
  const map = { mountain: 'Mountain', road: 'Road', city: 'City / Commuter', electric: 'Electric', kids: 'Kids' };
  return map[cat] || cat;
}

function badgeLabel(badge) {
  const map = { presale: 'Presale', new: 'New', sale: 'Sale', 'sold-out': 'Sold Out' };
  return map[badge] || badge;
}

function renderProductCard(p) {
  const badgeHtml = p.badge
    ? `<div class="product-badges"><span class="badge badge-${p.badge}">${badgeLabel(p.badge)}</span></div>`
    : '';
  const saveAmount = p.originalPrice ? p.originalPrice - p.price : 0;
  const priceExtras = p.originalPrice
    ? `<span class="price-original">₱${p.originalPrice.toLocaleString()}</span>
       <span class="price-save">Save ₱${saveAmount.toLocaleString()}</span>`
    : '';
  const btnClass = p.ctaText === 'Reserve Now' || p.ctaText === 'Buy Now' ? 'btn-primary' : 'btn-dark';
  const tags = [p.category, p.badge].filter(Boolean).join(' ');
  const safeName = (p.name || '').replace(/'/g, "\\'");

  const imgContent = p.image
    ? `<img src="${p.image}" alt="${p.name}" style="width:100%;height:100%;object-fit:cover;position:absolute;inset:0;" />`
    : (p.icon || '🚲');

  return `
    <div class="product-card" data-category="${tags}" data-price="${p.price}">
      <div class="product-img" style="position:relative;">${imgContent}${badgeHtml}</div>
      <div class="product-info">
        <div class="product-category">${categoryLabel(p.category)}</div>
        <div class="product-name">${p.name}</div>
        <div class="product-price">
          <span class="price-current">₱${(p.price || 0).toLocaleString()}</span>
          ${priceExtras}
        </div>
        <button class="btn ${btnClass}" onclick="addToInquiry('${safeName}')">${p.ctaText || 'Inquire'}</button>
      </div>
    </div>`;
}

function renderServiceCard(s, includesHtml = '') {
  return `
    <div class="service-card">
      <div class="service-icon">${s.icon}</div>
      <div class="service-name">${s.name}</div>
      <div class="service-desc">${s.description}</div>
      ${includesHtml}
      <div class="service-price">${s.price} <span>${s.unit}</span></div>
    </div>`;
}

function renderTuneupCard(s) {
  const includes = Array.isArray(s.includes) && s.includes.length
    ? `<div style="margin-bottom:12px;">
         <div style="font-size:0.78rem;color:var(--gray-400);margin-bottom:6px;">INCLUDES</div>
         <div style="font-size:0.82rem;color:var(--gray-600);line-height:1.8;">${s.includes.map(i => `✓ ${i}`).join(' &nbsp;')}</div>
       </div>`
    : '';
  return renderServiceCard(s, includes);
}

function renderEventCard(ev) {
  const btnClass = ev.ctaStyle === 'primary' ? 'btn-primary' : ev.ctaStyle === 'dark' ? 'btn-dark' : 'btn-outline';
  return `
    <div class="event-card">
      <div class="event-header">
        <div class="event-date">
          <div class="day">${ev.day}</div>
          <div class="month">${ev.month}</div>
        </div>
        <div class="event-meta">
          <div class="event-type">${ev.type}</div>
          <div class="event-name">${ev.name}</div>
        </div>
      </div>
      <div class="event-body">
        <div class="event-detail">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          ${ev.time}
        </div>
        <div class="event-detail">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          ${ev.location}
        </div>
        <div class="event-desc">${ev.description}</div>
      </div>
      <div class="event-footer">
        <a href="${ev.ctaLink}" class="btn ${btnClass}">${ev.ctaText}</a>
      </div>
    </div>`;
}

/* ===== DATA FETCHING ===== */

async function fetchJSON(path) {
  try {
    const res = await fetch(path);
    if (!res.ok) throw new Error(res.status);
    return await res.json();
  } catch (e) {
    console.warn('Could not load', path, e);
    return null;
  }
}

async function loadAnnouncement() {
  const bars = document.querySelectorAll('.announcement-bar');
  if (!bars.length) return;
  const data = await fetchJSON('/data/settings.json');
  if (!data) return;
  bars.forEach(bar => {
    bar.innerHTML = `${data.announcementText} <a href="${data.announcementLink}">${data.announcementLinkText}</a>`;
  });
}

async function loadFeaturedProducts() {
  const grid = document.getElementById('featured-products');
  if (!grid) return;
  const data = await fetchJSON('/data/products.json');
  if (!data) return;
  const featured = data.items.filter(p => p.featured).slice(0, 4);
  grid.innerHTML = featured.map(renderProductCard).join('');
}

async function loadAllProducts() {
  const grid = document.getElementById('productsGrid');
  if (!grid) return;
  const data = await fetchJSON('/data/products.json');
  if (!data) return;
  grid.innerHTML = data.items.map(renderProductCard).join('');
  const param = new URLSearchParams(window.location.search).get('filter');
  if (param) {
    const btn = [...document.querySelectorAll('.filter-btn')]
      .find(b => b.getAttribute('onclick')?.includes(`'${param}'`));
    if (btn) filterProducts(param, btn);
  }
}

async function loadServicesTuneups() {
  const grid = document.getElementById('tuneups-grid');
  if (!grid) return;
  const data = await fetchJSON('/data/tuneups.json');
  if (!data) return;
  grid.innerHTML = data.items.map(renderTuneupCard).join('');
}

async function loadServicesRepairs() {
  const grid = document.getElementById('repairs-grid');
  if (!grid) return;
  const data = await fetchJSON('/data/repairs.json');
  if (!data) return;
  grid.innerHTML = data.items.map(s => renderServiceCard(s)).join('');
}

async function loadServicesTeaserHome() {
  const grid = document.getElementById('services-teaser');
  if (!grid) return;
  const data = await fetchJSON('/data/tuneups.json');
  if (!data) return;
  grid.innerHTML = data.items.map(renderTuneupCard).join('');
}

async function loadEvents() {
  const grid = document.getElementById('homepage-events');
  if (!grid) return;
  const data = await fetchJSON('/data/events.json');
  if (!data) return;
  grid.innerHTML = data.items.map(renderEventCard).join('');
}

/* ===== INIT ===== */
document.addEventListener('DOMContentLoaded', () => {
  loadAnnouncement();
  loadFeaturedProducts();
  loadAllProducts();
  loadServicesTuneups();
  loadServicesRepairs();
  loadServicesTeaserHome();
  loadEvents();
});

/* ===== NETLIFY IDENTITY ===== */
if (window.netlifyIdentity) {
  window.netlifyIdentity.on('init', user => {
    if (!user) {
      window.netlifyIdentity.on('login', () => {
        document.location.href = '/admin/';
      });
    }
  });
}

/* ===== AI CHAT WIDGET ===== */
const chatKnowledge = {
  greetings:   ['hi','hello','hey','howdy','good morning','good afternoon','sup','yo'],
  hours:       ['hours','open','close','closing time','opening','when are you','schedule','sunday','saturday','weekday','weekend'],
  location:    ['address','location','where','directions','find you','map','street','city','get there','near'],
  phone:       ['phone','call','number','telephone','contact number','reach you'],
  services:    ['service','repair','tune','fix','overhaul','maintenance','mechanic','flat','brake','chain','gear','wheel','build','fitting','bleed'],
  tuneup:      ['tune-up','tune up','basic tune','standard tune','overhaul'],
  flat:        ['flat','puncture','tire repair','tube','patch'],
  turnaround:  ['how long','turnaround','ready','wait','takes how','how many days','when will'],
  presale:     ['presale','pre-sale','pre sale','reserve','reservation','deposit','preorder','pre-order'],
  bikes:       ['bike','bicycle','mountain','road','ebike','e-bike','electric','city','commuter','kids','gravel','buy','purchase','inventory','stock','price','cost','how much'],
  events:      ['event','ride','group ride','workshop','class','community','saturday ride','upcoming','join','rsvp'],
  appointment: ['appointment','book','schedule','walk-in','walk in','drop in','drop-in'],
  testride:    ['test ride','test-ride','try','demo'],
  returns:     ['return','refund','exchange','warranty'],
  custom:      ['custom','custom build','build a bike','parts'],
  fitting:     ['fitting','fit','bike fit','sizing'],
  newsletter:  ['newsletter','subscribe','email list','signup','sign up','mailing list','updates'],
  thanks:      ['thanks','thank you','thx','ty','great','awesome','perfect','helpful'],
  bye:         ['bye','goodbye','see ya','later','cya','take care'],
};

function matchIntent(input) {
  const text = input.toLowerCase();
  for (const [intent, keywords] of Object.entries(chatKnowledge)) {
    if (keywords.some(k => text.includes(k))) return intent;
  }
  return null;
}

function getBotReply(input) {
  switch (matchIntent(input)) {
    case 'greetings':    return "Hey there! 👋 Welcome to Jer's Bike Shop. Ask me about hours, services, presale bikes, or upcoming events!";
    case 'hours':        return "We're open:\n• Mon–Fri: 9:00 AM – 6:00 PM\n• Saturday: 9:00 AM – 5:00 PM\n• Sunday: Closed\n\nWalk-ins always welcome!";
    case 'location':     return "Find us at 123 Rider Lane, Suite A. 🗺️\n<a href='contact.html'>Get directions →</a>";
    case 'phone':        return "Call us at <strong>(555) 000-1234</strong> Mon–Sat, or email hello@jersbikeshop.com.";
    case 'services':     return "We offer tune-ups (₱49+), flat repair (₱18+), brake bleeds, wheel truing, custom builds, and bike fitting.\n<a href='services.html'>See all pricing →</a>";
    case 'tuneup':       return "Tune-up options:\n• <strong>Basic (₱49)</strong> — brakes, gears, pressure, safety check\n• <strong>Standard (₱89)</strong> — Basic + drivetrain clean + wheel truing\n• <strong>Full Overhaul (₱149)</strong> — complete tear-down & rebuild\n\nWalk-ins welcome!";
    case 'flat':         return "Flat repair starts at <strong>₱18 + tube/patch</strong>. Walk in anytime — most done in under 30 minutes. 🛞";
    case 'turnaround':   return "Most jobs done in <strong>24–48 hours</strong>. Flats are often same-day. We'll give you a clear ETA before we start.";
    case 'presale':      return "Our Presale is live! 🔥\n1. Reserve — no payment yet\n2. We confirm within 24hrs\n3. Pay & pick up when it arrives\n4. Free assembly + 30-day check-in\n\n<a href='shop.html'>Browse presale bikes →</a>";
    case 'bikes':        return "We carry mountain, road, city, electric, kids, and gravel bikes. Prices from ₱299 to ₱3,499+.\n<a href='shop.html'>Browse the shop →</a>";
    case 'events':       return "Upcoming events:\n• <strong>May 10</strong> — Saturday Trail Ride (free)\n• <strong>May 17</strong> — Maintenance 101 Workshop (₱15)\n• <strong>May 24</strong> — Memorial Day Presale Drop\n\n<a href='contact.html'>RSVP here →</a>";
    case 'appointment':  return "Walk-ins are welcome for most repairs. For custom builds and bike fitting, booking ahead helps. <a href='contact.html'>Book here →</a>";
    case 'testride':     return "Yes! Test rides available on all in-stock bikes. Stop by during shop hours. 🚲";
    case 'returns':      return "Bikes in original condition can be exchanged within 14 days. Service has a 30-day satisfaction guarantee. <a href='contact.html'>Contact us</a> with questions.";
    case 'custom':       return "We love custom builds! Labor from ₱250 + parts. Free consultation included. <a href='contact.html'>Book a consult →</a>";
    case 'fitting':      return "Professional bike fitting is ₱120. Includes measurements, saddle height, reach, cleat alignment, and a written report. <a href='contact.html'>Schedule yours →</a>";
    case 'newsletter':   return "Subscribe for early presale access and event announcements. <a href='index.html#newsletter'>Sign up here →</a>";
    case 'thanks':       return "Happy to help! Anything else you'd like to know? 😊";
    case 'bye':          return "Thanks for stopping by — come see us in person anytime. Happy riding! 🚲";
    default:             return "Great question! For the most accurate answer:\n• 📞 <strong>(555) 000-1234</strong>\n• ✉️ hello@jersbikeshop.com\n• <a href='contact.html'>Send a message →</a>\n\nWe reply within a few hours Mon–Sat.";
  }
}

function buildChatWidget() {
  const widget = document.createElement('div');
  widget.id = 'chat-widget';
  widget.innerHTML = `
    <style>
      #chat-widget{position:fixed;bottom:24px;right:24px;z-index:500;font-family:var(--font,system-ui)}
      #chat-bubble{width:56px;height:56px;border-radius:50%;background:var(--accent,#E8500A);color:white;display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:0 4px 20px rgba(232,80,10,.4);font-size:1.4rem;transition:transform .2s,box-shadow .2s;border:none;outline:none}
      #chat-bubble:hover{transform:scale(1.08);box-shadow:0 6px 28px rgba(232,80,10,.5)}
      #chat-bubble .chat-close{display:none;font-size:1.2rem}
      #chat-bubble.open .chat-icon{display:none}
      #chat-bubble.open .chat-close{display:block}
      #chat-unread{position:absolute;top:-4px;right:-4px;width:20px;height:20px;border-radius:50%;background:#22C55E;color:white;font-size:.65rem;font-weight:800;display:flex;align-items:center;justify-content:center;border:2px solid white;pointer-events:none}
      #chat-panel{position:absolute;bottom:68px;right:0;width:340px;max-height:520px;background:white;border-radius:16px;box-shadow:0 12px 48px rgba(0,0,0,.18);display:none;flex-direction:column;overflow:hidden;animation:chatIn .25s ease}
      @keyframes chatIn{from{opacity:0;transform:translateY(12px) scale(.97)}to{opacity:1;transform:none}}
      #chat-panel.visible{display:flex}
      .chat-head{background:#111;color:white;padding:16px 20px;display:flex;align-items:center;gap:12px}
      .chat-head-avatar{width:38px;height:38px;border-radius:50%;background:var(--accent,#E8500A);display:flex;align-items:center;justify-content:center;font-size:1.1rem;flex-shrink:0}
      .chat-head-name{font-weight:700;font-size:.95rem}
      .chat-head-status{font-size:.72rem;color:#aaa;display:flex;align-items:center;gap:5px}
      .chat-head-status .dot{width:7px;height:7px;background:#22C55E;border-radius:50%}
      .chat-messages{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:10px;max-height:340px;background:#FAFAFA}
      .chat-msg{display:flex;gap:8px;align-items:flex-end}
      .chat-msg.user{flex-direction:row-reverse}
      .chat-msg-avatar{width:28px;height:28px;border-radius:50%;background:#E8500A;color:white;font-size:.7rem;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0}
      .chat-msg.user .chat-msg-avatar{background:#111}
      .chat-msg-bubble{max-width:78%;padding:10px 14px;border-radius:14px 14px 14px 2px;font-size:.845rem;line-height:1.55;background:white;border:1px solid #E8E8E8;color:#111;white-space:pre-line}
      .chat-msg.user .chat-msg-bubble{background:#111;color:white;border-radius:14px 14px 2px 14px;border-color:#111}
      .chat-msg-bubble a{color:#E8500A}
      .chat-msg.user .chat-msg-bubble a{color:#FFB899}
      .chat-typing span{width:7px;height:7px;border-radius:50%;background:#aaa;display:inline-block;animation:typeDot 1.2s infinite;margin:0 2px}
      .chat-typing span:nth-child(2){animation-delay:.2s}
      .chat-typing span:nth-child(3){animation-delay:.4s}
      @keyframes typeDot{0%,80%,100%{transform:scale(1);opacity:.5}40%{transform:scale(1.3);opacity:1}}
      .chat-quick-replies{display:flex;flex-wrap:wrap;gap:7px;padding:0 16px 10px;background:#FAFAFA}
      .quick-reply{font-size:.75rem;font-weight:500;padding:6px 12px;border-radius:20px;border:1.5px solid #E8E8E8;background:white;cursor:pointer;transition:all .15s;font-family:inherit;color:#111}
      .quick-reply:hover{border-color:#E8500A;color:#E8500A}
      .chat-input-row{display:flex;gap:8px;padding:12px 14px;border-top:1px solid #E8E8E8;background:white}
      #chatInput{flex:1;border:1.5px solid #E8E8E8;border-radius:20px;padding:9px 14px;font-size:.85rem;font-family:inherit;outline:none;transition:border-color .2s;background:#FAFAFA}
      #chatInput:focus{border-color:#E8500A;background:white}
      #chatSend{width:36px;height:36px;border-radius:50%;background:#E8500A;color:white;border:none;cursor:pointer;font-size:1rem;display:flex;align-items:center;justify-content:center;transition:background .2s;flex-shrink:0;align-self:flex-end}
      #chatSend:hover{background:#C44008}
      @media(max-width:400px){#chat-panel{width:calc(100vw - 48px)}}
    </style>
    <div id="chat-panel" role="dialog" aria-label="Chat with us">
      <div class="chat-head">
        <div class="chat-head-avatar">🚲</div>
        <div>
          <div class="chat-head-name">Jer's Bike Assistant</div>
          <div class="chat-head-status"><span class="dot"></span> Online now</div>
        </div>
      </div>
      <div class="chat-messages" id="chatMessages"></div>
      <div class="chat-quick-replies" id="quickReplies">
        <button class="quick-reply" onclick="sendQuick('What are your hours?')">Hours</button>
        <button class="quick-reply" onclick="sendQuick('How does presale work?')">Presale</button>
        <button class="quick-reply" onclick="sendQuick('What services do you offer?')">Services</button>
        <button class="quick-reply" onclick="sendQuick('What events are coming up?')">Events</button>
        <button class="quick-reply" onclick="sendQuick('Where are you located?')">Location</button>
      </div>
      <div class="chat-input-row">
        <input type="text" id="chatInput" placeholder="Ask anything..." onkeydown="if(event.key==='Enter')sendMessage()" autocomplete="off"/>
        <button id="chatSend" onclick="sendMessage()" aria-label="Send">➤</button>
      </div>
    </div>
    <button id="chat-bubble" onclick="toggleChat()" aria-label="Open chat">
      <span class="chat-icon">💬</span>
      <span class="chat-close">✕</span>
      <span id="chat-unread">1</span>
    </button>`;
  document.body.appendChild(widget);
  setTimeout(() => appendBotMessage("Hey! 👋 I'm Jer's virtual assistant. Ask me about hours, presale bikes, services, or upcoming events!"), 800);
}

function toggleChat() {
  const panel = document.getElementById('chat-panel');
  const bubble = document.getElementById('chat-bubble');
  const unread = document.getElementById('chat-unread');
  panel.classList.toggle('visible');
  bubble.classList.toggle('open');
  if (unread) unread.style.display = 'none';
  if (panel.classList.contains('visible')) {
    setTimeout(() => document.getElementById('chatInput')?.focus(), 100);
    scrollChat();
  }
}

function appendBotMessage(html) {
  const msgs = document.getElementById('chatMessages');
  const el = document.createElement('div');
  el.className = 'chat-msg bot';
  el.innerHTML = `<div class="chat-msg-avatar">🤖</div><div class="chat-msg-bubble">${html}</div>`;
  msgs.appendChild(el);
  scrollChat();
}

function appendUserMessage(text) {
  const msgs = document.getElementById('chatMessages');
  const el = document.createElement('div');
  el.className = 'chat-msg user';
  el.innerHTML = `<div class="chat-msg-avatar">You</div><div class="chat-msg-bubble">${text.replace(/</g,'&lt;')}</div>`;
  msgs.appendChild(el);
  scrollChat();
}

function scrollChat() {
  const msgs = document.getElementById('chatMessages');
  if (msgs) msgs.scrollTop = msgs.scrollHeight;
}

function sendMessage() {
  const input = document.getElementById('chatInput');
  const text = input.value.trim();
  if (!text) return;
  input.value = '';
  appendUserMessage(text);
  document.getElementById('quickReplies').style.display = 'none';
  const typing = document.createElement('div');
  typing.className = 'chat-msg bot';
  typing.innerHTML = `<div class="chat-msg-avatar">🤖</div><div class="chat-msg-bubble chat-typing"><span></span><span></span><span></span></div>`;
  document.getElementById('chatMessages').appendChild(typing);
  scrollChat();
  setTimeout(() => { typing.remove(); appendBotMessage(getBotReply(text)); }, 600 + Math.random() * 600);
}

function sendQuick(text) {
  document.getElementById('chatInput').value = text;
  sendMessage();
}

document.addEventListener('DOMContentLoaded', buildChatWidget);
