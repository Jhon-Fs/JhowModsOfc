(function () {

    let triggered = false;
    const threshold = 160;

    function redirect() {
        if (!triggered) {
            triggered = true;
            window.location.href = "https://google.com";
        }
    }

    async function detectBrave() {
        if (navigator.brave && typeof navigator.brave.isBrave === "function") {
            const isBrave = await navigator.brave.isBrave();
            if (isBrave) redirect();
        }
    }

    function detectSize() {
        return (
            window.outerWidth - window.innerWidth > threshold ||
            window.outerHeight - window.innerHeight > threshold
        );
    }

    function detectDebugger() {
        const start = performance.now();
        debugger;
        const end = performance.now();
        return (end - start) > 100;
    }

    function detectConsole() {
        const element = new Image();
        Object.defineProperty(element, 'id', {
            get: function () {
                redirect();
            }
        });
        console.log(element);
    }

    document.addEventListener("keydown", function (e) {

        if (
            e.key === "F12" ||
            (e.ctrlKey && e.shiftKey && ["I", "J", "C"].includes(e.key.toUpperCase())) ||
            (e.ctrlKey && e.key.toUpperCase() === "U")
        ) {
            e.preventDefault();
            redirect();
        }
    });

    document.addEventListener("contextmenu", function (e) {
        e.preventDefault();
        redirect();
    });


    function check() {
        if (detectSize() || detectDebugger()) {
            redirect();
        }
    }

    window.addEventListener("resize", check);
    setInterval(check, 1000);

    detectConsole();
    detectBrave();

})();

function isChrome() {
    return /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
}

if (isChrome()) {
    setInterval(() => {
        const before = performance.now();
        debugger;
        const after = performance.now();

        if (after - before > 100) {
            window.location.href = "https://google.com";
        }
    }, 1000);
}