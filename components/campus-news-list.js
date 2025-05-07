// Componente para mostrar la lista de noticias
class CampusNewsList extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });
    
    this.articles = [];
    this.selectedArticleId = null;
    
    shadow.innerHTML = `
      <style>
        :host {
          display: block;
          flex: 1;
          min-width: 300px;
        }
        
        .news-list {
          background-color: white;
          border-radius: 4px;
          box-shadow: 0 2px 5px rgba(232, 62, 140, 0.1);
          max-height: 600px;
          overflow-y: auto;
        }
        
        .list-header {
          padding: 15px;
          background-color: #f8bbda;
          color: #c71f66;
          font-weight: bold;
          border-bottom: 1px solid #ffc0cb;
        }
        
        .no-articles {
          padding: 30px;
          text-align: center;
          color: #777;
          font-style: italic;
        }
      </style>
      
      <div class="news-list">
        <div class="list-header">Últimas Noticias</div>
        <div id="articles-container"></div>
      </div>
    `;
    
    // Vincular métodos
    this.handleArticlesFiltered = this.handleArticlesFiltered.bind(this);
    this.handleArticleSelect = this.handleArticleSelect.bind(this);
    this.renderArticles = this.renderArticles.bind(this);
  }
  
  connectedCallback() {
    // Escuchar eventos relevantes
    document.addEventListener('campus:articles-filtered', this.handleArticlesFiltered);
    document.addEventListener('campus:article-select', this.handleArticleSelect);
  }
  
  disconnectedCallback() {
    document.removeEventListener('campus:articles-filtered', this.handleArticlesFiltered);
    document.removeEventListener('campus:article-select', this.handleArticleSelect);
  }
  
  handleArticlesFiltered(event) {
    this.articles = event.detail.articles;
    this.renderArticles();
    
    // Si hay artículos y ninguno está seleccionado, seleccionar el primero
    if (this.articles.length > 0 && !this.selectedArticleId) {
      this.dispatchEvent(new CustomEvent('campus:article-select', {
        detail: { id: this.articles[0].id },
        bubbles: true,
        composed: true
      }));
    }
  }
  
  handleArticleSelect(event) {
    this.selectedArticleId = event.detail.id;
    
    // Actualizar la UI para mostrar el artículo seleccionado
    const items = this.shadowRoot.querySelectorAll('campus-news-item');
    items.forEach(item => {
      if (parseInt(item.getAttribute('article-id')) === this.selectedArticleId) {
        item.setAttribute('selected', '');
      } else {
        item.removeAttribute('selected');
      }
    });
  }
  
  renderArticles() {
    const container = this.shadowRoot.querySelector('#articles-container');
    container.innerHTML = '';
    
    if (this.articles.length === 0) {
      const noArticles = document.createElement('div');
      noArticles.className = 'no-articles';
      noArticles.textContent = 'No hay noticias disponibles en esta categoría.';
      container.appendChild(noArticles);
      return;
    }
    
    this.articles.forEach(article => {
      const itemElement = document.createElement('campus-news-item');
      itemElement.setAttribute('article-id', article.id);
      itemElement.setAttribute('title', article.title);
      itemElement.setAttribute('summary', article.summary);
      itemElement.setAttribute('date', article.date);
      itemElement.setAttribute('category', article.category);
      
      if (article.id === this.selectedArticleId) {
        itemElement.setAttribute('selected', '');
      }
      
      container.appendChild(itemElement);
    });
  }
}

customElements.define('campus-news-list', CampusNewsList);