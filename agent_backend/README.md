# Agent API

Run the FastAPI backend from this directory after configuring the required
backend environment variables:

```sh
uv run uvicorn src.agent.agentConnect:app --reload
```

The chat endpoint accepts a question and returns the assistant's final answer:

```http
POST /chat
Content-Type: application/json

{"question": "Which cars are available?", "history": []}
```

```json
{"answer": "…"}
```

The frontend connects to `http://localhost:8000` by default. Set
`VITE_AGENT_API_URL` in the frontend environment to use a different API origin.