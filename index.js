
/**
 * 画板
 */

 let drawBox = document.querySelector('#drawBox')
 let canvas2 = document.querySelector('#drawingBox')
 let menuItem = document.querySelectorAll('.menu_item')
 let menuDom = document.querySelector('#menu')
 let Pencil = document.querySelector('#pencil')
 let DrawCircle = document.querySelector('#drawCircle')
 let DrawRect = document.querySelector('#drawRect')
 let DrawingColor = document.querySelector('#drawColor')
 let LineWidth = document.querySelector('#lineWidthNumber')
 let eraserDom = document.querySelector('#eraser')
 let toDownLoad = document.querySelector('#downLoad')
 let aDom = document.querySelector('#downloadImg')
 let goBack = document.querySelector('#goBack')
 
 //给canvas设置 width 和 height
 
 const CH = drawBox.offsetHeight - menuDom.offsetHeight
 const CW = drawBox.offsetWidth
 canvas2.setAttribute('width', CW)
 canvas2.setAttribute('height', CH)
 



 class DrawingBoard {
   constructor(beginX = 0, beginY = 0, isDraw = 'false', mode = '', lineWidth = '4', color = 'black', historyData = []) {
     this.isDraw = isDraw
     this.mode = mode
     this.lineWidth = lineWidth
     this.beginX = beginX
     this.beginY = beginY
     this.color = color
     this.historyData = historyData
   }
   setMode (mode) {
     this.mode = mode
   }
   setLineWidth (lineWidth) {
     this.lineWidth = lineWidth
   }
   setColor (color) {
     this.color = color
   }
 }
 
 //初始化画板
 var ctx2 = canvas2.getContext('2d')
 const drawing = new DrawingBoard(0, 0, false, '', 4, 'black', [ctx2.getImageData(0, 0, canvas2.offsetWidth, canvas2.offsetHeight)])
 console.log(drawing.lineWidth);
 LineWidth.value = drawing.lineWidth
 // 鼠标按下事件
 canvas2.onmousedown = function (e) {
   drawing.isDraw = true
   let coordinate = transformCanvasCoordinate(e.pageX, e.pageY)
   drawing.beginX = coordinate.x
   drawing.beginY = coordinate.y
   if (drawing.mode === 'line' || drawing.mode === 'eraser') {
     ctx2.beginPath()
   }
 }
 // 鼠标弹起事件
 canvas2.onmouseup = function () {
   drawing.isDraw = false
   drawing.historyData.push(ctx2.getImageData(0, 0, canvas2.offsetWidth, canvas2.offsetHeight))
   console.log(drawing.historyData);
   if (drawing.mode === 'line' || drawing.mode === 'eraser') {
     ctx2.closePath()
   }
 }
 
 canvas2.onmousemove = function (e) {
   if (drawing.isDraw) {
     let coordinate = transformCanvasCoordinate(e.pageX, e.pageY)
     switch (drawing.mode) {
       case 'line': isDrawLine(coordinate)//画线
         break;
       case 'circle': isDrawCircle(coordinate)//画圆
         break;
       case 'rect': isDrawRect(coordinate) //画矩形
         break;
       case 'eraser': isEraser(coordinate) //橡皮擦
         break;
     }
   }
 }
 
 //将页面按下的坐标转换成canvas中的坐标   鼠标在页面的左边 - canvas元素偏移坐标
 function transformCanvasCoordinate (x, y) {
   let coordinate = {}
   // let bbx = canvas2.getBoundingClientRect()
   coordinate.x = x - canvas2.offsetLeft
   coordinate.y = y - canvas2.offsetTop
   return coordinate
 }
 
 
 //画线
 function isDrawLine (data) {
   //用圆画线
   // ctx2.beginPath()
   // ctx2.arc(data.x, data.y, 4, 0, 2 * Math.PI)
   // ctx2.fill()
   // ctx2.closePath()
   //用线写字
   ctx2.lineTo(data.x, data.y)
   ctx2.lineCap = 'round'
   ctx2.linJoin = 'round'
   ctx2.lineWidth = drawing.lineWidth
   //注意：不能用fillStyle
   ctx2.strokeStyle = drawing.color
   // ctx2.fillStyle = drawing.color
   ctx2.stroke()
   console.log(drawing);
 }
 
 // 画圆
 function isDrawCircle (data) {
   //计算半径
   r = Math.sqrt((data.x - drawing.beginX) * (data.x - drawing.beginX) + (data.y - drawing.beginY) * (data.y - drawing.beginY))
   ctx2.clearRect(0, 0, canvas2.offsetWidth, canvas2.offsetHeight)
   if (drawing.historyData.length > 0) {
     ctx2.putImageData(drawing.historyData[drawing.historyData.length - 1], 0, 0, 0, 0, canvas2.offsetWidth, canvas2.offsetHeight)
   }
   ctx2.beginPath()
   ctx2.arc(drawing.beginX, drawing.beginY, r, 0, 2 * Math.PI)
   ctx2.lineWidth = drawing.lineWidth
   ctx2.strokeStyle = drawing.color
   ctx2.stroke()
   ctx2.closePath()
 }
 
 // 画矩形
 function isDrawRect (data) {
   //计算矩形宽高
   ctx2.clearRect(0, 0, canvas2.offsetWidth, canvas2.offsetHeight)
   if (drawing.historyData.length > 0) {
     ctx2.putImageData(drawing.historyData[drawing.historyData.length - 1], 0, 0, 0, 0, canvas2.offsetWidth, canvas2.offsetHeight)
   }
   ctx2.beginPath()
   ctx2.rect(drawing.beginX, drawing.beginY, data.x - drawing.beginX, data.y - drawing.beginY)
   ctx2.lineWidth = drawing.lineWidth
   ctx2.strokeStyle = drawing.color
   ctx2.stroke()
   ctx2.closePath()
 }
 
 //橡皮擦
 function isEraser (data) {
   // 用圆擦
   // ctx2.beginPath()
   // ctx2.arc(data.x, data.y, 4, 0, 2 * Math.PI)
   // ctx2.fillStyle = '#fff'
   // ctx2.fill()
   // ctx2.closePath()
   // 用线擦
   ctx2.lineTo(data.x, data.y)
   ctx2.strokeStyle = '#fff'
   ctx2.lineWidth = 8
   ctx2.stroke()
 }
 
 
 // 工具栏的点击
 //画线
 Pencil.onclick = function () {
   deActive()
   this.classList.add("active")
   drawing.mode = 'line'
 }
 
 //画圆
 DrawCircle.onclick = function () {
   deActive()
   this.classList.add("active")
   drawing.mode = 'circle'
 }
 //画矩形 
 DrawRect.onclick = function () {
   deActive()
   this.classList.add("active")
   drawing.mode = 'rect'
 }
 //颜色的点击
 DrawingColor.onchange = function (e) {
   drawing.color = DrawingColor.value
 }
 //线段粗细的点击
 LineWidth.onchange = function () {
   console.log(LineWidth.value);
   console.log(drawing);
   drawing.lineWidth = LineWidth.value
 }
 //橡皮擦
 eraserDom.onclick = function () {
   deActive()
   this.classList.add("active")
   drawing.mode = 'eraser'
 }
 //下载按钮点击
 toDownLoad.onclick = function () {
   var imgUrl = canvas2.toDataURL()
   console.log(aDom);
   aDom.href = imgUrl
 }
 
 //撤回按钮点击
 goBack.onclick = function () {
   drawing.historyData.pop()
   const HDlength = drawing.historyData.length
   if (HDlength >= 0) {
     ctx2.putImageData(drawing.historyData[HDlength - 1], 0, 0, 0, 0, canvas2.offsetWidth, canvas2.offsetHeight)
   }
 
 }
 
 // 清除工具栏active类
 function deActive () {
   if (menuItem.length > 0) {
     for (let i = 0; i < menuItem.length; i++) {
       menuItem[i].classList.remove("active")
     }
   }
 }
 
 console.log(drawing);
 
 