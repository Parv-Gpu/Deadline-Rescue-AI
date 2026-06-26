import sqlite3
import json
from datetime import datetime

DB_NAME = "deadline_rescue.db"


def get_connection():
    return sqlite3.connect(DB_NAME)


def create_tables():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS analyses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_input TEXT NOT NULL,
            response_json TEXT NOT NULL,
            created_at TEXT NOT NULL
        )
    """)

    conn.commit()
    conn.close()


def save_analysis(user_input: str, response_data: dict):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        INSERT INTO analyses (user_input, response_json, created_at)
        VALUES (?, ?, ?)
        """,
        (
            user_input,
            json.dumps(response_data),
            datetime.now().isoformat()
        )
    )

    conn.commit()
    analysis_id = cursor.lastrowid
    conn.close()

    return analysis_id


def get_all_analyses():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT id, user_input, created_at
        FROM analyses
        ORDER BY id DESC
    """)

    rows = cursor.fetchall()
    conn.close()

    return [
        {
            "id": row[0],
            "user_input": row[1],
            "created_at": row[2]
        }
        for row in rows
    ]


def get_analysis_by_id(analysis_id: int):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT id, user_input, response_json, created_at
        FROM analyses
        WHERE id = ?
    """, (analysis_id,))

    row = cursor.fetchone()
    conn.close()

    if not row:
        return None

    return {
        "id": row[0],
        "user_input": row[1],
        "response": json.loads(row[2]),
        "created_at": row[3]
    }