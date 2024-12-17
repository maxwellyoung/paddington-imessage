import { useState, useEffect } from "react";
import { Message } from "ai";

export type Conversation = {
  id: string;
  characterId: string;
  messages: Message[];
  lastUpdated: number;
};

export function useConversations(characterId: string) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const storageKey = "ai-conversations";

  useEffect(() => {
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      setConversations(JSON.parse(stored));
    }
  }, [storageKey]);

  const saveConversation = (messages: Message[]) => {
    const newConversations = [...conversations];
    const existing = newConversations.findIndex(
      (c) => c.characterId === characterId
    );

    const conversation: Conversation = {
      id: characterId,
      characterId,
      messages,
      lastUpdated: Date.now(),
    };

    if (existing >= 0) {
      newConversations[existing] = conversation;
    } else {
      newConversations.push(conversation);
    }

    localStorage.setItem(storageKey, JSON.stringify(newConversations));
    setConversations(newConversations);
  };

  const clearConversation = () => {
    const newConversations = conversations.filter(
      (c) => c.characterId !== characterId
    );
    localStorage.setItem(storageKey, JSON.stringify(newConversations));
    setConversations(newConversations);
  };

  return {
    conversations,
    saveConversation,
    clearConversation,
    currentConversation: conversations.find(
      (c) => c.characterId === characterId
    ),
  };
}
