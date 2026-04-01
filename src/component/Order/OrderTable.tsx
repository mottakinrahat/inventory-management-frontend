// /components/orders/OrdersTable.tsx
import { Order } from "@/types/order";

interface Props {
  orders: Order[];
  onUpdate: (id: number, status: Order["status"]) => void;
}

export default function OrdersTable({ orders, onUpdate }: Readonly<Props>) {
  return (
    <table className="w-full">
      <thead>
        <tr>
          <th>Customer</th>
          <th>Status</th>
          <th>Action</th>
        </tr>
      </thead>

      <tbody>
        {orders.map(o => (
          <tr key={o.id}>
            <td>{o.customerName}</td>
            <td>{o.status}</td>
            <td>
              <select
                value={o.status}
                onChange={e =>
                  onUpdate(o.id, e.target.value as Order["status"])
                }
              >
                <option>Pending</option>
                <option>Delivered</option>
              </select>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}