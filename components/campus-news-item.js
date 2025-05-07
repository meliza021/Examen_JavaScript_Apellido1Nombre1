// Componente para mostrar un artículo individual en la lista
class CampusNewsItem extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });
    
    shadow.innerHTML = `
      <style>
        :host {
          display: block;
        }
        
        .item {
          padding: 16px;
          border-bottom: 1px solid #ffd6e7;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .item:hover {
          background-color: #fff0f5;
        }
        
        .item.active {
          border-left: 4px solid #e83e8c;
          background-color: #fff0f5;
        }
        
        h3 {
          margin: 0 0 8px;
          font-size: 16px;
          color: #4a4a4a;
        }
        
        p {
          margin: 0;
          font-size: 14px;
          color: #777;
        }
        
        .meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 8px;
          font-size: 12px;
        }
        
        .date {
          color: #999;
        }
        
        .category {
          background-color: #ffd6e7;
          color: #c71f66;
          padding: 3px 8px;
          border-radius: 12px;
          font-weight: 500;
        }
      </style>
      
      <div class="item">
        <h3 id="title"></h3>
        <p id="summary"></p>
        <div class="meta">
          <span class="date" id="date"></span>
          <span class="category" id="category"></span>
        </div>
      </div>
    `;
    
    this.handleClick = this.handleClick.bind(this);
  }
  
  static get observedAttributes() {
    return ['title', 'summary', 'date', 'category', 'selected', 'article-id'];
  }
  
  connectedCallback() {
    this.shadowRoot.querySelector('.item').addEventListener('click', this.handleClick);
    this.render();
  }
  
  disconnectedCallback() {
    this.shadowRoot.querySelector('.item').removeEventListener('click', this.handleClick);
  }
  
  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.render();
    }
  }
  
  render() {
    const title = this.getAttribute('title') || '';
    const summary = this.getAttribute('summary') || '';
    const date = this.getAttribute('date') || '';
    const category = this.getAttribute('category') || '';
    const isSelected = this.hasAttribute('selected');
    
    this.shadowRoot.querySelector('#title').textContent = title;
    this.shadowRoot.querySelector('#summary').textContent = summary;
    this.shadowRoot.querySelector('#date').textContent = date;
    this.shadowRoot.querySelector('#category').textContent = category;
    
    const itemElement = this.shadowRoot.querySelector('.item');
    if (isSelected) {
      itemElement.classList.add('active');
    } else {
      itemElement.classList.remove('active');
    }
  }
  
  handleClick() {
    const articleId = parseInt(this.getAttribute('article-id'));
    
    this.dispatchEvent(new CustomEvent('campus:article-select', {
      detail: { id: articleId },
      bubbles: true,
      composed: true
    }));
  }
}

customElements.define('campus-news-item', CampusNewsItem);