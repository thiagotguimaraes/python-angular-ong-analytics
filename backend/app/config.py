from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    POSTGRES_DB: str
    POSTGRES_USER: str
    POSTGRES_PASSWORD: str
    POSTGRES_HOST: str
    POSTGRES_PORT: str

    TIMESCALE_DB: str
    TIMESCALE_USER: str
    TIMESCALE_PASSWORD: str
    TIMESCALE_HOST: str
    TIMESCALE_PORT: str

    class Config:
        env_file = ".env"

settings = Settings()
