import Sprite   from '../base/sprite'
import DataBus  from '../databus'

const screenWidth    = window.innerWidth
const screenHeight   = window.innerHeight

// 玩家相关常量设置
const PLAYER_IMG_SRC = 'images/hero.png'
const PLAYER_WIDTH   = 100
const PLAYER_HEIGHT  = 100

let databus = new DataBus()

export default class Player extends Sprite {
  constructor() {
    super(PLAYER_IMG_SRC, PLAYER_WIDTH, PLAYER_HEIGHT)

    // 玩家默认处于屏幕底部居中位置
    this.x = screenWidth / 2 - this.width / 2
    this.y = screenHeight - this.height - 30
    this.tt_initEvent();

    // 用于在手指移动的时候标识手指是否已经在人物上了
    this.touched = false

    this.bullets = []

  }

  location = 1;

  changelocation(dx) {
    //screenHeight - this.height - 30
    let y = screenHeight - this.height/2-30;
    let lx = screenWidth * 1.7 / 6 ;
    let mx = screenWidth / 2;
    let rx = screenWidth * 4.3 / 6 ;
    //console.log(dx);
    //console.log(this.location);
    if (this.location === 0) {
      if (dx > 0) {
        this.setAirPosAcrossFingerPosZ(mx, y);
        this.location = 1;
      }
    }
    else if (this.location === 1) {
      if (dx > 0) {
        this.setAirPosAcrossFingerPosZ(rx, y);
        this.location = 2;
      }
      if (dx < 0) {
        this.setAirPosAcrossFingerPosZ(lx, y);
        this.location = 0;
      }
    }
    else if (this.location === 2) {
      if (dx < 0) {
        this.setAirPosAcrossFingerPosZ(mx, y);
        this.location = 1;
      }
    }
  }
  /**
   * 玩家响应手指的触摸事件
   * 改变人物的位置
   */
  tt_initEvent() {
    var px;
    var py;
    canvas.addEventListener('touchstart', ((e) => {
      e.preventDefault()

      //alert("touched");
      px = e.touches[0].clientX
      let x = e.touches[0].clientX
      let y = e.touches[0].clientY
      if (this.checkIsFingerOnAir(x, y)) {
        this.touched = true
      }

    }).bind(this))

    canvas.addEventListener('touchmove', ((e) => {
      e.preventDefault()
    }).bind(this))

    canvas.addEventListener('touchend', ((e) => {
      let ax = e.changedTouches[0].clientX;
      let dx = ax - px;
      if (this.touched) {
        this.changelocation(dx);
        this.touched = false;
      }

    }).bind(this))
  }

  /**
   * 当手指触摸屏幕的时候
   * 判断手指是否在飞机上
   * @param {Number} x: 手指的X轴坐标
   * @param {Number} y: 手指的Y轴坐标
   * @return {Boolean}: 用于标识手指是否在飞机上的布尔值
   */
  checkIsFingerOnAir(x, y) {
    const deviation = 30

    return !!(   x >= this.x - deviation
              && y >= this.y - deviation
              && x <= this.x + this.width + deviation
              && y <= this.y + this.height + deviation  )
  }

  /**
   * 根据手指的位置设置飞机的位置
   * 保证手指处于飞机中间
   * 同时限定飞机的活动范围限制在屏幕中
   */
  setAirPosAcrossFingerPosZ(x, y) {
    let disX = x - this.width / 2
    let disY = y - this.height / 2

    if ( disX < 0 )
      disX = 0

    else if ( disX > screenWidth - this.width )
      disX = screenWidth - this.width

    if ( disY <= 0 )
      disY = 0

    else if ( disY > screenHeight - this.height )
      disY = screenHeight - this.height

    this.x = disX
    this.y = disY
  }

 
  
}

