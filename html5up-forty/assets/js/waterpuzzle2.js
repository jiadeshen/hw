document.addEventListener("DOMContentLoaded", function() {
    const startBtn = document.getElementById("start-btn");
    const gameContainer = document.getElementById("game-container");
    const msg = document.getElementById("msg");
    const levelSelect = document.getElementById("level-select");

    // 最多10種顏色
    const COLORS = [
        "red", "blue", "green", "yellow", "orange", "purple", "pink", "brown", "cyan", "magenta"
    ];
    let tubes = [];
    let selectedTube = null;
    let level = 1;

    // 初始化遊戲
    function initGame() {
        msg.textContent = "";
        tubes = [];
        gameContainer.innerHTML = "";

        // 依難度決定顏色數
        const colorCount = Math.max(2, Math.min(10, level));
        const useColors = COLORS.slice(0, colorCount);

        // 每色4塊
        let colorBlocks = [];
        useColors.forEach(color => {
            for (let i = 0; i < 4; i++) colorBlocks.push(color);
        });
        // 洗牌
        colorBlocks.sort(() => Math.random() - 0.5);

        // 試管數 = 顏色數 + 2
        const tubeCount = colorCount + 2;

        // 產生有顏色的試管
        let blockIndex = 0;
        for (let i = 0; i < colorCount; i++) {
            const tube = createTube();
            for (let j = 0; j < 4; j++) {
                if (blockIndex < colorBlocks.length) {
                    const block = createBlock(colorBlocks[blockIndex]);
                    tube.appendChild(block);
                    blockIndex++;
                }
            }
            gameContainer.appendChild(tube);
            tubes.push(tube);
        }
        // 產生空試管
        for (let i = 0; i < 2; i++) {
            const tube = createTube();
            gameContainer.appendChild(tube);
            tubes.push(tube);
        }
    }

    // 建立試管
    function createTube() {
        const tube = document.createElement("div");
        tube.className = "tube";
        tube.addEventListener("click", () => handleTubeClick(tube));
        return tube;
    }

    // 建立水塊
    function createBlock(color) {
        const block = document.createElement("div");
        block.className = "block";
        block.style.background = color;
        return block;
    }

    // 處理試管點擊
    function handleTubeClick(tube) {
        if (selectedTube) {
            if (selectedTube === tube) {
                tube.classList.remove("selected");
                selectedTube = null;
                return;
            }
            moveBlock(selectedTube, tube);
            selectedTube.classList.remove("selected");
            selectedTube = null;
            checkWin();
        } else {
            if (tube.children.length === 0) return;
            selectedTube = tube;
            tube.classList.add("selected");
        }
    }

    // 倒水邏輯
    function moveBlock(fromTube, toTube) {
        if (toTube.children.length >= 4) return;
        if (fromTube.children.length === 0) return;

        const movingColor = fromTube.lastChild.style.background;
        if (toTube.children.length === 0 ||
            toTube.lastChild.style.background === movingColor) {
            while (
                fromTube.children.length &&
                fromTube.lastChild.style.background === movingColor &&
                toTube.children.length < 4
            ) {
                toTube.appendChild(fromTube.lastChild);
            }
        }
    }

    // 勝利判斷
    function checkWin() {
        const colorCount = Math.max(2, Math.min(10, level));
        const win = tubes.filter(tube =>
            tube.children.length === 4 &&
            Array.from(tube.children).every(b => b.style.background === tube.firstChild.style.background)
        ).length === colorCount;
        if (win) {
            msg.textContent = "恭喜過關！";
        }
    }

    // 難度選擇
    levelSelect.addEventListener("change", function() {
        level = parseInt(levelSelect.value, 10);
        initGame();
    });

    // 按鈕事件
    startBtn.addEventListener("click", initGame);

    // 預設載入
    initGame();
});