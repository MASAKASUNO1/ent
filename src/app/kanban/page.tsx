import Header from "../components/Header";
import Kanban from "./Kanban";

export const metadata = {
  title: "Kanban — ent",
  description: "カンバンボードでタスクを管理",
};

export default function KanbanPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      <Header />

      <main className="flex flex-col items-center px-4 pb-16 pt-4">
        <h1 className="mb-8 text-4xl font-extrabold text-white sm:text-5xl">
          <span className="bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent">
            Kanban
          </span>
        </h1>
        <Kanban />
      </main>
    </div>
  );
}
