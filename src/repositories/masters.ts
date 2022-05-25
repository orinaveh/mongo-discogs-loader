import { Master } from '../interfaces/masters';
import { MasterModel } from '../models/masters';

export class MastersRepository {
  static async upsert(master: Master) {
    return MasterModel.findOneAndUpdate({ serialId: master.serialId }, master, { upsert: true }).exec();
  }
}
