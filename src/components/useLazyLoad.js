import { useEffect, useRef } from "react";

const useLazyLoad = () => {
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
      }, {});

      observer.observe(targetRef.current);
    }
  }, []);

  return { targetRef };
};

export default useLazyLoad;
