import { z } from "zod";
import { decodeSnippet } from "../util";
import { RawQuery } from "../types";
import Snippet from "../models/snippetModel";
import { FilterQuery } from "mongoose";
import { splitOnComma } from "../util";

const snippetFilters = z.object({
  language: z.string().trim().optional(),
  tags: z.string().trim().optional(),
});

export type SnippetFilter = z.infer<typeof snippetFilters>;

const buildSnippetFilter = (query: RawQuery<SnippetFilter>) => {
  const { language, tags } = snippetFilters.parse(query);
  const andConditions: FilterQuery<typeof Snippet>[] = [];

  if (tags) {
    const tagsArray = splitOnComma(tags);
    if (tagsArray.length > 0) {
      const tagsRegex = new RegExp(tagsArray.join("|"), "i");
      andConditions.push({ tags: { $in: [tagsRegex] } });
    }
  }

  if (language) {
    andConditions.push({ language: new RegExp(language, "i") });
  }

  return andConditions.length > 0 ? { $and: andConditions } : {};
};

export const itemServiceGetAll = async (query: RawQuery<SnippetFilter>) => {
  const filter = buildSnippetFilter(query);
  const snippets = await Snippet.find(filter);
  return snippets.map(decodeSnippet);
};
