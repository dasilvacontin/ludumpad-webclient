
###*
# @author David da Silva http://dasilvacont.in @dasilvacontin
###

###*
# An analog ring sprite.
#
# @class AnalogRingSprite
# @extends UIElement
# @constructor
###

UIElement = require './UIElement.coffee'

class AnalogRingSprite extends UIElement
    
    constructor: (@radius, @UIScale = 1) ->
        super @generateTexture()
        @anchor.x = 0.5
        @anchor.y = 0.5
            
    setRadius: (radius) ->
        if @radius != radius
            @radius = radius
            @setTexture @generateTexture()
        
    generateTexture: ->
        
        radius = @radius * @UIScale
        lineWidth = Math.ceil 4 * @UIScale
        
        texture = document.createElement 'canvas'
        texture.width = texture.height = radius * 2 + lineWidth
        ctx = texture.getContext '2d'
        
        ctx.strokeStyle = 'white'
        ctx.lineWidth = lineWidth
        ctx.beginPath()
        ctx.arc texture.width / 2, texture.height / 2, radius, 0, 2 * Math.PI, false
        ctx.stroke()
        
        texture = new PIXI.Texture.fromCanvas texture
        
module.exports = AnalogRingSprite