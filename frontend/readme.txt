#for frontend
cd frontend
npm run dev

#for backend\express
cd backend\express
npm run dev

#for backend\fastapi
cd backend\fastapi
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload --log-level debug