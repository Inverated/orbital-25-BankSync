import uvicorn
from fastapi import FastAPI, File, UploadFile
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
async def upload_file(file: UploadFile = File(...)):
    contents = await file.read()
    # Process contents here, e.g., save or parse
    print(file.filename)
    print(file.headers)
    print(file.content_type)

    jsonData = fileProcesser.pdfParser(contents)
    print(jsonData)
    return {"filename": file.filename, "content_type": file.content_type, "data": jsonData}

@app.get("/")
async def read_root():
    return {"status": "Backend is running"}

if __name__ == "__main__": 
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)