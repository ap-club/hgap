extends Sprite2D

@export var textList = ["This text list has not been changed."]
var playerEntered
var textBox
var talking
signal talkTo(text)

func _ready():
	$Label.hide()
	playerEntered = false
	talking = false

func _physics_process(_delta):
	if Input.is_action_just_pressed("Interact") and talking == false:
		sendSignal()
		talking = true

func _on_area_2d_body_entered(body):
	if body.name == "player":
		playerEntered = true
		$Label.show()

func _on_area_2d_body_exited(body):
	if body.name == "player":
		playerEntered = false
		$Label.hide()

func sendSignal():
	talkTo.emit(textList)


func _on_canvas_layer_text_end():
	talking = false
