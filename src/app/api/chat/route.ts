import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import { characters } from "@/lib/characters";

export async function POST(req: Request) {
  const { messages, character = "paddington" } = await req.json();
  const selectedCharacter =
    characters.find((c) => c.id === character) || characters[0];

  const isGroup = character.includes("-");

  const result = streamText({
    model: openai("gpt-4", {}),
    system: isGroup
      ? selectedCharacter.systemPrompt
      : `You are ${selectedCharacter.name}. ${selectedCharacter.systemPrompt}`,
    messages,
  });

  return result.toDataStreamResponse();
}
