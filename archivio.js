/* ==========================================================
   SCORRIMENTO FOTO D'ARCHIVIO - pagine "Chi siamo"
   Frecce e contatore per le foto in .archivio-wrap
   (col dito si scorre da soli). Il clic sulla foto apre lo
   schermo intero già presente nella pagina (.foto-zoom).
   ========================================================== */
(function () {
    Array.prototype.forEach.call(document.querySelectorAll('.archivio-wrap'), function (wrap) {
        var slider = wrap.querySelector('.archivio-slider');
        var foto = slider.querySelectorAll('img');
        var btnP = wrap.querySelector('.archivio-prec');
        var btnS = wrap.querySelector('.archivio-succ');
        var conta = wrap.querySelector('.archivio-conta');
        var n = foto.length;

        function corrente() {
            return Math.round(slider.scrollLeft / slider.clientWidth);
        }
        function vai(i) {
            i = Math.max(0, Math.min(n - 1, i));
            slider.scrollTo({ left: i * slider.clientWidth, behavior: 'smooth' });
        }
        function aggiorna() {
            var i = Math.max(0, Math.min(n - 1, corrente()));
            conta.textContent = (i + 1) + ' / ' + n;
            btnP.disabled = (i === 0);
            btnS.disabled = (i === n - 1);
        }

        wrap.classList.add('attivo');
        btnP.addEventListener('click', function () { vai(corrente() - 1); });
        btnS.addEventListener('click', function () { vai(corrente() + 1); });
        slider.addEventListener('scroll', aggiorna, { passive: true });
        window.addEventListener('resize', aggiorna);
        aggiorna();
    });
})();
