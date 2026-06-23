from pydantic import BaseModel
from typing import List, Optional


class Task(BaseModel):
    task_name: str
    deadline: Optional[str] = None
    estimated_hours: Optional[int] = None


class TaskList(BaseModel):
    tasks: List[Task]