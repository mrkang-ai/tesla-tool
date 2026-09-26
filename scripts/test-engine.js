/**
 * Viral & Psychological Test Engine
 * tossgpt.online / ToolBox Portal
 * Features:
 * - Data-driven question progression
 * - Smooth fade transitions & Web Audio / Particle effects
 * - 3-second interactive dopamine loading screen
 * - HTML5 Canvas social card image generator (Instagram / Kakao ready)
 * - Web Share API & Clipboard sharing with toast notifications
 */

(function() {
    'use strict';

    class ViralTestEngine {
        constructor(config) {
            this.config = config;
            this.currentIndex = 0;
            this.scores = {};
            this.userAnswers = [];
            this.currentResult = null;

            // Initialize score counters
            if (config.resultTypes) {
                config.resultTypes.forEach(type => {
                    this.scores[type] = 0;
                });
            }

            this.initDOM();
            this.attachEvents();
        }

        initDOM() {
            this.container = document.getElementById('test-app-container');
            if (!this.container) return;

            // Render skeleton containers
            this.introSection = document.getElementById('test-intro-section');
            this.quizSection = document.getElementById('test-quiz-section');
            this.loadingSection = document.getElementById('test-loading-section');
            this.resultSection = document.getElementById('test-result-section');

            this.progressBar = document.getElementById('quiz-progress-bar');
            this.progressText = document.getElementById('quiz-progress-text');
            this.questionNumber = document.getElementById('quiz-question-number');
            this.questionTitle = document.getElementById('quiz-question-title');
            this.questionContext = document.getElementById('quiz-question-context');
            this.optionsContainer = document.getElementById('quiz-options-container');
        }

        attachEvents() {
            const startBtn = document.getElementById('start-test-btn');
            if (startBtn) {
                startBtn.addEventListener('click', () => {
                    this.playSound('pop');
                    this.startTest();
                });
            }

            const restartBtn = document.getElementById('restart-test-btn');
            if (restartBtn) {
                restartBtn.addEventListener('click', () => {
                    this.playSound('pop');
                    this.resetTest();
                });
            }

            const copyBtn = document.getElementById('copy-result-btn');
            if (copyBtn) {
                copyBtn.addEventListener('click', () => {
                    this.copyResultLink();
                });
            }

            const shareBtn = document.getElementById('share-result-btn');
            if (shareBtn) {
                shareBtn.addEventListener('click', () => {
                    this.shareNative();
                });
            }

            const downloadCardBtn = document.getElementById('download-card-btn');
            if (downloadCardBtn) {
                downloadCardBtn.addEventListener('click', () => {
                    this.downloadResultImage();
                });
            }
        }

        playSound(type) {
            if (window.SoundFX && typeof window.SoundFX.isEnabled === 'function' && window.SoundFX.isEnabled()) {
                if (type === 'pop' && typeof window.SoundFX.playPop === 'function') {
                    window.SoundFX.playPop();
                } else if (type === 'click' && typeof window.SoundFX.playClick === 'function') {
                    window.SoundFX.playClick();
                } else if (type === 'win' && typeof window.SoundFX.playWin === 'function') {
                    window.SoundFX.playWin();
                }
            }
        }

        startTest() {
            this.currentIndex = 0;
            this.userAnswers = [];
            // Reset scores
            Object.keys(this.scores).forEach(k => this.scores[k] = 0);

            if (this.introSection) this.introSection.classList.add('hidden');
            if (this.resultSection) this.resultSection.classList.add('hidden');
            if (this.loadingSection) this.loadingSection.classList.add('hidden');
            if (this.quizSection) {
                this.quizSection.classList.remove('hidden');
                this.quizSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }

            this.renderCurrentQuestion();
        }

        resetTest() {
            if (this.resultSection) this.resultSection.classList.add('hidden');
            if (this.loadingSection) this.loadingSection.classList.add('hidden');
            if (this.quizSection) this.quizSection.classList.add('hidden');
            if (this.introSection) {
                this.introSection.classList.remove('hidden');
                this.introSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }

        renderCurrentQuestion() {
            const q = this.config.questions[this.currentIndex];
            if (!q) return;

            const total = this.config.questions.length;
            const progressPercent = Math.round(((this.currentIndex) / total) * 100);

            if (this.progressBar) {
                this.progressBar.style.width = `${progressPercent}%`;
            }
            if (this.progressText) {
                this.progressText.textContent = `${this.currentIndex + 1} / ${total}`;
            }
            if (this.questionNumber) {
                this.questionNumber.textContent = `Q${this.currentIndex + 1}.`;
            }
            if (this.questionTitle) {
                this.questionTitle.textContent = q.question;
            }
            if (this.questionContext) {
                if (q.context) {
                    this.questionContext.textContent = q.context;
                    this.questionContext.classList.remove('hidden');
                } else {
                    this.questionContext.classList.add('hidden');
                }
            }

            if (this.optionsContainer) {
                this.optionsContainer.innerHTML = '';
                q.options.forEach((opt, idx) => {
                    const btn = document.createElement('button');
                    btn.className = 'w-full text-left p-4 md:p-5 rounded-2xl bg-white dark:bg-slate-800/90 border-2 border-slate-200/80 dark:border-slate-700/80 hover:border-primary dark:hover:border-primary hover:bg-sky-50/50 dark:hover:bg-sky-950/30 transition-all transform active:scale-[0.99] flex items-start gap-3 group shadow-sm cursor-pointer';
                    btn.innerHTML = `
                        <span class="size-7 rounded-xl bg-slate-100 dark:bg-slate-700/80 group-hover:bg-primary group-hover:text-white text-slate-500 dark:text-slate-300 font-bold text-sm flex items-center justify-center shrink-0 transition-colors mt-0.5">${String.fromCharCode(65 + idx)}</span>
                        <span class="text-sm md:text-base font-semibold text-slate-800 dark:text-slate-100 group-hover:text-primary transition-colors leading-relaxed">${opt.text}</span>
                    `;
                    btn.addEventListener('click', () => {
                        this.handleSelectOption(opt);
                    });
                    this.optionsContainer.appendChild(btn);
                });
            }
        }

        handleSelectOption(option) {
            this.playSound('click');
            this.userAnswers.push(option);

            // Tally score
            if (typeof option.type === 'string') {
                this.scores[option.type] = (this.scores[option.type] || 0) + 1;
            } else if (typeof option.type === 'object') {
                Object.keys(option.type).forEach(typeKey => {
                    this.scores[typeKey] = (this.scores[typeKey] || 0) + option.type[typeKey];
                });
            }

            this.currentIndex++;

            if (this.currentIndex < this.config.questions.length) {
                // Fade effect
                if (this.optionsContainer) {
                    this.optionsContainer.classList.add('opacity-0', 'translate-y-2');
                    setTimeout(() => {
                        this.renderCurrentQuestion();
                        this.optionsContainer.classList.remove('opacity-0', 'translate-y-2');
                    }, 140);
                } else {
                    this.renderCurrentQuestion();
                }
            } else {
                // Completed all questions -> Loading & Result
                this.showLoadingAndResult();
            }
        }

        showLoadingAndResult() {
            if (this.quizSection) this.quizSection.classList.add('hidden');
            if (this.loadingSection) {
                this.loadingSection.classList.remove('hidden');
                this.loadingSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }

            // Calculate dominant result type
            let bestType = null;
            let highestScore = -Infinity;

            Object.keys(this.scores).forEach(typeKey => {
                if (this.scores[typeKey] > highestScore) {
                    highestScore = this.scores[typeKey];
                    bestType = typeKey;
                }
            });

            // Default fallback if no score
            if (!bestType || !this.config.results[bestType]) {
                const keys = Object.keys(this.config.results);
                bestType = keys[0];
            }

            this.currentResult = this.config.results[bestType];

            // Animated status loading messages
            const loadingMsg = document.getElementById('loading-status-msg');
            const messages = [
                '선택하신 답변 패턴을 분석하고 있습니다...',
                '심층 성향 매트릭스와 교차 검증 중...',
                '가장 높은 일치율의 캐릭터 페르소나 매칭 완료!'
            ];
            let msgIdx = 0;
            const interval = setInterval(() => {
                msgIdx++;
                if (loadingMsg && msgIdx < messages.length) {
                    loadingMsg.textContent = messages[msgIdx];
                }
            }, 800);

            setTimeout(() => {
                clearInterval(interval);
                this.renderResult(this.currentResult);
            }, 2400);
        }

        renderResult(res) {
            if (this.loadingSection) this.loadingSection.classList.add('hidden');
            if (this.resultSection) {
                this.resultSection.classList.remove('hidden');
                this.resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }

            // Play Victory Sound & Trigger Confetti Celebration
            this.playSound('win');
            if (typeof window.triggerCelebration === 'function') {
                window.triggerCelebration();
            }

            // Populate Result Fields
            const emojiEl = document.getElementById('result-emoji');
            const titleEl = document.getElementById('result-title');
            const badgeEl = document.getElementById('result-badge');
            const tagsEl = document.getElementById('result-tags');
            const summaryEl = document.getElementById('result-summary');
            const descEl = document.getElementById('result-description');
            const strengthsEl = document.getElementById('result-strengths');
            const cautionsEl = document.getElementById('result-cautions');
            const bestMatchEl = document.getElementById('result-best-match');
            const worstMatchEl = document.getElementById('result-worst-match');
            const toolRecommendEl = document.getElementById('result-tool-recommend');

            if (emojiEl) emojiEl.textContent = res.emoji || '✨';
            if (titleEl) titleEl.textContent = res.title;
            if (badgeEl) badgeEl.textContent = res.badge;

            if (tagsEl && Array.isArray(res.tags)) {
                tagsEl.innerHTML = res.tags.map(t => `<span class="px-3 py-1 rounded-full text-sm font-bold bg-sky-100 dark:bg-sky-900/60 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800">${t}</span>`).join('');
            }

            if (summaryEl) summaryEl.textContent = `"${res.summary}"`;
            if (descEl) descEl.innerHTML = res.description;

            if (strengthsEl && Array.isArray(res.strengths)) {
                strengthsEl.innerHTML = res.strengths.map(s => `<li class="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300"><span class="text-emerald-500 font-bold">✓</span><span>${s}</span></li>`).join('');
            }

            if (cautionsEl && Array.isArray(res.cautions)) {
                cautionsEl.innerHTML = res.cautions.map(c => `<li class="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300"><span class="text-amber-500 font-bold">!</span><span>${c}</span></li>`).join('');
            }

            if (bestMatchEl && res.bestMatch) {
                bestMatchEl.innerHTML = `
                    <div class="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50">
                        <div class="flex items-center gap-2 mb-1">
                            <span class="text-base">💖</span>
                            <span class="text-sm font-bold text-emerald-700 dark:text-emerald-400">환상의 케미</span>
                        </div>
                        <div class="font-bold text-sm text-slate-900 dark:text-white">${res.bestMatch.title}</div>
                        <p class="text-sm text-slate-600 dark:text-slate-400 mt-1">${res.bestMatch.reason}</p>
                    </div>
                `;
            }

            if (worstMatchEl && res.worstMatch) {
                worstMatchEl.innerHTML = `
                    <div class="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/50">
                        <div class="flex items-center gap-2 mb-1">
                            <span class="text-base">⚡</span>
                            <span class="text-sm font-bold text-rose-700 dark:text-rose-400">환장의 케미</span>
                        </div>
                        <div class="font-bold text-sm text-slate-900 dark:text-white">${res.worstMatch.title}</div>
                        <p class="text-sm text-slate-600 dark:text-slate-400 mt-1">${res.worstMatch.reason}</p>
                    </div>
                `;
            }

            if (toolRecommendEl && res.recommendTool) {
                toolRecommendEl.innerHTML = `
                    <a href="${res.recommendTool.url}" class="group flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-sky-50 to-indigo-50 dark:from-sky-950/40 dark:to-indigo-950/40 border border-sky-200 dark:border-sky-800/60 hover:shadow-md transition-all">
                        <div class="flex items-center gap-3">
                            <span class="material-symbols-outlined text-2xl text-primary">${res.recommendTool.icon || 'build'}</span>
                            <div>
                                <span class="text-sm font-bold text-primary block">추천 맞춤 도구</span>
                                <h4 class="text-sm font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">${res.recommendTool.name}</h4>
                                <p class="text-sm text-slate-600 dark:text-slate-400">${res.recommendTool.desc}</p>
                            </div>
                        </div>
                        <span class="material-symbols-outlined text-slate-400 group-hover:text-primary transition-transform group-hover:translate-x-1">arrow_forward</span>
                    </a>
                `;
            }
        }

        copyResultLink() {
            const url = window.location.href.split('?')[0];
            const textToCopy = `[${this.config.title}] 나의 결과: ${this.currentResult ? this.currentResult.title : ''}\n너도 지금 바로 테스트해봐!\n👉 ${url}`;

            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(textToCopy)
                    .then(() => this.showToast('결과 링크가 복사되었습니다! 친구에게 공유해보세요.'))
                    .catch(() => this.showToast('링크 복사 완료!'));
            } else {
                this.showToast('클립보드 접근 권한이 없습니다.');
            }
        }

        openToolBoxShareModal() {
            if (!this.currentResult) return false;
            if (window.ToolBoxShare) {
                const strengthsText = Array.isArray(this.currentResult.strengths)
                    ? this.currentResult.strengths.slice(0, 2).map(s => '• ' + s).join('\n')
                    : '';
                const matchText = this.currentResult.bestMatch ? `\n💖 환상 케미: ${this.currentResult.bestMatch.title}` : '';

                window.ToolBoxShare.openModal({
                    title: this.config.title,
                    subtitle: `${this.currentResult.badge || ''} · ${this.currentResult.title}`,
                    badge: this.currentResult.badge || '심리테스트 결과',
                    metrics: [
                        { label: '나의 캐릭터', value: this.currentResult.title, highlight: true },
                        { label: '환상 케미', value: this.currentResult.bestMatch ? this.currentResult.bestMatch.title.slice(0, 8) : '전체 원만', highlight: false }
                    ],
                    quote: `"${this.currentResult.summary}"\n\n[나의 핵심 성향 & 강점]\n${strengthsText}${matchText}`
                });
                return true;
            }
            return false;
        }

        shareNative() {
            if (this.openToolBoxShareModal()) return;

            const url = window.location.href.split('?')[0];
            const title = `[${this.config.title}] 나의 결과: ${this.currentResult ? this.currentResult.title : ''}`;
            const text = `${this.currentResult ? this.currentResult.summary : this.config.subtitle}\n\n지금 바로 확인해보세요!`;

            if (navigator.share) {
                navigator.share({
                    title: title,
                    text: text,
                    url: url
                }).catch(err => {
                    if (err.name !== 'AbortError') {
                        this.copyResultLink();
                    }
                });
            } else {
                this.copyResultLink();
            }
        }

        downloadResultImage() {
            if (this.openToolBoxShareModal()) return;

            if (!this.currentResult) return;
            this.showToast('인스타그램 공유용 결과 카드를 생성하는 중...');

            const canvas = document.createElement('canvas');
            canvas.width = 1080;
            canvas.height = 1350; // 4:5 Instagram feed / story standard
            const ctx = canvas.getContext('2d');

            // 1. Background Gradient
            const gradient = ctx.createLinearGradient(0, 0, 1080, 1350);
            gradient.addColorStop(0, '#0f172a'); // slate-900
            gradient.addColorStop(0.5, '#1e293b'); // slate-800
            gradient.addColorStop(1, '#0284c7'); // sky-600
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, 1080, 1350);

            // 2. Card Container (Frosted glass effect)
            ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
            ctx.lineWidth = 4;
            this.roundRect(ctx, 70, 70, 940, 1210, 48);
            ctx.fill();
            ctx.stroke();

            // 3. Header Branding
            ctx.fillStyle = '#38bdf8'; // sky-400
            ctx.font = 'bold 36px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('tossgpt.online · ToolBox Test', 540, 160);

            ctx.fillStyle = '#94a3b8'; // slate-400
            ctx.font = '28px sans-serif';
            ctx.fillText(this.config.title, 540, 210);

            // 4. Emoji Avatar Circle
            ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
            ctx.beginPath();
            ctx.arc(540, 360, 110, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#38bdf8';
            ctx.lineWidth = 6;
            ctx.stroke();

            ctx.font = '100px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(this.currentResult.emoji || '🎯', 540, 365);

            // 5. Badge
            ctx.textBaseline = 'alphabetic';
            ctx.fillStyle = '#38bdf8';
            ctx.font = 'bold 32px sans-serif';
            ctx.fillText(this.currentResult.badge || '', 540, 540);

            // 6. Result Title
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 54px sans-serif';
            ctx.fillText(this.currentResult.title, 540, 620);

            // 7. Tags
            if (Array.isArray(this.currentResult.tags)) {
                ctx.fillStyle = '#cbd5e1';
                ctx.font = '28px sans-serif';
                ctx.fillText(this.currentResult.tags.slice(0, 3).join('  '), 540, 680);
            }

            // 8. Quote / Summary Box
            ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
            this.roundRect(ctx, 130, 730, 820, 220, 28);
            ctx.fill();

            ctx.fillStyle = '#f8fafc';
            ctx.font = 'italic bold 32px sans-serif';
            this.wrapText(ctx, `"${this.currentResult.summary}"`, 540, 810, 740, 48);

            // 9. Match Pair Row
            if (this.currentResult.bestMatch && this.currentResult.worstMatch) {
                ctx.font = 'bold 26px sans-serif';
                ctx.fillStyle = '#34d399'; // emerald-400
                ctx.fillText(`💖 환상 케미: ${this.currentResult.bestMatch.title}`, 320, 1020);

                ctx.fillStyle = '#fb7185'; // rose-400
                ctx.fillText(`⚡ 환장 케미: ${this.currentResult.worstMatch.title}`, 760, 1020);
            }

            // 10. Footer CTA
            ctx.fillStyle = '#94a3b8';
            ctx.font = '26px sans-serif';
            ctx.fillText('나의 진짜 성향이 궁금하다면? 👉 tossgpt.online/tests/', 540, 1180);

            // Download trigger
            const link = document.createElement('a');
            link.download = `${this.config.id}-result.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        }

        roundRect(ctx, x, y, width, height, radius) {
            ctx.beginPath();
            ctx.moveTo(x + radius, y);
            ctx.lineTo(x + width - radius, y);
            ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
            ctx.lineTo(x + width, y + height - radius);
            ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
            ctx.lineTo(x + radius, y + height);
            ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
            ctx.lineTo(x, y + radius);
            ctx.quadraticCurveTo(x, y, x + radius, y);
            ctx.closePath();
        }

        wrapText(ctx, text, x, y, maxWidth, lineHeight) {
            const words = text.split(' ');
            let line = '';
            for (let n = 0; n < words.length; n++) {
                const testLine = line + words[n] + ' ';
                const metrics = ctx.measureText(testLine);
                const testWidth = metrics.width;
                if (testWidth > maxWidth && n > 0) {
                    ctx.fillText(line, x, y);
                    line = words[n] + ' ';
                    y += lineHeight;
                } else {
                    line = testLine;
                }
            }
            ctx.fillText(line, x, y);
        }

        showToast(msg) {
            let toast = document.getElementById('engine-toast');
            if (!toast) {
                toast = document.createElement('div');
                toast.id = 'engine-toast';
                toast.className = 'fixed bottom-8 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-xl bg-slate-900/90 text-white text-sm font-semibold shadow-2xl backdrop-blur-md border border-slate-700 transition-all duration-300 opacity-0 pointer-events-none';
                document.body.appendChild(toast);
            }
            toast.textContent = msg;
            toast.classList.remove('opacity-0', 'pointer-events-none');
            toast.classList.add('opacity-100');

            setTimeout(() => {
                toast.classList.remove('opacity-100');
                toast.classList.add('opacity-0', 'pointer-events-none');
            }, 2600);
        }
    }

    window.ViralTestEngine = ViralTestEngine;
})();
