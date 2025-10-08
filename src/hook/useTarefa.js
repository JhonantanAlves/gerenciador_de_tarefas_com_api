import {useEffect, useState} from 'react';

export const useTarefas = () => {
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
            await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, {
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

    // Função que salva a edição da tarefa (PUT)
    const handleSalvarEdicao = async (id) => {
        setLoading(true);

        try {
            await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: salvarTarefaEditada,
                    completed: false,
                    userId: 1,
                }),
            });

            // Mapeia a lista e garante que todos os itens sejam retornados
            const novaLista = lista.map(tarefa => {
                if (tarefa.id === id) {
                    // Retorna a tarefa com o título atualizado
                    return {...tarefa, title: salvarTarefaEditada};
                }
                // Retorna a tarefa original se o ID não for o editado
                return tarefa;
            });

            // Atualiza o array de tarefas
            setLista(novaLista);

            // Desativa o modo de edição
            setTarefaEditandoId(null);

        } catch (error) {
            setErro('Falha ao salvar a edição. Tente novamente.');
            console.error('Erro no PUT:', error);
        } finally {
            // Garante que o estado de carregamento seja desativado em qualquer cenário
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

    return {
        lista,
        loading,
        erro,
        novaTarefaTexto,
        setNovaTarefaTexto,
        tarefaEditandoId,
        setTarefaEditandoId,
        salvarTarefaEditada,
        setSalvarTarefaEditada,
        handleAdicionarTarefa,
        handleDeletarTarefa,
        handleSalvarEdicao
    }
}