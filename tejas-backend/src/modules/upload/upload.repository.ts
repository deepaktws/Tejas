import { prisma } from "../../lib/prisma";
import { FileType } from "../../constants/types";

export class UploadRepository {
  createUploadRecord = async (filepath: string, uploadType: FileType, sessionId: string) => {
    return prisma.data.create({
      data: {
        filepath,
        upload_type: uploadType,
        session_id: sessionId,
      },
    });
  };

  getBySessionId = async (sessionId: string, uploadType: FileType) => {
    return prisma.data.findFirst({
      where: {
        session_id: sessionId,
        upload_type: uploadType,
        is_deleted: false,
      },
      orderBy: { created_at: "desc" },
    });
  };
}