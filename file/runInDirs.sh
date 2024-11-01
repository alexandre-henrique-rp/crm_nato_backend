#!/bin/bash

# Defina as pastas onde deseja executar o comando
directories=(
  "./downloadFile"
  "./downloadSuporte"
  "./uploadFile"
  "./uploadSuporte"
  "./viewSuporte"
)

# Executa `node index` em cada pasta em segundo plano e exibe logs
for dir in "${directories[@]}"; do
  echo "Iniciando node index.js em $dir..."
  
  # Executa o comando em segundo plano
  (cd "$dir" && node index.js &) 
  
  # Verifica se o último comando foi bem-sucedido
  if [ $? -eq 0 ]; then
    echo "Servidor em $dir rodando com sucesso!"
  else
    echo "Falha ao iniciar o servidor em $dir."
  fi
done

# Mensagem final
echo "Todas as instâncias foram iniciadas."
