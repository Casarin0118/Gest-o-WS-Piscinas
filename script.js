document.addEventListener('DOMContentLoaded', () => {
    
    let todosClientes = [];
    const form = document.getElementById('formAgendamento');
    const filtroBuscaEl = document.getElementById('filtroBusca');
    const listaClientesEl = document.getElementById('listaClientes');
    const salvarAlteracoesBtn = document.getElementById('salvarAlteracoesBtn');
    const modalEditar = new bootstrap.Modal(document.getElementById('modalEditarCliente'));

    const renderizarClientes = (clientesParaRenderizar) => {
        listaClientesEl.innerHTML = '';
        if (clientesParaRenderizar.length === 0) {
            listaClientesEl.innerHTML = '<p class="text-center text-muted">Nenhum cliente encontrado.</p>';
            return;
        }
        clientesParaRenderizar.forEach(cliente => {
            const clienteHtml = `
                <div class="accordion-item">
                    <h2 class="accordion-header" id="heading-${cliente.id}">
                        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse-${cliente.id}" aria-expanded="false" aria-controls="collapse-${cliente.id}">
                            ${cliente.nome}
                        </button>
                    </h2>
                    <div id="collapse-${cliente.id}" class="accordion-collapse collapse" data-bs-parent="#listaClientes">
                        <div class="accordion-body">
                            <p><strong>Endereço:</strong> ${cliente.endereco}</p>
                            <p><strong>Telefone:</strong> ${cliente.telefone}</p>
                            <hr>
                            <p><strong>Serviço:</strong></p>
                            <p class="client-description">${cliente.descricao}</p>
                            <button class="btn btn-sm btn-secondary mt-2" onclick="abrirModalEdicao(${cliente.id})">
                                Editar
                            </button>
                        </div>
                    </div>
                </div>
            `;
            listaClientesEl.insertAdjacentHTML('beforeend', clienteHtml);
        });
    };

    const buscarClientesDaAPI = async () => {
        try {
            const response = await fetch('https://api-ws-uxxo.onrender.com/clientes/');
            if (!response.ok) throw new Error('Falha ao buscar dados da API');
            const data = await response.json();
            todosClientes = data;
            renderizarClientes(todosClientes);
        } catch (error) {
            console.error('Erro:', error);
            listaClientesEl.innerHTML = '<p class="text-center text-danger">Não foi possível carregar os clientes.</p>';
        }
    };
    
    const adicionarCliente = async (event) => {
        event.preventDefault();
        const novoCliente = {
            nome: document.getElementById('nome').value,
            endereco: document.getElementById('endereco').value,
            telefone: document.getElementById('telefone').value,
            descricao: document.getElementById('descricao').value
        };
        try {
            const response = await fetch('https://api-ws-uxxo.onrender.com/clientes/', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(novoCliente),
            });
            if (!response.ok) throw new Error('Falha ao salvar o cliente.');
            form.reset();
            await buscarClientesDaAPI();
        } catch (error) {
            console.error('Erro:', error);
            alert('Não foi possível agendar o cliente.');
        }
    };
    
    window.abrirModalEdicao = (clienteId) => {
        const clienteParaEditar = todosClientes.find(c => c.id === clienteId);
        if (clienteParaEditar) {
            document.getElementById('clienteIdEditar').value = clienteParaEditar.id;
            document.getElementById('nomeEditar').value = clienteParaEditar.nome;
            document.getElementById('enderecoEditar').value = clienteParaEditar.endereco;
            document.getElementById('telefoneEditar').value = clienteParaEditar.telefone;
            document.getElementById('descricaoEditar').value = clienteParaEditar.descricao;
            modalEditar.show();
        }
    };
    
    const salvarAlteracoes = async () => {
        const clienteId = document.getElementById('clienteIdEditar').value;
        const dadosAtualizados = {
            nome: document.getElementById('nomeEditar').value,
            endereco: document.getElementById('enderecoEditar').value,
            telefone: document.getElementById('telefoneEditar').value,
            descricao: document.getElementById('descricaoEditar').value
        };
        try {
            const response = await fetch(`https://api-ws-uxxo.onrender.com/clientes/${clienteId}`, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(dadosAtualizados)
            });
            if (!response.ok) throw new Error('Falha ao atualizar o cliente.');
            modalEditar.hide();
            await buscarClientesDaAPI();
        } catch (error) {
            console.error('Erro:', error);
            alert('Não foi possível salvar as alterações.');
        }
    };

    const filtrarClientes = () => {
        const termoBusca = filtroBuscaEl.value.toLowerCase();
        const clientesFiltrados = todosClientes.filter(cliente => {
            const textoBusca = `${cliente.nome} ${cliente.endereco}`.toLowerCase();
            return textoBusca.includes(termoBusca);
        });
        renderizarClientes(clientesFiltrados);
    };

    form.addEventListener('submit', adicionarCliente);
    filtroBuscaEl.addEventListener('input', filtrarClientes);
    salvarAlteracoesBtn.addEventListener('click', salvarAlteracoes);

    buscarClientesDaAPI();
});