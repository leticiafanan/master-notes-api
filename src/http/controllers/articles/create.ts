import { FastifyReply, FastifyRequest } from "fastify";
import { Article } from "../../../database/models/article";
import {z} from 'zod';
import slugify from 'slugify'
import { Types } from "mongoose";
import { BadRequestError } from "../../../errors/bad-request-error";



export async function create(request:FastifyRequest, reply:FastifyReply) {

  const schema = z.object({
    title: z.string().max(255),
    subtitle: z.string().max(500),
    content: z.string(),
    tags: z.array(z.string()),
  });

  const data = schema.parse(request.body);

  const { title, subtitle, content, tags} = data;

  const slug = slugify(title, {
    replacement: '-',  
    remove: undefined, 
    lower: true,
    strict: true,     
    locale: 'vi',      
    trim: true,         
  });

  const author = {
    id: new Types.ObjectId('67193aad9f457278c03296ae'),
    name:'Letícia Fanan',
  };

  const uniqueSlug = `${slug}-${author.id}`

  const findArticles = await Article.find({ slug: uniqueSlug });

  if (findArticles.length > 0) {
    throw new BadRequestError('Article title already exists');
  }

  console.log(findArticles);
  
  const createdArticle = await Article.create({
    slug: uniqueSlug,
    title,
    subtitle,
    content,
    tags,
    author,
  });

  return reply.status(201).send(createdArticle);
}