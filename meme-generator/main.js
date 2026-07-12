/**
 * Meme Generator - Core Editor Script
 * Supporting multi-template selections, draggable text & overlay images, resizable controls,
 * custom backgrounds, text styling, and canvas download.
 */

document.addEventListener("DOMContentLoaded", () => {
    // ----------------------------------------------------
    // 1. STATE & TEMPLATES DEFINITION
    // ----------------------------------------------------
    const canvas = document.getElementById("meme-canvas");
    const ctx = canvas.getContext("2d");

    let currentTemplateId = "uncle-drake";
    let bgImage = new Image();
    
    // Arrays to hold layers
    let textFields = [];
    let overlays = [];
    
    // Selection state
    let selectedItem = null; // References an object in textFields or overlays
    let dragMode = null; // 'drag', 'resize', or null
    let dragStartX = 0;
    let dragStartY = 0;
    let dragStartItemX = 0;
    let dragStartItemY = 0;
    let dragStartItemWidth = 0;
    let dragStartItemHeight = 0;

    // Default template configurations
    const templates = {
        "uncle-drake": {
            bgUrl: "./templates/uncle-drake.png",
            defaults: [
                {
                    text: "월요일 아침\n출근길 😩",
                    xPercent: 0.74,
                    yPercent: 0.23,
                    widthPercent: 0.35,
                    heightPercent: 0.25,
                    fontSize: 24,
                    fontFamily: "Arial",
                    color: "#000000",
                    strokeColor: "transparent",
                    strokeWidth: 0,
                    align: "center",
                    rotation: 0,
                    isCaps: false,
                    opacity: 1,
                    isText: true
                },
                {
                    text: "금요일 퇴근\n10분 전! 😄",
                    xPercent: 0.74,
                    yPercent: 0.73,
                    widthPercent: 0.35,
                    heightPercent: 0.25,
                    fontSize: 24,
                    fontFamily: "Arial",
                    color: "#000000",
                    strokeColor: "transparent",
                    strokeWidth: 0,
                    align: "center",
                    rotation: 0,
                    isCaps: false,
                    opacity: 1,
                    isText: true
                }
            ]
        },
        "denim-drake": {
            bgUrl: "./templates/denim-drake.png",
            defaults: [
                {
                    text: "야근하며\n코딩 공부하기 🙅‍♂️",
                    xPercent: 0.73,
                    yPercent: 0.22,
                    widthPercent: 0.35,
                    heightPercent: 0.25,
                    fontSize: 24,
                    fontFamily: "Arial",
                    color: "#000000",
                    strokeColor: "transparent",
                    strokeWidth: 0,
                    align: "center",
                    rotation: 0,
                    isCaps: false,
                    opacity: 1,
                    isText: true
                },
                {
                    text: "칼퇴하고\n맛있는 닭갈비 먹기 🙆‍♂️",
                    xPercent: 0.73,
                    yPercent: 0.72,
                    widthPercent: 0.35,
                    heightPercent: 0.25,
                    fontSize: 24,
                    fontFamily: "Arial",
                    color: "#000000",
                    strokeColor: "transparent",
                    strokeWidth: 0,
                    align: "center",
                    rotation: 0,
                    isCaps: false,
                    opacity: 1,
                    isText: true
                }
            ]
        },
        "rocket-launch": {
            bgUrl: "./templates/rocket-launch.png",
            defaults: [
                {
                    text: "로컬에서\n완벽 작동하는 버그 🚀",
                    xPercent: 0.76,
                    yPercent: 0.23,
                    widthPercent: 0.35,
                    heightPercent: 0.25,
                    fontSize: 22,
                    fontFamily: "Arial",
                    color: "#000000",
                    strokeColor: "transparent",
                    strokeWidth: 0,
                    align: "center",
                    rotation: 0,
                    isCaps: false,
                    opacity: 1,
                    isText: true
                },
                {
                    text: "프로덕션 배포 후\n실행이 안 됨 💥",
                    xPercent: 0.76,
                    yPercent: 0.73,
                    widthPercent: 0.35,
                    heightPercent: 0.25,
                    fontSize: 22,
                    fontFamily: "Arial",
                    color: "#000000",
                    strokeColor: "transparent",
                    strokeWidth: 0,
                    align: "center",
                    rotation: 0,
                    isCaps: false,
                    opacity: 1,
                    isText: true
                }
            ]
        },
        "tea-grandpa": {
            bgUrl: "./templates/tea-grandpa.png",
            defaults: [
                {
                    text: "인생은 쓴맛 단맛\n다 맛보고\n즐기는 것이란다 🍵",
                    xPercent: 0.73,
                    yPercent: 0.30,
                    widthPercent: 0.40,
                    heightPercent: 0.30,
                    fontSize: 24,
                    fontFamily: "Arial",
                    color: "#000000",
                    strokeColor: "transparent",
                    strokeWidth: 0,
                    align: "center",
                    rotation: 0,
                    isCaps: false,
                    opacity: 1,
                    isText: true
                }
            ]
        },
        "two-buttons": {
            bgUrl: "./templates/two-buttons.png",
            defaults: [
                {
                    text: "치킨 먹기",
                    xPercent: 0.29,
                    yPercent: 0.12,
                    widthPercent: 0.28,
                    heightPercent: 0.08,
                    fontSize: 16,
                    fontFamily: "Arial",
                    color: "#000000",
                    strokeColor: "transparent",
                    strokeWidth: 0,
                    align: "center",
                    rotation: 0,
                    isCaps: false,
                    opacity: 1,
                    isText: true
                },
                {
                    text: "다이어트 하기",
                    xPercent: 0.69,
                    yPercent: 0.12,
                    widthPercent: 0.28,
                    heightPercent: 0.08,
                    fontSize: 16,
                    fontFamily: "Arial",
                    color: "#000000",
                    strokeColor: "transparent",
                    strokeWidth: 0,
                    align: "center",
                    rotation: 0,
                    isCaps: false,
                    opacity: 1,
                    isText: true
                },
                {
                    text: "치킨은 단백질이니까\n괜찮겠지... 🤔",
                    xPercent: 0.70,
                    yPercent: 0.67,
                    widthPercent: 0.35,
                    heightPercent: 0.25,
                    fontSize: 20,
                    fontFamily: "Arial",
                    color: "#000000",
                    strokeColor: "transparent",
                    strokeWidth: 0,
                    align: "center",
                    rotation: 0,
                    isCaps: false,
                    opacity: 1,
                    isText: true
                }
            ]
        }
    };

    // ----------------------------------------------------
    // 2. INITIALIZATION & IMAGE LOADING
    // ----------------------------------------------------
    function initTemplate(templateId) {
        currentTemplateId = templateId;
        const config = templates[templateId];
        removeInlineEditor(); // Clean up active inline editor
        
        bgImage.onload = () => {
            // Set canvas size (keep original aspect ratio, max width 800)
            const maxWidth = 800;
            let width = bgImage.naturalWidth || 600;
            let height = bgImage.naturalHeight || 600;
            
            if (width > maxWidth) {
                const ratio = maxWidth / width;
                width = maxWidth;
                height = height * ratio;
            }
            
            canvas.width = width;
            canvas.height = height;
            
            // Map percentage-based positions to absolute pixels
            textFields = config.defaults.map((def, idx) => ({
                id: `txt_${idx}_${Date.now()}`,
                text: def.text,
                x: def.xPercent * width,
                y: def.yPercent * height,
                width: def.widthPercent * width,
                height: def.heightPercent * height,
                fontSize: def.fontSize,
                fontFamily: def.fontFamily,
                color: def.color,
                strokeColor: def.strokeColor,
                strokeWidth: def.strokeWidth,
                align: def.align,
                rotation: def.rotation,
                isCaps: def.isCaps,
                opacity: def.opacity,
                isText: true
            }));
            
            // Keep existing overlay images, but reposition them to keep them in canvas
            overlays.forEach(overlay => {
                if (overlay.x + overlay.width / 2 > width) overlay.x = width / 2;
                if (overlay.y + overlay.height / 2 > height) overlay.y = height / 2;
            });
            
            selectedItem = null;
            hideStylePanel();
            render();
            updateSidebarTextInputs();
        };
        bgImage.src = config.bgUrl;
    }

    // Set active thumb style
    function updateTemplateThumbs(activeId) {
        document.querySelectorAll(".template-thumb").forEach(thumb => {
            if (thumb.getAttribute("data-template") === activeId) {
                thumb.classList.add("border-primary", "border-2");
                thumb.classList.remove("border-slate-200", "dark:border-slate-700");
            } else {
                thumb.classList.remove("border-primary", "border-2");
                thumb.classList.add("border-slate-200", "dark:border-slate-700");
            }
        });
    }

    // Initialize with first template
    initTemplate("uncle-drake");

    // ----------------------------------------------------
    // 3. CANVAS RENDERING ENGINE
    // ----------------------------------------------------
    function render() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw background
        ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
        
        // Draw overlays
        overlays.forEach(item => {
            ctx.save();
            ctx.globalAlpha = item.opacity;
            ctx.translate(item.x, item.y);
            ctx.rotate(item.rotation);
            ctx.drawImage(item.img, -item.width / 2, -item.height / 2, item.width, item.height);
            ctx.restore();
        });
        
        // Draw text fields
        textFields.forEach(item => {
            if (item.isEditing) return; // Skip drawing text on canvas while editing inline
            ctx.save();
            ctx.globalAlpha = item.opacity;
            ctx.translate(item.x, item.y);
            ctx.rotate(item.rotation);
            
            // Draw text
            drawWrappedText(item);
            
            ctx.restore();
        });
        
        // Draw selection boundaries & handles (only when editing)
        if (selectedItem) {
            ctx.save();
            ctx.translate(selectedItem.x, selectedItem.y);
            ctx.rotate(selectedItem.rotation);
            
            // Draw dashed selection rectangle
            ctx.strokeStyle = "#0ea5e9";
            ctx.lineWidth = 2;
            ctx.setLineDash([6, 4]);
            ctx.strokeRect(-selectedItem.width / 2, -selectedItem.height / 2, selectedItem.width, selectedItem.height);
            
            // Draw resize handle (bottom-right corner)
            ctx.fillStyle = "#0ea5e9";
            ctx.setLineDash([]);
            ctx.fillRect(selectedItem.width / 2 - 6, selectedItem.height / 2 - 6, 12, 12);
            ctx.strokeStyle = "#ffffff";
            ctx.lineWidth = 1.5;
            ctx.strokeRect(selectedItem.width / 2 - 6, selectedItem.height / 2 - 6, 12, 12);
            
            ctx.restore();
        }
    }

    // Render multi-line text aligned inside bounded box
    function drawWrappedText(item) {
        const textToDraw = item.isCaps ? item.text.toUpperCase() : item.text;
        const lines = textToDraw.split("\n");
        const fontStyle = `${item.fontSize}px "${item.fontFamily}", sans-serif`;
        ctx.font = fontStyle;
        ctx.textBaseline = "middle";
        
        // Gather wrapped sub-lines
        let allLines = [];
        lines.forEach(line => {
            const words = line.split(" ");
            let currentLine = "";
            
            for (let i = 0; i < words.length; i++) {
                let testLine = currentLine + (currentLine ? " " : "") + words[i];
                let metrics = ctx.measureText(testLine);
                
                if (metrics.width > item.width && currentLine !== "") {
                    allLines.push(currentLine);
                    currentLine = words[i];
                } else {
                    currentLine = testLine;
                }
            }
            if (currentLine) {
                allLines.push(currentLine);
            }
        });
        
        // Calculate vertical spacing
        const lineHeight = item.fontSize * 1.25;
        const totalHeight = allLines.length * lineHeight;
        let startY = -totalHeight / 2 + lineHeight / 2;
        
        allLines.forEach(line => {
            let startX = 0;
            if (item.align === "left") {
                startX = -item.width / 2;
                ctx.textAlign = "left";
            } else if (item.align === "right") {
                startX = item.width / 2;
                ctx.textAlign = "right";
            } else {
                startX = 0;
                ctx.textAlign = "center";
            }
            
            // Text stroke outline
            if (item.strokeColor && item.strokeColor !== "transparent" && item.strokeWidth > 0) {
                ctx.strokeStyle = item.strokeColor;
                ctx.lineWidth = item.strokeWidth;
                ctx.lineJoin = "round";
                ctx.strokeText(line, startX, startY);
            }
            
            // Text fill
            ctx.fillStyle = item.color;
            ctx.fillText(line, startX, startY);
            
            startY += lineHeight;
        });
    }

    // ----------------------------------------------------
    // 4. HIT TESTING ENGINE (INVERSE MATRIX TRANSFORM)
    // ----------------------------------------------------
    function hitTest(x, y) {
        // 1. Check resize handle of selected item first (top-most priority)
        if (selectedItem) {
            // Get local position of click relative to selected item center
            const local = getLocalCoords(x, y, selectedItem.x, selectedItem.y, selectedItem.rotation);
            // Resize handle is centered at (width/2, height/2) in local space
            const handleX = selectedItem.width / 2;
            const handleY = selectedItem.height / 2;
            
            const dist = Math.hypot(local.x - handleX, local.y - handleY);
            if (dist < 15) {
                return { item: selectedItem, mode: "resize" };
            }
        }

        // 2. Check overlays (reverse order, top layers first)
        for (let i = overlays.length - 1; i >= 0; i--) {
            const item = overlays[i];
            const local = getLocalCoords(x, y, item.x, item.y, item.rotation);
            if (Math.abs(local.x) <= item.width / 2 && Math.abs(local.y) <= item.height / 2) {
                return { item: item, mode: "drag" };
            }
        }

        // 3. Check text fields (reverse order)
        for (let i = textFields.length - 1; i >= 0; i--) {
            const item = textFields[i];
            const local = getLocalCoords(x, y, item.x, item.y, item.rotation);
            if (Math.abs(local.x) <= item.width / 2 && Math.abs(local.y) <= item.height / 2) {
                return { item: item, mode: "drag" };
            }
        }

        return null;
    }

    // Translate global coordinates to rotated local coordinates of an item
    function getLocalCoords(px, py, cx, cy, rotation) {
        const dx = px - cx;
        const dy = py - cy;
        const cos = Math.cos(-rotation);
        const sin = Math.sin(-rotation);
        return {
            x: dx * cos - dy * sin,
            y: dx * sin + dy * cos
        };
    }

    // ----------------------------------------------------
    // 5. INTERACTIVE EVENT HANDLERS
    // ----------------------------------------------------
    function getCanvasCoords(e) {
        const rect = canvas.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        
        // Scale factor between CSS layout and raw canvas pixel dimensions
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        
        return {
            x: (clientX - rect.left) * scaleX,
            y: (clientY - rect.top) * scaleY
        };
    }

    function onStart(e) {
        // Don't intercept inputs inside input elements
        if (e.target !== canvas) return;
        e.preventDefault();

        const coords = getCanvasCoords(e);
        const hit = hitTest(coords.x, coords.y);
        
        if (hit) {
            selectedItem = hit.item;
            dragMode = hit.mode;
            dragStartX = coords.x;
            dragStartY = coords.y;
            dragStartItemX = selectedItem.x;
            dragStartItemY = selectedItem.y;
            dragStartItemWidth = selectedItem.width;
            dragStartItemHeight = selectedItem.height;
            
            showStylePanel(selectedItem);
            render();
        } else {
            selectedItem = null;
            hideStylePanel();
            render();
        }
    }

    function onMove(e) {
        if (!selectedItem || !dragMode) return;
        e.preventDefault();

        const coords = getCanvasCoords(e);
        const dx = coords.x - dragStartX;
        const dy = coords.y - dragStartY;

        if (dragMode === "drag") {
            selectedItem.x = dragStartItemX + dx;
            selectedItem.y = dragStartItemY + dy;
        } else if (dragMode === "resize") {
            // Calculate scale change along the item's local coordinate axes
            const cos = Math.cos(-selectedItem.rotation);
            const sin = Math.sin(-selectedItem.rotation);
            const localDx = dx * cos - dy * sin;
            const localDy = dx * sin + dy * cos;
            
            selectedItem.width = Math.max(20, dragStartItemWidth + localDx * 2);
            selectedItem.height = Math.max(20, dragStartItemHeight + localDy * 2);
        }
        
        render();
    }

    function onEnd() {
        dragMode = null;
    }

    // Spawns a textarea exactly over the text item for direct inline editing
    function startInlineEdit(item) {
        removeInlineEditor(); // Clean up previous editor if any
        
        selectedItem = item;
        item.isEditing = true;
        render(); // Redraw canvas to hide the text we're editing
        
        const rect = canvas.getBoundingClientRect();
        const scaleX = rect.width / canvas.width;
        const scaleY = rect.height / canvas.height;
        
        const textarea = document.createElement("textarea");
        textarea.id = "canvas-inline-editor";
        
        // CSS position relative to canvas wrapper
        textarea.style.position = "absolute";
        
        // Center position in CSS pixels relative to canvas element
        const left = item.x * scaleX + canvas.offsetLeft;
        const top = item.y * scaleY + canvas.offsetTop;
        const width = item.width * scaleX;
        const height = item.height * scaleY;
        
        textarea.style.left = `${left}px`;
        textarea.style.top = `${top}px`;
        textarea.style.width = `${width}px`;
        textarea.style.height = `${height}px`;
        textarea.style.transform = `translate(-50%, -50%) rotate(${item.rotation}rad)`;
        
        // Match typography style of the element
        textarea.style.fontFamily = `"${item.fontFamily}", sans-serif`;
        textarea.style.fontSize = `${item.fontSize * scaleX}px`;
        textarea.style.color = item.color;
        textarea.style.textAlign = item.align;
        textarea.style.lineHeight = "1.25";
        
        // Editor border and background styles
        textarea.style.background = "rgba(255, 255, 255, 0.95)";
        textarea.style.border = "2px dashed #0ea5e9";
        textarea.style.borderRadius = "4px";
        textarea.style.outline = "none";
        textarea.style.resize = "none";
        textarea.style.overflow = "hidden";
        textarea.style.padding = "4px";
        textarea.style.margin = "0";
        textarea.style.boxSizing = "border-box";
        textarea.style.zIndex = "100";
        
        textarea.value = item.text;
        
        // Real-time updates on keypresses
        textarea.addEventListener("input", (e) => {
            item.text = e.target.value;
            updateSidebarTextInputs();
            render();
        });
        
        const finishEdit = () => {
            item.text = textarea.value;
            item.isEditing = false;
            removeInlineEditor();
            render();
            updateSidebarTextInputs();
        };
        
        textarea.addEventListener("blur", finishEdit);
        
        // Handle keyboard keys (Escape cancels/saves, Ctrl+Enter finishes)
        textarea.addEventListener("keydown", (e) => {
            if (e.key === "Escape") {
                textarea.blur();
            } else if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                textarea.blur();
            }
        });
        
        document.getElementById("canvas-wrapper").appendChild(textarea);
        
        // Focus and select the existing text
        textarea.focus();
        textarea.select();
    }
    
    function removeInlineEditor() {
        const activeEditor = document.getElementById("canvas-inline-editor");
        if (activeEditor) {
            activeEditor.remove();
        }
        textFields.forEach(t => t.isEditing = false);
    }

    // Attach mouse and touch event listeners
    canvas.addEventListener("mousedown", onStart);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onEnd);

    canvas.addEventListener("touchstart", onStart, { passive: false });
    window.addEventListener("touchmove", onMove, { passive: false });
    window.addEventListener("touchend", onEnd);
    
    // Double click to trigger inline editing
    canvas.addEventListener("dblclick", (e) => {
        const coords = getCanvasCoords(e);
        const hit = hitTest(coords.x, coords.y);
        if (hit && hit.item.isText) {
            startInlineEdit(hit.item);
        }
    });

    // ----------------------------------------------------
    // 6. SIDEBAR CONTROLS & EVENT SYNCHRONIZATION
    // ----------------------------------------------------
    const stylePanel = document.getElementById("style-panel");
    const stylePanelTitle = document.getElementById("style-panel-title");
    const deleteSelectedBtn = document.getElementById("delete-selected-btn");
    const duplicateSelectedBtn = document.getElementById("duplicate-selected-btn");
    
    // Style input elements remaining
    const fontSizeSlider = document.getElementById("font-size-slider");
    const fontSizeNum = document.getElementById("font-size-num");
    const rotationSlider = document.getElementById("rotation-slider");
    const rotationNum = document.getElementById("rotation-num");
    const opacitySlider = document.getElementById("opacity-slider");
    const opacityNum = document.getElementById("opacity-num");

    let clipboardItem = null;

    // Stub function since sidebar textareas are removed
    function updateSidebarTextInputs() {
        // No-op: sidebar inputs removed as text is directly editable on canvas
    }

    // New presets: White, Black, Red, plus 3 custom presets
    const stylePresets = {
        "preset-white": {
            fontFamily: "Plus Jakarta Sans",
            color: "#ffffff",
            strokeColor: "#000000",
            strokeWidth: 3,
            isCaps: false
        },
        "preset-black": {
            fontFamily: "Plus Jakarta Sans",
            color: "#000000",
            strokeColor: "transparent",
            strokeWidth: 0,
            isCaps: false
        },
        "preset-red": {
            fontFamily: "Plus Jakarta Sans",
            color: "#ef4444",
            strokeColor: "#ffffff",
            strokeWidth: 2,
            isCaps: false
        },
        "preset-yellow-outline": {
            fontFamily: "Impact",
            color: "#facc15",
            strokeColor: "#000000",
            strokeWidth: 4,
            isCaps: true
        },
        "preset-green-neon": {
            fontFamily: "Courier New",
            color: "#22c55e",
            strokeColor: "#000000",
            strokeWidth: 3,
            isCaps: true
        },
        "preset-elegant-serif": {
            fontFamily: "Georgia",
            color: "#1e293b",
            strokeColor: "transparent",
            strokeWidth: 0,
            isCaps: false
        }
    };

    function showStylePanel(item) {
        stylePanel.classList.remove("hidden");
        
        const isEn = document.documentElement.lang === "en";
        if (item.isText) {
            stylePanelTitle.textContent = isEn ? "2. Selected Text Style" : "2. 선택한 텍스트 스타일";
        } else {
            stylePanelTitle.textContent = isEn ? "2. Selected Image Style" : "2. 선택한 이미지 스타일";
        }
        
        // 1. Sync rotation & opacity
        const rotationDeg = Math.round(item.rotation * (180 / Math.PI));
        rotationSlider.value = rotationDeg;
        rotationNum.value = rotationDeg;
        
        const opacityPercent = Math.round(item.opacity * 100);
        opacitySlider.value = opacityPercent;
        opacityNum.value = opacityPercent;

        // 2. Hide/Show specific panels depending on Text vs Image Overlay
        const textOnlyControls = document.querySelectorAll(".style-text-only");
        if (item.isText) {
            textOnlyControls.forEach(el => el.classList.remove("hidden"));
            
            // Sync text specific size
            fontSizeSlider.value = item.fontSize;
            fontSizeNum.value = item.fontSize;
            
            // Highlight matching preset if any
            highlightActivePreset(item);
            duplicateSelectedBtn.classList.remove("hidden");
        } else {
            textOnlyControls.forEach(el => el.classList.add("hidden"));
            duplicateSelectedBtn.classList.add("hidden"); // Duplication only supported for textboxes as requested
        }
    }

    function hideStylePanel() {
        stylePanel.classList.add("hidden");
    }

    function highlightActivePreset(item) {
        document.querySelectorAll(".preset-btn").forEach(btn => {
            const presetId = btn.getAttribute("data-preset");
            const preset = stylePresets[presetId];
            
            if (preset &&
                preset.fontFamily === item.fontFamily &&
                preset.color === item.color &&
                preset.strokeColor === item.strokeColor &&
                preset.strokeWidth === item.strokeWidth &&
                preset.isCaps === item.isCaps) {
                btn.classList.add("ring-2", "ring-primary");
            } else {
                btn.classList.remove("ring-2", "ring-primary");
            }
        });
    }

    // ----------------------------------------------------
    // 7. COMPONENT-LEVEL CONTROLS LISTENERS
    // ----------------------------------------------------

    // Presets click handler
    document.querySelectorAll(".preset-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            if (selectedItem && selectedItem.isText) {
                const presetId = btn.getAttribute("data-preset");
                const style = stylePresets[presetId];
                if (style) {
                    selectedItem.fontFamily = style.fontFamily;
                    selectedItem.color = style.color;
                    selectedItem.strokeColor = style.strokeColor;
                    selectedItem.strokeWidth = style.strokeWidth;
                    selectedItem.isCaps = style.isCaps;
                    
                    highlightActivePreset(selectedItem);
                    render();
                }
            }
        });
    });

    // Font Size controls syncing
    function syncFontSize(val) {
        let size = parseInt(val) || 20;
        if (size < 10) size = 10;
        if (size > 100) size = 100;
        
        fontSizeSlider.value = size;
        fontSizeNum.value = size;
        
        if (selectedItem && selectedItem.isText) {
            selectedItem.fontSize = size;
            render();
        }
    }
    fontSizeSlider.addEventListener("input", (e) => syncFontSize(e.target.value));
    fontSizeNum.addEventListener("input", (e) => syncFontSize(e.target.value));

    // Rotation controls syncing
    function syncRotation(val) {
        let deg = parseInt(val) || 0;
        if (deg < -180) deg = -180;
        if (deg > 180) deg = 180;
        
        rotationSlider.value = deg;
        rotationNum.value = deg;
        
        if (selectedItem) {
            selectedItem.rotation = deg * (Math.PI / 180);
            render();
        }
    }
    rotationSlider.addEventListener("input", (e) => syncRotation(e.target.value));
    rotationNum.addEventListener("input", (e) => syncRotation(e.target.value));

    // Opacity controls syncing
    function syncOpacity(val) {
        let pct = parseInt(val) || 100;
        if (pct < 10) pct = 10;
        if (pct > 100) pct = 100;
        
        opacitySlider.value = pct;
        opacityNum.value = pct;
        
        if (selectedItem) {
            selectedItem.opacity = pct / 100;
            render();
        }
    }
    opacitySlider.addEventListener("input", (e) => syncOpacity(e.target.value));
    opacityNum.addEventListener("input", (e) => syncOpacity(e.target.value));

    // Copy selected text box element
    function copySelectedElement() {
        if (selectedItem && selectedItem.isText) {
            clipboardItem = JSON.parse(JSON.stringify(selectedItem));
        }
    }

    // Paste element to canvas
    function pasteElement() {
        if (clipboardItem) {
            const newItem = JSON.parse(JSON.stringify(clipboardItem));
            newItem.id = `txt_copy_${Date.now()}`;
            // Offset coordinates slightly so it is visibly separated
            newItem.x = Math.min(canvas.width - newItem.width / 2, newItem.x + 20);
            newItem.y = Math.min(canvas.height - newItem.height / 2, newItem.y + 20);
            
            textFields.push(newItem);
            selectedItem = newItem;
            showStylePanel(newItem);
            render();
        }
    }

    // Duplicate button listener
    duplicateSelectedBtn.addEventListener("click", () => {
        copySelectedElement();
        pasteElement();
    });

    // Delete selected element function
    function deleteSelectedElement() {
        if (!selectedItem) return;
        
        if (selectedItem.isText) {
            textFields = textFields.filter(field => field.id !== selectedItem.id);
        } else {
            overlays = overlays.filter(overlay => overlay.id !== selectedItem.id);
        }
        
        selectedItem = null;
        hideStylePanel();
        render();
    }

    // Delete selected button listener
    deleteSelectedBtn.addEventListener("click", deleteSelectedElement);

    // Global Key Listener for Delete, Copy, Paste key shortcuts
    window.addEventListener("keydown", (e) => {
        const isInlineEditing = !!document.getElementById("canvas-inline-editor");
        if (isInlineEditing) return; // Skip shortcuts when typing in textarea
        
        if (selectedItem && (e.key === "Delete" || e.key === "Del")) {
            deleteSelectedElement();
        }
        
        // Copy / Paste shortcuts (Ctrl+C / Ctrl+V)
        if (e.ctrlKey || e.metaKey) {
            if (e.key === "c" || e.key === "C") {
                e.preventDefault();
                copySelectedElement();
            } else if (e.key === "v" || e.key === "V") {
                e.preventDefault();
                pasteElement();
            }
        }
    });

    // ----------------------------------------------------
    // 8. ADD NEW TEXTS AND STICKER/OVERLAY IMAGES
    // ----------------------------------------------------
    
    // Add text box button listener
    document.getElementById("add-text-btn").addEventListener("click", () => {
        const isEn = document.documentElement.lang === "en";
        const newText = {
            id: `txt_custom_${Date.now()}`,
            text: isEn ? "Double click to edit" : "텍스트를 입력하세요",
            x: canvas.width / 2,
            y: canvas.height / 2,
            width: 200,
            height: 80,
            fontSize: 24,
            fontFamily: "Arial",
            color: "#000000",
            strokeColor: "transparent",
            strokeWidth: 0,
            align: "center",
            rotation: 0,
            isCaps: false,
            opacity: 1,
            isText: true
        };
        
        textFields.push(newText);
        selectedItem = newText;
        updateSidebarTextInputs();
        showStylePanel(newText);
        render();
    });

    // Add overlay image listener
    const overlayImageInput = document.getElementById("overlay-image-input");
    overlayImageInput.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                // Calculate reasonable initial sizing (max 25% of canvas size)
                const maxDim = Math.min(canvas.width, canvas.height) * 0.25;
                let w = img.naturalWidth;
                let h = img.naturalHeight;
                
                if (w > maxDim || h > maxDim) {
                    if (w > h) {
                        h = h * (maxDim / w);
                        w = maxDim;
                    } else {
                        w = w * (maxDim / h);
                        h = maxDim;
                    }
                }
                
                const newOverlay = {
                    id: `img_overlay_${Date.now()}`,
                    img: img,
                    x: canvas.width / 2,
                    y: canvas.height / 2,
                    width: w,
                    height: h,
                    rotation: 0,
                    opacity: 1,
                    isText: false
                };
                
                overlays.push(newOverlay);
                selectedItem = newOverlay;
                showStylePanel(newOverlay);
                render();
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
        
        // Reset file input value so same image can be reselected
        overlayImageInput.value = "";
    });

    // ----------------------------------------------------
    // 9. BACKGROUND MANAGEMENT (TEMPLATE SELECTION & FILE UPLOAD)
    // ----------------------------------------------------

    // Select templates thumbs click listeners
    document.querySelectorAll(".template-thumb").forEach(thumb => {
        thumb.addEventListener("click", () => {
            const templateId = thumb.getAttribute("data-template");
            updateTemplateThumbs(templateId);
            initTemplate(templateId);
        });
    });

    // Upload background image file listener
    const bgUploadInput = document.getElementById("bg-upload-input");
    bgUploadInput.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (!file) return;
        removeInlineEditor(); // Clean up active editor
        
        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                bgImage.onload = () => {
                    const maxWidth = 800;
                    let width = bgImage.naturalWidth || 600;
                    let height = bgImage.naturalHeight || 600;
                    
                    if (width > maxWidth) {
                        const ratio = maxWidth / width;
                        width = maxWidth;
                        height = height * ratio;
                    }
                    
                    canvas.width = width;
                    canvas.height = height;
                    
                    // Reset textfields, custom uploads get 1 textfield centered
                    const isEn = document.documentElement.lang === "en";
                    textFields = [{
                        id: `txt_custom_bg_${Date.now()}`,
                        text: isEn ? "Type something..." : "여기에 글을 입력하세요...",
                        x: width / 2,
                        y: height / 2,
                        width: width * 0.6,
                        height: height * 0.2,
                        fontSize: 24,
                        fontFamily: "Arial",
                        color: "#000000",
                        strokeColor: "transparent",
                        strokeWidth: 0,
                        align: "center",
                        rotation: 0,
                        isCaps: false,
                        opacity: 1,
                        isText: true
                    }];
                    
                    selectedItem = null;
                    hideStylePanel();
                    render();
                    updateSidebarTextInputs();
                    
                    // De-highlight template thumbnails since custom file is active
                    document.querySelectorAll(".template-thumb").forEach(thumb => {
                        thumb.classList.remove("border-primary", "border-2");
                        thumb.classList.add("border-slate-200", "dark:border-slate-700");
                    });
                };
                bgImage.src = event.target.result;
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
        
        // Reset file input value
        bgUploadInput.value = "";
    });

    // ----------------------------------------------------
    // 10. GLOBAL ACTIONS (RESET & DOWNLOAD)
    // ----------------------------------------------------

    // Reset current template button listener
    document.getElementById("reset-btn").addEventListener("click", () => {
        removeInlineEditor(); // Clean up active editor
        // Wipes overlays as well
        overlays = [];
        initTemplate(currentTemplateId);
    });

    // Download meme button listener
    document.getElementById("download-btn").addEventListener("click", () => {
        removeInlineEditor(); // Commit and close inline editor
        // Clear selection outline to draw clean image
        const prevSelected = selectedItem;
        selectedItem = null;
        render();
        
        try {
            const dataUrl = canvas.toDataURL("image/png");
            
            const link = document.createElement("a");
            link.download = `meme-${Date.now()}.png`;
            link.href = dataUrl;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error("Failed to export image:", error);
            alert(document.documentElement.lang === "en" ? 
                "Export failed due to browser security restrictions on cross-origin resource requests." :
                "보안 상의 이유(외부 이미지 로드 제한 등)로 다운로드에 실패했습니다.");
        }
        
        // Restore selected outline
        selectedItem = prevSelected;
        render();
    });

    // ----------------------------------------------------
    // 11. EMOJI HELPER PICKER LOGIC
    // ----------------------------------------------------
    function insertEmoji(emoji) {
        // 1. Copy to clipboard
        navigator.clipboard.writeText(emoji).catch(err => {
            console.error("Failed to copy emoji:", err);
        });
        
        // 2. Insert into inline textarea if active
        const activeEditor = document.getElementById("canvas-inline-editor");
        if (activeEditor) {
            const start = activeEditor.selectionStart;
            const end = activeEditor.selectionEnd;
            const val = activeEditor.value;
            activeEditor.value = val.substring(0, start) + emoji + val.substring(end);
            activeEditor.selectionStart = activeEditor.selectionEnd = start + emoji.length;
            activeEditor.focus();
            
            if (selectedItem && selectedItem.isText) {
                selectedItem.text = activeEditor.value;
                render();
            }
            showToast(emoji);
            return;
        }
        
        // 3. Otherwise append to selectedItem if selected
        if (selectedItem && selectedItem.isText) {
            selectedItem.text += emoji;
            render();
            showToast(emoji);
        } else {
            // Just copy and show toast
            showToast(emoji, true);
        }
    }

    function showToast(emoji, copiedOnly = false) {
        const toast = document.createElement("div");
        toast.className = "fixed top-5 left-1/2 transform -translate-x-1/2 bg-slate-900/90 text-white text-xs px-4 py-2.5 rounded-full shadow-lg z-[200] flex items-center gap-2 transition-all duration-300 opacity-0 -translate-y-2 select-none pointer-events-none";
        
        const isEn = document.documentElement.lang === "en";
        const message = copiedOnly 
            ? (isEn ? `Copied: ${emoji}` : `복사됨: ${emoji}`)
            : (isEn ? `Inserted: ${emoji}` : `입력됨: ${emoji}`);
            
        toast.innerHTML = `<span class="text-base font-normal">${emoji}</span><span class="font-semibold">${message}</span>`;
        document.body.appendChild(toast);
        
        // Trigger transition
        setTimeout(() => {
            toast.classList.remove("opacity-0", "-translate-y-2");
        }, 10);
        
        // Fade out and remove
        setTimeout(() => {
            toast.classList.add("opacity-0", "-translate-y-2");
            setTimeout(() => toast.remove(), 300);
        }, 1500);
    }

    // Attach click listeners to emoji buttons
    document.querySelectorAll(".emoji-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const emoji = btn.textContent.trim();
            insertEmoji(emoji);
        });
    });
});
