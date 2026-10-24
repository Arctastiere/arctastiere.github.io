/* ==========================================================
   CAMBIO LINGUA - A.R.C.
   Aggiunge da solo nel menu ("header nav ul") i link alle
   altre lingue della pagina che si sta guardando.
   La lingua corrente è presa da <html lang="...">.

   Per accendere o spegnere una lingua nel menu basta
   aggiungerla o toglierla dall'elenco ATTIVE qui sotto.
   Va caricato PRIMA di header.js:
   <script src="/lingue.js" defer></script>
   ========================================================== */
(function () {
    /* Lingue mostrate nel menu (solo quelle complete e controllate) */
    var ATTIVE = ['it', 'en'];

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

    var menu = document.querySelector('header nav ul');
    if (!menu) return;

    var altre = ORDINE.filter(function (codice) {
        return codice !== corrente && ATTIVE.indexOf(codice) !== -1 && pagina[codice];
    });

    /* Con tre o più lingue, su telefono vanno a capo tutte insieme (vedi extra.css) */
    if (altre.length >= 3) {
        var aCapo = document.createElement('li');
        aCapo.className = 'a-capo-lingue';
        aCapo.setAttribute('aria-hidden', 'true');
        menu.appendChild(aCapo);
    }

    altre.forEach(function (codice) {
        var li = document.createElement('li');
        var a = document.createElement('a');
        a.className = 'cambio-lingua';
        a.href = pagina[codice] + location.hash;
        a.hreflang = codice;
        a.lang = codice;
        a.title = NOMI[codice];
        a.textContent = codice.toUpperCase();
        li.appendChild(a);
        menu.appendChild(li);
    });
})();
