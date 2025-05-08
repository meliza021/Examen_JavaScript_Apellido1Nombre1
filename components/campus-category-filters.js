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
          background-color: #f7f3ff;
          border-bottom: 2px solid #d4c3ff;
          border-radius: 12px;
        }

        .filter-btn {
          background-color: #fff;
          border: 2px solid #cdbfff;
          border-radius: 20px;
          color: #6b4eff;
          cursor: pointer;
          font-size: 0.9rem;
          font-weight: 500;
          padding: 8px 16px;
          transition: all 0.2s ease;
        }

        .filter-btn:hover {
          background-color: #e7ddff;
        }

        .filter-btn.active {
          background-color: #6b4eff;
          border-color: #6b4eff;
          color: white;
        }

        h3 {
          margin: 0 0 12px 0;
          color: #6b4eff;
          font-size: 1.1rem;
          width: 100%;
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

    const buttons = this.shadowRoot.querySelectorAll('.filter-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    this.dispatchEvent(new CustomEvent('campus:category-change', {
      detail: { category },
      bubbles: true,
      composed: true
    }));
  }
}

customElements.define('campus-category-filters', CampusCategoryFilters);
