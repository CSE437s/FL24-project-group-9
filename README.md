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

To run server:
```
poetry run python3 manage.py runserver
```

#### Backend using Docker
Switch to the backend folder
```
cd backend
```

Download [Docker](https://www.docker.com/get-started/)

Build and Run Containers
```
docker-compose up --build
```

Remove Containers
```
docker-compose down
```
