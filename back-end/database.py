# database.py - VERSÃO ATUALIZADA E CORRETA

import os
from pathlib import Path
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# 1. Encontra a pasta de dados padrão do usuário (ex: C:\Users\ansilepe\AppData\Roaming)
app_data_path = Path(os.getenv('APPDATA'))

# 2. Define o nome da pasta para a nossa aplicação
app_dir = app_data_path / 'WSPiscinas'

# 3. Cria a pasta se ela não existir
os.makedirs(app_dir, exist_ok=True)

# 4. Define o caminho completo para o arquivo do banco de dados
db_path = app_dir / 'agendamentos.db'

# 5. Define a URL de conexão do SQLAlchemy usando o caminho absoluto
SQLALCHEMY_DATABASE_URL = f"sqlite:///{db_path}"

# O resto do arquivo continua igual
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()