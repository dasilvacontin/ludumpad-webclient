
###*
# @author David da Silva http://dasilvacont.in @dasilvacontin
###

###*
# An analog stick sprite.
#
# @class AnalogStickSprite
# @extends UIElement
# @constructor
###

UIElement = require './UIElement.coffee'

class AnalogStickSprite extends UIElement
    
    constructor: (@UIScale = 1) ->
        super @generateTexture()
        @anchor.x = 0.5
        @anchor.y = 0.5
        
    generateTexture: ->
        
        ## octagon
        radius = 100 * @UIScale
        lineWidth = 10 * @UIScale
        
        texture = document.createElement 'canvas'
        texture.width = texture.height = (2 * radius) + lineWidth
        ctx = texture.getContext '2d'
       
        numberOfSides = 8
        centerX = texture.width / 2
        centerY = texture.width / 2
        radIncrement = 2 * Math.PI / numberOfSides
        
        ctx.beginPath()
        ctx.moveTo centerX + radius * Math.cos(0), centerY + radius *  Math.sin(0)
        for i in [1..numberOfSides+1] by 1
            pX = centerX + radius * Math.cos i * radIncrement
            pY = centerY + radius * Math.sin i * radIncrement
            ctx.lineTo pX, pY
        ctx.strokeStyle = 'white'
        ctx.lineWidth = lineWidth
        ctx.lineJoin = 'miter'
        ctx.stroke()
        
        ## center circle
        radius = Math.ceil 12 * @UIScale
        ctx.beginPath()
        ctx.arc centerX, centerY, radius, 0, 2 * Math.PI, false
        ctx.fillStyle = 'white'
        ctx.fill()
        
        texture = new PIXI.Texture.fromCanvas texture
        
module.exports = AnalogStickSprite