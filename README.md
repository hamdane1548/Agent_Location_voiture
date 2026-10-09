
[![Architecture diagram](https://gitdiagram.com/diagram-badge.svg)](https://gitdiagram.com/hamdane1548/agent_location_voiture?utm_source=readme&utm_medium=badge)

[![Architecture diagram of hamdane1548/agent_location_voiture](https://gitdiagram.com/hamdane1548/agent_location_voiture/diagram.png)](https://gitdiagram.com/hamdane1548/agent_location_voiture?utm_source=readme&utm_medium=picture)


Application composée d'une interface de chat React/Vite et d'une API FastAPI.
L'assistant répond aux questions sur la location de voitures en s'appuyant sur
un modèle accessible via OpenRouter et sur Chroma Cloud pour la recherche
documentaire.

## Prérequis

- Node.js et pnpm pour l'interface (`SupportClient`).
- Python 3.13 ou plus récent et [uv](https://docs.astral.sh/uv/) pour l'API
  (`agent_backend`).
- Des identifiants OpenRouter et Chroma Cloud. Le fichier de configuration
  décrit ci-dessous est nécessaire au démarrage de l'API.

## Configuration de l'API

Depuis la racine du dépôt, créez `agent_backend/.env` (ne partagez pas ce
fichier et n'y ajoutez pas de vraies clés dans Git) :

```dotenv
MISTRAL_AI_API_key=your_mistral_api_key
LLM_API_KEY=your_openrouter_api_key
PORT_CHROMA_DB=8000
HOST_CHROMA_DB=localhost
API_KEY=your_chroma_cloud_api_key
TENANT=your_chroma_tenant
DATABASE=your_chroma_database
```

`LLM_API_KEY` est la clé OpenRouter utilisée pour générer les réponses.
`API_KEY`, `TENANT` et `DATABASE` sont les identifiants Chroma Cloud.
`MISTRAL_AI_API_key`, `PORT_CHROMA_DB` et `HOST_CHROMA_DB` sont actuellement
exigés par les paramètres du backend, même si le flux de chat actuel utilise
les embeddings Sentence Transformers en local et Chroma Cloud.

## Installation

À la racine du dépôt, installez les dépendances de l'interface :

```sh
cd SupportClient
pnpm install --frozen-lockfile
```

Dans un autre terminal, installez les dépendances Python :

```sh
cd agent_backend
uv sync --locked
```

## Lancement

Lancez d'abord l'API depuis `agent_backend` :

```sh
uv run uvicorn src.agent.agentConnect:app --reload
```

Elle est disponible par défaut sur `http://localhost:8000`. La documentation
interactive de l'API est disponible sur `http://localhost:8000/docs`.

Lancez ensuite l'interface depuis `SupportClient` :

```sh
pnpm dev
```

Ouvrez l'adresse affichée par Vite (par défaut
`http://localhost:5173`). L'interface envoie les messages à
`http://localhost:8000/chat`.

Pour utiliser une autre adresse d'API, définissez `VITE_AGENT_API_URL` dans
`SupportClient/.env.local`, par exemple :

```dotenv
VITE_AGENT_API_URL=http://localhost:8000
```

Cette valeur est l'origine de l'API, sans suffixe `/chat`. En développement,
le backend autorise les origines `localhost:5173` et `127.0.0.1:5173`.

## Vérifications

Pour construire et vérifier l'interface :

```sh
cd SupportClient
pnpm lint
pnpm build
```

Pour lancer les tests du backend :

```sh
cd agent_backend
uv run pytest
```


<p align="center">
  <img
    width="3716"
    height="11605"
    alt="xxxxxx"
    src="https://github.com/user-attachments/assets/59883312-e51d-4cf0-a780-31982cd38119"
  />
</p>

