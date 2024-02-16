var enterMessageBox = document.getElementById('enterMessageBox');
var titleBox = document.getElementById("titleBox")
var draggableBox = document.getElementById("draggableBox")
var messageContentBox = document.getElementById("messageContentBox")
var sendBox = document.getElementById("sendBox")
var chooseTargetBox = document.getElementById("chooseTargetBox")
var handoffModeBox = document.getElementById("handoffModeBox")
var sendMode

titleBox.clickable = true
titleBox.isUnfold = false
handoffModeBox.mode = true

dragElement(titleBox);

sendBox.onclick = () => {
    if (chooseTargetBox.ID === undefined || handoffModeBox.mode === undefined || messageContentBox.value === "") {
        alert("Check the Form")
        return 0
    }
    data = handoffModeBox.mode ? {
        "action": handoffModeBox.mode ? "send_msg" : "send_private_msg",
        "params": {
            "group_id": chooseTargetBox.ID,
            "message": messageContentBox.value,
        }
    } : {
        "action": handoffModeBox.mode ? "send_msg" : "send_private_msg",
        "params": {
            "user_id": chooseTargetBox.ID,
            "message": messageContentBox.value,
        }
    }
    if (handoffModeBox.mode) {
        createGroupItem({
            "group_id": chooseTargetBox.ID,
            "raw_message": messageContentBox.value,
            "time": (new Date()).valueOf(),
            "user_id": config.user_id
        }, to = chooseTargetBox.ID)
    } else {
        createPrivateItem({
            "raw_message": messageContentBox.value,
            "time": (new Date()).valueOf(),
            "user_id": config.user_id
        }, to = chooseTargetBox.ID)
    }
    socket.send(JSON.stringify(data))
    messageContentBox.value = ""
}

function dragElement(element) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    element.onmousedown = dragMouseDown

    function dragMouseDown(e) {

        e = e || window.event;
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        e.target.clickable = false
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        element.parentElement.style.top = (element.parentElement.offsetTop - pos2) + "px";
        element.parentElement.style.left = (element.parentElement.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

titleBox.onclick = (e) => {
    if (e.target.clickable) {
        if (e.target.isUnfold) {
            enterMessageBox.classList.remove('slide-out');
            draggableBox.classList.remove("unfold")
            messageContentBox.blur()
            messageContentBox.value = ""
            chooseTargetBox.ID = undefined
            chooseTargetBox.innerHTML = "TapToChoose"
        } else {
            enterMessageBox.classList.add('slide-out');
            draggableBox.classList.add('unfold');
            messageContentBox.focus()
        }
        e.target.isUnfold = !e.target.isUnfold
        return 0
    }
    else {
        e.target.clickable = true
    }
}

document.onkeydown = (e) => {
    if (e.ctrlKey && e.key === "m") {
        console.log(e);
        draggableBox.style.top = e.view.pageYOffset + "px"
    }
}

handoffModeBox.onclick = () => {
    handoffModeBox.mode = !handoffModeBox.mode
    handoffModeBox.innerHTML = handoffModeBox.mode ? "[Group]" : "[Private]"
    chooseTargetBox.innerHTML = "TapToChoose"
    chooseTargetBox.ID = undefined
}

chooseTargetBox.onclick = () => {
    openPopup()
    data = {
        "action": handoffModeBox.mode ? "get_group_list" : "get_friend_list"
    }
    response = socket.send(JSON.stringify(data))
}