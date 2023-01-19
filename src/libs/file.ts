import formidable from "formidable";
import fs from "fs";

const todoPath = 'images/todos'
const swaggerPath = './swagger.json'

export const saveJsonFile = async <T>(path: string, name: string, obj: T): Promise<void> => {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path)
  }
  fs.writeFileSync(path + '/' + name, JSON.stringify(obj))
}

export const readJsonFile = async <T>(path: string): Promise<T> => {
  if (!fs.existsSync(path)) {
    return [] as T
  }

  const raw = fs.readFileSync(path, {encoding: 'utf-8'})
  return JSON.parse(raw) as T
}

export const saveSwaggerFile = async (text: string): Promise<void> => {
  fs.writeFileSync(swaggerPath, text);
}

export const saveTodoFile = async (file: formidable.File): Promise<void> => {
  if (!fs.existsSync(`./public/${todoPath}`)) {
    fs.mkdirSync(`./public/${todoPath}`, { recursive: true })
  }
  const data = fs.readFileSync(file.filepath);
  fs.writeFileSync(`./public/${getTodoFilePathWithName(file)}`, data);
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
