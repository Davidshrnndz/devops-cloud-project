const express = require('express');
const redis = require('redis');

const app = express();
const port = 3000;

// Configuración de la conexión a Redis usando el nombre del servicio de Docker
const client = redis.createClient({
    url: 'redis://db:6379'
});

client.on('error', (err) => console.log('Redis Client Error', err));

async function startServer() {
    await client.connect();

    app.get('/', async (req, res) => {
        // Incrementa el contador de visitas en Redis
        const visits = await client.incr('visits');
        res.send(`
            <style>
                body { font-family: Arial, sans-serif; text-align: center; margin-top: 10%; background-color: #f4f4f9; }
                h1 { color: #333; }
                .badge { background: #007bff; color: white; padding: 10px 20px; border-radius: 5px; font-size: 1.5em; }
            </style>
            <h1>🚀 Infraestructura DevOps Desplegada con Éxito</h1>
            <p>Esta aplicación está corriendo en un contenedor Docker dentro de la nube.</p>
            <p>Número de visitas registradas en la Base de Datos (Redis): <span class="badge">${visits}</span></p>
        `);
    });

    app.listen(port, () => {
        console.log(`App corriendo en http://localhost:${port}`);
    });
}

startServer();
