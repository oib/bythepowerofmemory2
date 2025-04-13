from sqlmodel import SQLModel, create_engine

DATABASE_URL = "postgresql+psycopg2://bythepowerofmemory:b62b64ba251b05cef147c89e2f7d7dcd@localhost/bythepowerofmemory"

engine = create_engine(DATABASE_URL, echo=False)

def init_db():
    SQLModel.metadata.create_all(engine)

