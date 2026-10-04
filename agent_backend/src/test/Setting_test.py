
from src.Settings import Settings
settings = Settings()
def load_env():
    print(settings.MISTRAL_AI_API_key)
if __name__ == "__main__":
    load_env()
