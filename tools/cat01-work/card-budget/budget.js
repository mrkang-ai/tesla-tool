// 법카 한도 맞춤형 식대 조합기 알고리즘
document.addEventListener('DOMContentLoaded', () => {
    const budgetLimit = document.getElementById('budget-limit');
    const budgetPresets = document.querySelectorAll('.budget-preset');
    const menuThemeBtns = document.querySelectorAll('.menu-theme-btn');
    const menuPoolContainer = document.getElementById('menu-pool-container');
    const poolCount = document.getElementById('pool-count');
    const combosContainer = document.getElementById('combos-container');
    const calcBtn = document.getElementById('calc-btn');

    const customName = document.getElementById('custom-name');
    const customPrice = document.getElementById('custom-price');
    const addItemBtn = document.getElementById('add-item-btn');

    const themes = {
        chinese: [
            { name: '기본 짜장면', price: 7000, active: true },
            { name: '해물 짬뽕', price: 9000, active: true },
            { name: '미니 탕수육', price: 11000, active: true },
            { name: '군만두 (4개)', price: 3500, active: true },
            { name: '공기밥 추가', price: 1000, active: true },
            { name: '뚱캔 콜라', price: 2000, active: true },
            { name: '볶음밥 곱빼기', price: 9500, active: true }
        ],
        japanese: [
            { name: '등심 돈카츠', price: 9500, active: true },
            { name: '치즈 돈카츠', price: 11500, active: true },
            { name: '미니 우동', price: 3000, active: true },
            { name: '치킨 가라아게 (3pc)', price: 3500, active: true },
            { name: '카레 소스 추가', price: 2000, active: true },
            { name: '사이다', price: 2000, active: true }
        ],
        snack: [
            { name: '쌀떡볶이 1인분', price: 4500, active: true },
            { name: '모둠 튀김 (5개)', price: 4500, active: true },
            { name: '찰순대 (내장포함)', price: 5000, active: true },
            { name: '참치마요 김밥', price: 4500, active: true },
            { name: '부산 어묵 (2개)', price: 2000, active: true },
            { name: '치즈 라면', price: 4500, active: true }
        ],
        cafe: [
            { name: '아이스 아메리카노', price: 4500, active: true },
            { name: '바닐라 빈 라떼', price: 5800, active: true },
            { name: '버터 크루아상', price: 3800, active: true },
            { name: '클럽 샌드위치', price: 6500, active: true },
            { name: '바닐라 마카롱', price: 2800, active: true },
            { name: '초코칩 쿠키', price: 2000, active: true }
        ]
    };

    let currentItems = [...themes.chinese];

    function renderPool() {
        menuPoolContainer.innerHTML = '';
        poolCount.textContent = `${currentItems.filter(i => i.active).length}개 메뉴 활성`;

        currentItems.forEach((item, idx) => {
            const chip = document.createElement('div');
            chip.className = `px-3 py-1.5 rounded-xl border text-xs font-bold cursor-pointer transition-all flex items-center gap-1.5 ${
                item.active 
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700 hover:border-rose-400' 
                    : 'bg-slate-50 dark:bg-slate-900/50 text-slate-400 line-through border-slate-200 dark:border-slate-800'
            }`;
            chip.innerHTML = `<span>${item.name}</span> <span class="font-mono text-primary font-black">₩${item.price.toLocaleString()}</span>`;
            chip.addEventListener('click', () => {
                item.active = !item.active;
                renderPool();
                findBestCombos();
            });
            menuPoolContainer.appendChild(chip);
        });
    }

    function findBestCombos() {
        const budget = parseInt(budgetLimit.value) || 0;
        const activeItems = currentItems.filter(i => i.active && i.price <= budget);

        // Power-set or recursive combination search up to 4 items
        const results = [];

        function explore(startIdx, currentCombo, currentSum) {
            if (currentSum > budget) return;
            if (currentCombo.length > 0) {
                results.push({
                    items: [...currentCombo],
                    total: currentSum,
                    remaining: budget - currentSum
                });
            }
            if (currentCombo.length >= 4) return;

            for (let i = startIdx; i < activeItems.length; i++) {
                explore(i + 1, [...currentCombo, activeItems[i]], currentSum + activeItems[i].price);
            }
        }

        explore(0, [], 0);

        // Sort by minimum remaining balance (closest to 0), then by number of items
        results.sort((a, b) => a.remaining - b.remaining || b.items.length - a.items.length);

        // Unique top 3 combos
        const top3 = results.slice(0, 3);
        renderCombos(top3, budget);
    }

    function renderCombos(combos, budget) {
        combosContainer.innerHTML = '';
        if (combos.length === 0) {
            combosContainer.innerHTML = '<div class="p-6 text-center text-xs text-slate-400">설정하신 예산 한도 내에서 가능한 메뉴 조합이 없습니다. 한도를 늘리거나 저렴한 메뉴를 추가하세요.</div>';
            return;
        }

        combos.forEach((c, rank) => {
            const isZero = c.remaining === 0;
            const badgeClass = isZero ? 'bg-emerald-500 text-white' : 'bg-primary text-white';
            const cardBorder = isZero ? 'border-emerald-400 dark:border-emerald-600 bg-emerald-50/20' : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40';

            const card = document.createElement('div');
            card.className = `p-4 sm:p-5 rounded-2xl border ${cardBorder} flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all`;
            card.innerHTML = `
                <div class="flex items-start gap-3">
                    <div class="w-7 h-7 rounded-lg ${badgeClass} font-black text-xs flex items-center justify-center flex-shrink-0">
                        #${rank + 1}
                    </div>
                    <div>
                        <div class="flex flex-wrap items-center gap-1.5 mb-1">
                            ${c.items.map(it => `<span class="px-2.5 py-0.5 rounded-lg bg-white dark:bg-slate-800 text-xs font-bold border border-slate-200 dark:border-slate-700 shadow-sm">${it.name} (₩${it.price.toLocaleString()})</span>`).join('')}
                        </div>
                        <div class="text-xs text-slate-500">총 ${c.items.length}개 메뉴 선택</div>
                    </div>
                </div>

                <div class="flex sm:flex-col items-baseline sm:items-end justify-between w-full sm:w-auto border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-200">
                    <div class="text-sm font-black font-mono text-slate-900 dark:text-white">
                        ₩ ${c.total.toLocaleString()}
                    </div>
                    <div class="text-xs font-bold ${isZero ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500'}">
                        ${isZero ? '🎉 잔액 0원! (완벽한 법카 털기)' : `잔액: ₩ ${c.remaining.toLocaleString()} 남음`}
                    </div>
                </div>
            `;
            combosContainer.appendChild(card);
        });
    }

    budgetPresets.forEach(b => {
        b.addEventListener('click', () => {
            budgetLimit.value = b.getAttribute('data-val');
            findBestCombos();
        });
    });

    budgetLimit.addEventListener('input', findBestCombos);
    calcBtn.addEventListener('click', findBestCombos);

    menuThemeBtns.forEach(b => {
        b.addEventListener('click', () => {
            menuThemeBtns.forEach(btn => {
                btn.classList.remove('active', 'bg-primary', 'text-white');
                btn.classList.add('bg-slate-100', 'dark:bg-slate-800', 'text-slate-700', 'dark:text-slate-300');
            });
            b.classList.add('active', 'bg-primary', 'text-white');
            b.classList.remove('bg-slate-100', 'dark:bg-slate-800', 'text-slate-700', 'dark:text-slate-300');
            const themeKey = b.getAttribute('data-theme');
            currentItems = themes[themeKey].map(i => ({ ...i }));
            renderPool();
            findBestCombos();
        });
    });

    addItemBtn.addEventListener('click', () => {
        const name = customName.value.trim();
        const price = parseInt(customPrice.value);
        if (name && price > 0) {
            currentItems.push({ name, price, active: true });
            customName.value = '';
            customPrice.value = '';
            renderPool();
            findBestCombos();
        }
    });

    renderPool();
    findBestCombos();
});
