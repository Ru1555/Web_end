  /*分類切換*/
  const filterButtons = document.querySelectorAll('.filter-btn');
  const workItems = document.querySelectorAll('.work-item');

  function filterWorks(filter) {
    workItems.forEach(item => {
      if (item.classList.contains(filter)) {
        item.style.display = 'block';
      } else {
        item.style.display = 'none';
      }
    });
  }

  //只顯示 Portraits
  filterWorks('portraits');

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // active 樣式切換
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      const filter = button.dataset.filter;
      filterWorks(filter);
    });
  });


  /*點圖片*/
  const modal = new bootstrap.Modal(document.getElementById('workModal'));
  const modalImage = document.getElementById('modalImage');
  const modalText = document.getElementById('modalText');

  workItems.forEach(item => {
    item.addEventListener('click', () => {
      const imgSrc = item.dataset.img;
      const text = item.dataset.text;

      modalImage.src = imgSrc;
      modalText.textContent = text;

      modal.show();
    });
  });
