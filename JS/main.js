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

// CLIQUE

function injetarCursorPremiumStrong() {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (isMobile) return;

    const cursorId = 'cursor-system-strong-red';

    document.getElementById(cursorId)?.remove();
    document.getElementById(cursorId + '-style')?.remove();

    const cursorContainer = document.createElement('div');
    cursorContainer.id = cursorId;

    const cursorDot = document.createElement('div');
    cursorDot.className = 'cursor-dot';
    const cursorRing = document.createElement('div');
    cursorRing.className = 'cursor-ring';

    cursorContainer.append(cursorRing, cursorDot);
    document.body.appendChild(cursorContainer);

    const estilo = document.createElement('style');
    estilo.id = cursorId + '-style';
    estilo.textContent = `
        body, a, button, input, textarea, .clickable, .kyJCxd { cursor: none !important; }
        #${cursorId} { position: fixed; top:0; left:0; width:100%; height:100%; pointer-events:none; z-index:9999999; overflow:hidden; }
        
        :root { 
            --red-deep: #cc0000;       /* Vermelho escuro para o ponto central */
            --red-vibrant: #ff0000;    /* Vermelho vibrante para o clique */
            --red-glow: rgba(255, 0, 0, 0.5); /* Brilho vermelho */
        }

        .cursor-dot {
            position:absolute; width:6px; height:6px;
            background: var(--red-deep); border-radius:50%;
            transform:translate(-50%,-50%);
            box-shadow: 0 0 10px rgba(204, 0, 0, 0.8);
            transition: background 0.2s, width 0.2s, height 0.2s;
            z-index:2;
        }

        .cursor-ring {
            position:absolute; width:24px; height:24px;
            border: 2px solid rgba(255, 0, 0, 0.4);
            background: rgba(255, 0, 0, 0.05);
            border-radius:50%;
            transform:translate(-50%,-50%);
            z-index:1;
            transition: width 0.25s cubic-bezier(0.25,1,0.5,1),
                        height 0.25s cubic-bezier(0.25,1,0.5,1),
                        background 0.25s,
                        border-color 0.25s;
        }

        /* Efeito ao passar o mouse em links/botões */
        body.is-hovering .cursor-ring { 
            width:36px; 
            height:36px; 
            background: rgba(255, 0, 0, 0.15); 
            border-color: rgba(255, 0, 0, 0.8); 
        }

        /* Efeito ao clicar */
        body.is-clicking .cursor-ring { 
            width:16px; 
            height:16px; 
            background: var(--red-vibrant); 
            border-color: transparent; 
            transition: all 0.1s ease; 
        }
        body.is-clicking .cursor-dot { 
            width:8px; 
            height:8px; 
            background: var(--red-vibrant); 
        }
    `;
    document.head.appendChild(estilo);

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let currentX = mouseX;
    let currentY = mouseY;

    const lerp = (start, end, amt) => start + (end - start) * amt;

    document.addEventListener('mousemove', e => { 
        mouseX = e.clientX; 
        mouseY = e.clientY; 
    }, { passive: true });

    const render = () => {
        currentX = lerp(currentX, mouseX, 0.2);
        currentY = lerp(currentY, mouseY, 0.2);
        const transformCSS = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%)`;
        cursorDot.style.transform = transformCSS;
        cursorRing.style.transform = transformCSS;
        requestAnimationFrame(render);
    };
    requestAnimationFrame(render);

    const interactiveSelector = 'a, button, input, textarea, label, select, .kyJCxd';
    document.addEventListener('mouseover', e => {
        document.body.classList.toggle('is-hovering', e.target.matches(interactiveSelector) || e.target.closest(interactiveSelector));
    });

    const startClick = () => document.body.classList.add('is-clicking');
    const endClick = () => document.body.classList.remove('is-clicking');

    document.addEventListener('mousedown', startClick);
    document.addEventListener('mouseup', endClick);

    document.addEventListener('mouseleave', () => cursorContainer.style.opacity = '0');
    document.addEventListener('mouseenter', () => cursorContainer.style.opacity = '1');
}

injetarCursorPremiumStrong();