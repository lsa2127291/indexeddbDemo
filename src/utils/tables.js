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
        console.log(err)
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
  constructor (db) {
    this.db = db
    this.id = 'id'
    this.data = 'imageData'
    this.seriesId = 'seriesId'
    if (!db.objectStoreNames.contains('imagetable')) {
      this.objectStore = db.createObjectStore('imagetable', {keyPath: 'id'})
      this.objectStore.createIndex('imageData', 'imageData', {unique: false})
      this.objectStore.createIndex('seriesId', 'seriesId', {unique: false})
    }
  }
  setImageData (id, data, seriesId) {
    return new Promise((resolve, reject) => {
      const request = this.objectStore.add({id, data, seriesId})
      request.onsuccess = () => {
        resolve(id)
      }
    })
  }

  getImageData (id) {
    return new Promise((resolve, reject) => {
      const request = this.objectStore.get(id)
      request.onsuccess = () => {
        if (request.result) {
          resolve(result.data)
        } else {
          resolve(null)
        }
      }
    })
  }

  isImageDataLoaded (seriesId, length) {
    return new Promise((resolve, reject) => {
      const request = this.objectStore.index('seriesId').getAllKeys(seriesId)
      request.onsuccess = () => {
        resolve(request.result.length === length)
      }
    })
  }

  hasImageData (id) {
    return new Promise((resolve, reject) => {
      const request = this.objectStore.getKey(id)
      request.onsuccess = () => {
        resolve(request.result ? true : false)
      }
    })
  }
}
