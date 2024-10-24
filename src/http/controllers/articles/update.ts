import type { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { Article } from "../../../database/models/article";
import { findArticleById } from "./find";
import { Types } from "mongoose";
import { ForbiddenError } from "../../../errors/forbidden-error";
import slugify from "slugify";


export async function update(request: FastifyRequest, reply: FastifyReply) {
  const paramsSchema = z.object({
    id: z.string().length(24),
  });

  const params = paramsSchema.parse(request.params);

  const article = await findArticleById(params.id);

  //TODO use logged user
  const user = {
    _id: new Types.ObjectId('67193aad9f457278c03296ae'),
    name:'Letícia Fanan',
  };

  if (String(article.author?.id) !== user._id.toString()) {
    throw new ForbiddenError('This article is from another author.')
  }
  
  const bodySchema = z.object({
    title: z.string().max(255).optional(),
    subtitle: z.string().max(500).optional(),
    content: z.string().optional(),
    tags: z.array(z.string().optional()),
  });

  const data = bodySchema.parse(request.body);

  const updateData: z.infer<typeof bodySchema> & {slug?: string} = {...data};

  if (data.title) {

    const slug = slugify(data.title, {
      replacement: '-',  
    remove: undefined, 
    lower: true,
    strict: true,     
    locale: 'vi',      
    trim: true, 
    });

    updateData.slug = `${slug}-${user._id}`

  }

  const updateArticle =  await Article.findByIdAndUpdate(params.id, data, { new: true});

  return reply.status(200).send(updateArticle);

}