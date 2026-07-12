const recommendBtn = document.getElementById('recommend-btn');
const loadingAnimation = document.getElementById('loading-animation');
const imageSpinner = document.getElementById('image-spinner');
const resultDiv = document.getElementById('result');
const resultImage = document.getElementById('result-image');
const resultCategory = document.getElementById('result-category');
const resultName = document.getElementById('result-name');
const resultDescription = document.getElementById('result-description');

const selectDay = document.getElementById('select-day');
const selectMeal = document.getElementById('select-meal');
const addToPlannerBtn = document.getElementById('add-to-planner-btn');
const autoFillBtn = document.getElementById('auto-fill-btn');
const clearPlannerBtn = document.getElementById('clear-planner-btn');
const plannerGrid = document.getElementById('planner-grid');
const plannerToggleBtn = document.getElementById('planner-toggle-btn');
const plannerContent = document.getElementById('planner-content');
const plannerChevron = document.getElementById('planner-chevron');
const plannerSection = document.getElementById('planner-section');

// 식단표 데이터 상태 관리 (기본값)
let plannerState = {
    mon: { lunch: null, dinner: null },
    tue: { lunch: null, dinner: null },
    wed: { lunch: null, dinner: null },
    thu: { lunch: null, dinner: null },
    fri: { lunch: null, dinner: null },
    sat: { lunch: null, dinner: null },
    sun: { lunch: null, dinner: null }
};

// 최근 추천된 메뉴 데이터 임시 보관
let lastRecommendedMenu = null;

// 순서 교체를 위해 선택한 슬롯 정보 보관
let selectedSwapSlot = null; // { day, meal, element }

// 다국어 번역 리소스
const dayLabels = {
    ko: {
        mon: "월요일", tue: "화요일", wed: "수요일", thu: "목요일", fri: "금요일", sat: "토요일", sun: "일요일",
        lunch: "☀️ 점심", dinner: "🌙 저녁",
        empty: "비어 있음",
        addTip: "메뉴를 추가하세요"
    },
    en: {
        mon: "Monday", tue: "Tuesday", wed: "Wednesday", thu: "Thursday", fri: "Friday", sat: "Saturday", sun: "Sunday",
        lunch: "☀️ Lunch", dinner: "🌙 Dinner",
        empty: "Empty",
        addTip: "Add a menu"
    }
};

// 이미지 경로 매핑 함수
function getImageUrl(itemName) {
    return `images/${itemName}.webp`;
}

// 로컬 스토리지에 식단 저장
function savePlannerState() {
    localStorage.setItem('eat_planner_state', JSON.stringify(plannerState));
}

// 로컬 스토리지에서 식단 불러오기
function loadPlannerState() {
    const saved = localStorage.getItem('eat_planner_state');
    if (saved) {
        try {
            plannerState = JSON.parse(saved);
        } catch (e) {
            console.error("Failed to parse plannerState from localStorage", e);
        }
    }
}

// 추천 이벤트 리스너
if (recommendBtn) {
    recommendBtn.addEventListener('click', () => {
        resultDiv.classList.add('hidden');
        loadingAnimation.classList.remove('hidden');

        const lang = document.documentElement.lang || 'ko';

        let imageChangeInterval = setInterval(() => {
            const randomMenuItem = menuData[Math.floor(Math.random() * menuData.length)];
            const imageUrl = getImageUrl(randomMenuItem.name_ko);
            imageSpinner.style.backgroundImage = `url('${imageUrl}')`;
        }, 100);

        setTimeout(() => {
            clearInterval(imageChangeInterval);

            const randomMenuItem = menuData[Math.floor(Math.random() * menuData.length)];
            lastRecommendedMenu = randomMenuItem;

            const imageUrl = getImageUrl(randomMenuItem.name_ko);
            resultImage.src = imageUrl;
            
            // 카테고리 텍스트 설정
            resultCategory.textContent = lang === 'en' ? randomMenuItem.category_en : randomMenuItem.category_ko;

            if (lang === 'en') {
                resultName.textContent = randomMenuItem.name_en;
                resultDescription.textContent = randomMenuItem.description_en;
            } else {
                resultName.textContent = randomMenuItem.name_ko;
                resultDescription.textContent = randomMenuItem.description_ko;
            }

            loadingAnimation.classList.add('hidden');
            resultDiv.classList.remove('hidden');

            // 추천을 받은 후 식단표를 노출하도록 함
            if (plannerSection && plannerSection.classList.contains('hidden')) {
                plannerSection.classList.remove('hidden');
            }
        }, 1500); // 1.5초 후 추천 결과 노출
    });
}

