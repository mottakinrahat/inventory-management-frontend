import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

export default function ProductsPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Products</h2>

      <Card>
        <CardHeader>
          <CardTitle>All Products</CardTitle>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              <TableRow>
                <TableCell>iPhone 13</TableCell>
                <TableCell>Electronics</TableCell>
                <TableCell>$800</TableCell>
                <TableCell>3</TableCell>
                <TableCell className="text-red-500">
                  Low Stock
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}