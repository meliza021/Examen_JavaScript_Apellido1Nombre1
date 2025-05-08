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
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        .detail-container {
          background-color: #f3e8ff;
          border-radius: 1rem;
          box-shadow: 0 4px 10px rgba(160, 100, 200, 0.2);
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
          color: #8b5cf6;
          text-align: center;
        }

        .placeholder svg {
          margin-bottom: 15px;
          fill: white;
          width: 50px;
          height: 50px;
        }

        .article {
          display: none;
          opacity: 0;
          transform: translateY(10px);
          transition: opacity 0.4s ease, transform 0.4s ease;
        }

        .article.visible {
          display: block;
          opacity: 1;
          transform: translateY(0);
        }

        .header {
          margin-bottom: 20px;
          border-bottom: 2px solid #ddd6fe;
          padding-bottom: 15px;
        }

        h2 {
          color: #7e22ce;
          margin: 0 0 10px;
          font-size: 1.7rem;
        }

        .meta {
          display: flex;
          justify-content: space-between;
          color: #6b21a8;
          font-size: 0.9rem;
        }

        .category-badge {
          background-color: white;
          color: #6b21a8;
          padding: 4px 12px;
          border-radius: 999px;
          font-weight: 600;
          font-size: 10px;
        }

        .content {
          line-height: 1.7;
          color: #4c1d95;
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
    const article = this.shadowRoot.querySelector('#article');
    article.classList.remove('visible');
    setTimeout(() => (article.style.display = 'none'), 300); // para que se desvanezca
  }

  showArticle() {
    const placeholder = this.shadowRoot.querySelector('#placeholder');
    placeholder.style.display = 'none';

    const article = this.shadowRoot.querySelector('#article');
    article.style.display = 'block'; // primero se muestra
    requestAnimationFrame(() => {
      article.classList.add('visible'); // luego se activa animación
    });
  }
}

customElements.define('campus-news-detail', CampusNewsDetail);
