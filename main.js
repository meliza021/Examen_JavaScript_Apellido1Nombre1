// Importar los componentes
import './components/campus-news-app.js';
import './components/campus-category-filters.js';
import './components/campus-news-list.js';
import './components/campus-news-item.js';
import './components/campus-news-detail.js';
import './components/campus-debug-panel.js';

let campusArticles = [];

// Cargar noticias desde JSON y combinar con eventos de localStorage
fetch('data.json')
  .then(response => response.json())
  .then(data => {
    const jsonArticles = data.campusArticles || [];
    const userEvents = loadUserEventsAsArticles();
    campusArticles = [...jsonArticles, ...userEvents];

    document.dispatchEvent(new CustomEvent('campus:data-loaded', {
      detail: { articles: campusArticles },
      bubbles: true,
      composed: true
    }));
  })
  .catch(error => {
    console.error('Error al cargar los datos:', error);
    loadFallbackData();
});

function loadUserEventsAsArticles() {
  const events = JSON.parse(localStorage.getItem('events')) || [];

  return events.map(ev => ({
    id: ev.id,
    title: ev.name,
    summary: ev.startDate,
    content: `
      <p><strong>Lugar:</strong> ${ev.location}</p>
      <p><strong>Desde:</strong> ${ev.startDate}</p>
      <p><strong>Hasta:</strong> ${ev.endDate}</p>
      <p><strong>Horario:</strong> ${ev.times}</p>
      ${ev.entrepreneurs.length ? `<h4>Emprendimientos:</h4>` : ''}
      ${ev.entrepreneurs.map(ent => `
        <div>
          <p><strong>Nombre:</strong> ${ent.name}</p>
          <p><strong>Categoría:</strong> ${ent.category}</p>
          <p><strong>Descripción:</strong> ${ent.description}</p>
          <p><strong>Red social:</strong> <a href="${ent.social}" target="_blank">${ent.social}</a></p>
          <p><strong>Producto:</strong> ${ent.product.name}</p>
          <p><strong>Precio:</strong> $${ent.product.price}</p>
          <p><strong>Descripción:</strong> ${ent.product.description}</p>
          ${ent.product.photo ? `<img src="${ent.product.photo}" style="max-width: 100px;">` : ''}
        </div>
      `).join('')}
    `,
    author: "Usuario registrado",
    date: ev.startDate,
    category: "Eventos del usuario"
  }));
}

// Datos de respaldo en caso de error
function loadFallbackData() {
  const fallback = [
    {
      id: 1,
      title: "Feria \"Bucara Emprende\"",
      summary: "2021-11-06",
      content: "<p>2021-11-06</p>",
      author: "Oficina de Admisiones",
      date: "Salón Comunal del Barrio Bucaramanga, Comuna 8",
      category: "Evento organizado por el IMEBU..."
    }
    // ...otros artículos
  ];

  const userEvents = loadUserEventsAsArticles();
  campusArticles = [...fallback, ...userEvents];

  document.dispatchEvent(new CustomEvent('campus:data-loaded', {
    detail: { articles: campusArticles },
    bubbles: true,
    composed: true
  }));
}

document.addEventListener('DOMContentLoaded', () => {
  console.log('Campus News App iniciada');
});
