import hashlib
import re
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from services.gemini_service import ask_gemini

from database.db import (
    create_tables,
    save_analysis,
    get_all_analyses,
    get_analysis_by_id,
)

from agents.task_extraction_agent import extract_tasks
from agents.date_agent import normalize_dates
from agents.effort_agent import estimate_effort
from agents.priority_agent import prioritize_tasks
from agents.time_planner_agent import create_time_plan
from agents.risk_agent import predict_risk
from agents.recovery_agent import create_recovery_plan
from agents.coach_agent import generate_productivity_advice
from agents.habit_agent import analyze_habits
from agents.notification_agent import generate_notifications
from agents.calendar_agent import generate_calendar

from optimized_agents.extraction_planning_agent import run_extraction_planning
from optimized_agents.execution_planning_agent import run_execution_planning
from optimized_agents.decision_agent import run_decision_agent


app = FastAPI(title="Deadline Rescue AI")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

create_tables()
response_cache = {}


class UserRequest(BaseModel):
    message: str


class TaskRequest(BaseModel):
    user_input: str


def get_cache_key(text: str):
    return hashlib.md5(text.encode()).hexdigest()


def local_task_extraction(user_input: str):
    text = user_input.lower()
    tasks = []

    deadline_match = re.search(r"(\d{1,2})\s*(january|february|march|april|may|june|july|august|september|october|november|december)", text)
    deadline_text = deadline_match.group(0) if deadline_match else "Not specified"

    month_map = {
        "january": "01", "february": "02", "march": "03", "april": "04",
        "may": "05", "june": "06", "july": "07", "august": "08",
        "september": "09", "october": "10", "november": "11", "december": "12",
    }

    normalized_date = "2026-06-29"
    if deadline_match:
        day = deadline_match.group(1).zfill(2)
        month = month_map.get(deadline_match.group(2), "06")
        normalized_date = f"2026-{month}-{day}"

    def add_task(name, hours, category="Study"):
        tasks.append({
            "task_name": name,
            "parent_task": "Deadline Rescue Plan",
            "deadline_text": deadline_text,
            "normalized_date": normalized_date,
            "estimated_hours": hours,
            "category": category,
            "task_type": "subtask",
            "effort_reason": "Estimated locally because Gemini quota was unavailable.",
            "confidence_score": 0.82
        })

    leetcode_match = re.search(r"(\d+)\s*(leetcode|questions|problems)", text)
    if leetcode_match:
        count = int(leetcode_match.group(1))
        add_task(f"Complete {count} Leetcode questions", round((count * 35) / 60, 1), "DSA")

    if "dbms" in text:
        add_task("Revise DBMS", 8, "Core CS")

    if "oops" in text or "oop" in text:
        add_task("Revise OOPS", 5, "Core CS")

    if "os" in text or "operating system" in text:
        add_task("Revise OS", 8, "Core CS")

    if "cn" in text or "computer network" in text:
        add_task("Revise CN", 7, "Core CS")

    if "resume" in text:
        add_task("Update resume", 3, "Placement")

    if "hr" in text:
        add_task("Prepare HR questions", 4, "Interview")

    if "frontend" in text:
        add_task("Frontend development", 8, "Project")

    if "backend" in text:
        add_task("Backend development", 8, "Project")

    if "deploy" in text or "deployment" in text:
        add_task("Deployment", 3, "Project")

    if "ppt" in text or "presentation" in text:
        add_task("Prepare PPT", 2, "Submission")

    if "demo video" in text or "video" in text:
        add_task("Record demo video", 2, "Submission")

    if not tasks:
        add_task("Understand requirements", 2, "Planning")
        add_task("Complete main work", 6, "Project")
        add_task("Testing and final review", 3, "Review")

    return {
        "tasks": tasks,
        "availability_blockers": [],
        "source": "local_fallback_extractor"
    }


def local_decision_agent(tasks_result, execution_result, user_input):
    tasks = tasks_result.get("tasks", [])
    total_hours = sum(task.get("estimated_hours", 0) for task in tasks)
    risk_score = 88 if total_hours > 25 else 70 if total_hours > 12 else 45

    parent_name = "Deadline Rescue Plan"

    return {
        "risk_report": [
            {
                "task_name": parent_name,
                "parent_task": "",
                "risk_score": risk_score,
                "risk_level": "High" if risk_score >= 75 else "Medium" if risk_score >= 45 else "Low",
                "risk_reason": "Risk calculated locally based on workload size and deadline pressure.",
                "risk_reduction_action": "Break large tasks into daily chunks and finish highest-priority work first.",
                "confidence_score": 0.82
            }
        ],
        "recovery_plan": [
            {
                "task_name": parent_name,
                "problem": "Large workload needs realistic scheduling.",
                "recovery_action": "Follow the day-wise plan, avoid multitasking, and complete priority chunks first.",
                "what_to_skip": "Advanced UI polish, optional features, and low-impact tasks.",
                "next_24_hours_focus": "Start with the first high-effort task block from the schedule."
            }
        ],
        "action_buckets": {
            "must_do": [task["task_name"] for task in tasks[:3]],
            "should_do": [task["task_name"] for task in tasks[3:5]],
            "can_skip": ["Advanced UI polish", "Optional integrations", "Extra features"]
        },
        "productivity_advice": [
            {
                "advice_title": "Chunk Large Tasks",
                "advice": "Do not attempt huge tasks in one sitting. Split them into realistic 60-90 minute blocks.",
                "reason": "Chunking improves completion rate and prevents burnout."
            }
        ],
        "habit_report": {
            "consistency_score": 0,
            "streak_status": "No history available",
            "habit_strength": "Not enough data",
            "improvement_tip": "Track completed blocks daily."
        },
        "notifications": [
            {
                "type": "Smart Schedule",
                "message": "Large tasks were split into realistic day-wise blocks."
            }
        ],
        "overall_summary": "Deadline Rescue AI generated a realistic local rescue plan using task chunking and day-wise scheduling.",
        "overall_confidence_score": 0.82
    }


