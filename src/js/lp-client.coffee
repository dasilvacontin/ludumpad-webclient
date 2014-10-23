
Rectangle = require './Rectangle.coffee'
UIAnalog = require './UI/UIAnalog.coffee'
UITouchHandler = require './UI/UITouchHandler.coffee'

dpr = window.devicePixelRatio

renderer = new PIXI.autoDetectRenderer window.innerWidth * dpr, window.innerHeight * dpr

document.getElementById 'controller'
    .appendChild renderer.view
renderer.view.style.width = window.innerWidth
renderer.view.style.height = window.innerHeight

stage = new PIXI.Stage 0x343E47


## Loop
oldDate = +new Date()
animate = ->
    
    requestAnimationFrame animate
    newDate = +new Date()
    dt = Math.min (newDate-oldDate)/16, 1.3
    oldDate = newDate
    
    analog.logic dt
    renderer.render stage


leftHalf = new Rectangle 0, 0, (window.innerWidth * dpr) / 2, (window.innerHeight * dpr)
rightHalf = new Rectangle leftHalf.width, 0, leftHalf.width, leftHalf.height

analog = new UIAnalog leftHalf
stage.addChild analog.sprite

touchHandler = new UITouchHandler()
touchHandler.manageTouchElement analog

## Top-Left Triangle
topButton = new PIXI.Graphics()
topButton.beginFill 0x000000
topButton.moveTo 0, 0
topButton.lineTo 70 * dpr, 0
topButton.lineTo 0, 70 * dpr
topButton.lineTo 0, 0
topButton.endFill()
stage.addChild topButton

## Bot-Right Triangle
botButton = new PIXI.Graphics()
botButton.beginFill 0x000000
botButton.moveTo 70 * dpr, 0
botButton.lineTo 70 * dpr, 70 * dpr
botButton.lineTo 0, 70 * dpr
botButton.lineTo 70 * dpr, 0
botButton.endFill()
botButton.position.x = (window.innerWidth - 70) * dpr 
botButton.position.y = (window.innerHeight - 70) * dpr
stage.addChild botButton

window.onresize = ->
    renderer.resize window.innerWidth * dpr, window.innerHeight * dpr
    leftHalf.width = window.innerWidth * dpr / 2
    rightHalf.height = leftHalf.height = window.innerHeight * dpr
    rightHalf.x = rightHalf.width = leftHalf.width
    analog.updateGraphics()
    analog.setRect leftHalf
    botButton.position.x = (window.innerWidth - 70) * dpr 
    botButton.position.y = (window.innerHeight - 70) * dpr 
animate()