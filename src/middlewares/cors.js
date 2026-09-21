function corsMiddleware(req, res, next) {
  // Define a origem permitida como a do seu frontend
  res.setHeader("Access-Control-Allow-Origin", "https://task-flow-beta-sepia.vercel.app");

  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );

  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  res.setHeader("Access-Control-Max-Age", "86400");

  if (req.method === "OPTIONS") {
    return res.sendStatus(204); // 204 No Content é o padrão HTTP ideal para preflight
  }

  next();
}

module.exports = corsMiddleware;