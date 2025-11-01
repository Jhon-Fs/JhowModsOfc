const userAudio = document.getElementById('userAudio');
const clickHere = document.createElement('div');
const blurOverlay = document.createElement('div');
const volumeContainer = document.getElementById('volumeContainer');
const volumeButton = document.getElementById('volumeButton');
const volumeIcon = document.getElementById('volumeIcon');
const volumeSlider = document.getElementById('volumeSlider');
const volumeSliderContainer = document.getElementById('volumeSliderContainer');
const volumeValue = document.getElementById('volumeValue');

function setupAudioOverlay() {
    blurOverlay.id = 'blurOverlay';
    blurOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0);
        backdrop-filter: blur(10px);
        z-index: 9998;
        display: flex;
        justify-content: center;
        align-items: center;
    `;

    clickHere.id = 'clickHere';
    clickHere.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
        cursor: pointer;
        background: transparent;
    `;

    document.body.appendChild(blurOverlay);
    document.body.appendChild(clickHere);

    userAudio.volume = 0.40;

    if (volumeSlider) {
        volumeSlider.value = 40;
        if (volumeValue) volumeValue.textContent = '40%';
    }

    clickHere.addEventListener('click', function() {
        userAudio.play().then(() => {
            clickHere.style.display = 'none';
            blurOverlay.style.display = 'none';
            if (volumeContainer) volumeContainer.style.display = 'flex';
        }).catch(error => {
            console.log('Erro ao reproduzir áudio:', error);
            clickHere.style.display = 'none';
            blurOverlay.style.display = 'none';
            if (volumeContainer) volumeContainer.style.display = 'flex';
        });
    });

    document.addEventListener('DOMContentLoaded', function() {
        userAudio.play().then(() => {
            clickHere.style.display = 'none';
            blurOverlay.style.display = 'none';
            if (volumeContainer) volumeContainer.style.display = 'flex';
        }).catch(error => {
            console.log('Reprodução automática bloqueada, aguardando clique do usuário');
            if (volumeContainer) volumeContainer.style.display = 'none';
        });
    });
}

function initVolumeControls() {
    if (!volumeButton || !volumeSlider) return;
    
    volumeButton.addEventListener('click', function(e) {
        e.stopPropagation();
        volumeSliderContainer.classList.toggle('show');
    });

    document.addEventListener('click', function(e) {
        if (volumeContainer && !volumeContainer.contains(e.target)) {
            volumeSliderContainer.classList.remove('show');
        }
    });

    volumeSlider.addEventListener('input', function() {
        const volume = this.value / 100;
        userAudio.volume = volume;
        if (volumeValue) volumeValue.textContent = this.value + '%';
        
        updateVolumeIcon(this.value);
    });

    volumeButton.addEventListener('dblclick', function() {
        if (userAudio.volume > 0) {
            userAudio.volume = 0;
            if (volumeSlider) volumeSlider.value = 0;
            if (volumeValue) volumeValue.textContent = '0%';
            if (volumeIcon) volumeIcon.textContent = '🔇';
        } else {
            userAudio.volume = 0.9;
            if (volumeSlider) volumeSlider.value = 90;
            if (volumeValue) volumeValue.textContent = '90%';
            if (volumeIcon) volumeIcon.textContent = '🔊';
        }
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'm' || e.key === 'M') {
            if (userAudio.volume > 0) {
                userAudio.volume = 0;
                if (volumeSlider) volumeSlider.value = 0;
                if (volumeValue) volumeValue.textContent = '0%';
                if (volumeIcon) volumeIcon.textContent = '🔇';
            } else {
                userAudio.volume = 0.9;
                if (volumeSlider) volumeSlider.value = 90;
                if (volumeValue) volumeValue.textContent = '90%';
                if (volumeIcon) volumeIcon.textContent = '🔊';
            }
        }
    });
}

function updateVolumeIcon(volume) {
    if (!volumeIcon) return;
    
    if (volume == 0) {
        volumeIcon.textContent = '🔇';
    } else if (volume < 30) {
        volumeIcon.textContent = '🔈';
    } else if (volume < 70) {
        volumeIcon.textContent = '🔉';
    } else {
        volumeIcon.textContent = '🔊';
    }
}

function setVolume(volume) {
    userAudio.volume = volume / 100;
}

function toggleAudio() {
    if (userAudio.paused) {
        userAudio.play();
    } else {
        userAudio.pause();
    }
}

window.addEventListener('load', function() {
    setupAudioOverlay();
    initVolumeControls();
});
