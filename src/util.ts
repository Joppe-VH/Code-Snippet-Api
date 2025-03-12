import Snippet from "./models/snippetModel";

// Encode
export const encodedCode = (str: string) => Buffer.from(str).toString("base64");
// Decode
export const decodedCode = (stringifiedBuffer: string) =>
  Buffer.from(stringifiedBuffer, "base64").toString("utf-8");

export const decodeSnippet = (snippet: InstanceType<typeof Snippet>) => {
  const snippetObj = snippet.toObject();
  return {
    ...snippetObj,
    code: decodedCode(snippetObj.code),
  };
};
