import Snippet from "./models/snippetModel";
import { z } from "zod";
import { isValidObjectId } from "mongoose";

// Encode
export const encodedCode = (str: string) => Buffer.from(str).toString("base64");
// Decode
export const decodedCode = (stringifiedBuffer: string) =>
  Buffer.from(stringifiedBuffer, "base64").toString("utf-8");

export const encodeSnippet = (snippet: SnippetInput) => {
  const { title, code, language, tags, expiresIn } = snippet;
  return {
    title,
    code,
    language,
    tags,
    // don't add expiresAt key if expiresIn is not provided
    ...(expiresIn
      ? { expiresAt: new Date(Date.now() + expiresIn * 1000) }
      : {}),
  };
};

export const decodeSnippet = (snippet: InstanceType<typeof Snippet>) => {
  const snippetObj = snippet.toObject();
  return {
    ...snippetObj,
    code: decodedCode(snippetObj.code),
  };
};

export const snippetIdParamSchema = z.object({
  id: z.string({ message: "id is required (string)" }).refine(isValidObjectId, {
    message: "id must be a valid mongoose Object ID",
  }),
});

export const snippetSchema = z.object({
  title: z.string({ message: "Title is required" }),
  code: z.string().transform(encodedCode),
  language: z.string({ message: "Language is required" }),
  tags: z.array(z.string({ message: "Tags must be an array of strings" }), {
    message: "a tags  array is required",
  }),
  expiresIn: z.number().min(1).optional(),
});

export type SnippetInput = z.infer<typeof snippetSchema>;

export const splitOn = (splitPattern: string | RegExp) => (val?: string) =>
  val?.split(splitPattern).filter(Boolean) ?? [];
export type SplitFunc = ReturnType<typeof splitOn>;

export const splitOnComma = splitOn(/\s*,\s*/);
export const splitOnSpace = splitOn(/\s+/);

import type { Request } from "express";

export const makePageLinkBuilder = (req: Request) => (page: number) => {
  const baseUrl = `${req.protocol}://${req.get("host")}${
    req.originalUrl.split("?")[0]
  }`;
  const queryParams = { ...req.query, page: page.toString() };
  return `${baseUrl}?${new URLSearchParams(queryParams).toString()}`;
};
