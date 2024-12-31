function manageResize(ev, sizeProp, posProp) {
    const elTarget = ev.target;

    var prev = elTarget.previousElementSibling;
    var next = elTarget.nextElementSibling;

    if (!prev || !next) {
        return;
    }

    ev.preventDefault();

    var prevSize = prev[sizeProp];
    var nextSize = next[sizeProp];
    var sumSize = prevSize + nextSize;
    var prevGrow = Number(prev.style.flexGrow);
    var nextGrow = Number(next.style.flexGrow);
    var sumGrow = prevGrow + nextGrow;
    var lastPos = ev[posProp];

    function onMouseMove(mm) {
        var pos = mm[posProp];
        var d = pos - lastPos;
        prevSize += d;
        nextSize -= d;
        if (prevSize < 0) {
            nextSize += prevSize;
            pos -= prevSize;
            prevSize = 0;
        }
        if (nextSize < 0) {
            prevSize += nextSize;
            pos += nextSize;
            nextSize = 0;
        }

        var prevGrowNew = sumGrow * (prevSize / sumSize);
        var nextGrowNew = sumGrow * (nextSize / sumSize);

        prev.style.flexGrow = prevGrowNew;
        next.style.flexGrow = nextGrowNew;

        lastPos = pos;
    }

    function onMouseUp() {
        removeEventListener("mousemove", onMouseMove);
        removeEventListener("mouseup", onMouseUp);
    }

    addEventListener("mousemove", onMouseMove);
    addEventListener("mouseup", onMouseUp);
}

function setupResizerEvents() {
    document.body.addEventListener("mousedown", function (ev) {
        const elSplitter = ev.target.closest(".splitter");
        if (!elSplitter) return;
        const elView = elSplitter.closest(".flex");
        const isHorizontal = elView.matches(".h");
        if (isHorizontal) {
            manageResize(ev, "offsetWidth", "pageX");
        } else {
            manageResize(ev, "offsetHeight", "pageY");
        }
    });
}

setupResizerEvents();
