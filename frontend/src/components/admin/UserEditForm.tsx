import type { Section } from "./EditModal"

export const userEditSections: Section[] = [
    {
        title: "User Details",
        fields: [
            { label: "Username", name: "userName", type: "text" },
            { label: "Email ID", name: "email", type: "text" },
            { label: "Phone Number", name: "contact", type: "text" },
            { label: "Designation", name: "designation", type: "text" },
        ],
    },
    {
        title: "Access Scope",
        fields: [
            {
                label: "Business Unit",
                name: "businessUnit",
                type: "select",
                options: ["JSW Steel"],
            },
            {
                label: "Location",
                name: "locations",
                type: "multiselect",
                options: ["Vijayanagar", "Salem", "Jaipur"],
            },
            {
                label: "Area",
                name: "areas",
                type: "multiselect",
                options: ["Coke Oven Monitoring", "Blast Furnace"],
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