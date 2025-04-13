export default function InfoPage() {
  return (
    <main className="flex flex-col gap-3 px-4">
      <h2 className="text-center text-h2">Bem-vindo ao aplicativo Flow</h2>
      <p className="border-b-2">
        Após o login, você pode simplesmente Criar, Atualizar e Excluir suas
        tarefas. Você também pode verificar se eles foram concluídos. Tarefas
        importantes terão uma borda vermelha na parte superior.
      </p>
    </main>
  );
}
