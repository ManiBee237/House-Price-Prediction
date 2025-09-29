# Requires: Windows PowerShell or PowerShell 7
# Usage:
#   powershell -ExecutionPolicy Bypass -File .\setup-fastapi.ps1
# What it does:
#   - Kills stray python.exe (safe)
#   - Renames any locked .venv
#   - Creates a new venv (prefers Python 3.12 if installed)
#   - Installs FastAPI, Uvicorn, and ML libs (Windows-friendly versions)
#   - Starts Uvicorn on 127.0.0.1:8000

$ErrorActionPreference = "Stop"
Write-Host "== House-Price FastAPI setup ==" -ForegroundColor Cyan

# 0) Ensure we’re in backend/fastapi
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptDir

# 1) Kill stray python processes (ignore if none)
try {
  Get-Process python -ErrorAction Stop | Stop-Process -Force
  Write-Host "Killed stray python.exe processes." -ForegroundColor Yellow
} catch {
  Write-Host "No running python.exe found. Good." -ForegroundColor DarkGray
}

# 2) Handle existing .venv (rename if locked)
if (Test-Path ".\.venv") {
  try {
    Remove-Item -Recurse -Force ".\.venv"
    Write-Host "Removed existing .venv." -ForegroundColor DarkGray
  } catch {
    $stamp = Get-Date -Format "yyyyMMdd_HHmmss"
    $old = ".\old_venv_$stamp"
    Rename-Item ".\.venv" $old
    Write-Host "Renamed locked .venv -> $old" -ForegroundColor Yellow
  }
}

# 3) Pick Python runtime (prefer 3.12 if installed)
$py312 = $null
try {
  $pyList = (& py -0p) 2>$null
  if ($pyList -match "-3\.12") { $py312 = "py -3.12" }
} catch { }

if ($py312) {
  Write-Host "Using Python 3.12 via py launcher." -ForegroundColor Green
  iex "$py312 -m venv .venv"
} else {
  Write-Host "Python 3.12 not found. Using default 'python'." -ForegroundColor Yellow
  python -m venv .venv
}

# 4) Activate venv
$activate = ".\.venv\Scripts\Activate.ps1"
if (-not (Test-Path $activate)) { throw "Failed to create venv (.venv)." }
. $activate
Write-Host "Activated venv: $env:VIRTUAL_ENV" -ForegroundColor Green

# 5) Upgrade pip toolchain
python -m pip install --upgrade pip setuptools wheel

# 6) Install deps (versions that work well on Windows)
python -m pip install fastapi==0.115.0 uvicorn==0.30.0
python -m pip install numpy==1.26.4 pandas==2.2.2 scikit-learn==1.4.2 joblib==1.4.2 python-dotenv==1.0.1 --only-binary :all:

python -c "import sys;print('Python:',sys.version);import fastapi,uvicorn,numpy,pandas,sklearn,joblib;print('All imports OK')"

# 8) Start Uvicorn (bind to loopback)
Write-Host "Starting FastAPI on http://127.0.0.1:8000 ..." -ForegroundColor Cyan
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
