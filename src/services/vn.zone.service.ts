import { prisma } from "../database/db.config";

class VnZoneService {
  static getAllProvinces = async () => {
    const result = await prisma.province.findMany();
    return result as any;
  };
}

export default VnZoneService;
