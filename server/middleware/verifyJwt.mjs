import jwt from "jsonwebtoken";

export const verifyJwt = async (ctx, next) => {
  const authHeader = ctx.request.headers.authorization;
  if (!authHeader) {
    ctx.throw(401);
  }

  try {
    const accessToken = authHeader.split(" ")[1];
    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    ctx.state.userId = decoded.id;
    await next();
  } catch (error) {
    ctx.throw(403);
  }
};
