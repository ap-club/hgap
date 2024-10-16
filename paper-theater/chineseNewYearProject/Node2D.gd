extends Node2D

var textList = ["text 1", "text 2"]
# Called when the node enters the scene tree for the first time.
func _ready():
	$CanvasLayer.newTextList(textList)


# Called every frame. 'delta' is the elapsed time since the previous frame.
func _process(delta):
	pass
