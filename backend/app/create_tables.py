from database import Base, engine
# from sqlalchemy import text

# Drop borrowed_books table if exists
# with engine.connect() as conn:
#     conn.execute(text("DROP TABLE IF EXISTS borrowed_books"))
#     conn.commit()

Base.metadata.create_all(bind=engine)
print("Tables created!")
