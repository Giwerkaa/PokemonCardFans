document.addEventListener('DOMContentLoaded', () => {
  // Główne zmienne aplikacji
  let allCards = [...pokemonCards, ...energyCards, ...trainerCards];
  let filteredCards = [...allCards];
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  let currentPage = 1;
  const cardsPerPage = 20;
  
  // Elementy DOM
  const elements = {
    mainCategory: document.getElementById('main-category'),
    subCategory: document.getElementById('sub-category'),
    search: document.getElementById('search'),
    sort: document.getElementById('sort'),
    cardsContainer: document.getElementById('cards-container'),
    cartButton: document.getElementById('cart-button'),
    cartModal: document.getElementById('cart-modal'),
    cartItems: document.getElementById('cart-items'),
    totalAmount: document.getElementById('total-amount'),
    checkoutBtn: document.getElementById('checkout-btn'),
    closeModal: document.querySelector('.close-modal')
  };

  // Inicjalizacja
  function init() {
    renderCards();
    setupEventListeners();
    updateCart();
  }

  // Renderowanie kart
  function renderCards() {
    elements.cardsContainer.innerHTML = '';
    
    if (filteredCards.length === 0) {
      elements.cardsContainer.innerHTML = '<p class="no-results">Nie znaleziono kart spełniających kryteria wyszukiwania.</p>';
      return;
    }
    
    const startIndex = (currentPage - 1) * cardsPerPage;
    const endIndex = Math.min(startIndex + cardsPerPage, filteredCards.length);
    const cardsToShow = filteredCards.slice(startIndex, endIndex);
    
    cardsToShow.forEach(card => {
      const cardElement = document.createElement('div');
      cardElement.className = 'card';
      cardElement.innerHTML = `
        <div class="card-image-container">
          <img src="${card.image}" alt="${card.name}" class="card-image" onerror="this.src='images/placeholder.jpg';">
          ${card.available <= 3 ? `<span class="stock-badge ${card.available === 1 ? 'low-stock' : ''}">${card.available} szt.</span>` : ''}
          ${card.holoAvailable > 0 ? `<span class="holo-badge" title="Dostępne holo: ${card.holoAvailable}">✨</span>` : ''}
        </div>
        <div class="card-info">
          <h3 class="card-name">${card.name}</h3>
          <p class="card-description">${card.description_pl || card.description || ''}</p>
          <div class="card-price">${card.price.toFixed(2)} PLN</div>
          <button class="add-to-cart" data-id="${card.id}" ${card.available <= 0 && card.holoAvailable <= 0 ? 'disabled' : ''}>
            ${card.available <= 0 && card.holoAvailable <= 0 ? 'Brak w magazynie' : 'Dodaj do koszyka'}
          </button>
        </div>
      `;
      elements.cardsContainer.appendChild(cardElement);
    });
    
    renderPagination();
  }

  // Paginacja
  function renderPagination() {
    const totalPages = Math.ceil(filteredCards.length / cardsPerPage);
    const oldPagination = document.querySelector('.pagination');
    if (oldPagination) oldPagination.remove();
    if (totalPages <= 1) return;

    const pagination = document.createElement('div');
    pagination.className = 'pagination';
    
    pagination.innerHTML += `
      <button class="page-btn ${currentPage === 1 ? 'disabled' : ''}" 
              data-page="${currentPage - 1}" 
              ${currentPage === 1 ? 'disabled' : ''}>
        &laquo;
      </button>
    `;

    for (let i = 1; i <= totalPages; i++) {
      pagination.innerHTML += `
        <button class="page-btn ${i === currentPage ? 'active' : ''}" 
                data-page="${i}">
          ${i}
        </button>
      `;
    }

    pagination.innerHTML += `
      <button class="page-btn ${currentPage === totalPages ? 'disabled' : ''}" 
              data-page="${currentPage + 1}" 
              ${currentPage === totalPages ? 'disabled' : ''}>
        &raquo;
      </button>
    `;

    elements.cardsContainer.after(pagination);
  }

  // Event listeners
  function setupEventListeners() {
    elements.search.addEventListener('input', () => {
      currentPage = 1;
      filterCards();
    });
    
    elements.sort.addEventListener('change', () => {
      currentPage = 1;
      sortCards();
      renderCards();
    });
    
    elements.mainCategory.addEventListener('change', () => {
      currentPage = 1;
      updateSubCategories();
      filterCards();
    });
    
    elements.subCategory.addEventListener('change', () => {
      currentPage = 1;
      filterCards();
    });
    
    elements.cartButton.addEventListener('click', () => {
      elements.cartModal.style.display = 'block';
      elements.cartButton.setAttribute('aria-expanded', 'true');
    });
    
    elements.closeModal.addEventListener('click', () => {
      elements.cartModal.style.display = 'none';
      elements.cartButton.setAttribute('aria-expanded', 'false');
    });
    
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('add-to-cart')) {
        const cardId = e.target.getAttribute('data-id');
        addToCart(cardId);
      }
      if (e.target.classList.contains('page-btn')) {
        e.preventDefault();
        currentPage = parseInt(e.target.dataset.page);
        renderCards();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
    
    elements.checkoutBtn.addEventListener('click', () => {
      alert('Funkcjonalność płatności będzie zaimplementowana w przyszłości!');
    });
    
    window.addEventListener('click', (e) => {
      if (e.target === elements.cartModal) {
        elements.cartModal.style.display = 'none';
        elements.cartButton.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Filtrowanie kart
  function filterCards() {
    const searchTerm = elements.search.value.toLowerCase();
    const mainCategory = elements.mainCategory.value;
    const subCategory = elements.subCategory.value;
    
    filteredCards = allCards.filter(card => {
      const matchesSearch = card.name.toLowerCase().includes(searchTerm) || 
                          (card.description && card.description.toLowerCase().includes(searchTerm));
      
      let matchesMainCategory = true;
      if (mainCategory !== 'all') {
        if (mainCategory === 'pokemon') matchesMainCategory = pokemonCards.includes(card);
        else if (mainCategory === 'energy') matchesMainCategory = energyCards.includes(card);
        else if (mainCategory === 'trainer') matchesMainCategory = trainerCards.includes(card);
      }
      
      let matchesSubCategory = true;
      if (subCategory !== 'all' && card.type) {
        matchesSubCategory = card.type.toLowerCase() === subCategory.toLowerCase();
      }
      
      return matchesSearch && matchesMainCategory && matchesSubCategory;
    });
    
    sortCards();
    renderCards();
  }

  // Sortowanie kart
  function sortCards() {
    const sortValue = elements.sort.value;
    
    filteredCards.sort((a, b) => {
      switch (sortValue) {
        case 'name-asc': return a.name.localeCompare(b.name);
        case 'name-desc': return b.name.localeCompare(a.name);
        case 'price-asc': return a.price - b.price;
        case 'price-desc': return b.price - a.price;
        default: return 0;
      }
    });
  }

  // Aktualizacja podkategorii
  function updateSubCategories() {
    const mainCategory = elements.mainCategory.value;
    elements.subCategory.innerHTML = '<option value="all">Wszystkie podkategorie</option>';
    
    if (mainCategory === 'all') return;
    
    let types = [];
    if (mainCategory === 'pokemon') {
      types = [...new Set(pokemonCards.map(card => card.type))];
    } else if (mainCategory === 'energy') {
      types = [...new Set(energyCards.map(card => card.type))];
    } else if (mainCategory === 'trainer') {
      types = [...new Set(trainerCards.map(card => card.type))];
    }
    
    types.forEach(type => {
      if (type) {
        const option = document.createElement('option');
        option.value = type.toLowerCase();
        option.textContent = type;
        elements.subCategory.appendChild(option);
      }
    });
  }

  // Koszyk
  function addToCart(cardId) {
    const card = allCards.find(c => c.id === cardId);
    if (!card) return;

    if (card.available <= 0 && (!card.holoAvailable || card.holoAvailable <= 0)) {
      alert('Brak dostępnych sztuk!');
      return;
    }

    const isHolo = card.holoAvailable > 0 && confirm(`Czy chcesz dodać wersję holo? (Dostępne: ${card.holoAvailable})`);

    if (isHolo) {
      const existingHoloItem = cart.find(item => item.id === cardId && item.isHolo);
      if (existingHoloItem) {
        if (existingHoloItem.quantity >= card.holoAvailable) {
          alert('Nie można dodać więcej kart holo niż dostępne!');
          return;
        }
        existingHoloItem.quantity += 1;
      } else {
        cart.push({
          id: cardId,
          name: card.name + " (Holo)",
          price: card.price * 1.5,
          image: card.image,
          quantity: 1,
          isHolo: true
        });
      }
      card.holoAvailable -= 1;
    } else {
      const existingItem = cart.find(item => item.id === cardId && !item.isHolo);
      if (existingItem) {
        if (existingItem.quantity >= card.available) {
          alert('Nie można dodać więcej sztuk niż dostępne!');
          return;
        }
        existingItem.quantity += 1;
      } else {
        cart.push({
          id: cardId,
          name: card.name,
          price: card.price,
          image: card.image,
          quantity: 1,
          isHolo: false
        });
      }
      card.available -= 1;
    }

    updateCart();
    renderCards();
    
    elements.cartButton.classList.add('animate-bounce');
    setTimeout(() => {
      elements.cartButton.classList.remove('animate-bounce');
    }, 1000);
  }

  function updateCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    
    elements.cartItems.innerHTML = '';
    let totalAmount = 0;
    
    if (cart.length === 0) {
      elements.cartItems.innerHTML = '<p class="empty-cart">Twój koszyk jest pusty</p>';
    } else {
      cart.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item';
        itemElement.innerHTML = `
          <img src="${item.image}" alt="${item.name}" class="cart-item-image">
          <div class="cart-item-info">
            <h4>${item.name} ${item.isHolo ? '<span class="holo-indicator">(Holo)</span>' : ''}</h4>
            <p>${item.price.toFixed(2)} PLN x ${item.quantity}</p>
            <button class="remove-from-cart" data-id="${item.id}" data-holo="${item.isHolo}">Usuń</button>
          </div>
        `;
        elements.cartItems.appendChild(itemElement);
        
        totalAmount += item.price * item.quantity;
      });
    }
    
    elements.totalAmount.textContent = `${totalAmount.toFixed(2)} PLN`;
    
    if (cart.length > 0) {
      const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
      elements.cartButton.setAttribute('data-count', itemCount);
    } else {
      elements.cartButton.removeAttribute('data-count');
    }
    
    document.querySelectorAll('.remove-from-cart').forEach(button => {
      button.addEventListener('click', (e) => {
        const itemId = e.target.getAttribute('data-id');
        const isHolo = e.target.getAttribute('data-holo') === 'true';
        
        const card = allCards.find(c => c.id === itemId);
        if (card) {
          if (isHolo) {
            card.holoAvailable += 1;
          } else {
            card.available += 1;
          }
        }
        
        cart = cart.filter(item => !(item.id === itemId && item.isHolo === isHolo));
        updateCart();
        renderCards();
      });
    });
  }

  // Start aplikacji
  init();
});