# 原生indexedb能带来什么

### 为什么不用Localforage
1.太简单，把indexdbed封装成了异步版的localstorage，仅支持键值存储，屏蔽了indexeddb的索引功能，限制了对数据库更多的操作。
2.慢，localforage很慢，其一它要判断采用何种存储方式，其二它在事务出错时会对数据库进行重连，其三它对key存储方式要求string，其四它对blob数据的支持会让它判断数据是否为blob，第二点影响最大且并不是必须的有优化空间。

### 原生indexeddb的体验
上手原生indexeddb后，最大感受就是它其实具有相当复杂细致的对数据库的操作，具备后端主流数据库的大部分能力，当然脱离库之后也遇到了很多坑。这里我主要讲我遇到的这些坑，至于基本的使用通过查看api或者使用教程应该能迅速上手。
1.indexeddb的事务假设处于空闲状态，它会在一段时间后自动关闭，这意味着下面这段代码极可能出错：
``` javascript
let obj;
cn.onsuccess=function(e){
  db=e.target.result;
  obj=db.transaction(["MyTable"],"readwrite").objectStore("MyTable");
};
btn.onclick=function(){
  obj.add({});
};
```
btn.onclick触发时很可能已经过了trasanction的存在时间，此时再进行add操作时，就会报事务已结束的异常。
但是，如果每个操作都建立事务，在进行大量连续操作时又会花费很多创建时间，所以我是这么设计的：
``` javascript
  let obj;
  if (!obj) {
    const transaction = db.transaction([MprTable.tableName], 'readwrite')
    obj = transaction.objectStore(MprTable.tableName)
    transaction.oncomplete = () => {
      obj = null
    }
    transaction.onabort = (e) => {
      obj = null
    }
  }
  try {
    const request = obj.put({id, data, seriesId})
    request.onsuccess = () => {
      resolve(data)
    }
    request.onerror = () => {
    }
  } catch (err) {
    const request = db.transaction([MprTable.tableName], 'readwrite').objectStore(MprTable.tableName).put({id, data, seriesId})
    request.onsuccess = () => {
      resolve(data)
    }
  }
```
我会缓存obj，但是在事务结束或事务异常事件回调里我会把obj置为null，一旦obj为null，我才会重新创建事务，这样在连续操作时可以减少事务创建的时间。

2.indexeddb的索引本质上是建立一张键值表。形式如下：

键就是建立的索引，值就是除索引以外的其余内容，primarykey代表整个store的主键。有多个索引就会创建多张这样的键值表，这些表都会建在store
里面形成一张张子表，所以索引对存储空间的占用是比较大的，尤其要注意索引项的内容要简单，因为每一个键都会新开辟空间来存储，复杂的索引将会
导致需要的存储空间剧增。
3.indexeddb容易超过上限时并不会及时利用lru算法删除空间，此时无法继续进行缓存，该错误可以被onabort事件捕获，此时可以人为清除数据或是进行
提醒用户等操作。
### 原生实现的indexeddb和locaforage的结果对比

### demo地址