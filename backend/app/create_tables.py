from database import Base, engine
import models  # Import models so they get registered on Base

Base.metadata.create_all(bind=engine)
print("Tables created!")
