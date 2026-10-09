from fastapi.testclient import TestClient

from src.agent import agentConnect

client = TestClient(agentConnect.app)


def test_chat_returns_the_generated_answer(monkeypatch):
    def generate_answer(question: str, history: list[agentConnect.ChatTurn]) -> str:
        return f"Generated answer for: {question}; history has {len(history)} turns"

    monkeypatch.setattr(agentConnect, "generate_answer", generate_answer)

    response = client.post(
        "/chat",
        json={
            "question": "Which cars are available?",
            "history": [{"role": "user", "content": "Hello"}],
        },
    )

    assert response.status_code == 200
    assert response.json() == {
        "answer": (
            "Generated answer for: Which cars are available?; "
            "history has 1 turns"
        )
    }


def test_chat_rejects_blank_questions():
    response = client.post("/chat", json={"question": "   "})

    assert response.status_code == 422


def test_follow_up_history_is_used_for_retrieval_and_llm_context():
    history = [
        agentConnect.ChatTurn(
            role="user",
            content="Je cherche une BMW Série 3 pour dix jours.",
        ),
        agentConnect.ChatTurn(
            role="assistant",
            content="La BMW n'est pas disponible sur ces dates.",
        ),
    ]

    retrieval_query = agentConnect.build_retrieval_query(
        "Tu peux me lister les autres choix ?", history
    )
    messages = agentConnect.build_messages(
        "Tu peux me lister les autres choix ?",
        history,
        ["Renault Clio, Peugeot 308 et Mercedes Classe C"],
    )

    assert "BMW Série 3" in retrieval_query
    assert "autres choix" in retrieval_query
    assert messages[1] == {
        "role": "user",
        "content": "Je cherche une BMW Série 3 pour dix jours.",
    }
    assert messages[2] == {
        "role": "assistant",
        "content": "La BMW n'est pas disponible sur ces dates.",
    }
    assert messages[3] == {
        "role": "user",
        "content": "Current question: Tu peux me lister les autres choix ?",
    }
    system_prompt = messages[0]["content"]
    assert "Dacia Duster" in system_prompt
    assert "BMW Series 3" in system_prompt
    assert "Mercedes C-Class" in system_prompt
    assert "cannot create, change, or look up reservations" in system_prompt
    assert "Renault Clio" in system_prompt


def test_catalog_and_booking_limits_are_explicit_without_retrieval():
    system_prompt = agentConnect.build_messages(
        "J'aime les berlines, que me proposes-tu ?", [], []
    )[0]["content"]

    assert "Luxury sedans: BMW Series 3 and Mercedes C-Class" in system_prompt
    assert "live availability" in system_prompt
    assert "The chat cannot create, change, or look up reservations" in system_prompt
