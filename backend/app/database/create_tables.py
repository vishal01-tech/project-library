from backend.app.database.database import Base, engine

Base.metadata.create_all(bind=engine)

print("Tables created!")
