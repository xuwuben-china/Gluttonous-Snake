Page({

  /**
   * 页面的初始数据
   */
  data: {
    snakeHead: {
      w: 10,
      h: 10,
      x: 0,
      y: 0
    },
    snakeBody: [],
    site: {
      startX: 0,
      startY: 0,
      moveX : 0,
      moveY: 0,
      diffX: 0,
      diffY: 0
    },
    direction:{
      hand: null,
      snake: "right"
    },
    foods: [],
    window: {
      windowWidth: 0,
      windowHeight: 0
    },
    removeBodyBol: true

  },
  canvasStart: function (e) {
    this.setData({
      "site.startX": e.touches[0].x,
      "site.startY": e.touches[0].y
    })
    
  },
  canvasMove: function (e) {
    var moveX = this.data.site.moveX,
        moveY = this.data.site.moveY,
        startX = this.data.site.startX,
        startY = this.data.site.startY;
     this.setData({
      "site.moveX": e.touches[0].x,
      "site.moveY": e.touches[0].y,
      "site.diffX": moveX - startX,
      "site.diffY": moveY - startY
    })
    var diffX = this.data.site.diffX,
       diffY = this.data.site.diffY;
    if (Math.abs(diffX) > Math.abs(diffY) && diffX > 0) {
      this.setData({
        "direction.hand": "right"
      })
    }else if (Math.abs(diffX) > Math.abs(diffY) && diffX < 0) {
      this.setData({
        "direction.hand": "left"
      })
    }else if (Math.abs(diffY) > Math.abs(diffX) && diffY > 0) {
      this.setData({
        "direction.hand": "bottom"
      })
    }else if (Math.abs(diffY) > Math.abs(diffX) && diffY < 0) {
      this.setData({
        "direction.hand": "top"
      })
    }
  },
  canvasEnd: function (e) {
    var directionHand = this.data.direction.hand;
    var directionSnake = this.data.direction.snake;
   
    switch (directionHand) {
      case "left":
        if (directionSnake !== "right") {
          this.setData({
            "direction.snake": directionHand
          })
        }
         break;
      case "right":
        if (directionSnake !== "left") {
          this.setData({
            "direction.snake": directionHand
          })
        }
        break;
      case "top":
        if (directionSnake !== "bottom") {
          this.setData({
            "direction.snake": directionHand
          })
        }
        break;
      case "bottom":
        if (directionSnake !== "top") {
          this.setData({
            "direction.snake": directionHand
          })
        }
        break;
    }
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var snakeHead = this.data.snakeHead;
    var snakeBody = this.data.snakeBody;
    var context = wx.createContext();
    var frameTime = 0;
    //移动函数
    function move() {
      var directionSnake = that.data.direction.snake;
      var windowWight = that.data.window.windowWidth;
      var windowHeight = that.data.window.windowHeight;
      switch (directionSnake) {
        case "left":
          that.setData({
            "snakeHead.x": snakeHead.x - snakeHead.w
          })
          if (snakeHead.x < 0) {
            that.setData({
              "snakeHead.x": windowWight
            })
          }
          break;
        case "right":
          that.setData({
            "snakeHead.x": snakeHead.x + snakeHead.w
          })
          if (snakeHead.x > windowWight) {
            that.setData({
              "snakeHead.x": 0
            })
          }
          break;
        case "top":
          that.setData({
            "snakeHead.y": snakeHead.y - snakeHead.h
          })
          if (snakeHead.y < 0) {
            that.setData({
              "snakeHead.y": windowHeight
            })
          }
          break;
        case "bottom":
          that.setData({
            "snakeHead.y": snakeHead.y + snakeHead.h
          })
          if (snakeHead.y > windowHeight) {
            that.setData({
              "snakeHead.y": 0
            })
          }
          break;
      }
    }
    //随机函数
    function rand(min, max) {
      return parseInt(Math.random() * (max - min) + min);
    }
    //食物的构造函数
    function Food(windowWidth, windowHeight) {
      this.w = 8;
      this.h = 8;
      this.x = rand(0, windowWidth - this.w);
      this.y = rand(0, windowHeight - this.h);
     this.color = "rgb(" + rand(0, 255) + "," + rand(0, 255) + "," + rand(0, 255) + ")";
      this.resetPos = function () {
        this.x = rand(0, windowWidth - 10);
        this.y = rand(0, windowHeight - 10);
        this.color = "rgb(" + rand(0, 255) + "," + rand(0, 255) + "," + rand(0, 255) + ")";
      }
    }
    //碰撞函数
    function collide(obj1, obj2) {

      var l1 = obj1.x;
      var r1 = l1 + obj1.w;
      var t1 = obj1.y;
      var b1 = t1 + obj1.h;

      var l2 = obj2.x;
      var r2 = l2 + obj2.w;
      var t2 = obj2.y;
      var b2 = t2 + obj2.h;

      if (r1 > l2 && l1 < r2 && b1 > t2 && t1 < b2) {
        return true;
      } else {
        return false;
      }
    }
    //蛇动画效果函数
    function animate(){
      var foods = that.data.foods;
      var windowWidth = that.data.window.windowWidth;
      var windowHeight = that.data.window.windowHeight;
      frameTime++;
      if (frameTime%20 === 0){
        var snakeBody = that.data.snakeBody;
        var removeBodyBol = that.data.removeBodyBol;
        snakeBody.push({
          x: snakeHead.x,
          y: snakeHead.y,
          w: snakeHead.w,
          h: snakeHead.h
        })
        move();
        //绘制蛇头
        context.setFillStyle("#ff00ff");
        context.beginPath();
        context.rect(snakeHead.x, snakeHead.y, snakeHead.w, snakeHead.h);
        context.closePath();
        context.fill();

        //绘制身体
        if (snakeBody.length > 6) {
          if (removeBodyBol) {
            that.setData({
              snakeBody: snakeBody.shift()
            })
          } else {
            that.setData({
              removeBodyBol: true
            })
            console.log(removeBodyBol)
          }
        }
        //蛇身位置信息
        that.setData({
          snakeBody: snakeBody
        })
        for (var i = 0; i < snakeBody.length; i++){
          var snakeBodyObj = snakeBody[snakeBody.length - i - 1];
          context.setFillStyle("#583D3D");
          context.beginPath();
          context.rect(snakeBodyObj.x, snakeBodyObj.y, snakeBodyObj.w, snakeBodyObj.h);
          context.closePath();
          context.fill();
        }
        //绘制食物
        for (var i = 0; i < foods.length; i++) {
          var food = foods[i];
          context.setFillStyle(food.color);
          context.beginPath();
          context.rect(food.x, food.y, food.w, food.h);
          context.closePath();
          context.fill();
          //食物跟蛇头碰撞检测
          if (collide(food, snakeHead)) {
            food.resetPos();
            that.setData({
              removeBodyBol: false
            })
            
          }
        }
        wx.drawCanvas({
          canvasId: "snakeCanvas",
          actions: context.getActions()
        });
      }
     
      requestAnimationFrame(animate);
    }
    // 获取窗口宽高
    wx.getSystemInfo({
      success: function (res) {
       var foods = [];
       
        //在页面中随机初始化创建30个食物
        for (var i = 0; i < 30; i++) {
          var foodObj = new Food(res.windowWidth, res.windowHeight);
          foods.push(foodObj);
        }
        that.setData({
          "window.windowWidth": res.windowWidth,
          "window.windowHeight": res.windowHeight,
          "foods": foods
        })
        animate();
      }
    })
  },

  
})