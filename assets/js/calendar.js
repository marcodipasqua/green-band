/**
 * Green Band - Live Calendar Module
 * Gestione date live (future e archivio) dal Google Calendar della band.
 * Regola: Nessun riferimento a parole vietate o testi dismessi. Solo "Live".
 */

const CalendarModule = (function () {
  const ICS_URL = 'https://calendar.google.com/calendar/ical/b4f8701752bf56ce316450e8cd90b66b290502f92083a81748e0bed996e481e1%40group.calendar.google.com/public/basic.ics';
  const FALLBACK_DATA_PATH = 'data/events.json';

  let state = {
    future: [],
    past: [],
    activeTab: 'future',
    searchQuery: '',
    isLoading: true
  };

  function parseICS(icsText) {
    const events = [];
    const vevents = icsText.split('BEGIN:VEVENT');
    const todayStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');

    const monthNames = ['GEN', 'FEB', 'MAR', 'APR', 'MAG', 'GIU', 'LUG', 'AGO', 'SET', 'OTT', 'NOV', 'DIC'];

    for (let i = 1; i < vevents.length; i++) {
      const block = vevents[i].split('END:VEVENT')[0];
      const unfolded = block.replace(/\r?\n[ \t]/g, '');

      const getField = (name) => {
        const match = unfolded.match(new RegExp('^' + name + '(?:;[^:]*)?:(.*)$', 'm'));
        return match ? match[1].trim() : '';
      };

      const summary = getField('SUMMARY').replace(/\\,/g, ',').replace(/\\n/g, ' ');
      const dtstart = getField('DTSTART').replace(/[^0-9]/g, '').slice(0, 8);
      const location = getField('LOCATION').replace(/\\,/g, ',').replace(/\\n/g, ', ');
      const description = getField('DESCRIPTION').replace(/\\,/g, ',').replace(/\\n/g, '\n');

      if (!dtstart) continue;

      const y = parseInt(dtstart.slice(0, 4), 10);
      const m = parseInt(dtstart.slice(4, 6), 10) - 1;
      const d = parseInt(dtstart.slice(6, 8), 10);
      const dateObj = new Date(y, m, d);

      const day = String(d).padStart(2, '0');
      const month = monthNames[m] || '';
      const year = String(y);
      const formattedDate = `${day}/${String(m + 1).padStart(2, '0')}/${year}`;
      const isoDate = `${year}-${String(m + 1).padStart(2, '0')}-${day}`;

      const locParts = location.split(',').map(s => s.trim()).filter(Boolean);
      const venue = locParts[0] || summary;
      let city = '';
      const cityMatch = description.match(/Città:\s*(.*)/i);
      if (cityMatch) {
        city = cityMatch[1].trim();
      } else if (locParts.length > 1) {
        city = locParts[locParts.length - 2] || locParts[locParts.length - 1];
      }

      const isFuture = dtstart >= todayStr;

      events.push({
        id: `live-${dtstart}-${summary.replace(/[^a-zA-Z0-9]/g, '').slice(0, 10)}`,
        title: summary,
        venue,
        location,
        city,
        isoDate,
        formattedDate,
        day,
        month,
        year,
        description,
        isFuture,
        statusText: isFuture ? 'In programma' : 'Live concluso'
      });
    }

    const future = events.filter(e => e.isFuture).sort((a, b) => a.isoDate.localeCompare(b.isoDate));
    const past = events.filter(e => !e.isFuture).sort((a, b) => b.isoDate.localeCompare(a.isoDate));

    return { future, past };
  }

  async function loadData() {
    // 1. Try local data first for instantaneous rendering
    try {
      const res = await fetch(FALLBACK_DATA_PATH);
      if (res.ok) {
        const json = await res.json();
        state.future = json.future || [];
        state.past = json.past || [];
        state.isLoading = false;
        render();
        updateNextLiveBanner();
      }
    } catch (e) {
      console.warn('Fallback JSON non caricato, si procede con sync live:', e);
    }

    // 2. Real-time direct sync from Google Calendar
    const syncEndpoints = [
      '/api/calendar',
      `https://corsproxy.io/?url=${encodeURIComponent(ICS_URL)}`,
      `https://api.allorigins.win/raw?url=${encodeURIComponent(ICS_URL)}`
    ];

    for (const endpoint of syncEndpoints) {
      try {
        const liveRes = await fetch(endpoint, { cache: 'no-cache' });
        if (liveRes.ok) {
          const icsText = await liveRes.text();
          if (icsText && icsText.includes('BEGIN:VCALENDAR')) {
            const parsed = parseICS(icsText);
            if (parsed.future.length > 0 || parsed.past.length > 0) {
              state.future = parsed.future;
              state.past = parsed.past;
              state.isLoading = false;
              render();
              updateNextLiveBanner();
              break; // Sincronizzazione riuscita con successo
            }
          }
        }
      } catch (err) {
        // Continua al prossimo endpoint di sincronizzazione
      }
    }
  }

  function getGoogleCalendarEventUrl(ev) {
    const title = encodeURIComponent(ev.title || 'Live Green Band');
    const loc = encodeURIComponent(ev.location || '');
    const desc = encodeURIComponent(`Green Band - Green Day Tribute Band Live\n${ev.location}\nInfo: greenband.greendaytribute@gmail.com`);
    const dateStart = ev.isoDate ? ev.isoDate.replace(/-/g, '') : '';
    const dateEnd = dateStart; // All day
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dateStart}/${dateEnd}&details=${desc}&location=${loc}`;
  }

  function renderCard(ev) {
    const isFuture = ev.isFuture;
    const mapsQuery = encodeURIComponent(ev.location || `${ev.venue} ${ev.city}`);
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`;
    const gCalUrl = isFuture ? getGoogleCalendarEventUrl(ev) : null;

    return `
      <article class="live-card ${isFuture ? 'live-upcoming' : 'live-past'}" data-id="${ev.id}">
        <div class="live-date-badge">
          <span class="live-day">${ev.day || '--'}</span>
          <span class="live-month">${ev.month || ''}</span>
          <span class="live-year">${ev.year || ''}</span>
        </div>
        <div class="live-info">
          <div class="live-status-pill ${isFuture ? 'status-upcoming' : 'status-past'}">
            <span class="pulse-dot"></span>
            ${ev.statusText}
          </div>
          <h3 class="live-title">${escapeHtml(ev.title)}</h3>
          <p class="live-venue">
            <svg class="icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            <strong>${escapeHtml(ev.venue)}</strong>
            ${ev.city ? `· <span class="live-city">${escapeHtml(ev.city)}</span>` : ''}
          </p>
          <p class="live-address">${escapeHtml(ev.location)}</p>
        </div>
        <div class="live-actions">
          <a href="${mapsUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-outline-sm" title="Apri su Google Maps">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
              <polygon points="3 11 22 2 13 21 11 13 3 11"></polygon>
            </svg>
            Mappa
          </a>
          ${isFuture ? `
            <a href="${gCalUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-punk-sm" title="Aggiungi questo live al tuo Google Calendar">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              Salva Live
            </a>
          ` : `
            <span class="badge-completed">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              Completato
            </span>
          `}
        </div>
      </article>
    `;
  }

  function render() {
    const container = document.getElementById('live-list-container');
    const countBadge = document.getElementById('live-count-badge');
    if (!container) return;

    const list = state.activeTab === 'future' ? state.future : state.past;
    const query = state.searchQuery.toLowerCase().trim();

    const filtered = list.filter(ev => {
      if (!query) return true;
      return (
        (ev.title && ev.title.toLowerCase().includes(query)) ||
        (ev.venue && ev.venue.toLowerCase().includes(query)) ||
        (ev.city && ev.city.toLowerCase().includes(query)) ||
        (ev.location && ev.location.toLowerCase().includes(query))
      );
    });

    if (countBadge) {
      countBadge.textContent = `${filtered.length} ${filtered.length === 1 ? 'Live' : 'Live'}`;
    }

    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="live-empty-state">
          <div class="empty-icon">🎸</div>
          <h4>Nessun live trovato</h4>
          <p>${query ? 'Nessun risultato corrispondente alla ricerca.' : (state.activeTab === 'future' ? 'Nuove date in arrivo a breve! Iscriviti al calendario per rimanere aggiornato.' : 'Nessun live passato archiviato.')}</p>
        </div>
      `;
      return;
    }

    container.innerHTML = filtered.map(renderCard).join('');
  }

  function updateNextLiveBanner() {
    const heroBadge = document.getElementById('hero-next-live');
    if (!heroBadge) return;

    if (state.future.length > 0) {
      const next = state.future[0];
      heroBadge.innerHTML = `
        <span class="next-label">PROSSIMO LIVE</span>
        <span class="next-date"><strong>${next.day} ${next.month} ${next.year}</strong></span>
        <span class="next-sep">·</span>
        <span class="next-venue">${escapeHtml(next.venue)} (${escapeHtml(next.city || 'Campania')})</span>
      `;
      heroBadge.style.display = 'inline-flex';
    } else {
      heroBadge.style.display = 'none';
    }
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function init() {
    const tabButtons = document.querySelectorAll('[data-live-tab]');
    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        tabButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.activeTab = btn.getAttribute('data-live-tab');
        render();
      });
    });

    const searchInput = document.getElementById('live-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        state.searchQuery = e.target.value;
        render();
      });
    }

    loadData();
  }

  return {
    init,
    getState: () => state
  };
})();

document.addEventListener('DOMContentLoaded', CalendarModule.init);
