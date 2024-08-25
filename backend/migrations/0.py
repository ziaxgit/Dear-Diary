from quart_db import Connection

async def migrate(connection: Connection) -> None:
    await connection.execute(
        """CREATE TABLE users (
            user_id INTEGER PRIMARY KEY,
            created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            password_hash TEXT NOT NULL,
            name TEXT NOT NULL,
            email TEXT NOT NULL
        )"""
    )
    await connection.execute(
        """CREATE TABLE diaries (
            diary_id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL REFERENCES users(id),
            title TEXT NOT NULL,
            description TEXT NOT NULL,
            created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            did_not_go_well TEXT,
            made_me_smile TEXT,
            grateful_for TEXT,
            image_url TEXT
        )"""
    )

async def valid_migration(connection: Connection) -> bool:
    return True