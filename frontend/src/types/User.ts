import { IImageFrontend } from "./Image";
import { IFileFrontend } from "./File";


export interface IUserFrontend {
   username?: string, //only for Google users?
   //googleId?: string, //google ID
   email: string,
   password_hash?: string,
   profile_pic?: string | IImageFrontend, 
   language: string,
   mode: string, //light or dark mode
   files: string | IFileFrontend[]
}