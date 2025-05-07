// Componente para mostrar el detalle de un artículo seleccionado
class CampusNewsDetail extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });
    
    shadow.innerHTML = `
      <style>
        :host {
          display: block;
          flex: 2;
          min-width: 400px;
        }
        
        .detail-container {
          background-color: white;
          border-radius: 4px;
          box-shadow: 0 2px 5px rgba(232, 62, 140, 0.1);
          padding: 20px;
          height: 100%;
          position: relative;
        }
        
        .placeholder {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          height: 100%;
          min-height: 300px;
          color: #999;
          text-align: center;
        }
        
        .placeholder svg {
          margin-bottom: 15px;
          fill: #ffc0cb;
          width: 50px;
          height: 50px;
        }
        
        .article {
          display: none;
        }
        
        .article.visible {
          display: block;
        }
        
        .header {
          margin-bottom: 20px;
          border-bottom: 2px solid #ffd6e7;
          padding-bottom: 15px;
        }
        
        h2 {
          color: #e83e8c;
          margin: 0 0 10px;
          font-size: 1.5rem;
        }
        
        .meta {
          display: flex;
          justify-content: space-between;
          color: #777;
          font-size: 0.9rem;
        }
        
        .category-badge {
          background-color: #ffd6e7;
          color: #c71f66;
          padding: 3px 10px;
          border-radius: 15px;
          font-weight: 500;
        }
        
        .content {
          line-height: 1.6;
        }
        
        .content p {
          margin-bottom: 15px;
        }
      </style>
      
      <div class="detail-container">
        <div id="placeholder" class="placeholder">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/>
            <path d="M14 17H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
          </svg>
          <p>Selecciona una noticia para ver los detalles</p>
        </div>
        
        <div id="article" class="article">
          <div class="header">
            <h2 id="title"></h2>
            <div class="meta">
              <span id="author-date"></span>
              <span id="category" class="category-badge"></span>
            </div>
          </div>
          <div id="content" class="content"></div>
        </div>
      </div>
    `;
    
    this.handleArticleUpdated = this.handleArticleUpdated.bind(this);
  }
  
  connectedCallback() {
    document.addEventListener('campus:article-updated', this.handleArticleUpdated);
  }
  
  disconnectedCallback() {
    document.removeEventListener('campus:article-updated', this.handleArticleUpdated);
  }
  
  handleArticleUpdated(event) {
    const article = event.detail.article;
    
    if (!article) {
      this.showPlaceholder();
      return;
    }
    
    this.shadowRoot.querySelector('#title').textContent = article.title;
    this.shadowRoot.querySelector('#author-date').textContent = `${article.author} • ${article.date}`;
    this.shadowRoot.querySelector('#category').textContent = article.category;
    this.shadowRoot.querySelector('#content').innerHTML = article.content;
    
    this.showArticle();
  }
  
  showPlaceholder() {
    this.shadowRoot.querySelector('#placeholder').style.display = 'flex';
    this.shadowRoot.querySelector('#article').classList.remove('visible');
  }
  
  showArticle() {
    this.shadowRoot.querySelector('#placeholder').style.display = 'none';
    this.shadowRoot.querySelector('#article').classList.add('visible');
  }
}

customElements.define('campus-news-detail', CampusNewsDetail);