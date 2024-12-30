import multer from 'multer'




const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/');  
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, uniqueSuffix + '-' + file.originalname); 
    }
  });
  
  const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 },  // 10MB limit
  });

  export { upload };
