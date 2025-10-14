# main.py - VERSÃO FINAL E CORRETA

from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from fastapi.middleware.cors import CORSMiddleware

import models
from database import SessionLocal, engine
from pydantic import BaseModel

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ClienteBase(BaseModel):
    nome: str
    endereco: str
    telefone: str
    descricao: str

class ClienteCreate(ClienteBase):
    pass

class Cliente(ClienteBase):
    id: int
    class Config:
        from_attributes = True

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/clientes/", response_model=Cliente)
def create_cliente(cliente: ClienteCreate, db: Session = Depends(get_db)):
    # CORREÇÃO APLICADA AQUI
    db_cliente = models.Cliente(**cliente.model_dump())
    db.add(db_cliente)
    db.commit()
    db.refresh(db_cliente)
    return db_cliente

@app.get("/clientes/", response_model=List[Cliente])
def read_clientes(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    clientes = db.query(models.Cliente).offset(skip).limit(limit).all()
    return clientes

@app.put("/clientes/{cliente_id}", response_model=Cliente)
def update_cliente(cliente_id: int, cliente_atualizado: ClienteCreate, db: Session = Depends(get_db)):
    db_cliente = db.query(models.Cliente).filter(models.Cliente.id == cliente_id).first()
    if db_cliente is None:
        raise HTTPException(status_code=404, detail="Cliente não encontrado")
    
    # CORREÇÃO APLICADA AQUI
    update_data = cliente_atualizado.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_cliente, key, value)
        
    db.commit()
    db.refresh(db_cliente)
    return db_cliente

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)