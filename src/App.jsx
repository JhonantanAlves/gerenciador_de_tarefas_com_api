import React, { useEffect, useState } from 'react';

function ListaTarefas() {
    const [lista, setLista] = useState([]);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState(null);
    const [novaTarefaTexto, setNovaTarefaTexto] = useState(''); // Nome do estado alterado para evitar conflito
    const [tarefaEditandoId, setTarefaEditandoId] = useState(null); // Estado para controlar qual tarefa está sendo editada
    const [salvarTarefaEditada, setSalvarTarefaEditada] = useState(''); // Estado para o texto da tarefa editada


    // Função que lida com a requisição de deletar tarefa usando metodo (DELETE)
    const handleDeletarTarefa = async (id) => {
        setLoading(true);
        try {
             await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`,{
                method: 'DELETE',
             })
            const novaLista = lista.filter(tarefa => tarefa.id !== id);
            setLista(novaLista);
        } catch (error) {
            setErro('Falha ao deletar a tarefa. Tente novamente.');
            console.error('Erro no DELETE:', error);
        } finally {
            setLoading(false);
        }
    }

    // Função que lida com o envio do formulário (POST)
    const handleAdicionarTarefa = async (event) => {
        // ESSENCIAL: Impede o recarregamento padrão da página ao submeter o formulário
        event.preventDefault();

        if (novaTarefaTexto.trim() === '') {
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('https://jsonplaceholder.typicode.com/todos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: novaTarefaTexto,
                    completed: false,
                    userId: 1,
                }),
            });

            const tarefaCriada = await response.json();

            // Usa o retorno da API (com o ID gerado) para atualizar a lista
            setLista([tarefaCriada, ...lista]); // Adicionando no topo da lista
            setNovaTarefaTexto(''); // Limpa o input

        } catch (error) {
            setErro('Falha ao enviar a tarefa. Tente novamente.');
            console.error('Erro no POST:', error);
        } finally {
            setLoading(false);
        }
    };

    // Requisição inicial (GET)
    useEffect(() => {
        fetch('https://jsonplaceholder.typicode.com/todos')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro na requisição.');
                }
                return response.json();
            })
            .then(json => {
                setLista(json);
                setLoading(false);
            })
            .catch(error => {
                setErro(error.message);
                setLoading(false);
            });
    }, []);

    // --- RENDERIZAÇÃO CONDICIONAL ---

    if (loading) {
        return <div>Carregando...</div>;
    }

    if (erro) {
        return <div>Erro: {erro}</div>;
    }

    // --- FORMULÁRIO E LISTA ---
    return (
        <div>
            <h1>Lista de Tarefas</h1>

            {/* O formulário chama a função ao ser submetido */}
            <form onSubmit={handleAdicionarTarefa}>
                <h2>Adicionar Nova Tarefa</h2>
                <input
                    type="text"
                    placeholder="Nova Tarefa"
                    value={novaTarefaTexto}
                    onChange={e => setNovaTarefaTexto(e.target.value)}
                />
                <button type="submit">Adicionar</button>
            </form>

            <ul>
                {/* Mapeia a lista de tarefas, e adiciona uma condição para editar a tarefa */}
                {lista.map(tarefa => (
                    <li key={tarefa.id}>
                        {tarefa.id === tarefaEditandoId ? (
                            <input type="text"
                                   value={salvarTarefaEditada}
                                   placeholder= {tarefa.title}
                                   onChange={e => setSalvarTarefaEditada(e.target.value)}
                             />
                            ) :
                            (<>
                                    {tarefa.title}
                                    <button className='button' onClick={ () => setTarefaEditandoId(tarefa.id) }>
                                        Editar
                                    </button>
                                    <button className='button' onClick={ () => handleDeletarTarefa(tarefa.id) }>
                                        Remover
                                    </button>
                             </>
                            )}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ListaTarefas;