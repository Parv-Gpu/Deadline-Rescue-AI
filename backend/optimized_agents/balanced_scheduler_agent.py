from datetime import datetime, timedelta
import re


def category(name):
    n = name.lower()
    if "leetcode" in n or "dsa" in n:
        return "dsa"
    if any(x in n for x in ["dbms", "oops", "oop", "os", "operating", "cn", "network"]):
        return "core"
    if any(x in n for x in ["resume", "hr", "interview"]):
        return "placement"
    if any(x in n for x in ["frontend", "backend", "deploy", "ppt", "demo", "video", "testing", "documentation"]):
        return "project"
    return "general"


def start_hour(user_input):
    text = user_input.lower()
    if any(x in text for x in ["night", "10 pm", "11 pm", "late night"]):
        return 22
    return 9


def make_chunks(task):
    name = task["task_name"]
    hrs = float(task.get("estimated_hours", 2))
    total_minutes = int(hrs * 60)
    cat = category(name)

    if "leetcode" in name.lower():
        match = re.search(r"(\d+)", name.lower())
        total_q = int(match.group(1)) if match else 50

        approx_q = max(1, int(total_q * (hrs / max(task.get("original_estimated_hours", hrs), 1))))
        chunks = []
        q = 1

        while q <= approx_q:
            end = min(q + 2, approx_q)
            chunks.append({
                "base_task": "Leetcode",
                "task_name": f"Leetcode Q{q}-Q{end}",
                "category": "dsa",
                "minutes": min(90, (end - q + 1) * 25),
                "focus_area": "DSA pattern practice",
                "expected_output": f"Solve and revise questions {q} to {end}",
            })
            q = end + 1

        return chunks

    chunks = []
    session = 1

    while total_minutes > 0:
        duration = min(90, total_minutes)
        chunks.append({
            "base_task": name,
            "task_name": name if total_minutes <= 90 else f"{name} - Session {session}",
            "category": cat,
            "minutes": duration,
            "focus_area": f"Focused work on {name}",
            "expected_output": f"Complete measurable progress in {name}",
        })
        total_minutes -= duration
        session += 1

    return chunks


def choose_focus(queues, day):
    available = [k for k, v in queues.items() if v]

    dsa = [x for x in available if queues[x][0]["category"] == "dsa"]
    core = [x for x in available if queues[x][0]["category"] == "core"]
    placement = [x for x in available if queues[x][0]["category"] == "placement"]
    project = [x for x in available if queues[x][0]["category"] == "project"]
    general = [x for x in available if queues[x][0]["category"] == "general"]

    focus = []

    if dsa:
        focus.append(dsa[0])

    if core:
        focus.append(core[day % len(core)])

    if placement and day % 2 == 0:
        focus.append(placement[day % len(placement)])

    if project and day % 2 == 1:
        focus.append(project[day % len(project)])

    for item in core + project + placement + general:
        if item not in focus and len(focus) < 3:
            focus.append(item)

    return focus[:3] if focus else available[:1]


def build_balanced_schedule(compressed_result, user_input):
    tasks = compressed_result["tasks"]
    analysis = compressed_result["schedule_analysis"]

    queues = {}
    for task in tasks:
        chunks = make_chunks(task)
        if chunks:
            queues[chunks[0]["base_task"]] = chunks

    day_wise_plan = []
    calendar_events = []
    today_plan = []

    start = datetime.now() + timedelta(days=1)
    hour = start_hour(user_input)
    daily_minutes = analysis["daily_available_hours"] * 60

    for day in range(analysis["deadline_days"]):
        if not any(queues.values()):
            break

        date = start + timedelta(days=day)
        current = date.replace(hour=hour, minute=0, second=0, microsecond=0)

        focus = choose_focus(queues, day)
        blocks = []
        used = 0
        pointer = 0
        used_count = {}

        while used < daily_minutes and any(queues.values()):
            active = [f for f in focus if f in queues and queues[f]]

            if not active:
                focus = choose_focus(queues, day)
                active = [f for f in focus if f in queues and queues[f]]
                if not active:
                    break

            selected = active[pointer % len(active)]

            if used_count.get(selected, 0) >= 2 and len(active) > 1:
                pointer += 1
                continue

            chunk = queues[selected][0]
            duration = min(chunk["minutes"], 90, daily_minutes - used)
            end = current + timedelta(minutes=duration)

            block = {
                "start_time": current.strftime("%H:%M"),
                "end_time": end.strftime("%H:%M"),
                "task_name": chunk["task_name"],
                "focus_area": chunk["focus_area"],
                "expected_output": chunk["expected_output"],
                "category": chunk["category"],
            }

            blocks.append(block)
            calendar_events.append({
                "title": block["task_name"],
                "start_time": current.strftime("%Y-%m-%dT%H:%M:%S"),
                "end_time": end.strftime("%Y-%m-%dT%H:%M:%S"),
            })

            if day == 0:
                today_plan.append({
                    "time_block": f"{current.strftime('%I:%M %p')} - {end.strftime('%I:%M %p')}",
                    "task_name": block["task_name"],
                    "focus_area": block["focus_area"],
                    "expected_output": block["expected_output"],
                })

            chunk["minutes"] -= duration
            if chunk["minutes"] <= 0:
                queues[selected].pop(0)

            used_count[selected] = used_count.get(selected, 0) + 1
            used += duration
            current = end

            if used < daily_minutes and any(queues.values()):
                break_end = current + timedelta(minutes=15)
                blocks.append({
                    "start_time": current.strftime("%H:%M"),
                    "end_time": break_end.strftime("%H:%M"),
                    "task_name": "Break",
                    "focus_area": "Short reset break",
                    "expected_output": "Refresh focus",
                    "category": "break",
                })
                used += 15
                current = break_end

            pointer += 1

            active_after = [f for f in focus if f in queues and queues[f]]
            if active_after and all(used_count.get(x, 0) >= 2 for x in active_after):
                break

        day_wise_plan.append({
            "date": date.strftime("%Y-%m-%d"),
            "day_label": f"Day {day + 1}",
            "focus_areas": focus,
            "blocks": blocks,
        })

    remaining = [k for k, v in queues.items() if v]
    analysis["remaining_after_deadline"] = remaining

    return {
        "day_wise_plan": day_wise_plan,
        "calendar_events": calendar_events,
        "today_plan": today_plan,
        "schedule_analysis": analysis,
    }