"use client";

import { useState, useTransition } from "react";
import { Plus } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import {
  addVariantAction,
  updateVariantAction,
  setVariantActiveAction,
} from "@/app/actions/admin";

type Variant = {
  id: string;
  label: string;
  stockQty: number;
  active: boolean;
};

const inputClass =
  "rounded-lg border border-melony-gold/25 bg-melony-black px-3 py-2 text-sm text-melony-cream focus:border-melony-gold focus:outline-none";

export function VariantManager({
  productId,
  variants,
}: {
  productId: string;
  variants: Variant[];
}) {
  const [isPending, startTransition] = useTransition();
  const [newLabel, setNewLabel] = useState("");
  const [newStock, setNewStock] = useState("0");

  function handleAdd() {
    if (!newLabel.trim()) return;
    startTransition(async () => {
      await addVariantAction(productId, newLabel, Number(newStock) || 0);
      setNewLabel("");
      setNewStock("0");
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="overflow-x-auto rounded-xl border border-melony-gold/15">
        <Table>
          <TableHeader>
            <TableRow className="border-melony-gold/15 hover:bg-transparent">
              <TableHead className="text-melony-cream/50">Size</TableHead>
              <TableHead className="text-melony-cream/50">Stock</TableHead>
              <TableHead className="text-melony-cream/50">Active</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {variants.map((variant) => (
              <VariantRow key={variant.id} variant={variant} />
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-wrap items-end gap-3">
        <label className="flex flex-col gap-1 text-xs text-melony-cream/50">
          New size label
          <input
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            placeholder="e.g. UK 8–9"
            className={inputClass}
          />
        </label>
        <label className="flex flex-col gap-1 text-xs text-melony-cream/50">
          Stock
          <input
            type="number"
            min="0"
            value={newStock}
            onChange={(e) => setNewStock(e.target.value)}
            className={`${inputClass} w-24`}
          />
        </label>
        <button
          type="button"
          onClick={handleAdd}
          disabled={isPending || !newLabel.trim()}
          className="flex items-center gap-1 rounded-full border border-melony-gold/40 px-4 py-2 text-sm text-melony-gold transition-colors hover:bg-melony-gold hover:text-melony-black disabled:opacity-50"
        >
          <Plus className="h-4 w-4" /> Add size
        </button>
      </div>
    </div>
  );
}

function VariantRow({ variant }: { variant: Variant }) {
  const [isPending, startTransition] = useTransition();
  const [label, setLabel] = useState(variant.label);
  const [stock, setStock] = useState(String(variant.stockQty));

  function saveIfChanged() {
    if (label === variant.label && Number(stock) === variant.stockQty) return;
    startTransition(async () => {
      await updateVariantAction(variant.id, label, Number(stock) || 0);
    });
  }

  return (
    <TableRow
      className={`border-melony-gold/10 ${variant.active ? "" : "opacity-40"}`}
    >
      <TableCell>
        <input
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          onBlur={saveIfChanged}
          className={inputClass}
        />
      </TableCell>
      <TableCell>
        <input
          type="number"
          min="0"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          onBlur={saveIfChanged}
          className={`${inputClass} w-24`}
        />
      </TableCell>
      <TableCell>
        <Switch
          checked={variant.active}
          disabled={isPending}
          onCheckedChange={(checked) => {
            startTransition(async () => {
              await setVariantActiveAction(variant.id, checked);
            });
          }}
        />
      </TableCell>
    </TableRow>
  );
}
