import {useTarefas} from "./hook/useTarefa.js";

function ListaTarefas() {

    const {
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
    } = useTarefas();

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
                            // MODO DE EDIÇÃO
                            <>
                                <input
                                    type="text"
                                    value={salvarTarefaEditada}
                                    onChange={e => setSalvarTarefaEditada(e.target.value)}
                                />
                                {/* BOTÕES DE AÇÃO NA EDIÇÃO */}
                                <button
                                    onClick={() => handleSalvarEdicao(tarefa.id)} // Função para salvar a edição
                                >
                                    Salvar
                                </button>
                                <button
                                    onClick={() => setTarefaEditandoId(null)} // Limpa o estado e volta para visualização
                                >
                                    Cancelar
                                </button>
                            </>
                        ) : (
                            <>
                                {tarefa.title}
                                <button onClick={() => {
                                    // Executa as duas funções em sequência
                                    setTarefaEditandoId(tarefa.id);
                                    setSalvarTarefaEditada(tarefa.title);
                                }}>
                                    Editar
                                </button>
                                <button onClick={() => handleDeletarTarefa(tarefa.id)}>
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