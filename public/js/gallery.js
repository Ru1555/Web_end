const filterButtons = document.querySelectorAll('.filter-btn');
const workItems = document.querySelectorAll('.work-item');

filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    // active 狀態
    filterButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;

    // 顯示對應作品
    workItems.forEach(item => {
      item.classList.remove('show');

      if (item.classList.contains(filter)) {
        item.classList.add('show');
      }
    });
  });
});

// 預設顯示第一類
document.querySelector('.filter-btn.active')?.click();
