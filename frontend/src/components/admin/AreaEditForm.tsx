import type { Section } from "./EditModal"

export const areaEditSections: Section[] = [
    {
        title: "Area Details",
        layout: "stack",
        fields: [
            {
                label: "Area Name",
                name: "areaName",
                type: "text",
            },
            {
                label: "Location Name",
                name: "locationName",
                type: "text",
            },
        ],
    },
    {
        title: "Date & Time",
        layout: "grid-2",
        fields: [
            {
                label: "Creation Date & Time",
                name: "creationDateTime",
                type: "text",
                disabled: true,
            },
            {
                label: "Last Update",
                name: "lastUpdate",
                type: "text",
                disabled: true,
            },
        ],
    },
]