import React, { useState } from "react"

export type Field =
    | {
          type: "text"
          label: string
          name: string
          disabled?: boolean
          required?: boolean
      }
    | {
          type: "select"
          label: string
          name: string
          options: string[]
          disabled?: boolean
          required?: boolean
      }
    | {
          type: "multiselect"
          label: string
          name: string
          options: string[]
          disabled?: boolean
          required?: boolean
      }

export type Section = {
    title: string
    layout?: "stack" | "grid-2"
    fields: Field[]
}

type EditModalProps<T extends Record<string, any>> = {
    isOpen: boolean
    title: string
    onClose: () => void
    sections: Section[]
    data: T
    onChange: (name: string, value: any) => void
    onSave: () => void
}

export default function EditModal<T extends Record<string, any>>({
    isOpen,
    title,
    onClose,
    sections,
    data,
    onChange,
    onSave,
}: EditModalProps<T>) {
    const [expanded, setExpanded] = useState<Record<string, boolean>>({})

    if (!isOpen) return null

    const toggleExpand = (name: string) => {
        setExpanded((prev) => ({
            ...prev,
            [name]: !prev[name],
        }))
    }

    const toggleMulti = (name: string, value: string) => {
        const current = Array.isArray(data[name]) ? data[name] : []

        const updated = current.includes(value)
            ? current.filter((v: string) => v !== value)
            : [...current, value]

        onChange(name, updated)
    }

    return (
        <div className="fixed inset-0 z-50">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-[1px]"
                onClick={onClose}
            />

            {/* Modal */}
            <div
                className="
                    absolute
                    right-0
                    top-0
                    flex
                    max-h-[100vh]
                    w-[520px]
                    flex-col
                    overflow-hidden
                    border-4
                    border-white
                    bg-white
                    shadow-[0_10px_40px_rgba(0,0,0,0.18)]
                "
            >
                {/* Header */}
                <div
                    className="
                    flex
                    h-12
                    items-center
                    justify-between
                    bg-gradient-to-b
                    from-[#0C3D8C]
                    to-[#072D69]
                    px-5
                    text-white
                "
                >
                    <h2 className="text-sm font-semibold uppercase tracking-wide">
                        {title}
                    </h2>

                    <button
                        onClick={onClose}
                        className="text-lg opacity-90 hover:opacity-100"
                    >
                        ✕
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-5">
                    <div className="space-y-7">
                        {sections.map((section, idx) => (
                            <div key={idx}>
                                <h3
                                    className="
                                    mb-4
                                    text-[14px]
                                    font-bold
                                    uppercase
                                    tracking-wide
                                    text-gray-900
                                "
                                >
                                    {section.title}
                                </h3>

                                <div
                                    className={
                                        section.layout === "grid-2"
                                            ? "grid grid-cols-2 gap-5"
                                            : "space-y-5"
                                    }
                                >
                                    {section.fields.map((field) => {
                                        const rawValue =
                                            data?.[field.name]

                                        const value =
                                            field.type === "multiselect"
                                                ? Array.isArray(rawValue) && rawValue.length > 0
                                                    ? rawValue
                                                    : field.options
                                                : rawValue

                                        const safeArray =
                                            Array.isArray(value)
                                                ? value
                                                : []

                                        const isDropdownOpen =
                                            expanded[field.name]

                                        return (
                                            <div
                                                key={field.name}
                                                className="relative"
                                            >
                                                <label
                                                    className="
                                                    mb-1.5
                                                    block
                                                    text-[13px]
                                                    font-medium
                                                    text-gray-700
                                                "
                                                >
                                                    {field.label}

                                                    {field.required && (
                                                        <span className="ml-1 text-red-500">
                                                            *
                                                        </span>
                                                    )}
                                                </label>

                                                {/* TEXT */}
                                                {field.type === "text" && (
                                                    <input
                                                        disabled={
                                                            field.disabled
                                                        }
                                                        value={value || ""}
                                                        onChange={(e) =>
                                                            onChange(
                                                                field.name,
                                                                e.target.value
                                                            )
                                                        }
                                                        className="
                                                        h-11
                                                        w-full
                                                        rounded-md
                                                        border
                                                        border-gray-300
                                                        bg-white
                                                        px-3
                                                        text-sm
                                                        text-gray-700
                                                        shadow-sm
                                                        transition
                                                        focus:border-blue-500
                                                        focus:outline-none
                                                        focus:ring-1
                                                        focus:ring-blue-500
                                                        disabled:bg-gray-50
                                                        disabled:text-gray-500
                                                    "
                                                    />
                                                )}

                                                {/* SELECT */}
                                                {field.type ===
                                                    "select" && (
                                                    <select
                                                        disabled={
                                                            field.disabled
                                                        }
                                                        value={value || ""}
                                                        onChange={(e) =>
                                                            onChange(
                                                                field.name,
                                                                e.target.value
                                                            )
                                                        }
                                                        className="
                                                        h-11
                                                        w-full
                                                        rounded-md
                                                        border
                                                        border-gray-300
                                                        bg-white
                                                        px-3
                                                        text-sm
                                                        text-gray-700
                                                        shadow-sm
                                                        focus:border-blue-500
                                                        focus:outline-none
                                                        focus:ring-1
                                                        focus:ring-blue-500
                                                    "
                                                    >
                                                        {field.options.map(
                                                            (opt) => (
                                                                <option
                                                                    key={opt}
                                                                    value={opt}
                                                                >
                                                                    {opt}
                                                                </option>
                                                            )
                                                        )}
                                                    </select>
                                                )}

                                                {/* MULTISELECT */}
                                                {field.type ===
                                                    "multiselect" && (
                                                    <div className="relative">
                                                        <div
                                                            onClick={() =>
                                                                toggleExpand(
                                                                    field.name
                                                                )
                                                            }
                                                            className="
                                                            flex
                                                            h-11
                                                            cursor-pointer
                                                            items-center
                                                            rounded-md
                                                            border
                                                            border-gray-300
                                                            bg-white
                                                            px-3
                                                            text-sm
                                                            shadow-sm
                                                        "
                                                        >
                                                            {safeArray.length ===
                                                            0 ? (
                                                                <span className="text-gray-400">
                                                                    Select
                                                                    options
                                                                </span>
                                                            ) : safeArray.length >
                                                              1 ? (
                                                                <div className="flex items-center gap-2">
                                                                    <span>
                                                                        {
                                                                            safeArray[0]
                                                                        }
                                                                    </span>

                                                                    <span className="rounded bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
                                                                        +
                                                                        {safeArray.length -
                                                                            1}
                                                                    </span>
                                                                </div>
                                                            ) : (
                                                                <span>
                                                                    {
                                                                        safeArray[0]
                                                                    }
                                                                </span>
                                                            )}
                                                        </div>

                                                        {isDropdownOpen && (
                                                            <>
                                                                <div
                                                                    className="fixed inset-0 z-10"
                                                                    onClick={() =>
                                                                        toggleExpand(
                                                                            field.name
                                                                        )
                                                                    }
                                                                />

                                                                <div
                                                                    className="
                                                                    absolute
                                                                    left-0
                                                                    right-0
                                                                    top-full
                                                                    z-20
                                                                    mt-1
                                                                    max-h-64
                                                                    overflow-y-auto
                                                                    rounded-md
                                                                    border
                                                                    border-gray-300
                                                                    bg-white
                                                                    shadow-xl
                                                                "
                                                                >
                                                                    {field.options.map(
                                                                        (
                                                                            opt
                                                                        ) => {
                                                                            const active =
                                                                                safeArray.includes(
                                                                                    opt
                                                                                )

                                                                            return (
                                                                                <div
                                                                                    key={
                                                                                        opt
                                                                                    }
                                                                                    onClick={() =>
                                                                                        toggleMulti(
                                                                                            field.name,
                                                                                            opt
                                                                                        )
                                                                                    }
                                                                                    className={`
                                                                                    px-3
                                                                                    py-2.5
                                                                                    text-sm
                                                                                    cursor-pointer
                                                                                    transition-colors
                                                                                    ${
                                                                                        active
                                                                                            ? "bg-blue-50 text-blue-700 font-medium"
                                                                                            : "hover:bg-gray-100 text-gray-700"
                                                                                    }
                                                                                `}
                                                                                >
                                                                                    {
                                                                                        opt
                                                                                    }
                                                                                </div>
                                                                            )
                                                                        }
                                                                    )}
                                                                </div>
                                                            </>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="bg-white p-4">
                    <div className="flex justify-end">
                        <button
                            onClick={onSave}
                            className="
                            h-10
                            rounded-md
                            bg-[#7BC58C]
                            px-5
                            text-sm
                            font-medium
                            text-white
                            transition
                            hover:bg-[#68b47a]
                        "
                        >
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}