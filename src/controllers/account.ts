import User from 'models/user';
import {TFullInfoInResponse, TFullInfoInRequest} from 'src/@types/account';
import {logger} from 'src/helpers/logger';

const fullInfo = (req: TFullInfoInRequest, res: TFullInfoInResponse) => {
  User.findById(req.userId)
    .then(user => {
      if (!user) {
        res.status(401).json({message: 'user_does_not_exist'});
        return;
      }

      res.status(200).json({
        ok: true,
        account: {
          email: user.email,
          name: user.name
        }
      });
    })
    .catch(error => {
      logger.error(error);
      res.status(500).json({message: error.message});
    });
};

export default {
  fullInfo
};
