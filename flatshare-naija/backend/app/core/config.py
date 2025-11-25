from pydantic import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str
    JWT_SECRET: str
    JWT_ALG: str = "HS256"
    REDIS_URL: str

    class Config:
        env_file = ".env"

settings = Settings()
