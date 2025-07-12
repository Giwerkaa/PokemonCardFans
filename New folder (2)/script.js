const appData = {
  currentLang: 'pl',
  texts: {
    pl: {
      headerTitle: "PokemonCardFans",  // Zmienione na PokemonCardFans
      description: "Zawartość na stronie to wyłącznie moje karty, które uzbierałem.",
      tabs: ["Karty energii", "Karty Pokemon", "Trener", "Wspieraj twórcę"],
      energyCategories: ["Trawa", "Ogień", "Błyskawica", "Psychiczna", "Walcząca", "Mroczna", "Metal"],
      pokemonCategories: ["Zwykłe karty", "Holo", "V", "vStar", "vmax", "JUMBO CARD"],
      trainerCategories: ["Supporter", "Item Tool", "Stadium"],
      backToTop: "Powrót na górę",
      chat: {
        title: "Zapytaj o karty",
        name: "Imię",
        email: "Email",
        message: "Twoja wiadomość",
        submit: "Wyślij wiadomość",
        defaultMsg: "Interesuje mnie zakup kart, proszę o więcej informacji."
      }
    },
    en: {
      headerTitle: "PokemonCardFans",  // Zmienione na PokemonCardFans
      description: "The content on this site is my personal card collection.",
      tabs: ["Energy Cards", "Pokemon Cards", "Trainer", "Support"],
      energyCategories: ["Grass", "Fire", "Lightning", "Psychic", "Fighting", "Darkness", "Metal"],
      pokemonCategories: ["Regular cards", "Holo", "V", "vStar", "vmax", "JUMBO CARD"],
      trainerCategories: ["Supporter", "Item Tool", "Stadium"],
      backToTop: "Back to top",
      chat: {
        title: "Ask about cards",
        name: "Name",
        email: "Email",
        message: "Your message",
        submit: "Send message",
        defaultMsg: "I'm interested in buying cards, please provide more info."
      }
    }
  },
  cards: {
    grass: [{ id: 1, name: "Energia Trawa", image: "images/grass-energy.jpg" }],  // Dodano images/
    fire: [{ id: 2, name: "Energia Ogień", image: "images/fire-energy.jpg" }],
    lightning: [{ id: 3, name: "Energia Błyskawica", image: "images/lightning-energy.jpg" }],
    water: [{ id: 4, name: "Energia Woda", image: "images/water-energy.jpg" }],
    psychic: [{ id: 5, name: "Energia Psychiczna", image: "images/psychic-energy.jpg" }],
    fighting: [{ id: 6, name: "Energia Walcząca", image: "images/fighting-energy.jpg" }],
    darkness: [{ id: 7, name: "Energia Mroczna", image: "images/darkness-energy.jpg" }],
    metal: [{ id: 8, name: "Energia Metal", image: "images/metal-energy.jpg" }],
    
    pokemon: {
      regular: [],
      holo: [],
      v: [],
      vstar: [],
      vmax: [],
      jumbo: []
    },
    
    trainer: {
      supporter: [],
      item: [],
      stadium: []
    }
  }
};

// Inicjalizacja po załadowaniu DOM
document.addEventListener('DOMContentLoaded', function() {
  console.log("Strona załadowana!"); // Debugowanie
  
  // Inicjalizacja podstawowych funkcji
  initTabs();
  initLanguage();
  initChat();
  initBackToTop();
  
  // Ładowanie domyślnych kart
  loadCards('grass');
  
  // Inicjalizacja podzakładek
  initAllSubtabs();
});

function initAllSubtabs() {
  // Inicjalizacja wszystkich podzakładek
  initSubtabs('subtabs-1'); // Dla energii
  initSubtabs('subtabs-2'); // Dla Pokemonów
  initSubtabs('subtabs-3'); // Dla trenerów
  
  // Dodatkowe debugowanie
  console.log("Podzakładki zainicjalizowane");
}

// Reszta funkcji pozostaje bez zmian (initSubtabs, initTabs, initLanguage, etc.)
// ... [tutaj wklej pozostałe funkcje bez zmian]

function initSubtabs(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const subtabs = container.querySelectorAll('.subtab');
  
  subtabs.forEach(tab => {
    tab.addEventListener('click', function() {
      // Usuń active ze wszystkich podzakładek w tej grupie
      subtabs.forEach(t => t.classList.remove('active'));
      // Dodaj active do klikniętej
      this.classList.add('active');
      
      const type = this.dataset.subtab;
      loadCards(type);
    });
  });
}

