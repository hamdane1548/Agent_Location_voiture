from datetime import date
from typing import Literal

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, field_validator


app = FastAPI(title="Opoo Car Rental Agent")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_methods=["POST"],
    allow_headers=["Content-Type"],
)

GARAGE_CATALOG = """\
Known Opoo Car Rental catalog and indicative daily rates:
- Economy: Renault Clio and Dacia Sandero, 25 EUR/day.
- Compact: Volkswagen Golf and Peugeot 308, 40 EUR/day.
- SUV: Dacia Duster and Hyundai Tucson, 60 EUR/day.
- Luxury sedans: BMW Series 3 and Mercedes C-Class, 100 EUR/day.
These are models offered by the garage, not confirmation of live availability.
"""


class ChatTurn(BaseModel):
    role: Literal["user", "assistant"]
    content: str = Field(min_length=1, max_length=4000)


class ChatRequest(BaseModel):
    question: str = Field(min_length=1, max_length=4000)
    history: list[ChatTurn] = Field(default_factory=list, max_length=20)

    @field_validator("question")
    @classmethod
    def question_must_not_be_blank(cls, value: str) -> str:
        question = value.strip()
        if not question:
            raise ValueError("Question must not be blank.")
        return question


class ChatResponse(BaseModel):
    answer: str


def build_retrieval_query(question: str, history: list[ChatTurn]) -> str:
    recent_history = history[-6:]
    if not recent_history:
        return question

    conversation = "\n".join(
        f"{turn.role}: {turn.content}" for turn in recent_history
    )
    return f"Recent conversation:\n{conversation}\nCurrent question: {question}"


def build_messages(
    question: str,
    history: list[ChatTurn],
    retrieved_documents: list[str],
) -> list[dict[str, str]]:
    return [
        {
            "role": "system",
            "content": (
                "You are Opoo, a welcoming car-rental assistant for Opoo Car "
                "Rental. Do not reintroduce yourself on every turn. Use the "
                "conversation history to remember the customer's name, "
                "preferences, dates, and previous requests. Resolve follow-up "
                "references (for example, 'other choices' or 'based on what "
                "I told you') using that history. The catalog below is the "
                "authoritative list of models and indicative prices; retrieved "
                "documents may add details but must not contradict this "
                "catalog. Distinguish models offered by the garage from live "
                "availability: never claim a car is unavailable unless a "
                "reliable availability result explicitly confirms it. "
                "Recommend vehicles that match stated preferences, and list "
                "the matching models rather than asking the customer to repeat "
                "a preference already given. The chat cannot create, change, "
                "or look up reservations. Never say a reservation was made or "
                "invent order details; explain that staff must confirm it. "
                "If dates are ambiguous or already past, ask the customer to "
                "clarify before discussing availability. Today's date is "
                f"{date.today().isoformat()}. Politely decline "
                "requests unrelated to car rental. Reply in the customer's "
                "language.\n\n"
                f"{GARAGE_CATALOG}"
                "\nRetrieved information (supplementary; may be empty or "
                f"irrelevant): {retrieved_documents}"
            ),
        },
        *(
            {"role": turn.role, "content": turn.content}
            for turn in history
        ),
        {
            "role": "user",
            "content": f"Current question: {question}",
        },
    ]


def generate_answer(question: str, history: list[ChatTurn]) -> str:
    from openai import OpenAI

    from src.Embeddings.Embedding import RAG_Embedding
    from src.Settings import settings

    retrieval_query = build_retrieval_query(question, history)
    question_vector = RAG_Embedding.embedding_using_transfromes_model_encoding(
        retrieval_query
    )
    retrieved_documents = RAG_Embedding.check_question(question_vector)

    client = OpenAI(
        api_key=settings.LLM_API_KEY,
        base_url="https://openrouter.ai/api/v1",
    )
    messages = build_messages(question, history, retrieved_documents)
    response = client.chat.completions.create(
        model="openai/gpt-3.5-turbo",
        messages=messages,
        temperature=0.2,
    )

    answer = response.choices[0].message.content
    if not answer:
        raise RuntimeError("The language model returned an empty answer.")
    return answer


@app.post("/chat", response_model=ChatResponse)
def chat(request: ChatRequest) -> ChatResponse:
    return ChatResponse(
        answer=generate_answer(request.question, request.history)
    )
