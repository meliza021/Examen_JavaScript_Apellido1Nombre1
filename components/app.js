document.addEventListener('DOMContentLoaded', () => {
    const addEventBtn = document.getElementById('add-event-btn');
    const eventFormSection = document.getElementById('event-form-section');
    const entrepreneurFormSection = document.getElementById('entrepreneur-form-section');
    const eventsList = document.getElementById('events-list');

    const eventForm = document.getElementById('event-form');
    const entrepreneurForm = document.getElementById('entrepreneur-form');

    const cancelEventFormBtn = document.getElementById('cancel-event-form-btn');
    const cancelEntrepreneurFormBtn = document.getElementById('cancel-entrepreneur-form-btn');

    // Mostrar formulario de evento
    addEventBtn.addEventListener('click', () => {
        eventFormSection.classList.remove('hidden');
        entrepreneurFormSection.classList.add('hidden');
    });

    // Cancelar evento
    cancelEventFormBtn.addEventListener('click', () => {
        eventFormSection.classList.add('hidden');
        eventForm.reset();
    });

    // Cancelar emprendimiento
    cancelEntrepreneurFormBtn.addEventListener('click', () => {
        entrepreneurFormSection.classList.add('hidden');
        entrepreneurForm.reset();
    });

    // Guardar evento
    eventForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const newEvent = {
            id: Date.now(),
            name: document.getElementById('event-name').value,
            location: document.getElementById('event-location').value,
            startDate: document.getElementById('event-start').value,
            endDate: document.getElementById('event-end').value,
            times: document.getElementById('event-times').value,
            entrepreneurs: []
        };

        const events = getEvents();
        events.push(newEvent);
        saveEvents(events);

        eventForm.reset();
        eventFormSection.classList.add('hidden');
        renderEvents();
    });

    // Guardar emprendimiento asociado a un evento
    entrepreneurForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const productPhotoInput = document.getElementById('product-photo');
        const reader = new FileReader();
        const selectedEventId = prompt("Ingrese el ID del evento al que desea asociar el emprendimiento:");

        reader.onload = () => {
            const newEntrepreneur = {
                name: document.getElementById('entrepreneur-name').value,
                category: document.getElementById('entrepreneur-category').value,
                description: document.getElementById('entrepreneur-description').value,
                social: document.getElementById('entrepreneur-social').value,
                product: {
                    name: document.getElementById('product-name').value,
                    price: document.getElementById('product-price').value,
                    description: document.getElementById('product-description').value,
                    photo: reader.result // base64
                }
            };

            const events = getEvents();
            const eventIndex = events.findIndex(ev => ev.id == selectedEventId);

            if (eventIndex >= 0) {
                events[eventIndex].entrepreneurs.push(newEntrepreneur);
                saveEvents(events);
                entrepreneurForm.reset();
                entrepreneurFormSection.classList.add('hidden');
                renderEvents();
            } else {
                alert("Evento no encontrado. Asegúrate de ingresar un ID válido.");
            }
        };

        if (productPhotoInput.files[0]) {
            reader.readAsDataURL(productPhotoInput.files[0]);
        } else {
            reader.onload(); // Si no hay imagen, aún así continúa
        }
    });

    // Funciones auxiliares
    function getEvents() {
        return JSON.parse(localStorage.getItem('events')) || [];
    }

    function saveEvents(events) {
        localStorage.setItem('events', JSON.stringify(events));
    }

    function renderEvents() {
        eventsList.innerHTML = '';
        const events = getEvents().sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

        for (const ev of events) {
            const eventCard = document.createElement('div');
            eventCard.className = 'event-card';

            eventCard.innerHTML = `
                <h3>${ev.name}</h3>
                <p><strong>Lugar:</strong> ${ev.location}</p>
                <p><strong>Inicio:</strong> ${ev.startDate}</p>
                <p><strong>Fin:</strong> ${ev.endDate}</p>
                <p><strong>Horarios:</strong> ${ev.times}</p>
                <p><strong>ID del evento:</strong> ${ev.id}</p>
                <button class="remove-btn" data-id="${ev.id}">Eliminar</button>
                <h4>Emprendimientos:</h4>
                <div>
                    ${ev.entrepreneurs.map(ent => `
                        <div style="border-top: 1px solid #ccc; margin-top: 10px; padding-top: 10px;">
                            <p><strong>Nombre:</strong> ${ent.name}</p>
                            <p><strong>Categoría:</strong> ${ent.category}</p>
                            <p><strong>Descripción:</strong> ${ent.description}</p>
                            <p><strong>Red social:</strong> <a href="${ent.social}" target="_blank">${ent.social}</a></p>
                            <p><strong>Producto:</strong> ${ent.product.name}</p>
                            <p><strong>Precio:</strong> $${ent.product.price}</p>
                            <p><strong>Descripción:</strong> ${ent.product.description}</p>
                            ${ent.product.photo ? `<img src="${ent.product.photo}" alt="Foto del producto" style="max-width: 100px;">` : ''}
                        </div>
                    `).join('')}
                </div>
            `;

            const removeBtn = eventCard.querySelector('.remove-btn');
            removeBtn.addEventListener('click', () => {
                const events = getEvents().filter(e => e.id != ev.id);
                saveEvents(events);
                renderEvents();
            });

            eventsList.appendChild(eventCard);
        }
    }

    // Inicializar vista con los eventos guardados
    renderEvents();

    // Atajo para mostrar el formulario de emprendimientos
    document.addEventListener('keydown', (e) => {
        if (e.key === 'e') {
            entrepreneurFormSection.classList.remove('hidden');
            eventFormSection.classList.add('hidden');
        }
    });
});
