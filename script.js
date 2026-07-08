// ─────────────────────────────────────────────────────────────
// Birthday Quiz engine 🎂
// Wrong answer → reset to question 1. All 10 correct → party!
// ─────────────────────────────────────────────────────────────

(() => {
    const TOTAL = QUESTIONS.length;

    // animation timings — keep in sync with style.css
    const T = {
        tada: 420,
        flyOut: 420,
        springIn: 560,
        shakeThenOops: 650,
        oopsVisible: 1700,
    };

    const CONFETTI_COLORS = ['#FF6B9D', '#FFD93D', '#6BCB77', '#4D96FF', '#FF9F45', '#C780FA'];

    const els = {
        startScreen: document.getElementById('start-screen'),
        quizScreen: document.getElementById('quiz-screen'),
        celebrationScreen: document.getElementById('celebration-screen'),
        oopsOverlay: document.getElementById('oops-overlay'),
        startBtn: document.getElementById('start-btn'),
        againBtn: document.getElementById('again-btn'),
        qNumber: document.getElementById('q-number'),
        dots: document.getElementById('dots'),
        stage: document.getElementById('stage'),
        qText: document.getElementById('q-text'),
        answers: document.querySelector('.answers'),
        answerA: document.getElementById('answer-a'),
        answerB: document.getElementById('answer-b'),
        optAText: document.getElementById('opt-a-text'),
        optBText: document.getElementById('opt-b-text'),
        flash: document.getElementById('flash'),
        confettiLayer: document.getElementById('confetti-layer'),
    };

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let current = 0;
    let locked = false;

    // ── tiny WebAudio sounds (no audio files) ────────────────
    let actx = null;

    function tone(freq, dur, delay = 0, type = 'sine', vol = 0.14) {
        try {
            actx = actx || new (window.AudioContext || window.webkitAudioContext)();
            const t = actx.currentTime + delay;
            const osc = actx.createOscillator();
            const gain = actx.createGain();
            osc.type = type;
            osc.frequency.value = freq;
            gain.gain.setValueAtTime(vol, t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + dur);
            osc.connect(gain).connect(actx.destination);
            osc.start(t);
            osc.stop(t + dur);
        } catch (e) {
            /* sound is optional — never break the game */
        }
    }

    const playChime = () => {
        tone(660, 0.16);
        tone(880, 0.22, 0.12);
    };

    const playBuzz = () => tone(150, 0.32, 0, 'sawtooth', 0.1);

    const playFanfare = () => {
        [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.28, i * 0.15, 'triangle', 0.16));
    };

    // ── rendering ────────────────────────────────────────────
    function buildDots() {
        els.dots.innerHTML = '';
        for (let i = 0; i < TOTAL; i += 1) {
            const dot = document.createElement('span');
            dot.className = 'dot';
            els.dots.appendChild(dot);
        }
    }

    function render() {
        const q = QUESTIONS[current];
        els.qNumber.textContent = `Question ${current + 1} of ${TOTAL}`;
        els.qText.textContent = q.text;
        els.optAText.textContent = q.optionA;
        els.optBText.textContent = q.optionB;
        [...els.dots.children].forEach((dot, i) => {
            dot.classList.toggle('done', i < current);
            dot.classList.toggle('current', i === current);
        });
    }

    // ── stage animation helper ───────────────────────────────
    const STAGE_ANIMS = ['tada', 'shake', 'fly-out-left', 'fly-out-right', 'spring-in-left', 'spring-in-right'];

    function animateStage(name) {
        els.stage.classList.remove(...STAGE_ANIMS);
        void els.stage.offsetWidth; // restart CSS animation
        els.stage.classList.add(name);
    }

    const springDir = () => (current % 2 === 0 ? 'spring-in-right' : 'spring-in-left');
    const flyDir = () => (current % 2 === 0 ? 'fly-out-left' : 'fly-out-right');

    // ── confetti ─────────────────────────────────────────────
    function burstConfetti() {
        if (reducedMotion) return;
        for (let i = 0; i < 22; i += 1) {
            const piece = document.createElement('span');
            piece.className = 'burst-piece';
            piece.style.background = CONFETTI_COLORS[i % CONFETTI_COLORS.length];
            piece.style.setProperty('--dx', `${(Math.random() - 0.5) * 320}px`);
            piece.style.setProperty('--dy', `${-30 - Math.random() * 200}px`);
            piece.style.setProperty('--rot', `${(Math.random() - 0.5) * 540}deg`);
            els.stage.appendChild(piece);
            setTimeout(() => piece.remove(), 900);
        }
    }

    function startConfettiRain() {
        if (reducedMotion) return;
        for (let i = 0; i < 110; i += 1) {
            const piece = document.createElement('span');
            piece.className = 'confetti';
            const size = 7 + Math.random() * 8;
            piece.style.left = `${Math.random() * 100}vw`;
            piece.style.width = `${size}px`;
            piece.style.height = `${size * (0.6 + Math.random() * 0.8)}px`;
            piece.style.background = CONFETTI_COLORS[i % CONFETTI_COLORS.length];
            piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '3px';
            piece.style.animationDuration = `${2.6 + Math.random() * 2.6}s`;
            piece.style.animationDelay = `${Math.random() * 3}s`;
            els.confettiLayer.appendChild(piece);
        }
    }

    const stopConfettiRain = () => {
        els.confettiLayer.innerHTML = '';
    };

    // ── game flow ────────────────────────────────────────────
    function showFlash(emoji) {
        els.flash.textContent = emoji;
        els.flash.classList.remove('show');
        void els.flash.offsetWidth;
        els.flash.classList.add('show');
    }

    function nextQuestion() {
        animateStage(flyDir());
        setTimeout(() => {
            current += 1;
            render();
            animateStage(springDir());
            setTimeout(() => {
                locked = false;
            }, T.springIn);
        }, T.flyOut);
    }

    function celebrate() {
        setTimeout(() => {
            els.quizScreen.classList.add('hidden');
            els.celebrationScreen.classList.remove('hidden');
            startConfettiRain();
            playFanfare();
            locked = false;
        }, T.flyOut + 150);
        animateStage(flyDir());
    }

    function wrongAnswer() {
        playBuzz();
        animateStage('shake');
        els.answers.classList.add('wrong-flash');

        setTimeout(() => {
            els.oopsOverlay.classList.remove('hidden');
        }, T.shakeThenOops);

        setTimeout(() => {
            els.oopsOverlay.classList.add('hidden');
            els.answers.classList.remove('wrong-flash');
            current = 0; // ← back to question 1
            render();
            animateStage(springDir());
            setTimeout(() => {
                locked = false;
            }, T.springIn);
        }, T.shakeThenOops + T.oopsVisible);
    }

    function answer(choice) {
        if (locked) return;
        locked = true;

        if (choice === QUESTIONS[current].correct) {
            playChime();
            showFlash(current === TOTAL - 1 ? '🥳' : '🎉');
            burstConfetti();
            animateStage('tada');
            setTimeout(() => {
                if (current === TOTAL - 1) {
                    celebrate();
                } else {
                    nextQuestion();
                }
            }, T.tada);
        } else {
            wrongAnswer();
        }
    }

    function startQuiz() {
        current = 0;
        locked = false;
        els.startScreen.classList.add('hidden');
        els.celebrationScreen.classList.add('hidden');
        stopConfettiRain();
        els.quizScreen.classList.remove('hidden');
        render();
        animateStage('spring-in-right');
    }

    function backToStart() {
        stopConfettiRain();
        els.celebrationScreen.classList.add('hidden');
        els.startScreen.classList.remove('hidden');
    }

    // ── wire up ──────────────────────────────────────────────
    els.startBtn.addEventListener('click', startQuiz);
    els.againBtn.addEventListener('click', backToStart);
    els.answerA.addEventListener('click', () => answer('A'));
    els.answerB.addEventListener('click', () => answer('B'));

    buildDots();
    render();
})();
