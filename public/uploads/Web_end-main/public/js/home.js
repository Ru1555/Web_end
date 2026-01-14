document.addEventListener('DOMContentLoaded', () => {
    const navCards = document.querySelectorAll('.home-nav-card');
    const navSection = document.getElementById('homeNav');
  
    if (!navSection) return;
  
    const revealCards = () => {
      const triggerPoint = window.innerHeight * 0.9;
      const sectionTop = navSection.getBoundingClientRect().top;
  
      if (sectionTop < triggerPoint) {
        navCards.forEach((card, index) => {
          setTimeout(() => {
            card.classList.add('show');
          }, index * 120);
        });
  
        // ⭐ 只播放一次
        window.removeEventListener('scroll', revealCards);
      }
    };
  
    window.addEventListener('scroll', revealCards);
    revealCards(); // ⭐ 頁面載入就先檢查一次
  
    // 微震動
    navCards.forEach(card => {
      card.addEventListener('click', () => {
        if (navigator.vibrate) {
          navigator.vibrate(15);
        }
      });
    });
  });
  