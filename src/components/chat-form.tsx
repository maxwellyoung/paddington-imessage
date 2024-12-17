"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useChat } from "ai/react";
import {
  ArrowUpCircle,
  Paperclip,
  Camera,
  ChevronLeft,
  ArrowRightCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AutoResizeTextarea } from "@/components/autoresize-textarea";
import Image from "next/image";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { characters } from "@/lib/characters";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Message } from "ai";
import { GroupAvatar } from "@/components/group-avatar";

const messageVariants: Variants = {
  initial: {
    opacity: 0,
    y: 10,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: [0.4, 0, 0.2, 1],
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: {
      duration: 0.2,
      ease: [0.4, 0, 1, 1],
    },
  },
};

const typingVariants: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: "linear",
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.2,
      ease: "ease-out",
    },
  },
};

const bubbleVariants: Variants = {
  hover: {
    scale: 1.01,
    transition: {
      duration: 0.2,
      ease: [0.4, 0, 0.2, 1],
    },
  },
  tap: {
    scale: 0.99,
    transition: {
      duration: 0.1,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};

const typingIndicator = (
  <div className="flex gap-1">
    <motion.span
      className="h-2 w-2 rounded-full bg-[#007aff]"
      animate={{ scale: [1, 1.2, 1] }}
      transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
    />
    <motion.span
      className="h-2 w-2 rounded-full bg-[#007aff]"
      animate={{ scale: [1, 1.2, 1] }}
      transition={{
        duration: 1,
        delay: 0.2,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
    <motion.span
      className="h-2 w-2 rounded-full bg-[#007aff]"
      animate={{ scale: [1, 1.2, 1] }}
      transition={{
        duration: 1,
        delay: 0.4,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  </div>
);

const nextButtonVariants: Variants = {
  initial: { opacity: 0.8 },
  hover: {
    opacity: 1,
    scale: 1.05,
    transition: { duration: 0.2 },
  },
  tap: {
    scale: 0.95,
    transition: { duration: 0.1 },
  },
};

export function ChatForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const params = useParams();
  const selectedCharacter =
    characters.find((c) => c.id === params.character) || characters[0];
  const { messages, input, setInput, append } = useChat({
    api: "/api/chat",
    body: {
      character: selectedCharacter.id,
    },
  });
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;
    await append({ content: input, role: "user" });
    setInput("");
    setIsTyping(true);
    setTimeout(() => setIsTyping(false), Math.random() * 1000 + 1000); // Simulate typing time
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (input.trim()) {
        handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
        setInput("");
      }
    }
  };

  const handleNext = async () => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      append({
        role: "assistant",
        content: "...",
      });
    }, Math.random() * 1000 + 1000);
  };

  const header = (
    <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-[#f2f2f7]/90 p-2 backdrop-blur-md dark:bg-[#1c1c1e]/90">
      <div className="flex items-center gap-2">
        <Link
          href="/"
          className="flex items-center text-[#007AFF] hover:opacity-70 transition-opacity"
        >
          <ChevronLeft className="h-5 w-5" />
          <span className="text-[17px]">Messages</span>
        </Link>
        <div className="ml-2 flex items-center gap-2">
          <GroupAvatar
            name={selectedCharacter.name}
            image={selectedCharacter.image}
            className="h-8 w-8"
          />
          <div>
            <h1 className="text-base font-semibold">
              {selectedCharacter.name}
            </h1>
            <p className="text-xs text-blue-500">iMessage</p>
          </div>
        </div>
      </div>
      <div className="flex gap-4">
        <Button variant="ghost" size="icon" aria-label="Video call">
          <Camera className="h-6 w-6 text-blue-500" />
        </Button>
        <Button variant="ghost" size="icon" aria-label="Audio call">
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-6 w-6 text-blue-500"
          >
            <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 00-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z" />
          </svg>
        </Button>
      </div>
    </div>
  );

  const messageList = (
    <div className="flex flex-col gap-2 px-2 py-4">
      {messages.map((message, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          <MessageBubble
            message={message}
            character={selectedCharacter}
            previousMessage={index > 0 ? messages[index - 1] : undefined}
          />
        </motion.div>
      ))}
      {isTyping && (
        <motion.div
          variants={typingVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          <MessageBubble
            message={{
              id: `typing-${Date.now()}`,
              role: "assistant",
              content: "...",
              createdAt: new Date(),
            }}
            character={selectedCharacter}
            previousMessage={messages[messages.length - 1]}
          />
        </motion.div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );

  const welcomeMessage = (
    <motion.div
      className="flex flex-1 flex-col items-center justify-center p-4 text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
        className="relative h-[280px] w-[280px]"
      >
        <Image
          src={selectedCharacter.image}
          alt={selectedCharacter.name}
          fill
          className="rounded-full object-cover"
          sizes="(max-width: 768px) 280px, 280px"
          priority
        />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      >
        <h2 className="mb-2 text-xl font-semibold">{selectedCharacter.name}</h2>
        <p className="mb-4 text-sm text-gray-500">
          {selectedCharacter.subtitle}
        </p>
        <p className="max-w-sm text-sm text-gray-600 dark:text-gray-400">
          {selectedCharacter.greeting}
        </p>
      </motion.div>
    </motion.div>
  );

  return (
    <main
      className={cn(
        "mx-auto flex h-svh w-full max-w-md flex-col bg-[#ffffff] dark:bg-[#000000] sm:max-w-lg",
        className
      )}
      {...props}
    >
      {header}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence>
          {messages.length ? messageList : welcomeMessage}
        </AnimatePresence>
      </div>
      {messages.length > 0 && (
        <div className="flex justify-center">
          <motion.div
            variants={nextButtonVariants}
            initial="initial"
            whileHover="hover"
            whileTap="tap"
          >
            <Button
              onClick={handleNext}
              variant="ghost"
              className="my-1 flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-medium text-[#007AFF]"
            >
              <span>Next</span>
              <ArrowRightCircle className="h-3.5 w-3.5" />
            </Button>
          </motion.div>
        </div>
      )}
      <form
        onSubmit={handleSubmit}
        className="border-t bg-[#ffffff] p-2 dark:bg-[#000000]"
      >
        <div className="relative flex items-end rounded-full bg-[#f2f2f7] px-3 py-1 dark:bg-[#1c1c1e]">
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="mr-1 h-8 w-8 shrink-0 rounded-full p-0 text-[#007aff]"
          >
            <Paperclip className="h-5 w-5" />
          </Button>
          <AutoResizeTextarea
            onKeyDown={handleKeyDown}
            onChange={(v) => setInput(v)}
            value={input}
            placeholder="iMessage"
            className="mr-8 max-h-32 w-full flex-1 bg-transparent text-[15px] leading-5 focus:outline-none dark:text-white"
          />
          <Button
            type="submit"
            size="icon"
            variant="ghost"
            className="absolute bottom-1 right-1 h-7 w-7 rounded-full p-0 text-[#007aff]"
            disabled={!input.trim()}
          >
            <ArrowUpCircle className="h-7 w-7 fill-current" />
          </Button>
        </div>
      </form>
    </main>
  );
}

function MessageBubble({
  message,
  character,
  previousMessage,
}: {
  message: Message;
  character?: (typeof characters)[0];
  previousMessage?: Message;
}) {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const isGroup = character?.id.includes("-");
  let speakingCharacter = character;
  let messageContent = message.content;

  if (isGroup && message.role === "assistant") {
    const [speaker, ...contentParts] = message.content.split(":");
    if (contentParts.length) {
      const characterId = speaker.toLowerCase();
      speakingCharacter = characters.find(
        (c) =>
          c.id === characterId || c.name.toLowerCase().includes(characterId)
      );
      messageContent = contentParts.join(":").trim();
    }
  }

  const isFirstInSequence =
    !previousMessage ||
    previousMessage.role !== message.role ||
    (isGroup &&
      message.role === "assistant" &&
      previousMessage.content.split(":")[0] !== message.content.split(":")[0]);

  return (
    <motion.div
      className={cn(
        "flex w-full flex-col",
        message.role === "assistant" ? "items-start" : "items-end"
      )}
      variants={messageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      layout
    >
      {message.role === "assistant" && isFirstInSequence && isGroup && (
        <span className="mb-1 ml-12 text-xs text-gray-500">
          {speakingCharacter?.name}
        </span>
      )}
      <div
        className={cn(
          "flex items-end gap-2",
          message.role === "assistant" ? "justify-start" : "justify-end",
          "w-full"
        )}
      >
        {message.role === "assistant" && (
          <>
            {isFirstInSequence && (
              <motion.div
                className="relative h-8 w-8 shrink-0"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                <Image
                  src={speakingCharacter?.image || ""}
                  alt={speakingCharacter?.name || ""}
                  fill
                  className="rounded-full object-cover"
                />
              </motion.div>
            )}
            {!isFirstInSequence && <div className="w-8" />}
          </>
        )}
        <motion.div
          variants={bubbleVariants}
          whileHover="hover"
          whileTap="tap"
          className={cn(
            "relative max-w-[70%] rounded-[18px] px-[14px] py-[7px] text-[15px] leading-5",
            message.role === "assistant"
              ? "rounded-bl-[5px] bg-[#e9e9eb] text-black dark:bg-[#262628] dark:text-white"
              : "rounded-br-[5px] bg-[#007aff] text-white"
          )}
        >
          {message.content === "..." ? typingIndicator : messageContent}
          <span className="mt-1 block text-[10px] opacity-50">
            {formatTime(new Date())}
          </span>
        </motion.div>
      </div>
    </motion.div>
  );
}
