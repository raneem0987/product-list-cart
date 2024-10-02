document.addEventListener('DOMContentLoaded', () => {
  const cartQuantityElement = document.querySelector('.quantity');
  const cartTotalElement = document.querySelector('.cart-total');
  const cartItemsContainer = document.querySelector('.cart-items');
  const emptyContent = document.querySelector('.empty-content');
  const cartSummary = document.querySelector('.cart-summary');
  const confirmOrderButton = document.querySelector('.confirm-order');
  const overlay = document.querySelector('.overlay');
  const final = document.querySelector('.final');
  const order = document.querySelector('.order');
  const startButton = document.querySelector('.start');

  let cart = {};

  function updateCartSidebar() {
    cartItemsContainer.innerHTML = '';
    let total = 0;
    let quantity = 0;

    Object.keys(cart).forEach(productName => {
      const item = cart[productName];
      const cartItem = document.createElement('div');
      cartItem.classList.add('cart-item');

      cartItem.innerHTML = `
        <div class="cart-item-details">
          <p><strong>${productName}</strong></p>
          <div class="quantity-price">
            <p class="quantity"><small style="color: red;">${item.quantity}x</small></p>
            <p class="price"><small>@ $${item.price.toFixed(2)}</small></p>
            <p class="total-price-end"><small>$${(item.quantity * item.price).toFixed(2)}</small></p>
            <span class="remove-item" style="cursor: pointer;"><i class="fa-solid fa-xmark fa-sm"></i></span> 
          </div>
        </div>
      `;
      cartItem.querySelector('.remove-item').addEventListener('click', () => {
        delete cart[productName];
        updateCartSidebar();
      });

      cartItemsContainer.appendChild(cartItem);

      total += item.quantity * item.price;
      quantity += item.quantity;
    });

    cartTotalElement.textContent = `$${total.toFixed(2)}`;
    cartQuantityElement.textContent = quantity;

    if (quantity > 0) {
      emptyContent.style.display = 'none';
      cartSummary.style.display = 'block';
    } else {
      emptyContent.style.display = 'block';
      cartSummary.style.display = 'none';
    }
  }

  document.querySelectorAll('.products-card').forEach(card => {
    const productName = card.querySelector('.product-name').textContent;
    const productPrice = parseFloat(card.querySelector('.price').textContent.replace('$', ''));
    const productImage = card.querySelector('.image-product').getAttribute('src');
    const addCartButton = card.querySelector('.addCart');
    const counterElement = card.querySelector('.counter');

    addCartButton.addEventListener('click', () => {
      addCartButton.classList.add('hidden');
      counterElement.classList.remove('hidden');
      addCartButton.classList.remove('.active');
      if (!cart[productName]) {
        cart[productName] = { price: productPrice, quantity: 1, image: productImage };
      } else {
        cart[productName].quantity += 1;
      }
      counterElement.querySelector('span').textContent = cart[productName].quantity;
      updateCartSidebar();
    });

    card.querySelector('.increment').addEventListener('click', () => {
      cart[productName].quantity += 1;
      counterElement.querySelector('span').textContent = cart[productName].quantity;
      updateCartSidebar();
    });

    card.querySelector('.decrement').addEventListener('click', () => {
      if (cart[productName] && cart[productName].quantity > 0) {
        cart[productName].quantity -= 1;
        if (cart[productName].quantity === 0) {
          delete cart[productName];
          addCartButton.classList.remove('hidden');
          counterElement.classList.add('hidden');
          addCartButton.classList.add('.active');
        }
        counterElement.querySelector('span').textContent = cart[productName] ? cart[productName].quantity : 0;
      }
      updateCartSidebar();
    });
  });

  confirmOrderButton.addEventListener('click', () => {
    overlay.style.display = 'block';
    final.style.display = 'block';
    order.innerHTML = ''; 

    let totalOrderPrice = 0;

    Object.keys(cart).forEach(productName => {
      const item = cart[productName];
      if (item) {
        const orderItem = document.createElement('div');
        orderItem.classList.add('order-item');
        orderItem.innerHTML = `
        <div class="order-item-details">
          <div class="first-details">
            <img src="${item.image}" alt="${productName}" style="width: 60px; height: 60px; object-fit: cover;" />
            <p class="name"><strong>${productName}</strong></p>
            <p class="total"><strong> $${(item.quantity * item.price).toFixed(2)}</strong></p>
          <div/>
          <div class="details">
            <p class="quantity"><strong>${item.quantity}x</strong></p>
            <p class="price"><strong>@ $${item.price.toFixed(2)}</strong></p>
          <div/>
        </div>
        `;
        order.appendChild(orderItem);

        totalOrderPrice += item.quantity * item.price;
      }
    });

    const totalElement = document.createElement('p');
    totalElement.classList.add('total-price-end');
    totalElement.innerHTML = `Order Total <strong>$${totalOrderPrice.toFixed(2)}</strong>`;
    order.appendChild(totalElement);

    cart = {}; 
    updateCartSidebar(); 
  });

  startButton.addEventListener('click', () => {
    overlay.style.display = 'none';
    final.style.display = 'none';
    location.reload(); 
    updateCartSidebar();
  });
});