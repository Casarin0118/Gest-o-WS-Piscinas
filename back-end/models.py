# models.py

from sqlalchemy import Column, Integer, String, Text
from database import Base

class Cliente(Base):
    __tablename__ = "clientes"  # Nome da tabela no banco de dados

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String, index=True)
    endereco = Column(String)
    telefone = Column(String)
    descricao = Column(Text)