export interface UserItem {
    id: string;
    userName: string;
    name: string | null;
    designation: string | null;
    contact: string | null;
    userRoles: string[];
}