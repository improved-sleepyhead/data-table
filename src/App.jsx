import { DataTable } from "./components/data-table"
import { Header } from "./components/header"

const App = () => {
  return (
    <div className="relative flex min-h-screen w-full flex-col items-center bg-neutral-100">
      <Header />
      <DataTable />
    </div>
  )
}

export default App
