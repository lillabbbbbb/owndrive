import { User } from '../models/User'; // your user type

declare global {
  namespace Express {
    interface Request {
      user?: User; // optional because token might not exist
    }
  }
}