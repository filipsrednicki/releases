import { useEffect } from "react";

const useModal = (changeDisplay) => {
  useEffect(() => {
    const bodyEl = window.getComputedStyle(document.body);
    const bodyOverflow = bodyEl.getPropertyValue("overflow");
    let isOverflowHidden = false;

    if (bodyOverflow === "hidden") {
      isOverflowHidden = true;
    } else {
      document.body.style.overflow = "hidden";
    }

    const handleMouse = (e) => {
      if (e.target.className === "modal") {
        changeDisplay();
      }
    };
    const handleKey = (e) => {
      if (e.key === "Escape") {
        changeDisplay();
      }
    };
    document.addEventListener("mousedown", handleMouse);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleMouse);
      document.removeEventListener("keydown", handleKey);
      if (isOverflowHidden) return;
      document.body.style.overflow = "";
    };
  }, [changeDisplay]);
};

export default useModal;
