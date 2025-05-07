// Componente principal que orquesta toda la aplicación
class CampusNewsApp extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });
    
    // Estado global de la aplicación
    this.state = {
      articles: [],
      currentCategory: 'Todas',
      currentArticleId: null,
      filteredArticles: []
    };

    shadow.innerHTML = `
      <style>
        :host {
          display: block;
          font-family: var(--font-primary, 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif);
        }
        
        .app-container {
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 4px 10px rgba(232, 62, 140, 0.2);
          overflow: hidden;
          margin-bottom: 2rem;
        }
        
        ::slotted(.content-container) {
          display: flex;
          flex-wrap: wrap;
        }
        
        @media (max-width: 768px) {
          ::slotted(.content-container) {
            flex-direction: column;
          }
        }
      </style>
      
      <div class="app-container">
        <slot></slot>
      </div>
    `;
    
    // Vincular métodos al contexto actual
    this.handleCategoryChange = this.handleCategoryChange.bind(this);
    this.handleArticleSelect = this.handleArticleSelect.bind(this);
    this.updateDebugInfo = this.updateDebugInfo.bind(this);
    this.handleDataLoaded = this.handleDataLoaded.bind(this);
  }
  
  connectedCallback() {
    // Escuchar eventos personalizados
    document.addEventListener('campus:category-change', this.handleCategoryChange);
    document.addEventListener('campus:article-select', this.handleArticleSelect);
    document.addEventListener('campus:data-loaded', this.handleDataLoaded);
  }
  
  disconnectedCallback() {
    // Limpiar listeners al desmontar el componente
    document.removeEventListener('campus:category-change', this.handleCategoryChange);
    document.removeEventListener('campus:article-select', this.handleArticleSelect);
    document.removeEventListener('campus:data-loaded', this.handleDataLoaded);
  }
  
  handleDataLoaded(event) {
    this.state.articles = event.detail.articles;
    this.filterArticles();
    
    // Emitir evento para actualizar la UI
    this.dispatchEvent(new CustomEvent('campus:app-ready', {
      bubbles: true,
      composed: true
    }));
    
    this.updateDebugInfo();
  }
  
  handleCategoryChange(event) {
    this.state.currentCategory = event.detail.category;
    this.filterArticles();
    this.updateDebugInfo();
  }
  
  handleArticleSelect(event) {
    this.state.currentArticleId = event.detail.id;
    
    // Emitir evento para actualizar el detalle del artículo
    this.dispatchEvent(new CustomEvent('campus:article-updated', {
      detail: {
        article: this.state.articles.find(article => article.id === this.state.currentArticleId)
      },
      bubbles: true,
      composed: true
    }));
    
    this.updateDebugInfo();
  }
  
  filterArticles() {
    if (this.state.currentCategory === 'Todas') {
      this.state.filteredArticles = [...this.state.articles];
    } else {
      this.state.filteredArticles = this.state.articles.filter(
        article => article.category === this.state.currentCategory
      );
    }
    
    // Emitir evento para actualizar la lista de artículos
    this.dispatchEvent(new CustomEvent('campus:articles-filtered', {
      detail: {
        articles: this.state.filteredArticles,
        category: this.state.currentCategory
      },
      bubbles: true,
      composed: true
    }));
  }
  
  updateDebugInfo() {
    // Emitir evento para actualizar el panel de depuración
    this.dispatchEvent(new CustomEvent('campus:debug-update', {
      detail: {
        category: this.state.currentCategory,
        selectedId: this.state.currentArticleId,
        total: this.state.articles.length,
        filtered: this.state.filteredArticles.length
      },
      bubbles: true,
      composed: true
    }));
  }
}

customElements.define('campus-news-app', CampusNewsApp);