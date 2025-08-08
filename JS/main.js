(function() {
    let devToolsOpen = false;
    const threshold = 160;

    const blockedKeys = {
        123: true,
        85: true,
        73: true,
        67: true,
        74: true,
        19: true,
        83: true
    };

    function checkDevTools() {
        const start = performance.now();
        (function(){}).constructor("debugger")();
        const end = performance.now();
        return end - start > threshold;
    }
    
    function checkWindowSize() {
        return window.outerWidth - window.innerWidth > threshold || 
               window.outerHeight - window.innerHeight > threshold;
    }
    
    const element = new Image();
    Object.defineProperty(element, 'id', {
        get: function() {
            devToolsOpen = true;
        }
    });
    
    setInterval(function() {
        if (checkDevTools() || checkWindowSize() || devToolsOpen) {
            triggerLock();
        }
        
        devToolsOpen = false;
        console.log('%c', element);
        
    }, 1000);
    
    function triggerLock() {
        document.body.innerHTML = `
            <div style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: #000;
                display: flex;
                justify-content: center;
                align-items: center;
                flex-direction: column;
                z-index: 9999;
                color: #fff;
                font-family: Arial, sans-serif;
            ">
                <div class="loader" style="
                    border: 5px solid #f3f3f3;
                    border-top: 5px solid red;
                    border-radius: 50%;
                    width: 50px;
                    height: 50px;
                    animation: spin 2s linear infinite;
                    margin-bottom: 20px;
                "></div>
                <h2>ACESSO NÃO AUTORIZADO DETECTADO</h2>
                <p>O sistema está sendo protegido contra inspeção não autorizada</p>
            </div>
            <style>
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            </style>
        `;
        
        function blockAllKeys(e) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            return false;
        }
        
        document.addEventListener('keydown', blockAllKeys);
        document.addEventListener('contextmenu', blockAllKeys);
        document.addEventListener('mousedown', function(e) {
            if (e.button !== 0) {
                blockAllKeys(e);
            }
        });
        
        setInterval(() => {
            window.location.reload();
        }, 3000);
    }
    
    document.addEventListener('dragstart', function(e) {
        if (e.target.tagName === 'IMG' && e.button === 0) {
            return true;
        }
        e.preventDefault();
        triggerLock();
    });

    window.addEventListener('keydown', function(e) {
        if (blockedKeys[e.keyCode]) {
            e.preventDefault();
            triggerLock();
        }
        
        if ((e.ctrlKey || e.metaKey) && blockedKeys[e.keyCode]) {
            e.preventDefault();
            triggerLock();
        }
        
        if ((e.ctrlKey && e.shiftKey && blockedKeys[e.keyCode])) {
            e.preventDefault();
            triggerLock();
        }
    });
    
    window.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        triggerLock();
    });
    
    if (checkDevTools() || checkWindowSize()) {
        triggerLock();
    }
    
    window.addEventListener('beforeunload', function() {
        if (devToolsOpen) {
            return "Ação não permitida";
        }
    });
    
    if (window.top !== window.self) {
        window.top.location = window.self.location;
    }
    
    console.log = function() {};
    console.warn = function() {};
    console.error = function() {};
    console.info = function() {};
    console.debug = function() {};
    console.table = function() {};
    console.clear = function() {};
})();