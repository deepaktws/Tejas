import { prisma } from "../../lib/prisma";
import { UploadType } from "../../constants/types";

export class DownloadRepository {
  getLatestByType = async (uploadType: UploadType) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return prisma.data.findFirst({
      where: {
        upload_type: uploadType,
        is_deleted: false,
        created_at: {
          lt: today,
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });
  };
}