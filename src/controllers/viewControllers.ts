import { Request, Response } from "express";
import { snippetServiceGetAll } from "../services/snippetService";
import { makePageLinkBuilder } from "../util";

export const renderItemsView = async (req: Request, res: Response) => {
  const { snippets, info } = await snippetServiceGetAll(
    req.query,
    makePageLinkBuilder(req)
  );

  // temporary solution to get all snippets languages/tags
  const { snippets: allSnippets } = await snippetServiceGetAll(
    {},
    makePageLinkBuilder(req)
  );

  const languages = [
    ...new Set(allSnippets.map((snippet) => snippet.language)),
  ];
  const tags = [...new Set(allSnippets.map((snippet) => snippet.tags).flat())];

  res.render("dashboard", {
    snippets,
    info,
    title: "Dashboard",
    languages,
    tags,
    selectedLanguage: req.query.language,
    selectedTags: req.query.tags,
  });
};
