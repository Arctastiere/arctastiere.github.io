(function () {
    var header = document.querySelector('header');
    if (!header) return;

    var SHRINK_AT = 120; // scroll oltre il quale il logo si rimpicciolisce
    var GROW_AT = 20;    // scroll sotto il quale il logo torna grande

    // Spazio invisibile che tiene il posto dell'header grande
    var spacer = document.createElement('div');
    spacer.setAttribute('aria-hidden', 'true');
    header.parentNode.insertBefore(spacer, header);

    function measure() {
        var wasSmall = header.classList.contains('header-small');
        header.classList.add('no-anim');
        header.classList.remove('header-small');
        var h = header.offsetHeight;
        if (wasSmall) header.classList.add('header-small');
        spacer.style.height = h + 'px';
        void header.offsetHeight;
        header.classList.remove('no-anim');
    }

    measure();
    header.classList.add('header-fixed');

    var small = false;
    var ticking = false;

    function update() {
        ticking = false;
        var y = Math.max(0, window.scrollY || document.documentElement.scrollTop || 0);
        if (!small && y > SHRINK_AT) {
            small = true;
            header.classList.add('header-small');
        } else if (small && y < GROW_AT) {
            small = false;
            header.classList.remove('header-small');
        }
    }

    function onScroll() {
        if (!ticking) {
            ticking = true;
            window.requestAnimationFrame(update);
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', measure);
    window.addEventListener('load', measure);
    update();
})();
