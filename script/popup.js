var dialogContentBox = document.getElementById("dialogContentBox")
var popup = document.getElementById("popup")

// 打开弹窗
function openPopup() {
    popup.style.display = 'block';
}

// 关闭弹窗
function closePopup() {

    popup.style.display = 'none'
    let c = dialogContentBox.childNodes;
    for (var i = c.length - 1; i >= 0; i--) {
        dialogContentBox.removeChild(c[i]);
    }
}
//点击遮蔽层关闭
document.getElementsByClassName("dialogFace")[0].onclick = () => {
    closePopup()
}