from fastapi import FastAPI
from pydantic import BaseModel

from services.gemini_service import ask_gemini

from agents.task_extraction_agent import extract_tasks
from agents.date_agent import normalize_dates
from agents.effort_agent import estimate_effort
from agents.priority_agent import prioritize_tasks
from agents.time_planner_agent import create_time_plan
from agents.risk_agent import predict_risk
from agents.recovery_agent import create_recovery_plan
from agents.coach_agent import generate_productivity_advice

app = FastAPI(title="Deadline Rescue AI")


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

    return {
        "extracted_tasks": extracted_tasks,
        "normalized_tasks": normalized_tasks,
        "effort_estimation": effort_tasks,
        "priority_result": priority_result,
        "today_plan": today_plan,
        "risk_result": risk_result,
        "recovery_result": recovery_result,
        "coach_result": coach_result
    }