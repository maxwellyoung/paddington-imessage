import Link from "next/link";
import { GroupAvatar } from "@/components/group-avatar";
import { characters } from "@/lib/characters";

export function ConversationsList() {
  return (
    <div className="mx-auto w-full max-w-lg">
      <div className="sticky top-0 border-b bg-[#f2f2f7]/90 p-4 backdrop-blur-md dark:bg-black/90">
        <h1 className="text-3xl font-bold">Messages</h1>
      </div>
      <div className="divide-y">
        {characters.map((character) =>
          character.id === "divider" ? (
            <div
              key="divider"
              className="bg-[#f2f2f7] px-4 py-2 text-sm font-medium text-gray-500 dark:bg-black/50 dark:text-gray-400"
            >
              {character.name}
            </div>
          ) : (
            <Link
              key={character.id}
              href={`/${character.id}`}
              className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <GroupAvatar
                name={character.name}
                image={character.image}
                className="relative h-12 w-12 shrink-0"
              />
              <div>
                <h2 className="font-medium">{character.name}</h2>
                <p className="text-sm text-gray-500">{character.subtitle}</p>
              </div>
            </Link>
          )
        )}
      </div>
    </div>
  );
}
