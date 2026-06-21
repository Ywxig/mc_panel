  // ── серверы ──
  async function loadServers() {
    const res = await fetch('/api/servers');
    const servers = await res.json();
    const container = document.getElementById('servers');

    container.innerHTML = servers.map(s => `
      <div class="server-card">
        <div class="server-name">
          <span class="status-dot online"></span>
          ${s.name}
        </div>
        <div class="server-desc">${s.description}</div>
        <div class="server-ip" onclick="copyIP(this, '${s.ip}:${s.port}')">
          ${s.ip}:${s.port}
        </div>
      </div>
    `).join('');
  }

  // ── сборки ──
  async function loadModpacks() {
    const res = await fetch('/api/modpacks');
    const packs = await res.json();
    const container = document.getElementById('modpacks');

    if (packs.length === 0) {
      container.innerHTML = '<div class="empty">сборок пока нет — скоро добавлю</div>';
      return;
    }

    container.innerHTML = packs.map(p => `
      <div class="modpack-row">
        <div>
          <div class="modpack-name">${p.name}</div>
          <div class="modpack-size">${p.size}</div>
        </div>
        <a class="btn-download" href="/downloads/${p.filename}">скачать ↓</a>
      </div>
    `).join('');
  }

  // ── копировать IP ──
  function copyIP(el, ip) {
    navigator.clipboard.writeText(ip).then(() => {
      el.classList.add('copied');
      const orig = el.textContent;
      el.textContent = 'скопировано ✓';
      setTimeout(() => {
        el.classList.remove('copied');
        el.textContent = orig;
      }, 1800);

      const toast = document.getElementById('toast');
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 2000);
    });
  }

  loadServers();
  loadModpacks();