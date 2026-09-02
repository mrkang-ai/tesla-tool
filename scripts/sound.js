/**
 * Global Web Audio API Synthesizer & SoundFX Engine
 * Generates tactile click, pop, tick, and victory chime sounds procedurally.
 * No external audio files needed (0 latency, 100% offline).
 */

(function() {
    'use strict';

    let audioCtx = null;
    let isSoundEnabled = localStorage.getItem('sound_enabled') === 'true'; // false by default or user saved

    function getAudioContext() {
        if (!audioCtx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) {
                audioCtx = new AudioContext();
            }
        }
        if (audioCtx && audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
        return audioCtx;
    }

    const SoundFX = {
        isEnabled() {
            return isSoundEnabled;
        },

        toggle() {
            isSoundEnabled = !isSoundEnabled;
            localStorage.setItem('sound_enabled', isSoundEnabled ? 'true' : 'false');
            this.updateUI();
            if (isSoundEnabled) {
                getAudioContext();
                this.playPop();
            }
            return isSoundEnabled;
        },

        setEnabled(val) {
            isSoundEnabled = !!val;
            localStorage.setItem('sound_enabled', isSoundEnabled ? 'true' : 'false');
            this.updateUI();
        },

        updateUI() {
            const soundBtns = document.querySelectorAll('.sound-toggle-btn');
            soundBtns.forEach(btn => {
                const icon = btn.querySelector('.material-symbols-outlined') || btn.querySelector('span');
                if (icon) {
                    icon.textContent = isSoundEnabled ? 'volume_up' : 'volume_off';
                }
                btn.setAttribute('aria-label', isSoundEnabled ? '사운드 켜짐' : '사운드 꺼짐');
                if (isSoundEnabled) {
                    btn.classList.add('text-primary');
                    btn.classList.remove('text-text-muted', 'dark:text-slate-400');
                } else {
                    btn.classList.remove('text-primary');
                    btn.classList.add('text-text-muted', 'dark:text-slate-400');
                }
            });
        },

        // 1. Crisp Bubble Pop (For card hover, tab switch, soft button clicks)
        playPop() {
            if (!isSoundEnabled) return;
            const ctx = getAudioContext();
            if (!ctx) return;

            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'sine';
            const now = ctx.currentTime;

            osc.frequency.setValueAtTime(320, now);
            osc.frequency.exponentialRampToValueAtTime(780, now + 0.06);

            gain.gain.setValueAtTime(0.2, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(now);
            osc.stop(now + 0.08);
        },

        // 2. Tactile Mechanical Click
        playClick() {
            if (!isSoundEnabled) return;
            const ctx = getAudioContext();
            if (!ctx) return;

            const now = ctx.currentTime;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(140, now);
            osc.frequency.exponentialRampToValueAtTime(40, now + 0.04);

            gain.gain.setValueAtTime(0.25, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(now);
            osc.stop(now + 0.05);
        },

        // 3. Wheel / Switch Ratchet Tick
        playTick() {
            if (!isSoundEnabled) return;
            const ctx = getAudioContext();
            if (!ctx) return;

            const now = ctx.currentTime;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(950, now);
            osc.frequency.exponentialRampToValueAtTime(400, now + 0.025);

            gain.gain.setValueAtTime(0.18, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(now);
            osc.stop(now + 0.03);
        },

        // 4. Celebratory Victory Arpeggio Chime (C5, E5, G5, C6)
        playWin() {
            if (!isSoundEnabled) return;
            const ctx = getAudioContext();
            if (!ctx) return;

            const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
            const now = ctx.currentTime;

            notes.forEach((freq, idx) => {
                const startTime = now + idx * 0.09;
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();

                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, startTime);

                gain.gain.setValueAtTime(0.25, startTime);
                gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.35);

                osc.connect(gain);
                gain.connect(ctx.destination);

                osc.start(startTime);
                osc.stop(startTime + 0.36);
            });
        }
    };

    window.SoundFX = SoundFX;

    // Attach global click sound listener for tactile buttons
    document.addEventListener('DOMContentLoaded', () => {
        SoundFX.updateUI();

        document.addEventListener('click', (e) => {
            const target = e.target.closest('.btn-tactile, .sound-toggle-btn, .choice-btn, button:not([data-no-sound])');
            if (target && !target.classList.contains('sound-toggle-btn')) {
                SoundFX.playClick();
            }
        });

        // Resume AudioContext on first user interaction
        const unlockAudio = () => {
            getAudioContext();
            document.removeEventListener('pointerdown', unlockAudio);
            document.removeEventListener('keydown', unlockAudio);
        };
        document.addEventListener('pointerdown', unlockAudio);
        document.addEventListener('keydown', unlockAudio);
    });
})();
