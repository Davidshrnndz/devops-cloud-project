# 1. Usar una imagen ligera de Node.js
FROM node:18-alpine

# 2. Crear y definir el directorio de trabajo
WORKDIR /usr/src/app

# 3. Instalar las dependencias express y redis
RUN npm install express redis

# 4. Copiar el código fuente de la aplicación
COPY app.js .

# 5. Exponer el puerto de la aplicación
EXPOSE 3000

# 6. Comando para arrancar la app
CMD [ "node", "app.js" ]