function initTabs() {
  const setupTabs = (containerSelector, tabSelector, contentSelector) => {
    document.querySelectorAll(containerSelector).forEach(container => {
      const tabs = container.querySelectorAll(tabSelector);
      const contents = container.querySelectorAll(contentSelector);
      
      tabs.forEach((tab, index) => {
        tab.addEventListener('click', () => {
          tabs.forEach(t => t.classList.remove('active'));
          contents.forEach(c => c.classList.remove('active'));
          tab.classList.add('active');
          contents[index].classList.add('active');
        });
      });
    });
  };

  setupTabs('.tabs-container', '.tab', '.tab-content');
  setupTabs('.content', '.subtab', '.subcontent-item');
}

function initLanguage() {
  const updateLanguage = (lang) => {
    appData.currentLang = lang;
    const texts = appData.texts[lang];
    
    document.getElementById('header-title').textContent = texts.headerTitle;
    document.getElementById('description').textContent = texts.description;
    
    document.querySelectorAll('.tab').forEach((tab, index) => {
      tab.textContent = texts.tabs[index];
    });
    
    // Aktualizacja podzakładek energii
    document.querySelectorAll('#subtabs-1 .subtab').forEach((subtab, index) => {
      subtab.textContent = texts.energyCategories[index];
    });
    
    // Aktualizacja podzakładek Pokemon
    document.querySelectorAll('#subtabs-2 .subtab').forEach((subtab, index) => {
      subtab.textContent = texts.pokemonCategories[index];
    });
    
    // Aktualizacja podzakładek Trener
    document.querySelectorAll('#subtabs-3 .subtab').forEach((subtab, index) => {
      subtab.textContent = texts.trainerCategories[index];
    });
    
    document.getElementById('back-to-top').title = texts.backToTop;
    document.getElementById('lang-pl').classList.toggle('active', lang === 'pl');
    document.getElementById('lang-en').classList.toggle('active', lang === 'en');
    
    updateChatLanguage();
  };

  document.getElementById('lang-pl').addEventListener('click', () => updateLanguage('pl'));
  document.getElementById('lang-en').addEventListener('click', () => updateLanguage('en'));
}

function updateChatLanguage() {
  const lang = appData.currentLang;
  const chatTexts = appData.texts[lang].chat;
  
  document.getElementById('chat-title').textContent = chatTexts.title;
  document.getElementById('name-label').textContent = chatTexts.name;
  document.getElementById('email-label').textContent = chatTexts.email;
  document.getElementById('message-label').textContent = chatTexts.message;
  document.getElementById('submit-btn').textContent = chatTexts.submit;
  document.getElementById('message').value = chatTexts.defaultMsg;
}

function initChat() {
  const chatButton = document.getElementById('chat-button');
  const chatWindow = document.getElementById('chat-window');
  const closeButton = document.querySelector('.close-chat');
  const contactForm = document.getElementById('contact-form');

  chatWindow.style.display = 'none';

  chatButton.addEventListener('click', () => {
    chatWindow.style.display = 'block';
    setTimeout(() => chatWindow.classList.add('show'), 10);
  });

  closeButton.addEventListener('click', () => {
    chatWindow.classList.remove('show');
    setTimeout(() => chatWindow.style.display = 'none', 300);
  });

  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    alert(`Wiadomość wysłana!\n\nEmail: ${document.getElementById('email').value}`);
    this.reset();
    chatWindow.classList.remove('show');
    setTimeout(() => chatWindow.style.display = 'none', 300);
  });
}

function initBackToTop() {
  const backButton = document.getElementById('back-to-top');
  window.addEventListener('scroll', () => {
    backButton.style.display = window.pageYOffset > 300 ? 'block' : 'none';
  });
  backButton.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

function loadCards(type = 'grass') {
  // Określ kategorię na podstawie typu
  let category = '';
  if (type.includes('pokemon-')) {
    category = 'pokemon';
    type = type.replace('pokemon-', '');
  } else if (type.includes('trainer-')) {
    category = 'trainer';
    type = type.replace('trainer-', '');
  } else {
    category = 'cards'; // Dla energii
  }

  const container = document.querySelector(`#${type} .card-gallery`);
  if (!container) {
    console.error(`Container not found for type: ${type}`);
    return;
  }

  container.innerHTML = '<div class="card-loading"><div class="loader"></div></div>';

  setTimeout(() => {
    let cards = [];
    if (category === 'cards') {
      cards = appData.cards[type] || [];
    } else {
      cards = appData[category][type] || [];
    }

    if (cards.length > 0) {
      container.innerHTML = cards.map(card => `
        <div class="card">
          <img src="${card.image}" alt="${card.name}" loading="lazy">
          <div class="card-info">${card.name}</div>
        </div>
      `).join('');
    } else {
      container.innerHTML = '<p>Brak kart do wyświetlenia.</p>';
    }
  }, 500);
}    