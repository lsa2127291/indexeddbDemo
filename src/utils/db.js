export const openDb = (dbName, tables) => {
  return new Promise((resovle, reject) => {
    const request = window.indexedDB.open(dbName || 'idb')
    request.onupgradeneeded = (event) => {
      const db = request.result
      const res = tables.map(table => new table(db))
      request.transaction.oncomplete = () => {
        resovle(res)
      }
    }
    request.onsuccess = (event) => {
      const db = request.result
      resovle(tables.map(table => new table(db)))
    }
  })
}
