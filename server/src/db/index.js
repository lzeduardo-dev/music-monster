import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const file = join(__dirname, '../../data/db.json')

const adapter = new JSONFile(file)
const defaultData = { users: [], progress: [], earScores: [] }

export const db = new Low(adapter, defaultData)

// Initialize — ensure file exists with default data
export async function initDb() {
  await db.read()
  db.data ??= defaultData
  await db.write()
}
