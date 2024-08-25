import os
from quart import g, Quart, redirect
from quart_db import QuartDB
from quart_schema import QuartSchema, validate_request, validate_response
from dataclasses import dataclass
from datetime import datetime
import bcrypt
from quart_auth import (
    AuthUser, current_user, login_required, login_user, logout_user, QuartAuth
)

app = Quart(__name__)
QuartDB(app, url='sqlite:///database.db')
QuartSchema(app)
app.secret_key = os.environ["APP_SECRET_KEY"]
QuartAuth(app)
auth_manager = Auth

@dataclass
class UserInput:
    name: str
    email: str
    password: str

@dataclass
class User:
    user_id: int
    name: str
    email: str
    created: datetime
    
@dataclass 
class Users:
    users: list[User]

@app.get('/')
async def index():
    """Redirect to API documentation"""
    return redirect("http://127.0.0.1:5000/docs")

@app.get('/users')
@validate_response(Users)
async def get_users() -> Users:
    """Get all users"""
    query = ("""SELECT user_id, created, name, email
        FROM users""")
    users = [User(**row) async for row in g.connection.iterate(query) ]
    return Users(users=users)
    # need more clarification on how this works

@app.post('/register')
@validate_request(UserInput)
@validate_response(User)
async def create_user(data: UserInput) -> User:
    """Register new user account"""
    check_email_exists = await g.connection.fetch_one("SELECT email FROM users WHERE email = :email", {"email": data.email})
    if check_email_exists:
        return {"message": "User account already exists. Please log in."}, 400
    else:
        hashed_password = bcrypt.hashpw(data.password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        
        result = await g.connection.fetch_one(
        """INSERT INTO users (name, email, password_hash)
        VALUES (:name, :email, :password_hash)
        RETURNING user_id, name, email, created""",
        {"name": data.name, "email": data.email, "password_hash": hashed_password},)
        
        return User(**result)

@dataclass
class LoginInput:
    email: str
    password: str

@app.post('/login')
@login_required
@validate_request(LoginInput)
async def user_login(data: UserInput):
    """Login existing user account"""
    fetch_user = await g.connection.fetch_one("SELECT * FROM users WHERE email = :email", {"email": data.email})
    if fetch_user:
        print("")
        print(fetch_user)
        print("")
        if bcrypt.checkpw(data.password.encode('utf-8'), fetch_user['password_hash'].encode('utf-8')):
            return {"user found": fetch_user}, 200
        else:
            return {"message": "Incorrect email or password. Please try again."}, 400
    else:
        return {"message": "User account does not exist. Please register."}, 400



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
    diary_id: int  
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
        RETURNING diary_id, user_id, created, title, description, did_not_go_well, made_me_smile, grateful_for, image_url""",
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

@app.get('/users/<int:user_id>/diaries')
@validate_response(Diaries)
async def get_user_diaries(user_id: id) -> Diaries:
    """Get all diaries for a specific user"""
    query = """
        SELECT * FROM diaries
        WHERE user_id = :user_id
        """
    values = {"user_id": user_id}
    diaries = [Diary(**row) async for row in g.connection.iterate(query, values) ]
    return Diaries(diaries=diaries)
