(() => {
    const getGrow = (el) => Number(el.style.getPropertyValue("--grow") || getComputedStyle(el).getPropertyValue("--grow"));
    const debouncedResize = () => {
        let timeout;
        return () => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                dispatchEvent(new Event('resize'));
            }, 60);
        };
    };
    const triggerGlobalResizeEvent = debouncedResize();
    const splitViewStart = (ev) => {
        const SIZE_MIN = 100;
        const elSplitter = ev.target.closest(".splitter");
        const elPrev = elSplitter?.previousElementSibling;
        const elNext = elSplitter?.nextElementSibling;

        if (!elSplitter || !elPrev || !elNext) return;
        ev.preventDefault();

        elSplitter.setPointerCapture(ev.pointerId);
        const isCol = elSplitter.closest(".view").matches(".col");
        const offset = isCol ? "offsetHeight" : "offsetWidth";
        const clientXY = isCol ? "clientY" : "clientX";
        const growSum = getGrow(elPrev) + getGrow(elNext);
        const clientXYStart = ev[clientXY];
        const sizePrev = elPrev[offset];
        const sizeNext = elNext[offset];
        const sizeSum = sizePrev + sizeNext;
        const sizeMinPrev = Number(elPrev.style.getPropertyValue("--min") || SIZE_MIN);
        const sizeMinNext = Number(elNext.style.getPropertyValue("--min") || SIZE_MIN);

        const splitViewMove = (ev) => {
            const posDiff = ev[clientXY] - clientXYStart;
            const sizePrevNew = Math.max(sizeMinPrev, Math.min(sizeSum - sizeMinNext, sizePrev + posDiff));
            const sizeNextNew = Math.max(sizeMinNext, Math.min(sizeSum - sizeMinPrev, sizeNext - posDiff));
            elPrev.style.setProperty("--grow", growSum * sizePrevNew / sizeSum);
            elNext.style.setProperty("--grow", growSum * sizeNextNew / sizeSum);
            triggerGlobalResizeEvent();
        };

        const splitViewEnd = () => {
            removeEventListener("pointermove", splitViewMove);
            removeEventListener("pointerup", splitViewEnd);
        };

        addEventListener("pointermove", splitViewMove);
        addEventListener("pointerup", splitViewEnd);
    }

    addEventListener("pointerdown", splitViewStart);
})();