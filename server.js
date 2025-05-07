const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static('public')); // Sirve archivos estáticos desde /public

const circuitsPath = path.join(__dirname, 'api', 'circuits.json');

// GET: obtener todos los drivers
app.get('/api/circuits', (req, res) => {
    fs.readFile(driversPath, 'utf8', (err, data) => {
        if (err) return res.status(500).json({ error: 'Error al leer los datos' });
        res.json(JSON.parse(data));
    });
});
app.get('/api/circuits', (req, res) => {
    fs.readFile(circuitsPath, 'utf8', (err, data) => {
        if (err) return res.status(500).json({ error: 'Error al leer los datos' });
        res.json(JSON.parse(data));
    });
});

// GET: obtener circuit por id
app.get('/api/circuits/:id', (req, res) => {
    const circuitId = parseInt(req.params.id);
    fs.readFile(circuitsPath, 'utf8', (err, data) => {
        if (err) return res.status(500).json({ error: 'Error al leer los datos' });

        const circuits = JSON.parse(data);
        const circuit = circuits.find(circuit => circuit.id === circuitId);

        if (!circuit) {
            return res.status(404).json({ error: 'Circuito no encontrado' });
        }

        res.json(circuit);
    });
});

// POST: agregar un nuevo circuit
app.post('/api/circuits', (req, res) => {
    fs.readFile(circuitsPath, 'utf8', (err, data) => {
        if (err) return res.status(500).json({ error: 'Error al leer los datos' });

        let circuits = JSON.parse(data);
        const maxId = Math.max(...circuits.map(d => d.id), 0);
        const newDriver = { id: maxId + 1, ...req.body };

        circuits.push(newDriver);

        fs.writeFile(circuitsPath, JSON.stringify(circuits, null, 2), (err) => {
            if (err) return res.status(500).json({ error: 'Error al guardar los datos' });
            res.json(newDriver);
        });
    });
});

// PUT: Actualizar un vehicle
app.put('/api/vehicles/:id', (req, res) => {
    const vehicleId = parseInt(req.params.id);
    const updatedDriver = req.body;

    fs.readFile(vehiclesPath, 'utf8', (err, data) => {
        if (err) return res.status(500).json({ error: 'Error al leer los datos' });

        let vehicles = JSON.parse(data);
        const index = vehicles.findIndex(vehicle => vehicle.id === vehicleId);

        if (index === -1) {
            return res.status(404).json({ error: 'Piloto no encontrado' });
        }

        // Asegura que el ID no se sobrescriba accidentalmente
        vehicles[index] = { ...vehicles[index], ...updatedDriver, id: vehicleId };

        fs.writeFile(vehiclesPath, JSON.stringify(vehicles, null, 2), err => {
            if (err) return res.status(500).json({ error: 'Error al guardar los datos' });

            res.json(vehicles[index]);
        });
    });
});
// DELETE: eliminar un vehicle
app.delete("/api/vehicles/:id", (req, res) => {
    const vehicleId = parseInt(req.params.id);

    fs.readFile(vehiclesPath, "utf8", (err, data) => {
        if (err) return res.status(500).json({ error: "Error al leer los datos" });

        let vehicles = JSON.parse(data);
        const index = vehicles.findIndex((vehicle) => vehicle.id === vehicleId);

        if (index === -1) {
            return res.status(404).json({ error: "Piloto no encontrado" });
        }

        vehicles.splice(index, 1); // Eliminar el piloto

        fs.writeFile(vehiclesPath, JSON.stringify(vehicles, null, 2), (err) => {
            if (err) return res.status(500).json({ error: "Error al guardar los cambios" });
            res.status(200).json({ message: "Piloto eliminado correctamente" });
        });
    });
});

app.get('/api/power-unit', (req, res) => {
    fs.readFile(powerUnitPath, 'utf8', (err, data) => {
        if (err) return res.status(500).json({ error: 'Error al leer los datos' });
        res.json(JSON.parse(data));
    });
});
// PUT: Actualizar un circuit
app.put('/api/circuits/:id', (req, res) => {
    const circuitId = parseInt(req.params.id);
    const updatedDriver = req.body;

    fs.readFile(circuitsPath, 'utf8', (err, data) => {
        if (err) return res.status(500).json({ error: 'Error al leer los datos' });

        let circuits = JSON.parse(data);
        const index = circuits.findIndex(circuit => circuit.id === circuitId);

        if (index === -1) {
            return res.status(404).json({ error: 'Circuito no encontrado' });
        }

        // Asegura que el ID no se sobrescriba accidentalmente
        circuits[index] = { ...circuits[index], ...updatedDriver, id: circuitId };

        fs.writeFile(circuitsPath, JSON.stringify(circuits, null, 2), err => {
            if (err) return res.status(500).json({ error: 'Error al guardar los datos' });

            res.json(circuits[index]);
        });
    });
});
// DELETE: eliminar un circuit
app.delete("/api/circuits/:id", (req, res) => {
    const circuitId = parseInt(req.params.id);

    fs.readFile(circuitsPath, "utf8", (err, data) => {
        if (err) return res.status(500).json({ error: "Error al leer los datos" });

        let circuits = JSON.parse(data);
        const index = circuits.findIndex((circuit) => circuit.id === circuitId);

        if (index === -1) {
            return res.status(404).json({ error: "Circuito no encontrado" });
        }

        circuits.splice(index, 1); // Eliminar el piloto

        fs.writeFile(circuitsPath, JSON.stringify(circuits, null, 2), (err) => {
            if (err) return res.status(500).json({ error: "Error al guardar los cambios" });
            res.status(200).json({ message: "Circuito eliminado correctamente" });
        });
    });
});




// URLS
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'inicio.html'));
});

app.get('/pagina', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'pagina-2.html'));
});
app.get('/admin/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'index.html'));
});
app.get('/circuits', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'circuits.html'));
});
app.get('/admin/circuits', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'admin-circuits.html'));
});
app.listen(PORT, () => {
    console.log(`Servidor en http://localhost:${PORT}`);
});