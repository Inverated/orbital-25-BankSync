from typing import Optional
import uvicorn
from fastapi import FastAPI, File, Form, Response, UploadFile
from fastapi.middleware.cors import CORSMiddleware

from backend.services import fileProcesser
from backend.services.passwordProtect import protectPdf, protectExcel

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
    statement_data = []
    error_message = ''
    (success, jsonData) = fileProcesser.fileParser(contents, extension, password)

    if success:
        statement_data = jsonData
    else:
        error_message = jsonData

    return {"filename": file.filename, "content_type": file.content_type, 'success': success, "error": error_message, "data": statement_data}


@app.post("/encryptFile")
async def encrypt_file(file: UploadFile = File(...), password: str = Form(None)):
    print(file.content_type)
    content = await file.read()
    if file.content_type == 'application/pdf':
        return Response(
            protectPdf(content, password),
            media_type='application/pdf',
        )
    elif file.content_type == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
        return Response(
            protectExcel(content, password),
            media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        )
    else:
        return


@app.get("/")
async def read_root():
    return {"status": "Backend is running"}


@app.head('/ping')
async def ping():
    return {'status': 'poooong', 'status_code': '200'}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
