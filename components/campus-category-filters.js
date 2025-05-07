// Componente para filtrar artículos por categoría
class CampusCategoryFilters extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });
    
    this.categories = ['Todas']; // Inicialmente solo tenemos 'Todas'
    
    shadow.innerHTML = `
      <style>
        :host {
          display: block;
          margin-bottom: 1.5rem;
        }
        
        .filters-container {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          padding: 15px;
          background-color: white;
          border-bottom: 1px solid #ffc0cb;
        }
        
        .filter-btn {
          background-color: #fff;
          border: 2px solid #ffd6e7;
          border-radius: 20px;
          color: #e83e8c;
          cursor: pointer;
          font-size: 0.9rem;
          font-weight: 500;
          padding: 8px 16px;
          transition: all 0.2s ease;
        }
        
        .filter-btn:hover {
          background-color: #ffd6e7;
        }
        
        .filter-btn.active {
          background-color: #e83e8c;
          border-color: #e83e8c;
          color: white;
        }
        
        h3 {
          margin: 0 0 12px 0;
          color: #e83e8c;
          font-size: 1.1rem;
        }
      </style>
      
      <div class="filters-container">
        <h3>Categorías:</h3>
        <div id="filters-buttons"></div>
      </div>
    `;
    
    // Vincular métodos
    this.handleAppReady = this.handleAppReady.bind(this);
    this.handleFilterClick = this.handleFilterClick.bind(this);
    this.extractCategories = this.extractCategories.bind(this);
    this.renderFilters = this.renderFilters.bind(this);
  }
  
  connectedCallback() {
    // Escuchar cuando la app esté lista con los datos
    document.addEventListener('campus:app-ready', this.handleAppReady);
    document.addEventListener('campus:data-loaded', this.extractCategories);
  }
  
  disconnectedCallback() {
    document.removeEventListener('campus:app-ready', this.handleAppReady);
    document.removeEventListener('campus:data-loaded', this.extractCategories);
  }
  
  handleAppReady() {
    this.renderFilters();
  }
  
  extractCategories(event) {
    const articles = event.detail.articles;
    const uniqueCategories = [...new Set(articles.map(article => article.category))];
    this.categories = ['Todas', ...uniqueCategories.sort()];
  }
  
  renderFilters() {
    const filtersContainer = this.shadowRoot.querySelector('#filters-buttons');
    filtersContainer.innerHTML = '';
    
    this.categories.forEach(category => {
      const button = document.createElement('button');
      button.textContent = category;
      button.className = category === 'Todas' ? 'filter-btn active' : 'filter-btn';
      button.dataset.category = category;
      button.addEventListener('click', this.handleFilterClick);
      filtersContainer.appendChild(button);
    });
  }
  
  handleFilterClick(event) {
    const category = event.target.dataset.category;
    
    // Actualizar la UI primero
    const buttons = this.shadowRoot.querySelectorAll('.filter-btn');
    buttons.forEach(btn => {
      btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Emitir evento de cambio de categoría
    this.dispatchEvent(new CustomEvent('campus:category-change', {
      detail: { category },
      bubbles: true,
      composed: true
    }));
  }
}

customElements.define('campus-category-filters', CampusCategoryFilters);