
dpr = window.devicePixelRatio

renderer = new PIXI.autoDetectRenderer window.innerWidth * dpr, window.innerHeight * dpr

document.getElementById 'controller'
    .appendChild renderer.view
renderer.view.style.width = window.innerWidth
renderer.view.style.height = window.innerHeight

stage = new PIXI.Stage 0x343E47

oldDate = +new Date()
animate = ->
    
    requestAnimationFrame animate
    newDate = +new Date()
    dt = Math.min (newDate-oldDate)/16, 1.3
    oldDate = newDate
    
    analog.logic dt
    renderer.render stage

leftHalf = new PIXI.Rectangle 0, 0, (window.innerWidth * dpr)/2, (window.innerHeight * dpr)
rightHalf = new PIXI.Rectangle leftHalf.width, 0, leftHalf.width, leftHalf.height

Analog = require './Analog.coffee'

analog = new Analog leftHalf

console.log analog.sprite
stage.addChild analog.sprite

topButton = new PIXI.Graphics()
topButton.beginFill 0x000000
topButton.moveTo 0, 0
topButton.lineTo 70 * dpr, 0
topButton.lineTo 0, 70 * dpr
topButton.lineTo 0, 0
topButton.endFill()
stage.addChild topButton

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

processEvent = (e) ->
    e.preventDefault()
    touches = []
    if e.touches
        for touch in e.touches
            touches.push {
                x: touch.screenX * dpr,
                y: touch.screenY * dpr,
                identifier: touch.identifier
            }
    else if e.type != 'mouseup'
        touches.push {
            x: e.x * dpr,
            y: e.y * dpr,
            identifier: -42
        }
    { touches : touches }
        
processTouches = (e) ->
    e = processEvent e
    analog.processTouches e.touches
    
touchStart = (e) ->
    e = processEvent e
    analog.touchStart e.touches

events = [
    'mousemove',
    'touchmove',
    'mouseup',
    'touchend'
]

document.body.addEventListener 'mousedown', touchStart, false
document.body.addEventListener 'touchstart', touchStart, false

for event in events
    document.body.addEventListener event, processTouches, false

window.onresize = ->
    renderer.resize window.innerWidth * dpr, window.innerHeight * dpr
    leftHalf.width = (window.innerWidth * dpr)/2
    leftHalf.height = (window.innerHeight * dpr)
    rightHalf.x = leftHalf.width
    rightHalf.y = leftHalf.height
    analog.updateGraphics()
    analog.resetPosition()
    botButton.position.x = (window.innerWidth - 70) * dpr 
    botButton.position.y = (window.innerHeight - 70) * dpr 
animate()
