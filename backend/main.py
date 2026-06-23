import hashlib

from fastapi import FastAPI
from pydantic import BaseModel

from services.gemini_service import ask_gemini

# Old individual agents
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

# Optimized 3-call agents
from optimized_agents.extraction_planning_agent import run_extraction_planning
from optimized_agents.execution_planning_agent import run_execution_planning
from optimized_agents.decision_agent import run_decision_agent


app = FastAPI(title="Deadline Rescue AI")

response_cache = {}


def get_cache_key(text: str):
    return hashlib.md5(text.encode()).hexdigest()


class UserRequest(BaseModel):
    message: str


class TaskRequest(BaseModel):
    user_input: str


@app.get("/")
def home():
    return {
        "message": "Deadline Rescue AI Backend Running"
    }


@app.post("/test-gemini")
def test_gemini(request: UserRequest):
    response = ask_gemini(request.message)
    return {
        "gemini_response": response
    }


@app.post("/extract-tasks")
def task_extraction(request: TaskRequest):
    result = extract_tasks(request.user_input)
    return result


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
        "priority_result": priority_result
    }


# Legacy endpoint: 11 separate Gemini calls.
# Keep only for architecture reference. Do NOT use in frontend/demo.
@app.post("/deadline-rescue")
def deadline_rescue(request: TaskRequest):

    extracted_tasks = extract_tasks(request.user_input)
    normalized_tasks = normalize_dates(extracted_tasks)
    effort_tasks = estimate_effort(normalized_tasks)
    priority_result = prioritize_tasks(effort_tasks)

    today_plan = create_time_plan(
        effort_tasks,
        priority_result,
        request.user_input
    )

    risk_result = predict_risk(
        effort_tasks,
        priority_result,
        today_plan,
        request.user_input
    )

    recovery_result = create_recovery_plan(
        effort_tasks,
        priority_result,
        risk_result,
        today_plan
    )

    coach_result = generate_productivity_advice(
        request.user_input,
        effort_tasks,
        risk_result,
        today_plan,
        recovery_result
    )

    habit_result = analyze_habits(
        effort_tasks,
        risk_result
    )

    notification_result = generate_notifications(
        risk_result,
        recovery_result
    )

    calendar_result = generate_calendar(
        today_plan
    )

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
        "calendar_result": calendar_result
    }


