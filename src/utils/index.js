let db = null
let readwriteObjectStore = null
let readOnlyObjectStore = null
export const openDb = () => {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open('test')
    request.onupgradeneeded = function (event) {
      db = event.target.result
      const objectStore = db.createObjectStore('table1', {keyPath: 'id', autoIncrement: true})
      objectStore.createIndex('name', 'name', {unique: false})
      objectStore.createIndex('age', 'age', {unique: false})
      readwriteObjectStore = db.transaction(['table1'], 'readwrite').objectStore('table1')
      readOnlyObjectStore = db.transaction(['table1'], 'readonly').objectStore('table1')
      resolve(event)
    }
    request.onsuccess = function (event) {
      db = request.result
      readwriteObjectStore = db.transaction(['table1'], 'readwrite').objectStore('table1')
      readOnlyObjectStore = db.transaction(['table1'], 'readonly').objectStore('table1')
      resolve(event)
    }
  })
}

export const add = () => {
  return new Promise((resolve, reject) => {
    const request = readwriteObjectStore.add({id: 7, name: new ArrayBuffer(1000000), age: '25'})
    request.onsuccess = event => {
      resolve(event)
    }
    request.onerror = event => {
      reject(event)
    }
  })
}

export const update = () => {
  return new Promise((resolve, reject) => {
    const request = readwriteObjectStore.put({id: 1, name: new ArrayBuffer(1000000), age: '26'})
    request.onsuccess = () => {
      console.log('数据更新成功')
      resolve()
    }
  })
}

export const get = () => {
  return new Promise((resolve, reject) => {
    const request = readOnlyObjectStore.get(1)
    request.onsuccess = (event) => {
      console.log(request.result.name, request.result.age)
      resolve()
    }
  })
}

export const remove = () => {
  const request = readwriteObjectStore.delete(1)
  request.onsuccess = () => {
    console.log('数据删除成功')
  }
}

export const getByIndex = () => {
  const request = readOnlyObjectStore.index('name').getAll('lsa')
  request.onsuccess = (event) => {
    const result = event.target.result
    if (result) {
      console.log('result', result)
    } else {
  
    }
  }
}

export const getAll = () => {
  readOnlyObjectStore.openCursor().onsuccess = () => {
    const cursor = event.target.result
    if (cursor) {
      console.log(cursor.key)
      console.log(cursor.value.name)
      console.log(cursor.value.age)
      cursor.continue()
    }
  }
}
