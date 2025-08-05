export class DragFollower {
  constructor() {
    this.init();
  }

  init() {
    const wrappers = document.querySelectorAll("[data-drag-follower]");

    wrappers.forEach((wrapper) => {
      const cursor = this.createCursor();
      wrapper.appendChild(cursor);

      let { width, height } = cursor.getBoundingClientRect();
      let { width: wrapperW, height: wrapperH } = wrapper.getBoundingClientRect();

      let center = `translate(${wrapperW / 2 - width / 2}px , ${wrapperH / 2 - height / 2}px)`;
      cursor.style.transform = center;

      window.addEventListener("resize", () => {
        ({ width, height } = cursor.getBoundingClientRect());
        ({ width: wrapperW, height: wrapperH } = wrapper.getBoundingClientRect());
        center = `translate(${wrapperW / 2}px, ${wrapperH / 2 - height / 2}px)`;
      });

      let mouseX = 0;
      let mouseY = 0;
      let isInside = false;
      let requestId = null;

      function animate() {
        if (isInside) {
          cursor.style.opacity = 1;
          const offsetY = mouseY - wrapper.getBoundingClientRect().top - height / 2;
          const offsetX = mouseX - width / 2;

          cursor.style.transform = `translate(${offsetX}px, ${offsetY}px)`;

          requestId = requestAnimationFrame(animate);
        }
      }

      wrapper.addEventListener("mousemove", (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        if (!isInside) {
          isInside = true;
          animate();
        }
      });

      wrapper.addEventListener("mouseleave", () => {
        isInside = false;
        cursor.style.opacity = 0;

        cancelAnimationFrame(requestId);
        cursor.style.transform = center;
      });
    });
  }

  createCursor() {
    const cursor = document.createElement("div");
    cursor.classList.add("cursor");

    const cursorInnerBg = document.createElement("div");
    cursorInnerBg.classList.add("cursor-inner-bg");

    const cursorInnerText = document.createElement("span");
    cursorInnerText.innerText = "DRAG";
    cursorInnerText.classList.add("cursor-inner-text");

    cursor.appendChild(cursorInnerBg);
    cursor.appendChild(cursorInnerText);

    return cursor;
  }
}
