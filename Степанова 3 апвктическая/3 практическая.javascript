// script.js — логика корзины, каталог, мобильное меню

document.addEventListener('DOMContentLoaded', () => {
  // --- Данные товаров (букеты) ---
  const products = [
    { id: 1, name: 'Нежность', emoji: '🌷', price: 1890 },
    { id: 2, name: 'Солнечный', emoji: '🌻', price: 2250 },
    { id: 3, name: 'Романтика', emoji: '🌹', price: 2750 },
    { id: 4, name: 'Лаванда', emoji: '💐', price: 1950 },
    { id: 5, name: 'Пионовый', emoji: '🌸', price: 3100 },
    { id: 6, name: 'Экзотика', emoji: '🌺', price: 3450 },
  ];

  // --- Состояние корзины ---
  let cart = []; // массив { id, name, emoji, price, quantity }

  // DOM элементы
  const productGrid = document.getElementById('productGrid');
  const cartCount = document.getElementById('cartCount');
  const cartItems = document.getElementById('cartItems');
  const cartTotalPrice = document.getElementById('cartTotalPrice');
  const cartOverlay = document.getElementById('cartOverlay');
  const cartToggle = document.getElementById('cartToggle');
  const cartClose = document.getElementById('cartClose');
  const menuToggle = document.getElementById('menuToggle');
  const mainNav = document.getElementById('mainNav');

  // --- Рендер каталога ---
  function renderProducts() {
    productGrid.innerHTML = '';
    products.forEach(p => {
      const card = document.createElement('div');
      card.className = 'product-card';
      card.innerHTML = `
        <div class="product-card__image">${p.emoji}</div>
        <div class="product-card__name">${p.name}</div>
        <div class="product-card__price">${p.price} ₽</div>
        <button class="add-to-cart" data-id="${p.id}">В корзину</button>
      `;
      productGrid.appendChild(card);
    });
    // обработчики на кнопки "В корзину"
    document.querySelectorAll('.add-to-cart').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = Number(btn.dataset.id);
        const product = products.find(p => p.id === id);
        if (product) addToCart(product);
      });
    });
  }

  // --- Работа с корзиной ---
  function addToCart(product) {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    updateCartUI();
    // лёгкая анимация (открыть корзину через 0.5с — по желанию)
    // но не открываем автоматически, чтобы не мешать
  }

  function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCartUI();
  }

  function updateCartUI() {
    // обновить бейдж
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;

    // обновить содержимое модалки
    if (cart.length === 0) {
      cartItems.innerHTML = `<p class="cart-empty">Корзина пуста. Добавьте цветы!</p>`;
      cartTotalPrice.textContent = '0 ₽';
      return;
    }

    let html = '';
    let total = 0;
    cart.forEach(item => {
      const itemTotal = item.price * item.quantity;
      total += itemTotal;
      html += `
        <div class="cart-item" data-id="${item.id}">
          <div class="cart-item__info">
            <span class="cart-item__emoji">${item.emoji}</span>
            <span class="cart-item__name">${item.name}</span>
            <span style="color:#b0a0a0; font-size:0.9rem;">×${item.quantity}</span>
          </div>
          <div style="display:flex; align-items:center; gap:12px;">
            <span class="cart-item__price">${itemTotal} ₽</span>
            <button class="cart-item__remove" data-id="${item.id}">✕</button>
          </div>
        </div>
      `;
    });
    cartItems.innerHTML = html;
    cartTotalPrice.textContent = `${total} ₽`;

    // обработчики удаления
    document.querySelectorAll('.cart-item__remove').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = Number(btn.dataset.id);
        removeFromCart(id);
      });
    });
  }

  // --- Открытие/закрытие корзины (overlay) ---
  function openCart() {
    cartOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeCart() {
    cartOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  cartToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    if (cartOverlay.classList.contains('open')) {
      closeCart();
    } else {
      openCart();
    }
  });

  cartClose.addEventListener('click', closeCart);
  cartOverlay.addEventListener('click', (e) => {
    if (e.target === cartOverlay) closeCart();
  });

  // --- Мобильное меню ---
  menuToggle.addEventListener('click', () => {
    mainNav.classList.toggle('open');
  });

  // закрываем меню при клике на ссылку (для удобства)
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        mainNav.classList.remove('open');
      }
    });
  });

  // --- Обработчик "Оформить заказ" ---
  document.querySelector('.btn-checkout').addEventListener('click', () => {
    if (cart.length === 0) {
      alert('🌸 Добавьте цветы в корзину!');
      return;
    }
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    alert(`Спасибо за заказ на сумму ${total} ₽! 🌸 Мы свяжемся с вами.`);
    cart = [];
    updateCartUI();
    closeCart();
  });

  // --- Инициализация ---
  renderProducts();
  updateCartUI();
});