// 추천 메뉴 식단표에 직접 추가 버튼 이벤트 리스너
if (addToPlannerBtn) {
    addToPlannerBtn.addEventListener('click', () => {
        if (!lastRecommendedMenu) return;
        const day = selectDay.value;
        const meal = selectMeal.value;
        
        plannerState[day][meal] = {
            name_ko: lastRecommendedMenu.name_ko,
            name_en: lastRecommendedMenu.name_en,
            category_ko: lastRecommendedMenu.category_ko,
            category_en: lastRecommendedMenu.category_en
        };
        
        savePlannerState();
        const currentLang = localStorage.getItem('language') || 'ko';
        renderPlanner(currentLang);
        
        // 추가 완료 피드백을 위해 버튼 색상 잠깐 녹색 전환
        const originalBg = addToPlannerBtn.className;
        addToPlannerBtn.className = addToPlannerBtn.className.replace('bg-emerald-500', 'bg-teal-600');
        setTimeout(() => {
            addToPlannerBtn.className = originalBg;
        }, 500);

        // 식단표가 접혀있는 경우 자동으로 펼침
        if (plannerContent && plannerContent.classList.contains('hidden')) {
            plannerContent.classList.remove('hidden');
            if (plannerChevron) {
                plannerChevron.classList.add('rotate-180');
            }
        }
    });
}

