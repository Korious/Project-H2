//Button move to forminSpurtX!bundle
document.querySelectorAll('.js-scroll').forEach(btn => {
  btn.addEventListener('click', () => {
    const target = document.querySelector(btn.dataset.target);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

//Popup for add to cart in Spurt!-merch
document.querySelectorAll('.add-to-cart').forEach(btn => {
  btn.addEventListener('click', () => {
    const product = btn.dataset.product || 'Product';
    const popup = document.getElementById('cartPopup');
    const message = document.getElementById('popupMessage');
    
    message.textContent = `${product} added to cart!`;
    popup.style.display = 'flex';

    // Close when OK is clicked
    document.querySelector('.close-popup').addEventListener('click', () =>{
        popup.style.display = 'none';
    })
    
    // Auto close in 2 seconds
    setTimeout(() => {
      popup.style.display = 'none';
    }, 2000);
  });
});
closeBtn.addEventListener('click', () => {
  popup.hidden = true;
});
