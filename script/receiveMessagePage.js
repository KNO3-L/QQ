var config = {
    "user_id": 959316785,
    "autoReconnect": true,
    "reconnectInterval": 5000,
}

var socket

function CQCodeParse(text) {
    var text
    CQObjs = []
    CQRe = /\[CQ\:.+?\]/g
    CQTypeRe = /\[CQ\:(.+?)[\,\]]/
    CQAttributeRe = /\,(.*?)\=(.*?)[\,\]]/g
    CQTexts = findAllMatches(text, CQRe)
    CQTexts.map(v => {
        key = ""
        value = ""
        mode = false
        CQObj = {}
        for (i of v) {
            if (i === "[") {
                continue
            }
            else if ([",", "]"].indexOf(i) != -1) {
                CQObj[key] = value
                key = ""
                value = ""
                mode = !mode
            }
            else if ((i === "=" && value === "") || (key === "CQ" && i === ":")) {
                mode = !mode
            }
            else if (mode) {
                value += i
            }
            else {
                key += i
            }
        }

        CQObj.v = v
        CQObjs.push(CQObj)
    })
    CQObjs.map(v => {
        switch (v.CQ) {
            case "image":
                text = text.replace(v.v, `<br><img src="${v.url}" class="messageImg"><br>`)
                break;
            case "face":
                console.log(v.id);
                text = text.replace(v.v, `<img src="../faceImages/${v.id}.gif" class="face">`)
            default:
                break;
        }
    }
    )
    return text
}

function findAllMatches(str, regex, groupIndex) {
    if (!regex.global) {
        throw new Error('The provided regular expression must have the global flag set.');
    }

    const matches = str.match(regex) || [];

    if (groupIndex === undefined) {
        return matches;
    }

    const groupedMatches = [];
    let match;
    regex.lastIndex = 0;
    while ((match = regex.exec(str)) !== null) {
        if (match[groupIndex]) {
            groupedMatches.push(match[groupIndex]);
        }
    }

    return groupedMatches;
}

function timestampToTime(timestamp) {
    timestamp = timestamp ? timestamp : null;
    let date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    let Y = date.getFullYear() + '-';
    let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    let D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
    let h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
    let m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
    let s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
    return Y + M + D + h + m + s;
}

function formatFileSize(sizeInKb) {
    const units = ['KB', 'MB', 'GB'];
    let i = 0;

    while (sizeInKb >= 1024 && i < units.length - 1) {
        sizeInKb /= 1024;
        i++;
    }

    return `${sizeInKb.toFixed(2)} ${units[i]}`;
}

function fileObjParse(file) {
    HTMLText = `<a href="${file.url}" download="${file.name}">${file.name}</a><br>${formatFileSize(file.size / 100)}`
    return HTMLText
}

function createPrivateItem(data, to = null) {
    let { user_id, raw_message, time } = data
    // 创建根元素  
    var root = document.createElement('div');
    root.className = 'private';

    // 创建嵌套元素  
    var privatePhoto = document.createElement('div');
    privatePhoto.className = 'privatePhoto';
    var img = document.createElement('img');
    img.src = `https://q1.qlogo.cn/g?b=qq&nk=${user_id}&s=100`;
    privatePhoto.appendChild(img);

    var privateText = document.createElement('div');
    privateText.className = 'privateText';
    var privateName = document.createElement('div');
    privateName.className = 'privateName';
    var privateMessage = document.createElement('div');
    privateMessage.className = 'privateMessage';
    var privateMessageDate = document.createElement('div');
    privateMessageDate.className = 'privateMessageDate';
    var privateMessageTime = document.createElement('div');
    privateMessageTime.className = 'privateMessageTime';

    // 设置文本内容和属性值  
    privateName.innerHTML = `${to ? "[Send]" : ""}[Private](${data["sender"] != undefined ? data.sender.nickname : data.user_id})${to ? "->" + `[${to}]` : ""}`;
    privateMessage.innerHTML = raw_message ? CQCodeParse(raw_message) : data.file ? fileObjParse(data.file) : () => { throw new Error(JSON.stringify(data)) };
    privateMessageTime.innerHTML = timestampToTime(time * 1000);
    ;

    // 添加子元素和文本内容  
    privateText.appendChild(privateName);
    privateText.appendChild(privateMessage);
    privateMessageDate.appendChild(privateMessageTime);

    root.appendChild(privatePhoto);
    root.appendChild(privateText);
    root.appendChild(privateMessageDate);

    document.getElementById("messageList").appendChild(root);
}

