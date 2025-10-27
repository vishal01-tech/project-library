import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.routes.users import router as users_router
from app.routes.members import router as members_router
from app.routes.books import router as books_router
from app.routes.borrowed_books import router as borrowed_books_router


# Ensure uploads directory exists
os.makedirs("app/media", exist_ok=True)

app = FastAPI()

# Mount static files for uploaded images
app.mount("/media", StaticFiles(directory="app/media"), name="media")

# CORS setup for your frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(users_router)
app.include_router(members_router)
app.include_router(books_router)
app.include_router(borrowed_books_router)








