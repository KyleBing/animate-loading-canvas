/**
 * 文字动画
 */

class AnimateLoadingCanvas {
    /**
     * @param hMin 颜色 h 最小值
     * @param hMax 颜色 h 最大值
     * @param sizeMin 文字最小值
     * @param sizeMax 文字最大值
     * @param bgColor 背景颜色
     */
    constructor(bgColor, hMin, hMax,  sizeMin = 50, sizeMax = 350) {
        this.isPlaying = true // 默认自动播放

        this.mouseX = 0
        this.mouseY = 0

        this.configFrame = {
            width : 1200,
            height: 300,
            bgColor: bgColor
        }

        this.timeline = 0   // 时间线

        this.configLoading = {
            radiusMax: 400, // 圆圈最大宽度
            gapAdd: 1, // 添加的间隔，当下面 tempIndex 大于这个值时，添加一层
            gapAddDirection: 1, // +1 -1 圆圈加或减
            tempIndex: 0,
            speedRotate: 1.5, // 速度乘比
            layerCount: 4, // 层数
            layerGap: 10, // 每层的间隔
            lineWidth: 10, // 线条宽度
            outRadius: 10, // 圆的半径
            distanceAngle: 220, // deg 圆的显示长度 0 - 360
            duration: 50, // 以 timeLine 为基准

            fontSize: 30,

            characterWidth: 30,
            characterHeight: 30,

            timeInit: new Date().getTime(),
                                                   // 大小
            sizeMin: isNaN(sizeMin) ?50: sizeMin,  // 最小值
            sizeMax: isNaN(sizeMax) ?350: sizeMax, // 最大值

            // 颜色
            colorSaturate: 100,                    // 颜色饱和度 0-100
            colorLight: 60,                        // 颜色亮度 0-100
            hMin: isNaN(hMin) ?0: hMin,          // 色值最小
            hMax: isNaN(hMax) ?360: hMax,          // 色值最大
            minOpacity: 100,                        // 透明度最小 %
            maxOpacity: 100,                       // 透明度最大 %
            opacityGrowth: 60,                      // 透明度增长值

            characterArrayString: '10',
            characterArray: [],

            circleArray: []

        }

        this.init()

        window.onresize = () => {
            this.configFrame.height = innerHeight * 2
            this.configFrame.width = innerWidth * 2
            let loadingLayer = document.getElementById('loadingLayer')
            this.updateFrameAttribute(loadingLayer)
        }
    }

    play(){
        if (this.isPlaying){

        } else {
            this.isPlaying = true
            this.draw()
        }
    }
    stop(){
        this.isPlaying = false
    }

    moveDown(){
        this.configLoading.flowDirection = -1
    }
    moveUp(){
        this.configLoading.flowDirection = 1
    }

    addLayer(){
        this.configLoading.outRadius = this.configLoading.outRadius + this.configLoading.layerGap // 最后的 outRadius
        this.configLoading.tempIndex = 0
        this.configLoading.circleArray.push({
            color: randomColor(
                this.configLoading.hMin,
                this.configLoading.hMax,
                this.configLoading.minOpacity,
                this.configLoading.maxOpacity,
                this.configLoading.colorSaturate,
                this.configLoading.colorLight
            ),
            radius:  this.configLoading.outRadius,
        })
    }
    removeLayer(){
        this.configLoading.circleArray.pop()
        this.configLoading.outRadius = this.configLoading.outRadius - this.configLoading.layerGap // 最后的 outRadius
        if (this.configLoading.outRadius < 0){
            this.configLoading.outRadius = 0
            this.configLoading.gapAddDirection = 1
        }
    }

    speedUp(){
        this.configLoading.speedRotate = this.configLoading.speedRotate - 1
    }
    speedDown(){
        this.configLoading.speedRotate = this.configLoading.speedRotate + 1
    }

    destroy(){
        this.isPlaying = false
        let loadingLayer = document.getElementById('loadingLayer')
        loadingLayer.remove()
        console.log('动画已停止')
    }

    updateFrameAttribute(loadingLayer){
        loadingLayer.setAttribute('id', 'loadingLayer')
        loadingLayer.setAttribute('width', this.configFrame.width)
        loadingLayer.setAttribute('height', this.configFrame.height)
        loadingLayer.style.width = `${this.configFrame.width / 2}px`
        loadingLayer.style.height = `${this.configFrame.height / 2}px`
        loadingLayer.style.zIndex = '-3'
        loadingLayer.style.userSelect = 'none'
        loadingLayer.style.position = 'fixed'
        loadingLayer.style.top = '0'
        loadingLayer.style.left = '0'
    }


