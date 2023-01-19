import formidable from "formidable";
import fs from "fs";

const todoPath = 'images/todos'
const swaggerPath = './swagger.json'

export const saveSwaggerFile = async (text: string): Promise<void> => {
  if (fs.existsSync(swaggerPath)) {
    fs.unlinkSync(swaggerPath);
  }
  fs.writeFileSync(swaggerPath, text);
}

export const saveTodoFile = async (file: formidable.File): Promise<void> => {
  if (!fs.existsSync(todoPath)) {
    fs.mkdirSync(todoPath, { recursive: true })
  }
  const data = fs.readFileSync(file.filepath);
  fs.writeFileSync(`./public/${getTodoFilePathWithName(file)}`, data);
  fs.unlinkSync(file.filepath);
  return
};

export const getTodoFilePathWithName = (file: formidable.File): string => {
  return `${todoPath}/${file.newFilename}${getFileExtention(file.originalFilename || '')}`
}

export const deleteTodoFile = async (filePath: string): Promise<void> => {
  if (filePath !== '') {
    const fullPath = `./public/${filePath}`
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }
  }
}


const getFileExtention = (fileName: string): string => {
  const splitted = fileName.split('.')
  if (splitted.length > 0) {
    return '.' + splitted[splitted.length - 1]
  }
  return ''
}
