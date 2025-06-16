from typing import Optional
import uvicorn
from fastapi import FastAPI, File, Form, UploadFile
from fastapi.middleware.cors import CORSMiddleware

from backend.services import fileProcesser

'''
Initialise backend:

cd backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt

Run backend + frontend

cd..
npm run dev

'''
app = FastAPI()

origins = [
    'http://localhost:3000',
    'https://orbital-25-bank-sync.vercel.app'
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_origin_regex=r"https://orbital-25-bank-sync-.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*']
)


@app.post("/dashboard")
async def upload_file(file: UploadFile = File(...), password: Optional[str] = Form(None)):
    contents = await file.read()

    extension = file.filename.split('/')[-1].split('.')[-1]
    (success, jsonData) = fileProcesser.fileParser(contents, extension, password)

    return {"filename": file.filename, "content_type": file.content_type, 'success': success, "data": jsonData}


@app.get("/")
async def read_root():
    return {"status": "Backend is running"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
