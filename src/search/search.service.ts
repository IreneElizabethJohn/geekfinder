import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/Schemas/User.schema';

@Injectable()
export class SearchService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  commonSearch(searchString: string, loggedInUsername: string) {
    const regex = new RegExp(searchString, 'i');
    return this.userModel.find({
      $and: [
        { _id: { $ne: loggedInUsername } },
        { displayName: { $regex: regex } },
      ],
    });
  }
}
