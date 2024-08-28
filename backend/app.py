import os
from quart import g, Quart, redirect, abort
from quart_db import QuartDB
from quart_schema import QuartSchema, validate_request, validate_response, tag
from dataclasses import dataclass
from datetime import datetime
import bcrypt
from quart_auth import (
    AuthUser,
    current_user,
    login_required,
    login_user,
    logout_user,
    QuartAuth,
)

from quart_cors import cors


app = Quart(__name__)

app = cors(app, allow_origin="http://localhost:5173", allow_credentials=True)

app.config["QUART_AUTH_MODE"] = "bearer"

auth_manager = QuartAuth(app)

QuartDB(app, url="sqlite:///database.db")
QuartSchema(
    app,
    info={"title": "DearDiary API", "version": "1.0.0"},
    tags=[
        {"name": "User", "description": "User endpoints"},
        {"name": "Diary", "description": "Diary endpoints"},
        {"name": "Auth", "description": "Authentication endpoints"},
    ],
)
app.secret_key = os.environ["APP_SECRET_KEY"]


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


@app.get("/")
async def index():
    """Redirect to API documentation"""
    return redirect("http://127.0.0.1:5000/docs")


@dataclass
class ReturnUser(User):
    token: str


@app.post("/users/register")
@tag(["User"])
@validate_request(UserInput)
@validate_response(ReturnUser)
async def create_user(data: UserInput) -> ReturnUser:
    """Register new user account"""
    check_email_exists = await g.connection.fetch_one(
        "SELECT email FROM users WHERE email = :email", {"email": data.email}
    )
    if check_email_exists:
        return {"message": "Account already exists. Please log in."}, 400
    else:
        hashed_password = bcrypt.hashpw(
            data.password.encode("utf-8"), bcrypt.gensalt()
        ).decode("utf-8")

        result = await g.connection.fetch_one(
            """INSERT INTO users (name, email, password_hash)
        VALUES (:name, :email, :password_hash)
        RETURNING user_id, name, email, created""",
            {
                "name": data.name,
                "email": data.email.lower(),
                "password_hash": hashed_password,
            },
        )
        login_user(AuthUser(result["user_id"]))
        token = auth_manager.dump_token(current_user.auth_id)
        return ReturnUser(
            user_id=result["user_id"],
            name=result["name"],
            email=result["email"],
            created=result["created"],
            token=token,
        )


@dataclass
class LoginInput:
    email: str
    password: str


@app.post("/login")
@tag(["Auth"])
@validate_request(LoginInput)
@validate_response(ReturnUser)
async def user_login(data: UserInput) -> ReturnUser:
    """Login existing user account"""
    fetch_user = await g.connection.fetch_one(
        "SELECT * FROM users WHERE email = :email", {"email": data.email.lower()}
    )
    if fetch_user:
        if bcrypt.checkpw(
            data.password.encode("utf-8"), fetch_user["password_hash"].encode("utf-8")
        ):
            login_user(AuthUser(fetch_user["user_id"]))
            token = auth_manager.dump_token(current_user.auth_id)
            return {
                "token": token,
                "user_id": current_user.auth_id,
                "name": fetch_user["name"],
                "email": fetch_user["email"],
                "created": fetch_user["created"],
            }, 200
        else:
            return {"message": "Incorrect email or password."}, 400
    else:
        return {"message": "No account found. Please register."}, 404


@app.post("/logout")
@tag(["Auth"])
async def user_logout():
    """Logout existing user account"""
    logout_user()
    return {"message": "User logged out successfully."}, 200


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


@dataclass
class Diaries:
    diaries: list[Diary]


@app.get("/users")
@tag(["User"])
# @login_required
@validate_response(Users)
async def get_users() -> Users:
    """Get all users"""
    query = """SELECT user_id, created, name, email
        FROM users"""
    users = [User(**row) async for row in g.connection.iterate(query)]
    return Users(users=users)


@app.get("/users/<int:user_id>/diaries")
@tag(["User"])
@login_required
@login_required
@validate_response(Diaries)
async def get_user_diaries(user_id: id) -> Diaries:
    """Get all diaries for a specific user"""
    query = """
        SELECT * FROM diaries
        WHERE user_id = :user_id
        """
    values = {"user_id": user_id}
    diaries = [Diary(**row) async for row in g.connection.iterate(query, values)]
    return Diaries(diaries=diaries)


@app.get("/diaries")
@tag(["Diary"])
@validate_response(Diaries)
async def get_diaries() -> Diaries:
    """Get all diaries"""
    query = """SELECT * FROM diaries"""
    diaries = [Diary(**row) async for row in g.connection.iterate(query)]
    return Diaries(diaries=diaries)


@app.post("/diaries")
@tag(["Diary"])
@login_required
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
        },
    )
    return Diary(**result)


@app.put("/diaries/<int:diary_id>")
@tag(["Diary"])
@login_required
@validate_request(DiaryInput)
@validate_response(Diary)
async def update_diary(diary_id: int, data: DiaryInput) -> Diary:
    """Update an existing diary entry"""
    result = await g.connection.fetch_one(
        """
        UPDATE diaries 
        SET title = :title, description = :description, did_not_go_well = :did_not_go_well, made_me_smile = :made_me_smile, grateful_for = :grateful_for, image_url = :image_url, user_id = :user_id WHERE diary_id = :diary_id RETURNING diary_id, user_id, created, title, description, did_not_go_well, made_me_smile, grateful_for, image_url
        """,
        {
            "diary_id": diary_id,
            "title": data.title,
            "description": data.description,
            "did_not_go_well": data.did_not_go_well,
            "made_me_smile": data.made_me_smile,
            "grateful_for": data.grateful_for,
            "image_url": data.image_url,
            "user_id": data.user_id,
        },
    )
    if result is None:
        return {"message": "Diary not found"}, 404
    return Diary(**result)


@app.delete("/diaries/<int:diary_id>")
@tag(["Diary"])
@login_required
async def delete_diary(diary_id: int):
    """Delete a diary entry"""
    result = await g.connection.execute(
        """
        DELETE FROM diaries WHERE diary_id = :diary_id""",
        {"diary_id": diary_id},
    )
    print(result)
    return {"message": "Diary deleted successfully"}, 200