function createGroupItem(data, to = null) {
    let { user_id, group_id, raw_message, time } = data

    // 创建根元素  
    var root = document.createElement('div');
    root.className = 'group';

    // 创建嵌套元素  
    var groupPhoto = document.createElement('div');
    groupPhoto.className = 'groupPhoto';
    var img = document.createElement('img');
    img.src = `https://q1.qlogo.cn/g?b=qq&nk=${user_id}&s=100`;
    groupPhoto.appendChild(img);

    var groupText = document.createElement('div');
    groupText.className = 'groupText';
    var groupName = document.createElement('div');
    groupName.className = 'groupName';
    var groupMessage = document.createElement('div');
    groupMessage.className = 'groupMessage';
    var groupMessageDate = document.createElement('div');
    groupMessageDate.className = 'groupMessageDate';
    var groupMessageTime = document.createElement('div');
    groupMessageTime.className = 'groupMessageTime';

    groupName.innerHTML = `${to ? "[Send]" : ""}[Group](${group_id})-  (${data["sender"] != undefined ? data.sender.nickname : data.user_id})${to ? "->" + `[${to}]` : ""}`;
    groupMessage.innerHTML = raw_message ? CQCodeParse(raw_message) : data.file ? fileObjParse(data.file) : () => { throw new Error(JSON.stringify(data)) };

    groupMessageTime.innerHTML = timestampToTime(time * 1000);

    groupText.appendChild(groupName);
    groupText.appendChild(groupMessage);
    groupMessageDate.appendChild(groupMessageTime);

    root.appendChild(groupPhoto);
    root.appendChild(groupText);
    root.appendChild(groupMessageDate);

    document.getElementById("messageList").appendChild(root);
}

function createSocket() {
    // 创建一个新的WebSocket对象  
    socket = new WebSocket("ws://127.0.0.1:8080");

    // 监听open事件，当连接打开时触发  
    socket.onopen = function (event) {
        console.log("WebSocket连接已打开！");
    };

    // 监听message事件，当收到服务器消息时触发  
    socket.onmessage = function (event) {
        // console.log("从服务器收到消息:", JSON.parse(event.data));
        data = JSON.parse(event.data)
        if (data.post_type === "notice") {
            data.notice_type === "group_upload" ? createGroupItem(data) : data.notice_type === "offline_file" ? createPrivateItem(data) : 0
            return 0
        } else if (data.data instanceof Array) {
            data.data.map((v) => {
                ul = document.createElement("ul")
                ul.innerHTML = v.group_name || v.nickname
                ul.ID = v.group_id || v.user_id
                ul.onclick = (e) => {
                    chooseTargetBox.innerHTML = e.target.outerText
                    chooseTargetBox.ID = e.target.ID
                    closePopup()
                    sendMode = handoffModeBox.mode
                }
                dialogContentBox.appendChild(ul)
            })
            return 0
        }

        switch (data.message_type) {
            case "group":
                createGroupItem(data)
                break;
            case "private":
                createPrivateItem(data)
                break;
            default:
                return 0;
        }

    };

    // 监听close事件，当连接关闭时触发  
    socket.onclose = function () {
        console.log("WebSocket连接已关闭！");

        if (config.autoReconnect) {
            setTimeout(() => {
                createSocket()
            }, config.reconnectInterval);
        }
    };

    // 监听error事件，当发生错误时触发  
    socket.onerror = function (error) {
        console.error("WebSocket错误:", error);
    };
}

createSocket()