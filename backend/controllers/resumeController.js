const multer = require('multer');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const User = require('../models/User');

const storage = multer.memoryStorage();

const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    const allowed = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    cb(null, allowed.includes(file.mimetype));
  }
});

const extractSkills = (text) => {
  const skillKeywords = [
    'javascript', 'python', 'java', 'react', 'node.js', 'mongodb', 'sql', 'html', 'css',
    'express', 'angular', 'vue', 'typescript', 'php', 'c++', 'c#', 'ruby', 'go',
    'docker', 'kubernetes', 'aws', 'azure', 'git', 'linux', 'mysql', 'postgresql'
  ];
  
  const foundSkills = skillKeywords.filter(skill => 
    text.toLowerCase().includes(skill.toLowerCase())
  );
  
  return [...new Set(foundSkills)];
};

const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    let text = '';
    
    if (req.file.mimetype === 'application/pdf') {
      const data = await pdfParse(req.file.buffer);
      text = data.text;
    } else {
      const result = await mammoth.extractRawText({ buffer: req.file.buffer });
      text = result.value;
    }

    const skills = extractSkills(text);
    
    await User.findByIdAndUpdate(req.user.id, {
      resumeUrl: req.file.originalname,
      skills
    });

    res.json({ message: 'Resume uploaded successfully', skills });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { upload, uploadResume };