import { Request, Response } from "express";
import { z } from "zod";
import Snippet from "../models/snippetModel";
import { encodedCode, decodedCode, decodeSnippet } from "../util";
export const addSnippet = async (req: Request, res: Response) => {
  const { title, code, language, tags, expiresIn } = z
    .object({
      title: z.string(),
      code: z.string().transform(encodedCode),
      language: z.string(),
      tags: z.array(z.string()),
      expiresIn: z.number().min(1).optional(),
    })
    .parse(req.body);

  const snippet = await Snippet.create({
    title,
    code,
    language,
    tags,
    // don't add expiresAt key if expiresIn is not provided
    ...(expiresIn
      ? { expiresAt: new Date(Date.now() + expiresIn * 1000) }
      : {}),
  });

  res.status(201).json(decodeSnippet(snippet));
};

export const getSnippets = async (req: Request, res: Response) => {
  const snippets = await Snippet.find();

  res.status(200).json(snippets.map(decodeSnippet));
};
