extends Node2D

var animCurtain1
var animCurtain2
var npcText = ["Welcome to the game POC.", "This is a demonstration of a chatbox.", "This is far from finished, so it does not look as polished as it can be"]
# Called when the node enters the scene tree for the first time.
func _ready():
	$player.SPEED = 0
	$"Test NPC".textList = npcText


# Called every frame. 'delta' is the elapsed time since the previous frame.
func _process(delta):
	pass


func _on_start_button_pressed():
	$AnimationPlayer.play("curtainSlideOut")
	$CanvasGroup.get_node("startButton").hide()
	$player.SPEED = 300


func _on_sprite_2d_talk_to(text):
	$CanvasLayer.newTextList(text)
	$player.SPEED = 0



func _on_canvas_layer_text_end():
	$player.SPEED = 300
