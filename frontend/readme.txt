#for frontend
cd frontend
npm run dev

#for backend\express
cd backend\express
npm run dev

#for backend\fastapi
cd backend\fastapi
~python ML services should run in .venv :
    python -m venv venv
    .\venv\Scripts\activate
~Then install uvicorn:
    pip install uvicorn[standard]

~Verify installation:
    pip show uvicorn
    pip install fastapi uvicorn[standard]

pip install joblib

pip install -r requirements.txt


python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload --log-level debug