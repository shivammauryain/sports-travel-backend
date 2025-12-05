import { v4 as uuidv4 } from "uuid";

const requestIdMiddleware = (req, res, next) => {
  const id = uuidv4();
  req.id = id;
  res.setHeader("X-Request-ID", id);
  next();
};

export default requestIdMiddleware;
