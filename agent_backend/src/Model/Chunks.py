

from pydantic import BaseModel


class ChunksModel(BaseModel):
      chunk: list[float]
      content : str