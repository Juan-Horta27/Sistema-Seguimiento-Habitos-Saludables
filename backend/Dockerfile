FROM node:20-alpine

RUN apk add --no-cache openssl libc6-compat

WORKDIR /app

# 1. Dependencias
COPY package.json ./
RUN npm install --legacy-peer-deps --ignore-scripts

# 2. Schema de Prisma y generar cliente
COPY prisma ./prisma/
RUN npx prisma generate

# 3. Código fuente
COPY . .

# 4. Compilar TypeScript → /app/dist
RUN npm run build

# Dar permisos al entrypoint
RUN chmod +x entrypoint.sh

EXPOSE 3001

# El entrypoint sincroniza la DB y luego arranca el servidor compilado
CMD ["sh", "entrypoint.sh"]
