import { useEffect } from "react";

const useModal = (changeDisplay) => {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    const hideForm = (e) => {
      if (e.target.className === "modal") {
        changeDisplay();
      }
    };
    document.addEventListener("mousedown", hideForm);
    return () => {
      document.removeEventListener("mousedown", hideForm);
      document.body.style.overflow = "";
    };
  }, [changeDisplay]);
};

export default useModal;