// 식단표 카드 랜더링 함수
function renderPlanner(lang) {
    if (!plannerGrid) return;
    plannerGrid.innerHTML = '';

    const days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
    
    days.forEach(day => {
        const dayCol = document.createElement('div');
        dayCol.className = 'flex flex-col gap-3 bg-slate-50/50 dark:bg-slate-900/20 p-3 rounded-2xl border border-slate-100 dark:border-slate-800/60 transition-all duration-300';
        
        // 요일 헤더 생성
        const dayHeader = document.createElement('div');
        dayHeader.className = 'text-center font-bold text-sm py-1.5 rounded-lg mb-1 select-none shadow-sm';
        if (day === 'sun') {
            dayHeader.className += ' bg-rose-50 text-rose-600 dark:bg-rose-950/20 dark:text-rose-400';
        } else if (day === 'sat') {
            dayHeader.className += ' bg-amber-50 text-amber-600 dark:bg-amber-950/20 dark:text-amber-400';
        } else {
            dayHeader.className += ' bg-sky-50 text-sky-700 dark:bg-sky-950/20 dark:text-sky-400';
        }
        dayHeader.textContent = dayLabels[lang][day];
        dayCol.appendChild(dayHeader);

        // 점심 및 저녁 슬롯 생성
        ['lunch', 'dinner'].forEach(meal => {
            const mealItem = plannerState[day][meal];
            const slotCard = document.createElement('div');
            
            // Drag and Drop 속성 바인딩
            slotCard.setAttribute('draggable', mealItem ? 'true' : 'false');
            slotCard.setAttribute('data-day', day);
            slotCard.setAttribute('data-meal', meal);

            // 기본 공통 스타일
            slotCard.className = 'relative flex flex-col p-3 rounded-xl border transition-all duration-300 select-none cursor-pointer';

            // 슬롯 카드 내용 드로잉
            if (mealItem) {
                // 채워진 식단 카드 스타일
                slotCard.className += ' bg-white dark:bg-slate-800/80 border-slate-200/80 dark:border-slate-700 shadow-sm hover:shadow-md hover:-translate-y-0.5';
                
                // 이미지 썸네일 경로
                const imageUrl = getImageUrl(mealItem.name_ko);
                
                slotCard.innerHTML = `
                    <div class="flex items-center gap-2.5">
                        <img src="${imageUrl}" alt="${mealItem.name_ko}" class="w-12 h-12 object-cover rounded-lg border border-slate-100 dark:border-slate-700 pointer-events-none flex-shrink-0">
                        <div class="min-w-0 flex-1">
                            <span class="text-[9px] font-bold text-text-muted/70 dark:text-slate-500 uppercase tracking-wide">${dayLabels[lang][meal]}</span>
                            <h4 class="text-sm font-extrabold text-text-main dark:text-white truncate mt-0.5">${lang === 'en' ? mealItem.name_en : mealItem.name_ko}</h4>
                        </div>
                    </div>
                    <button class="delete-slot-btn absolute top-1.5 right-1.5 w-5 h-5 flex items-center justify-center rounded-full bg-slate-100/60 dark:bg-slate-700/60 hover:bg-red-500 hover:text-white dark:hover:bg-red-600 text-text-muted dark:text-slate-400 text-xs transition-colors" title="Delete">
                        <span class="material-symbols-outlined text-xs">close</span>
                    </button>
                `;

                // 개별 슬롯 삭제 리스너
                slotCard.querySelector('.delete-slot-btn').addEventListener('click', (e) => {
                    e.stopPropagation(); // 카드 선택 스왑 이벤트 발생 방지
                    plannerState[day][meal] = null;
                    savePlannerState();
                    renderPlanner(lang);
                });
            } else {
                // 비어 있는 슬롯 카드 스타일
                slotCard.className += ' bg-dashed bg-slate-50/20 dark:bg-slate-900/10 border-dashed border-slate-200 dark:border-slate-800 hover:border-primary/50 text-center py-5 justify-center items-center gap-1 hover:bg-sky-50/10';
                slotCard.innerHTML = `
                    <span class="material-symbols-outlined text-text-muted/40 dark:text-slate-600 text-lg">add_circle</span>
                    <div class="flex flex-col">
                        <span class="text-[9px] font-bold text-text-muted/60 dark:text-slate-500 uppercase">${dayLabels[lang][meal]}</span>
                        <span class="text-[10px] text-text-muted/50 dark:text-slate-600 font-medium">${dayLabels[lang].empty}</span>
                    </div>
                `;
            }

            // 스왑 선택 상태 복원 표시
            if (selectedSwapSlot && selectedSwapSlot.day === day && selectedSwapSlot.meal === meal) {
                slotCard.classList.add('ring-2', 'ring-primary', 'bg-primary/5', 'dark:bg-primary/10');
            }

            // --- 탭 스왑(Click-to-Swap) 이벤트 핸들러 ---
            slotCard.addEventListener('click', () => {
                if (!selectedSwapSlot) {
                    // 첫 번째 슬롯 선택
                    selectedSwapSlot = { day, meal, element: slotCard };
                    slotCard.classList.add('ring-2', 'ring-primary', 'bg-primary/5', 'dark:bg-primary/10');
                } else {
                    // 두 번째 슬롯 선택
                    const first = selectedSwapSlot;
                    
                    if (first.day === day && first.meal === meal) {
                        // 같은 슬롯 선택 시 취소
                        slotCard.classList.remove('ring-2', 'ring-primary', 'bg-primary/5', 'dark:bg-primary/10');
                        selectedSwapSlot = null;
                    } else {
                        // 다른 슬롯 선택 시 데이터 스왑
                        const temp = plannerState[first.day][first.meal];
                        plannerState[first.day][first.meal] = plannerState[day][meal];
                        plannerState[day][meal] = temp;
                        
                        savePlannerState();
                        selectedSwapSlot = null;
                        renderPlanner(lang);
                    }
                }
            });

            // --- Drag and Drop API 이벤트 바인딩 (PC) ---
            slotCard.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', JSON.stringify({ day, meal }));
                slotCard.classList.add('opacity-50');
            });

            slotCard.addEventListener('dragend', () => {
                slotCard.classList.remove('opacity-50');
            });

            slotCard.addEventListener('dragover', (e) => {
                e.preventDefault();
                slotCard.classList.add('border-primary', 'bg-sky-50/20', 'dark:bg-sky-950/20');
            });

            slotCard.addEventListener('dragleave', () => {
                slotCard.classList.remove('border-primary', 'bg-sky-50/20', 'dark:bg-sky-950/20');
            });

            slotCard.addEventListener('drop', (e) => {
                e.preventDefault();
                slotCard.classList.remove('border-primary', 'bg-sky-50/20', 'dark:bg-sky-950/20');
                
                try {
                    const dragSource = JSON.parse(e.dataTransfer.getData('text/plain'));
                    if (dragSource.day === day && dragSource.meal === meal) return;

                    const temp = plannerState[dragSource.day][dragSource.meal];
                    plannerState[dragSource.day][dragSource.meal] = plannerState[day][meal];
                    plannerState[day][meal] = temp;
                    
                    savePlannerState();
                    renderPlanner(lang);
                } catch (err) {
                    console.error("Error swapping slots via drag and drop", err);
                }
            });

            dayCol.appendChild(slotCard);
        });

        plannerGrid.appendChild(dayCol);
    });
}

