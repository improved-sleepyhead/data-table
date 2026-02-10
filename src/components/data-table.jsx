import { cn } from "../lib/utils"
import { rawData } from "./constants/raw-data"
import Table from "./custom-uikit/table"

export const DataTable = () => {
  return (
    <Table.Root data={rawData.slice(0, 5)} className="w-310 p-2">
      <Table.Filters />

      <Table.Content className="min-w-180">
        <Table.Header>
          <Table.Row>
            <Table.Head className="w-18">ID</Table.Head>
            <Table.Head className="w-36">Name</Table.Head>
            <Table.Head sortKey="email" className="w-[320px]">
              Email
            </Table.Head>
            <Table.Head sortKey="balance" className="w-37 text-right">
              Balance
            </Table.Head>
            <Table.Head className="w-36 text-center">Status</Table.Head>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {item => (
            <Table.Row key={item.id}>
              <Table.Cell className="font-medium">{item.id}</Table.Cell>

              <Table.Cell className="font-medium text-gray-900">
                {item.name}
              </Table.Cell>

              <Table.Cell className="text-gray-600">
                <span className="block overflow-hidden text-ellipsis">
                  {item.email}
                </span>
              </Table.Cell>

              <Table.Cell className="text-right font-mono tabular-nums">
                {item.balance}
              </Table.Cell>

              <Table.Cell className="text-center">
                <span
                  className={cn(
                    "inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                    item.isActive
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  )}
                >
                  {item.isActive ? "Active" : "Inactive"}
                </span>
              </Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table.Content>
    </Table.Root>
  )
}
