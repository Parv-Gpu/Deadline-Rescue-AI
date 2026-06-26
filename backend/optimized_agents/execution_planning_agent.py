from optimized_agents.deadline_compression_agent import compress_tasks
from optimized_agents.balanced_scheduler_agent import build_balanced_schedule


def build_priority(tasks):
    ranking = []

    for index, task in enumerate(tasks):
        name = task.get("task_name", "Task").lower()

        if "leetcode" in name or "dsa" in name:
            score = 95
        elif any(x in name for x in ["dbms", "os", "cn", "oops", "network"]):
            score = 90
        elif any(x in name for x in ["frontend", "backend", "deploy"]):
            score = 88
        elif any(x in name for x in ["resume", "hr"]):
            score = 82
        else:
            score = 75

        score = max(55, score - index * 2)

        ranking.append({
            "task_name": task.get("task_name", "Task"),
            "parent_task": task.get("parent_task", ""),
            "priority_score": score,
            "priority_level": "Critical" if score >= 90 else "High" if score >= 75 else "Medium",
            "reason": "Prioritized using deadline pressure, workload, and interview importance.",
            "confidence_score": 0.86,
        })

    return ranking


def run_execution_planning(tasks_result, user_input):
    compressed = compress_tasks(tasks_result, user_input)
    schedule = build_balanced_schedule(compressed, user_input)

    tasks = compressed["tasks"]

    return {
        "priority_ranking": build_priority(tasks),
        "today_plan": schedule["today_plan"],
        "day_wise_plan": schedule["day_wise_plan"],
        "calendar_events": schedule["calendar_events"],
        "schedule_analysis": schedule["schedule_analysis"],
        "mvp_scope": {
            "must_have": [t.get("task_name", "Task") for t in tasks[:3]],
            "should_have": [t.get("task_name", "Task") for t in tasks[3:5]],
            "can_skip": ["Extra projects", "Advanced polish", "Low-priority revision"],
        },
        "planning_strategy": "Deadline Compression Agent first fits the workload into the user's deadline. Balanced Scheduler Agent then creates day-wise focus batches instead of scheduling one subject continuously.",
    }