@app.post("/deadline-rescue-fast")
def deadline_rescue_fast(request: TaskRequest):

    cache_key = get_cache_key(request.user_input)

    if cache_key in response_cache:
        cached_response = response_cache[cache_key]
        return {
            "cached": True,
            **cached_response
        }

    try:
        tasks_result = run_extraction_planning(
            request.user_input
        )

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
            "system_type": "Optimized 11-agent workflow using 3 Gemini calls",
            "logical_agents": [
                "Task Extraction Agent",
                "Date Normalization Agent",
                "Effort Estimation Agent",
                "Priority Agent",
                "Time Planner Agent",
                "Calendar Agent",
                "Risk Prediction Agent",
                "Recovery Planner Agent",
                "Productivity Coach Agent",
                "Habit Tracker Agent",
                "Notification Agent"
            ],
            "tasks_result": tasks_result,
            "execution_result": execution_result,
            "decision_result": decision_result
        }

        response_cache[cache_key] = final_response

        return {
            "cached": False,
            **final_response
        }

    except Exception as e:
        print("Deadline Rescue Fast Error:", e)

        return {
            "cached": False,
            "fallback": True,
            "error": "Gemini quota/rate limit reached. Showing demo-safe fallback response.",
            "system_type": "Optimized 11-agent workflow using 3 Gemini calls",
            "logical_agents": [
                "Task Extraction Agent",
                "Date Normalization Agent",
                "Effort Estimation Agent",
                "Priority Agent",
                "Time Planner Agent",
                "Calendar Agent",
                "Risk Prediction Agent",
                "Recovery Planner Agent",
                "Productivity Coach Agent",
                "Habit Tracker Agent",
                "Notification Agent"
            ],
            "tasks_result": {
                "tasks": [
                    {
                        "task_name": "Hackathon Submission",
                        "parent_task": "",
                        "deadline_text": "29 June",
                        "normalized_date": "2026-06-29",
                        "estimated_hours": 0,
                        "category": "Project",
                        "task_type": "parent",
                        "effort_reason": "Parent project containing frontend, backend, deployment, documentation and demo video."
                    },
                    {
                        "task_name": "Frontend",
                        "parent_task": "Hackathon Submission",
                        "deadline_text": "29 June",
                        "normalized_date": "2026-06-29",
                        "estimated_hours": 8,
                        "category": "Project",
                        "task_type": "subtask",
                        "effort_reason": "Core UI and dashboard implementation."
                    },
                    {
                        "task_name": "Backend",
                        "parent_task": "Hackathon Submission",
                        "deadline_text": "29 June",
                        "normalized_date": "2026-06-29",
                        "estimated_hours": 8,
                        "category": "Project",
                        "task_type": "subtask",
                        "effort_reason": "API and agent pipeline implementation."
                    },
                    {
                        "task_name": "Deployment",
                        "parent_task": "Hackathon Submission",
                        "deadline_text": "29 June",
                        "normalized_date": "2026-06-29",
                        "estimated_hours": 4,
                        "category": "Project",
                        "task_type": "subtask",
                        "effort_reason": "Deploy backend and frontend."
                    },
                    {
                        "task_name": "Documentation",
                        "parent_task": "Hackathon Submission",
                        "deadline_text": "29 June",
                        "normalized_date": "2026-06-29",
                        "estimated_hours": 3,
                        "category": "Project",
                        "task_type": "subtask",
                        "effort_reason": "Prepare README, Google Doc and architecture explanation."
                    }
                ]
            },
            "execution_result": {
                "priority_ranking": [
                    {
                        "task_name": "Backend",
                        "parent_task": "Hackathon Submission",
                        "priority_score": 95,
                        "priority_level": "Critical",
                        "reason": "Core backend must work before frontend integration."
                    },
                    {
                        "task_name": "Frontend",
                        "parent_task": "Hackathon Submission",
                        "priority_score": 90,
                        "priority_level": "Critical",
                        "reason": "Needed for demo and product experience."
                    },
                    {
                        "task_name": "Deployment",
                        "parent_task": "Hackathon Submission",
                        "priority_score": 85,
                        "priority_level": "High",
                        "reason": "Required for public submission link."
                    },
                    {
                        "task_name": "Documentation",
                        "parent_task": "Hackathon Submission",
                        "priority_score": 80,
                        "priority_level": "High",
                        "reason": "Required for evaluation and explanation."
                    }
                ],
                "today_plan": [
                    {
                        "time_block": "10:00 PM - 12:00 AM",
                        "task_name": "Backend",
                        "focus_area": "FastAPI + Gemini optimized endpoint",
                        "expected_output": "Stable /deadline-rescue-fast endpoint."
                    },
                    {
                        "time_block": "12:15 AM - 2:15 AM",
                        "task_name": "Frontend",
                        "focus_area": "Dashboard UI",
                        "expected_output": "Input screen and results dashboard."
                    },
                    {
                        "time_block": "2:30 AM - 3:30 AM",
                        "task_name": "Deployment",
                        "focus_area": "Deployment preparation",
                        "expected_output": "Environment variables and hosting setup."
                    }
                ],
                "calendar_events": [
                    {
                        "title": "Backend Work",
                        "start_time": "2026-06-24T22:00:00",
                        "end_time": "2026-06-25T00:00:00"
                    },
                    {
                        "title": "Frontend Dashboard",
                        "start_time": "2026-06-25T00:15:00",
                        "end_time": "2026-06-25T02:15:00"
                    },
                    {
                        "title": "Deployment Preparation",
                        "start_time": "2026-06-25T02:30:00",
                        "end_time": "2026-06-25T03:30:00"
                    }
                ],
                "planning_strategy": "Focus on the MVP first: backend, frontend, deployment and documentation."
            },
            "decision_result": {
                "risk_report": [
                    {
                        "task_name": "Hackathon Submission",
                        "parent_task": "",
                        "risk_score": 88,
                        "risk_level": "High",
                        "risk_reason": "Deadline is close and multiple components remain.",
                        "risk_reduction_action": "Build MVP first and skip non-essential features."
                    }
                ],
                "recovery_plan": [
                    {
                        "task_name": "Hackathon Submission",
                        "problem": "Too many features before deadline.",
                        "recovery_action": "Prioritize backend, frontend and deployment only.",
                        "what_to_skip": "Advanced UI, login, complex integrations.",
                        "next_24_hours_focus": "Complete working MVP pipeline."
                    }
                ],
                "productivity_advice": [
                    {
                        "advice_title": "MVP First",
                        "advice": "Finish one working flow before adding extra features.",
                        "reason": "A stable demo scores better than unfinished advanced features."
                    }
                ],
                "habit_report": {
                    "consistency_score": 0,
                    "streak_status": "No history available",
                    "habit_strength": "Not enough data",
                    "improvement_tip": "Start tracking completed tasks daily."
                },
                "notifications": [
                    {
                        "type": "High Risk",
                        "message": "Hackathon deadline is close. Focus on MVP today."
                    }
                ],
                "overall_summary": "Deadline Rescue AI created a focused MVP rescue plan using optimized multi-agent reasoning."
            }
        }