from quart import g, Quart
from quart_db import QuartDB
from quart_schema import QuartSchema, validate_request, validate_response
from dataclasses import dataclass
from datetime import datetime
from typing import Optional


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
    user_id: int
    title: str
    description: str
    did_not_go_well: str | None
    made_me_smile: str | None
    grateful_for: str | None
    image_url: str | None

@dataclass
class Diary:
    id: int  # Non-default field first
    user_id: int
    title: str
    description: str
    created: datetime  # Non-default field
    did_not_go_well: str | None
    made_me_smile: str | None
    grateful_for: str | None
    image_url: str | None

@app.post('/diaries')
@validate_request(DiaryInput)
@validate_response(Diary)
async def create_diary(data: DiaryInput) -> Diary:
    """Create a new diary entry"""
    result = await g.connection.fetch_one(
        """INSERT INTO diaries (user_id, title, description, did_not_go_well, made_me_smile, grateful_for, image_url)
        VALUES (:user_id, :title, :description, :did_not_go_well, :made_me_smile, :grateful_for, :image_url)
        RETURNING id, user_id, created, title, description, did_not_go_well, made_me_smile, grateful_for, image_url""",
        {
            "user_id": data.user_id,
            "title": data.title,
            "description": data.description,
            "did_not_go_well": data.did_not_go_well,
            "made_me_smile": data.made_me_smile,
            "grateful_for": data.grateful_for,
            "image_url": data.image_url,
        }
    )
    
    # # Not sure why this is needed
    # if result is None:
    #     raise ValueError("Failed to create diary entry.")

    return Diary(**result)