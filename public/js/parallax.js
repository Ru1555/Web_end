document.addEventListener("DOMContentLoaded", () => {

  const items = document.querySelectorAll(".scroll-img");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {

        if (entry.isIntersecting) {
          // 每次進入就播
          entry.target.classList.add("show");
        } else {
          // 一離開就重置
          entry.target.classList.remove("show");
        }

      });
    },
    {
      // 視窗在中間才算進入
      rootMargin: "-30% 0px -30% 0px",
      threshold: 0
    }
  );

  items.forEach(item => observer.observe(item));
});
