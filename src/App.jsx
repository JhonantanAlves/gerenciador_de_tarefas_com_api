import React, { useEffect, useState } from 'react';

function ListaTarefas() {
    const [lista, setLista] = useState([]);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState(null);
    const [addTarefa, setAddTarefa] = useState('');

    // A função pode ser chamada de 'handleAdicionar' ou 'adicionarTarefa'
    const adicionarTarefa = () => {
        // 1. Verificamos se o input não está vazio
        if (addTarefa.trim() === '') {
            return; // Sai da função se o input estiver vazio
        }

        // 2. Criamos o objeto da nova tarefa.
        // Usamos Date.now() para gerar um ID temporário único.
        const novaTarefa = {
            id: Date.now(),
            title: addTarefa,
            completed: false, // Tarefa nova não está completa
        };

        // 3. Criamos um novo array com as tarefas antigas + a nova.
        const novaLista = [...lista, novaTarefa];

        // 4. Atualizamos os dois estados.
        setLista(novaLista); // Atualiza o array de tarefas
        setAddTarefa(''); // Limpa o campo de input
    };

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

    if (loading) {
        return <div>Carregando...</div>;
    }

    if (erro) {
        return <div>Erro: {erro}</div>;
    }

    return (
        <div>
            <h1>Lista de Tarefas</h1>
            <ul>
                {lista.map(tarefa => (
                    <li key={tarefa.id}>{tarefa.title}</li>
                ))}
            </ul>
            <h1>Adicionar Nova Tarefa</h1>
            <input
                type="text"
                placeholder="Nova Tarefa"
                value={addTarefa}
                onChange={e => setAddTarefa(e.target.value)}
            />
            <button onClick={adicionarTarefa}>Adicionar</button>
        </div>
    );
}

export default ListaTarefas;