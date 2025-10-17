from app.database.database import Base, engine
from app.models.books import Books
from app.models.members import Members
from app.models.borrowed_books import Borrowed
from app.models.users import Users

Base.metadata.create_all(bind=engine)

print("Tables created!")
