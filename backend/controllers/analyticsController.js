import Task from "../models/Task.js";
import Bug from "../models/Bug.js";
import CodingSession from "../models/CodingSession.js";

const startOfDay = (date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

const startOfWeek = (date) => {
  const d = startOfDay(date);
  const day = d.getDay();
  d.setDate(d.getDate() - day);
  return d;
};

const startOfMonth = (date) => {
  const d = startOfDay(date);
  d.setDate(1);
  return d;
};

const roundHours = (seconds = 0) => Math.round((seconds / 3600) * 10) / 10;

export async function analytics(req, res, next) {
  try {
    const userId = req.user._id;
    const now = new Date();
    const weekStart = startOfWeek(now);
    const monthStart = startOfMonth(now);
    const sevenDaysAgo = new Date(weekStart);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const [totalTasks, completedTasks, pendingTasks, openBugs, resolvedBugs, sessionAgg, weeklySessions, weeklyCompleted, weeklyResolved, monthlyCompleted, monthlyResolved] = await Promise.all([
      Task.countDocuments({ userId }),
      Task.countDocuments({ userId, status: "Completed" }),
      Task.countDocuments({ userId, status: { $ne: "Completed" } }),
      Bug.countDocuments({ userId, status: { $in: ["Open", "In Progress"] } }),
      Bug.countDocuments({ userId, status: { $in: ["Resolved", "Closed"] } }),
      CodingSession.aggregate([
        { $match: { userId } },
        { $group: { _id: null, total: { $sum: "$durationSeconds" } } }
      ]),
      CodingSession.aggregate([
        { $match: { userId, startedAt: { $gte: weekStart } } },
        { $group: { _id: { $dayOfWeek: "$startedAt" }, seconds: { $sum: "$durationSeconds" } } }
      ]),
      Task.aggregate([
        { $match: { userId, updatedAt: { $gte: weekStart }, status: "Completed" } },
        { $group: { _id: { $dayOfWeek: "$updatedAt" }, count: { $sum: 1 } } }
      ]),
      Bug.aggregate([
        { $match: { userId, updatedAt: { $gte: weekStart }, status: { $in: ["Resolved", "Closed"] } } },
        { $group: { _id: { $dayOfWeek: "$updatedAt" }, count: { $sum: 1 } } }
      ]),
      Task.aggregate([
        { $match: { userId, updatedAt: { $gte: monthStart }, status: "Completed" } },
        { $group: { _id: { $week: "$updatedAt" }, count: { $sum: 1 } } },
        { $sort: { "_id.week": 1 } }
      ]),
      Bug.aggregate([
        { $match: { userId, updatedAt: { $gte: monthStart }, status: { $in: ["Resolved", "Closed"] } } },
        { $group: { _id: { $week: "$updatedAt" }, count: { $sum: 1 } } },
        { $sort: { "_id.week": 1 } }
      ])
    ]);

    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const weekly = Array.from({ length: 7 }, (_, index) => {
      const dayIndex = (weekStart.getDay() + index) % 7;
      const mongoDay = dayIndex + 1;
      const session = weeklySessions.find(x => x._id === mongoDay);
      const tasks = weeklyCompleted.find(x => x._id === mongoDay);
      const bugs = weeklyResolved.find(x => x._id === mongoDay);
      return {
        day: dayNames[dayIndex],
        date: new Date(weekStart.getTime() + index * 86400000).toISOString().slice(0, 10),
        codingHours: roundHours(session?.seconds || 0),
        tasksCompleted: tasks?.count || 0,
        bugsResolved: bugs?.count || 0
      };
    });

    const monthlyMap = new Map();
    [...monthlyCompleted].forEach(item => monthlyMap.set(item._id.week, { week: item._id.week, tasksCompleted: item.count, bugsResolved: 0 }));
    [...monthlyResolved].forEach(item => {
      const existing = monthlyMap.get(item._id.week) || { week: item._id.week, tasksCompleted: 0, bugsResolved: 0 };
      existing.bugsResolved = item.count;
      monthlyMap.set(item._id.week, existing);
    });

    const monthly = [...monthlyMap.values()].sort((a, b) => a.week - b.week).map((item, index) => ({
      label: `Week ${index + 1}`,
      tasksCompleted: item.tasksCompleted,
      bugsResolved: item.bugsResolved
    }));

    res.json({
      success: true,
      message: "Analytics fetched successfully",
      data: {
        totalTasks,
        completedTasks,
        pendingTasks,
        openBugs,
        resolvedBugs,
        codingSeconds: sessionAgg[0]?.total || 0,
        codingHours: roundHours(sessionAgg[0]?.total || 0),
        weekly,
        monthly,
        generatedAt: now.toISOString()
      }
    });
  } catch (e) {
    next(e);
  }
}
