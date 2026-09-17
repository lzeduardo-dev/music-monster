import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { mkdir } from 'fs/promises'

const __dirname = dirname(fileURLToPath(import.meta.url))
const file = join(__dirname, '../../data/db.json')

const adapter = new JSONFile(file)
const defaultData = { users: [], progress: [], earScores: [] }

export const db = new Low(adapter, defaultData)

// Initialize — garante que o diretório existe (volume novo vem vazio;
// sem essa etapa, o steno.write falha com ENOENT ao criar o .tmp).
export async function initDb() {
  await mkdir(dirname(file), { recursive: true })
  await db.read()
  db.data ??= defaultData
  await db.write()
}
