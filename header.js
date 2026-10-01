(function () {
    var header = document.querySelector('header');
    if (!header) return;
    var small = false;
    function update() {
        var y = window.scrollY || document.documentElement.scrollTop;
        if (!small && y > 80) { small = true; header.classList.add('header-small'); }
        else if (small && y < 10) { small = false; header.classList.remove('header-small'); }
    }
    window.addEventListener('scroll', update, { passive: true });
    update();
})();
