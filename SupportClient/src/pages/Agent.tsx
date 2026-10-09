import { ArrowBigUpDash, Brain } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import type { FormEvent, KeyboardEvent } from 'react';
import { Shdr19 } from '../Components/ui/shdr-19';

type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

const Agent = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const conversationEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    conversationEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const question = input.trim();
    if (!question || isLoading) return;

    setMessages((current) => [...current, { role: 'user', content: question }]);
    setInput("");
    setError("");
    setIsLoading(true);

    try {
      const apiUrl =
        import.meta.env.VITE_AGENT_API_URL ?? "http://localhost:8000";
      const response = await fetch(`${apiUrl}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, history: messages.slice(-20) }),
      });
      const data: { answer?: unknown; detail?: unknown } = await response.json();

      if (!response.ok) {
        throw new Error(
          typeof data.detail === "string"
            ? data.detail
            : `Request failed with status ${response.status}.`,
        );
      }
      const answer = data.answer;
      if (typeof answer !== "string") {
        throw new Error("The agent returned an invalid response.");
      }
      setMessages((current) => [
        ...current,
        { role: "assistant", content: answer },
      ]);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to reach the agent.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      event.currentTarget.form?.requestSubmit();
    }
  };

  const avatarState = isLoading ? "thinking" : "idle";

  return (
    <div className="w-full h-full px-4 sm:px-8 lg:px-15">
      <div className="w-full h-full min-h-[70vh] p-4 sm:p-6 border-x border-b border-gray-300 flex flex-col items-center">
        <div className="center h-28 w-28 shrink-0 transition-transform duration-500">
          <Shdr19
            size={108}
            state={avatarState}
            params={{ speed: 0.7 }}
            colors={{ ink: "#101426" }}
            stateColors={{
              idle: { ink: "#101426" },
              thinking: { ink: "#101426" },
              speaking: { ink: "#101429" },
            }}
            statePresets={{
              idle: { speed: 0.5 },
              thinking: { speed: 0.7 },
              speaking: { speed: 0.9 },
            }}
            stateVolumes={{
              idle: { input: 0, output: 0.2 },
              thinking: { input: 0.1, output: 0.45 },
              speaking: { input: 0.2, output: 0.8 },
            }}
            volumes={{ input: 0, output: 0.6 }}
            wrapperColor="currentColor"
            paused={false}
            pauseOffscreen
            maxDpr={1.5}
            ariaLabel="Assistant status"
          />
        </div>
        {messages.length === 0 ? (
          <div className="my-4 text-center chat-welcome">
            <h1 className="text-2xl primary">
              Hello, how are you doing?
              <br />
              How can I <span className="text-[#D5A86C]">help you</span>?
            </h1>
            <p className="mt-2 text-sm text-gray-500 primary">
              Ask Opoo about cars, rental options, or conditions.
            </p>
          </div>
        ) : (
          <div
            aria-label="Conversation"
            aria-live="polite"
            className="w-full max-w-200 flex-1 min-h-40 max-h-[42vh] overflow-y-auto mt-2 px-1 sm:px-3 flex flex-col gap-4 scroll-smooth"
            role="log"
          >
            {messages.map((message, index) => (
              <div
                className={`chat-message-enter flex flex-col gap-1 ${
                  message.role === 'assistant' ? 'items-start' : 'items-end'
                }`}
                key={`${message.role}-${index}`}
              >
                <span className="px-1 text-[11px] text-gray-500 primary">
                  {message.role === 'assistant' ? 'Opoo' : 'You'}
                </span>
                <p
                  className={`max-w-[90%] whitespace-pre-wrap break-words rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm sm:max-w-[80%] ${
                    message.role === 'assistant'
                      ? 'rounded-tl-md border border-gray-200 bg-white text-gray-800'
                      : 'rounded-tr-md bg-[#101426] text-white'
                  }`}
                >
                  {message.content}
                </p>
              </div>
            ))}
            {isLoading && (
              <div className="chat-message-enter flex flex-col items-start gap-1">
                <span className="px-1 text-[11px] text-gray-500 primary">Opoo</span>
                <div
                  aria-label="Opoo is thinking"
                  className="flex items-center gap-1 rounded-2xl rounded-tl-md border border-gray-200 bg-white px-4 py-3 shadow-sm"
                  role="status"
                >
                  <span className="typing-dot" />
                  <span className="typing-dot [animation-delay:150ms]" />
                  <span className="typing-dot [animation-delay:300ms]" />
                </div>
              </div>
            )}
            <div ref={conversationEndRef} />
          </div>
        )}
        {error && (
          <p className="mt-3 w-full max-w-200 text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
        {messages.length === 0 && isLoading && (
          <p className="chat-message-enter text-sm text-gray-500 primary" role="status">
            Opoo is thinking...
          </p>
        )}
        {messages.length === 0 && <div className="flex-1" />}
        {messages.length === 0 && <div ref={conversationEndRef} />}
        <form
          className="w-full max-w-200 shrink-0 mt-4 flex flex-col rounded-xl border border-gray-300/70 bg-white p-2 shadow-lg transition-shadow duration-200 focus-within:shadow-xl focus-within:ring-1 focus-within:ring-gray-300"
          onSubmit={handleSubmit}
        >
          <div className="flex min-h-24 items-start gap-2 p-1">
            <Brain
              aria-hidden="true"
              strokeWidth={1.6}
              size={20}
              className="mt-1 shrink-0 text-gray-400"
            />
            <label className="sr-only" htmlFor="chat-question">
              Ask Opoo a question
            </label>
            <textarea
              id="chat-question"
              value={input}
              
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={handleInputKeyDown}
              placeholder="Ask Opoo about car rental..."
              className="w-full min-h-24 resize-none bg-transparent py-1 text-sm leading-relaxed text-[#101426] outline-none placeholder:text-gray-400"
              disabled={isLoading}
            />
          </div>
          <div className="flex items-center justify-between border-t border-gray-100 pt-2">
            <span className="hidden text-xs text-gray-400 sm:inline">
              Enter to send · Shift + Enter for a new line
            </span>
            <span className="text-xs text-gray-400 sm:hidden">Opoo assistant</span>
            <div className="flex items-center gap-2">
              <div className="center h-8 space-x-1 rounded-sm border border-gray-300/50 px-2">
                <div className="h-2 w-2 rounded-full bg-teal-500" />
                <span className="text-[11px] text-gray-400 primary">
                  openai/gpt-3.5-turbo
                </span>
              </div>
              <button
                aria-label="Send message"
                className="flex h-9 w-9 items-center justify-center rounded-md bg-black transition-colors hover:bg-[#252a3a] disabled:cursor-not-allowed disabled:opacity-40"
                disabled={!input.trim() || isLoading}
                type="submit"
              >
                <ArrowBigUpDash color="white" size={19} strokeWidth={1.5} />
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Agent;