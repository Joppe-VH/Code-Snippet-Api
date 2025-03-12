import { Request, Response } from "express";
import { z } from "zod";
import Snippet from "../models/snippetModel";
import { encodedCode, decodeSnippet } from "../util";
export const addSnippet = async (req: Request, res: Response) => {
  const { title, code, language, tags, expiresIn } = z
    .object({
      title: z.string({ message: "Title is required" }),
      code: z.string().transform(encodedCode),
      language: z.string({ message: "Language is required" }),
      tags: z.array(z.string({ message: "Tags must be an array of strings" }), {
        message: "a tags  array is required",
      }),
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
