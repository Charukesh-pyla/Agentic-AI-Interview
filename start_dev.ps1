# This script starts both the FastAPI backend and Next.js frontend

Write-Host "Starting Agentic-AI-Interview (IntervAI) Environment..." -ForegroundColor Cyan

# Check if Python is installed
if (-not (Get-Command "python" -ErrorAction SilentlyContinue)) {
    Write-Host "Error: Python is not installed or not in PATH." -ForegroundColor Red
    exit
}

# Create temp_resumes directory if it doesn't exist
if (-not (Test-Path "temp_resumes")) {
    New-Item -ItemType Directory -Path "temp_resumes" | Out-Null
}

# Write-Host "Installing/Verifying Python dependencies..." -ForegroundColor Green
# Start-Process -FilePath "python" -ArgumentList "-m pip install -r requirements.txt" -NoNewWindow -Wait | Out-Null


# 1. Start the Backend
Write-Host "Starting FastAPI Backend on port 8000..." -ForegroundColor Green
Start-Process -FilePath "python" -ArgumentList "-m uvicorn api:app --reload --port 8000" -NoNewWindow -PassThru | Out-Null

# 2. Start the Frontend
Write-Host "Starting Next.js Frontend on port 3000..." -ForegroundColor Green
Set-Location -Path "frontend"
Start-Process -FilePath "npm" -ArgumentList "run dev" -NoNewWindow -PassThru | Out-Null

Write-Host "Both servers are starting..." -ForegroundColor Yellow
Write-Host "- Backend: http://localhost:8000/docs"
Write-Host "- Frontend: http://localhost:3000"
Write-Host "Press Ctrl+C to exit." -ForegroundColor Yellow

# Wait indefinitely
while ($true) {
    Start-Sleep -Seconds 1
}
