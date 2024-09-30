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

  fetch('data.json')
    .then(response => response.json())
    .then(data => {
      productData = data;
      initializeCart();
    });

  const initializeCart = () => {
    document.querySelectorAll('.products-card').forEach(card => {
      const productName = card.querySelector('.product-name').textContent;
      const productPrice = parseFloat(card.querySelector('.price').textContent.replace('$', ''));
      const addCartButton = card.querySelector('.addCart');
      const counterElement = card.querySelector('.counter');
      const productImage = card.querySelector('.image-product');

      addCartButton.addEventListener('click', () => {
        addCartButton.classList.add('.hidden');
        counterElement.classList.remove('.hidden');
        productImage.classList.add('active');
        if (!cart[productName]) {
          cart[productName] = { price: productPrice, quantity: 1 };
        } else {
          cart[productName].quantity += 1;
        }
        counterElement.querySelector('span').textContent = cart[productName].quantity;
        updateCartDisplay();
      });

      card.querySelector('.increment').addEventListener('click', () => {
        if (!cart[productName]) {
          cart[productName] = { price: productPrice, quantity: 1 };
        } else {
          cart[productName].quantity += 1;
        }
        counterElement.querySelector('span').textContent = cart[productName].quantity;
        updateCartDisplay();
      });

      card.querySelector('.decrement').addEventListener('click', () => {
        if (cart[productName] && cart[productName].quantity > 0) {
          cart[productName].quantity -= 1;
          if (cart[productName].quantity === 0) {
            delete cart[productName];
            addCartButton.classList.remove('.hidden');
            counterElement.classList.add('.hidden');
            productImage.classList.remove('active');
          }
          counterElement.querySelector('span').textContent = cart[productName] ? cart[productName].quantity : 0;
          updateCartDisplay();
        }
      });
    });
  };

  function updateCartSidebar() {
    cartItemsContainer.innerHTML = '';
    let total = 0;
    let quantity = 0;

    Object.values(cart).forEach(item => {
      const cartItem = document.createElement('div');
      cartItem.classList.add('cart-item');
      cartItem.innerHTML = `
        <div class="cart-item-details">
          <p>${item.name}</p>
          <p>Quantity: ${item.quantity}</p>
          <p>$${(item.quantity * item.price).toFixed(2)}</p>
        </div>
      `;
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

  // Adding items to the cart
  const addCartButtons = document.querySelectorAll('.addCart');
  addCartButtons.forEach(button => {
    button.addEventListener('click', (event) => {
      const productCard = event.target.closest('.products-card');
      const productName = productCard.querySelector('.product-name').textContent;
      const productPrice = parseFloat(productCard.querySelector('.price').textContent.replace('$', ''));

      if (cart[productName]) {
        cart[productName].quantity += 1;
      } else {
        cart[productName] = {
          name: productName,
          price: productPrice,
          quantity: 1
        };
      }

      updateCartSidebar();
    });
  });

  confirmOrderButton.addEventListener('click', () => {
    overlay.style.display = 'block';
    final.style.display = 'block';
    order.innerHTML = '';

    Object.values(cart).forEach(item => {
      const orderItem = document.createElement('div');
      orderItem.innerHTML = `<p>${item.quantity} x ${item.name} - $${(item.quantity * item.price).toFixed(2)}</p>`;
      order.appendChild(orderItem);
    });

    cart = {};
    updateCartSidebar();

    const enjoyMessage = document.querySelector('.enjoy');
    enjoyMessageMessage.textContent = 'We hope you enjoy your food!';
  });

  startButton.addEventListener('click', () => {
    overlay.style.display = 'none';
    final.style.display = 'none';
    updateCartSidebar();
  });

  updateCartSidebar();
});
