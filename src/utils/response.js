
export default function sendResponse(res, statusCode, success, data = null, message = "") {
  return res.status(statusCode).json({
    success,
    data,
    message,
  });
}
