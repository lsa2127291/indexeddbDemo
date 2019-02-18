# 原生indexedb能带来什么

### 为什么不用Localforage
1.慢，localforage很慢，其一它要判断采用何种存储方式，其二它在事务出错时会对数据库进行重连，其三它对key存储方式要求string，其四它对blob数据的支持会让它判断数据是否为blob，第二点影响最大且并不是必须的有优化空间。
2.太简单，把indexdbed封装成了异步版的localstorage，仅支持键值存储，屏蔽了indexeddb的索引功能，限制了对数据库更多的操作。

###