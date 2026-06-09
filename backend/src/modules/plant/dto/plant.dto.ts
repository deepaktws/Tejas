export class CreatePlantDto {
    name!: string;
    locationId!: string[];
    createdBy?: string | null;
}
export class UpdatePlantDto {
    name!: string;
    locationId!: string[];
    updatedBy?: string | null;
}