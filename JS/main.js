(function() {
    // Configurações
    let devToolsOpen = false;
    const threshold = 160;
    const reloadDelay = 3000;
    
    // Teclas bloqueadas (F12, Ctrl+U, Ctrl+Shift+I, etc.)
    const blockedKeys = {
        123: true, // F12
        85: true,  // Ctrl+U
        73: true,  // Ctrl+Shift+I
        67: true,  // Ctrl+Shift+C
        74: true,  // Ctrl+Shift+J
        19: true,  // Ctrl+Pause/Break
        83: true   // Ctrl+S
    };

    // Verifica se DevTools está aberto pelo tempo de debugger
    function checkDevTools() {
        const start = performance.now();
        (function(){}).constructor("debugger")();
        const end = performance.now();
        return end - start > threshold;
    }
    
    // Verifica pelo tamanho da janela (DevTools aberto muda isso)
    function checkWindowSize() {
        return window.outerWidth - window.innerWidth > threshold || 
               window.outerHeight - window.innerHeight > threshold;
    }
    
    // Detecção por console.log especial
    const element = new Image();
    Object.defineProperty(element, 'id', {
        get: function() {
            devToolsOpen = true;
        }
    });
    
    // Verificação periódica
    setInterval(function() {
        if (checkDevTools() || checkWindowSize() || devToolsOpen) {
            triggerLock();
        }
        
        devToolsOpen = false;
        console.log('%c', element);
    }, 1000);
    
    // Cria a tela de bloqueio
    function triggerLock() {
        // Remove event listeners para evitar múltiplas execuções
        document.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('contextmenu', handleContextMenu);
        window.removeEventListener('dragstart', handleDragStart);
        
        // Cria elementos manualmente (mais confiável que innerHTML)
        const blocker = document.createElement('div');
        blocker.id = 'devtools-blocker';
        blocker.style.cssText = `
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
        `;
        
        const loader = document.createElement('div');
        loader.style.cssText = `
            border: 5px solid #f3f3f3;
            border-top: 5px solid red;
            border-radius: 50%;
            width: 50px;
            height: 50px;
            animation: spin 2s linear infinite;
            margin-bottom: 20px;
        `;
        
        const title = document.createElement('h2');
        title.textContent = 'ACESSO NÃO AUTORIZADO DETECTADO';
        
        const message = document.createElement('p');
        message.textContent = 'O sistema está sendo protegido contra inspeção não autorizada';
        
        blocker.appendChild(loader);
        blocker.appendChild(title);
        blocker.appendChild(message);
        
        // Remove elementos antigos se existirem
        const oldBlocker = document.getElementById('devtools-blocker');
        if (oldBlocker) {
            oldBlocker.remove();
        }
        
        document.body.appendChild(blocker);
        
        // Adiciona animação CSS dinamicamente
        const style = document.createElement('style');
        style.textContent = `
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
        
        // Bloqueia interações
        function blockInteraction(e) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            return false;
        }
        
        document.addEventListener('keydown', blockInteraction, true);
        document.addEventListener('contextmenu', blockInteraction, true);
        document.addEventListener('mousedown', blockInteraction, true);
        
        // Recarrega a página (método alternativo)
        setTimeout(() => {
            window.location.reload();
        }, 3000);
    }
    
    // Handlers de eventos
    function handleKeyDown(e) {
        if (blockedKeys[e.keyCode] || 
            (e.ctrlKey && blockedKeys[e.keyCode]) || 
            (e.ctrlKey && e.shiftKey && blockedKeys[e.keyCode])) {
            e.preventDefault();
            triggerLock();
        }
    }
    
    function handleContextMenu(e) {
        e.preventDefault();
        triggerLock();
    }
    
    function handleDragStart(e) {
        e.preventDefault();
        triggerLock();
    }
    
    // Configura eventos
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('dragstart', handleDragStart);
    
    // Verificação inicial
    if (checkDevTools() || checkWindowSize()) {
        triggerLock();
    }
    
    // Proteção contra iframes
    if (window.top !== window.self) {
        window.top.location = window.self.location;
    }
    
    // Bloqueia console
    console.log = function() {};
    console.warn = function() { triggerLock(); };
    console.error = function() { triggerLock(); };
    console.info = function() { triggerLock(); };
    
})();
