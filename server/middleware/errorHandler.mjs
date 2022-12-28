export const errorHandler = () => {
  return async (ctx, next) => {
    try {
      await next();
    } catch (e) {
      const statusCode = e.status || e.statusCode || 500;
      if (ctx.status === 404) {
        ctx.status = 404;
        ctx.body = Boom.notFound().output.payload;
        return;
      }
      ctx.status = statusCode;
      ctx.body = Boom.boomify(e, { statusCode }).output.payload;
      ctx.app.emit("error", e, ctx);
    }
  };
};
