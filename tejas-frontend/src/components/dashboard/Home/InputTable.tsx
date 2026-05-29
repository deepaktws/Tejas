import { useMemo } from 'react'
import { images } from '../../../utils/images'

// ─── Types ────────────────────────────────────────────────────────────────────

export type TableRow = Record<string, unknown>

type DerivedColumn = {
  key: string
  label: string
  children?: { key: string; label: string }[]
}

type InputTableProps = {
  data: TableRow[]
  title?: string
  sendButton?: boolean
  onSend?: (data: TableRow[]) => void
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatHeader = (key: string) =>
  key
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[_-]/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase())

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function collectChildKeys(data: TableRow[], parentKey: string): string[] {
  const childKeys = new Set<string>()
  data.forEach((row) => {
    const value = row[parentKey]
    if (isPlainObject(value)) {
      Object.keys(value).forEach((key) => childKeys.add(key))
    }
  })
  return Array.from(childKeys)
}

function deriveColumns(data: TableRow[]): DerivedColumn[] {
  if (data.length === 0) return []

  const topLevelKeys = new Set<string>()
  data.forEach((row) => Object.keys(row).forEach((key) => topLevelKeys.add(key)))

  return Array.from(topLevelKeys).map((key) => {
    const hasNestedValues = data.some((row) => isPlainObject(row[key]))

    if (hasNestedValues) {
      const childKeys = collectChildKeys(data, key)
      return {
        key,
        label: formatHeader(key),
        children: childKeys.map((childKey) => ({
          key: `${key}.${childKey}`,
          label: formatHeader(childKey),
        })),
      }
    }

    return { key, label: formatHeader(key) }
  })
}

function getLeafColumns(columns: DerivedColumn[]): { key: string }[] {
  return columns.flatMap((col) => (col.children ? col.children : [{ key: col.key }]))
}

function getCellValue(row: TableRow, columnKey: string): string {
  if (columnKey.includes('.')) {
    const [parentKey, childKey] = columnKey.split('.', 2)
    const parentValue = row[parentKey]
    if (isPlainObject(parentValue)) {
      return String(parentValue[childKey] ?? '')
    }
    return ''
  }

  const value = row[columnKey]
  if (isPlainObject(value)) return ''
  return String(value ?? '')
}

// ─── Sub-components ───────────────────────────────────────────────────────────

type ThCellProps = {
  label: string
}

function ThCell({ label }: ThCellProps) {
  return (
    <div className="flex items-center justify-center gap-1">
      {label}
      <button
        type="button"
        aria-label={`Filter ${label}`}
        className="text-text-inverse/70 hover:text-text-inverse"
      >
        <svg
          viewBox="0 0 24 24"
          className="h-3.5 w-3.5 text-brand-primary"
          fill="none"
          stroke="white"
          strokeWidth="2"
        >
          <path d="M4 5h16l-6 7v6l-4 2v-8L4 5z" />
        </svg>
      </button>
    </div>
  )
}

// ─── Component ────────────────────────────────────────────────────────────────

export function InputTable({ title, data, sendButton = false, onSend = () => { } }: InputTableProps) {
  const columns = useMemo(() => deriveColumns(data), [data])
  const leafColumns = useMemo(() => getLeafColumns(columns), [columns])
  const childColumns = columns.flatMap((col) => col.children ?? [])
  const hasSubHeaders = childColumns.length > 0

  const handleSend = () => {
    onSend?.(data)
  }

  return (
    <div className="w-full rounded-md text-zinc-900 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold text-[#303030]">{title}</h1>
        {sendButton && <button className='bg-[#E9F5FF] text-brand-primary px-4 py-2 cursor-pointer flex items-center gap-2' onClick={handleSend}>Send Actuals <img src={images.sendArrowIcon} alt="send arrow" className='w-4 h-4' /></button>}
      </div>
      <div className="overflow-x-auto rounded-lg border border-border-default">
        <table className="w-full text-xs [border-spacing:0]">
          <thead>
            {columns.length > 0 && (
              <>
                <tr className="text-text-inverse">
                  {columns.map((col) => (
                    <th
                      key={col.key}
                      rowSpan={col.children ? 1 : hasSubHeaders ? 2 : 1}
                      colSpan={col.children ? col.children.length : 1}
                      className={`
                      px-3 py-2.5 text-center font-semibold
                      bg-[linear-gradient(180deg,#17479E_0%,#0D2D6B_100%)]
                      border border-white/80 
                      ${col.children ? 'border-b border-white/80' : ''}
                    `}
                    >
                      <ThCell label={col.label} />
                    </th>
                  ))}
                </tr>

                {hasSubHeaders && (
                  <tr className="text-text-inverse">
                    {childColumns.map((child) => (
                      <th
                        key={child.key}
                        className="
                        px-3 py-2.5 text-center font-semibold
                        bg-[linear-gradient(180deg,#17479E_0%,#0D2D6B_100%)]
                        border border-white/80
                      "
                      >
                        <ThCell label={child.label} />
                      </th>
                    ))}
                  </tr>
                )}
              </>
            )}
          </thead>

          <tbody>
            {data.length > 0 ? (
              data.map((row, rowIdx) => (
                <tr key={rowIdx} className="bg-surface-card">
                  {leafColumns.map((col) => (
                    <td
                      key={col.key}
                      className="
                      border border-border-default
                      px-3 py-3 text-center text-text-primary
                    "
                    >
                      {getCellValue(row, col.key)}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={Math.max(leafColumns.length, 1)}
                  className="border border-border-default bg-surface-card px-3 py-6 text-center text-text-secondary"
                >
                  No data found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
