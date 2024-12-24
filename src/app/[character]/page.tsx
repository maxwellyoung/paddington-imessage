import { ChatForm } from "@/components/chat-form";
import { characters } from "@/lib/characters";
import { notFound } from "next/navigation";
import { Metadata } from "next";

interface PageProps {
  params: Promise<{ character: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const character = characters.find((c) => c.id === resolvedParams.character);
  return {
    title: character ? character.name : "Chat",
  };
}

export default async function CharacterPage({ params }: PageProps) {
  const resolvedParams = await params;
  const character = characters.find((c) => c.id === resolvedParams.character);

  if (!character || character.id === "divider") {
    notFound();
  }

  return <ChatForm />;
}

export function generateStaticParams() {
  return characters
    .filter((character) => character.id !== "divider")
    .map((character) => ({
      character: character.id,
    }));
}
