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

找到 ```receiveMessagePage.html``` 并将第二行的 ```undefined``` 改为自己的QQ号

进入 ```index.html``` 或者直接进入 ```receiveMessagePage.html```
点击 ```Handoff``` 按钮编辑消息并使用 ```Send``` 按钮发送
，上方可以选择发送的类型 ```[Group]``` 或者 ```[Private]```
并点击右侧文字进行选择发送的对象