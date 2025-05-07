// Importar los componentes
import './components/campus-news-app.js';
import './components/campus-category-filters.js';
import './components/campus-news-list.js';
import './components/campus-news-item.js';
import './components/campus-news-detail.js';
import './components/campus-debug-panel.js';

// Cargar los datos desde el archivo JSON
let campusArticles = [];

fetch('data.json')
  .then(response => response.json())
  .then(data => {
    campusArticles = data.campusArticles;
    
    // Dispatch un evento personalizado para notificar que los datos están listos
    document.dispatchEvent(new CustomEvent('campus:data-loaded', {
      detail: { articles: campusArticles },
      bubbles: true,
      composed: true
    }));
  })
  .catch(error => {
    console.error('Error al cargar los datos:', error);
    
    // En caso de error, cargar datos de respaldo
    loadFallbackData();
  });

// Datos de respaldo en caso de que falle la carga del JSON
function loadFallbackData() {
  campusArticles = [
    {
      id: 1,
      title: "Feria \"Bucara Emprende\"",
      summary: "2021-11-06",
      content: "<p>2021-11-06</p>",
      author: "Oficina de Admisiones",
      date: "Salón Comunal del Barrio Bucaramanga, Comuna 8",
      category: "Evento organizado por el IMEBU que reunió a más de 30 emprendedores locales. Se ofrecieron productos como bisutería, calzado, jardinería, postres y chocolatería. Además, hubo un pabellón gastronómico, presentaciones culturales, actividades deportivas y un punto de vacunación COVID-19"
    },
    {
      id: 2,
      title: "Feria \"Yo Emprendo\" – UDES",
      summary: "2024-11-06",
      content: "2024-11-08",
      author: "Facultad de Ingeniería",
      date: "Casona El Tabacal, Piedecuesta",
      category: "Plataforma que reunió a más de 120 emprendimientos locales, ofreciendo espacios de formación, conferencias y talleres para fortalecer las competencias de los emprendedores."
    },
    {
      id: 3,
      title: "Homenaje a la Mujer Emprendedora",
      summary: "2024-03-08",
      content: "2024-03-08",
      author: "Departamento de Deportes",
      date: "Centro Cultural del Oriente, Bucaramanga",
      category: "Evento de reconocimiento y apoyo a las mujeres emprendedoras de Bucaramanga, que incluyó conferencias, talleres de liderazgo, networking y exhibiciones de productos y servicios de emprendedoras locales."
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