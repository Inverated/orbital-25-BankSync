@echo off
start cmd /c "uvicorn backend.main:app --reload"