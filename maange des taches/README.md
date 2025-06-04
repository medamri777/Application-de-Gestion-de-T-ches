# Application de Gestion de Tâches

Une application web de gestion de tâches construite avec Python (Flask) pour le backend, JavaScript pour le frontend, et MongoDB pour la base de données.

## Fonctionnalités

- Créer, lire, mettre à jour et supprimer des tâches
- Filtrer les tâches par statut (À faire, En cours, Terminée)
- Interface utilisateur réactive et moderne
- Notifications pour les actions de l'utilisateur

## Prérequis

- Python 3.6+
- MongoDB
- Navigateur web moderne

## Installation

### 1. Cloner le dépôt

```bash
git clone <repository-url>
cd maange-des-taches
```

### 2. Configurer le backend

```bash
cd backend
pip install -r requirements.txt
```

### 3. Configurer MongoDB

Assurez-vous que MongoDB est installé et en cours d'exécution sur votre système.
Par défaut, l'application se connecte à `mongodb://localhost:27017/`.

Si votre configuration MongoDB est différente, modifiez le fichier `backend/config.env`.

### 4. Démarrer le backend

```bash
cd backend
python run.py
```

Le serveur backend démarrera à l'adresse `http://localhost:5000`.

### 5. Ouvrir l'application frontend

Ouvrez le fichier `frontend/public/index.html` dans votre navigateur web.

## Structure du projet

```
maange-des-taches/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   └── routes.py
│   ├── config.env
│   ├── requirements.txt
│   └── run.py
└── frontend/
    ├── public/
    │   └── index.html
    └── src/
        ├── app.js
        └── styles.css
```

## API Endpoints

- `GET /api/tasks` - Récupérer toutes les tâches
- `GET /api/tasks/<task_id>` - Récupérer une tâche spécifique
- `POST /api/tasks` - Créer une nouvelle tâche
- `PUT /api/tasks/<task_id>` - Mettre à jour une tâche existante
- `DELETE /api/tasks/<task_id>` - Supprimer une tâche

## Technologies utilisées

- **Backend**: Python, Flask
- **Base de données**: MongoDB
- **Frontend**: HTML, CSS, JavaScript (Vanilla)
- **Icônes**: Font Awesome 