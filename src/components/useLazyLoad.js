import { useEffect, useRef } from "react";

const useLazyLoad = (margin) => {
  const targetRef = useRef();

  useEffect(() => {
    if (targetRef.current) {
      const loadImg = (img) => {
        const imgSrc = img.getAttribute("data-src");
        if (!imgSrc) return;
        img.src = imgSrc;
      };

      const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            loadImg(entry.target);
            observer.unobserve(entry.target);
          }
        });
      }, { rootMargin: margin});

      observer.observe(targetRef.current);
    }
  }, [margin]);

  return { targetRef };
};

export default useLazyLoad;
