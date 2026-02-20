import multer, {StorageEngine, Multer} from "multer"
import path from 'path'
import fs from 'fs'

//Disk storage
const diskStorage: StorageEngine = multer.diskStorage({
    destination: function (req, file, cb) {
      // What's the actual path here?
      console.log("🔍 Multer saving to:", path.join(__dirname, '../../public/images'))
      console.log("🔍 __dirname is:", __dirname)
      
      const uploadPath = path.join(__dirname, '../../public/images')
      
      // Check if directory exists
      if (!fs.existsSync(uploadPath)) {
        console.log("❌ Directory doesn't exist, creating it...")
        fs.mkdirSync(uploadPath, { recursive: true })
      }
      
      cb(null, uploadPath)
    },
    filename: function (req, file, cb) {
      const name = file.originalname.split('.').slice(0, -1).join('.');
      console.log(name)
      const filename = name + '-' + Date.now() + path.extname(file.originalname)
      console.log("🔍 Multer generating filename:", filename)
      cb(null, filename)
    }
})
export const uploadToDisk: Multer = multer({ storage: diskStorage })

//Memory storage
const memoryStorage: StorageEngine = multer.memoryStorage()
const uploadToMemory: Multer = multer({ storage: memoryStorage })

export default uploadToMemory