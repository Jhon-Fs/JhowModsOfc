document.addEventListener('DOMContentLoaded', function() {
    var modal = document.getElementById("modal-imagem");
    var modalImg = document.getElementById("imagem-modal");
    var span = document.getElementsByClassName("fechar-modal")[0];
    
    var zoomControls = document.createElement("div");
    zoomControls.className = "zoom-controls";
    
    var zoomInBtn = document.createElement("button");
    zoomInBtn.className = "zoom-btn";
    zoomInBtn.textContent = "+";
    
    var zoomOutBtn = document.createElement("button");
    zoomOutBtn.className = "zoom-btn";
    zoomOutBtn.textContent = "-";
    
    zoomControls.appendChild(zoomInBtn);
    zoomControls.appendChild(zoomOutBtn);
    modal.appendChild(zoomControls);
    
    var images = document.getElementsByClassName("imagem-modal");
    for (var i = 0; i < images.length; i++) {
        images[i].onclick = function() {
            modal.style.display = "block";
            modalImg.src = this.src;
            modalImg.alt = this.alt;
            modalImg.classList.remove("zoom");
        }
    }
    
    span.onclick = function() {
        modal.style.display = "none";
    }
    
    modal.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
    
    zoomInBtn.onclick = function(e) {
        e.stopPropagation();
        modalImg.classList.add("zoom");
    }
    
    zoomOutBtn.onclick = function(e) {
        e.stopPropagation();
        modalImg.classList.remove("zoom");
    }
    
    modalImg.onwheel = function(e) {
        e.preventDefault();
        if (e.deltaY < 0) {
            modalImg.classList.add("zoom");
        } else {
            modalImg.classList.remove("zoom");
        }
    }
});