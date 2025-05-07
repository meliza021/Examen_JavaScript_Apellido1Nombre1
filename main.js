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
      title: "Jornada de puertas abiertas en Ingeniería",
      summary: "Visitas guiadas y charlas con profesores y estudiantes.",
      content: "<p>Este sábado 3 de mayo, la Facultad de Ingeniería abrirá sus puertas...</p>",
      author: "Oficina de Admisiones",
      date: "28 de abril, 2025",
      category: "Eventos"
    },
    {
      id: 2,
      title: "Proyecto de robótica gana concurso nacional",
      summary: "El equipo RoboCanino de Informática obtuvo el primer lugar.",
      content: "<p>Tras meses de trabajo intenso...</p>",
      author: "Facultad de Ingeniería",
      date: "25 de abril, 2025",
      category: "Investigación"
    },
    {
      id: 3,
      title: "Equipo de baloncesto femenino a la final",
      summary: "Las 'Panteras' derrotaron a la Universidad del Norte por 78-65.",
      content: "<p>El equipo femenino de baloncesto...</p>",
      author: "Departamento de Deportes",
      date: "22 de abril, 2025",
      category: "Deportes"
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