"use client"

import { useState } from "react"
import useSWR, { useSWRConfig } from "swr"
import { Search, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { adminDelete } from "@/lib/api"

type Kind = "users" | "volunteers" | "requests" | "feedback"

export function AdminTable<T extends { id: number }>({
  kind,
  fetcher,
  columns,
  labelOf,
}: {
  kind: Kind
  fetcher: () => Promise<T[]>
  columns: { header: string; cell: (row: T) => React.ReactNode }[]
  labelOf: (row: T) => string
}) {
  const { data, isLoading, mutate } = useSWR(`admin-${kind}`, fetcher)
  const { mutate: globalMutate } = useSWRConfig()
  const [query, setQuery] = useState("")
  const [target, setTarget] = useState<T | null>(null)
  const [deleting, setDeleting] = useState(false)

  const q = query.trim().toLowerCase()
  const rows = (data ?? []).filter((row) => !q || JSON.stringify(row).toLowerCase().includes(q))

  async function confirmDelete() {
    if (!target) return
    setDeleting(true)
    try {
      await adminDelete(kind, target.id)
      await Promise.all([mutate(), globalMutate("admin-stats")])
      toast.success(`Deleted ${labelOf(target)}`)
      setTarget(null)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed")
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="flex flex-col gap-4 rounded-2xl border bg-card p-4 md:p-5">
      <div className="relative max-w-sm">
        <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
        <Input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={`Search ${kind}…`}
          aria-label={`Search ${kind}`}
          className="h-11 pl-9 text-base md:text-base"
        />
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((c) => (
                <TableHead key={c.header}>{c.header}</TableHead>
              ))}
              <TableHead className="text-right">
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length + 1} className="py-10 text-center text-muted-foreground">
                  Loading…
                </TableCell>
              </TableRow>
            ) : rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length + 1} className="py-10 text-center text-muted-foreground">
                  No {kind} found.
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row) => (
                <TableRow key={row.id}>
                  {columns.map((c) => (
                    <TableCell key={c.header}>{c.cell(row)}</TableCell>
                  ))}
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-destructive"
                      onClick={() => setTarget(row)}
                      aria-label={`Delete ${labelOf(row)}`}
                    >
                      <Trash2 aria-hidden="true" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={target !== null} onOpenChange={(open) => !open && setTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete {target ? labelOf(target) : ""}?</DialogTitle>
            <DialogDescription>This action can&apos;t be undone.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>Keep it</DialogClose>
            <Button variant="destructive" onClick={confirmDelete} disabled={deleting}>
              {deleting ? "Deleting…" : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