// 식단 전체 자동 구성 버튼 리스너
if (autoFillBtn) {
    autoFillBtn.addEventListener('click', () => {
        const days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
        
        days.forEach(day => {
            ['lunch', 'dinner'].forEach(meal => {
                const randomItem = menuData[Math.floor(Math.random() * menuData.length)];
                plannerState[day][meal] = {
                    name_ko: randomItem.name_ko,
                    name_en: randomItem.name_en,
                    category_ko: randomItem.category_ko,
                    category_en: randomItem.category_en
                };
            });
        });

        savePlannerState();
        const currentLang = localStorage.getItem('language') || 'ko';
        renderPlanner(currentLang);
    });
}

// 식단 전체 초기화 버튼 리스너
if (clearPlannerBtn) {
    clearPlannerBtn.addEventListener('click', () => {
        const days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
        
        days.forEach(day => {
            plannerState[day]['lunch'] = null;
            plannerState[day]['dinner'] = null;
        });

        savePlannerState();
        const currentLang = localStorage.getItem('language') || 'ko';
        renderPlanner(currentLang);
    });
}

// 텍스트 파일 (.txt) 다운로드 기능
function downloadTxt() {
    const lang = document.documentElement.lang || 'ko';
    let text = lang === 'en' ? "=== MY WEEKLY MEAL PLAN ===\n\n" : "=== 나의 일주일 식단표 ===\n\n";
    const days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
    
    days.forEach(day => {
        const dayLabel = dayLabels[lang][day];
        const lunchMenu = plannerState[day]['lunch'];
        const dinnerMenu = plannerState[day]['dinner'];
        
        const lunchStr = lunchMenu ? (lang === 'en' ? `${lunchMenu.name_en} (${lunchMenu.category_en})` : `${lunchMenu.name_ko} (${lunchMenu.category_ko})`) : (lang === 'en' ? "Empty" : "비어 있음");
        const dinnerStr = dinnerMenu ? (lang === 'en' ? `${dinnerMenu.name_en} (${dinnerMenu.category_en})` : `${dinnerMenu.name_ko} (${dinnerMenu.category_ko})`) : (lang === 'en' ? "Empty" : "비어 있음");
        
        text += `${dayLabel}:\n`;
        text += `  - ${dayLabels[lang]['lunch']}: ${lunchStr}\n`;
        text += `  - ${dayLabels[lang]['dinner']}: ${dinnerStr}\n\n`;
    });
    
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = lang === 'en' ? 'weekly_meal_plan.txt' : 'weekly_planner.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// 이미지 파일 (.png) 다운로드 기능 (HTML5 Canvas 빌드)
function downloadPng() {
    const lang = document.documentElement.lang || 'ko';
    const canvas = document.createElement('canvas');
    canvas.width = 1000;
    canvas.height = 800;
    const ctx = canvas.getContext('2d');

    // 1. 배경 그라데이션
    const grad = ctx.createLinearGradient(0, 0, 1000, 800);
    grad.addColorStop(0, '#f0f9ff');
    grad.addColorStop(1, '#e0f2fe');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1000, 800);

    // 2. 메인 카드 박스
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = 'rgba(14, 165, 233, 0.15)';
    ctx.shadowBlur = 30;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 10;
    
    function drawRoundedRect(x, y, w, h, r) {
        ctx.beginPath();
        ctx.moveTo(x+r, y);
        ctx.arcTo(x+w, y, x+w, y+h, r);
        ctx.arcTo(x+w, y+h, x, y+h, r);
        ctx.arcTo(x, y+h, x, y, r);
        ctx.arcTo(x, y, x+w, y, r);
        ctx.closePath();
        ctx.fill();
    }
    drawRoundedRect(50, 50, 900, 700, 24);

    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;

    // 3. 타이틀 텍스트
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 32px sans-serif';
    ctx.textAlign = 'center';
    const title = lang === 'en' ? 'My Weekly Meal Planner' : '나의 일주일 식단표';
    ctx.fillText(title, 500, 110);

    ctx.fillStyle = '#64748b';
    ctx.font = '16px sans-serif';
    const subtitle = lang === 'en' ? 'Online Toolkit - tossgpt.online' : '온라인 도구모음 - tossgpt.online';
    ctx.fillText(subtitle, 500, 140);

    // 4. 테이블 헤더 렌더링
    const colWidths = [180, 330, 330];
    const startX = 80;
    const startY = 180;
    const rowHeight = 70;

    ctx.fillStyle = '#0ea5e9';
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.arcTo(startX + 840, startY, startX + 840, startY + rowHeight, 12);
    ctx.arcTo(startX + 840, startY + rowHeight, startX, startY + rowHeight, 0);
    ctx.arcTo(startX, startY + rowHeight, startX, startY, 0);
    ctx.arcTo(startX, startY, startX + 840, startY, 12);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 18px sans-serif';
    ctx.textAlign = 'left';
    
    ctx.fillText(lang === 'en' ? 'Day of the Week' : '요일', startX + 20, startY + 42);
    ctx.fillText(dayLabels[lang]['lunch'].replace(/^[^\s]+\s+/, ''), startX + colWidths[0] + 20, startY + 42);
    ctx.fillText(dayLabels[lang]['dinner'].replace(/^[^\s]+\s+/, ''), startX + colWidths[0] + colWidths[1] + 20, startY + 42);

    // 5. 요일별 리스트 렌더링
    const days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

    days.forEach((day, index) => {
        const y = startY + rowHeight + (index * rowHeight);

        ctx.fillStyle = index % 2 === 0 ? '#f8fafc' : '#ffffff';
        
        if (index === 6) {
            ctx.beginPath();
            ctx.moveTo(startX, y);
            ctx.lineTo(startX + 840, y);
            ctx.arcTo(startX + 840, y + rowHeight, startX, y + rowHeight, 12);
            ctx.arcTo(startX, y + rowHeight, startX, y, 12);
            ctx.closePath();
            ctx.fill();
        } else {
            ctx.fillRect(startX, y, 840, rowHeight);
        }

        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(startX, y);
        ctx.lineTo(startX + 840, y);
        ctx.stroke();

        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 16px sans-serif';
        ctx.fillText(dayLabels[lang][day], startX + 20, y + 42);

        ['lunch', 'dinner'].forEach((meal, mIdx) => {
            const menu = plannerState[day][meal];
            const x = startX + colWidths[0] + (mIdx * colWidths[1]) + 20;

            if (menu) {
                const menuName = lang === 'en' ? menu.name_en : menu.name_ko;
                const category = lang === 'en' ? menu.category_en : menu.category_ko;
                
                // 태그 배경 그리기
                ctx.fillStyle = '#e0f2fe';
                ctx.beginPath();
                ctx.arc(x + 15, y + 36, 12, Math.PI/2, 3*Math.PI/2);
                ctx.lineTo(x + 65, y + 24);
                ctx.arc(x + 65, y + 36, 12, 3*Math.PI/2, Math.PI/2);
                ctx.lineTo(x + 15, y + 48);
                ctx.closePath();
                ctx.fill();
                
                ctx.fillStyle = '#0369a1';
                ctx.font = 'bold 11px sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText(category.slice(0, 3), x + 40, y + 40);

                ctx.fillStyle = '#1e293b';
                ctx.font = 'bold 15px sans-serif';
                ctx.textAlign = 'left';
                ctx.fillText(menuName, x + 85, y + 41);
            } else {
                ctx.fillStyle = '#94a3b8';
                ctx.font = 'italic 14px sans-serif';
                ctx.textAlign = 'left';
                ctx.fillText(dayLabels[lang]['empty'], x, y + 41);
            }
        });
    });

    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = lang === 'en' ? 'weekly_meal_plan.png' : 'weekly_planner.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

// 다국어 언어 변경 Hooking 처리
function hookApplyLanguage() {
    if (typeof window.applyLanguage === 'function') {
        const originalApplyLanguage = window.applyLanguage;
        window.applyLanguage = function(lang, isInitialLoad) {
            originalApplyLanguage(lang, isInitialLoad);
            renderPlanner(lang);
        };
    } else {
        setTimeout(hookApplyLanguage, 50);
    }
}

// 페이지 로드 시 시작
document.addEventListener('DOMContentLoaded', () => {
    loadPlannerState();
    const currentLang = localStorage.getItem('language') || 'ko';
    renderPlanner(currentLang);
    hookApplyLanguage();

    // 식단표 토글 버튼 리스너 바인딩
    if (plannerToggleBtn && plannerContent && plannerChevron) {
        plannerToggleBtn.addEventListener('click', () => {
            const isCollapsed = plannerContent.classList.contains('hidden');
            if (isCollapsed) {
                plannerContent.classList.remove('hidden');
                plannerChevron.classList.add('rotate-180');
            } else {
                plannerContent.classList.add('hidden');
                plannerChevron.classList.remove('rotate-180');
            }
        });
    }

    // 다운로드 버튼 이벤트 리스너 바인딩
    const downloadTxtBtn = document.getElementById('download-txt-btn');
    const downloadPngBtn = document.getElementById('download-png-btn');
    if (downloadTxtBtn) downloadTxtBtn.addEventListener('click', downloadTxt);
    if (downloadPngBtn) downloadPngBtn.addEventListener('click', downloadPng);
});
