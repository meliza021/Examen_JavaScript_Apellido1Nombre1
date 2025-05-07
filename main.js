
import './components/campus-news-app.js';
import './components/campus-category-filters.js';
import './components/campus-news-list.js';
import './components/campus-news-item.js';
import './components/campus-news-detail.js';
import './components/campus-debug-panel.js';


let campusArticles = [];

fetch('data.json')
  .then(response => response.json())
  .then(data => {
    campusArticles = data.campusArticles;
    

    document.dispatchEvent(new CustomEvent('campus:data-loaded', {
      detail: { articles: campusArticles },
      bubbles: true,
      composed: true
    }));
  })
  //validaciones
  .catch(error => {
    console.error('Error al cargar los datos:', error);
    
    
    loadFallbackData();
  });

//estos son  por los que se cambian si no se encuentran losn datos que se requieren 
function loadFallbackData() {
  campusArticles = [
    {
      id: 1,
      title: "Delicias caseras",
      summary: "te invitamos a probar toda delicia en nuestra panaderia.",
      content: "<p>Este sábado 3 de mayo, la àsteleria delicias caseras abre sus puertas...</p>",
      author: "Sofia Cardenas ",
      date: "28 de abril, 2025",
      category: "pasteleria"
    },
    {
      id: 2,
      title: "pinochaso ",
      summary: "un lugar con los precio mas bajos del pais.",
      content: "<p>Tras meses de trabajo intenso...</p>",
      author: "Martines",
      date: "25 de abril, 2025",
      category: "Tienda"
    },
    {
      id: 3,
      title: "menos es mas",
      summary: "porque todo es barato.",
      content: "<p>que donde se encuentra eso ...</p>",
      author: "Pepe",
      date: "22 de abril, 2025",
      category: "mininegocio"
    }
  ];
  
  document.dispatchEvent(new CustomEvent('campus:data-loaded', {
    detail: { articles: campusArticles },
    bubbles: true,
    composed: true
  }));
}

// Asegurar que los Web Components se hayan cargado antes de inicializar
document.addEventListener('DOMContentLoaded', () => {
  console.log('Campus News App iniciada');
});