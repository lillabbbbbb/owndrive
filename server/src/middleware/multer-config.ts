import multer, {StorageEngine, Multer} from "multer"
import path from 'path'
import fs from 'fs'

const storage: StorageEngine = multer.diskStorage({
    destination: function (req, file, cb) {
      // What's the actual path here?
      console.log("🔍 Multer saving to:", path.join(__dirname, '../public/images'))
      console.log("🔍 __dirname is:", __dirname)
      
      const uploadPath = path.join(__dirname, '../public/images')
      
      // Check if directory exists
      if (!fs.existsSync(uploadPath)) {
        console.log("❌ Directory doesn't exist, creating it...")
        fs.mkdirSync(uploadPath, { recursive: true })
      }
      
      cb(null, uploadPath)
    },
    filename: function (req, file, cb) {
      const filename = file.fieldname + '-' + Date.now() + path.extname(file.originalname)
      console.log("🔍 Multer generating filename:", filename)
      cb(null, filename)
    }
})
  
const upload: Multer = multer({ storage: storage })

export default upload