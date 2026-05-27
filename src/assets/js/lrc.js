/* ============================================================
   LEGACY REVIVAL CENTER — Site JavaScript
   Countdown, Give page, Sermons page, Contact form,
   Newsletter form, and scroll fade-up animations
   ============================================================ */

/* ---------- Countdown Timer ---------- */
(function initCountdown() {
    const el = document.getElementById('lrc-countdown');
    if (!el) return;

    const storageKey = 'lrc_countdown_target';
    let target = localStorage.getItem(storageKey);
    if (!target) {
        const d = new Date();
        d.setDate(d.getDate() + 30);
        target = d.toISOString();
        localStorage.setItem(storageKey, target);
    }
    const targetDate = new Date(target);

    function pad(n) {
        return String(n).padStart(2, '0');
    }

    function tick() {
        const now  = new Date();
        const diff = targetDate - now;
        if (diff <= 0) {
            ['days', 'hours', 'minutes', 'seconds'].forEach(k => {
                const el2 = document.getElementById('cd-' + k);
                if (el2) el2.textContent = '00';
            });
            return;
        }
        const days    = Math.floor(diff / 86400000);
        const hours   = Math.floor((diff % 86400000) / 3600000);
        const minutes = Math.floor((diff % 3600000)  / 60000);
        const seconds = Math.floor((diff % 60000)    / 1000);

        const dEl = document.getElementById('cd-days');
        const hEl = document.getElementById('cd-hours');
        const mEl = document.getElementById('cd-minutes');
        const sEl = document.getElementById('cd-seconds');

        if (dEl) dEl.textContent = pad(days);
        if (hEl) hEl.textContent = pad(hours);
        if (mEl) mEl.textContent = pad(minutes);
        if (sEl) sEl.textContent = pad(seconds);
    }

    tick();
    setInterval(tick, 1000);
})();

/* ---------- Give Page: Amount Selector ---------- */
(function initGivePage() {
    const amountBtns  = document.querySelectorAll('.cs-amount-btn');
    const customInput = document.getElementById('lrc-custom-amount');
    if (!amountBtns.length) return;

    amountBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            amountBtns.forEach(b => b.classList.remove('cs-selected'));
            btn.classList.add('cs-selected');
            if (customInput) customInput.value = btn.dataset.amount;
        });
    });

    if (customInput) {
        customInput.addEventListener('input', () => {
            amountBtns.forEach(b => b.classList.remove('cs-selected'));
        });
    }
})();

