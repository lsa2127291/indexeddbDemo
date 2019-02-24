<template>
  <div id="app">
    <!-- <Demo/> -->
  </div>
</template>

<script>
// import Demo from './components/Demo'
// import {openDb, add, get, update, getAll, getByIndex, remove } from './utils'
import {MprTable, ImageTable} from './utils/tables'
import {openDb} from './utils/db'
import localforage from 'localforage'
export default {
  name: 'App',
  async created () {
    const [mprTable, imageTable] = await openDb('viewer-refactor', [MprTable, ImageTable])
    // await setTimeout(async () => {
    //   console.time('indexedb')
    //   await mprTable.isDataAllInDb(123, 1000)
    //   console.timeEnd('indexedb')
    // }, 1000)
    console.time('origin indexedb')
    for (let i = 0; i < 1000; i++) {
      await mprTable.set(1 + i, new ArrayBuffer(1000), 123)
    }
    console.timeEnd('origin indexedb')
    console.time('localforage')
    for (let i = 0; i < 1000; i++) {
      const k = `${i + 1}`
      await localforage.setItem(k, new ArrayBuffer(1000))
    }
    console.timeEnd('localforage')
    // console.log(await mprTable.get(1))
    // console.log(await mprTable.has(1))
    // const event = await openDb()
    // for (let i = 0; i < 10; i++) {
    //   await get()
    // }
    // await update()
    // await getAll()
    // await getByIndex()
    // await remove()
    
  }
}
</script>
