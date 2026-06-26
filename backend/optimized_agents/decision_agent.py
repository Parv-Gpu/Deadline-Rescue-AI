def _risk_level(score):
    if score >= 80:
        return "High"
    if score >= 55:
        return "Medium"
    return "Low"


def _calculate_risk(schedule):
    required = float(schedule.get("estimated_required_hours", 0))
    available = float(schedule.get("available_hours_before_deadline", 1))
    deficit = float(schedule.get("time_deficit_hours", 0))
    daily_hours = float(schedule.get("daily_available_hours", 8))
    deadline_days = int(schedule.get("deadline_days", 7))

    load_ratio = required / max(available, 1)

    risk = 18

    if load_ratio <= 0.45:
        risk += 12
    elif load_ratio <= 0.65:
        risk += 22
    elif load_ratio <= 0.85:
        risk += 35
    elif load_ratio <= 1:
        risk += 48
    else:
        risk += min(65, int(48 + (load_ratio - 1) * 45))

    if deficit > 0:
        risk += min(22, int(deficit / 2))

    if daily_hours >= 10:
        risk += 10
    elif daily_hours >= 8:
        risk += 4

    if deadline_days <= 5:
        risk += 10
    elif deadline_days <= 10:
        risk += 5

    return max(5, min(95, risk))


def _burnout(schedule):
    daily_hours = float(schedule.get("daily_available_hours", 8))
    overloaded = schedule.get("overloaded", False)
    deadline_days = int(schedule.get("deadline_days", 7))

    score = 15

    if daily_hours >= 10:
        score += 45
    elif daily_hours >= 8:
        score += 28
    elif daily_hours >= 6:
        score += 15

    if overloaded:
        score += 22

    if deadline_days <= 7:
        score += 10

    score = min(95, score)

    level = "High" if score >= 75 else "Medium" if score >= 45 else "Low"

    return {
        "burnout_score": score,
        "burnout_level": level,
        "reason": "Calculated from daily hours, deadline pressure, and overload.",
        "suggestion": (
            "Keep breaks fixed, avoid adding extra late-night blocks, and keep one lighter block daily."
            if level != "Low"
            else "Current workload is manageable with normal breaks."
        ),
    }


def _ai_recommendation(schedule, tasks):
    required = schedule.get("estimated_required_hours", 0)
    available = schedule.get("available_hours_before_deadline", 0)
    deficit = schedule.get("time_deficit_hours", 0)
    overloaded = schedule.get("overloaded", False)

    task_names = [t.get("task_name", "") for t in tasks]

    if overloaded:
        return {
            "title": "Cut Scope to Hit the Deadline",
            "summary": (
                f"You need about {required} hours but only have {available} hours. "
                f"You are short by {deficit} hours."
            ),
            "recommended_cuts": [
                "Reduce Leetcode count to high-frequency patterns only",
                "Do one-pass revision for lower-priority subjects",
                "Avoid extra projects and advanced polish",
            ],
            "recommended_focus": task_names[:3],
            "expected_improvement": "Following this can move the plan from high-risk to manageable."
        }

    return {
        "title": "Plan Looks Manageable",
        "summary": (
            f"Your workload is about {required} hours and you have {available} hours available."
        ),
        "recommended_cuts": ["No major cuts required"],
        "recommended_focus": task_names[:3],
        "expected_improvement": "Stay consistent and keep the last 1-2 days for revision."
    }


def run_decision_agent(tasks_result, execution_result, user_input):
    tasks = tasks_result.get("tasks", [])
    schedule = execution_result.get("schedule_analysis", {})

    risk_score = _calculate_risk(schedule)
    success_probability = max(5, min(95, 100 - risk_score))
    burnout = _burnout(schedule)
    recommendation = _ai_recommendation(schedule, tasks)

    required = schedule.get("estimated_required_hours", 0)
    available = schedule.get("available_hours_before_deadline", 0)
    deficit = schedule.get("time_deficit_hours", 0)

    top_task = tasks[0]["task_name"] if tasks else "highest priority task"

    if deficit > 0:
        recovery_action = (
            f"You are short by {deficit} hours. Reduce low-priority depth, "
            "compress revision, and focus only on high-yield work."
        )
    else:
        recovery_action = (
            "The workload fits within your deadline. Follow the balanced schedule and keep daily consistency."
        )

    return {
        "risk_report": [
            {
                "task_name": "Deadline Rescue Plan",
                "parent_task": "",
                "risk_score": risk_score,
                "risk_level": _risk_level(risk_score),
                "risk_reason": f"Estimated work is {required} hours and available time is {available} hours.",
                "risk_reduction_action": recovery_action,
                "confidence_score": 0.88,
            }
        ],
        "recovery_plan": [
            {
                "task_name": "Deadline Rescue Plan",
                "problem": f"Time deficit of {deficit} hours." if deficit > 0 else "No major time deficit.",
                "recovery_action": recovery_action,
                "what_to_skip": ", ".join(recommendation["recommended_cuts"]),
                "next_24_hours_focus": f"Start with {top_task} and complete the first scheduled block.",
            }
        ],
        "action_buckets": {
            "must_do": [task["task_name"] for task in tasks[:3]],
            "should_do": [task["task_name"] for task in tasks[3:6]],
            "can_skip": recommendation["recommended_cuts"],
        },
        "productivity_advice": [
            {
                "advice_title": "Use Focus Batching",
                "advice": "Each day should contain 2-3 focus areas, not one subject all day.",
                "reason": "This improves retention and prevents fatigue.",
            },
            {
                "advice_title": "Protect Energy",
                "advice": burnout["suggestion"],
                "reason": burnout["reason"],
            },
        ],
        "burnout_report": burnout,
        "ai_recommendation": recommendation,
        "ai_suggestions": [
            recommendation["summary"],
            f"Start with {top_task}.",
            "Avoid one-subject full days.",
            "Use the calendar blocks as your daily checklist.",
        ],
        "notifications": [
            {
                "type": "Risk Update",
                "message": f"Risk is {_risk_level(risk_score)} with {success_probability}% success probability.",
            },
            {
                "type": "Burnout",
                "message": f"Burnout risk is {burnout['burnout_level']}.",
            },
        ],
        "overall_summary": (
            f"Deadline Rescue AI estimated {required} hours of work against {available} available hours. "
            f"Current success probability is {success_probability}%."
        ),
        "overall_confidence_score": 0.86,
        "success_probability": success_probability,
    }