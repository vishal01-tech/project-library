from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from .database import Base  # Import your Base from database.py

# Use SQLite in-memory for tests
TEST_DATABASE_URL = "sqlite:///:memory:"

test_engine = create_engine(TEST_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)

def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

def create_test_tables():
    Base.metadata.create_all(bind=test_engine)

def drop_test_tables():
    Base.metadata.drop_all(bind=test_engine)