@app.get("/")
def home():
    return {"message": "Deadline Rescue AI Backend Running"}


@app.post("/test-gemini")
def test_gemini(request: UserRequest):
    response = ask_gemini(request.message)
    return {"gemini_response": response}


@app.post("/extract-tasks")
def task_extraction(request: TaskRequest):
    return extract_tasks(request.user_input)


@app.post("/prioritize-tasks")
def priority_agent(request: TaskRequest):
    extracted_tasks = extract_tasks(request.user_input)
    normalized_tasks = normalize_dates(extracted_tasks)
    effort_tasks = estimate_effort(normalized_tasks)
    priority_result = prioritize_tasks(effort_tasks)

    return {
        "extracted_tasks": extracted_tasks,
        "normalized_tasks": normalized_tasks,
        "effort_estimation": effort_tasks,
        "priority_result": priority_result,
    }


@app.post("/deadline-rescue")
def deadline_rescue(request: TaskRequest):
    extracted_tasks = extract_tasks(request.user_input)
    normalized_tasks = normalize_dates(extracted_tasks)
    effort_tasks = estimate_effort(normalized_tasks)
    priority_result = prioritize_tasks(effort_tasks)

    today_plan = create_time_plan(effort_tasks, priority_result, request.user_input)
    risk_result = predict_risk(effort_tasks, priority_result, today_plan, request.user_input)
    recovery_result = create_recovery_plan(effort_tasks, priority_result, risk_result, today_plan)
    coach_result = generate_productivity_advice(
        request.user_input, effort_tasks, risk_result, today_plan, recovery_result
    )
    habit_result = analyze_habits(effort_tasks, risk_result)
    notification_result = generate_notifications(risk_result, recovery_result)
    calendar_result = generate_calendar(today_plan)

    return {
        "extracted_tasks": extracted_tasks,
        "normalized_tasks": normalized_tasks,
        "effort_estimation": effort_tasks,
        "priority_result": priority_result,
        "today_plan": today_plan,
        "risk_result": risk_result,
        "recovery_result": recovery_result,
        "coach_result": coach_result,
        "habit_result": habit_result,
        "notification_result": notification_result,
        "calendar_result": calendar_result,
    }


@app.post("/deadline-rescue-fast")
def deadline_rescue_fast(request: TaskRequest):
    cache_key = get_cache_key(request.user_input + "_smart_features_v1")

    fallback_used = True

    tasks_result = local_task_extraction(request.user_input)

    execution_result = run_execution_planning(
        tasks_result,
        request.user_input
    )

    decision_result = run_decision_agent(
        tasks_result,
        execution_result,
        request.user_input
    )

    final_response = {
        "cached": False,
        "fallback": fallback_used,
        "error": "Using deterministic local planner for realistic scheduling.",
        "system_type": "Optimized 13-agent workflow with smart risk, recovery, team and calendar intelligence",
        "logical_agents": [
            "Task Extraction Agent",
            "Date Normalization Agent",
            "Effort Estimation Agent",
            "Priority Agent",
            "Deadline Compression Agent",
            "Balanced Scheduler Agent",
            "Calendar Agent",
            "Dynamic Risk Agent",
            "Recovery Planner Agent",
            "Burnout Prediction Agent",
            "Team Assignment Agent",
            "Email Schedule Agent",
            "Notification Agent",
        ],
        "tasks_result": tasks_result,
        "execution_result": execution_result,
        "decision_result": decision_result,
    }

    analysis_id = save_analysis(request.user_input, final_response)
    final_response["analysis_id"] = analysis_id
    response_cache[cache_key] = final_response

    return final_response


@app.get("/history")
def history():
    return get_all_analyses()


@app.get("/history/{analysis_id}")
def single_history(analysis_id: int):
    result = get_analysis_by_id(analysis_id)

    if not result:
        return {"error": "Analysis not found"}

    return result