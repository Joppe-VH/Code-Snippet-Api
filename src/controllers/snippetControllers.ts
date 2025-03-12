import { Request, Response } from "express";
import Snippet from "../models/snippetModel";
import {
  decodeSnippet,
  encodeSnippet,
  snippetIdParamSchema,
  snippetSchema,
  makePageLinkBuilder,
} from "../util";
import { NotFoundError } from "../errors";
import { itemServiceGetAll } from "../services/snippetService";
export const addSnippet = async (req: Request, res: Response) => {
  const { title, code, language, tags, expiresIn } = snippetSchema.parse(
    req.body
  );

  const snippet = await Snippet.create(
    encodeSnippet({ title, code, language, tags, expiresIn })
  );

  res.status(201).json(decodeSnippet(snippet));
};

export const getSnippets = async (req: Request, res: Response) => {
  const getPageLink = makePageLinkBuilder(req);
  const snippets = await itemServiceGetAll(req.query, getPageLink);

  res.status(200).json(snippets);
};

export const getSnippetById = async (req: Request, res: Response) => {
  const { id } = snippetIdParamSchema.parse(req.params);

  const snippet = await Snippet.findById(id);

  if (!snippet) throw new NotFoundError("Snippet not found");
  if (snippet.expiresAt && snippet.expiresAt.getUTCMilliseconds() < Date.now())
    throw new NotFoundError("Snippet expired");

  res.status(200).json(decodeSnippet(snippet));
};

export const updateSnippet = async (req: Request, res: Response) => {
  const { id } = snippetIdParamSchema.parse(req.params);
  const { title, code, language, tags, expiresIn } = snippetSchema.parse(
    req.body
  );

  const snippet = await Snippet.findByIdAndUpdate(
    id,
    encodeSnippet({ title, code, language, tags, expiresIn }),
    { new: true }
  );

  if (!snippet) throw new NotFoundError("Snippet not found");

  res.status(200).json(decodeSnippet(snippet));
};

export const deleteSnippet = async (req: Request, res: Response) => {
  const { id } = snippetIdParamSchema.parse(req.params);

  const snippet = await Snippet.findByIdAndDelete(id);

  if (!snippet) throw new NotFoundError("Snippet not found");

  res.status(200).json({
    message: "Snippet deleted",
    deletedSnippet: decodeSnippet(snippet),
  });
};
