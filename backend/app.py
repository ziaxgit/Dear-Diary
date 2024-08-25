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
    

@dataclass 
class Users:
    users: list[User]

@app.get('/users')
@validate_response(Users)
async def get_users() -> Users:
    """Get all users"""
    query = ("""SELECT id, created, name, email
        FROM users""")
    users = [User(**row) async for row in g.connection.iterate(query) ]
    return Users(users=users)
    # need more clarification on how this works

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
    id: int  
    user_id: int
    title: str
    description: str
    created: datetime  
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

    return Diary(**result)


@dataclass
class Diaries:
    diaries: list[Diary]


@app.get('/diaries')
@validate_response(Diaries)
async def get_diaries() -> Diaries:
    """Get all diaries"""
    query = ("""SELECT * FROM diaries""")
    diaries = [Diary(**row) async for row in g.connection.iterate(query) ]
    return Diaries(diaries=diaries)
    # need more clarification on how this works

# @app.get('/users/<int:user_id>/diaries')
# # @validate_response(Diaries)
# async def get_user_diaries(user_id: id) -> Diaries:
#     """Get all diaries for a specific user"""
#     query = """
#         SELECT id, user_id, title, description, created, did_not_go_well made_me_smile, grateful_for, image_url
#         FROM diaries
#         WHERE user_id = :user_id
#         """
#     values = {"user_id": user_id}
#     return [Diary(**row) async for row in g.connection.iterate(query, values)]
