// Ürün verileri
const products = [
  {
    id: 1,
    name: 'Nova Sneaker Pro',
    category: 'Ayakkabı',
    price: 2499,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80',
    description: 'Şehir yaşamına uygun, rahat ve modern spor ayakkabı.'
  },
  {
    id: 2,
    name: 'AirSound Max',
    category: 'Teknoloji',
    price: 3199,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80',
    description: 'Güçlü ses performansı sunan premium kablosuz kulaklık.'
  },
  {
    id: 3,
    name: 'SteelType Keyboard',
    category: 'Teknoloji',
    price: 1899,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&w=900&q=80',
    description: 'Yazılım ve günlük kullanım için ideal mekanik klavye.'
  },
  {
    id: 4,
    name: 'Urban Leather Bag',
    category: 'Aksesuar',
    price: 1599,
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=900&q=80',
    description: 'Şık tasarımlı, günlük kullanıma uygun deri çanta.'
  },
  {
    id: 5,
    name: 'Smart Fit Watch',
    category: 'Teknoloji',
    price: 2799,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80',
    description: 'Sağlık takibi ve bildirim desteği sunan akıllı saat.'
  },
  {
    id: 6,
    name: 'Classic Street Shoe',
    category: 'Ayakkabı',
    price: 2199,
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=900&q=80',
    description: 'Sade görünüm ve günlük konforu bir araya getirir.'
  }
];

let cart = JSON.parse(localStorage.getItem('novashop-cart')) || [];

const productGrid = document.getElementById('productGrid');
const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const cartCount = document.getElementById('cartCount');
const cartPanel = document.getElementById('cartPanel');
const overlay = document.getElementById('overlay');
const cartToggleBtn = document.getElementById('cartToggleBtn');
const closeCartBtn = document.getElementById('closeCartBtn');
const clearCartBtn = document.getElementById('clearCartBtn');
const checkoutBtn = document.getElementById('checkoutBtn');
const menuButton = document.getElementById('menuButton');
const navMenu = document.getElementById('navMenu');

// Fiyatı TL formatına çevirir
function formatPrice(price) {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    maximumFractionDigits: 0
  }).format(price);
}

// Yıldız gösterimi
function renderStars(rating) {
  return `★ ${rating}`;
}

// Ürünleri ekrana basar
function renderProducts(list) {
  productGrid.innerHTML = '';

  if (list.length === 0) {
    productGrid.innerHTML = `
      <div class="no-product">
        <h3>Ürün bulunamadı</h3>
        <p>Arama veya kategori filtresini değiştirerek tekrar deneyin.</p>
      </div>
    `;
    return;
  }

  list.forEach(product => {
    const card = document.createElement('article');
    card.className = 'product-card';

    card.innerHTML = `
      <div class="product-image-wrap">
        <img src="${product.image}" alt="${product.name}" />
        <span class="product-category">${product.category}</span>
      </div>
      <div class="product-body">
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <div class="product-meta">
          <strong class="product-price">${formatPrice(product.price)}</strong>
          <span class="product-rating">${renderStars(product.rating)}</span>
        </div>
        <button class="add-to-cart-btn" data-id="${product.id}">Sepete Ekle</button>
      </div>
    `;

    productGrid.appendChild(card);
  });

  document.querySelectorAll('.add-to-cart-btn').forEach(button => {
    button.addEventListener('click', () => addToCart(Number(button.dataset.id)));
  });
}

// Filtreleme işlemi
function filterProducts() {
  const searchValue = searchInput.value.trim().toLowerCase();
  const categoryValue = categoryFilter.value;

  const filtered = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchValue) ||
      product.description.toLowerCase().includes(searchValue);

    const matchesCategory = categoryValue === 'all' || product.category === categoryValue;

    return matchesSearch && matchesCategory;
  });

  renderProducts(filtered);
}

// Sepete ürün ekleme
function addToCart(productId) {
  const selectedProduct = products.find(product => product.id === productId);
  if (!selectedProduct) return;

  const existingProduct = cart.find(item => item.id === productId);

  if (existingProduct) {
    existingProduct.quantity += 1;
  } else {
    cart.push({ ...selectedProduct, quantity: 1 });
  }

  saveCart();
  renderCart();
  openCart();
}

// Sepetten ürün silme
function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  saveCart();
  renderCart();
}

// Sepeti localStorage'a kaydeder
function saveCart() {
  localStorage.setItem('novashop-cart', JSON.stringify(cart));
}

// Sepeti ekrana basar
function renderCart() {
  cartItems.innerHTML = '';

  if (cart.length === 0) {
    cartItems.innerHTML = `
      <div class="empty-cart">
        <div>
          <h4>Sepetiniz boş</h4>
          <p>Ürün ekledikten sonra burada görüntülenecek.</p>
        </div>
      </div>
    `;
    cartTotal.textContent = formatPrice(0);
    cartCount.textContent = '0';
    return;
  }

  let total = 0;
  let totalQuantity = 0;

  cart.forEach(item => {
    total += item.price * item.quantity;
    totalQuantity += item.quantity;

    const cartItem = document.createElement('div');
    cartItem.className = 'cart-item';
    cartItem.innerHTML = `
      <img src="${item.image}" alt="${item.name}" />
      <div class="cart-item-info">
        <h4>${item.name}</h4>
        <p>${item.quantity} adet × ${formatPrice(item.price)}</p>
      </div>
      <div class="cart-item-actions">
        <strong>${formatPrice(item.price * item.quantity)}</strong>
        <button type="button" data-remove-id="${item.id}">Sil</button>
      </div>
    `;

    cartItems.appendChild(cartItem);
  });

  cartTotal.textContent = formatPrice(total);
  cartCount.textContent = String(totalQuantity);

  document.querySelectorAll('[data-remove-id]').forEach(button => {
    button.addEventListener('click', () => removeFromCart(Number(button.dataset.removeId)));
  });
}

// Sepeti tamamen temizler
function clearCart() {
  cart = [];
  saveCart();
  renderCart();
}

// Sepet açma
function openCart() {
  cartPanel.classList.add('active');
  overlay.classList.add('active');
}

// Sepet kapatma
function closeCart() {
  cartPanel.classList.remove('active');
  overlay.classList.remove('active');
}

// Demo sipariş işlemi
function checkout() {
  if (cart.length === 0) {
    alert('Sepetiniz boş. Önce ürün eklemelisiniz.');
    return;
  }

  alert('Bu proje demo amaçlıdır. Gerçek ödeme altyapısı henüz eklenmemiştir.');
}

// Mobil menü aç/kapat
function toggleMobileMenu() {
  navMenu.classList.toggle('active');
}

// Olay dinleyicileri
searchInput.addEventListener('input', filterProducts);
categoryFilter.addEventListener('change', filterProducts);
cartToggleBtn.addEventListener('click', openCart);
closeCartBtn.addEventListener('click', closeCart);
overlay.addEventListener('click', closeCart);
clearCartBtn.addEventListener('click', clearCart);
checkoutBtn.addEventListener('click', checkout);
menuButton.addEventListener('click', toggleMobileMenu);

// Başlangıç
renderProducts(products);
renderCart();
