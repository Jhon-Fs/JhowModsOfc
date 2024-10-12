// Proteção contra cópia de conteúdo
window.addEventListener('keydown', function(e) {
    if ((e.ctrlKey && (e.keyCode === 85)) || (e.ctrlKey && e.shiftKey && (e.keyCode === 73)) || (e.keyCode === 123) || (e.ctrlKey && e.shiftKey && (e.keyCode === 67))) {
      e.preventDefault();
    }
});

window.addEventListener('contextmenu', function(e) {
    e.preventDefault();
});
