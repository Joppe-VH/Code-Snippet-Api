import { z } from "zod";
import { decodeSnippet } from "../util";
import { RawQuery } from "../types";
import Snippet from "../models/snippetModel";
import { FilterQuery } from "mongoose";
import { splitOnComma } from "../util";
import { NotFoundError } from "../errors";

const snippetFilters = z.object({
  language: z.string().trim().optional(),
  tags: z.string().trim().optional(),
});

export const PaginationParamsSchema = z.object({
  limit: z.coerce.number().min(1).default(16),
  page: z.coerce.number().min(1).default(1),
});

export type SnippetFilter = z.infer<typeof snippetFilters>;
export type PaginationParams = z.infer<typeof PaginationParamsSchema>;

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

export const snippetServiceGetAll = async (
  query: RawQuery<SnippetFilter>,
  getPageLink: (page: number) => string
) => {
  const filter = buildSnippetFilter(query);
  const { limit, page } = PaginationParamsSchema.parse(query);
  const snippetCount = await Snippet.countDocuments(filter);
  const totalPages = Math.ceil(snippetCount / limit);
  const skip = (page - 1) * limit;

  if (page > 1 && skip >= snippetCount)
    throw new NotFoundError("Page not found");

  const snippets =
    snippetCount > 0 ? await Snippet.find(filter).skip(skip).limit(limit) : [];

  return {
    info: {
      count: snippetCount,
      page: page,
      pages: totalPages,
      prev: page > 1 ? getPageLink(page - 1) : null,
      next: page < totalPages ? getPageLink(page + 1) : null,
      first: page > 1 ? getPageLink(1) : null,
      last: page < totalPages ? getPageLink(totalPages) : null,
    },
    snippets: snippets.map(decodeSnippet),
  };
};
