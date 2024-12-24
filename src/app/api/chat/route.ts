import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import { characters } from "@/lib/characters";

export async function POST(req: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return new Response("OpenAI API key not configured", { status: 500 });
    }

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
  } catch (error) {
    console.error("Chat API Error:", error);
    return new Response(`Error: ${error.message}`, { status: 500 });
  }
}
