import uvicorn
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware

from backend.services.fileProcesser import fileProcesser

app = FastAPI()

origins = [
    'http://localhost:3000' 
    #add in links for vercel in future
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*']
)

@app.post("/dashboard")
async def upload_file(file: UploadFile = File(...)):
    contents = await file.read()
    # Process contents here, e.g., save or parse
    fileProcesser(contents)
    return {"filename": file.filename, "content_type": file.content_type}

if __name__ == "__main__": 
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)