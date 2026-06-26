from optimized_agents.deadline_compression_agent import compress_tasks
from optimized_agents.balanced_scheduler_agent import build_balanced_schedule


def build_priority(tasks, schedule_analysis):
    ranking = []

    deadline_days = schedule_analysis.get("deadline_days", 7)
    overloaded = schedule_analysis.get("overloaded", False)

    for task in tasks:
        name = task.get("task_name", "").lower()
        hours = float(task.get("estimated_hours", 0))

        urgency = max(5, 35 - deadline_days)
        workload = min(35, int(hours * 1.3))

        if "leetcode" in name or "dsa" in name:
            impact = 34
        elif any(x in name for x in ["dbms", "os", "cn", "oops", "network"]):
            impact = 30
        elif any(x in name for x in ["frontend", "backend", "deploy"]):
            impact = 32
        elif any(x in name for x in ["resume", "hr"]):
            impact = 22
        else:
            impact = 18

        overload_bonus = 8 if overloaded and impact >= 30 else 0

        score = min(98, max(35, urgency + workload + impact + overload_bonus))

        ranking.append({
            "task_name": task.get("task_name", "Task"),
            "parent_task": task.get("parent_task", ""),
            "priority_score": score,
            "priority_level": "Critical" if score >= 85 else "High" if score >= 65 else "Medium",
            "reason": "Calculated from urgency, workload, impact, and overload pressure.",
            "confidence_score": task.get("confidence_score", 0.82),
        })

    ranking.sort(key=lambda x: x["priority_score"], reverse=True)
    return ranking


def run_execution_planning(tasks_result, user_input):
    compressed = compress_tasks(tasks_result, user_input)
    schedule = build_balanced_schedule(compressed, user_input)

    tasks = compressed["tasks"]
    schedule_analysis = schedule["schedule_analysis"]

    return {
        "priority_ranking": build_priority(tasks, schedule_analysis),
        "today_plan": schedule["today_plan"],
        "day_wise_plan": schedule["day_wise_plan"],
        "calendar_events": schedule["calendar_events"],
        "schedule_analysis": schedule_analysis,
        "mvp_scope": {
            "must_have": [t.get("task_name", "Task") for t in tasks[:3]],
            "should_have": [t.get("task_name", "Task") for t in tasks[3:6]],
            "can_skip": ["Extra projects", "Advanced polish", "Low-priority revision"],
        },
        "planning_strategy": (
            "Deadline Compression Agent fits workload into the deadline. "
            "Balanced Scheduler Agent creates realistic focus batches. "
            "Priority is calculated dynamically from urgency, workload, impact, and overload."
        ),
    }