# Fantasy Football Analyzer Web Application 
Application for analyzing fantasy football rosters and trade scenarios

## Features
### Sync ESPN Fantasy rosters within the application
![1](/screenshots/1.png)
### Receive insight on potential trades
![2](/screenshots/2.png)
### Compare player statistics
![3](/screenshots/4.jpeg)

## Tech Stack
- React.js - Frontend
- Redux Toolkit - State Management
- TailwindCSS - Styling
- shadcn/ui - Design System
- Django - Backend
- Redis - Cache
- Typescript/Javascript
- Python

## Running Locally

### Requirements
#### Backend
- Python 3.8+
- [Django](https://www.djangoproject.com/download/) 5.x
- [Redis](https://redis.io/downloads/) 5.x+
- pip (Python package manager)
- virtualenv (recommended)

#### Frontend
- Node.js 18.x+

## Installation
Clone the Repository
```
git clone https://github.com/CollinK23/nflgm.git
```
### Frontend
1. cd into the `frontend` directory
2. Install Dependencies
```
npm install
```
3. Run the Development Server
```
npm run dev
```
### Backend
4. cd into the `backend` directory
5. Set Up the Python Environment
```
cd backend
python3 -m venv env
source env/bin/activate   # On Windows: .\env\Scripts\activate
```
6. Install Dependencies
```
pip install -r requirements.txt
```
7. Start the Redis server by running the following command:
```
redis-server
```
8. Create a `.env` file in the `backend` directory with the following variables:
```
SECRET_KEY=<your_secret_key>
DEBUG=True
```
9. Start the development server
```
python manage.py runserver
```

10. Open [http://localhost:5173](http://localhost:5173) with your browser.