/* ---------- Sermons Page: YouTube & Podcast RSS ---------- */
(function initSermonsPage() {
    const videoGrid   = document.getElementById('lrc-video-items');
    const podcastList = document.getElementById('lrc-podcast-list');
    if (!videoGrid && !podcastList) return;

    const PODCAST_RSS = 'https://feeds.buzzsprout.com/1908759.rss';
    const YOUTUBE_RSS = 'https://www.youtube.com/feeds/videos.xml?playlist_id=PL6WeXBVh4a5Zxrw9AkMqpjtSvq1DhUaex';
    const RSS2JSON    = 'https://api.rss2json.com/v1/api.json?rss_url=';

    function formatDate(str) {
        return new Date(str).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }

    function escHtml(str) {
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    // YouTube featured videos (skip first/latest, show next 3)
    if (videoGrid) {
        fetch(RSS2JSON + encodeURIComponent(YOUTUBE_RSS))
            .then(r => r.json())
            .then(data => {
                if (!data.items || !data.items.length) throw new Error('No items');
                const videos = data.items.slice(1, 7);
                videoGrid.innerHTML = '';
                videos.forEach(v => {
                    const videoId = (v.link.split('v=')[1] || '').split('&')[0] || v.guid.split(':')[2];
                    const date    = formatDate(v.pubDate);
                    const card    = document.createElement('a');
                    card.className = 'cs-video-card cs-fade-up';
                    card.href      = `https://www.youtube.com/watch?v=${encodeURIComponent(videoId)}`;
                    card.target    = '_blank';
                    card.rel       = 'noopener noreferrer';
                    card.innerHTML = `
                        <div class="cs-video-thumb">
                            <img src="https://img.youtube.com/vi/${escHtml(videoId)}/hqdefault.jpg"
                                 alt="${escHtml(v.title)}" loading="lazy" width="480" height="360">
                            <div class="cs-video-play" aria-hidden="true">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                    <circle cx="12" cy="12" r="12" fill="rgba(0,0,0,0.55)"/>
                                    <polygon points="9.5 7.5 18 12 9.5 16.5" fill="#fff"/>
                                </svg>
                            </div>
                        </div>
                        <p class="cs-video-date">${escHtml(date)}</p>
                        <h3 class="cs-video-title">${escHtml(v.title)}</h3>
                    `;
                    videoGrid.appendChild(card);
                });
                observeFadeUps();
            })
            .catch(() => {
                videoGrid.innerHTML = '<p class="text-muted" style="padding:2rem 0;">Unable to load videos at this time.</p>';
            });
    }

    // Podcast RSS
    if (podcastList) {
        fetch(RSS2JSON + encodeURIComponent(PODCAST_RSS))
            .then(r => r.json())
            .then(data => {
                if (!data.items || !data.items.length) throw new Error('No items');
                const episodes = data.items.slice(0, 4);
                podcastList.innerHTML = '';
                episodes.forEach(ep => {
                    const date     = formatDate(ep.pubDate);
                    const audioSrc = ep.enclosure && ep.enclosure.link ? ep.enclosure.link : '';
                    const item     = document.createElement('div');
                    item.className = 'cs-podcast-item cs-fade-up';
                    item.innerHTML = `
                        <div class="cs-podcast-meta">
                            <div class="cs-podcast-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/>
                                </svg>
                            </div>
                            <div class="cs-podcast-info">
                                <h3>${escHtml(ep.title)}</h3>
                                <span class="cs-date">${escHtml(date)}</span>
                            </div>
                        </div>
                        <div class="cs-podcast-audio">
                            ${audioSrc
                                ? `<audio controls><source src="${escHtml(audioSrc)}" type="audio/mpeg">Your browser does not support audio.</audio>`
                                : '<p class="text-muted" style="font-size:.8rem;">No audio available</p>'}
                        </div>
                    `;
                    podcastList.appendChild(item);
                });
                observeFadeUps();
            })
            .catch(() => {
                podcastList.innerHTML = '<div style="padding:2rem 0;"><p class="text-muted">Unable to load podcast episodes at this time.</p></div>';
            });
    }
})();

/* ---------- Contact Form ---------- */
(function initContactForm() {
    const form = document.getElementById('lrc-contact-form');
    if (!form) return;

    form.addEventListener('submit', e => {
        e.preventDefault();
        const firstName = (form.querySelector('#lrc-firstName') || {}).value || '';
        const lastName  = (form.querySelector('#lrc-lastName')  || {}).value || '';
        const email     = (form.querySelector('#lrc-email')     || {}).value || '';
        const message   = (form.querySelector('#lrc-message')   || {}).value || '';
        const subject   = encodeURIComponent('Message from Legacy Revival Website');
        const body      = encodeURIComponent(`Name: ${firstName} ${lastName}\nEmail: ${email}\n\n${message}`);
        window.location.href = `mailto:dan@legacyrevival.org?subject=${subject}&body=${body}`;
    });
})();

/* ---------- Newsletter Forms ---------- */
(function initNewsletterForms() {
    document.querySelectorAll('.cs-newsletter-form').forEach(form => {
        form.addEventListener('submit', e => {
            e.preventDefault();
            const input = form.querySelector('input[type="email"]');
            if (input && input.value) {
                input.value = '';
                const btn = form.querySelector('button');
                if (btn) {
                    const orig = btn.textContent;
                    btn.textContent = 'Subscribed!';
                    setTimeout(() => { btn.textContent = orig; }, 3000);
                }
            }
        });
    });
})();

/* ---------- Scroll Fade-Up Animations ---------- */
function observeFadeUps() {
    if (!('IntersectionObserver' in window)) {
        // Fallback: just show everything
        document.querySelectorAll('.cs-fade-up').forEach(el => el.classList.add('cs-visible'));
        return;
    }

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('cs-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.08 });

    document.querySelectorAll('.cs-fade-up:not(.cs-visible)').forEach(el => observer.observe(el));
}

document.addEventListener('DOMContentLoaded', () => {
    observeFadeUps();
    // Update footer year if static template can't
    const yearEl = document.getElementById('lrc-footer-year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
});
