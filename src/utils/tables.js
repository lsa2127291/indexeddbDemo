export class MprTable {
  static tableName = 'MprTable'
  static id = 'id'
  static data = 'data'
  static seriesId = 'seriesId'
  constructor (db) {
    this.db = db
    if (!db.objectStoreNames.contains(MprTable.tableName)) {
      const objectStore = this.objectStore = db.createObjectStore(MprTable.tableName, {keyPath: MprTable.id})
      // objectStore.createIndex(MprTable.data, MprTable.data, {unique: false})
      objectStore.createIndex(MprTable.seriesId, MprTable.seriesId, {unique: false})
    }
  }

  set (id, data, seriesId) {
    return new Promise((resolve, reject) => {
      if (!this.objectStoreSet) {
        const transaction = this.db.transaction([MprTable.tableName], 'readwrite')
        this.objectStoreSet = transaction.objectStore(MprTable.tableName)
        transaction.oncomplete = () => {
          this.objectStoreSet = null
        }
        transaction.onabort = (e) => {
          this.objectStoreSet = null
          // 超过容量
          if (e.target.error.code === 22) {
            const transaction = this.db.transaction(this.db.objectStoreNames, 'readwrite')
            transaction.objectStore(MprTable.tableName).clear()
            transaction.objectStore(ImageTable.tableName).openCursor().onsuccess = e => {
              const cursor = e.target.result
            }
          }
        }
      }
      try {
        const request = this.objectStoreSet.put({id, data, seriesId})
        request.onsuccess = () => {
          resolve(data)
        }
        request.onerror = () => {
        }
      } catch (err) {
        const request = this.db.transaction([MprTable.tableName], 'readwrite').objectStore(MprTable.tableName).put({id, data, seriesId})
        request.onsuccess = () => {
          resolve(data)
        }
      }
    })
  }

  get (id) {
    return new Promise((resolve, reject) => {
      if (!this.objectStoreGet) {
        const transaction = this.db.transaction([MprTable.tableName], 'readonly')
        this.objectStoreGet = transaction.objectStore(MprTable.tableName)
        transaction.oncomplete = () => {
          this.objectStoreGet = null
        }
      }
      try {
        const request = this.objectStoreGet.get(id)
        request.onsuccess = () => {
          const result = request.result
          if (result) {
            resolve(result.data)
          } else {
            resolve(null)
          }
        }
      } catch (err) {
        const request = this.db.transaction([MprTable.tableName], 'readonly').objectStore(MprTable.tableName).get(id)
        request.onsuccess = () => {
          const result = request.result
          if (result) {
            resolve(result.data)
          } else {
            resolve(null)
          }
        }
      }
    })
  }

  isDataAllInDb (seriesId, length) {
    return new Promise((resolve, reject) => {
      if (!this.objectStoreAll) {
        this.objectStoreAll = this.db.transaction([MprTable.tableName], 'readonly').objectStore(MprTable.tableName)
      }
      const request = this.objectStoreAll.index(MprTable.seriesId).count(seriesId)
      request.onsuccess = () => {
         resolve(request.result === length)
      }
      request.oncomplete = () => {
        this.objectStoreAll = null
      }
    })
  }

  has (id) {
    return new Promise((resolve, reject) => {
      if (!this.objectStoreHas) {
        const transaction = this.db.transaction([MprTable.tableName], 'readonly')
        this.objectStoreHas = transaction.objectStore(MprTable.tableName)
        transaction.oncomplete = () => {
          this.objectStoreHas = null
        }
      }
      try {
        const request = this.objectStoreHas.getKey(id)
        request.onsuccess = () => {
          resolve(request.result)
        }
      } catch (err) {
        const request = this.db.transaction([MprTable.tableName], 'readonly').getKey(id)
        request.onsuccess = () => {
          resolve(request.result)
        }
      }
    })
  }
}

