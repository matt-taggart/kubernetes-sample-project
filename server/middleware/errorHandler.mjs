import Boom from "@hapi/boom";

export const errorHandler = () => {
  return async (ctx, next) => {
    try {
      await next();
    } catch (e) {
      const statusCode = e.status || e.statusCode || 500;
      ctx.status = statusCode;
      ctx.body = Boom.boomify(e, {
        statusCode,
      }).output.payload;
      if (ctx.status === 404) {
        ctx.status = 404;
        ctx.body = Boom.notFound().output.payload;
        return;
      }
      ctx.app.emit("error", e, ctx);
    }
  };
};
