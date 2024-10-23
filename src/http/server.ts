import fastify from "fastify";
import { articlesRoutes } from "./controllers/articles/route";
import { setupMongo } from "../database";
import { ZodError } from "zod";
import { AppError } from "../errors/app-errors";

export const app = fastify();

setupMongo().then(() => {
  app.register(articlesRoutes);

  app.setErrorHandler((error, request, reply ) => {
    if(error instanceof ZodError) {
      return reply
      .status(400)
      .send({ message: 'Validation error.' , issues: error.format()})
    }

    if(error instanceof AppError) {
      return reply
      .status(error.statusCode)
      .send({ message: error.message});
    }

    return reply.status(500).send({ message: 'Internal server error.'})
  });

  app
    .listen({
      host: '0.0.0.0',
      port: 4000,
    }).then(() => {
      console.log(`🚀 Server ir running at port 4000... `)
    });
}).catch((err) => {
  console.log(err)
});
