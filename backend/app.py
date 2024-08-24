from quart import g, Quart
from quart_db import QuartDB
from quart_schema import QuartSchema, validate_request, validate_response
from dataclasses import dataclass
from datetime import datetime

app = Quart(__name__)
QuartDB(app, url='sqlite:///database.db')
QuartSchema(app)

@dataclass
class UserInput:
    name: str
    email: str
    password: str

@dataclass
class User:
    id: int
    name: str
    email: str
    created: datetime

@app.post('/users')
@validate_request(UserInput)
@validate_response(User)
async def create_user(data: UserInput) -> User:
    """Create a new user"""
    result = await g.connection.fetch_one(
        """INSERT INTO users (name, email, password_hash)
        VALUES (:name, :email, :password_hash)
        RETURNING id, name, email, created""",
        {"name": data.name, "email": data.email, "password_hash": data.password},
    )
    return User(**result)

@dataclass
class DiaryInput:
    title: str
    description: str
    diary_date: datetime
    did_not_go_well: str
    made_me_smile: str

@app.post('/diaries')
@validate_request(DiaryInput)
@validate_response(User)
async def create_diary(data: DiaryInput) -> User:
    """Create a new diary entry"""
    # Implementation goes here
    pass