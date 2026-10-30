@echo off
echo ========================================================
echo  AICTE Sentinel - Backend Production Server
echo  Smart India Hackathon 2026 | Team Valora
echo ========================================================

cd backend
echo [*] Starting FastAPI server on http://localhost:8000...
echo [*] API Documentation: http://localhost:8000/docs
py -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
pause

