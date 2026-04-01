// /components/orders/OrderFilters.tsx
interface Props {
  status: string;
  date: string;
  setStatus: (v: string) => void;
  setDate: (v: string) => void;
}

export default function OrderFilters({ status, date, setStatus, setDate }: Readonly<Props>) {
  return (
    <div className="bg-white p-4 rounded shadow">
      <select value={status} onChange={e => setStatus(e.target.value)}>
        <option value="">All</option>
        <option value="Pending">Pending</option>
        <option value="Delivered">Delivered</option>
      </select>

      <input type="date" value={date} onChange={e => setDate(e.target.value)} />
    </div>
  );
}