    init(){
        this.configFrame.height = innerHeight * 2
        this.configFrame.width = innerWidth * 2

        let loadingLayer = document.createElement("canvas")
        this.updateFrameAttribute(loadingLayer)
        document.documentElement.append(loadingLayer)

        this.configLoading.characterArray = this.configLoading.characterArrayString.split('')
        this.configLoading.layerGap = this.configLoading.outRadius / this.configLoading.layerCount

        for (let i=0;i<this.configLoading.layerCount;i++){
            this.configLoading.circleArray.push({
                color:randomColor(
                    this.configLoading.hMin,
                    this.configLoading.hMax,
                    this.configLoading.minOpacity,
                    this.configLoading.maxOpacity,
                    this.configLoading.colorSaturate,
                    this.configLoading.colorLight
                ),
                radius:  this.configLoading.outRadius - this.configLoading.layerGap * i,
            })
        }

        this.draw()
        document.documentElement.addEventListener('mousemove', event => {
            this.mouseX = event.x
            this.mouseY = event.y
        })
    }


    draw() {
        let canvasLoading = document.getElementById('loadingLayer')
        let contextLoading = canvasLoading.getContext('2d')
        contextLoading.clearRect(0, 0, this.configFrame.width, this.configFrame.height)

        // 背景，没有 bgColor 的时候，背景就是透明的
        if (this.configFrame.bgColor){
            contextLoading.fillStyle = this.configFrame.bgColor
            contextLoading.fillRect(0,0,this.configFrame.width, this.configFrame.height)
        }
        if (this.configLoading.outRadius < this.configLoading.radiusMax){ // 达到最大 radius
            if (this.configLoading.tempIndex > this.configLoading.gapAdd){ // 达到该添加圆圈的点时
                if (this.configLoading.gapAddDirection > 0){
                    this.configLoading.gapAddDirection = 1
                    this.addLayer()
                } else if (this.configLoading.gapAddDirection < 0){
                    this.configLoading.gapAddDirection = -1
                    this.removeLayer()
                }
            }
        } else {
            // this.configLoading.gapAddDirection = -1
            // this.removeLayer()
        }



        this.configLoading.circleArray.forEach((item, index) => {

            let startAngle = this.timeline * this.configLoading.speedRotate % 360 + 75 * index
            let endAngle = (startAngle + this.configLoading.distanceAngle + this.timeline) % 360 + 50 * index

            contextLoading.beginPath()
            contextLoading.arc(
                this.configFrame.width / 2,
                this.configFrame.height / 2,
                item.radius,
                Math.PI * (endAngle / 180),
                Math.PI * (startAngle / 180),
                true)
            // contextLoading.lineTo(
            //     this.configFrame.lineWidth / 2,
            //     this.configFrame.height / 2,
            // )
            // contextLoading.closePath()

            contextLoading.fillStyle = 'white'
            contextLoading.font = "60px Impact"
            contextLoading.fillText(
                this.timeline,
                10,
                this.configFrame.height - 20
            )
            contextLoading.lineWidth = this.configLoading.lineWidth
            contextLoading.strokeStyle = item.color
            contextLoading.fillStyle = item.color
            // contextLoading.fill()
            contextLoading.stroke()

        })


        // 建立自己的时间参考线，消除使用系统时间时导致的切换程序后时间紊乱的情况
        this.timeline = this.timeline + 1
        this.configLoading.tempIndex = this.configLoading.tempIndex + 1
        // if (this.timeline > 3) return

        if (this.isPlaying) {
            window.requestAnimationFrame(() => {
                this.draw()
            })
        }
    }
}

/**
 * 随机返回数组任一元素
 * @param array
 * @returns {*}
 */
function randomChoiceFromArray(array){
    let randomIndex = Number(Math.random() * (array.length - 1)).toFixed(0)
    return array[randomIndex]
}


/**
 * 随机颜色值
 * @returns string
 */
function randomColor(hMin, hMax, opacityMin, opacityMax, saturate, light){
    let randomH = randomInt(hMin, hMax)
    let randomOpacity = randomInt(opacityMin, opacityMax)
    return `hsl(${randomH}, ${saturate}%, ${light}%, ${randomOpacity}%)`
}


/**
 * 输出随机 1 或 -1
 * @returns {number}
 */
function randomDirection(){
    let random = Math.random()
    if (random > 0.5){
        return 1
    } else {
        return -1
    }
}

/**
 * 生成随机整数
 * @param min
 * @param max
 * @returns {number}
 */
function randomInt(min, max){
    return Number((Math.random() * (max - min) + min).toFixed(0))
}

/**
 * 生成随机整数
 * @param min
 * @param max
 * @returns {number}
 */
function randomFloat(min, max){
    return Number(Math.random() * (max - min) + min)
}
