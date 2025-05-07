class DeleteCircuitsModal extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.shadowRoot.innerHTML = `
        <link rel="stylesheet" href="/css/components/DeleteCircuitsModal.css">
        <div class="modal" style="display:none">
          <div class="modal-content">
            <h2 class="modal-content__title">Eliminar Negocio</h2>
            <p class="modal-content__confirm-message">¿Estás seguro de que deseas eliminar este Negocio?</p>
            <div class="modal-content__action-container">
                <button id="cancel" class="modal-content__cancel-button secondary-button">Cancelar</button>
                <button id="confirm" class="modal-content__confirm-button primary-button">Eliminar</button>
            </div>
          </div>
        </div>
      `;

        this.shadowRoot.querySelector("#cancel").addEventListener("click", () => {
            this.hide();
        });

        this.shadowRoot.querySelector("#confirm").addEventListener("click", async () => {
            if (this.circuitsId) {
                try {
                    const res = await fetch(`/api/circuits/${this.circuitsId}`, {
                        method: "DELETE"
                    });

                    if (!res.ok) throw new Error("Error eliminando Negocio");

                    // Si fue exitoso, emite un evento opcional para que otros sepan
                    if (typeof window.loadCircuits === "function") {
                        window.loadCircuits(); // Recargar la lista si está disponible globalmente
                    }
                } catch (error) {
                    console.error("Error al eliminar el Negocio:", error);
                } finally {
                    this.hide();
                }
            }
        });
    }

    show(circuitsId) {
        this.circuitsId = circuitsId;
        console.log(this.shadowRoot.querySelector(".modal"))
        this.shadowRoot.querySelector(".modal").classList.add("active");
    }

    hide() {
        this.shadowRoot.querySelector(".modal").classList.remove("active");
        this.driverId = null;
    }
}

customElements.define("delete-circuits-modal", DeleteCircuitsModal);