from src.Settings import Settings

settings = Settings()
def test_settings():
    assert settings.MISTRAL_AI_API_key is not None