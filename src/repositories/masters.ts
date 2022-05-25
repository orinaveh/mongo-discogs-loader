import { MasterModel } from '../models/masters';

export class MastersRepository {
  static async upsert(masters: any[]) {
    return MasterModel.bulkWrite(masters);
  }
}
