const express = require('express');
const redis = require('redis');

const app = express();
const port = 3000;

// Configuración de la conexión a Redis
const client = redis.createClient({
    url: 'redis://db:6379'
});

client.on('error', (err) => console.log('Redis Client Error', err));

async function startServer() {
    await client.connect();

    app.get('/', async (req, res) => {
        // Incrementa el contador de visitas en Redis
        const visits = await client.incr('visits');
        
        // Renderiza el Dashboard de Presentación Profesional con la pestaña de Diagramas
        res.send(`
            <!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Presentación Ejecutiva - Proyecto DevOps Cloud</title>
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
                <style>
                    :root {
                        --bg-main: #f8fafc;
                        --primary: #0f172a;
                        --accent: #3b82f6;
                        --success: #10b981;
                        --text-dark: #1e293b;
                        --text-light: #64748b;
                        --card-bg: #ffffff;
                        --card-border: #e2e8f0;
                    }
                    * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Inter', sans-serif; }
                    body { background-color: var(--bg-main); color: var(--text-dark); display: flex; height: 100vh; overflow: hidden; }
                    
                    /* Sidebar */
                    .sidebar { width: 300px; background-color: var(--primary); color: white; padding: 2rem 1.5rem; display: flex; flex-direction: column; justify-content: space-between; flex-shrink: 0; }
                    .logo-area h2 { font-size: 1.4rem; font-weight: 700; letter-spacing: -0.02em; margin-bottom: 0.5rem; color: #fff; }
                    .logo-area p { font-size: 0.8rem; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em; }
                    .nav-links { list-style: none; margin-top: 2.5rem; }
                    .nav-item { padding: 0.85rem 1.25rem; margin-bottom: 0.6rem; border-radius: 0.75rem; cursor: pointer; color: #94a3b8; transition: all 0.2s ease; font-weight: 600; font-size: 0.95rem; }
                    .nav-item:hover, .nav-item.active { background-color: rgba(255,255,255,0.08); color: white; }
                    .nav-item.active { border-left: 4px solid var(--accent); background-color: rgba(255,255,255,0.05); }
                    .footer-sig { font-size: 0.8rem; color: #64748b; text-align: center; }

                    /* Main Content */
                    .main-content { flex: 1; padding: 2.5rem 3.5rem; overflow-y: auto; display: flex; flex-direction: column; }
                    header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2.5rem; border-bottom: 1px solid #e2e8f0; padding-bottom: 1.5rem; }
                    h1 { font-size: 2rem; font-weight: 700; letter-spacing: -0.03em; }
                    
                    /* Live Badge / Counter */
                    .live-status { display: flex; align-items: center; background: white; padding: 0.6rem 1.2rem; border-radius: 50px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); border: 1px solid #e2e8f0; font-size: 0.9rem; font-weight: 600; }
                    .pulse { width: 10px; height: 10px; background-color: var(--success); border-radius: 50%; margin-right: 10px; box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); animation: pulse 1.5s infinite; }
                    .counter-badge { background-color: var(--accent); color: white; padding: 0.2rem 0.6rem; border-radius: 6px; font-weight: 700; margin-left: 8px; }
                    
                    /* Content Sections */
                    .section { display: none; }
                    .section.active { display: block; animation: fadeIn 0.4s ease-out; }
                    
                    /* Grid and Cards */
                    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-top: 1rem; }
                    .card { background: var(--card-bg); padding: 1.75rem; border-radius: 1rem; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); border: 1px solid var(--card-border); margin-bottom: 1.5rem; }
                    .card h3 { margin-bottom: 0.75rem; color: var(--primary); font-size: 1.2rem; }
                    .card p, .card li { color: var(--text-light); font-size: 0.95rem; line-height: 1.6; margin-bottom: 0.5rem; }
                    .card ul { margin-left: 1.25rem; margin-top: 0.5rem; }
                    
                    /* Seccion de Diagramas Específica */
                    .diagram-container { display: flex; flex-direction: column; gap: 2rem; }
                    .diagram-item { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; align-items: start; background: white; padding: 1.5rem; border-radius: 1rem; border: 1px solid var(--card-border); }
                    .diagram-info { display: flex; flex-direction: column; justify-content: center; }
                    .diagram-img-wrapper { background: #f8fafc; border: 1px solid var(--card-border); border-radius: 0.75rem; overflow: hidden; padding: 10px; display: flex; align-items: center; justify-content: center; }
                    .diagram-img-wrapper img { width: 100%; height: auto; border-radius: 4px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
                    
                    code { font-family: 'JetBrains Mono', monospace; background: #f1f5f9; padding: 0.2rem 0.4rem; border-radius: 4px; font-size: 0.85rem; color: #334155; }
                    .tech-tag { inline-block; background: #eff6ff; color: #1e40af; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.8rem; font-weight: 600; margin-right: 0.5rem; }

                    @keyframes pulse {
                        0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
                        70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(16, 185, 129, 0); }
                        100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
                    }
                    @keyframes fadeIn { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
                </style>
            </head>
            <body>

                <div class="sidebar">
                    <div class="logo-area">
                        <h2>Cloud Engineering</h2>
                        <p>Proyecto DevOps Cloud</p>
                        <ul class="nav-links">
                            <li class="nav-item active" onclick="switchTab('resumen')">1. Resumen Ejecutivo</li>
                            <li class="nav-item" onclick="switchTab('arquitectura')">2. Arquitectura Cloud</li>
                            <li class="nav-item" onclick="switchTab('cicd')">3. Pipeline CI/CD</li>
                            <li class="nav-item" onclick="switchTab('diagramas')">4. Diagramas Técnicos</li>
                            <li class="nav-item" onclick="switchTab('conclusiones')">5. Conclusiones</li>
                        </ul>
                    </div>
                    <div class="footer-sig">
                        <p>Desplegado de forma Continua en GCP</p>
                    </div>
                </div>

                <div class="main-content">
                    <header>
                        <div>
                            <h1 id="page-title">Resumen del Proyecto</h1>
                        </div>
                        <div class="live-status">
                            <div class="pulse"></div>
                            <span>Entorno Activo | Visitas a la BD (Redis): </span>
                            <span class="counter-badge" id="visit-count">${visits}</span>
                        </div>
                    </header>

                    <div id="resumen" class="section active">
                        <div class="card" style="margin-bottom: 1.5rem;">
                            <h3> Objetivo General del Proyecto</h3>
                            <p>Demostrar la implementación práctica de una cultura DevOps mediante la migración exitosa de una aplicación multicapa hacia la nube, automatizando el aprovisionamiento, las pruebas de software y el despliegue continuo mediante el uso de contenedores e Integración Continua.</p>
                        </div>
                        <div class="grid-2">
                            <div class="card">
                                <h3> Core Tecnológico Obligatorio</h3>
                                <ul>
                                    <li><span class="tech-tag">Cloud</span> Google Cloud Platform (Compute Engine)</li>
                                    <li><span class="tech-tag">Orquestador</span> Docker Compose / Swarm</li>
                                    <li><span class="tech-tag">CI/CD Automation</span> GitHub Actions</li>
                                    <li><span class="tech-tag">Base de Datos</span> Redis (Persistencia NoSQL)</li>
                                    <li><span class="tech-tag">Backend</span> Node.js (Express)</li>
                                </ul>
                            </div>
                            <div class="card">
                                <h3> Ventajas de esta Arquitectura</h3>
                                <p><strong>Automatización Absoluta:</strong> Cero intervención manual. Cualquier cambio en el código se compila, prueba y publica automáticamente en producción en menos de 30 segundos.</p>
                                <p style="margin-top:0.5rem"><strong>Aislamiento Completo:</strong> La aplicación web y la base de datos corren en contenedores independientes, comunicados en una red virtual privada interna de Docker.</p>
                            </div>
                        </div>
                    </div>

                    <div id="arquitectura" class="section">
                        <div class="card" style="margin-bottom: 1.5rem;">
                            <h3> Infraestructura en Google Cloud Platform</h3>
                            <p>El entorno se sostiene sobre una instancia de máquina virtual <code>e2-micro</code> optimizada en costos en la región de GCP. Se segmentó la seguridad mediante un Firewall en la VPC abriendo exclusivamente el puerto <code>22</code> (para gestión SSH cifrada) y el puerto de cara al público <code>80</code> (HTTP estándar).</p>
                        </div>
                        <div class="grid-2">
                            <div class="card">
                                <h3> Capa de Contenedores y Datos</h3>
                                <p>El archivo <code>docker-compose.yml</code> se encarga de empaquetar y levantar la topología:</p>
                                <ul>
                                    <li><strong>Contenedor Web:</strong> Ejecuta la lógica del servidor Node.js y expone el puerto 3000 hacia el puerto 80 exterior de la máquina virtual.</li>
                                    <li><strong>Contenedor DB (Redis):</strong> Base de datos aislada del exterior. Solo la app web puede inyectar datos utilizando el DNS interno de la red Docker (<code>redis://db:6379</code>).</li>
                                </ul>
                            </div>
                            <div class="card">
                                <h3> Seguridad Implementada</h3>
                                <p>• Acceso restringido por llaves públicas/privadas RSA criptográficas de alta seguridad.</p>
                                <p>• Aislamiento de puertos de base de datos (Redis no está expuesto a Internet).</p>
                                <p>• Secrets de GitHub encriptados para ocultar IPs y credenciales sensibles de producción.</p>
                            </div>
                        </div>
                    </div>

                    <div id="cicd" class="section">
                        <div class="card" style="margin-bottom: 1.5rem;">
                            <h3> Flujo del Pipeline Automatizado</h3>
                            <p>El archivo de configuración de automatización automatiza el ciclo de vida completo del desarrollo con dos Jobs encadenados de forma secuencial:</p>
                        </div>
                        <div class="grid-2">
                            <div class="card">
                                <h3>1. Integración Continua (CI)</h3>
                                <p>Cada <code>git push</code> ejecuta de inmediato las siguientes tareas en los servidores de GitHub:</p>
                                <ul>
                                    <li>Clonado automático del repositorio de código.</li>
                                    <li>Montaje del entorno de pruebas bajo Node.js 20.</li>
                                    <li>Descarga automatizada de dependencias comerciales.</li>
                                    <li>Prueba de compilación de sintaxis estática (<code>node -c app.js</code>).</li>
                                </ul>
                            </div>
                            <div class="card">
                                <h3>2. Despliegue Continuo (CD)</h3>
                                <p>Si el job de CI se completa con éxito, se activa el despliegue automático:</p>
                                <ul>
                                    <li>Conexión SSH segura hacia la VM de GCP usando variables protegidas.</li>
                                    <li>Descarga (Pull) limpia de los nuevos cambios directo en el servidor de producción.</li>
                                    <li>Reinicio ordenado y reconstrucción en caliente de los servicios con <code>docker compose up -d --build</code> sin interrupciones del servicio.</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div id="diagramas" class="section">
                        <div class="diagram-container">
                            
                            <div class="diagram-item">
                                <div class="diagram-info">
                                    <h3> Topología de Red y Arquitectura Cloud</h3>
                                    <p>Este diagrama representa de forma detallada la distribución y flujo de datos dentro de nuestra red en la nube pública:</p>
                                    <ul>
                                        <li><strong>Ingreso Seguro:</strong> Los usuarios finales acceden vía internet únicamente a través del puerto <code>80 (HTTP)</code> autorizado en el Firewall de la VPC de GCP.</li>
                                        <li><strong>Entorno VM:</strong> Dentro de la máquina virtual con Ubuntu, se aloja el entorno de contenedores.</li>
                                        <li><strong>Aislamiento Multicapa:</strong> La app y la base de datos están unidas por una red virtual interna aislada, lo cual bloquea accesos directos desde internet a Redis, protegiendo los datos confidenciales de la app.</li>
                                    </ul>
                                </div>
                                <div class="diagram-img-wrapper">
                                    <img src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=500&q=80" alt="Arquitectura Cloud e Infraestructura de Red">
                                </div>
                            </div>

                            <div class="diagram-item" style="margin-top: 1.5rem;">
                                <div class="diagram-info">
                                    <h3> Arquitectura del Pipeline de Automatización CI/CD</h3>
                                    <p>Flujo lógico e instrumental encargado de orquestar el ciclo de vida del desarrollo sin intervención humana:</p>
                                    <ul>
                                        <li><strong>Control de Versiones:</strong> Todo cambio inicia con un <code>git push</code> en GitHub.</li>
                                        <li><strong>Fase de Pruebas (CI):</strong> Un Runner independiente en la nube compila las dependencias de Node.js y valida que la sintaxis no contenga fallos.</li>
                                        <li><strong>Fase de Deploy (CD):</strong> Tras el éxito de las pruebas, se inyectan los "Secrets" criptográficos mediante SSH para instruir a la máquina virtual que descargue y levante los contenedores en tiempo récord.</li>
                                    </ul>
                                </div>
                                <div class="diagram-img-wrapper">
                                    <img src="https://images.unsplash.com/photo-1618401471353-b98aedd07871?auto=format&fit=crop&w=500&q=80" alt="Diagrama de Flujo Pipeline CI/CD">
                                </div>
                            </div>

                        </div>
                    </div>

                    <div id="conclusiones" class="section">
                        <div class="grid-2" style="grid-template-columns: 1fr;">
                            <div class="card">
                                <h3> Retos y Aprendizajes Clave</h3>
                                <p><strong>1. Filosofía Infraestructura como Código (IaC):</strong> Se comprendió la importancia de documentar y empaquetar toda la infraestructura y orquestación en archivos legibles de configuración (Dockerfile, Compose, YAML workflows) asegurando la replicabilidad idéntica del sistema.</p>
                                <br>
                                <p><strong>2. Reducción de Tiempos de Entrega:</strong> Al delegar las pruebas y despliegues a un agente automatizado de CI/CD (GitHub Actions), los tiempos de liberación a producción se reducen drásticamente de horas a solo segundos, eliminando fallos por factores humanos.</p>
                                <br>
                                <p><strong>3. Orquestación Ágil:</strong> El uso de arquitecturas basadas en contenedores ligeros (Docker) soluciona de raíz el clásico problema corporativo "en mi máquina local sí funcionaba", garantizando estabilidad absoluta tanto en desarrollo como en producción en la nube.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <script>
                    function switchTab(tabId) {
                        // Ocultar todas las secciones
                        document.querySelectorAll('.section').forEach(sec => sec.classList.remove('active'));
                        // Quitar active de los botones laterales
                        document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
                        
                        // Mostrar la seleccionada
                        document.getElementById(tabId).classList.add('active');
                        
                        // Resaltar botón seleccionado
                        event.currentTarget.classList.add('active');
                        
                        // Cambiar título de cabecera dinámicamente
                        const titles = {
                            'resumen': 'Resumen Ejecutivo del Proyecto',
                            'arquitectura': 'Diseño Arquitectónico y Redes en la Nube',
                            'cicd': 'Pipeline de Automatización CI/CD',
                            'diagramas': 'Diagramas del Sistema e Infraestructura',
                            'conclusiones': 'Conclusiones y Lecciones Aprendidas'
                        };
                        document.getElementById('page-title').innerText = titles[tabId];
                    }
                </script>
            </body>
            </html>
        `);
    });

    app.listen(port, () => {
        console.log(`App corriendo en http://localhost:${port}`);
    });
}

startServer();
