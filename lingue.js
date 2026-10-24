/* ==========================================================
   CAMBIO LINGUA - A.R.C.
   Aggiunge da solo, in fondo alla pagina subito prima dei
   contatti (<footer>), il selettore delle lingue con le
   bandierine, con i link alla stessa pagina nelle altre lingue.
   La lingua corrente è presa da <html lang="...">.

   Per accendere o spegnere una lingua basta aggiungerla
   o toglierla dall'elenco ATTIVE qui sotto.
   Va caricato PRIMA di header.js:
   <script src="/lingue.js" defer></script>
   ========================================================== */
(function () {
    /* Lingue mostrate nel selettore */
    var ATTIVE = ['it', 'en', 'fr', 'de', 'es', 'pt', 'hu'];

    /* Ordine in cui compaiono i link */
    var ORDINE = ['it', 'en', 'fr', 'de', 'es', 'pt', 'hu'];

    var NOMI = {
        it: 'Versione italiana',
        en: 'English version',
        fr: 'Version française',
        de: 'Deutsche Version',
        es: 'Versión en español',
        pt: 'Versão em português',
        hu: 'Magyar verzió'
    };

    /* Scritta accanto alle bandierine, nella lingua della pagina */
    var ETICHETTA = {
        it: 'Lingua', en: 'Language', fr: 'Langue', de: 'Sprache',
        es: 'Idioma', pt: 'Idioma', hu: 'Nyelv'
    };

    /* Bandierine disegnate (funzionano su tutti i telefoni e computer) */
    function tricolore(v, c1, c2, c3) {
        return v
            ? '<svg viewBox="0 0 3 2"><rect width="1" height="2" fill="' + c1 + '"/><rect x="1" width="1" height="2" fill="' + c2 + '"/><rect x="2" width="1" height="2" fill="' + c3 + '"/></svg>'
            : '<svg viewBox="0 0 3 2"><rect width="3" height="0.67" fill="' + c1 + '"/><rect y="0.67" width="3" height="0.67" fill="' + c2 + '"/><rect y="1.33" width="3" height="0.67" fill="' + c3 + '"/></svg>';
    }
    var BANDIERE = {
        it: tricolore(true, '#009246', '#ffffff', '#ce2b37'),
        fr: tricolore(true, '#0055a4', '#ffffff', '#ef4135'),
        de: tricolore(false, '#000000', '#dd0000', '#ffce00'),
        hu: tricolore(false, '#ce2939', '#ffffff', '#477050'),
        es: '<svg viewBox="0 0 3 2"><rect width="3" height="2" fill="#aa151b"/><rect y="0.5" width="3" height="1" fill="#f1bf00"/></svg>',
        pt: '<svg viewBox="0 0 3 2"><rect width="3" height="2" fill="#ff0000"/><rect width="1.2" height="2" fill="#006600"/><circle cx="1.2" cy="1" r="0.36" fill="none" stroke="#ffcc00" stroke-width="0.12"/></svg>',
        en: '<svg viewBox="0 0 60 30"><clipPath id="uj-t"><path d="M30,15h30v15zv15h-30zh-30v-15zv-15h30z"/></clipPath><rect width="60" height="30" fill="#012169"/><path d="M0,0L60,30M60,0L0,30" stroke="#ffffff" stroke-width="6"/><path d="M0,0L60,30M60,0L0,30" clip-path="url(#uj-t)" stroke="#c8102e" stroke-width="4"/><path d="M30,0v30M0,15h60" stroke="#ffffff" stroke-width="10"/><path d="M30,0v30M0,15h60" stroke="#c8102e" stroke-width="6"/></svg>'
    };

    /* Corrispondenze tra le pagine: una riga per pagina */
    var PAGINE = [
        { it: '/', en: '/en/index.html', fr: '/fr/index.html', de: '/de/index.html', es: '/es/index.html', pt: '/pt/index.html', hu: '/hu/index.html' },
        { it: '/chi-siamo.html', en: '/en/about-us.html', fr: '/fr/a-propos.html', de: '/de/ueber-uns.html', es: '/es/quienes-somos.html', pt: '/pt/quem-somos.html', hu: '/hu/rolunk.html' },
        { it: '/servizi.html', en: '/en/services.html', fr: '/fr/services.html', de: '/de/leistungen.html', es: '/es/servicios.html', pt: '/pt/servicos.html', hu: '/hu/szolgaltatasok.html' },
        { it: '/tastiere-nuove.html', en: '/en/new-keyboards.html', fr: '/fr/claviers-neufs.html', de: '/de/neue-klaviaturen.html', es: '/es/teclados-nuevos.html', pt: '/pt/teclados-novos.html', hu: '/hu/uj-billentyuzetek.html' },
        { it: '/dotazione-elettrica.html', en: '/en/electrical-keyboards.html', fr: '/fr/equipement-electrique.html', de: '/de/elektrische-ausstattung.html', es: '/es/equipamiento-electrico.html', pt: '/pt/equipamento-eletrico.html', hu: '/hu/elektromos-felszereles.html' },
        { it: '/restauro-tastiere.html', en: '/en/keyboard-restoration.html', fr: '/fr/restauration-claviers.html', de: '/de/restaurierung-klaviaturen.html', es: '/es/restauracion-teclados.html', pt: '/pt/restauro-teclados.html', hu: '/hu/billentyuzetek-restauralasa.html' },
        { it: '/galleria.html', en: '/en/gallery.html', fr: '/fr/galerie.html', de: '/de/galerie.html', es: '/es/galeria.html', pt: '/pt/galeria.html', hu: '/hu/galeria.html' },
        { it: '/news.html', en: '/en/news.html', fr: '/fr/actualites.html', de: '/de/aktuelles.html', es: '/es/noticias.html', pt: '/pt/noticias.html', hu: '/hu/hirek.html' },
        { it: '/contatti.html', en: '/en/contacts.html', fr: '/fr/contact.html', de: '/de/kontakt.html', es: '/es/contacto.html', pt: '/pt/contacto.html', hu: '/hu/kapcsolat.html' }
    ];

    /* Rende confrontabili "/", "/index.html", "/en/", "/en/about-us" ecc. */
    function normalizza(percorso) {
        percorso = (percorso || '/').toLowerCase();
        if (percorso.charAt(percorso.length - 1) === '/') percorso += 'index.html';
        if (!/\.html$/.test(percorso)) percorso += '.html';
        if (percorso === '/index.html') percorso = '/';
        return percorso;
    }

    var corrente = (document.documentElement.lang || 'it').slice(0, 2).toLowerCase();
    var qui = normalizza(location.pathname);

    var pagina = null;
    for (var i = 0; i < PAGINE.length; i++) {
        if (normalizza(PAGINE[i][corrente]) === qui) { pagina = PAGINE[i]; break; }
    }
    if (!pagina) pagina = PAGINE[0];

    var footer = document.querySelector('footer');
    if (!footer) return;

    var box = document.createElement('nav');
    box.className = 'selettore-lingue';
    box.setAttribute('aria-label', ETICHETTA[corrente] || ETICHETTA.it);
    var titolo = document.createElement('p');
    titolo.className = 'selettore-titolo';
    titolo.textContent = ETICHETTA[corrente] || ETICHETTA.it;
    box.appendChild(titolo);
    var ul = document.createElement('ul');

    ORDINE.forEach(function (codice) {
        if (ATTIVE.indexOf(codice) === -1 || !pagina[codice]) return;
        var li = document.createElement('li');
        var el;
        if (codice === corrente) {
            /* la lingua che si sta guardando: evidenziata, non cliccabile */
            el = document.createElement('span');
            el.className = 'lingua-corrente';
            el.setAttribute('aria-current', 'true');
        } else {
            el = document.createElement('a');
            el.className = 'cambio-lingua';
            el.href = pagina[codice] + location.hash;
            el.hreflang = codice;
        }
        el.lang = codice;
        el.title = NOMI[codice];
        el.innerHTML = '<span class="bandiera" aria-hidden="true">' + BANDIERE[codice] + '</span>' + codice.toUpperCase();
        li.appendChild(el);
        ul.appendChild(li);
    });

    box.appendChild(ul);
    footer.parentNode.insertBefore(box, footer);
})();
