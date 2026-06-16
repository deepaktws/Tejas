import type { Section } from "./EditModal"

export const locationEditSections: Section[] = [
    {
        title: "Location Details",
        layout: "stack",
        fields: [
            {
                label: "Location Name",
                name: "name",
                type: "text",
            },
            {
                label: "Business Unit",
                name: "businessUnit",
                type: "select",
                options: ["JSW Steel"],
            },
            {
                label: "Address",
                name: "address",
                type: "text",
            },
            {
                label: "City",
                name: "city",
                type: "text",
            },
            {
                label: "State",
                name: "state",
                type: "text",
            },
            {
                label: "ZIP Code",
                name: "zipCode",
                type: "text",
            },
            {
                label: "Country",
                name: "country",
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
                name: "createdAt",
                type: "text",
                disabled: true,
            },
            {
                label: "Updation Date & Time",
                name: "updatedAt",
                type: "text",
                disabled: true,
            },
        ],
    },
]