# hello-nest-k8s — Flujo completo CI/CD hasta Kubernetes

Proyecto mínimo de NestJS para practicar el flujo de punta a punta:
código → Dockerfile → GitHub Actions → GHCR → Kubernetes (minikube).

## 1. Crear el repositorio en GitHub

1. Crea un repo nuevo en GitHub (público o privado), sin inicializarlo con README.
2. En esta carpeta:
   ```bash
   git init
   git add .
   git commit -m "primer commit: proyecto base"
   git branch -M main
   git remote add origin https://github.com/TU_USUARIO/hello-nest-k8s.git
   git push -u origin main
   ```

## 2. Qué pasa automáticamente al hacer push

En cuanto el push llegue a `main`, el workflow en
`.github/workflows/ci-cd.yml` se dispara solo:
1. Descarga tu código.
2. Se autentica en `ghcr.io` usando el token automático de GitHub
   (`GITHUB_TOKEN` — no necesitas crear ningún secreto a mano para esto).
3. Construye la imagen con el Dockerfile.
4. La publica en `ghcr.io/TU_USUARIO/hello-nest-k8s` con dos tags:
   `latest` y el hash del commit.

Puedes ver el progreso en la pestaña "Actions" de tu repo en GitHub.

## 3. Hacer la imagen visible/accesible (si el repo es privado)

Si tu repo es privado, la imagen publicada hereda esa privacidad.
Para poder descargarla desde tu clúster local necesitas un
Personal Access Token con scope `read:packages`, y crear el secreto
en tu clúster:

```bash
kubectl create secret docker-registry ghcr-secret \
  --docker-server=ghcr.io \
  --docker-username=TU_USUARIO \
  --docker-password=TU_TOKEN
```

(Si prefieres mantenerlo simple para practicar, puedes hacer el
paquete público desde GitHub → tu perfil → Packages → el paquete →
Package settings → Change visibility. Así te saltas el secret por
ahora.)

## 4. Desplegar en tu minikube

1. Edita `k8s/deployment.yaml` y reemplaza `TU_USUARIO` por tu
   usuario real de GitHub.
2. Aplica los manifiestos:
   ```bash
   kubectl apply -f k8s/deployment.yaml
   kubectl apply -f k8s/service.yaml
   ```
3. Verifica:
   ```bash
   kubectl get pods
   kubectl get replicasets
   kubectl get deployments
   ```
4. Prueba la app con un port-forward hacia el Service (no hacia el
   deployment directamente, para que sí reparta entre las 3 réplicas):
   ```bash
   kubectl port-forward service/hello-nest-service 8080:80
   ```
   Y visita `localhost:8080` en tu navegador.

## 5. El ciclo completo de aquí en adelante

Cada vez que cambies el código y hagas push a `main`:
1. GitHub Actions construye y publica una imagen nueva (con un hash
   de commit nuevo como tag).
2. Para que tu clúster tome la nueva versión, actualiza la imagen
   en el Deployment:
   ```bash
   kubectl set image deployment/hello-nest-deployment \
     hello-nest=ghcr.io/TU_USUARIO/hello-nest-k8s:EL_NUEVO_SHA
   ```
   Esto dispara el rolling update que ya conoces: un ReplicaSet
   nuevo sube gradualmente mientras el viejo baja.
