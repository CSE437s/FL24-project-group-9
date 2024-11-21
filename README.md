# Project Name: WashU Course Scheduler

### Team members: Duy Huynh, Tram Vu, Sam Gil

### TA: <Insert Here>

### Instructions/Link to access: <insert here>

## Getting Started

### Installation

#### Frontend

See [here](./frontend/README.md) for more detailed instructions about frontend installation

Switch to the frontend folder
```
cd frontend
```

Install dependencies
```
npm install
```

Start the local development server
```
npm run dev
```


#### Backend
See [here](./backend/README.md) for more detailed instructions about backend installation

Switch to the backend folder
```
cd backend
```

Install Poetry
```
python3 -m pip install poetry
```

To check if Poetry is already installed:

```
poetry --version
```

Install existing dependencies:
```
poetry install
```

Make .env file (if not existed)
```
cp .env.example .env
```

Add environment variables
```
EMAIL_HOST_USER=<your_email@gmail.com>
EMAIL_HOST_PASSWORD=<your_password>
```

To seed data into the database:

```
poetry run python3 manage.py seed_data
```

To run server:
```
poetry run python3 manage.py runserver
```

### Running Application using Docker
Download [Docker](https://www.docker.com/get-started/)

Build and Run Containers
```
docker-compose -f docker-compose.yaml up --build
```

Remove Containers
```
docker-compose -f docker-compose.yaml down
```

## Production

Start the cluster with the config file with:
```
kind create cluster --config kind-cluster.yaml
```

Build your new image with:
```
docker-compose -f docker-compose-release.yaml build
```

Load your image into kind with:
```
kind load docker-image washu_course_scheduler_frontend:release
kind load docker-image washu_course_scheduler_backend:release
```

Create ConfigMap
```
kubectl create configmap backend-env --from-env-file=backend/.env
```

View ConfigMap
```
kubectl get configmap backend-env -o yaml
```

Update ConfigMap from .env if needed
```
kubectl create configmap backend-env --from-env-file=backend/.env --dry-run=client -o yaml | kubectl apply -f -
```

Deploy your app with:
```
kubectl apply -f https://kind.sigs.k8s.io/examples/ingress/deploy-ingress-nginx.yaml
kubectl apply -f k8s/frontend-deployment.yaml
kubectl apply -f k8s/frontend-ingress-deployment.yaml
kubectl apply -f k8s/backend-deployment.yaml
kubectl apply -f k8s/backend-ingress-deployment.yaml
```

Check on the status of your deployment with (should show RUNNING):
```
kubectl get pods
```

Check on the status of your service with (Should show your ports):
```
kubectl get services
```

Navigate to [localhost:8080](localhost:8080)
