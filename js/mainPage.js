const ruleButtons = document.querySelectorAll('.menu-button');
const ruleBtn = ruleButtons[1];
const ruleModal = document.getElementById('rule-modal');
const ruleCloseBtn = document.getElementById('close-btn');

const startLink = document.getElementById('start-link');
const difficultyModal = document.getElementById('difficulty-modal');
const difficultyCloseBtn = document.getElementById('difficulty-close-btn');
const difficultyButtons = document.querySelectorAll('.difficulty-button');

if (ruleBtn && ruleModal && ruleCloseBtn) {
    ruleBtn.addEventListener('click', () => {
        ruleModal.style.display = 'flex';
    });

    ruleCloseBtn.addEventListener('click', () => {
        ruleModal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === ruleModal) {
            ruleModal.style.display = 'none';
        }
    });
}

if (startLink && difficultyModal) {
    startLink.addEventListener('click', (e) => {
        e.preventDefault();
        difficultyModal.style.display = 'flex';
    });
}

if (difficultyCloseBtn && difficultyModal) {
    difficultyCloseBtn.addEventListener('click', () => {
        difficultyModal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === difficultyModal) {
            difficultyModal.style.display = 'none';
        }
    });
}

if (difficultyButtons.length > 0) {
    difficultyButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
            const level = btn.dataset.level;
            if (!level) return;

            try {
                localStorage.setItem('tttDifficulty', level);
            } catch (e) {}

            window.location.href = `./game?difficulty=${encodeURIComponent(level)}`;
        });
    });
}

