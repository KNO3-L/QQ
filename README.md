项目结构：
```
.
├── html
│   └── receiveMessagePage.html
├── index.html
├── README.md
├── script
│   ├── draggableBox.js
│   ├── popup.js
│   └── receiveMessagePage.js
└── style
    ├── draggableBox.css
    ├── popup.css
    └── receiveMessagePage.css

```
使用前启用 ```go-cqhttp``` 通讯方式选择 ```02```

找到 ```receiveMessagePage.html``` 并将第二行的 ```user_id``` 值改为自己的QQ号

进入 ```index.html``` 或者直接进入 ```receiveMessagePage.html```
点击 ```Handoff``` 按钮编辑消息并使用 ```Send``` 按钮发送
，上方可以选择发送的类型 ```[Group]``` 或者 ```[Private]```
并点击右侧文字进行选择发送的对象

重新连接设置：在 ```config``` 中修改 ```autoReconnect``` 来选择是否开启重新连接功能（此功能是考虑到部分设备熄屏后websocket断开连接的问题）
同时可在 ```reconnectInterval``` 中修改重新连接的间隔（ms）