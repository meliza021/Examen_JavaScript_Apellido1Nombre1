// Componente de depuración para mostrar el estado interno de la aplicación
class CampusDebugPanel extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });
    
    this.state = {
      isVisible: false,
      category: null,
      selectedId: null,
      total: 0,
      filtered: 0
    };
    
    shadow.innerHTML = `
      <style>
        :host {
          display: block;
          margin-top: 1.5rem;
        }
        
        .debug-container {
          background-color: #4a4a4a;
          color: white;
          border-radius: 4px;
          overflow: hidden;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
        }
        
        .debug-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 15px;
          background-color: #e83e8c;
          cursor: pointer;
        }
        
        .debug-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: bold;
        }
        
        .debug-title svg {
          width: 16px;
          height: 16px;
          fill: currentColor;
        }
        
        .toggle-btn {
          background: transparent;
          border: none;
          color: white;
          cursor: pointer;
          font-size: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          transition: background-color 0.2s;
        }
        
        .toggle-btn:hover {
          background-color: rgba(255, 255, 255, 0.2);
        }
        
        .debug-content {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.3s ease-in-out;
        }
        
        .debug-content.visible {
          max-height: 200px;
        }
        
        .debug-info {
          padding: 15px;
          font-family: monospace;
          font-size: 14px;
        }
        
        table {
          width: 100%;
          border-collapse: collapse;
        }
        
        tr:not(:last-child) {
          border-bottom: 1px solid #666;
        }
        
        td {
          padding: 8px 5px;
        }
        
        td:first-child {
          font-weight: bold;
          color: #f8bbda;
          width: 40%;
        }
        
        [role="button"] {
          cursor: pointer;
        }
      </style>
      
      <div class="debug-container" aria-live="polite">
        <div class="debug-header" role="button" tabindex="0" aria-expanded="false" aria-controls="debug-content">
          <div class="debug-title">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
            </svg>
            Panel de Depuración
          </div>
          <button class="toggle-btn" aria-label="Mostrar/ocultar panel de depuración">
            <span>+</span>
          </button>
        </div>
        
        <div id="debug-content" class="debug-content">
          <div class="debug-info">
            <table>
              <tr>
                <td>Categoría actual:</td>
                <td id="current-category">—</td>
              </tr>
              <tr>
                <td>ID artículo seleccionado:</td>
                <td id="selected-id">—</td>
              </tr>
              <tr>
                <td>Total artículos:</td>
                <td id="total-articles">0</td>
              </tr>
              <tr>
                <td>Artículos filtrados:</td>
                <td id="filtered-articles">0</td>
              </tr>
            </table>
          </div>
        </div>
      </div>
    `;
    
    // Vincular métodos
    this.handleDebugUpdate = this.handleDebugUpdate.bind(this);
    this.toggleVisibility = this.toggleVisibility.bind(this);
  }
  
  connectedCallback() {
    document.addEventListener('campus:debug-update', this.handleDebugUpdate);
    
    const toggleBtn = this.shadowRoot.querySelector('.debug-header');
    toggleBtn.addEventListener('click', this.toggleVisibility);
    toggleBtn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.toggleVisibility();
      }
    });
  }
  
  disconnectedCallback() {
    document.removeEventListener('campus:debug-update', this.handleDebugUpdate);
    this.shadowRoot.querySelector('.debug-header').removeEventListener('click', this.toggleVisibility);
  }
  
  handleDebugUpdate(event) {
    const { category, selectedId, total, filtered } = event.detail;
    
    this.state = {
      ...this.state,
      category,
      selectedId,
      total,
      filtered
    };
    
    this.updateUI();
  }
  
  updateUI() {
    this.shadowRoot.querySelector('#current-category').textContent = this.state.category || '—';
    this.shadowRoot.querySelector('#selected-id').textContent = this.state.selectedId || '—';
    this.shadowRoot.querySelector('#total-articles').textContent = this.state.total;
    this.shadowRoot.querySelector('#filtered-articles').textContent = this.state.filtered;
  }
  
  toggleVisibility() {
    this.state.isVisible = !this.state.isVisible;
    
    const debugContent = this.shadowRoot.querySelector('#debug-content');
    const toggleButton = this.shadowRoot.querySelector('.toggle-btn span');
    const header = this.shadowRoot.querySelector('.debug-header');
    
    if (this.state.isVisible) {
      debugContent.classList.add('visible');
      toggleButton.textContent = '−';
      header.setAttribute('aria-expanded', 'true');
    } else {
      debugContent.classList.remove('visible');
      toggleButton.textContent = '+';
      header.setAttribute('aria-expanded', 'false');
    }
  }
}

customElements.define('campus-debug-panel', CampusDebugPanel);