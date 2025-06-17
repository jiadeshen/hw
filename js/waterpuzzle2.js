document.addEventListener("DOMContentLoaded", function() {
    const startBtn = document.getElementById("start-btn");
    const gameContainer = document.getElementById("game-container");
    const msg = document.getElementById("msg");
    const levelSelect = document.getElementById("level-select");

    const COLORS = [
        "red", "blue", "green", "yellow", "orange", "purple", "pink", "brown", "cyan", "magenta"
    ];
    let tubes = [];
    let selectedTube = null;
    let level = 1;

    function initGame() {
        msg.textContent = "";
        tubes = [];
        gameContainer.innerHTML = "";

        const colorCount = Math.max(2, Math.min(10, level));
        const useColors = COLORS.slice(0, colorCount);

        let colorBlocks = [];
        useColors.forEach(color => {
            for (let i = 0; i < 4; i++) colorBlocks.push(color);
        });
        colorBlocks.sort(() => Math.random() - 0.5);

        const tubeCount = colorCount + 2;

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
        for (let i = 0; i < 2; i++) {
            const tube = createTube();
            gameContainer.appendChild(tube);
            tubes.push(tube);
        }
    }

    function createTube() {
        const tube = document.createElement("div");
        tube.className = "tube";
        tube.addEventListener("click", () => handleTubeClick(tube));
        return tube;
    }

    function createBlock(color) {
        const block = document.createElement("div");
        block.className = "block";
        block.style.background = color;
        return block;
    }

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

 function moveBlock(fromTube, toTube) {
    if (toTube.children.length >= 4) return;
    if (fromTube.children.length === 0) return;

    // 取得最上面的水塊（現在是 lastChild）
    const movingColor = fromTube.lastChild.style.background;
    if (
        toTube.children.length === 0 ||
        (toTube.lastChild && toTube.lastChild.style.background === movingColor)
    ) {
        while (
            fromTube.children.length &&
            fromTube.lastChild.style.background === movingColor &&
            toTube.children.length < 4
        ) {
            toTube.appendChild(fromTube.lastChild);
        }
    }
}


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

    levelSelect.addEventListener("change", function() {
        level = parseInt(levelSelect.value, 10);
        // 不自動開始遊戲
    });

    startBtn.addEventListener("click", initGame);

    // 不要自動呼叫 initGame()
});