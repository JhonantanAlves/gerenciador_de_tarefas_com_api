import React, { useEffect, useState } from 'react';

function ListaTarefas() {
    const [lista, setLista] = useState([]);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState(null);

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
        </div>
    );
}

export default ListaTarefas;