document.addEventListener('DOMContentLoaded', () => {
    // --- Data with High Quality Marvel Image URLs ---
    const roster = [
        { id: 'im', name: 'IRON MAN',        class: 'Tech',    img: 'assets/images/avatar_im.jpg'    },
        { id: 'ca', name: 'CAPTAIN AMERICA', class: 'Brawler', img: 'assets/images/avatar_ca.jpg'    },
        { id: 'hl', name: 'HULK',            class: 'Brawler', img: 'assets/images/hero_hl_bg.jpg'  },
        { id: 'th', name: 'THOR',            class: 'Cosmic',  img: 'assets/images/avatar_th_3.jpg'  },
        { id: 'sw', name: 'SCARLET WITCH',   class: 'Magic',   img: 'assets/images/avatar_sw.png'    },
        { id: 'sm', name: 'SPIDER-MAN',      class: 'Agility', img: 'assets/images/spiderman_game.png' },
        { id: 'wv', name: 'WOLVERINE',       class: 'Brawler', img: 'assets/images/hero_wv_bg.jpg'   },
        { id: 'bw', name: 'BLACK WIDOW',     class: 'Agility', img: 'assets/images/hero_bw_bg.jpg'    },
        { id: 'ds', name: 'DOCTOR STRANGE',  class: 'Magic',   img: 'assets/images/avatar_ds.jpg'    }
    ];
    
    // --- Level Progression State (per-user, loaded after login) ---
    let cryptoUnlockedLevel = 1;
    let bugBountyUnlockedLevel = 1;
    let quantumUnlockedLevel = 1;

    // Loads/resets level progress from localStorage using the logged-in user's UID
    function loadUserLevelState(uid) {
        cryptoUnlockedLevel    = parseInt(localStorage.getItem(uid + '_crypto_unlocked_level_v3'))    || 1;
        bugBountyUnlockedLevel = parseInt(localStorage.getItem(uid + '_bug_bounty_unlocked_level_v5')) || 1;
        quantumUnlockedLevel   = parseInt(localStorage.getItem(uid + '_quantum_unlocked_level_v6'))   || 1;
        console.log('[LEVEL] Progress loaded for user:', uid, { cryptoUnlockedLevel, bugBountyUnlockedLevel, quantumUnlockedLevel });
    }

let pendingUnlock = null; // { game: 'crypto', level: 2 }

    function updateCryptoLevelSelection() {
        const levels = [
            { id: 'initiate', val: 1 },
            { id: 'operative', val: 2 },
            { id: 'omega', val: 3 }
        ];
        const missionNames = ['BASIC_DECRYPTION', 'TACTICAL_CIPHER', 'NEXUS_OVERRIDE'];
        const cards = document.querySelectorAll('#crypto-level-selection-screen .game-card');
        cards.forEach((card, idx) => {
            const levelNum = idx + 1;
            const isLocked = levelNum > cryptoUnlockedLevel;
            const tagLabel = card.querySelector('.mission-tag-label');
            const btn = card.querySelector('.crypto-start-btn');
            
            if (isLocked) {
                card.classList.add('level-locked');
                card.setAttribute('disabled', 'true');
                if (tagLabel) tagLabel.textContent = 'SEC_ACCESS_REQ';
                if (btn) {
                    btn.innerHTML = '🔒 LOCKED';
                    btn.classList.add('locked-btn');
                    btn.disabled = true;
                    btn.style.background = 'rgba(0, 0, 0, 0.4)';
                    btn.style.color = 'rgba(255, 255, 255, 0.3)';
                    btn.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                    btn.style.boxShadow = 'none';
                    btn.style.opacity = '0.5';
                    btn.style.cursor = 'not-allowed';
                }
                const lockIcon = card.querySelector('.lock-icon');
                if (lockIcon) lockIcon.style.display = 'block';
            } else {
                card.classList.remove('level-locked');
                card.removeAttribute('disabled');
                if (tagLabel) tagLabel.textContent = missionNames[idx];
                if (btn) {
                    btn.innerHTML = '⚡ ENGAGE ⚡';
                    btn.classList.remove('locked-btn');
                    btn.disabled = false;
                    
                    // Reset to theme colors based on level
                    const colors = ['#00f0ff', '#ffaa00', '#ff003c'];
                    const color = colors[idx];
                    btn.style.color = color;
                    btn.style.borderColor = color;
                    btn.style.background = `rgba(${idx === 0 ? '0, 240, 255' : idx === 1 ? '255, 170, 0' : '255, 0, 60'}, 0.1)`;
                    btn.style.boxShadow = `0 0 10px ${color}33`;
                    btn.style.opacity = '1';
                    btn.style.cursor = 'pointer';
                }
                const lockIcon = card.querySelector('.lock-icon');
                if (lockIcon) lockIcon.style.display = 'none';
                
                // Trigger Unlock Animation if it's the pending one
                if (pendingUnlock && pendingUnlock.game === 'crypto' && pendingUnlock.level === levelNum) {
                    triggerUnlockSequence(card);
                    pendingUnlock = null;
                }
            }
        });
    }

    function triggerUnlockSequence(card) {
        // Add a temporary class to shatter the lock first
        card.classList.add('unlocking-sequence');
        const lockIcon = card.querySelector('.lock-icon') || document.createElement('div');
        lockIcon.className = 'lock-icon lock-shatter-anim';
        if (!card.querySelector('.lock-icon')) card.appendChild(lockIcon);

        setTimeout(() => {
            card.classList.remove('unlocking-sequence');
            card.classList.add('newly-unlocked-card');
            
            // Add pulse effect to the ENGAGE button to guide the user
            const engageBtn = card.querySelector('.play-btn') || 
                             card.querySelector('.quantum-start-btn') || 
                             card.querySelector('.bug-bounty-start-btn');
            
            if (engageBtn) {
                engageBtn.classList.add('newly-unlocked-btn');
                
                // Add a scanning SVG ring around the button for extra "vibrancy"
                const ring = document.createElement('div');
                ring.className = 'btn-scan-ring';
                ring.innerHTML = `
                    <svg viewBox="0 0 100 100" style="position:absolute; top:-20px; left:-20px; width:calc(100% + 40px); height:calc(100% + 40px); pointer-events:none;">
                        <circle cx="50" cy="50" r="45" fill="none" stroke="#00f0ff" stroke-width="1" stroke-dasharray="10 20" opacity="0.6">
                            <animateTransform attributeName="transform" type="rotate" from="0 50 50" to="360 50 50" dur="10s" repeatCount="indefinite" />
                        </circle>
                    </svg>
                `;
                engageBtn.appendChild(ring);

                // Remove pulse after 12 seconds or when clicked
                const removePulse = () => {
                    engageBtn.classList.remove('newly-unlocked-btn');
                    if (ring.parentNode) ring.remove();
                    engageBtn.removeEventListener('click', removePulse);
                };
                engageBtn.addEventListener('click', removePulse);
                setTimeout(removePulse, 12000);
            }


        }, 800);
    }

    function updateQuantumLevelSelection() {
        const cards = document.querySelectorAll('#quantum-level-selection-screen .quantum-mission-card');
        const missionNames = ['BASIC_DECRYPTION', 'TACTICAL_CIPHER', 'QUANTUM_SYNC'];
        
        cards.forEach((card, idx) => {
            const levelNum = idx + 1;
            const isLocked = levelNum > quantumUnlockedLevel;
            const tagLabel = card.querySelector('.mission-tag-label');
            const btn = card.querySelector('.quantum-start-btn');

            if (isLocked) {
                card.classList.add('level-locked');
                card.setAttribute('disabled', 'true');
                if (tagLabel) tagLabel.textContent = 'SEC_ACCESS_REQ';
                if (btn) {
                    btn.innerHTML = '<span>🔒</span> LOCKED <span>🔒</span>';
                    btn.classList.add('locked-btn');
                    btn.disabled = true;
                    btn.style.background = 'rgba(0, 0, 0, 0.4)';
                    btn.style.color = 'rgba(255, 255, 255, 0.3)';
                    btn.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                    btn.style.boxShadow = 'none';
                    btn.style.opacity = '0.5';
                    btn.style.cursor = 'not-allowed';
                }
                const lockIcon = card.querySelector('.lock-icon');
                if (lockIcon) lockIcon.style.display = 'block';
            } else {
                card.classList.remove('level-locked');
                card.removeAttribute('disabled');
                if (tagLabel) tagLabel.textContent = missionNames[idx];
                if (btn) {
                    btn.innerHTML = '<span>⚡</span> ENGAGE <span>⚡</span>';
                    btn.classList.remove('locked-btn');
                    btn.disabled = false;
                    
                    // Reset styling (Quantum buttons have specific styles in CSS usually, but we'll force theme consistency)
                    const colors = ['#00f0ff', '#ffaa00', '#ff003c'];
                    const color = colors[idx];
                    btn.style.color = color;
                    btn.style.borderColor = color;
                    btn.style.background = `rgba(${idx === 0 ? '0, 240, 255' : idx === 1 ? '255, 170, 0' : '255, 0, 60'}, 0.1)`;
                    btn.style.boxShadow = `0 0 15px ${color}44`;
                    btn.style.opacity = '1';
                    btn.style.cursor = 'pointer';
                }
                const lockIcon = card.querySelector('.lock-icon');
                if (lockIcon) lockIcon.style.display = 'none';

                if (pendingUnlock && pendingUnlock.game === 'quantum' && pendingUnlock.level === levelNum) {
                    triggerUnlockSequence(card);
                    pendingUnlock = null;
                }
            }
        });
    }

    function updateBugBountyLevelSelection() {
        const cards = document.querySelectorAll('#bug-bounty-level-selection-screen .holographic-file');
        const missionNames = ['BASIC_DECRYPTION', 'TACTICAL_CIPHER', 'SYSTEM_CRITICAL_EXPOSURE'];

        cards.forEach((card, idx) => {
            const levelNum = idx + 1;
            const isLocked = levelNum > bugBountyUnlockedLevel;
            const tagLabel = card.querySelector('.mission-tag-label');
            const btn = card.querySelector('.bug-bounty-start-btn');
            
            if (isLocked) {
                card.classList.add('level-locked');
                card.setAttribute('disabled', 'true');
                if (tagLabel) tagLabel.textContent = 'SEC_ACCESS_REQ';
                if (btn) {
                    btn.innerHTML = '🔒 LOCKED';
                    btn.classList.add('locked-btn');
                    btn.disabled = true;
                    btn.style.background = 'rgba(0, 0, 0, 0.4)';
                    btn.style.color = 'rgba(255, 255, 255, 0.3)';
                    btn.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                    btn.style.boxShadow = 'none';
                }
            } else {
                card.classList.remove('level-locked');
                card.removeAttribute('disabled');
                if (tagLabel) tagLabel.textContent = missionNames[idx];
                if (btn) {
                    btn.innerHTML = '⚡ ENGAGE ⚡';
                    btn.classList.remove('locked-btn');
                    btn.disabled = false;
                    
                    // Reset to theme colors based on level
                    const colors = ['#00f0ff', '#ffaa00', '#ff003c'];
                    const color = colors[idx];
                    btn.style.color = color;
                    btn.style.borderColor = color;
                    btn.style.background = `rgba(${idx === 0 ? '0, 240, 255' : idx === 1 ? '255, 170, 0' : '255, 0, 60'}, 0.1)`;
                    btn.style.boxShadow = `0 0 10px ${color}33`;
                }
                
                if (pendingUnlock && pendingUnlock.game === 'bug' && pendingUnlock.level === levelNum) {
                    triggerUnlockSequence(card);
                    pendingUnlock = null;
                }
            }
        });
    }

    function triggerVictoryOverlay(stats) {
        const hasNextLevel = !!pendingUnlock;
        const overlay = document.createElement('div');
        overlay.className = 'victory-overlay';
        
        // Inline SVG Icons for Stats
        const iconClock = `<svg viewBox="0 0 24 24" style="width:14px; height:14px; fill:currentColor;"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8zm.5-13H11v6l5.2 3.1.8-1.2-4.5-2.7V7z"/></svg>`;
        const iconWrench = `<svg viewBox="0 0 24 24" style="width:14px; height:14px; fill:currentColor;"><path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.3 4.7C.2 7.1.6 10.1 2.6 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.7-2.7c.4-.4.4-1.1 0-1.5z"/></svg>`;

        overlay.innerHTML = `
            <div class="victory-scan-line" style="position:absolute; top:0; left:0; width:100%; height:2px; background:rgba(0,240,255,0.5); box-shadow:0 0 15px #00f0ff; z-index:5; animation:scanMove 10s linear infinite;"></div>
            
            <div class="victory-panel">
                <!-- Status LEDs in corners -->
                <div class="status-led" style="top: 10px; left: 10px;"></div>
                <div class="status-led" style="top: 10px; right: 10px; animation-delay: 0.5s;"></div>
                <div class="status-led" style="bottom: 10px; left: 10px; animation-delay: 1.2s;"></div>

                <div class="victory-glitch-text" data-text="CONGRATULATIONS">CONGRATULATIONS</div>
                <h1 class="victory-title" style="font-size: 0.9rem; color:#00f0ff; letter-spacing:10px; margin-bottom:10px; font-family:'Share Tech Mono'; opacity:0.8;">[ LEVEL_COMPLETE_AUTH_SUCCESS ]</h1>
                
                <div class="hud-divider"></div>

                <div class="victory-stats">
                    <div class="stat-item">
                        <span class="stat-label">${iconClock} ${stats.mainStat.label}</span>
                        <span class="stat-value">${stats.mainStat.value}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">${iconWrench} ${stats.secondaryStat.label}</span>
                        <span class="stat-value" style="color:#ffaa00;">${stats.secondaryStat.value}</span>
                    </div>
                </div>

                <div class="hud-divider"></div>

                <div class="redirect-container">
                    <div class="redirect-label" style="font-size: 0.7rem; color: #00f0ff; margin-bottom: 8px; font-family:'Share Tech Mono'; letter-spacing:3px; text-align:left;">UPLINKING_SECURE_REDIRECT_PROTOCOL...</div>
                    <div class="segmented-progress">
                        <div class="progress-fill-segmented" style="width: 100%; transition: width ${(stats.duration && stats.duration !== 'manual') ? (stats.duration / 1000) + 's' : '5s'} linear;"></div>
                    </div>
                    <div class="hex-data-stream" id="hex-stream">0x4F82 0x77A1 0xBC3E 0x921D...</div>
                </div>

                <button class="victory-btn" id="victory-continue">
                    ${hasNextLevel ? 'ENGAGE_NEXT_MISSION' : 'RETURN_TO_HUB'}
                </button>
            </div>
            
            <style>
                @keyframes scanMove {
                    0% { top: -5%; opacity: 0; }
                    50% { opacity: 1; }
                    100% { top: 105%; opacity: 0; }
                }
            </style>
        `;

        document.body.appendChild(overlay);
        overlay.style.display = 'flex';

        const panel = overlay.querySelector('.victory-panel');
        const hexStream = overlay.querySelector('#hex-stream');

        // Mouse Parallax Logic
        overlay.addEventListener('mousemove', (e) => {
            const xAxis = (window.innerWidth / 2 - e.pageX) / 25;
            const yAxis = (window.innerHeight / 2 - e.pageY) / 25;
            panel.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg) translateZ(50px)`;
        });

        // Reset parallax
        overlay.addEventListener('mouseleave', () => {
            panel.style.transform = `rotateY(0deg) rotateX(0deg) translateZ(0)`;
        });

        // Hex Code Stream Logic
        const hexChars = "0123456789ABCDEF";
        const streamInterval = setInterval(() => {
            let stream = "";
            for (let i = 0; i < 6; i++) {
                let chunk = "0x";
                for (let j = 0; j < 4; j++) chunk += hexChars[Math.floor(Math.random() * 16)];
                stream += chunk + " ";
            }
            if (hexStream) hexStream.textContent = stream + " [LOADING_SYSTEM_IO...]";
        }, 80);

        // Progress bar animation
        setTimeout(() => {
            const bar = overlay.querySelector('.progress-fill-segmented');
            if (bar) bar.style.width = '0%';
        }, 100);

        if (typeof playVictorySound === 'function') playVictorySound();

        const btn = overlay.querySelector('#victory-continue');
        let redirectTriggered = false;

        const executeContinue = () => {
            if (redirectTriggered) return;
            redirectTriggered = true;
            clearInterval(streamInterval);
            overlay.classList.add('hidden');
            setTimeout(() => {
                overlay.remove();
                if (stats.onContinue) stats.onContinue();
            }, 500);
        };

        btn.onclick = executeContinue;

        // Auto-redirect matches progress bar
        const duration = stats.duration || 5000;
        if (duration !== 'manual') {
            setTimeout(executeContinue, duration);
        }
    }

    const heroBgs = {
        'im': './assets/images/hero_im_bg.png', 
        'ca': './assets/images/hero_ca_bg.png', 
        'th': './assets/images/hero_th_bg.png', 
        'sw': './assets/images/hero_sw_bg.png', 
        'hl': './assets/images/hero_hl_bg.jpg', 
        'sm': './assets/images/hero_sm_bg.jpg', 
        'wv': './assets/images/hero_wv_bg.jpg', 
        'bw': './assets/images/hero_bw_bg.jpg', 
        'ds': './assets/images/hero_ds_bg.jpg'
    };

    // --- Firebase Initialization (Consolidated) ---
    const authService = new window.AuthService();
    const scoreService = new window.ScoreService();


    let currentUser = null;

    // --- DOM Elements ---
    // --- Global Error & Reload Protection ---
    window.onerror = function(msg, url, lineNo, columnNo, error) {
        console.error('CRITICAL SYSTEM ERROR:', msg, 'at', url, ':', lineNo);
        showToast("SYSTEM WARNING: Unexpected process failure. Remaining in current state.");
        return true; // Prevent default error handling (reloads/crashes)
    };

    // Prevent any global "submit" events just in case
    window.addEventListener('submit', (e) => e.preventDefault(), true);

    const screens = {
        boot: document.getElementById('boot-screen'),
        auth: document.getElementById('auth-screen'),
        menu: document.getElementById('menu-screen'),
        loading: document.getElementById('game-loading-screen'),
        cutscene: document.getElementById('cutscene-screen'),
        games: document.getElementById('games-screen'),
        crypto: document.getElementById('crypto-game-screen'),
        cryptoSelection: document.getElementById('crypto-level-selection-screen'),
        bugBountySelection: document.getElementById('bug-bounty-level-selection-screen'),
        bugBounty: document.getElementById('bug-bounty-game-screen'),
        quantumSelection: document.getElementById('quantum-level-selection-screen'),
        quantum: document.getElementById('quantum-game-screen'),
        about: document.getElementById('about-screen'),
        rules: document.getElementById('rules-screen')
    };

    const bootEls = {
        bar: document.getElementById('loading-bar'),
        percentage: document.getElementById('loading-percentage'),
        text: document.getElementById('loading-items'),
        logs: document.getElementById('console-logs')
    };

    const authEls = {
        form: document.getElementById('auth-form'),
        tabs: document.querySelectorAll('.tab-btn'),
        avatarWrapper: document.getElementById('avatar-selection-wrapper'),
        avatarGrid: document.getElementById('avatar-grid'),
        selectedAvatar: document.getElementById('selected-avatar'),
        email: document.getElementById('auth-email'),
        username: document.getElementById('username'),
        accessCode: document.getElementById('auth-code'),
        btnRegister: document.getElementById('btn-register'),
        btnLogin: document.getElementById('btn-login'),
        steps: {
            s1: document.getElementById('auth-step-1'),
            s2: document.getElementById('auth-step-2')
        }
    };

    // Prevent Enter key from reloading the page and stop propagation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const activeEl = document.activeElement;
            if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA')) {
                const step = activeEl.closest('.auth-step');
                if (step) {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('[SECURITY] Intercepted Enter key on input.');
                    
                    if (step.id === 'auth-step-1') authEls.btnLogin.click();
                }
            }
        }
    }, true);

    const menuEls = {
        username: document.getElementById('display-username'),
        avatar: document.getElementById('display-user-avatar'),
        protocol: document.getElementById('active-protocol'),
        logoutBtn: document.getElementById('logout-btn'),
        modeCards: document.querySelectorAll('.mode-card')
    };



    const toast = document.getElementById('toast');
    const authLeft = document.querySelector('.auth-left');
    const heroOverlayText = document.querySelector('.hero-overlay-text');

    // --- Global Background Music ---
    const bgMusic = new Audio('assets/audio/WhatsApp Audio 2026-03-24 at 12.30.10 AM.mp3');
    bgMusic.loop = true;
    bgMusic.volume = 0.5;
    let currentScreenId = 'boot-screen';

    // Interaction fallback for background music
    document.addEventListener('click', () => {
        const silentScreens = [
            'cutscene-screen', 
            'crypto-game-screen', 
            'quantum-game-screen', 
            'bug-bounty-game-screen',
            'game-loading-screen',
            'rules-screen',
            'crypto-level-selection-screen',
            'quantum-level-selection-screen',
            'bug-bounty-level-selection-screen'
        ];
        if (bgMusic.paused && !silentScreens.includes(currentScreenId)) {
            bgMusic.play().catch(() => {});
        }
    }, { once: true });

    // --- Helpers ---
    function showScreen(screenId) {
        console.log("[SYSTEM] Transitioning to screen:", screenId);
        currentScreenId = screenId;

        // Background Music Management - Silent during intense game operations
        const silentScreens = [
            'cutscene-screen', 
            'crypto-game-screen', 
            'quantum-game-screen', 
            'bug-bounty-game-screen',
            'game-loading-screen',
            'rules-screen',
            'crypto-level-selection-screen',
            'quantum-level-selection-screen',
            'bug-bounty-level-selection-screen'
        ];

        if (silentScreens.includes(screenId)) {
            bgMusic.pause();
        } else {
            bgMusic.play().catch(() => {
                console.log("[AUDIO] Autoplay pending user interaction.");
            });
        }

        // Hide bottom gauges when leaving cutscene
        if (screenId !== 'cutscene-screen') {
            document.querySelectorAll('.corner-gauge.bottom-left, .corner-gauge.bottom-right').forEach(el => el.classList.remove('show'));
        }
        
        // Initialize cosmic particles for games screen
        if (screenId === 'games-screen') {
            createCosmicParticles();
        }

        Object.values(screens).forEach(screen => {
            if (screen && screen.id === screenId) {
                screen.classList.remove('hidden');
                screen.classList.add('active');
            } else if (screen) {
                screen.classList.remove('active');
                screen.classList.add('hidden');
            }
        });
    }

    function createCosmicParticles() {
        const container = document.getElementById('cosmic-particles');
        if (!container) return;
        container.innerHTML = '';
        const count = 50;
        for (let i = 0; i < count; i++) {
            const p = document.createElement('div');
            p.className = 'nanotech-particle';
            p.style.left = Math.random() * 100 + '%';
            p.style.top = Math.random() * 100 + '%';
            p.style.animationDelay = Math.random() * 10 + 's';
            p.style.animationDuration = (10 + Math.random() * 10) + 's';
            p.style.opacity = Math.random();
            container.appendChild(p);
        }
    }

    window.showToast = function(message) {
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 4000);
    }

    async function checkNexusStatus() {
        const statusLog = document.createElement('div');
        if (bootEls.logs) {
            bootEls.logs.appendChild(statusLog);
            statusLog.textContent = "[UPLINK] Verifying Nexus Status...";
        }

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 3000);
            
            const response = await fetch('http://localhost:3000/api/nexus/status', { signal: controller.signal });
            clearTimeout(timeoutId);
            const data = await response.json();
            
            if (statusLog) {
                statusLog.innerHTML = `<span style="color:#00f0ff">[UPLINK] Nexus Status: ${data.status.toUpperCase()}</span>`;
                statusLog.innerHTML += `<br><span style="color:rgba(0,240,255,0.5)">[UPLINK] Core: ${data.core} | Security: ${data.security_level}</span>`;
            }
            return true;
        } catch (error) {
            if (statusLog) {
                statusLog.innerHTML = `<span style="color:#ff003c">[UPLINK] Nexus Offline: Maintenance protocol active.</span>`;
            }
            console.warn("[UPLINK] Nexus Status Check Failed:", error);
            return false;
        }
    }

    // --- Boot Sequence ---
    const bootSequence = [
        "Initializing JARVIS Core...",
        "Establishing Secure Uplink...",
        "Bypassing Stark Industries Firewalls...",
        "Syncing Neural Networks...",
        "Loading Personnel Database...",
        "Activating JARVIS...",
        "JARVIS Activated."
    ];

    // --- HUD Utilities ---
    async function typeWriter(element, text, speed = 30) {
        element.innerHTML = "";
        for (let i = 0; i < text.length; i++) {
            element.innerHTML += text.charAt(i);
            await new Promise(r => setTimeout(r, speed));
        }
    }

    function scrambleData(element, finalValue, duration = 1000) {
        const chars = "0123456789ABCDEF!@#$%^&*()";
        const startTime = Date.now();
        
        const update = () => {
            const now = Date.now();
            if (now - startTime < duration) {
                let random = "";
                for (let i = 0; i < finalValue.length; i++) {
                    random += chars[Math.floor(Math.random() * chars.length)];
                }
                element.textContent = random;
                requestAnimationFrame(update);
            } else {
                element.textContent = finalValue;
            }
        };
        update();
    }

    function initNeuralParticles() {
        if (typeof particlesJS !== 'undefined' && document.getElementById('particles-js')) {
            particlesJS('particles-js', {
                "particles": {
                    "number": { "value": 80, "density": { "enable": true, "value_area": 800 } },
                    "color": { "value": "#00f0ff" },
                    "shape": { "type": "circle" },
                    "opacity": { "value": 0.2, "random": true },
                    "size": { "value": 2, "random": true },
                    "line_linked": { "enable": true, "distance": 150, "color": "#00f0ff", "opacity": 0.1, "width": 1 },
                    "move": { "enable": true, "speed": 1, "direction": "none", "random": true, "straight": false, "out_mode": "out", "bounce": false }
                },
                "interactivity": {
                    "detect_on": "canvas",
                    "events": { "onhover": { "enable": true, "mode": "grab" }, "onclick": { "enable": true, "mode": "push" } },
                    "modes": { "grab": { "distance": 140, "line_linked": { "opacity": 0.5 } } }
                },
                "retina_detect": true
            });
        }
    }

    function triggerLogoGlitch() {
        const logoLines = document.querySelectorAll('.logo-line, .insignia-svg');
        setInterval(() => {
            if (Math.random() > 0.9) {
                logoLines.forEach(el => el.classList.add('glitch-active'));
                setTimeout(() => {
                    logoLines.forEach(el => el.classList.remove('glitch-active'));
                }, 300);
            }
        }, 2000);
    }

    function startBoot() {
        let progress = 0;
        let step = 0;
        const panelLeft = document.getElementById('boot-panel-left');
        const panelRight = document.getElementById('boot-panel-right');

        const techStrings = [
            "SCANNING_CORE_V4...", "NODE_7_STABLE", "ENCRYPTING_SSL_RSA", 
            "BYPASSING_NAT...", "UPLINK_ESTABLISHED", "VOLTAGE_NOMINAL",
            "FIREWALL_V3_ENGAGED", "NEURAL_SYNC_99%", "PACKET_0x82_RECV",
            "JARVIS_OVERRIDE: OFF", "PROTOCOL_DELTA_INIT"
        ];

        const interval = setInterval(() => {
            progress += Math.floor(Math.random() * 8) + 2;
            if (progress > 100) progress = 100;

            if (bootEls.bar) bootEls.bar.style.width = `${progress}%`;
            if (bootEls.percentage) bootEls.percentage.textContent = `${progress}%`;
            // Improved step logic: Ensure all status items are shown sequentially
            const nextStepThreshold = (step + 1) * (100 / bootSequence.length);
            if (progress >= nextStepThreshold && step < bootSequence.length) {
                const currentText = bootSequence[step];
                if (bootEls.text) {
                    // Just set text for top bar to avoid flicker, or use typewriter for single lines if desired
                    bootEls.text.textContent = currentText; 
                }

                const logItem = document.createElement('div');
                if (bootEls.logs) {
                    bootEls.logs.appendChild(logItem);
                    typeWriter(logItem, `[SYSTEM] ${currentText}`, 20); // Typewriter for logs
                    bootEls.logs.scrollTop = bootEls.logs.scrollHeight;
                }
                
                // Inject Nexus Status check after establishing uplink
                if (currentText === "Establishing Secure Uplink...") {
                    setTimeout(checkNexusStatus, 500);
                }
                step++;
            }

            if (progress === 100) {
                clearInterval(interval);
                
                // Finalize text
                if (bootEls.text) bootEls.text.textContent = bootSequence[bootSequence.length - 1];

                const globalStatus = document.getElementById('global-system-status');
                if (globalStatus) globalStatus.textContent = "JARVIS Activated";
                
                // Automate transition after 2 seconds
                setTimeout(() => {
                    finalizeBoot();
                }, 2000);
            }
        }, 60);

        async function finalizeBoot() {
            renderAvatars(); // Pre-render all dynamically
            console.log("[SYSTEM] Finalizing transition...");
            
            try {
                console.log("[AUTH] Verifying active Firebase session...");
                const user = await authService.getCurrentUser();
                
                if (user) {
                    console.log("[AUTH] Persistent agent detected:", user.alias);
                    loginSuccess(user);
                } else {
                    console.log("[AUTH] No active session. Redirecting to AUTH_PROTOCOL.");
                    showScreen('auth-screen');
                }
            } catch (e) {
                console.error("[SYSTEM] Transition Error:", e);
                showScreen('auth-screen');
            }
        }
    }

    function initLogoSparks() {
        const container = document.getElementById('logo-sparks');
        if (!container) return;
        
        setInterval(() => {
            const spark = document.createElement('div');
            spark.className = 'spark';
            const size = Math.random() * 3 + 1;
            spark.style.width = `${size}px`;
            spark.style.height = `${size}px`;
            spark.style.left = `${Math.random() * 100}%`;
            spark.style.bottom = '0%';
            
            // Random orange/yellow/white for sparks
            const colors = ['#ffa500', '#ff4500', '#ffffff', '#00f0ff'];
            spark.style.background = colors[Math.floor(Math.random() * colors.length)];
            spark.style.boxShadow = `0 0 10px ${spark.style.background}`;
            
            const duration = Math.random() * 2 + 1;
            spark.style.animation = `sparkUp ${duration}s linear forwards`;
            
            container.appendChild(spark);
            setTimeout(() => spark.remove(), duration * 1000);
        }, 100);
    }

    // Start boot sequence
    // initLogoSparks(); // Removed per user request to clear space above "CYBER"
    initNeuralParticles();
    triggerLogoGlitch();
    startBoot();

    // --- Auth Logic ---
    authEls.tabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            if (e) e.preventDefault();
            authEls.tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
        });
    });

    function renderAvatars() {
        authEls.avatarGrid.innerHTML = '';
        authEls.selectedAvatar.value = '';

        roster.forEach(hero => {
            const div = document.createElement('div');
            div.className = 'avatar-option';
            div.style.backgroundImage = `url('${hero.img}')`;
            div.dataset.id = hero.id;
            div.dataset.name = hero.name;
            div.dataset.img = hero.img;
            div.title = hero.name;

            div.addEventListener('click', () => {
                document.querySelectorAll('.avatar-option').forEach(el => el.classList.remove('selected'));
                div.classList.add('selected');
                authEls.selectedAvatar.value = hero.id;

                // Update left side background image (from Games version)
                if (heroBgs[hero.id]) {
                    if (authLeft) authLeft.style.backgroundImage = `url('${heroBgs[hero.id]}')`;
                }

                // Update overlay text to match hero
                if (heroOverlayText) {
                    heroOverlayText.textContent = hero.name;
                    
                    // Dynamic font sizing for long names
                    const nameLength = hero.name.length;
                    if (nameLength > 15) {
                        heroOverlayText.style.fontSize = 'clamp(2rem, 8vh, 8rem)';
                    } else if (nameLength > 10) {
                        heroOverlayText.style.fontSize = 'clamp(3rem, 11vh, 10rem)';
                    } else {
                        heroOverlayText.style.fontSize = 'clamp(4rem, 15vh, 14rem)';
                    }
                }
            });

            authEls.avatarGrid.appendChild(div);
        });

        // Pre-select Iron Man by default
        const ironManOpt = authEls.avatarGrid.querySelector('.avatar-option[data-id="im"]');
        if (ironManOpt) ironManOpt.click();
    }

    // Auth button handlers
    authEls.btnRegister.addEventListener('click', async (e) => {
        if (e) e.preventDefault();
        
        const email = authEls.email.value.trim();
        const alias = authEls.username.value.trim();
        const code = authEls.accessCode.value;

        if (!email || !alias || !code) {
            showToast("Required: Email, Alias, and Access Code.");
            return;
        }

        showToast("Registering new agent...");
        const result = await authService.register(email, alias, code);
        
        if (result.success) {
            showToast("Agent Registered. Select your avatar.");
            authEls.steps.s1.classList.add('hidden');
            authEls.steps.s2.classList.remove('hidden');
            renderAvatars();
        }
    });

    authEls.btnLogin.addEventListener('click', async (e) => {
        if (e) e.preventDefault();
        
        const email = authEls.email.value.trim();
        const code = authEls.accessCode.value;

        if (!email || !code) {
            showToast("Required: Email and Access Code.");
            return;
        }

        showToast("Verifying identity...");
        const result = await authService.login(email, code);
        
        if (result.success) {
            // Auto-fill alias from server response if available
            if (result.alias && !authEls.username.value.trim()) {
                authEls.username.value = result.alias;
            }
            showToast("Identity Verified. Select your avatar.");
            authEls.steps.s1.classList.add('hidden');
            authEls.steps.s2.classList.remove('hidden');
            renderAvatars();
        }
    });

    const loginSuccess = (userData) => {
        currentUser = userData;

        // Load THIS user's personal level progress (isolates progress between users)
        if (currentUser && currentUser.uid) {
            loadUserLevelState(currentUser.uid);
        }
        
        // Protocol Assignment
        const protocols = {
            'im': 'JARVIS',
            'sm': 'KAREN',
            'sw': 'WANDA-OS',
            'th': 'ODINFORCE',
            'hl': 'BANNER-OS',
            'ca': 'STEVE',
            'bw': 'NAT',
            'ds': 'VISHANTI',
            'wv': 'LOGAN'
        };
        const protocolName = protocols[currentUser.avatarId] || 'STARK';
        if (menuEls.protocol) menuEls.protocol.textContent = `PROTOCOL: ${protocolName}`;

        showToast("Authentication Success. Engaging Systems.");
        showScreen('menu-screen');
        
        // Update menu display
        if (menuEls.username) menuEls.username.textContent = currentUser.alias;
        if (menuEls.avatar) {
            menuEls.avatar.style.backgroundImage = `url('${currentUser.avatarImg}')`;
            menuEls.avatar.textContent = ''; 
        }
    };

    const btnEngage = document.getElementById('engage-systems-btn');
    const handleFinalSubmit = async (e) => {
        if (e) e.preventDefault();

        if (!authEls.selectedAvatar.value) {
            showToast("Error: Select a Hero Avatar.");
            return;
        }

        const selectedEl = document.querySelector('.avatar-option.selected');
        if (!selectedEl) return;

        const avatarData = {
            avatarId: authEls.selectedAvatar.value,
            avatarName: selectedEl.dataset.name,
            avatarImg: selectedEl.dataset.img
        };

        try {
            const user = auth.currentUser;
            if (user) {
                await db.collection('users').doc(user.uid).update(avatarData);
                const updatedDoc = await db.collection('users').doc(user.uid).get();
                loginSuccess(updatedDoc.data());
            }
        } catch (error) {
            console.error("[FIREBASE] Profile Update Error:", error);
            showToast("Failed to save profile. Re-authenticating...");
        }
    };

    if (btnEngage) btnEngage.addEventListener('click', handleFinalSubmit);

    // --- Main Menu Logic ---
    menuEls.logoutBtn.addEventListener('click', async () => {
        console.log("[SYSTEM] Initiating secure logout protocol...");
        await authService.logout();
    });

    menuEls.modeCards.forEach(card => {
        card.addEventListener('click', () => {
            // Warm up speech synthesis on direct user gesture
            // This ensures browser allows voice playback in the cutscene
            const synth = window.speechSynthesis;
            synth.cancel();
            const warmup = new SpeechSynthesisUtterance('');
            warmup.volume = 0;
            synth.speak(warmup);
            
            initAudio();

            startCutscene();
        });
    });

    function startCutscene() {
        showScreen('cutscene-screen');
        // Show bottom corner gauges only during cutscene
        document.querySelectorAll('.corner-gauge.bottom-left, .corner-gauge.bottom-right').forEach(el => el.classList.add('show'));
        const screen = document.getElementById('cutscene-screen');
        const subtitleEl = document.getElementById('subtitle-text');
        const statusLabel = document.getElementById('reactor-status-label');
        const centerAlert = document.getElementById('emergency-alert-center');
        const alertOverlay = document.getElementById('alert-overlay');
        const ultronContainer = document.getElementById('ultron-face-container');
        const ultronEyes = document.querySelector('.ultron-eyes');
        const hudCoreStatus = document.getElementById('hud-core-status');
        const hudOutputYield = document.getElementById('hud-output-yield');
        const globalReactorLabel = document.getElementById('global-reactor-label');
        const globalReactorFill = document.getElementById('global-reactor-fill');
        const globalSystemStatus = document.getElementById('global-system-status');

        initAudio();

        const playOminousSound = () => {
            if (!audioCtx) return;
            try {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(150, audioCtx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(30, audioCtx.currentTime + 3);
                gain.gain.setValueAtTime(0, audioCtx.currentTime);
                gain.gain.linearRampToValueAtTime(1, audioCtx.currentTime + 1.5);
                gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 4);
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                osc.start();
                osc.stop(audioCtx.currentTime + 4);
            } catch (e) {}
        };

        const playGlitchSound = () => {
            if (!audioCtx) return;
            try {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(100, audioCtx.currentTime);
                osc.frequency.linearRampToValueAtTime(800, audioCtx.currentTime + 0.1);
                osc.frequency.linearRampToValueAtTime(50, audioCtx.currentTime + 0.4);
                gain.gain.setValueAtTime(0.5, audioCtx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.6);
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                osc.start();
                osc.stop(audioCtx.currentTime + 0.6);
            } catch (e) {}
        };

        const NOMINAL_LINES = [
            `Hey ${currentUser?.alias || 'Agent'}, welcome back again. All systems good to go?`
        ];

        const ATTACK_LINES = [
            "WARNING! The Arc Reactor is sustaining heavy damage!",
            "We're losing containment! You need to work really fast.",
            "You have 3 critical games available. Choose one mission to save your reactor.",
            "ACCEPT THE MISSION!"
        ];

        async function typeText(text, colorClass) {
            return new Promise(resolve => {
                subtitleEl.textContent = '';
                subtitleEl.className = `subtitle-text show ${colorClass}`;
                let i = 0;
                
                const typeChar = () => {
                    if (i < text.length) {
                        subtitleEl.textContent += text[i];
                        if (text[i] !== ' ' && audioCtx && audioCtx.state === 'running') {
                            playTypeClick();
                        }
                        i++;
                        setTimeout(typeChar, 10 + Math.random() * 10);
                    } else {
                        resolve();
                    }
                };
                typeChar();
            });
        }

        const synth = window.speechSynthesis;
        
        async function speak(text, pitch, rate) {
            initAudio();
            return new Promise(resolve => {
                const timeout = setTimeout(() => resolve(), 8000);
                const utterance = new SpeechSynthesisUtterance(text);
                
                const voices = synth.getVoices();
                const maleVoice = voices.find(v => v.name.includes('Male') || v.name.includes('David') || v.name.includes('Google UK English Male') || v.name.includes('Microsoft David'));
                if (maleVoice) utterance.voice = maleVoice;
                
                utterance.pitch = pitch || 1.0;
                utterance.rate = rate || 1.0;
                utterance.onend = () => { clearTimeout(timeout); resolve(); };
                utterance.onerror = () => { clearTimeout(timeout); resolve(); };

                if (synth.paused) synth.resume();
                synth.cancel();
                setTimeout(() => synth.speak(utterance), 50);
            });
        }

        function updateSystemStatus() {
            const chars = "0123456789ABCDEF";
            let result = "";
            for (let i = 0; i < 5; i++) {
                result += "0x" + chars[Math.floor(Math.random()*16)] + chars[Math.floor(Math.random()*16)] + " ";
            }
            if (globalSystemStatus) globalSystemStatus.textContent = "BREACH DETECTED: " + result.trim();
        }

        const statusInterval = setInterval(updateSystemStatus, 150);
        const attackMusic = new Audio('assets/audio/WhatsApp Audio 2026-03-24 at 12.19.29 AM.mp3');

        // Cancellation flag — set to true on skip so runSequence bails at every checkpoint
        let skipped = false;

        function doSkip() {
            if (skipped) return;
            skipped = true;
            synth.cancel();
            clearInterval(statusInterval);
            attackMusic.pause();
            attackMusic.currentTime = 0;
            document.body.classList.remove('animate-shake');
            screen.classList.remove('cutscene-attack');
            alertOverlay.classList.add('hidden');
            centerAlert.classList.add('hidden');
            try { if (audioCtx) audioCtx.close(); } catch(e) {}
            const gamesScreen = document.getElementById('games-screen');
            if (gamesScreen) gamesScreen.classList.add('critical-mode');
            showScreen('games-screen');
        }

        // --- Skip Button (Hold to Override Protocol) ---
        const skipBtn = document.getElementById('cutscene-skip-btn');
        const progressBar = document.getElementById('skip-progress-bar');
        const circumference = 100; // 2 * pi * 15.9
        let holdTimer = null;
        let holdStartTime = 0;
        const HOLD_DURATION = 1500; // 1.5 seconds

        function updateProgress(percent) {
            if (!progressBar) return;
            const offset = circumference - (percent / 100) * circumference;
            progressBar.setAttribute('stroke-dashoffset', offset);
        }


        function startHold(e) {
            if (skipped) return;
            if (e.cancelable) e.preventDefault();
            
            skipBtn.classList.add('holding');
            holdStartTime = Date.now();
            
            function animate() {
                if (!holdStartTime) return; // Hold was cancelled
                
                const elapsed = Date.now() - holdStartTime;
                const percent = Math.min((elapsed / HOLD_DURATION) * 100, 100);
                updateProgress(percent);
                
                if (elapsed >= HOLD_DURATION) {
                    doSkip();
                    holdStartTime = 0;
                    skipBtn.classList.remove('holding');
                } else {
                    holdTimer = requestAnimationFrame(animate);
                }
            }
            
            holdTimer = requestAnimationFrame(animate);
        }

        function cancelHold() {
            if (!holdTimer) return;
            if (typeof holdTimer === 'number') cancelAnimationFrame(holdTimer);
            else clearInterval(holdTimer);
            
            holdTimer = null;
            holdStartTime = 0;
            skipBtn.classList.remove('holding');
            updateProgress(0);
        }

        if (skipBtn) {
            skipBtn.addEventListener('mousedown', startHold);
            skipBtn.addEventListener('touchstart', startHold);
            
            // Global listeners to handle mouse released outside the button
            window.addEventListener('mouseup', cancelHold);
            window.addEventListener('touchend', cancelHold);
            
            // Hover/Mouseleave cleanup
            skipBtn.addEventListener('mouseleave', cancelHold);
        }

        // Cancellable wrapper around setTimeout so skip before sequence starts also works
        let sequenceTimer = null;

        async function runSequence() {
            if (skipped) return;
            synth.cancel();
            if (synth.paused) synth.resume();
            
            hudCoreStatus.textContent = "NOMINAL";
            hudCoreStatus.className = "hud-value";
            hudOutputYield.textContent = "99.9%";
            
            // Phase 1: Greeting
            const greeting = NOMINAL_LINES[0];
            await Promise.all([typeText(greeting, "text-[#00f0ff]"), speak(greeting, 1.0, 1.0)]);
            if (skipped) return;
            await new Promise(r => setTimeout(r, 1200));
            if (skipped) return;

            // Phase 2: Sudden Attack
            ultronContainer.classList.add('show');
            attackMusic.play().catch(e => console.log("Audio play deferred:", e));
            playOminousSound();
            subtitleEl.textContent = ""; 
            await new Promise(r => setTimeout(r, 2000));
            if (skipped) return;

            // Phase 3: Ultron Hacks
            ultronEyes.classList.add('red');
            hudCoreStatus.textContent = "COMPROMISED";
            hudCoreStatus.classList.add('text-[#ff003c]');
            hudOutputYield.textContent = "148.9%";
            
            if (globalReactorFill) {
                globalReactorFill.style.animation = "none";
                globalReactorFill.style.width = "42%";
                globalReactorFill.style.background = "#ff003c";
                globalReactorFill.style.boxShadow = "0 0 20px rgba(255, 0, 60, 0.9)";
            }
            if (globalReactorLabel) {
                globalReactorLabel.textContent = "ARC REACTOR: 42%";
                globalReactorLabel.classList.add('text-[#ff003c]');
            }

            if (skipped) return;
            playGlitchSound();
            screen.classList.add('cutscene-attack');
            statusLabel.textContent = "CRITICAL // CORE COMPROMISED";
            
            document.body.classList.add('animate-shake');
            alertOverlay.classList.remove('hidden');
            centerAlert.classList.remove('hidden');
            
            await new Promise(r => setTimeout(r, 1000));
            if (skipped) return;

            // Phase 4: Attack Dialogue
            for (let i = 0; i < ATTACK_LINES.length; i++) {
                if (skipped) return;
                const line = ATTACK_LINES[i];
                const pitch = i === 0 ? 1.2 : 1.1;
                const rate = i === 3 ? 1.1 : 1.4;
                await Promise.all([typeText(line, "text-[#ff5500]"), speak(line, pitch, rate)]);
                if (skipped) return;
                await new Promise(r => setTimeout(r, 400));
            }

            if (skipped) return;
            setTimeout(() => {
                if (skipped) return;
                clearInterval(statusInterval);
                attackMusic.pause();
                attackMusic.currentTime = 0;
                document.body.classList.remove('animate-shake');
                const gamesScreen = document.getElementById('games-screen');
                gamesScreen.classList.add('critical-mode');
                showScreen('games-screen');
                audioCtx.close();
            }, 2000);
        }

        sequenceTimer = setTimeout(runSequence, 1000);
    }

    function startVictoryCutscene() {
        const screen = document.getElementById('cutscene-screen');
        const subtitleEl = document.getElementById('subtitle-text');
        if (subtitleEl) subtitleEl.textContent = ''; // Clear old subtitles immediately
        
        const ultronContainer = document.getElementById('ultron-container');
        const ultronEyes = document.getElementById('ultron-eyes');
        const statusLabel = document.querySelector('.reactor-status-label');
        const hudCoreStatus = document.getElementById('hud-core-status');
        const hudOutputYield = document.getElementById('hud-output-yield');
        const skipContainer = document.querySelector('.tactical-skip-container');
        
        let audioCtx;
        try {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            if (audioCtx.state === 'suspended') audioCtx.resume();
        } catch (e) {}

        const victoryMusic = new Audio('assets/audio/Game win bgm (online-audio-converter.com).mp3');

        const synth = window.speechSynthesis;
        
        async function speak(text) {
            return new Promise(resolve => {
                const timeout = setTimeout(() => resolve(), 8000);
                const utterance = new SpeechSynthesisUtterance(text);
                const voices = synth.getVoices();
                const maleVoice = voices.find(v => v.name.includes('Male') || v.name.includes('David') || v.name.includes('Google UK English Male'));
                if (maleVoice) utterance.voice = maleVoice;
                utterance.pitch = 1.0;
                utterance.rate = 1.0;
                utterance.onend = () => { clearTimeout(timeout); resolve(); };
                utterance.onerror = () => { clearTimeout(timeout); resolve(); };
                if (synth.paused) synth.resume();
                synth.cancel();
                setTimeout(() => synth.speak(utterance), 50);
            });
        }

        async function typeText(text, colorClass) {
            return new Promise(resolve => {
                subtitleEl.textContent = '';
                subtitleEl.className = `subtitle-text show ${colorClass}`;
                let i = 0;
                const typeChar = () => {
                    if (i < text.length) {
                        subtitleEl.textContent += text[i];
                        i++;
                        setTimeout(typeChar, 30);
                    } else {
                        resolve();
                    }
                };
                typeChar();
            });
        }

        let skipped = false;
        function doSkip() {
            if (skipped) return;
            skipped = true;
            synth.cancel();
            
            screen.classList.remove('cutscene-attack');
            if (ultronContainer) {
                ultronContainer.style.transition = "";
                ultronContainer.style.opacity = "";
                ultronContainer.style.transform = "";
                ultronContainer.classList.remove('show');
            }

            victoryMusic.pause();
            victoryMusic.currentTime = 0;

            if (skipContainer) skipContainer.style.display = '';

            const gamesScreen = document.getElementById('games-screen');
            if (gamesScreen) gamesScreen.classList.remove('critical-mode');
            showScreen('games-screen');
            if (audioCtx) audioCtx.close();
        }

        // Setup DOM for clean Victory
        screen.classList.remove('cutscene-attack');
        if (skipContainer) skipContainer.style.display = 'none';
        if (ultronContainer) {
            ultronContainer.classList.remove('show');
        }
        document.body.classList.remove('animate-shake');
        
        if (hudCoreStatus) {
            hudCoreStatus.textContent = "NOMINAL";
            hudCoreStatus.className = "hud-value text-[#00f0ff]";
        }
        if (hudOutputYield) hudOutputYield.textContent = "99.9%";
        
        const globalReactorFill = document.querySelector('.arc-reactor-gauge-fill');
        const globalReactorLabel = document.querySelector('.arc-reactor-label');
        if (globalReactorFill) {
            globalReactorFill.style.animation = "none";
            globalReactorFill.style.width = "99.9%";
            globalReactorFill.style.background = "#00f0ff";
            globalReactorFill.style.boxShadow = "0 0 20px rgba(0, 240, 255, 0.9)";
        }
        if (globalReactorLabel) {
            globalReactorLabel.textContent = "ARC REACTOR: 99.9%";
            globalReactorLabel.classList.remove('text-[#ff003c]');
            globalReactorLabel.classList.add('text-[#00f0ff]');
        }
        if (statusLabel) statusLabel.textContent = "SYS_READY // CORE: STABLE";

        showScreen('cutscene-screen');

        async function runSequence() {
            if (skipped) return;
            
            victoryMusic.play().catch(e => console.log("Victory audio deferred:", e));
            
            await new Promise(r => setTimeout(r, 1500));
            if (skipped) return;
            
            const text = "Congratulations. You have successfully repaired the code. The Arc Reactor is saved.";
            await Promise.all([typeText(text, "text-[#00f0ff]"), speak(text)]);
            
            await new Promise(r => setTimeout(r, 2000));
            doSkip();
        }
        
        setTimeout(runSequence, 300);
    }

    document.getElementById('back-to-menu-from-games').addEventListener('click', () => {
        showScreen('menu-screen');
    });

    // --- Hexagonal Defense Grid Animation ---
    class HexagonalGrid {
        constructor(canvasId) {
            this.canvas = document.getElementById(canvasId);
            if (!this.canvas) return;
            this.ctx = this.canvas.getContext('2d');
            this.hexagons = [];
            this.mouse = { x: -2000, y: -2000 };
            this.hexSize = 42;
            this.gap = 4;
            
            window.addEventListener('resize', () => this.resize());
            window.addEventListener('mousemove', (e) => this.handleMouseMove(e));
            this.resize();
        }

        resize() {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
            this.initGrid();
        }

        handleMouseMove(e) {
            const rect = this.canvas.getBoundingClientRect();
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top;
        }

        initGrid() {
            this.hexagons = [];
            const w = this.canvas.width;
            const h = this.canvas.height;
            const unitW = this.hexSize * 1.5;
            const unitH = Math.sqrt(3) * this.hexSize;
            
            const cols = Math.ceil(w / unitW) + 1;
            const rows = Math.ceil(h / unitH) + 1;

            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < cols; c++) {
                    const x = c * unitW;
                    const y = r * unitH + (c % 2 === 0 ? 0 : unitH / 2);
                    this.hexagons.push({
                        x, y,
                        opacity: 0,
                        targetOpacity: 0,
                        pulseDelay: Math.random() * 10000,
                        lastPulse: Date.now()
                    });
                }
            }
        }

        drawHexagon(x, y, radius, opacity) {
            const ctx = this.ctx;
            ctx.beginPath();
            for (let i = 0; i < 6; i++) {
                const angle = (Math.PI / 180) * (60 * i);
                const hx = x + radius * Math.cos(angle);
                const hy = y + radius * Math.sin(angle);
                if (i === 0) ctx.moveTo(hx, hy);
                else ctx.lineTo(hx, hy);
            }
            ctx.closePath();
            
            // Wireframe
            ctx.strokeStyle = `rgba(0, 240, 255, ${0.03 + opacity * 0.15})`;
            ctx.lineWidth = 1;
            ctx.stroke();

            if (opacity > 0.01) {
                // Glow
                ctx.save();
                ctx.shadowBlur = 10 * opacity;
                ctx.shadowColor = '#00f0ff';
                ctx.fillStyle = `rgba(0, 240, 255, ${opacity * 0.1})`;
                ctx.fill();
                ctx.restore();
            }
        }

        animate() {
            if (!this.canvas || !screens.about.classList.contains('active')) return;
            
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            const now = Date.now();

            this.hexagons.forEach(hex => {
                // Proximity effect
                const dx = hex.x - this.mouse.x;
                const dy = hex.y - this.mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const proximity = Math.max(0, 1 - dist / 250);
                
                // Random pulse
                if (now - hex.lastPulse > hex.pulseDelay) {
                    hex.targetOpacity = 0.8;
                    hex.lastPulse = now;
                    hex.pulseDelay = 5000 + Math.random() * 15000;
                }

                if (hex.targetOpacity > 0) {
                    hex.targetOpacity -= 0.005;
                }

                hex.opacity = Math.max(proximity * 0.6, hex.targetOpacity);
                if (hex.opacity > 0) {
                    this.drawHexagon(hex.x, hex.y, this.hexSize - this.gap, hex.opacity);
                }
            });

            requestAnimationFrame(() => this.animate());
        }
    }

    let aboutGrid = null;

    // --- About Screen Navigation ---
    const aboutNavBtn = document.getElementById('about-nav-btn');
    if (aboutNavBtn) {
        aboutNavBtn.addEventListener('click', () => {
            showScreen('about-screen');
            if (!aboutGrid) {
                aboutGrid = new HexagonalGrid('about-canvas');
            }
            aboutGrid.animate();
        });
    }
    const aboutBackBtn = document.getElementById('about-back-btn');
    if (aboutBackBtn) {
        aboutBackBtn.addEventListener('click', () => {
            showScreen('menu-screen');
        });
    }

    // --- Cryptography Game Logic ---
    const initiateMissions = [
        { id: 'E1', name: 'ALPHABET DISPLACEMENT', cipher: 'FBEHU', solution: 'CYBER', type: 'shift', shift: 3, hint: 'Data stream offset by 3 positions forward in the alphabet.' },
        { id: 'E2', name: 'REVERSED MATRIX', cipher: 'XIRTAM', solution: 'MATRIX', type: 'reverse', hint: 'Core signal direction vector is completely inverted.' },
        { id: 'E3', name: 'COORDINATE OVERRIDE', cipher: '6 9 18 5 23 1 12 12', solution: 'FIREWALL', type: 'number', hint: 'Integers represent 1-26 positional index of defense system.' },
        { id: 'E4', name: 'NOISE ISOLATION', cipher: 'P#H#A#N#T#O#M', solution: 'PHANTOM', type: 'noise', hint: 'Filter out inline hash symbols masking stealth identity.' },
        { id: 'E5', name: 'PAIR PERMUTATION', cipher: 'ESTNNILE', solution: 'SENTINEL', type: 'swap', hint: 'Consecutive letter pairs have been swapped in transmission.' },
        { id: 'E6', name: 'NUMERIC OFFSET', cipher: '5678', solution: '3456', type: 'shift', shift: 2, hint: 'Numerical stream shifted forward by 2 digits.' },
        { id: 'E7', name: 'INVERTED EVEN STREAM', cipher: '08642', solution: '24680', type: 'reverse', hint: 'Even digit sequence has been inverted end-to-end.' },
        { id: 'E8', name: 'INDEX CIPHER', cipher: '20 5 13 16 5 19 20', solution: 'TEMPEST', type: 'number', hint: 'Sequence maps directly to alphabet positions (1=A, 20=T).' },
        { id: 'E9', name: 'DELIMITER PURGE', cipher: 'V@I@B@R@A@N@I@U@M', solution: 'VIBRANIUM', type: 'noise', hint: 'Remove inline delimiter artifacts (@) to reveal element.' },
        { id: 'E10', name: 'ODD DIGIT TRANSPOSITION', cipher: '31759', solution: '13579', type: 'swap', hint: 'Odd number sequence with adjacent digit pairs swapped.' },
        { id: 'E11', name: 'TRIPLE SHIFT', cipher: 'YDOTBLUL', solution: 'VALKYRIE', type: 'shift', shift: 3, hint: 'Letters advanced by 3 steps; roll back to identify warrior.' },
        { id: 'E12', name: 'REVERSED PRIME CODE', cipher: '93175', solution: '57139', type: 'reverse', hint: 'Prime-embedded numerical signal inverted.' },
        { id: 'E13', name: 'NUMERIC GRID', cipher: '8 25 4 18 1', solution: 'HYDRA', type: 'number', hint: 'Encrypted numeric coordinates map to rogue organization.' },
        { id: 'E14', name: 'STATIC STRIPPER', cipher: 'I*N*F*I*N*I*T*Y', solution: 'INFINITY', type: 'noise', hint: 'Strip wildcard noise stars inserted across core.' },
        { id: 'E15', name: 'CONSTANT DIGIT SWAP', cipher: '728182', solution: '271828', type: 'swap', hint: 'Mathematical constant digits pair-swapped in transmission.' },
        { id: 'E16', name: 'ADVANCED ROTATION', cipher: 'GEIWEV', solution: 'CAESAR', type: 'shift', shift: 4, hint: 'Classical cipher algorithm shifted by 4 positions.' },
        { id: 'E17', name: 'DIGIT DISPLACEMENT', cipher: '1243', solution: '9021', type: 'shift', shift: 2, hint: 'Numerical cipher offset forward by +2 digits.' },
        { id: 'E18', name: 'ALPHA DECODER', cipher: '2 1 19 20 9 15 14', solution: 'BASTION', type: 'number', hint: 'Standard 1-26 numeric index key for defensive node.' },
        { id: 'E19', name: 'CLEAN SIGNAL', cipher: 'E%C%L%I%P%S%E', solution: 'ECLIPSE', type: 'noise', hint: 'Purge percent symbols masking planetary alignment.' },
        { id: 'E20', name: 'BLOCK TRANSPOSITION', cipher: 'EHILACRREIR', solution: 'HELICARRIER', type: 'swap', hint: 'Helicarrier tactical registry has pairwise swapped letters.' },
        { id: 'E21', name: 'QUAD SHIFT', cipher: 'WXVMIV', solution: 'STRIKER', type: 'shift', shift: 4, hint: 'Uniform 4-letter offset progression in attack vector.' },
        { id: 'E22', name: 'NUMERIC CODE ZERO', cipher: '26 5 18 15', solution: 'ZERO', type: 'number', hint: 'Alphanumeric positions for terminal countdown.' },
        { id: 'E23', name: 'NOISY COUNTDOWN', cipher: '8#6$4%2^0', solution: '86420', type: 'noise', hint: 'Even digit countdown masked by noise symbols.' },
        { id: 'E24', name: 'SYMBOL REMOVAL', cipher: 'J!A!R!V!I!S', solution: 'JARVIS', type: 'noise', hint: 'Filter out exclamation marks from AI protocol stream.' },
        { id: 'E25', name: 'FINAL SHIFT INITIATE', cipher: 'YLVLRQ', solution: 'VISION', type: 'shift', shift: 3, hint: 'Shift back 3 letters to reveal synthezoid identity.' }
    ];

    const operativeMissions = [
        { id: 'M1', name: 'TACTICAL REVERSE', cipher: 'HCTAWREVO', solution: 'OVERWATCH', type: 'reverse', hint: 'Tactical surveillance beacon reversed.' },
        { id: 'M2', name: 'ALPHA DISPLACEMENT OPERATIVE', cipher: 'MRJMPXVEXSV', solution: 'INFILTRATOR', type: 'shift', shift: 4, hint: 'Infiltration unit callsign shifted +4 steps.' },
        { id: 'M3', name: 'NUMERIC SYSTEM PROTOCOL', cipher: '16 18 15 20 15 3 15 12', solution: 'PROTOCOL', type: 'number', hint: 'Security protocol numerical coordinates.' },
        { id: 'M4', name: 'NOISE MATRIX CYBER', cipher: 'C#$Y%B^E&R!@S#$P%^A&*(C)_+E', solution: 'CYBERSPACE', type: 'noise', hint: 'Scrambled static overlay shielding digital grid.' },
        { id: 'M5', name: 'SWAP OPERATIVE HERO', cipher: 'LBCAPKNAHTRE', solution: 'BLACKPANTHER', type: 'swap', hint: 'Wakandan king identity pair-permuted.' },
        { id: 'M6', name: 'MYTHIC SHIFT GRID', cipher: 'JCHFQNGZW', solution: 'EXCALIBUR', type: 'shift', shift: 5, hint: 'Mythic defense grid offset by 5 positions.' },
        { id: 'M7', name: 'COMMAND REVERSE OVERRIDE', cipher: 'ROTANIMOD', solution: 'DOMINATOR', type: 'reverse', hint: 'Inverted command node vector.' },
        { id: 'M8', name: 'LABYRINTH NUMERIC CORE', cipher: '12 1 2 25 18 9 14 20 8', solution: 'LABYRINTH', type: 'number', hint: 'Positional index for sub-level maze core.' },
        { id: 'M9', name: 'COMMANDER NOISE SIGNAL', cipher: 'S!@T#$A%^R&*(L!@O#$R%^D', solution: 'STARLORD', type: 'noise', hint: 'Guardians commander signal masked by static.' },
        { id: 'M10', name: 'TACTICAL SWAP PLAN', cipher: 'TSARATEGM', solution: 'STRATAGEM', type: 'swap', hint: 'Battle plan registry pairwise swapped.' },
        { id: 'M11', name: 'SUBSEA SHIFT OPERATIVE', cipher: 'OHYLDWKDQ', solution: 'LEVIATHAN', type: 'shift', shift: 3, hint: 'Sub-sea anomaly grid shifted forward by 3.' },
        { id: 'M12', name: 'NETWORK STREAM REVERSE', cipher: 'DIRGREBYC', solution: 'CYBERGRID', type: 'reverse', hint: 'Digital network stream inverted.' },
        { id: 'M13', name: 'RANK NUMERIC OPERATIVE', cipher: '3 5 14 20 21 18 9 15 14', solution: 'CENTURION', type: 'number', hint: 'Nova Corps rank encoded in positional numbers.' },
        { id: 'M14', name: 'ROGUE BASE NOISE', cipher: 'H!@Y#$D%^R&*(A!@B#$A%^S&*(E', solution: 'HYDRABASE', type: 'noise', hint: 'Rogue installation channel flooded with symbols.' },
        { id: 'M15', name: 'ARMORED SWAP UNIT', cipher: 'AWMRCAIHEN', solution: 'WARMACHINE', type: 'swap', hint: 'Armored response unit callsign transposed.' },
        { id: 'M16', name: 'TELEPORT SHIFT OPERATIVE', cipher: 'RMKLXGVEAPIV', solution: 'NIGHTCRAWLER', type: 'shift', shift: 4, hint: 'Teleportation mutant key shifted by +4.' },
        { id: 'M17', name: 'EVENT HORIZON REVERSE', cipher: 'MSYLCATAC', solution: 'CATACLYSM', type: 'reverse', hint: 'Global event horizon string reversed.' },
        { id: 'M18', name: 'SPECTRUM NUMERIC ARRAY', cipher: '17 21 9 3 11 19 9 12 22 5 18', solution: 'QUICKSILVER', type: 'number', hint: 'High-speed operative numeric array.' },
        { id: 'M19', name: 'AVENGER NOISE FREQUENCY', cipher: 'W!@O#$N%^D&*(E!@R#$M%^A&*(N', solution: 'WONDERMAN', type: 'noise', hint: 'Avenger frequency corrupted by cosmic noise.' },
        { id: 'M20', name: 'STRIKE SQUAD SWAP', cipher: 'HTNUEDBRLOT', solution: 'THUNDERBOLT', type: 'swap', hint: 'Tactical strike squad name permuted in pairs.' },
        { id: 'M21', name: 'AUTHORITY NUMERIC KEY', cipher: '15 13 14 9 16 15 20 5 14 20', solution: 'OMNIPOTENT', type: 'number', hint: 'Cosmic authority key in 1-26 alphabet values.' },
        { id: 'M22', name: 'COUNTDOWN DIGIT REVERSE', cipher: '901234567', solution: '765432109', type: 'reverse', hint: 'Operative level numeric stream inverted.' },
        { id: 'M23', name: 'HERO BADGE NUMERIC', cipher: '4 1 18 5 4 5 22 9 12', solution: 'DAREDEVIL', type: 'number', hint: 'Hell\'s Kitchen hero badge in positional index.' },
        { id: 'M24', name: 'OPERATIVE DIGIT SHIFT', cipher: '9012345', solution: '6789012', type: 'shift', shift: 3, hint: 'Operative digit cipher shifted by +3 vector.' },
        { id: 'M25', name: 'MARKSMAN SHIFT CALLSIGN', cipher: 'MFBPJDJ', solution: 'HAWKEYE', type: 'shift', shift: 5, hint: 'Marksman operative callsign offset by +5.' }
    ];

    const omegaMissions = [
        { id: 'H1', name: 'OMEGA SHIFT 1', cipher: 'JOYVUVZWOLYL', solution: 'CHRONOSPHERE', type: 'shift', shift: 7, hint: 'Temporal grid shifted by 7 alpha positions.' },
        { id: 'H2', name: 'OMEGA REVERSE 1', cipher: 'SCISYHPORTSA', solution: 'ASTROPHYSICS', type: 'reverse', hint: 'Cosmic telemetry stream inverted backwards.' },
        { id: 'H3', name: 'OMEGA NUMBER 1', cipher: '14 1 14 15 20 5 3 8 14 15 12 15 7 25', solution: 'NANOTECHNOLOGY', type: 'number', hint: 'Complex 14-element positional coordinate key for nanites.' },
        { id: 'H4', name: 'OMEGA NOISE 1', cipher: '!#M$%U^&L*(T)_+I{|V}:"E<>?R~`S!@E', solution: 'MULTIVERSE', type: 'noise', hint: 'Dense multi-tier noise cluster obscuring timeline core.' },
        { id: 'H5', name: 'OMEGA SWAP 1', cipher: 'IVRBNAUICMROE', solution: 'VIBRANIUMCORE', type: 'swap', hint: 'Wakandan metal core transposed in adjacent character pairs.' },
        { id: 'H6', name: 'OMEGA SHIFT 2', cipher: 'BMTMXZBIBQWV', solution: 'TELEPORTATION', type: 'shift', shift: 8, hint: 'Quantum leap offset forward by 8 alphabet positions.' },
        { id: 'H7', name: 'OMEGA REVERSE 2', cipher: 'LANOISNEMIDARTXE', solution: 'EXTRADIMENSIONAL', type: 'reverse', hint: 'Inter-realm vector sequence inverted from end to end.' },
        { id: 'H8', name: 'OMEGA NUMBER 2', cipher: '19 9 14 7 21 12 1 18 9 20 25', solution: 'SINGULARITY', type: 'number', hint: 'Black hole event horizon encoded into 11-digit coordinate array.' },
        { id: 'H9', name: 'OMEGA NOISE 2', cipher: '@#A$%N^&T*(I)_+M{|}A:"T<>?T~`E!@R', solution: 'ANTIMATTER', type: 'noise', hint: 'Heavy sub-atomic particle noise shielding dark energy.' },
        { id: 'H10', name: 'OMEGA SWAP 2', cipher: 'HTREOMUNLCAER', solution: 'THERMONUCLEAR', type: 'swap', hint: 'Sub-atomic nuclear payload pair-swapped.' },
        { id: 'H11', name: 'OMEGA SHIFT 3', cipher: 'SJZWTYWFSXRNYYJW', solution: 'NEUROTRANSMITTER', type: 'shift', shift: 5, hint: 'Neural pathway signal shifted by 5 units.' },
        { id: 'H12', name: 'OMEGA REVERSE 3', cipher: 'CITENGAMORTCELE', solution: 'ELECTROMAGNETIC', type: 'reverse', hint: 'Emp pulse signal inverted across main conduit.' },
        { id: 'H13', name: 'OMEGA NUMBER 3', cipher: '2 9 15 3 8 5 13 9 19 20 18 25', solution: 'BIOCHEMISTRY', type: 'number', hint: 'Serum formula encoded in sequential positional numbers.' },
        { id: 'H14', name: 'OMEGA NOISE 3', cipher: '$%S^&U*()P_+=E~`R!@P#$O%^S&*(I)_+T{|I}:"O<>?N', solution: 'SUPERPOSITION', type: 'noise', hint: 'Quantum superposition state obscured by multi-layered static.' },
        { id: 'H15', name: 'OMEGA SWAP 3', cipher: 'RCPYOTNALASYSI', solution: 'CRYPTOANALYSIS', type: 'swap', hint: 'Decryption analysis matrix scrambled in pairwise blocks.' },
        { id: 'H16', name: 'OMEGA SHIFT 4', cipher: 'QHYNABYJLN', solution: 'HYPERSPACE', type: 'shift', shift: 9, hint: 'Hyperspace jump coordinates offset by 9 alphabet steps.' },
        { id: 'H17', name: 'OMEGA REVERSE 4', cipher: 'YGRENECTENIK', solution: 'KINETICENERGY', type: 'reverse', hint: 'Absorbed kinetic energy vector reversed.' },
        { id: 'H18', name: 'OMEGA NUMBER 4', cipher: '1 19 20 18 15 16 8 25 19 9 3 1 12', solution: 'ASTROPHYSICAL', type: 'number', hint: 'Celestial beacon coordinates mapped to 1-26 index.' },
        { id: 'H19', name: 'OMEGA NOISE 4', cipher: '!@H#$E%^L&*(I)_+O~`S!@U#$S%^P&*(E)_+N{|}S:"I<>?O~`N', solution: 'HELIOSUSPENSION', type: 'noise', hint: 'Solar reactor suspension protocol surrounded by corrupted stream.' },
        { id: 'H20', name: 'OMEGA SWAP 4', cipher: 'NIETSRETLLRA', solution: 'INTERSTELLAR', type: 'swap', hint: 'Interstellar flight registry pair-permuted.' },
        { id: 'H21', name: 'OMEGA SHIFT 5', cipher: '5432109876', solution: '9876543210', type: 'shift', shift: 6, hint: 'Numeric grid countdown offset forward by +6 steps.' },
        { id: 'H22', name: 'OMEGA DIGIT REVERSE', cipher: '445566778899', solution: '998877665544', type: 'reverse', hint: 'Core numeric sequence flow inverted.' },
        { id: 'H23', name: 'FINAL NUMBER OMEGA', cipher: '19 15 18 3 5 18 5 18 19 21 16 18 5 13 5', solution: 'SORCERERSUPREME', type: 'number', hint: 'Master of Mystic Arts security code in 1-26 positions.' },
        { id: 'H24', name: 'FINAL NOISE OMEGA', cipher: '!#S$%T^&O*(R)_+M{|}S:"T<>?R~`Y!@K#$E%^R', solution: 'STORMSTRYKER', type: 'noise', hint: 'Heavy weather defense payload masked by multi-symbol static.' },
        { id: 'H25', name: 'FINAL SWAP OMEGA', cipher: 'AGALTCICOCSNMURE', solution: 'GALACTICCONSUMER', type: 'swap', hint: 'Cosmic devouring protocol pair-permuted.' }
    ];

    function fisherYatesShuffle(array) {
        let arr = [...array];
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }

    function shuffleMissions(array) {
        return fisherYatesShuffle(array);
    }

    function shuffleMissions(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    let cryptoState = {
        missionIdx: 0,
        time: 60,
        initialTime: 60,
        timerId: null,
        endTimerId: null,   // tracks the auto-navigate timeout
        lives: 1,
        caesarShift: 0,
        difficulty: 'OMEGA',
        missions: omegaMissions,
        gameOver: false,    // true when game is fully complete or failed
        activeTools: [],    // Current 5 tools in the dashboard
        functionalTools: [], // Tools that work for the current mission (3/5)
        missionClickCount: 0 // Progress towards 3nd-step reveal
    };

    const failSound = new Audio('assets/audio/fahhhhhhhhhhhhhh.mp3');
    const operativeFailSound = new Audio('assets/audio/spongebob-fail.mp3');
    operativeFailSound.preload = 'auto';

    const cryptoEls = {
        screen: document.getElementById('crypto-game-screen'),
        selectionScreen: document.getElementById('crypto-level-selection-screen'),
        timer: document.getElementById('crypto-timer'),
        missionTitle: document.getElementById('crypto-mission-title'),
        levelStatus: document.getElementById('crypto-level-status'),
        encryptedText: document.getElementById('encrypted-text'),
        decryptedInput: document.getElementById('decrypted-input'),
        log: document.getElementById('tool-output-log'),
        modalOverlay: document.getElementById('crypto-modal-overlay'),
        modalTitle: document.getElementById('modal-title'),
        modalMessage: document.getElementById('modal-message'),
        submitBtn: document.getElementById('submit-decryption'),
        resetBtn: document.getElementById('reset-mission'),
        continueBtn: document.getElementById('modal-continue'),
        toolBtns: document.querySelectorAll('.tool-btn'),
        startBtns: document.querySelectorAll('.crypto-start-btn'),
        backToHubBtn: document.getElementById('back-to-hub'),
        toolGrid: document.querySelector('.tool-grid'),
        rulesScreen: {
            screen: document.getElementById('rules-screen'),
            type: document.getElementById('rules-mission-type'),
            title: document.getElementById('rules-title'),
            diff: document.getElementById('rules-difficulty'),
            objective: document.getElementById('rules-objective'),
            list: document.getElementById('rules-list'),
            warning: document.getElementById('rules-warning'),
            startBtn: document.getElementById('rules-start-btn'),
            backBtn: document.getElementById('rules-back-btn')
        }
    };

    let pendingMission = null;
    let rulesGrid = null;

    let audioCtx = null;
    const synth = window.speechSynthesis;

    function initAudio() {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
    }

    function playTypeClick() {
        if (!audioCtx) return;
        try {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'square';
            osc.frequency.setValueAtTime(800 + Math.random() * 200, audioCtx.currentTime);
            gain.gain.setValueAtTime(0.01, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.05);
        } catch (e) {}
    }

    window.speakText = function(text, motivated = true) {
        if (!synth) return;
        
        // Improve pronunciation for technical terms
        let cleanText = text
            .replace(/LETTER SHIFT/gi, "Letter Shift")
            .replace(/REVERSE TEXT/gi, "Reverse Text")
            .replace(/NUMBER CODE/gi, "Number Code")
            .replace(/REMOVE NOISE/gi, "Remove Noise")
            .replace(/SWAP PAIRS/gi, "Swap Pairs")
            .replace(/PHANTOM/gi, "Fan-tom")
            .replace(/OMEGA/gi, "O-may-ga")
            .replace(/PROTOCOL/gi, "Pro-to-kol");

        synth.cancel();
        
        // Small timeout to allow synth.cancel() to clear the buffer
        setTimeout(() => {
            const utterance = new SpeechSynthesisUtterance(cleanText);
            utterance.pitch = motivated ? 1.05 : 1.0; // Reduced from 1.2 for better stability
            utterance.rate = motivated ? 1.0 : 1.0;  // Reduced from 1.1 for better clarity
            utterance.volume = 1.0;

            const voices = synth.getVoices();
            // Prioritize higher quality male/tech voices
            const maleVoice = voices.find(v => v.name.includes('Male') || v.name.includes('David') || v.name.includes('Google UK English Male') || v.name.includes('Microsoft David'));
            if (maleVoice) utterance.voice = maleVoice;
            
            synth.speak(utterance);
        }, 50);
    }

    const cryptoStartSound = new Audio('assets/audio/WhatsApp Audio 2026-03-24 at 1.09.55 AM.mp3');
    cryptoStartSound.preload = 'auto';

    const lifeAlertSound = new Audio('assets/audio/dun-dun-dun-sound-effect-brass_8nFBccR.mp3');
    lifeAlertSound.preload = 'auto';

    const cryptoInitiateWinSound = new Audio('assets/audio/1st win bgm (online-audio-converter.com).mp3');
    cryptoInitiateWinSound.preload = 'auto';

    const cryptoAdvancedBgm = new Audio('assets/audio/2 and 3 lev bgm (online-audio-converter.com).mp3');
    cryptoAdvancedBgm.preload = 'auto';
    cryptoAdvancedBgm.loop = true;

    const cryptoOperativeWinSound = new Audio('assets/audio/2 level win (online-audio-converter.com).mp3');
    cryptoOperativeWinSound.preload = 'auto';

    function flashLifeWarning() {
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(255, 0, 0, 0.4);
            display: flex; align-items: center; justify-content: center;
            z-index: 10000;
            animation: flashFade 3s forwards;
            pointer-events: none;
        `;
        overlay.innerHTML = `
            <div style="
                color: #ff003c;
                font-family: 'Orbitron', sans-serif;
                font-size: 5rem;
                font-weight: 800;
                text-shadow: 0 0 20px #ff003c, 0 0 40px #000;
                letter-spacing: 5px;
                animation: scaleAlert 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            ">
                ONE LIFE REMAINING
            </div>
            <style>
                @keyframes flashFade {
                    0% { opacity: 0; }
                    10% { opacity: 1; }
                    90% { opacity: 1; }
                    100% { opacity: 0; }
                }
                @keyframes scaleAlert {
                    0% { transform: scale(0.5); opacity: 0; }
                    100% { transform: scale(1); opacity: 1; }
                }
            </style>
        `;
        document.body.appendChild(overlay);
        lifeAlertSound.currentTime = 0;
        lifeAlertSound.play().catch(() => {});
        setTimeout(() => overlay.remove(), 3000);
    }

    function startCryptoGame() {
        initAudio();
        updateCryptoLevelSelection();
        showScreen('crypto-level-selection-screen');
        createFloatingCharsSelection('#crypto-level-selection-screen .crypto-layer.layer-3');
    }

    let bugBountyGrid = null;

    function startBugBountyGame() {
        initAudio();
        // For now, Bug Bounty levels are unlocked by default or can follow their own logic later
        updateBugBountyLevelSelection(); 
        showScreen('bug-bounty-level-selection-screen');
        
        if (!bugBountyGrid) {
            bugBountyGrid = new CyberGridAnimation('bug-bounty-grid-canvas');
        }
        bugBountyGrid.start();
        
        createFloatingCharsSelection('#bug-bounty-level-selection-screen .crypto-layer.layer-3');
    }

    // Level update logic consolidated to top area

    cryptoEls.startBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const currentBtn = e.currentTarget;
            const diff = currentBtn.dataset.diff;
            const levelVal = diff === 'initiate' ? 1 : (diff === 'operative' ? 2 : 3);
            
            if (levelVal > cryptoUnlockedLevel) {
                showToast("SECURITY PROTOCOL: Complete previous mission to unlock.");
                return;
            }
            
            showRules('CRYPTOGRAPHY', diff);
        });
    });

    const backToHubBB = document.getElementById('back-to-hub-from-bug-bounty');
    if (backToHubBB) {
        backToHubBB.addEventListener('click', () => {
            cryptoStartSound.pause();
            cryptoAdvancedBgm.pause();
            showScreen('games-screen');
        });
    }

    function showRules(gameType, diff) {
        pendingMission = { gameType, diff };
        
        if (cryptoEls.rulesScreen.startBtn) {
            cryptoEls.rulesScreen.startBtn.disabled = false;
            cryptoEls.rulesScreen.startBtn.style.opacity = "1";
            cryptoEls.rulesScreen.startBtn.style.pointerEvents = "auto";
        }
        
        const rules = cryptoEls.rulesScreen;
        rules.type.textContent = gameType === 'CRYPTOGRAPHY' ? 'NEXUS DECRYPTION PROTOCOL' : 'NEURAL BREACH PROTOCOL';
        rules.title.textContent = `${diff.toUpperCase()} // LEVEL ${diff === 'initiate' ? '1' : (diff === 'operative' ? '2' : '3')}`;
        
        if (gameType === 'CRYPTOGRAPHY') {
            const reqMissions = 2;
            const livesCount = diff === 'initiate' ? 2 : (diff === 'operative' ? 2 : 1);
            rules.diff.textContent = diff === 'initiate' ? 'LOW COMPLEXITY' : (diff === 'operative' ? 'STANDARD COMPLEXITY' : 'CRITICAL COMPLEXITY');
            rules.diff.style.color = diff === 'initiate' ? '#00ffcc' : (diff === 'operative' ? '#ffaa00' : '#ff003c');
            rules.objective.textContent = `Secure and decrypt ${reqMissions} fluctuating data streams before the timer expires.`;
            rules.list.innerHTML = `
                <li><b>Identify:</b> Observe the pattern in the "ENCRYPTED_STREAM" box.</li>
                <li><b>Hints:</b> Use the "USE HINT" button (3 tries max per mission).</li>
                <li><b>Penalties:</b> 1st Hint (-10s), 2nd Hint (-20s), 3rd Hint (-40s).</li>
                <li><b>Execute:</b> Type the result in DECRYPTION_INPUT and hit EXECUTE DECRYPT.</li>
                <li><b>Cracking Req:</b> SOLVE ${reqMissions} PACKETS TO COMPLETE LEVEL.</li>
                <li><b>Protocol:</b> ${livesCount} LIVES AVAILABLE // NO TRICKS ALLOWED.</li>
            `;
            rules.warning.textContent = "Multiple failed attempts or time expiration will trigger a system lockout.";
        } else if (gameType === 'BUG BOUNTY') {
            const missionsToSolve = 2;
            const livesCount = diff === 'initiate' ? 2 : 1;
            const timeLimit = diff === 'initiate' ? 120 : (diff === 'operative' ? 90 : 60);

            rules.diff.textContent = diff === 'initiate' ? 'LOW COMPLEXITY' : (diff === 'operative' ? 'TACTICAL BREACH' : 'CRITICAL EXPOSURE');
            rules.diff.style.color = diff === 'initiate' ? '#00f0ff' : (diff === 'operative' ? '#ffaa00' : '#ff003c');
            rules.objective.textContent = `Identify and patch ${missionsToSolve} code vulnerabilities within the system kernel.`;
            rules.list.innerHTML = `
                <li><b>Analyze:</b> Scan the "SOURCE_CODE_TERMINAL" for syntax or logic bugs.</li>
                <li><b>Language:</b> Snippets may be in C, C++, Python, or Java.</li>
                <li><b>Patch:</b> Type the nature of the error in the input line (e.g., "missing semicolon").</li>
                <li><b>Cracking Req:</b> PATCH ${missionsToSolve} BUGS TO SECURE KERNEL.</li>
                <li><b>Protocol:</b> ${livesCount} LIVES // ${timeLimit}s TIME LIMIT.</li>
                <li><b>Hint:</b> You can expend 20s of system stability for a tactical hint.</li>
            `;
            rules.warning.textContent = "Each failed patch attempt causes severe system instability.";
        } else {
            const config = quantumMissions[diff];
            const winReq = 2;
            rules.diff.textContent = diff === 'initiate' ? 'LOW SYNC' : (diff === 'operative' ? 'TACTICAL SYNC' : 'EXTREME SYNC');
            rules.diff.style.color = diff === 'initiate' ? '#00ffcc' : (diff === 'operative' ? '#ffaa00' : '#ff003c');
            rules.objective.textContent = `Crack ${winReq} high-frequency questions to stabilize the system.`;
            rules.list.innerHTML = `
                <li>Access the neural directory to identify corrupted logic files.</li>
                <li>Solve the mathematical paradoxes embedded in the log data.</li>
                <li><b>MODULO (%):</b> Use remainder of division (e.g. 23 % 5 = 3).</li>
                <li><b>LOGS:</b> Logarithms are Base 10 by default (e.g. log 100 = 2).</li>
                <li>Use standard result format to synchronize the neural question.</li>
                <li><b>Neural Req:</b> SOLVE ${winReq} QUESTIONS TO STABILIZE CORE.</li>
            `;
            rules.warning.textContent = "Neural desync will result in mission failure and link collapse.";
        }

        showScreen('rules-screen');
        
        if (!rulesGrid) {
            rulesGrid = new CyberGridAnimation('rules-grid-canvas');
        }
        rulesGrid.setColor(diff.toUpperCase());
        rulesGrid.start();
    }

    // Event Delegation for Rules Modal Buttons
    document.addEventListener('click', e => {
        const startBtn = e.target.closest('#rules-start-btn');
        const backBtn = e.target.closest('#rules-back-btn');

        if (startBtn) {
            if (!pendingMission) {
                console.warn("[MISSION] Attempted start with no pending mission state.");
                return;
            }
            
            const { gameType, diff } = pendingMission;
            console.log(`[MISSION] Initializing ${gameType} - ${diff}`);

            try {
                if (gameType === 'CRYPTOGRAPHY') {
                    startActualCryptoGame(diff);
                } else if (gameType === 'BUG BOUNTY') {
                    startActualBugBountyGame(diff);
                } else if (gameType === 'QUANTUM') {
                    startActualQuantumGame(diff);
                }
                
                // Clear state only on success
                pendingMission = null;
            } catch (err) {
                console.error("[MISSION] System error during initialization:", err);
                showToast("SYSTEM ERROR: Failed to synchronize mission stream.");
            }
        } 
        
        if (backBtn) {
            if (!pendingMission) return;
            const { gameType } = pendingMission;
            pendingMission = null;
            
            let screenId = 'games-screen';
            if (gameType === 'CRYPTOGRAPHY') screenId = 'crypto-level-selection-screen';
            else if (gameType === 'BUG BOUNTY') screenId = 'bug-bounty-level-selection-screen';
            else if (gameType === 'QUANTUM') screenId = 'quantum-level-selection-screen';
            
            showScreen(screenId);
        }
    });

    function startActualCryptoGame(diff) {
        cryptoState.gameOver = false;
        cryptoState.hintsUsed = 0;
        let pool = [];
        if (diff === 'initiate') {
            pool = initiateMissions;
            cryptoState.lives = 2;
            cryptoState.initialTime = 120;
            cryptoState.difficulty = 'INITIATE';
        } else if (diff === 'operative') {
            pool = operativeMissions;
            cryptoState.lives = 1;
            cryptoState.initialTime = 90;
            cryptoState.difficulty = 'OPERATIVE';
        } else {
            pool = omegaMissions;
            cryptoState.lives = 1;
            cryptoState.initialTime = 80;
            cryptoState.difficulty = 'OMEGA';
        }

        let shuffled = fisherYatesShuffle(pool);

        // Ensure 1st question never repeats the previous session's 1st question
        const lastFirstKey = `last_first_question_${diff}`;
        const lastFirstId = localStorage.getItem(lastFirstKey);
        if (lastFirstId && shuffled.length > 1 && shuffled[0].id === lastFirstId) {
            [shuffled[0], shuffled[1]] = [shuffled[1], shuffled[0]];
        }
        try { localStorage.setItem(lastFirstKey, shuffled[0].id); } catch(e){}

        cryptoState.missions = shuffled.slice(0, 2);
        
        // Rotate tools every time we start a new 25-mission block
        updateCryptoTools();
        
        cryptoState.missionIdx = 0;
        showScreen('crypto-game-screen');
        initCryptoMission();
        startCryptoTimer();
        createFloatingChars();
        
        cryptoStartSound.currentTime = 0;
        cryptoStartSound.play().catch(() => {});

        if (diff === 'operative' || diff === 'omega') {
            cryptoAdvancedBgm.currentTime = 0;
            cryptoAdvancedBgm.play().catch(() => {});
        }
    }

    cryptoEls.backToHubBtn.addEventListener('click', () => {
        // Clear timer and stop game to prevent "MISSION FAILED" from firing later
        if (cryptoState.timerId) clearInterval(cryptoState.timerId);
        if (cryptoState.endTimerId) clearTimeout(cryptoState.endTimerId);
        cryptoState.gameOver = false;
        cryptoStartSound.pause();
        cryptoAdvancedBgm.pause();
        // Hide modal if it was showing
        if (cryptoEls.modalOverlay) {
            cryptoEls.modalOverlay.classList.add('hidden');
            cryptoEls.modalOverlay.style.display = 'none';
            const modal = document.getElementById('crypto-modal');
            if (modal) modal.classList.remove('fail-theme');
        }
        showScreen('games-screen');
    });

    function updateHintButtonUI() {
        const btn = document.getElementById('use-hint-btn');
        if (!btn) return;
        const remaining = 3 - cryptoState.hintsUsed;
        if (remaining > 0) {
            btn.disabled = false;
            btn.textContent = `💡 USE HINT (${remaining} HINT${remaining > 1 ? 'S' : ''} REMAINING)`;
            btn.style.opacity = '1';
            btn.style.pointerEvents = 'auto';
        } else {
            btn.disabled = true;
            btn.textContent = `⛔ NO HINTS REMAINING`;
            btn.style.opacity = '0.5';
            btn.style.pointerEvents = 'none';
        }
    }

    function handleHintClick() {
        if (cryptoState.gameOver) return;
        const mission = getCurrentMission();
        if (!mission) return;

        if (cryptoState.hintsUsed >= 3) {
            showToast("No hints remaining for this mission!");
            return;
        }

        cryptoState.hintsUsed++;

        if (cryptoState.hintsUsed === 1) {
            // 1st try: -10 secs
            adjustTime(-10);
            showToast("Hint 1 Used (-10s Penalty)");
            updateLog(`> HINT 1/3 ACTIVATED (-10s PENALTY)`);
            updateLog(`> TACTICAL CLUE: ${mission.hint}`);
        } else if (cryptoState.hintsUsed === 2) {
            // 2nd try: -20 secs
            adjustTime(-20);
            showToast("Hint 2 Used (-20s Penalty)");
            updateLog(`> HINT 2/3 ACTIVATED (-20s PENALTY)`);

            let previewText = "";
            const shiftAmt = mission.shift || 1;
            if (mission.type === 'shift') {
                previewText = `Shift letters 1 step back in the alphabet (e.g. ${tools.shift(mission.cipher, shiftAmt)})`;
            } else if (mission.type === 'reverse') {
                previewText = `Reverse character string (e.g. ${tools.reverse(mission.cipher)})`;
            } else if (mission.type === 'number') {
                previewText = `Map numbers 1-26 to A-Z (e.g. ${tools.number(mission.cipher)})`;
            } else if (mission.type === 'noise') {
                previewText = `Strip non-alphanumeric noise symbols (e.g. ${tools.noise(mission.cipher)})`;
            } else if (mission.type === 'swap') {
                previewText = `Swap adjacent character pairs (e.g. ${tools.swap(mission.cipher)})`;
            } else {
                previewText = `Transformation technique: ${mission.type.toUpperCase()}`;
            }

            updateLog(`> TRANSFORMATION ANALYSIS: ${previewText}`);
        } else if (cryptoState.hintsUsed === 3) {
            // 3rd try: -40 secs
            adjustTime(-40);
            showToast("Hint 3 Used (-40s Penalty)");
            updateLog(`> HINT 3/3 ACTIVATED (-40s PENALTY)`);
            updateLog(`> MAXIMUM REVEAL: Reconstructing solution into decryption buffer...`);
            
            cryptoEls.decryptedInput.value = '';
            let i = 0;
            const solution = mission.solution;
            const typeTimer = setInterval(() => {
                if (i < solution.length) {
                    cryptoEls.decryptedInput.value += solution[i];
                    i++;
                    playTypeClick();
                } else {
                    clearInterval(typeTimer);
                    showToast("Answer loaded into buffer. Press EXECUTE DECRYPT.");
                }
            }, 50);
        }

        updateHintButtonUI();
    }

    function initCryptoMission() {
        const currentMission = cryptoState.missions[cryptoState.missionIdx];
        
        cryptoState.gameOver = false;
        cryptoState.hintsUsed = 0;
        updateHintButtonUI();
        
        cryptoEls.decryptedInput.placeholder = "ENTER DECRYPTED CODE...";
        cryptoEls.decryptedInput.classList.remove('manual-override');
        
        cryptoEls.levelStatus.textContent = `${cryptoState.difficulty} // MISSION ${cryptoState.missionIdx + 1}/${cryptoState.missions.length}`;
        cryptoEls.missionTitle.textContent = `MISSION: ${currentMission.name}`;
        cryptoEls.encryptedText.textContent = currentMission.cipher;
        cryptoEls.decryptedInput.value = '';
        cryptoEls.log.innerHTML = '';
        updateLog(`> INTERCEPTING MISSION: ${currentMission.id}...`);
        if (currentMission.id !== 'H7') setTimeout(() => updateLog(`> ANALYSIS: ${currentMission.hint}`), 1000);
    }

    function startCryptoTimer() {
        cryptoState.time = cryptoState.initialTime || 60;
        updateTimerDisplay();
        if (cryptoState.timerId) clearInterval(cryptoState.timerId);
        cryptoState.timerId = setInterval(() => {
            cryptoState.time -= 0.01;
            if (cryptoState.time <= 0) {
                cryptoState.time = 0;
                endCryptoGame(false);
            }
            updateTimerDisplay();
        }, 10);
    }

    function updateTimerDisplay() {
        cryptoEls.timer.textContent = cryptoState.time.toFixed(2) + 's';
        cryptoEls.timer.classList.toggle('critical', cryptoState.time < 20);
    }

    function updateLog(message) {
        const div = document.createElement('div');
        div.textContent = message;
        cryptoEls.log.appendChild(div);
        cryptoEls.log.scrollTop = cryptoEls.log.scrollHeight;
    }

    function shuffleCryptoTools() {}
    function updateCryptoTools() {}
    function chooseFunctionalTools() {}
    function handleToolClick() {}

    function adjustTime(delta) {
        cryptoState.time += delta;
        if (cryptoState.time < 0) cryptoState.time = 0;
        updateLog(`> SYSTEM STABILITY ${delta > 0 ? 'GAIN' : 'DRAIN'}: ${delta}s`);
        updateTimerDisplay();
    }

    const tools = {
        shift: (text, amount = 1) => {
            return text.replace(/[a-zA-Z0-9]/g, c => {
                if (c >= '0' && c <= '9') {
                    const d = parseInt(c, 10);
                    return String((d - amount + 10) % 10);
                }
                const base = c <= 'Z' ? 65 : 97;
                return String.fromCharCode(((c.charCodeAt(0) - base - amount + 26) % 26) + base);
            });
        },
        reverse: text => text.split('').reverse().join(''),
        number: text => {
            try {
                return text.trim().split(/\s+/).map(numStr => {
                    const n = parseInt(numStr, 10);
                    if (isNaN(n) || n < 1 || n > 26) return numStr;
                    return String.fromCharCode(64 + n);
                }).join('');
            } catch (e) { return text; }
        },
        noise: text => text.replace(/[^a-zA-Z0-9\s]/g, ''),
        swap: text => {
            const arr = text.split('');
            for (let i = 0; i < arr.length - 1; i += 2) {
                const temp = arr[i];
                arr[i] = arr[i + 1];
                arr[i + 1] = temp;
            }
            return arr.join('');
        }
    };

    function getCurrentMission() {
        return cryptoState.missions[cryptoState.missionIdx];
    }

    const useHintBtn = document.getElementById('use-hint-btn');
    if (useHintBtn) {
        useHintBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            handleHintClick();
        });
    }

    cryptoEls.submitBtn.addEventListener('click', () => {
        const mission = getCurrentMission();
        if (cryptoEls.decryptedInput.value.trim().toLowerCase() === mission.solution.toLowerCase()) handleMissionSuccess();
        else { 
            cryptoState.lives--;
            adjustTime(-10); 
            if (cryptoState.lives > 0) {
                showToast(`Invalid decryption key! Access Denied. ${cryptoState.lives} LIFE REMAINING.`); 
                updateLog(`> SECURITY ALERT: INCORRECT KEY. LIVES REMAINING: ${cryptoState.lives}`);
                if (cryptoState.lives === 1) flashLifeWarning();
            } else {
                endCryptoGame(false, true);
            }
        }
        cryptoEls.decryptedInput.value = '';
        updateLog("> REBOOTING DECRYPTION BUFFER...");
    });

    async function handleMissionSuccess() {
        cryptoState.missionIdx++;
        if (cryptoState.missionIdx >= cryptoState.missions.length) {
            clearInterval(cryptoState.timerId);
            cryptoState.gameOver = true;
            
            const prevLevel = cryptoUnlockedLevel;
            const _cUid = (currentUser && currentUser.uid) ? currentUser.uid : 'guest';
            // Handle Level Unlocking Progression
            if (cryptoState.difficulty === 'INITIATE' && cryptoUnlockedLevel === 1) {
                cryptoUnlockedLevel = 2;
                localStorage.setItem(_cUid + '_crypto_unlocked_level_v3', cryptoUnlockedLevel);
                pendingUnlock = { game: 'crypto', level: 2 };
            } else if (cryptoState.difficulty === 'OPERATIVE' && cryptoUnlockedLevel === 2) {
                cryptoUnlockedLevel = 3;
                localStorage.setItem(_cUid + '_crypto_unlocked_level_v3', 3);
                pendingUnlock = { game: 'crypto', level: 3 };
            }

            const stats = {
                title: "CONGRATULATIONS!",
                subtitle: `${cryptoState.difficulty} PHASE STABILIZED`,
                mainStat: { label: "TIME REMAINING", value: cryptoEls.timer.textContent },
                secondaryStat: { label: "EFFICIENCY", value: "98.4%" },
                onContinue: () => {
                   showScreen('crypto-level-selection-screen');
                   updateCryptoLevelSelection();
                }
            };
            
            cryptoStartSound.pause();
            cryptoAdvancedBgm.pause();
            
            if (cryptoState.difficulty === 'OMEGA') {
                cryptoEls.continueBtn.style.display = 'none';
                showModal("OMEGA DECRYPTION COMPLETE", "All nodes secured. Initializing Arc Reactor Stabilization...");
                setTimeout(() => {
                    cryptoEls.modalOverlay.style.display = 'none';
                    cryptoEls.continueBtn.style.display = '';
                    startVictoryCutscene();
                }, 3500);
            } else {
                triggerVictoryOverlay(stats);
                
                if (cryptoState.difficulty === 'INITIATE') {
                    cryptoInitiateWinSound.currentTime = 0;
                    cryptoInitiateWinSound.play().catch(e => console.error("Win sound fail:", e));
                } else if (cryptoState.difficulty === 'OPERATIVE') {
                    cryptoOperativeWinSound.currentTime = 0;
                    cryptoOperativeWinSound.play().catch(e => console.error("Win sound fail:", e));
                }
            }
        } else {
            // Automatically transition to next mission
            shuffleCryptoTools();
            initCryptoMission();
        }
    }

    function showModal(title, msg) {
        cryptoEls.modalTitle.textContent = title;
        cryptoEls.modalMessage.textContent = msg;
        cryptoEls.modalOverlay.classList.remove('hidden');
        cryptoEls.modalOverlay.style.display = 'flex';
    }

    cryptoEls.continueBtn.addEventListener('click', () => {
        if (cryptoState.gameOver) {
            // Game is fully over — navigate back to hub
            if (cryptoState.endTimerId) clearTimeout(cryptoState.endTimerId);
            cryptoEls.modalOverlay.classList.add('hidden');
            cryptoEls.modalOverlay.style.display = 'none';
            cryptoEls.continueBtn.textContent = 'CONTINUE';
            cryptoState.gameOver = false;
            cryptoState.missionIdx = 0;
            updateCryptoLevelSelection();
            showScreen('crypto-level-selection-screen');
        } else {
            // Mid-game — move to next mission
            cryptoEls.modalOverlay.classList.add('hidden');
            cryptoEls.modalOverlay.style.display = 'none';
            shuffleCryptoTools(); // Randomize buttons for the new mission
            initCryptoMission();
            startCryptoTimer();
        }
    });

    cryptoEls.resetBtn.addEventListener('click', () => {
        cryptoEls.decryptedInput.value = '';
        updateLog("> REBOOTING DECRYPTION BUFFER...");
    });

    function endCryptoGame(victory, lifeFailure = false) {
        if (cryptoState.timerId) clearInterval(cryptoState.timerId);
        cryptoStartSound.pause();
        cryptoAdvancedBgm.pause();
        // Guard: only show failure modal if player is still on the crypto game screen
        if (!victory && currentScreenId !== 'crypto-game-screen') {
            cryptoState.gameOver = false;
            return;
        }
        if (!victory) {
            cryptoState.gameOver = true;
            cryptoEls.continueBtn.textContent = 'RETURN TO HUB';

            if (cryptoState.difficulty === 'OPERATIVE') {
                operativeFailSound.currentTime = 0;
                operativeFailSound.play().catch(e => console.error("Sound play failed", e));
                showModal("⚠ YOU ARE UNABLE TO DECRYPT THE CODE ⚠", "You failed to save the Arc Reactor.");
            } else {
                failSound.currentTime = 0;
                failSound.play().catch(e => console.error("Sound play failed", e));
                showModal("💀 YOU ARE UNABLE TO DECRYPT THE CODE 💀", "You failed to save the Arc Reactor.");
            }
            
            const modal = document.getElementById('crypto-modal');
            modal.classList.add('fail-theme');
            cryptoState.endTimerId = setTimeout(() => {
                modal.classList.remove('fail-theme');
                cryptoEls.modalOverlay.classList.add('hidden');
                cryptoEls.modalOverlay.style.display = 'none';
                cryptoEls.continueBtn.textContent = 'CONTINUE';
                cryptoState.gameOver = false;
                cryptoState.missionIdx = 0;
                cryptoState.time = cryptoState.initialTime;
                updateCryptoLevelSelection();
                showScreen('crypto-level-selection-screen');
            }, 5000);
        }
    }

    function createFloatingChars() {
        const p = "01ABCDEF!@#$%^&*()_+{}[]|;:,.<>?/";
        const l = document.querySelector('#crypto-game-screen .crypto-layer.layer-3');
        setInterval(() => {
            const c = document.createElement('div');
            c.className = 'crypto-char';
            c.textContent = p[Math.floor(Math.random() * p.length)];
            c.style.left = Math.random() * 100 + 'vw';
            c.style.animationDuration = (Math.random() * 5 + 5) + 's';
            l.appendChild(c);
            setTimeout(() => c.remove(), 10000);
        }, 100);
    }

    function createFloatingCharsSelection(selector) {
        const p = "01ABCDEF!@#$%^&*()_+{}[]|;:,.<>?/";
        const l = document.querySelector(selector);
        if (!l) return;
        setInterval(() => {
            const c = document.createElement('div');
            c.className = 'crypto-char';
            c.textContent = p[Math.floor(Math.random() * p.length)];
            c.style.left = Math.random() * 100 + 'vw';
            c.style.animationDuration = (Math.random() * 5 + 5) + 's';
            l.appendChild(c);
            setTimeout(() => c.remove(), 10000);
        }, 200);
    }
     /* --- QUANTUM CALCULATIONS MISSION: NEURAL BREACH --- */
    let quantumState = {
        difficulty: 'initiate',
        levelIndex: 0,
        intelRecovered: 0,
        totalIntel: 2,
        lives: 2,
        maxLives: 2,
        lastFileOpenTime: 0,
        feedbackTimeout: null
    };

    const quantumEls = {
        levelScreen: document.getElementById('quantum-level-selection-screen'),
        gameScreen: document.getElementById('quantum-game-screen'),
        timer: document.getElementById('q-timer'),
        diffLabel: document.getElementById('q-diff-label'),
        questionDisplay: document.getElementById('q-question-display'),
        userInput: document.getElementById('q-user-input'),
        submitBtn: document.getElementById('q-submit-btn'),
        hintBtn: document.getElementById('q-hint-btn'),
        progress: document.getElementById('q-progress'),
        lives: document.getElementById('q-lives'),
        stability: document.getElementById('q-stability'),
        stabilityBar: document.getElementById('q-stability-bar-fill'),
        missionId: document.getElementById('q-mission-id'),
        feedback: document.getElementById('q-feedback'),
        feedbackTitle: document.getElementById('q-feedback-title'),
        feedbackMsg: document.getElementById('q-feedback-msg'),
        canvas: document.getElementById('quantum-grid-canvas'),
        exitBtn: document.getElementById('q-exit-btn')
    };

    const quantumMissions = {
        initiate: {
            title: "SIGNAL_SCAN: INITIATE_V1",
            desc: "Spidey-Sense detecting logical noise. Neutralize the interference.",
            time: 90,
            intel: 2,
            files: [
                { id: 'q1', name: 'packet_ineq_01.log', content: '2x + 3 < 11\n(Largest integer x)', flag: 'FLAG{3}' },
                { id: 'q2', name: 'packet_log_02.log', content: 'log2(8)\nCrack the value.', flag: 'FLAG{3}' },
                { id: 'q3', name: 'packet_mod_03.log', content: '23 % 5\nIdentify the remainder.', flag: 'FLAG{3}' },
                { id: 'q4', name: 'packet_trig_04.log', content: 'sin(90°)\nCalculate phase.', flag: 'FLAG{1}' },
                { id: 'q5', name: 'packet_ineq_05.log', content: '3x - 1 > 5\n(Smallest integer x)', flag: 'FLAG{3}' },
                { id: 'q6', name: 'packet_log_06.log', content: 'log10(100)\nMeasure voltage.', flag: 'FLAG{2}' },
                { id: 'q7', name: 'packet_mod_07.log', content: '17 % 4\nCalculate offset.', flag: 'FLAG{1}' },
                { id: 'q8', name: 'packet_trig_08.log', content: 'cos(0°)\nConfirm alignment.', flag: 'FLAG{1}' },
                { id: 'q9', name: 'packet_abs_09.log', content: '| -15 |\nDetermine magnitude.', flag: 'FLAG{15}' },
                { id: 'q10', name: 'packet_arith_10.log', content: '2 * (x + 1) = 10\nSolve for x.', flag: 'FLAG{4}' },
                { id: 'q11', name: 'packet_log_11.log', content: 'log5(25)\nDecode depth.', flag: 'FLAG{2}' },
                { id: 'q12', name: 'packet_mod_12.log', content: '30 % 9\nCheck parity.', flag: 'FLAG{3}' },
                { id: 'q13', name: 'packet_trig_13.log', content: 'tan(45°)\nFind the slope.', flag: 'FLAG{1}' },
                { id: 'q14', name: 'packet_ineq_14.log', content: 'x/2 + 5 < 10\n(Largest integer x)', flag: 'FLAG{9}' },
                { id: 'q15', name: 'packet_log_15.log', content: 'log3(27)\nExtract core.', flag: 'FLAG{3}' },
                { id: 'q16', name: 'packet_mod_16.log', content: '100 % 11\nIdentify residue.', flag: 'FLAG{1}' },
                { id: 'q17', name: 'packet_trig_17.log', content: 'sin(30°) * 2\nAmplify signal.', flag: 'FLAG{1}' },
                { id: 'q18', name: 'packet_abs_18.log', content: '| 5 - 12 |\nMeasure distance.', flag: 'FLAG{7}' },
                { id: 'q19', name: 'packet_ineq_19.log', content: '4x > 12\n(Smallest integer x)', flag: 'FLAG{4}' },
                { id: 'q20', name: 'packet_log_20.log', content: 'log2(32)\nBinary level.', flag: 'FLAG{5}' },
                { id: 'q21', name: 'packet_mod_21.log', content: '50 % 7\nCalculate node.', flag: 'FLAG{1}' },
                { id: 'q22', name: 'packet_trig_22.log', content: 'cos(60°) * 2\nPhase shift.', flag: 'FLAG{1}' },
                { id: 'q23', name: 'packet_abs_23.log', content: '| -100 | / 4\nSector capacity.', flag: 'FLAG{25}' },
                { id: 'q24', name: 'packet_arith_24.log', content: 'x - 10 = -5\nSolve for x.', flag: 'FLAG{5}' },
                { id: 'q25', name: 'packet_log_25.log', content: 'log4(16)\nFinal sync.', flag: 'FLAG{2}' }
            ]
        },
        operative: {
            title: "TACTICAL_SYNC: OPERATIVE_V2",
            desc: "Intercepting encrypted nodal packets. Solve to crack the firewall.",
            time: 60,
            intel: 2,
            files: [
                { id: 'q1', name: 'root_sync_01.dat', content: 'x² - 5x + 6 = 0\n(Smallest root)', flag: 'FLAG{2}' },
                { id: 'q2', name: 'log_link_02.dat', content: 'log2(x) + log2(x-2) = 3\nSolve for x.', flag: 'FLAG{4}' },
                { id: 'q3', name: 'mod_parity_03.dat', content: '121 % 11 + 10 % 3\nIdentify sum.', flag: 'FLAG{1}' },
                { id: 'q4', name: 'trig_wave_04.dat', content: 'sin²(45°) + cos²(45°)\nEnergy constant.', flag: 'FLAG{1}' },
                { id: 'q5', name: 'abs_limit_05.dat', content: '|2x - 5| = 11\n(Max positive root)', flag: 'FLAG{8}' },
                { id: 'q6', name: 'log_depth_06.dat', content: 'log3(√(27))\nRecursive sync.', flag: 'FLAG{1.5}' },
                { id: 'q7', name: 'trig_tan_07.dat', content: 'tan²(60°) - 1\nSlope variance.', flag: 'FLAG{2}' },
                { id: 'q8', name: 'log_base_08.dat', content: 'logX(64) = 3\nSolve for X.', flag: 'FLAG{4}' },
                { id: 'q9', name: 'exp_link_09.dat', content: '2^(x+1) = 32\nPulse rate.', flag: 'FLAG{4}' },
                { id: 'q10', name: 'abs_node_10.dat', content: '|x² - 4| = 0\n(Positive root)', flag: 'FLAG{2}' },
                { id: 'q11', name: 'trig_pi_11.dat', content: 'sin(180°)\nNeutral point.', flag: 'FLAG{0}' },
                { id: 'q12', name: 'mod_big_12.dat', content: '100 % 9\nResidue scan.', flag: 'FLAG{1}' },
                { id: 'q13', name: 'log_nested_13.dat', content: 'log2(log2(16))\nNested depth.', flag: 'FLAG{2}' },
                { id: 'q14', name: 'ineq_comp_14.dat', content: '3x + 4 > 2x + 10\n(Min integer X)', flag: 'FLAG{7}' },
                { id: 'q15', name: 'abs_log_15.dat', content: '| -log10(1000) | \nVoltage drop.', flag: 'FLAG{3}' },
                { id: 'q16', name: 'trig_inv_16.dat', content: 'cos(180°)\nPhase reverse.', flag: 'FLAG{-1}' },
                { id: 'q17', name: 'mod_comp_17.dat', content: '49 % 8\nBit parity.', flag: 'FLAG{1}' },
                { id: 'q18', name: 'log_mult_18.dat', content: 'log5(125) * log2(4)\nGain factor.', flag: 'FLAG{6}' },
                { id: 'q19', name: 'trig_sum_19.dat', content: 'sin(90°) + cos(0°)\nAmplitude total.', flag: 'FLAG{2}' },
                { id: 'q20', name: 'abs_var_20.dat', content: '| -x | = 10\n(Positive root)', flag: 'FLAG{10}' },
                { id: 'q21', name: 'log_ratio_21.dat', content: 'log3(81) / log2(16)\nSector ratio.', flag: 'FLAG{1}' },
                { id: 'q22', name: 'ineq_pos_22.dat', content: '6x - 12 > 0\n(Smallest integer X)', flag: 'FLAG{3}' },
                { id: 'q23', name: 'mod_abs_23.dat', content: '| -5 % 3 |\nMagnitude offset.', flag: 'FLAG{2}' },
                { id: 'q24', name: 'trig_quad_24.dat', content: 'sin(270°)\nQuadrant sync.', flag: 'FLAG{-1}' },
                { id: 'q25', name: 'log_final_25.dat', content: 'logX(100) = 2\nFinal X core.', flag: 'FLAG{10}' }
            ]
        },
        omega: {
            title: "🕷 NEURAL_BREACH: OMEGA_V3 🕷",
            desc: "Extreme quantum complexity. Mathematical singularities detected.",
            time: 45,
            intel: 2,
            files: [
                { id: 'q1', name: 'lim_01.sec', content: '2^x = 1024\nSolve for X.', flag: 'FLAG{10}' },
                { id: 'q2', name: 'log_elex_02.sec', content: 'log5(√(625))\nEuler variance.', flag: 'FLAG{2}' },
                { id: 'q3', name: 'trig_omega_03.sec', content: 'sin(450°)\nCircular shift.', flag: 'FLAG{1}' },
                { id: 'q4', name: 'abs_ineq_04.sec', content: '|x - 2| < 5\n(Max integer X)', flag: 'FLAG{6}' },
                { id: 'q5', name: 'mod_omega_05.sec', content: '13² % 10\nFlux residue.', flag: 'FLAG{9}' },
                { id: 'q6', name: 'log_hyper_06.sec', content: 'log3(1/81)\nNegative energy.', flag: 'FLAG{-4}' },
                { id: 'q7', name: 'trig_comp_07.sec', content: 'cos(360°) + sin(90°)\nComposite wave.', flag: 'FLAG{2}' },
                { id: 'q8', name: 'abs_quad_08.sec', content: '|x² - 9| = 0\n(Smaller root)', flag: 'FLAG{-3}' },
                { id: 'q9', name: 'log_series_09.sec', content: 'log2(2) + log2(4) + log2(8)\nSeries total.', flag: 'FLAG{6}' },
                { id: 'q10', name: 'trig_tan_10.sec', content: 'tan(225°)\nTangent sync.', flag: 'FLAG{1}' },
                { id: 'q11', name: 'mod_cube_11.sec', content: '5³ % 4\nCube parity.', flag: 'FLAG{1}' },
                { id: 'q12', name: 'log_trig_12.sec', content: 'log10(tan(45°))\nHybrid core.', flag: 'FLAG{0}' },
                { id: 'q13', name: 'ineq_omega_13.sec', content: '2x/3 + 4 < 10\n(Max integer X)', flag: 'FLAG{8}' },
                { id: 'q14', name: 'abs_trig_14.sec', content: '|sin(270°)|\nVertical mag.', flag: 'FLAG{1}' },
                { id: 'q15', name: 'log_div_15.sec', content: 'log2(1024) / log2(4)\nBinary scale.', flag: 'FLAG{5}' },
                { id: 'q16', name: 'mod_prime_16.sec', content: '1000 % 13\nSecurity residue.', flag: 'FLAG{12}' },
                { id: 'q17', name: 'trig_sin_17.sec', content: 'sin(30°) + sin(150°)\nPhase interference.', flag: 'FLAG{1}' },
                { id: 'q18', name: 'abs_log_18.sec', content: '|log5(0.04)|\nAbsolute depth.', flag: 'FLAG{2}' },
                { id: 'q19', name: 'ineq_quad_19.sec', content: 'x² - 100 < 0\n(Max integer X)', flag: 'FLAG{9}' },
                { id: 'q20', name: 'mod_root_20.sec', content: '√(144) % 5\nRoot residue.', flag: 'FLAG{2}' },
                { id: 'q21', name: 'trig_phase_21.sec', content: 'cos(540°)\nAdvanced phase.', flag: 'FLAG{-1}' },
                { id: 'q22', name: 'log_final_22.sec', content: 'logx(32) = 5\nRoot of X.', flag: 'FLAG{2}' },
                { id: 'q23', name: 'abs_final_23.sec', content: 'CORE_ABSOLUTE: | -100 | / 4 \nSecure bridge.', flag: 'FLAG{25}' },
                { id: 'q24', name: 'mod_final_24.sec', content: '555 % 5\nEnter parity.', flag: 'FLAG{0}' },
                { id: 'q25', name: 'omega_core_25.sec', content: 'sin²(x) + cos²(x)\nCore identity.', flag: 'FLAG{1}' }
            ]
        }
    };



    // --- High-Tech Cyber Grid Animation (New Stark-Tech Aesthetic) ---
    class CyberGridAnimation {
        constructor(canvasId) {
            this.canvas = document.getElementById(canvasId);
            if (!this.canvas) return;
            this.ctx = this.canvas.getContext('2d');
            this.points = [];
            this.particles = [];
            this.gridSize = 40;
            this.active = false;
            this.hue = 180; // Defaults to Cyan
            
            window.addEventListener('resize', () => this.resize());
            this.resize();
        }

        setColor(color) {
            if (color === 'INITIATE') this.hue = 180;    // Cyan
            else if (color === 'OPERATIVE') this.hue = 30; // Orange
            else if (color === 'OMEGA') this.hue = 350;     // Red
        }

        resize() {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
            this.initGrid();
        }

        initGrid() {
            this.points = [];
            for (let x = 0; x < this.canvas.width + this.gridSize; x += this.gridSize) {
                for (let y = 0; y < this.canvas.height + this.gridSize; y += this.gridSize) {
                    this.points.push({
                        x, y,
                        originalX: x,
                        originalY: y,
                        offset: Math.random() * Math.PI * 2
                    });
                }
            }
        }

        draw(time) {
            if (!this.active) return;
            
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            
            // Draw faint grid background
            this.ctx.beginPath();
            this.ctx.strokeStyle = `hsla(${this.hue}, 100%, 50%, 0.05)`;
            this.ctx.lineWidth = 0.5;

            for (let x = 0; x < this.canvas.width; x += this.gridSize) {
                this.ctx.moveTo(x, 0);
                this.ctx.lineTo(x, this.canvas.height);
            }
            for (let y = 0; y < this.canvas.height; y += this.gridSize) {
                this.ctx.moveTo(0, y);
                this.ctx.lineTo(this.canvas.width, y);
            }
            this.ctx.stroke();

            // Draw animated nodes
            this.points.forEach(p => {
                const noise = Math.sin(time * 0.001 + p.offset) * 3;
                p.x = p.originalX + noise;
                p.y = p.originalY + noise;

                const dist = Math.hypot(p.x - this.canvas.width/2, p.y - this.canvas.height/2);
                const pulse = Math.sin(time * 0.002 - dist * 0.005) * 0.5 + 0.5;
                
                if (pulse > 0.8) {
                    this.ctx.fillStyle = `hsla(${this.hue}, 100%, 70%, ${pulse * 0.2})`;
                    this.ctx.beginPath();
                    this.ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
                    this.ctx.fill();
                }
            });

            // Handle data flow particles
            if (this.particles.length < 40 && Math.random() > 0.9) {
                this.particles.push({
                    x: Math.random() * this.canvas.width,
                    y: Math.random() * this.canvas.height,
                    vx: (Math.random() - 0.5) * 2,
                    vy: (Math.random() - 0.5) * 2,
                    life: 1,
                    len: Math.random() * 50 + 20
                });
            }

            this.particles = this.particles.filter(p => {
                p.x += p.vx * 3;
                p.y += p.vy * 3;
                p.life -= 0.005;

                this.ctx.beginPath();
                const grad = this.ctx.createLinearGradient(p.x, p.y, p.x - p.vx * p.len, p.y - p.vy * p.len);
                grad.addColorStop(0, `hsla(${this.hue}, 100%, 60%, ${p.life})`);
                grad.addColorStop(1, `hsla(${this.hue}, 100%, 60%, 0)`);
                this.ctx.strokeStyle = grad;
                this.ctx.lineWidth = 2;
                this.ctx.moveTo(p.x, p.y);
                this.ctx.lineTo(p.x - p.vx * p.len, p.y - p.vy * p.len);
                this.ctx.stroke();

                return p.life > 0;
            });

            // Occasional full-screen scanline
            const scanY = (time * 0.2) % (this.canvas.height * 2);
            if (scanY < this.canvas.height) {
                this.ctx.fillStyle = `hsla(${this.hue}, 100%, 50%, 0.03)`;
                this.ctx.fillRect(0, scanY, this.canvas.width, 2);
            }

            requestAnimationFrame((t) => this.draw(t));
        }

        start() {
            this.active = true;
            this.draw(0);
        }

        stop() {
            this.active = false;
        }
    }

    class DigitalRain {
        constructor(canvasId) {
            this.canvas = document.getElementById(canvasId);
            if (!this.canvas) return;
            this.ctx = this.canvas.getContext('2d');
            this.columns = 0;
            this.drops = [];
            this.fontSize = 16;
            this.characters = '01ABCDEFGHIJKLMNOPQRSTUVWXYZ@#$%^&*'.split('');
            this.active = false;
            this.color = '#00f2ff';
            this.rgbColor = '0, 242, 255';
            
            window.addEventListener('resize', () => this.resize());
            this.resize();
        }

        setColor(difficulty) {
            const themes = {
                'INITIATE': { hex: '#00f2ff', rgb: '0, 242, 255' },
                'OPERATIVE': { hex: '#ffaa00', rgb: '255, 170, 0' },
                'OMEGA': { hex: '#ff003c', rgb: '255, 0, 60' }
            };
            const theme = themes[difficulty] || themes['INITIATE'];
            this.color = theme.hex;
            this.rgbColor = theme.rgb;
        }

        resize() {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
            this.columns = Math.floor(this.canvas.width / this.fontSize);
            this.drops = [];
            for (let i = 0; i < this.columns; i++) {
                this.drops[i] = Math.random() * -100;
            }
        }

        draw() {
            if (!this.active) return;
            
            this.ctx.fillStyle = 'rgba(0, 5, 10, 0.15)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            
            this.ctx.fillStyle = this.color;
            this.ctx.font = `${this.fontSize}px 'Share Tech Mono'`;
            
            for (let i = 0; i < this.drops.length; i++) {
                const text = this.characters[Math.floor(Math.random() * this.characters.length)];
                const x = i * this.fontSize;
                const y = this.drops[i] * this.fontSize;
                
                // Add varied opacity for a more high-tech look
                const opacity = Math.random() * 0.5 + 0.5;
                this.ctx.fillStyle = `rgba(${this.rgbColor}, ${opacity})`;
                
                this.ctx.fillText(text, x, y);
                
                if (y > this.canvas.height && Math.random() > 0.975) {
                    this.drops[i] = 0;
                }
                this.drops[i]++;
            }
            
            requestAnimationFrame(() => this.draw());
        }

        start() {
            this.active = true;
            this.draw();
        }

        stop() {
            this.active = false;
        }
    }

    let quantumGrid = null;

    function startQuantumGame() {
        console.log("[SYSTEM] Initializing Quantum Hub...");
        updateQuantumLevelSelection();
        showScreen('quantum-level-selection-screen');
        if (!quantumGrid) {
            quantumGrid = new DigitalRain('quantum-grid-canvas');
        }
        quantumGrid.start();
    }

    document.querySelectorAll('.quantum-start-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const currentBtn = e.currentTarget;
            const diff = currentBtn.getAttribute('data-diff');
            const levelVal = diff === 'initiate' ? 1 : (diff === 'operative' ? 2 : 3);
            
            if (levelVal > quantumUnlockedLevel) {
                showToast("SECURITY PROTOCOL: Complete previous mission to unlock.");
                return;
            }
            
            showRules('QUANTUM', diff);
        });
    });

    function startActualQuantumGame(diff) {
        if (quantumGrid) quantumGrid.stop();
        quantumState.difficulty = diff.toLowerCase();
        quantumState.intelRecovered = 0;
        
        // Calibrate Lives & Time
        const config = quantumMissions[quantumState.difficulty];
        quantumState.lives = (quantumState.difficulty === 'initiate') ? 2 : 1;
        quantumState.maxLives = quantumState.lives;
        quantumState.timer = config.time;
        quantumState.active = true;
        quantumState.stability = 100;
        
        // Shuffle missions for replayability
        shuffleMissions(config.files);
        config.files.forEach(f => f.recovered = false);

        // Apply Theme to Screen
        quantumEls.gameScreen.className = `screen quantum-${quantumState.difficulty}`;
        
        showScreen('quantum-game-screen');
        
        // Initialize UI
        quantumEls.diffLabel.textContent = quantumState.difficulty.toUpperCase();
        quantumEls.lives.textContent = quantumState.lives;
        quantumEls.progress.textContent = `0 / ${quantumState.totalIntel}`;
        quantumEls.stability.textContent = '100';
        updateQuantumStability();
        
        // Text-to-speech audio explanation removed per user request
        // if (typeof speakText === 'function') speakText(`${config.title} engaged. Recalibrate neural frequencies.`);
        
        // Start Matrix Background
        if (!quantumGrid) {
            quantumGrid = new DigitalRain('quantum-grid-canvas-game');
        }
        quantumGrid.start();
        
        startQuantumTimer();
        
        // Open first calculation
        initQuantumCalculation(config.files[0]);

        cryptoStartSound.currentTime = 0;
        cryptoStartSound.play().catch(() => {});

        if (diff.toLowerCase() === 'operative' || diff.toLowerCase() === 'omega') {
            cryptoAdvancedBgm.currentTime = 0;
            cryptoAdvancedBgm.play().catch(() => {});
        }
    }

    function initQuantumCalculation(file) {
        if (!quantumState.active) return;
        quantumState.currentFile = file;
        
        quantumEls.missionId.textContent = file.id;
        quantumEls.questionDisplay.innerHTML = 
`<div class="terminal-line" style="color: #00d4ff; font-size: 0.8rem; margin-bottom: 15px;">// INITIATING_DEEP_SCAN: ${file.name}</div>
<div class="terminal-line" style="font-size: 1.4rem; color: #fff; border-left: 3px solid #00d4ff; padding-left: 20px; line-height: 1.8; margin-top: 5px;">
${file.content.replace(/\\n/g, '<br>')}
</div>`;
        
        quantumEls.userInput.value = '';
        quantumEls.userInput.focus();
        quantumState.lastFileOpenTime = Date.now();
    }

    function handleQuantumSubmit() {
        if (!quantumState.active || !quantumState.currentFile) return;
        
        const userInput = quantumEls.userInput.value.trim().toUpperCase();
        const correctFlag = quantumState.currentFile.flag.replace('FLAG{', '').replace('}', '').trim().toUpperCase();

        if (userInput === correctFlag) {
            quantumState.intelRecovered++;
            quantumState.stability = Math.min(100, quantumState.stability + 10);
            updateQuantumStability();
            
            triggerQuantumPulse('success');
            playWebShootSound();
            
            updateQuantumProgress();
            
            const winReq = 2; // Required 2 questions for all levels
            if (quantumState.intelRecovered >= winReq) {
                handleQuantumMissionComplete(true);
            } else {
                triggerQuantumFeedback("SYNC_SUCCESS", "Neural fragment captured. Moving to next sector.", "success", 2000, () => {
                    const nextFile = quantumMissions[quantumState.difficulty].files[quantumState.intelRecovered];
                    if (nextFile) initQuantumCalculation(nextFile);
                });
            }
        } else {
            triggerQuantumPulse('failure');
            playErrorSound();

            quantumState.lives--;
            quantumState.timer = Math.max(0, quantumState.timer - 15);
            quantumEls.lives.textContent = quantumState.lives;
            quantumEls.timer.textContent = Math.ceil(quantumState.timer);

            let title = "CALCULATION_FAILED";
            let msg = "Neural coherence compromised. Stability dropping.";

            if (quantumState.lives === 1) {
                title = "1 LIFE REMAINING";
                msg = "WARNING: NEURAL COHERENCE COMPROMISED";
                const alertSound = new Audio('assets/audio/dun-dun-dun-sound-effect-brass_8nFBccR.mp3');
                alertSound.play().catch(e => console.error(e));
            }

            triggerQuantumFeedback(title, msg, "error", 2500, () => {
                if (quantumState.lives <= 0) {
                    handleQuantumMissionComplete(false);
                } else {
                    quantumEls.userInput.value = '';
                    quantumEls.userInput.focus();
                }
            });
        }
    }

    function handleQuantumHint() {
        if (!quantumState.active || !quantumState.currentFile) return;
        
        // Time Penalty: 15 seconds
        quantumState.timer = Math.max(0, quantumState.timer - 15);
        quantumEls.timer.textContent = Math.ceil(quantumState.timer);
        
        const realFlag = quantumState.currentFile.flag.replace('FLAG{', '').replace('}', '').trim();
        
        let hintMsg;
        if (realFlag.length === 1) {
            hintMsg = `The solution is a single-digit value. Confirm your calculation and re-submit.`;
        } else {
            hintMsg = `The solution starts with "${realFlag[0]}" and consists of ${realFlag.length} characters in total.`;
        }
        
        triggerQuantumFeedback("HINT_REQUESTED", `SYSTEM_HINT: ${hintMsg} (Time penalized -15.00s)`, "hint", 4000);
    }

    function updateQuantumProgress() {
        const ratio = quantumState.intelRecovered / quantumState.totalIntel;
        quantumEls.progress.textContent = `${quantumState.intelRecovered} / ${quantumState.totalIntel}`;
    }

    function updateQuantumStability() {
        if (!quantumEls.stabilityBar) return;
        const s = Math.floor(quantumState.stability);
        quantumEls.stability.textContent = s;
        quantumEls.stabilityBar.style.width = `${s}%`;
        
        if (s < 30) {
            quantumEls.stabilityBar.style.background = '#ff003c';
        } else {
            const colors = { initiate: '#00f0ff', operative: '#ffaa00', omega: '#ff003c' };
            quantumEls.stabilityBar.style.background = colors[quantumState.difficulty];
        }
    }

    function startQuantumTimer() {
        if (quantumState.timerId) clearInterval(quantumState.timerId);
        quantumState.timerId = setInterval(() => {
            if (!quantumState.active) return;
            
            quantumState.timer -= 0.1;
            
            // Stability Decay
            const decayRate = (quantumState.difficulty === 'omega') ? 0.3 : (quantumState.difficulty === 'operative' ? 0.2 : 0.1);
            quantumState.stability -= (decayRate / 10);
            updateQuantumStability();

            if (quantumState.timer <= 0 || quantumState.stability <= 0) {
                quantumState.timer = 0;
                handleQuantumMissionComplete(false);
            }
            
            quantumEls.timer.textContent = Math.ceil(quantumState.timer);
        }, 100);
    }

    function triggerQuantumFeedback(title, msg, type, duration = 0, onComplete = null) {
        if (quantumState.feedbackTimeout) {
            clearTimeout(quantumState.feedbackTimeout);
            quantumState.feedbackTimeout = null;
        }

        quantumEls.feedbackTitle.textContent = title;
        quantumEls.feedbackMsg.textContent = msg;
        quantumEls.feedback.className = `q-feedback-overlay show q-feedback-${type}`;

        if (duration > 0) {
            quantumState.feedbackTimeout = setTimeout(() => {
                quantumEls.feedback.classList.remove('show');
                quantumState.feedbackTimeout = null;
                
                // UX: Refocus input for the main game flow
                if (quantumState.active) {
                    quantumEls.userInput.focus();
                }

                if (onComplete) onComplete();
            }, duration);
        }
    }

    function triggerQuantumPulse(type) {
        const effect = document.createElement('div');
        effect.className = type === 'success' ? 'success-pulse' : 'failure-static';
        quantumEls.gameScreen.appendChild(effect);
        setTimeout(() => effect.remove(), 500);
    }

    async function handleQuantumMissionComplete(victory) {
        clearInterval(quantumState.timerId);
        if (quantumState.feedbackTimeout) {
            clearTimeout(quantumState.feedbackTimeout);
            quantumState.feedbackTimeout = null;
        }
        quantumState.active = false;
        cryptoStartSound.pause();
        cryptoAdvancedBgm.pause();

        if (victory) {
            // Progression
            const _qUid = (currentUser && currentUser.uid) ? currentUser.uid : 'guest';
            if (quantumState.difficulty === 'initiate' && quantumUnlockedLevel === 1) {
                quantumUnlockedLevel = 2;
                localStorage.setItem(_qUid + '_quantum_unlocked_level_v6', 2);
                pendingUnlock = { game: 'quantum', level: 2 };
            } else if (quantumState.difficulty === 'operative' && quantumUnlockedLevel === 2) {
                quantumUnlockedLevel = 3;
                localStorage.setItem(_qUid + '_quantum_unlocked_level_v6', 3);
                pendingUnlock = { game: 'quantum', level: 3 };
            }
            
            // Save Score
            await scoreService.saveScore('Quantum Calculations', `Phase: ${quantumState.difficulty.toUpperCase()}`, {
                intel: quantumState.intelRecovered,
                time: quantumState.timer
            });

            if (quantumState.difficulty === 'omega') {
                const continueBtn = document.querySelector('#quantum-game-screen .q-continue-btn');
                triggerQuantumFeedback("OMEGA NEURAL SYNC COMPLETE", "All connections stable. Initializing Core...", "success");
                setTimeout(() => {
                    quantumEls.feedback.classList.remove('show');
                    startVictoryCutscene();
                }, 3500);
            } else {
                const stats = {
                    title: "QUANTUM STABILIZED",
                    subtitle: `${quantumState.difficulty.toUpperCase()} NEURAL SYNC COMPLETE`,
                    mainStat: { label: "INTEL RECOVERED", value: quantumState.intelRecovered },
                    secondaryStat: { label: "FINAL STABILITY", value: Math.floor(quantumState.stability) + "%" },
                    onContinue: () => {
                        showScreen('quantum-level-selection-screen');
                        updateQuantumLevelSelection();
                    }
                };
                
                if (quantumState.difficulty === 'initiate') {
                    cryptoInitiateWinSound.currentTime = 0;
                    cryptoInitiateWinSound.play().catch(e => console.error(e));
                    if (!isNaN(cryptoInitiateWinSound.duration)) {
                        stats.duration = cryptoInitiateWinSound.duration * 1000;
                    } else {
                        stats.duration = 10000; // fallback if metadata isn't fully loaded
                    }
                } else if (quantumState.difficulty === 'operative') {
                    cryptoOperativeWinSound.currentTime = 0;
                    cryptoOperativeWinSound.play().catch(e => console.error(e));
                    if (!isNaN(cryptoOperativeWinSound.duration)) {
                        stats.duration = cryptoOperativeWinSound.duration * 1000;
                    } else {
                        stats.duration = 10000;
                    }
                }
                
                triggerVictoryOverlay(stats);
            }
            
        } else {
            if (quantumState.difficulty === 'operative') {
                operativeFailSound.currentTime = 0;
                operativeFailSound.play().catch(e => console.error(e));
            } else {
                failSound.currentTime = 0;
                failSound.play().catch(e => console.error(e));
            }

            // Use universal modal elements for fail
            const modalOverlay = document.getElementById('crypto-modal-overlay');
            const modalTitle = document.getElementById('modal-title');
            const modalMessage = document.getElementById('modal-message');
            const continueBtn = document.getElementById('modal-continue');

            if (modalOverlay && modalTitle && modalMessage && continueBtn) {
                modalTitle.textContent = "⚠ YOU ARE UNABLE TO SOLVE THE QUESTION ⚠";
                modalMessage.textContent = "You failed to save the Arc Reactor.";
                modalOverlay.classList.remove('hidden');
                modalOverlay.classList.add('fail-theme'); // Add danger theme
                modalOverlay.style.display = 'flex';
                
                continueBtn.onclick = () => {
                    modalOverlay.classList.add('hidden');
                    modalOverlay.style.display = 'none';
                    modalOverlay.classList.remove('fail-theme');
                    showScreen('quantum-level-selection-screen'); 
                    updateQuantumLevelSelection();
                };
            } else {
                triggerQuantumFeedback("CALCULATION_FAILED", "Neural coherence lost. Security link collapsed.", "error", 2500, () => {
                    showScreen('quantum-level-selection-screen');
                    updateQuantumLevelSelection();
                });
            }
        }
    }

    // Event Listeners for new Quantum UI
    quantumEls.submitBtn.addEventListener('click', handleQuantumSubmit);
    quantumEls.userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleQuantumSubmit();
    });
    quantumEls.hintBtn.addEventListener('click', handleQuantumHint);
    quantumEls.exitBtn.addEventListener('click', () => {
        clearInterval(quantumState.timerId);
        quantumState.active = false;
        cryptoStartSound.pause();
        cryptoAdvancedBgm.pause();
        showScreen('quantum-level-selection-screen');
    });

    document.getElementById('back-to-hub-from-quantum').addEventListener('click', () => {
        if (quantumGrid) quantumGrid.stop();
        cryptoStartSound.pause();
        cryptoAdvancedBgm.pause();
        showScreen('games-screen');
    });

    function startQuantumMatrix() {
        if (!quantumEls.canvas) return;
        const ctx = quantumEls.canvas.getContext('2d');
        const w = quantumEls.canvas.width = window.innerWidth;
        const h = quantumEls.canvas.height = window.innerHeight;
        const cols = Math.floor(w / 20) + 1;
        const ypos = Array(cols).fill(0);

        function matrix() {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(0, 0, w, h);
            ctx.fillStyle = '#00d4ff';
            ctx.font = '15pt Courier';
            ypos.forEach((y, ind) => {
                const text = String.fromCharCode(Math.random() * 128);
                const x = ind * 20;
                ctx.fillText(text, x, y);
                if (y > Math.random() * 10000) ypos[ind] = 0;
                else ypos[ind] = y + 20;
            });
        }
        if (quantumState.matrixInterval) clearInterval(quantumState.matrixInterval);
        quantumState.matrixInterval = setInterval(matrix, 50);
    }

    function playWebShootSound() {
        if (!audioCtx) return;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(400, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.2);
        gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.2);
    }

    function playErrorSound() {
        if (!audioCtx) return;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(100, audioCtx.currentTime);
        osc.frequency.linearRampToValueAtTime(50, audioCtx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.3);
    }

    // --- Cybershield Hub Hub Overhaul Logic ---

    function initCyberDataFlow() {
        const canvases = document.querySelectorAll('.cyber-canvas');
        if (canvases.length === 0) return;

        canvases.forEach(canvas => {
            const ctx = canvas.getContext('2d');
            let width, height;
            let columns = [];
            const fontSize = 16;
            const chars = "01ABCDEF!@#$%^&*+-/<>".split("");
            const systemTexts = ["JARVIS", "BREACH", "CYBER", "STARK_TECH", "NEXUS"];
            const storyLines = ["[SYSTEM] JARVIS Activated", "SECURITY OVERRIDE DETECTED", "ENCRYPTING DATA STREAM...", "BREACH_PROTOCOL_ACTIVE"];

            function resize() {
                width = canvas.width = window.innerWidth;
                height = canvas.height = window.innerHeight;
                const columnCount = Math.floor(width / fontSize);
                columns = [];
                for (let i = 0; i < columnCount; i++) {
                    columns.push({
                        x: i * fontSize,
                        y: Math.random() * -height,
                        speed: 2 + Math.random() * 5,
                        color: Math.random() > 0.8 ? (Math.random() > 0.5 ? '#ff003c' : '#ffd700') : '#00f0ff',
                        text: null,
                        textTimer: 0
                    });
                }
            }

            function draw() {
                // Faint red alert flashes integrated into data stream
                const flash = Math.random() > 0.992;
                ctx.fillStyle = flash ? 'rgba(255, 0, 60, 0.15)' : 'rgba(5, 5, 8, 0.15)';
                ctx.fillRect(0, 0, width, height);

                // Pulsing Arc Reactor Core (Subtle background glow)
                const time = Date.now() * 0.002;
                const centerX = width / 2;
                const centerY = height / 2;
                const pulse = 0.5 + 0.5 * Math.sin(time);
                
                ctx.save();
                const gradient = ctx.createRadialGradient(centerX, centerY, 50, centerX, centerY, 400);
                gradient.addColorStop(0, `rgba(0, 240, 255, ${0.15 * pulse})`);
                gradient.addColorStop(1, 'rgba(0, 240, 255, 0)');
                ctx.fillStyle = gradient;
                ctx.fillRect(0, 0, width, height);
                ctx.restore();

                // Matrix Rain
                ctx.font = `${fontSize}px 'Share Tech Mono', monospace`;
                columns.forEach(col => {
                    // Occasional system text or hexa/binary
                    if (!col.text && Math.random() > 0.997) {
                        col.text = systemTexts[Math.floor(Math.random() * systemTexts.length)];
                        col.textTimer = 50;
                    }

                    if (col.text) {
                        ctx.fillStyle = col.color;
                        ctx.shadowBlur = 15;
                        ctx.shadowColor = col.color;
                        for(let i=0; i<col.text.length; i++) {
                            ctx.fillText(col.text[i], col.x, col.y + i * fontSize);
                        }
                        col.textTimer--;
                        if (col.textTimer <= 0) col.text = null;
                    } else {
                        const char = chars[Math.floor(Math.random() * chars.length)];
                        ctx.fillStyle = col.color;
                        ctx.shadowBlur = col.color === '#00f0ff' ? 5 : 15;
                        ctx.shadowColor = col.color;
                        ctx.fillText(char, col.x, col.y);
                    }

                    col.y += col.speed;
                    if (col.y > height) {
                        col.y = -fontSize * 5;
                        col.speed = 2 + Math.random() * 5;
                    }
                });

                // Scrolling System Lines (Subtle woven story elements)
                ctx.shadowBlur = 0;
                ctx.fillStyle = 'rgba(0, 240, 255, 0.2)';
                ctx.font = "12px 'Share Tech Mono', monospace";
                const storyY = (Date.now() * 0.05) % (height + 200);
                ctx.fillText(storyLines[0], 40, storyY - 100);
                ctx.fillText(storyLines[2], width - 280, height - storyY + 100);
                
                if (flash) {
                    ctx.fillStyle = '#ff003c';
                    ctx.fillText("! CRITICAL BREACH !", width/2 - 60, 100);
                }

                requestAnimationFrame(draw);
            }

            window.addEventListener('resize', resize);
            resize();
            draw();
        });
    }

    function initHubOverhaul() {
        initCyberDataFlow();
        // 1. Particles.js - Rising Sparks
        if (window.particlesJS) {
            particlesJS('particles-js', {
                "particles": {
                    "number": { "value": 80, "density": { "enable": true, "value_area": 800 } },
                    "color": { "value": ["#ff4d4d", "#ffd700"] },
                    "shape": { "type": "circle" },
                    "opacity": { "value": 0.5, "random": true },
                    "size": { "value": 2, "random": true },
                    "line_linked": { "enable": false },
                    "move": {
                        "enable": true,
                        "speed": 2,
                        "direction": "top",
                        "random": true,
                        "straight": false,
                        "out_mode": "out"
                    }
                },
                "interactivity": { "events": { "onhover": { "enable": false } } },
                "retina_detect": true
            });
        }

        // 2. Vanilla Tilt - 3D Cards
        if (window.VanillaTilt) {
            VanillaTilt.init(document.querySelectorAll(".mode-card"), {
                max: 15,
                speed: 400,
                glare: true,
                "max-glare": 0.2,
                perspective: 1000,
                scale: 1.05
            });
        }

        // 3. Core Stability Tracker
        const stabilityEls = document.querySelectorAll('.core-stability-value');
        if (stabilityEls.length > 0) {
            let stability = 42.82;
            setInterval(() => {
                const fluctuation = (Math.random() - 0.5) * 0.4;
                stability = Math.max(35, Math.min(48, stability + fluctuation));
                stabilityEls.forEach(el => {
                    el.textContent = stability.toFixed(2);
                });
            }, 3000);
        }

        // 4. Live Threat Log
        const logContent = document.getElementById('threat-log-content');
        const threats = [
            "INCOMING BRUTE FORCE DETECTED...",
            "DECRYPTING PACKET 0x82A...",
            "FIREWALL BYPASS ATTEMPT IN SECTOR 7",
            "REROUTING POWER TO SHIELDS...",
            "ARC REACTOR TEMP: STABLE",
            "UNAUTHORIZED ACCESS BLOCKED",
            "SCANNING NEURAL INTERFACE...",
            "ENCRYPTING RSA_CORE_V4...",
            "THREAT LEVEL: CAT-5 DETECTED",
            "COMM_LINK_ENCRYPTED: TRUE"
        ];

        if (logContent) {
            setInterval(() => {
                const entry = document.createElement('div');
                entry.className = 'log-entry';
                entry.textContent = `> ${threats[Math.floor(Math.random() * threats.length)]}`;
                logContent.appendChild(entry);
                
                // Keep only last 12 entries
                if (logContent.children.length > 12) {
                    logContent.removeChild(logContent.firstChild);
                }
                
                // Scroll to bottom
                logContent.scrollTop = logContent.scrollHeight;
            }, 2500);
        }
    }

    // Initialize Overhaul
    initHubOverhaul();

    document.querySelectorAll('.play-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const card = btn.closest('.game-card');
            if (!card) return;
            const missionName = card.querySelector('h3').textContent.trim();
            
            if (missionName === 'CRYPTOGRAPHY') {
                startCryptoGame();
            } else if (missionName === 'BUG BOUNTY') {
                startBugBountyGame();
            } else if (missionName === 'QUANTUM CALCULATIONS') {
                startQuantumGame();
            }
        });
    });

    // --- BUG BOUNTY MISSION LOGIC ---
    let bugBountyState = {
        difficulty: "initiate",
        missionIdx: 0,
        missions: [],
        lives: 2,
        time: 120,
        timerId: null,
        active: false,
        initialTime: 120,
        gameOver: false,
        feedbackTimeout: null
    };

    const bugBountyEls = {
        screen: document.getElementById("bug-bounty-game-screen"),
        timer: document.getElementById("bb-timer"),
        missionId: document.getElementById("bb-mission-id"),
        integrity: document.getElementById("bb-integrity"),
        progress: document.getElementById("bb-progress"),
        lives: document.getElementById("bb-lives"),
        codeDisplay: document.getElementById("bb-code-display"),
        userInput: document.getElementById("bb-user-input"),
        submitBtn: document.getElementById("bb-submit-btn"),
        hintBtn: document.getElementById("bb-hint-btn"),
        exitBtn: document.getElementById("bb-exit-btn"),
        feedback: document.getElementById("bb-feedback"),
        feedbackTitle: document.getElementById("bb-feedback-title"),
        feedbackMsg: document.getElementById("bb-feedback-msg")
    };

    const bugBountyMissions = {
        initiate: [
            { id: "BB_IN_01", lang: "C", code: "#include <stdio.h>\nint main() {\n    printf(\"Hello World\")\n    return 0;\n}", solution: ";", hint: "Check the end of the printf line.", type: "syntax" },
            { id: "BB_IN_02", lang: "Python", code: "def greet(name)\n    print(\"Hello, \" + name)", solution: ":", hint: "Function definitions in Python require a specific character at the end.", type: "syntax" },
            { id: "BB_IN_03", lang: "HTML", code: "<p>Hello World <p>", solution: "</p>", hint: "The paragraph tag is not closed properly.", type: "syntax" },
            { id: "BB_IN_04", lang: "HTML", code: "<img src=logo.png>", solution: "\"", hint: "Attribute values should be enclosed in quotes.", type: "syntax" },
            { id: "BB_IN_05", lang: "Python", code: "if True\n    print(\"Success\")", solution: ":", hint: "If statements need a terminator.", type: "syntax" },
            { id: "BB_IN_06", lang: "C", code: "int main() {\n    int a = 5;\n    if (a = 10) {\n        printf(\"Equal\");\n    }\n}", solution: "==", hint: "Single equal sign is for assignment, not comparison.", type: "logic" },
            { id: "BB_IN_07", lang: "HTML", code: "<a herf=\"index.html\">", solution: "href", hint: "Typo detected in the hyperlink attribute.", type: "syntax" },
            { id: "BB_IN_08", lang: "HTML", code: "<button type=\"submit\" Click here</button>", solution: ">", hint: "An opening tag bracket is missing.", type: "syntax" },
            { id: "BB_IN_09", lang: "Python", code: "items = [1, 2, 3]\nprint(items[3])", solution: "index", hint: "What is the index of the last element?", type: "logic" },
            { id: "BB_IN_10", lang: "C", code: "char name[5] = \"Antigravity\";", solution: "size", hint: "The character array is too small for the string.", type: "logic" },
            { id: "BB_IN_11", lang: "HTML", code: "<div><span>Content</div></span>", solution: "nesting", hint: "Tags are not nested in the correct order.", type: "logic" },
            { id: "BB_IN_12", lang: "Python", code: "while True:\nprint(\"Loop\")", solution: "indent", hint: "The code block inside the while loop must be indented.", type: "syntax" },
            { id: "BB_IN_13", lang: "HTML", code: "<ul><li>1<li>2</ul>", solution: "</li>", hint: "List items should be closed for clarity.", type: "syntax" },
            { id: "BB_IN_14", lang: "C", code: "int x = 10 / 0;", solution: "zero", hint: "Mathematical impossibility detected.", type: "logic" },
            { id: "BB_IN_15", lang: "HTML", code: "<table <tr><td>Row</td></tr></table>", solution: ">", hint: "The opening table tag block is incomplete.", type: "syntax" },
            { id: "BB_IN_16", lang: "Python", code: "x = 10\ny = \"5\"\nprint(x + y)", solution: "type", hint: "Cannot add an integer and a string.", type: "logic" },
            { id: "BB_IN_17", lang: "C", code: "void swap(int a, int b) {\n    int t = a; a = b; b = t;\n}", solution: "pointer", hint: "This function won't change variables outside its scope.", type: "logic" },
            { id: "BB_IN_18", lang: "HTML", code: "<h1>Main Title</h3>", solution: "</h1>", hint: "The opening and closing tags do not match.", type: "syntax" },
            { id: "BB_IN_19", lang: "HTML", code: "<input type=text value=Name>", solution: "\"", hint: "Multiple attributes are missing proper quotes.", type: "syntax" },
            { id: "BB_IN_20", lang: "Python", code: "for i in range(10):\nif i == 5:\nbreak", solution: "indent", hint: "Nested if needs more spaces.", type: "syntax" },
            { id: "BB_IN_21", lang: "C", code: "#include <stdio.h>\nvoid main() {\n    printf(\"Hi\");\n}", solution: "int", hint: "Modern C standard requires a specific return type for main.", type: "syntax" },
            { id: "BB_IN_22", lang: "HTML", code: "<body><head><title>Test</title></head></body>", solution: "order", hint: "The head element must be outside the body.", type: "logic" },
            { id: "BB_IN_23", lang: "HTML", code: "<meta charset=\"UTF-8\" >", solution: "none", hint: "Basic character encoding tag seems correct.", type: "trick" },
            { id: "BB_IN_24", lang: "Python", code: "print(unknown_var)", solution: "name", hint: "This variable was never defined.", type: "logic" },
            { id: "BB_IN_25", lang: "C", code: "scanf(\"%d\", x);", solution: "&", hint: "Scanf needs the address of the variable.", type: "logic" },
            { id: "BB_IN_26", lang: "HTML", code: "<img src=\"logo.png\" alt=\"Logo\">", solution: "none", hint: "Basic image tag seems correct.", type: "trick" },
            { id: "BB_IN_27", lang: "HTML", code: "<ul>\n  <li>Item 1\n  <li>Item 2\n</ul>", solution: "</li>", hint: "HTML5 might allow it, but best practice is to close tags.", type: "syntax" },
            { id: "BB_IN_28", lang: "HTML", code: "<a href=\"index.html\">Home", solution: "</a>", hint: "Links must have a closing tag.", type: "syntax" }
        ],
        operative: [
            { id: "BB_OP_01", lang: "C", code: "int* ptr = (int*)malloc(sizeof(int));\n*ptr = 5;\n// missing something?", solution: "free", type: "logic", hint: "Memory that is allocated must eventually be released." },
            { id: "BB_OP_02", lang: "HTML", code: "<div id=\"main\" id=\"sidebar\">", solution: "duplicate", type: "logic", hint: "An element cannot have multiple ID attributes." },
            { id: "BB_OP_03", lang: "HTML", code: "<label>Name:</label><input type=\"text\">", solution: "for", type: "logic", hint: "The label is not linked to the input field." },
            { id: "BB_OP_04", lang: "Python", code: "def func(a=[]):\n    a.append(1)\n    return a", solution: "mutable", type: "logic", hint: "The list is created only once when the function is defined." },
            { id: "BB_OP_05", lang: "C", code: "while(1) { fork(); }", solution: "fork", type: "security", hint: "Recursive process creation without a termination condition." },
            { id: "BB_OP_06", lang: "HTML", code: "<form action=\"/save\" action=\"/update\">", solution: "action", type: "logic", hint: "A form cannot have multiple action destinations defined." },
            { id: "BB_OP_07", lang: "HTML", code: "<div><p>Testing</div></p>", solution: "nesting", type: "logic", hint: "The paragraph tag is closed after its parent div." },
            { id: "BB_OP_08", lang: "Python", code: "x = 1 / 0.000000000000000000000000001", solution: "none", type: "trick", hint: "The denominator is extremely small but not zero." },
            { id: "BB_OP_09", lang: "C", code: "if (ptr != NULL && *ptr == 0)", solution: "none", type: "trick", hint: "Standard null check before dereferencing seems safe." },
            { id: "BB_OP_10", lang: "HTML", code: "<button><button>Click</button></button>", solution: "nested", type: "logic", hint: "Interactive elements cannot be nested within each other." },
            { id: "BB_OP_11", lang: "HTML", code: "<select><p>Option 1</p></select>", solution: "option", type: "logic", hint: "Only specific tags are valid children of a select element." },
            { id: "BB_OP_12", lang: "Python", code: "x = [[]] * 3; x[0].append(1)", solution: "copy", type: "logic", hint: "Using '*' to create a list of lists creates references to the same object." },
            { id: "BB_OP_13", lang: "C", code: "char buf[10]; gets(buf);", solution: "bounds", type: "security", hint: "The `gets` function has no bounds checking." },
            { id: "BB_OP_14", lang: "HTML", code: "<img src=\"pic.jpg\">", solution: "alt", type: "logic", hint: "Missing alternative text for accessibility compliance." },
            { id: "BB_OP_15", lang: "HTML", code: "<iframe path=\"video.html\"></iframe>", solution: "src", type: "logic", hint: "The attribute for the source URL is incorrect." },
            { id: "BB_OP_16", lang: "Python", code: "isinstance(True, int)", solution: "none", type: "trick", hint: "Booleans are a subclass of integers in Python." },
            { id: "BB_OP_17", lang: "C", code: "return &local_var;", solution: "scope", type: "logic", hint: "Returning the address of a variable that will go out of scope." },
            { id: "BB_OP_18", lang: "HTML", code: "<style color=\"red\">body { background: #000; }</style>", solution: "type", type: "logic", hint: "The attribute name for describing the content type is wrong." },
            { id: "BB_OP_19", lang: "HTML", code: "<script src=\"app.js\">console.log(\"init\");</script>", solution: "both", type: "logic", hint: "A script tag cannot have both a source URL and inline content." },
            { id: "BB_OP_20", lang: "Python", code: "x = 5; def f(): print(x); x = 10;", solution: "global", type: "logic", hint: "Assigning to a variable within a function makes it local to that scope." },
            { id: "BB_OP_21", lang: "C", code: "#include <alloca.h>\nvoid* p = alloca(10000000);", solution: "stack", type: "logic", hint: "Allocating a large amount of memory on the stack can exceed its limit." },
            { id: "BB_OP_22", lang: "HTML", code: "<video><source src=\"movie.mp4\"></video>", solution: "controls", type: "logic", hint: "The video will not be playable without specified user interface elements." },
            { id: "BB_OP_23", lang: "HTML", code: "<form> <input type=\"submit\"> </form>", solution: "method", type: "logic", hint: "The form submission method is not defined." },
            { id: "BB_OP_24", lang: "Python", code: "round(2.5) vs round(3.5)", solution: "round", type: "logic", hint: "Python rounds to the nearest even number when hitting .5 exactly." },
            { id: "BB_OP_25", lang: "C", code: "printf(user_input);", solution: "format", type: "security", hint: "Passing user data directly to printf allows attackers to read or write memory." }
        ],
        omega: [
            { id: "BB_OM_01", lang: "C", code: "void* p = &&label; goto *p;", solution: "&&", type: "trick", hint: "An unconventional label reference using two ampersands." },
            { id: "BB_OM_02", lang: "HTML", code: "<my-element>Custom Content</my-element>", solution: "hyphen", type: "logic", hint: "Custom HTML elements must contain at least one hyphen in their name." },
            { id: "BB_OM_03", lang: "HTML", code: "<table><tr><td colspan=\"0\">Data</td></tr></table>", solution: "colspan", type: "security", hint: "The span attribute for a table cell cannot be zero." },
            { id: "BB_OM_04", lang: "Python", code: "__import__(\"os\").system(\"rm -rf /\")", solution: "os.system", type: "security", hint: "Executing system commands through a dynamic string." },
            { id: "BB_OM_05", lang: "C", code: "int x = -1; unsigned int y = 1; if (x < y)", solution: "unsigned", type: "logic", hint: "C standard promotes signed integers to unsigned when compared." },
            { id: "BB_OM_06", lang: "HTML", code: "<svg><rect x=\"10\" y=\"10\" width=\"100\" height=\"100\" /></svg>", solution: "none", type: "trick", hint: "Basic SVG rectangle definition seems valid." },
            { id: "BB_OM_07", lang: "HTML", code: "<div data-User-Id=\"123\"></div>", solution: "lowercase", type: "logic", hint: "Data attribute names should be lowercase to be correctly parsed into the dataset object." },
            { id: "BB_OM_08", lang: "Python", code: "x = eval(input())", solution: "eval", type: "security", hint: "Executing arbitrary input as code." },
            { id: "BB_OM_09", lang: "C", code: "setjmp(env); longjmp(env, 1);", solution: "none", type: "trick", hint: "Non-local jumps are valid C, but must be used carefully." },
            { id: "BB_OM_10", lang: "HTML", code: "<html><head></head><body><footer></footer><header></header></body></html>", solution: "semantic", type: "logic", hint: "Semantic sectioning order is unconventional/illogical here." },
            { id: "BB_OM_11", lang: "HTML", code: "<a href=\"javascript:alert('XSS')\">Click</a>", solution: "security", type: "logic", hint: "Executing javascript through a hyperlink protocol is a security risk." },
            { id: "BB_OM_12", lang: "Python", code: "globals()[\"x\"] = 10", solution: "globals", type: "logic", hint: "Directly modifying the global namespace dictionary." },
            { id: "BB_OM_13", lang: "C", code: "static inline void f() {}", solution: "none", type: "trick", hint: "Static inline is a common optimization hint." },
            { id: "BB_OM_14", lang: "HTML", code: "<meta http-equiv=\"Content-Type\" content=\"text/html\">", solution: "charset", type: "logic", hint: "This attribute style is deprecated; prefer the modern charset attribute." },
            { id: "BB_OM_15", lang: "HTML", code: "<link rel=\"stylesheet\" href=\"style.css\" media=\"all\">", solution: "none", type: "security", hint: "Standard external stylesheet link seems secure and correct." },
            { id: "BB_OM_16", lang: "Python", code: "[i for i in range(5)] # in Python 2 vs 3", solution: "scope", type: "logic", hint: "In Python 2, list comprehensions leaked variables to outer scope." },
            { id: "BB_OM_17", lang: "C", code: "void (*f)() = (void(*)())0; f();", solution: "null", type: "security", hint: "Calling a function at address zero." },
            { id: "BB_OM_18", lang: "HTML", code: "<aria-label=\"Close\">X</button>", solution: "<button", type: "logic", hint: "The opening tag name for this interactive element is missing." },
            { id: "BB_OM_19", lang: "HTML", code: "<tr rowspan=\"2\"><td>Cell</td></tr>", solution: "td", type: "logic", hint: "The rowspan attribute belongs on table data cells, not table rows." },
            { id: "BB_OM_20", lang: "Python", code: "x = 1000; y = 1000; x is y", solution: "is", type: "logic", hint: "Python only caches small integers; larger ones are separate objects." },
            { id: "BB_OM_21", lang: "C", code: "#pragma pack(1) struct S { char c; int i; };", solution: "pack", type: "logic", hint: "Disabling padding between struct members." },
            { id: "BB_OM_22", lang: "HTML", code: "<template> <p>Secret</p> </template>", solution: "none", type: "logic", hint: "Content within template tags is not rendered by default." },
            { id: "BB_OM_23", lang: "HTML", code: "<!DOCTYPE html><html><body><h1>Header</h1></html>", solution: "</body>", type: "logic", hint: "The body tag was never closed." },
            { id: "BB_OM_24", lang: "Python", code: "pickle.loads(user_data)", solution: "pickle", type: "security", hint: "Loading untrusted data can execute malicious code." },
            { id: "BB_OM_25", lang: "C", code: "void f(int n) { int a[n]; }", solution: "VLA", type: "logic", hint: "Arrays whose size is determined at runtime." }
        ]
    };

    function startBugBountyGame() {
        showScreen('bug-bounty-level-selection-screen');
        updateBugBountyLevelSelection();
    }

    // Consolidated to top area

    const backToHubBtnBug = document.getElementById('back-to-hub-from-bug');
    if (backToHubBtnBug) backToHubBtnBug.addEventListener('click', () => showScreen('games-screen'));

    // Rule Screen Integration
    document.addEventListener('click', e => {
        const btn = e.target.closest('.bug-bounty-start-btn');
        if (btn) {
            const diff = btn.dataset.diff;
            if (diff) {
                const levelVal = diff === 'initiate' ? 1 : (diff === 'operative' ? 2 : 3);
                
                if (levelVal > bugBountyUnlockedLevel) {
                    showToast("SECURITY PROTOCOL: Complete previous mission to unlock.");
                    return;
                }
                
                showRules('BUG BOUNTY', diff);
            }
        }
    });


    function startActualBugBountyGame(diff) {
        bugBountyState.difficulty = diff.toLowerCase();
        const mCount = 2;
        bugBountyState.missions = shuffleMissions([...bugBountyMissions[bugBountyState.difficulty]]);
        bugBountyState.missions = bugBountyState.missions.slice(0, mCount);
        
        bugBountyState.missionIdx = 0;
        bugBountyState.lives = bugBountyState.difficulty === 'initiate' ? 2 : 1;
        bugBountyState.initialTime = bugBountyState.difficulty === 'initiate' ? 90 : (bugBountyState.difficulty === 'operative' ? 60 : 45);
        bugBountyState.time = bugBountyState.initialTime;
        bugBountyState.active = true;
        bugBountyState.gameOver = false;

        // Play mission start sound for Initiate and Operative
        if (bugBountyState.difficulty === 'initiate' || bugBountyState.difficulty === 'operative') {
            cryptoStartSound.currentTime = 0;
            cryptoStartSound.play().catch(() => {});
        }

        // Set animation color based on difficulty
        if (bugBountyGrid) {
            bugBountyGrid.setColor(diff.toUpperCase());
        }

        bugBountyEls.screen.className = 'screen ' + (bugBountyState.difficulty === 'initiate' ? 'theme-initiate' : (bugBountyState.difficulty === 'operative' ? 'theme-operative' : 'theme-omega'));
        
        showScreen('bug-bounty-game-screen');
        initBugBountyMission();
        startBugBountyTimer();

        cryptoStartSound.currentTime = 0;
        cryptoStartSound.play().catch(() => {});

        if (diff.toLowerCase() === 'operative' || diff.toLowerCase() === 'omega') {
            cryptoAdvancedBgm.currentTime = 0;
            cryptoAdvancedBgm.play().catch(() => {});
            bgMusic.pause();
        }
    }

    function initBugBountyMission() {
        if (!bugBountyState.active) return;
        const currentMission = bugBountyState.missions[bugBountyState.missionIdx];
        
        // Update basic mission data
        bugBountyEls.missionId.textContent = currentMission.id;
        bugBountyEls.codeDisplay.textContent = currentMission.code;
        bugBountyEls.userInput.value = '';
        bugBountyEls.userInput.focus();
        
        // Update language label and progress
        const langLabel = document.getElementById("bb-lang-label");
        if (langLabel) langLabel.textContent = currentMission.lang || "SYSTEM_CORE";
        
        bugBountyEls.progress.textContent = `${bugBountyState.missionIdx + 1}/${bugBountyState.missions.length}`;
        bugBountyEls.lives.textContent = bugBountyState.lives;
        
        // Update stats and integrity bar
        const integrityPercent = Math.max(0, Math.floor((bugBountyState.time / bugBountyState.initialTime) * 100));
        bugBountyEls.integrity.textContent = integrityPercent;
        updateIntegrityVisuals(integrityPercent);
        
        bugBountyEls.timer.textContent = Math.ceil(bugBountyState.time);
        
        // Toggle hint visibility based on difficulty (Enabling for all for consistency)
        bugBountyEls.hintBtn.style.display = 'block';
        bugBountyEls.feedback.classList.remove('show');
        
        // Background animation initialization if not already running
        if (!bugBountyGrid) {
            bugBountyGrid = new DigitalRain('bug-bounty-grid-canvas');
        }
        bugBountyGrid.start();
    }

    function startBugBountyTimer() {
        if (bugBountyState.timerId) clearInterval(bugBountyState.timerId);
        bugBountyState.timerId = setInterval(() => {
            if (!bugBountyState.active) return;
            bugBountyState.time -= 0.1;
            if (bugBountyState.time <= 0) {
                bugBountyState.time = 0;
                endBugBountyGame(false);
            }
            bugBountyEls.timer.textContent = Math.ceil(bugBountyState.time);
            
            const integrityPercent = Math.max(0, Math.floor((bugBountyState.time / bugBountyState.initialTime) * 100));
            bugBountyEls.integrity.textContent = integrityPercent;
            updateIntegrityVisuals(integrityPercent);
        }, 100);
    }

    function updateIntegrityVisuals(percent) {
        const barFill = document.getElementById("bb-integrity-bar-fill");
        if (!barFill) return;

        barFill.style.width = percent + "%";
        
        // Color transition logic for realism
        let color = "#00f0ff"; // Stable (Cyan)
        if (percent < 25) {
            color = "#ff003c"; // Danger Red
        } else if (percent < 50) {
            color = "#ffaa00"; // Dark Yellow
        } else if (percent < 75) {
            color = "#ffff00"; // Yellow
        }

        barFill.style.background = color;
        barFill.style.boxShadow = `0 0 15px ${color}`;
    }

    function checkBugBountyAnswer() {
        if (!bugBountyState.active) return;
        const currentMission = bugBountyState.missions[bugBountyState.missionIdx];
        const userVal = bugBountyEls.userInput.value.toLowerCase().trim();
        const solVal = currentMission.solution.toLowerCase().trim();
        
        let isCorrect = (userVal === solVal); // PRIORITY: DIRECT MATCH

        if (!isCorrect) {
            // Symbolic Fallbacks (e.g., if user types extra brackets by habit)
            if (solVal === ";" && userVal.includes(";")) isCorrect = true;
            else if (solVal === ":" && userVal.includes(":")) isCorrect = true;
            else if (solVal === "&" && userVal.includes("&")) isCorrect = true;
            else if (solVal === "[]" && (userVal.includes("[]") || userVal.includes("brackets"))) isCorrect = true;
            else if (solVal === "</li>" && (userVal.includes("</li") || userVal.includes("</li>"))) isCorrect = true;
            else if (solVal === "</a>" && (userVal.includes("</a") || userVal.includes("</a>"))) isCorrect = true;
        }

        if (!isCorrect) {
            // Fuzzy Matching for keywords (e.g., "free", "deadlock")
            const normalizedUser = userVal.replace(/[^a-z0-9]/g, '');
            const normalizedSol = solVal.replace(/[^a-z0-9]/g, '');

            if (normalizedUser.length > 0 && normalizedSol.length > 0) {
                // For keyword answers, allow partial matches if the strings are long enough
                if (normalizedUser === normalizedSol || 
                   (normalizedSol.length >= 3 && normalizedSol.includes(normalizedUser)) || 
                   (normalizedUser.length >= 3 && normalizedUser.includes(normalizedSol))) {
                    isCorrect = true;
                }
            }
        }

        if (isCorrect) {
            handleBugBountySuccess();
        } else {
            handleBugBountyFailure();
        }
    }

    if (bugBountyEls.submitBtn) bugBountyEls.submitBtn.addEventListener('click', checkBugBountyAnswer);
    if (bugBountyEls.userInput) bugBountyEls.userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') checkBugBountyAnswer();
    });

    if (bugBountyEls.hintBtn) bugBountyEls.hintBtn.addEventListener('click', () => {
        if (!bugBountyState.active) return;
        if (bugBountyState.time > 25) {
            bugBountyState.time -= 20;
            const currentMission = bugBountyState.missions[bugBountyState.missionIdx];
            triggerBugBountyFeedback("TACTICAL_HINT", currentMission.hint, "hint", 4000);
        } else {
            showToast("SECURITY_ALERT: Insufficient integrity for hint decryption.");
        }
    });

    if (bugBountyEls.exitBtn) bugBountyEls.exitBtn.addEventListener('click', () => {
        clearInterval(bugBountyState.timerId);
        bugBountyState.active = false;
        cryptoStartSound.pause();
        cryptoAdvancedBgm.pause();
        showScreen('bug-bounty-level-selection-screen');
    });

    function handleBugBountySuccess() {
        bugBountyState.active = false;
        triggerBugBountyFeedback("PATCHED", "SYSTEM INTEGRITY RESTORED", "success", 2000, () => {
            bugBountyState.missionIdx++;
            if (bugBountyState.missionIdx >= bugBountyState.missions.length) {
                endBugBountyGame(true);
            } else {
                bugBountyState.active = true;
                initBugBountyMission();
            }
        });
    }

    function handleBugBountyFailure() {
        if (bugBountyState.difficulty === 'initiate' && bugBountyState.lives > 1) {
            bugBountyState.lives--;
            bugBountyState.time -= 15;
            bugBountyEls.lives.textContent = bugBountyState.lives;
            triggerBugBountyFeedback("INCORRECT PATCH", "SECURITY ALERT: SYSTEM INTEGRITY COMPROMISED", "error", 2500);
            
            // Play dramatic sound for first mistake
            new Audio('assets/audio/dun-dun-dun-sound-effect-brass_8nFBccR.mp3').play().catch(e => console.log('Audio play failed:', e));
            
            return;
        }

        bugBountyState.lives = 0;
        bugBountyState.time -= 15;
        bugBountyEls.lives.textContent = "0";
        
        let title = "INCORRECT PATCH";
        let msg = "CRITICAL BREACH DETECTED";

        triggerBugBountyFeedback(title, msg, "error", 2500, () => {
            endBugBountyGame(false);
        });
    }

    function triggerBugBountyFeedback(title, msg, type, duration = 0, onComplete = null) {
        if (bugBountyState.feedbackTimeout) {
            clearTimeout(bugBountyState.feedbackTimeout);
            bugBountyState.feedbackTimeout = null;
        }

        bugBountyEls.feedbackTitle.textContent = title;
        bugBountyEls.feedbackMsg.textContent = msg;
        
        // Color mapping for Bug Bounty feedback
        let titleColor = "#00f0ff"; // Default hint
        if (type === "success") titleColor = "#00ffcc";
        if (type === "error") titleColor = "#ff003c";
        
        bugBountyEls.feedbackTitle.style.color = titleColor;
        bugBountyEls.feedback.className = `bb-feedback-overlay show bb-${type}`;

        if (duration > 0) {
            bugBountyState.feedbackTimeout = setTimeout(() => {
                bugBountyEls.feedback.classList.remove('show');
                bugBountyState.feedbackTimeout = null;

                if (bugBountyState.active) {
                    bugBountyEls.userInput.focus();
                }

                if (onComplete) onComplete();
            }, duration);
        }
    }

    function endBugBountyGame(victory) {
        if (bugBountyState.gameOver) return;
        clearInterval(bugBountyState.timerId);
        bugBountyState.active = false;
        bugBountyState.gameOver = true;
        
        cryptoStartSound.pause();
        cryptoAdvancedBgm.pause();

        if (victory) {
            const prevLevel = bugBountyUnlockedLevel;
            if (bugBountyState.difficulty === 'initiate' && bugBountyUnlockedLevel === 1) {
                bugBountyUnlockedLevel = 2;
                pendingUnlock = { game: 'bug_bounty', level: 2 };
            } else if (bugBountyState.difficulty === 'operative' && bugBountyUnlockedLevel === 2) {
                bugBountyUnlockedLevel = 3;
                pendingUnlock = { game: 'bug_bounty', level: 3 };
            }

            const _bUid = (currentUser && currentUser.uid) ? currentUser.uid : 'guest';
            localStorage.setItem(_bUid + '_bug_bounty_unlocked_level_v5', bugBountyUnlockedLevel);

            if (bugBountyState.difficulty === 'omega') {
                bugBountyEls.feedbackTitle.textContent = "OMEGA PATCHED";
                bugBountyEls.feedbackTitle.style.color = "#00f0ff";
                bugBountyEls.feedbackMsg.textContent = "All nodes secured. Initializing Arc Reactor...";
                bugBountyEls.feedback.classList.add('show', 'bb-success');
                setTimeout(() => {
                    bugBountyEls.feedback.classList.remove('show', 'bb-success');
                    startVictoryCutscene();
                }, 3500);
            } else {
                const stats = {
                    title: "BUG BOUNTY COMPLETE",
                    subtitle: `${bugBountyState.difficulty.toUpperCase()} KERNEL SECURED`,
                    mainStat: { label: "TIME REMAINING", value: Math.ceil(bugBountyState.time) + "s" },
                    secondaryStat: { label: "PATCHES APPLIED", value: bugBountyState.missionIdx },
                    onContinue: () => {
                        showScreen('bug-bounty-level-selection-screen');
                        updateBugBountyLevelSelection();
                    }
                };
                triggerVictoryOverlay(stats);
                
                if (bugBountyState.difficulty === 'initiate') {
                    cryptoInitiateWinSound.currentTime = 0;
                    cryptoInitiateWinSound.play().catch(e => console.error(e));
                } else if (bugBountyState.difficulty === 'operative') {
                    cryptoOperativeWinSound.currentTime = 0;
                    cryptoOperativeWinSound.play().catch(e => console.error(e));
                }
            }
        } else {
            if (bugBountyState.difficulty === 'operative') {
                operativeFailSound.currentTime = 0;
                operativeFailSound.play().catch(e => console.error(e));
            } else {
                failSound.currentTime = 0;
                failSound.play().catch(e => console.error(e));
            }
            
            // Use universal modal elements for fail
            const modalOverlay = document.getElementById('crypto-modal-overlay');
            const modalTitle = document.getElementById('modal-title');
            const modalMessage = document.getElementById('modal-message');
            const continueBtn = document.getElementById('modal-continue');

            if (modalOverlay && modalTitle && modalMessage && continueBtn) {
                modalTitle.textContent = "💀 YOU ARE UNABLE TO PATCH THE BUG 💀";
                modalMessage.textContent = "You failed to save the Arc Reactor.";
                modalOverlay.classList.remove('hidden');
                modalOverlay.classList.add('fail-theme'); // Add danger theme
                modalOverlay.style.display = 'flex';
                
                continueBtn.onclick = () => {
                    modalOverlay.classList.add('hidden');
                    modalOverlay.style.display = 'none';
                    modalOverlay.classList.remove('fail-theme');
                    showScreen('bug-bounty-level-selection-screen'); 
                    updateBugBountyLevelSelection();
                };
            } else {
                showScreen('bug-bounty-level-selection-screen');
                updateBugBountyLevelSelection();
            }
        }
    }
});
