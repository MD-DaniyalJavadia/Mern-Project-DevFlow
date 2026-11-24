import CodingSession from "../models/CodingSession.js";

export async function list(req, res, next) {
  try {
    const data = await CodingSession.find({ userId: req.user._id }).sort({ startedAt: -1 });
    res.json({ success: true, message: "Sessions fetched successfully", data });
  } catch (e) { next(e); }
}

export async function create(req, res, next) {
  try {
    const { startedAt, endedAt, durationSeconds } = req.body;
    const duration = Number(durationSeconds);
    if (!startedAt || !endedAt || !Number.isFinite(duration) || duration <= 0) {
      return res.status(400).json({ success: false, message: "startedAt, endedAt and a positive durationSeconds are required" });
    }
    const start = new Date(startedAt), end = new Date(endedAt);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end < start) {
      return res.status(400).json({ success: false, message: "Invalid session timestamps" });
    }
    const data = await CodingSession.create({ userId: req.user._id, startedAt: start, endedAt: end, durationSeconds: Math.floor(duration) });
    res.status(201).json({ success: true, message: "Session saved successfully", data });
  } catch (e) { next(e); }
}
