import { ChatForm } from "@/components/chat-form";
import { characters } from "@/lib/characters";
import { notFound } from "next/navigation";

interface PageProps {
  params: {
    character: string;
  };
}

export default function CharacterPage({ params }: PageProps) {
  const character = characters.find((c) => c.id === params.character);

  if (!character || character.id === "divider") {
    notFound();
  }

  return <ChatForm />;
}

// Optional: Generate static paths for all characters
export function generateStaticParams() {
  return characters
    .filter((character) => character.id !== "divider")
    .map((character) => ({
      character: character.id,
    }));
}
