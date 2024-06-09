// utils/responseHelper.js

const sendResponse = (
  res,
  status,
  message,
  data = null,
  error = null,
  details = null
) => {
  const response = { status };

  if (status === "success") {
    response.message = message;
    if (data !== null) {
      response.data = data;
    }
  } else if (status === "fail") {
    response.error = message;
    if (details !== null) {
      response.details = details;
    }
  }

  res.status(status === "success" ? 200 : 400).json(response);
};

module.exports = sendResponse;
