import { prisma } from "../../lib/prisma";
import { UploadType } from "../../constants/types";

export class UploadRepository {
  createUploadRecord = async (filepath: string, uploadType: UploadType) => {
    return prisma.data.create({
      data: {
        filepath,
        upload_type: uploadType,
      },
    });
  };
}