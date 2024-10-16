extends CanvasLayer

signal textEnd()

func _ready():
	hide()
	$Label.text = ""


func newText(text):
	show()
	$Label.text = text

func newTextList(textArray):
	show()
	for n in textArray.size():
		newText(textArray[n])
		await $Button.pressed
	hide()
	textEnd.emit()