export class ImageTable {
  static tableName = 'ImageTable'
  static id = 'id'
  static data = 'data'
  static seriesId = 'seriesId'
  constructor (db) {
    this.db = db
    if (!db.objectStoreNames.contains(ImageTable.tableName)) {
      const objectStore = this.objectStore = db.createObjectStore(ImageTable.tableName, {keyPath: ImageTable.id})
      // objectStore.createIndex(MprTable.data, MprTable.data, {unique: false})
      objectStore.createIndex(ImageTable.seriesId, ImageTable.seriesId, {unique: false})
    }
  }

  set (id, data, seriesId) {
    return new Promise((resolve, reject) => {
      if (!this.objectStoreSet) {
        const transaction = this.db.transaction([ImageTable.tableName], 'readwrite')
        this.objectStoreSet = transaction.objectStore(ImageTable.tableName)
        transaction.oncomplete = () => {
          this.objectStoreSet = null
        }
        transaction.onabort = (e) => {
          this.objectStoreSet = null
          if (e.target.error.code === 22) {
            const transaction = this.db.transaction(this.db.objectStoreNames, 'readwrite')
            transaction.objectStore(MprTable.tableName).clear()
            const imageObjectStore = transaction.objectStore(ImageTable.tableName)
            imageObjectStore.count().onsuccess = e => {
              let count = Math.floor(e.target.result / 2)
              if (count < 1) {
                count = 1
              }
              let c = 0
              imageObjectStore.openCursor().onsuccess = e => {
                const cursor = e.target.result
                if (cursor && c < count) {
                  console.log(c, count)
                  c++
                  cursor.delete()
                  cursor.continue()
                }
              }
            }
          }
        }
      }
      try {
        const request = this.objectStoreSet.put({id, data, seriesId})
        request.onsuccess = () => {
          resolve(data)
        }
        request.onerror = () => {
        }
      } catch (err) {
        const request = this.db.transaction([ImageTable.tableName], 'readwrite').objectStore(ImageTable.tableName).put({id, data, seriesId})
        request.onsuccess = () => {
          resolve(data)
        }
      }
    })
  }

  get (id) {
    return new Promise((resolve, reject) => {
      if (!this.objectStoreGet) {
        const transaction = this.db.transaction([ImageTable.tableName], 'readonly')
        this.objectStoreGet = transaction.objectStore(ImageTable.tableName)
        transaction.oncomplete = () => {
          this.objectStoreGet = null
        }
      }
      try {
        const request = this.objectStoreGet.get(id)
        request.onsuccess = () => {
          const result = request.result
          if (result) {
            resolve(result.data)
          } else {
            resolve(null)
          }
        }
      } catch (err) {
        const request = this.db.transaction([ImageTable.tableName], 'readonly').objectStore(ImageTable.tableName).get(id)
        request.onsuccess = () => {
          const result = request.result
          if (result) {
            resolve(result.data)
          } else {
            resolve(null)
          }
        }
      }
    })
  }

  isDataAllInDb (seriesId, length) {
    return new Promise((resolve, reject) => {
      if (!this.objectStoreAll) {
        this.objectStoreAll = this.db.transaction([ImageTable.tableName], 'readonly').objectStore(ImageTable.tableName)
      }
      const request = this.objectStoreAll.index(ImageTable.seriesId).count(seriesId)
      request.onsuccess = () => {
         resolve(request.result === length)
      }
      request.oncomplete = () => {
        this.objectStoreAll = null
      }
    })
  }

  has (id) {
    return new Promise((resolve, reject) => {
      if (!this.objectStoreHas) {
        const transaction = this.db.transaction([ImageTable.tableName], 'readonly')
        this.objectStoreHas = transaction.objectStore(ImageTable.tableName)
        transaction.oncomplete = () => {
          this.objectStoreHas = null
        }
      }
      try {
        const request = this.objectStoreHas.getKey(id)
        request.onsuccess = () => {
          resolve(request.result)
        }
      } catch (err) {
        const request = this.db.transaction([ImageTable.tableName], 'readonly').getKey(id)
        request.onsuccess = () => {
          resolve(request.result)
        }
      }
    })
  }
}
