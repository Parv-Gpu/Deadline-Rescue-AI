import re


def detect_deadline_days(user_input: str) -> int:
    text = user_input.lower()
    match = re.search(r"(\d+)\s*(days|day)", text)
    if match:
        return max(1, int(match.group(1)))
    return 7


def detect_daily_hours(user_input: str) -> int:
    text = user_input.lower()
    match = re.search(r"(\d+)\s*(hours|hrs|hour|hr)", text)
    if match:
        return min(max(int(match.group(1)), 2), 14)
    return 8


def task_category(task_name: str) -> str:
    name = task_name.lower()

    if "leetcode" in name or "dsa" in name:
        return "DSA"
    if any(x in name for x in ["dbms", "oops", "oop", "os", "operating", "cn", "network"]):
        return "Core CS"
    if any(x in name for x in ["resume", "hr", "interview"]):
        return "Placement"
    if any(x in name for x in ["frontend", "backend", "deploy", "ppt", "demo", "video", "testing", "documentation"]):
        return "Project"

    return "General"


def realistic_task_hours(task):
    name = task.get("task_name", "").lower()

    if "leetcode" in name:
        match = re.search(r"(\d+)", name)
        count = int(match.group(1)) if match else 50

        if count <= 80:
            return round(count * 0.42, 1)
        if count <= 150:
            return round(count * 0.36, 1)
        return round(count * 0.30, 1)

    rules = {
        "dbms": 6,
        "oops": 4,
        "oop": 4,
        "os": 6,
        "operating": 6,
        "cn": 5,
        "network": 5,
        "resume": 2,
        "hr": 3,
        "frontend": 8,
        "backend": 8,
        "deploy": 3,
        "deployment": 3,
        "ppt": 2,
        "presentation": 2,
        "demo": 2,
        "video": 2,
        "testing": 3,
        "documentation": 3,
    }

    for key, value in rules.items():
        if key in name:
            return value

    return task.get("estimated_hours", 2) or 2


def task_confidence(task):
    name = task.get("task_name", "").lower()

    if any(x in name for x in ["leetcode", "dbms", "oops", "os", "cn", "resume", "hr", "frontend", "backend"]):
        return 0.92
    if len(name.split()) >= 3:
        return 0.82
    return 0.68


def compress_tasks(tasks_result, user_input):
    tasks = tasks_result.get("tasks", [])
    workable_tasks = [t for t in tasks if t.get("task_type") != "parent"]

    deadline_days = detect_deadline_days(user_input)
    daily_hours = detect_daily_hours(user_input)
    available_hours = deadline_days * daily_hours

    compressed_tasks = []
    required_hours = 0

    for task in workable_tasks:
        task = task.copy()
        hrs = realistic_task_hours(task)

        task["estimated_hours"] = round(hrs, 1)
        task["original_estimated_hours"] = round(hrs, 1)
        task["category"] = task_category(task.get("task_name", ""))
        task["confidence_score"] = task_confidence(task)

        required_hours += hrs
        compressed_tasks.append(task)

    overloaded = required_hours > available_hours
    deficit = max(0, round(required_hours - available_hours, 1))

    if overloaded:
        ratio = available_hours / required_hours

        for task in compressed_tasks:
            name = task["task_name"].lower()

            if "leetcode" in name:
                task["estimated_hours"] = round(task["estimated_hours"] * max(0.62, ratio), 1)
                task["compression_note"] = "Focus on high-frequency patterns and reduce total question count."
            elif any(x in name for x in ["resume", "hr"]):
                task["estimated_hours"] = round(task["estimated_hours"] * 0.75, 1)
                task["compression_note"] = "Use focused preparation instead of deep polishing."
            else:
                task["estimated_hours"] = round(task["estimated_hours"] * max(0.72, ratio), 1)
                task["compression_note"] = "Do high-yield revision only."

    return {
        "tasks": compressed_tasks,
        "schedule_analysis": {
            "deadline_days": deadline_days,
            "daily_available_hours": daily_hours,
            "available_hours_before_deadline": available_hours,
            "estimated_required_hours": round(required_hours, 1),
            "time_deficit_hours": deficit,
            "overloaded": overloaded,
            "recommendation": (
                "Workload exceeds deadline. Use compressed high-yield revision and reduce low-priority depth."
                if overloaded
                else "Workload fits within the deadline."
            ),
        },
    }