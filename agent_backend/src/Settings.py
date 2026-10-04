from pydantic_settings import BaseSettings , SettingsConfigDict
from loguru import logger
#Singleton instances
from pathlib import Path
BASE_DIR = Path(__file__).resolve().parent.parent
class Settings(BaseSettings):
    MISTRAL_AI_API_key:  str

    model_config = SettingsConfigDict(env_file=BASE_DIR / ".env",env_file_encoding="utf-8")

    @classmethod
    def load_env(cls)->"Settings":
        try:
            settings = Settings()
            logger.info(f"the env files {settings.MISTRAL_AI_API_key}")
            print("heelo int this file")
        except Exception:
            logger.info("error when load the env files")
            raise
        return settings

settings = Settings()


if __name__ == "__main__":
    settings = Settings()
    print(settings.MISTRAL_AI_API_key)