/* ==========================================================
   LOGICA DELLA GALLERIA - usata da galleria.html e en/gallery.html
   Legge i gruppi da galleria-gruppi.js (window.GALLERIA_GRUPPI)
   e usa la lingua indicata in <html lang="...">.
   ========================================================== */
(function () {
    var lingua = (document.documentElement.lang || 'it').slice(0, 2);

    var TESTI = {
        it: { prec: 'Foto precedente', succ: 'Foto successiva', nessuno: 'Galleria momentaneamente non disponibile.' },
        en: { prec: 'Previous photo', succ: 'Next photo', nessuno: 'Gallery temporarily unavailable.' },
        fr: { prec: 'Photo précédente', succ: 'Photo suivante', nessuno: 'Galerie momentanément indisponible.' },
        de: { prec: 'Vorheriges Foto', succ: 'Nächstes Foto', nessuno: 'Galerie vorübergehend nicht verfügbar.' }
    };
    var T = TESTI[lingua] || TESTI.it;

    function tr(testo) {
        if (!testo) return '';
        if (typeof testo === 'string') return testo;
        return testo[lingua] || testo.it || '';
    }
    function el(tag, classe, testo) {
        var e = document.createElement(tag);
        if (classe) e.className = classe;
        if (testo) e.textContent = testo;
        return e;
    }

    /* ---------- Costruzione dei gruppi dai dati ---------- */
    var contenitore = document.getElementById('gruppi-galleria');
    var dati = window.GALLERIA_GRUPPI || [];

    if (!dati.length) {
        contenitore.appendChild(el('p', '', T.nessuno));
    }

    dati.forEach(function (g) {
        var gruppo = el('div', 'gruppo');
        if (g.id) gruppo.id = g.id;
        gruppo.appendChild(el('h3', '', tr(g.titolo)));
        gruppo.appendChild(el('p', 'gruppo-desc', tr(g.descrizione)));

        var wrap = el('div', 'slider-wrap');

        var bp = el('button', 'sl-btn sl-prec', '\u2039');
        bp.type = 'button';
        bp.setAttribute('aria-label', T.prec);
        var bs = el('button', 'sl-btn sl-succ', '\u203A');
        bs.type = 'button';
        bs.setAttribute('aria-label', T.succ);
        wrap.appendChild(bp);
        wrap.appendChild(bs);
        wrap.appendChild(el('div', 'sl-conta', '1 / ' + g.foto.length));

        var slider = el('div', 'slider');
        g.foto.forEach(function (f, i) {
            var fig = el('figure', 'slide');
            var im = document.createElement('img');
            im.src = '/' + f.file;
            if (f.w) im.width = f.w;
            if (f.h) im.height = f.h;
            im.alt = tr(f.alt);
            im.draggable = false;
            if (i > 0) im.loading = 'lazy';
            fig.appendChild(im);
            fig.appendChild(el('figcaption', '', tr(f.did)));
            slider.appendChild(fig);
        });
        wrap.appendChild(slider);
        gruppo.appendChild(wrap);
        contenitore.appendChild(gruppo);
    });

    /* se l'indirizzo contiene #nome-gruppo, vai a quel gruppo */
    if (location.hash) {
        var bersaglio = document.getElementById(location.hash.slice(1));
        if (bersaglio) bersaglio.scrollIntoView();
    }

    /* ---------- Slider dei gruppi ---------- */
    var gruppi = Array.prototype.slice.call(document.querySelectorAll('.slider-wrap'));
    var gruppoAttivo = null;
    var trascinato = false;

    gruppi.forEach(function (wrap) {
        var slider = wrap.querySelector('.slider');
        var slides = slider.querySelectorAll('.slide');
        var btnP = wrap.querySelector('.sl-prec');
        var btnS = wrap.querySelector('.sl-succ');
        var conta = wrap.querySelector('.sl-conta');
        var n = slides.length;

        function corrente() {
            return Math.round(slider.scrollLeft / slider.clientWidth);
        }
        function vai(i, liscio) {
            i = Math.max(0, Math.min(n - 1, i));
            slider.scrollTo({ left: i * slider.clientWidth, behavior: liscio === false ? 'auto' : 'smooth' });
        }
        function aggiorna() {
            var i = Math.max(0, Math.min(n - 1, corrente()));
            conta.textContent = (i + 1) + ' / ' + n;
            btnP.disabled = (i === 0);
            btnS.disabled = (i === n - 1);
        }

        wrap._vai = vai;

        if (n < 2) {
            btnP.style.display = 'none';
            btnS.style.display = 'none';
            conta.style.display = 'none';
        }

        btnP.addEventListener('click', function () { vai(corrente() - 1); });
        btnS.addEventListener('click', function () { vai(corrente() + 1); });
        slider.addEventListener('scroll', aggiorna, { passive: true });
        window.addEventListener('resize', function () { vai(corrente(), false); aggiorna(); });
        aggiorna();

        /* Trascinamento col mouse (col dito scorre da solo) */
        var giu = false, x0 = 0, scroll0 = 0, indice0 = 0, spostato = false;

        slider.addEventListener('mousedown', function (e) {
            if (e.button !== 0) return;
            giu = true;
            spostato = false;
            x0 = e.clientX;
            scroll0 = slider.scrollLeft;
            indice0 = corrente();
            slider.classList.add('trascina');
            e.preventDefault();
        });
        window.addEventListener('mousemove', function (e) {
            if (!giu) return;
            var dx = e.clientX - x0;
            if (Math.abs(dx) > 5) spostato = true;
            slider.scrollLeft = scroll0 - dx;
        });
        window.addEventListener('mouseup', function (e) {
            if (!giu) return;
            giu = false;
            slider.classList.remove('trascina');
            var dx = e.clientX - x0;
            if (Math.abs(dx) > 50) {
                vai(dx < 0 ? indice0 + 1 : indice0 - 1);
            } else {
                vai(indice0);
            }
            if (spostato) {
                trascinato = true;
                setTimeout(function () { trascinato = false; }, 50);
            }
        });
    });

    /* ---------- Schermo intero ---------- */
    var box = document.getElementById('lightbox');
    var img = document.getElementById('lightbox-img');
    var did = document.getElementById('lightbox-didascalia');
    var contaLb = document.getElementById('lightbox-contatore');
    var btnPrec = document.getElementById('lightbox-prec');
    var btnSucc = document.getElementById('lightbox-succ');
    var foto = [];
    var indice = 0;
    var appenaScorso = false;

    function mostra(i) {
        if (!foto.length) return;
        indice = (i + foto.length) % foto.length;
        var f = foto[indice];
        var fig = f.closest('figure');
        var cap = fig ? fig.querySelector('figcaption') : null;
        img.src = f.currentSrc || f.src;
        img.alt = f.alt;
        did.textContent = cap ? cap.textContent : '';
        did.style.display = cap ? 'block' : 'none';
        contaLb.textContent = foto.length > 1 ? (indice + 1) + ' / ' + foto.length : '';

        /* precarica le foto vicine per uno scorrimento fluido */
        if (foto.length > 1) {
            new Image().src = foto[(indice + 1) % foto.length].src;
            new Image().src = foto[(indice - 1 + foto.length) % foto.length].src;
        }
    }

    function apri(wrap, i) {
        gruppoAttivo = wrap;
        foto = Array.prototype.slice.call(wrap.querySelectorAll('.slide img'));
        var piu = foto.length > 1;
        btnPrec.style.display = piu ? 'flex' : 'none';
        btnSucc.style.display = piu ? 'flex' : 'none';
        mostra(i);
        box.classList.add('aperto');
        document.body.style.overflow = 'hidden';
    }

    function chiudi() {
        box.classList.remove('aperto');
        document.body.style.overflow = '';
        img.src = '';
        /* riporta lo slider sulla foto vista per ultima */
        if (gruppoAttivo && gruppoAttivo._vai) gruppoAttivo._vai(indice, false);
    }

    gruppi.forEach(function (wrap) {
        var imgs = wrap.querySelectorAll('.slide img');
        Array.prototype.forEach.call(imgs, function (f, i) {
            f.addEventListener('click', function () {
                if (trascinato) return;
                apri(wrap, i);
            });
        });
    });

    btnPrec.addEventListener('click', function (e) { e.stopPropagation(); mostra(indice - 1); });
    btnSucc.addEventListener('click', function (e) { e.stopPropagation(); mostra(indice + 1); });
    document.getElementById('lightbox-chiudi').addEventListener('click', function (e) {
        e.stopPropagation();
        chiudi();
    });

    /* Tocco o click sullo sfondo (non sulla foto) chiude */
    box.addEventListener('click', function (e) {
        if (appenaScorso) return;
        if (e.target === img) return;
        if (e.target === box || e.target === did || e.target === contaLb) chiudi();
    });

    /* Scorrimento col dito o trascinando col mouse */
    var startX = null, startY = null;
    box.addEventListener('pointerdown', function (e) {
        startX = e.clientX;
        startY = e.clientY;
    });
    box.addEventListener('pointerup', function (e) {
        if (startX === null) return;
        var dx = e.clientX - startX;
        var dy = e.clientY - startY;
        startX = null;
        startY = null;
        if (foto.length > 1 && Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
            mostra(dx > 0 ? indice - 1 : indice + 1);
            appenaScorso = true;
            setTimeout(function () { appenaScorso = false; }, 100);
        }
    });
    box.addEventListener('pointercancel', function () {
        startX = null;
        startY = null;
    });

    document.addEventListener('keydown', function (e) {
        if (!box.classList.contains('aperto')) return;
        if (e.key === 'Escape') chiudi();
        if (e.key === 'ArrowLeft') mostra(indice - 1);
        if (e.key === 'ArrowRight') mostra(indice + 1);
    });
})();
