document.addEventListener('DOMContentLoaded', () => {
  // helper: fetch JSON
  const fetchJSON = (path) => fetch(path).then(r => r.ok ? r.json() : Promise.resolve([]));

  // render leaderboard preview
  fetchJSON('data/leaderboard.json').then(list => {
    const el = document.getElementById('leaderboardPreview');
    if(!el) return;
    el.innerHTML = list.slice(0,10).map(item => `
      <div class="leader-row">
        <div class="rank">${item.rank}</div>
        <img class="team-logo" src="${item.logo||'images/logo.png'}" alt="${item.team}">
        <div style="flex:1"><strong>${item.team}</strong></div>
        <div style="min-width:80px;text-align:right">${item.points}</div>
      </div>`).join('');
  });

  // render events
  fetchJSON('data/events.json').then(list => {
    const el = document.getElementById('eventsGrid');
    if(!el) return;
    el.innerHTML = list.map(ev => `
      <div class="card" style="background:var(--card);padding:14px;border-radius:10px">
        <div style="font-weight:700">${ev.title}</div>
        <div style="color:var(--muted);font-size:13px">${ev.date} • ${ev.game}</div>
        <p style="margin:10px 0;color:var(--muted)">${ev.desc || ''}</p>
        <div style="display:flex;gap:8px">
          <a class="btn" href="${ev.register||'events.html'}">Register</a>
          <a class="btn ghost" href="https://discord.gg/wvJAUt9bqz" target="_blank" rel="noopener noreferrer">Join Discord</a>
        </div>
      </div>`).join('');
  });

  // render news (if you add data/news.json)
  fetchJSON('data/news.json').then(list => {
    const el = document.getElementById('newsGrid');
    if(!el) return;
    el.innerHTML = list.map(n => `
      <article style="background:var(--card);padding:12px;border-radius:10px">
        <div style="height:120px;background:#071018;border-radius:8px;margin-bottom:10px"></div>
        <h3 style="margin:0">${n.title}</h3>
        <p style="color:var(--muted);font-size:13px">${n.excerpt||''}</p>
      </article>`).join('');
  });

  // certificate search
  let certs = [];
  fetchJSON('data/certificates.json').then(list => { certs = list || []; renderCerts(certs); });
  const input = document.getElementById('certSearch');
  if(input){
    input.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase().trim();
      renderCerts(certs.filter(c => c.name.toLowerCase().includes(q) || c.id.includes(q)));
    });
  }
  function renderCerts(items){
    const out = document.getElementById('certResults');
    if(!out) return;
    if(!items.length) { out.innerHTML = '<div class="cert-card">No certificates found.</div>'; return;}
    out.innerHTML = items.map(c => `<div class="cert-card"><a href="${c.file}" target="_blank" rel="noopener noreferrer">${c.name} — ${c.event}</a></div>`).join('');
  }

  // simple visitor counter (CountAPI) - public, replace if you want GA
  const visitEl = document.getElementById('visitCount');
  if(visitEl){
    fetch('https://api.countapi.xyz/hit/egsports/site')
      .then(r => r.json())
      .then(d => { visitEl.textContent = d.value; })
      .catch(()=>{ visitEl.textContent = '—'; });
  }
});
