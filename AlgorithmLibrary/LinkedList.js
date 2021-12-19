var LINKED_LIST_START_X = 100;
var LINKED_LIST_START_Y = 300;
var LINKED_LIST_ELEM_WIDTH = 70;
var LINKED_LIST_ELEM_HEIGHT = 30;

var LINKED_LIST_INSERT_X = 250;
var LINKED_LIST_INSERT_Y = 50;

var LINKED_LIST_ELEMS_PER_LINE = 8;
var LINKED_LIST_ELEM_SPACING = 100;
var LINKED_LIST_LINE_SPACING = 100;

var TOP_POS_X = 180;
var TOP_POS_Y = 100;
var TOP_LABEL_X = 130;
var TOP_LABEL_Y =  100;

var TOP_ELEM_WIDTH = 30;
var TOP_ELEM_HEIGHT = 30;

var TAIL_POS_X = 180;
var TAIL_LABEL_X = 130;

var PUSH_LABEL_X = 100;
var PUSH_LABEL_Y = 30;
var PUSH_ELEMENT_X = 200;
var PUSH_ELEMENT_Y = 30;

var SIZE = 32;

function LinkedList(am, w, h)
{
	this.init(am, w, h);
}

LinkedList.prototype = new Algorithm();
LinkedList.prototype.constructor = LinkedList;
LinkedList.superclass = Algorithm.prototype;


LinkedList.prototype.init = function(am, w, h)
{
	LinkedList.superclass.init.call(this, am, w, h);
	this.addControls();
	this.nextIndex = 0;
	this.commands = [];
	this.tail_pos_y = h - LINKED_LIST_ELEM_HEIGHT - 200;
	this.tail_label_y = this.tail_pos_y;
	this.setup();
	this.initialIndex = this.nextIndex;
}


LinkedList.prototype.addControls =  function()
{
    this.controls = [];

    // AddHead
    this.addHeadField = addControlToAlgorithmBar("Text", "");
	this.addHeadField.onkeydown = this.returnSubmit(this.addHeadField,  this.addHeadCallback.bind(this), 6);
	this.addHeadButton = addControlToAlgorithmBar("Button", "AddHead");
	this.addHeadButton.onclick = this.addHeadCallback.bind(this);
	this.controls.push(this.addHeadField);
	this.controls.push(this.addHeadButton);

    // AddTail
	this.addTailField = addControlToAlgorithmBar("Text", "");
	this.addTailField.onkeydown = this.returnSubmit(this.addTailField,  this.addTailCallback.bind(this), 6);
	this.addTailButton = addControlToAlgorithmBar("Button", "AddTail");
	this.addTailButton.onclick = this.addTailCallback.bind(this);
	this.controls.push(this.addTailField);
	this.controls.push(this.addTailButton);

	// AddAfterQ
	this.addAfterQField = addControlToAlgorithmBar("Text", "");
	this.QField = addControlToAlgorithmBar("Text", "");
	this.addAfterQField.onkeydown = this.returnSubmit(this.addAfterQField, this.addAfterQCallback.bind(this), 6);
	// console.log(this.addAfterQCallback())

	this.QField.onkeydown = this.returnSubmit(this.QField, this.QCallback.bind(this), 6);
	// console.log(this.addAfterQCallback())

	this.addAfterQButton = addControlToAlgorithmBar("Button", "AddAfterQ");
	this.addAfterQButton.onclick = this.addAfterQCallback.bind(this);
	console.log(this.addAfterQCallback())
	// this.addAfterQButton.onclick = this.QCallback.bind(this);
	this.controls.push(this.addAfterQField);
	this.controls.push(this.QField);
	this.controls.push(this.addAfterQButton);

    // DeleteHead
	this.deleteHeadButton = addControlToAlgorithmBar("Button", "DeleteHead");
	this.deleteHeadButton.onclick = this.deleteHeadCallback.bind(this);
	this.controls.push(this.deleteHeadButton);

	this.clearButton = addControlToAlgorithmBar("Button", "Clear Linked List");
	this.clearButton.onclick = this.clearCallback.bind(this);
	this.controls.push(this.clearButton);
}

LinkedList.prototype.enableUI = function(event)
{
	for (var i = 0; i < this.controls.length; i++)
	{
		this.controls[i].disabled = false;
	}	
}

LinkedList.prototype.disableUI = function(event)
{
	for (var i = 0; i < this.controls.length; i++)
	{
		this.controls[i].disabled = true;
	}
}


LinkedList.prototype.setup = function()
{
	this.linkedListElemID = new Array(SIZE);
	for (var i = 0; i < SIZE; i++)
	{
		this.linkedListElemID[i]= this.nextIndex++;
	}
	this.headID = this.nextIndex++;
	this.headLabelID = this.nextIndex++;

	this.tailID = this.nextIndex++;
	this.tailLabelID = this.nextIndex++;

	this.arrayData = new Array(SIZE);
	this.top = 0;
	this.leftoverLabelID = this.nextIndex++;

	this.cmd("CreateLabel", this.headLabelID, "Head", TOP_LABEL_X, TOP_LABEL_Y);
	this.cmd("CreateRectangle", this.headID, "", TOP_ELEM_WIDTH, TOP_ELEM_HEIGHT, TOP_POS_X, TOP_POS_Y);
	this.cmd("SetNull", this.headID, 1);

	this.cmd("CreateLabel", this.tailLabelID, "Tail", TAIL_LABEL_X, this.tail_label_y);
	this.cmd("CreateRectangle", this.tailID, "", TOP_ELEM_WIDTH, TOP_ELEM_HEIGHT, TAIL_POS_X, this.tail_pos_y);
	this.cmd("SetNull", this.tailID, 1);

	this.cmd("CreateLabel", this.leftoverLabelID, "", 5, PUSH_LABEL_Y,0);

	this.animationManager.StartNewAnimation(this.commands);
	this.animationManager.skipForward();
	this.animationManager.clearHistory();		
}

LinkedList.prototype.resetLinkedListPositions = function()
{
	for (var i = this.top - 1; i >= 0; i--)
	{
		var nextX = (this.top - 1 - i) % LINKED_LIST_ELEMS_PER_LINE * LINKED_LIST_ELEM_SPACING + LINKED_LIST_START_X;
		var nextY = Math.floor((this.top - 1 - i) / LINKED_LIST_ELEMS_PER_LINE) * LINKED_LIST_LINE_SPACING + LINKED_LIST_START_Y;
		this.cmd("Move", this.linkedListElemID[i], nextX, nextY);				
	}	
}


LinkedList.prototype.reset = function()
{
	this.top = 0;
	this.nextIndex = this.initialIndex;
}


LinkedList.prototype.addHeadCallback = function(event)
{
	if (this.top < SIZE && this.addHeadField.value != "")
	{
		var pushVal = this.addHeadField.value;
		this.addHeadField.value = ""
		this.implementAction(this.addHead.bind(this), pushVal);
	}
}

LinkedList.prototype.addTailCallback = function(event)
{
	if (this.top < SIZE && this.addTailField.value != "")
	{
		var pushVal = this.addTailField.value;
		this.addTailField.value = ""
		this.implementAction(this.addTail.bind(this), pushVal);
	}
}	

LinkedList.prototype.addAfterQCallback = function(event)
{
	if (this.top < SIZE && this.addAFterQField.value != "")
	{
		var pushVal = this.addAfterQField.value;
		this.addAfterQField.value = ""
		this.implementAction(this.addAfterQ.bind(this), pushVal);
	}
}	

LinkedList.prototype.QCallback = function(event)
{
	if (this.top < SIZE && this.QField.value != "")
	{
		var pushVal = this.QField.value;
		this.QField.value = ""
		this.implementAction(this.addAfterQ.bind(this), pushVal);
	}
}	

LinkedList.prototype.deleteHeadCallback = function(event)
{
	if (this.top > 0)
	{
		this.implementAction(this.deleteHead.bind(this), "");
	}
}


LinkedList.prototype.clearCallback = function(event)
{
	this.implementAction(this.clearData.bind(this), "");
}


LinkedList.prototype.addHead = function(elemToPush)
{
	this.commands = new Array();

	this.arrayData[this.top] = elemToPush;

	this.cmd("SetText", this.leftoverLabelID, "");

	this.linkedListElemID[this.top] = this.nextIndex++;

	var labPushID = this.nextIndex++;
	var labPushValID = this.nextIndex++;
	this.cmd("CreateLinkedList",this.linkedListElemID[this.top], "" ,LINKED_LIST_ELEM_WIDTH, LINKED_LIST_ELEM_HEIGHT, 
		LINKED_LIST_INSERT_X, LINKED_LIST_INSERT_Y, 0.25, 0, 1, 1);

	this.cmd("SetNull", this.linkedListElemID[this.top], 1);
	this.cmd("CreateLabel", labPushID, "Adding Value: ", PUSH_LABEL_X, PUSH_LABEL_Y);
	this.cmd("CreateLabel", labPushValID, elemToPush, PUSH_ELEMENT_X, PUSH_ELEMENT_Y);

	this.cmd("Step");

	this.cmd("Move", labPushValID, LINKED_LIST_INSERT_X, LINKED_LIST_INSERT_Y);

	this.cmd("Step");
	this.cmd("SetText", this.linkedListElemID[this.top], elemToPush);
	this.cmd("Delete", labPushValID);

	if (this.top == 0)
	{
		this.cmd("SetNull", this.headID, 0);
		this.cmd("SetNull", this.tailID, 0);
		this.cmd("connect", this.headID, this.linkedListElemID[this.top]);
		this.cmd("connect", this.tailID, this.linkedListElemID[this.top]);
	}
	else
	{
		this.cmd("SetNull", this.linkedListElemID[this.top], 0);
		this.cmd("Connect",  this.linkedListElemID[this.top], this.linkedListElemID[this.top-1]);
		this.cmd("Step");
		this.cmd("Disconnect", this.headID, this.linkedListElemID[this.top-1]);
	}
	this.cmd("Connect", this.headID, this.linkedListElemID[this.top]);

	this.cmd("Step");
	this.top = this.top + 1;
	this.resetLinkedListPositions();
	this.cmd("Delete", labPushID);
	this.cmd("Step");

	return this.commands;
}

LinkedList.prototype.addTail = function(elemToPush)
{
	this.commands = new Array();

	this.arrayData[this.top] = elemToPush;

	this.cmd("SetText", this.leftoverLabelID, "");

	for (var i  = this.top; i > 0; i--)
	{
		this.arrayData[i] = this.arrayData[i-1];
		this.linkedListElemID[i] =this.linkedListElemID[i-1];
	}
	this.arrayData[0] = elemToPush;
	this.linkedListElemID[0] = this.nextIndex++;

	var labPushID = this.nextIndex++;
	var labPushValID = this.nextIndex++;
	this.cmd("CreateLinkedList",this.linkedListElemID[0], "" ,LINKED_LIST_ELEM_WIDTH, LINKED_LIST_ELEM_HEIGHT, 
		LINKED_LIST_INSERT_X, LINKED_LIST_INSERT_Y, 0.25, 0, 1, 1);

	this.cmd("SetNull", this.linkedListElemID[0], 1);
	this.cmd("CreateLabel", labPushID, "Adding Value: ", PUSH_LABEL_X, PUSH_LABEL_Y);
	this.cmd("CreateLabel", labPushValID, elemToPush, PUSH_ELEMENT_X, PUSH_ELEMENT_Y);

	this.cmd("Step");

	this.cmd("Move", labPushValID, LINKED_LIST_INSERT_X, LINKED_LIST_INSERT_Y);

	this.cmd("Step");
	this.cmd("SetText", this.linkedListElemID[0], elemToPush);
	this.cmd("Delete", labPushValID);

	if (this.top == 0)
	{
		this.cmd("SetNull", this.headID, 0);
		this.cmd("SetNull", this.tailID, 0);
		this.cmd("connect", this.headID, this.linkedListElemID[this.top]);
		this.cmd("connect", this.tailID, this.linkedListElemID[this.top]);
	}
	else
	{
		this.cmd("SetNull", this.linkedListElemID[1], 0);
		this.cmd("Connect",  this.linkedListElemID[1], this.linkedListElemID[0]);
		this.cmd("Step");
		this.cmd("Disconnect", this.tailID, this.linkedListElemID[1]);
	}
	this.cmd("Connect", this.tailID, this.linkedListElemID[0]);

	this.cmd("Step");
	this.top = this.top + 1;
	this.resetLinkedListPositions();
	this.cmd("Delete", labPushID);
	this.cmd("Step");

	return this.commands;
}

LinkedList.prototype.addAfterQ = function(elemToPush, indexToPush)
{
	this.commands = new Array();

	this.arrayData[this.top] = elemToPush;

	this.cmd("SetText", this.leftoverLabelID, "");

	for (var i  = this.top; i > indexToPush; i--)
	{
		this.arrayData[i] = this.arrayData[i-1];
		this.linkedListElemID[i] =this.linkedListElemID[i-1];
	}
	this.arrayData[indexToPush] = elemToPush;
	this.linkedListElemID[indexToPush] = this.nextIndex++;

	var labPushID = this.nextIndex++;
	var labPushValID = this.nextIndex++;
	this.cmd("CreateLinkedList",this.linkedListElemID[indexToPush], "" ,LINKED_LIST_ELEM_WIDTH, LINKED_LIST_ELEM_HEIGHT, 
		LINKED_LIST_INSERT_X, LINKED_LIST_INSERT_Y, 0.25, 0, 1, 1);

	this.cmd("SetNull", this.linkedListElemID[indexToPush], 1);
	this.cmd("CreateLabel", labPushID, "Adding Value: ", PUSH_LABEL_X, PUSH_LABEL_Y);
	this.cmd("CreateLabel", labPushValID, elemToPush, PUSH_ELEMENT_X, PUSH_ELEMENT_Y);

	this.cmd("Step");

	this.cmd("Move", labPushValID, LINKED_LIST_INSERT_X, LINKED_LIST_INSERT_Y);

	this.cmd("Step");
	this.cmd("SetText", this.linkedListElemID[indexToPush], elemToPush);
	this.cmd("Delete", labPushValID);

	if (this.top == 0)
	{
		this.cmd("SetNull", this.headID, 0);
		this.cmd("SetNull", this.tailID, 0);
		this.cmd("connect", this.headID, this.linkedListElemID[this.top]);
		this.cmd("connect", this.tailID, this.linkedListElemID[this.top]);
	}
	else
	{
		this.cmd("SetNull", this.linkedListElemID[indexToPush+1], 0);
		this.cmd("Connect",  this.linkedListElemID[indexToPush+1], this.linkedListElemID[indexToPush]);
		this.cmd("Step");
		// this.cmd("Disconnect", this.tailID, this.linkedListElemID[1]);
	}
	this.cmd("Connect", this.linkedListElemID[indexToPush], this.linkedListElemID[indexToPush-1]);

	this.cmd("Step");
	this.top = this.top + 1;
	this.resetLinkedListPositions();
	this.cmd("Delete", labPushID);
	this.cmd("Step");

	return this.commands;
}

LinkedList.prototype.deleteHead = function(ignored)
{
	this.commands = new Array();

	var labPopID = this.nextIndex++;
	var labPopValID = this.nextIndex++;

	this.cmd("SetText", this.leftoverLabelID, "");


	this.cmd("CreateLabel", labPopID, "Deleted Value: ", PUSH_LABEL_X, PUSH_LABEL_Y);
	this.cmd("CreateLabel", labPopValID,this.arrayData[this.top - 1], LINKED_LIST_START_X, LINKED_LIST_START_Y);

	this.cmd("Move", labPopValID,  PUSH_ELEMENT_X, PUSH_ELEMENT_Y);
	this.cmd("Step");
	this.cmd("Disconnect", this.headID, this.linkedListElemID[this.top - 1]);

	if (this.top == 1)
	{
		this.cmd("SetNull", this.headID, 1);
		this.cmd("SetNull", this.tailID, 1);
		this.cmd("Disconnect", this.tailID, this.linkedListElemID[this.top-1]);
	}
	else
	{
		this.cmd("Connect", this.headID, this.linkedListElemID[this.top-2]);
	}
	this.cmd("Step");
	this.cmd("Delete", this.linkedListElemID[this.top - 1]);
	this.top = this.top - 1;
	this.resetLinkedListPositions();

	this.cmd("Delete", labPopValID)
	this.cmd("Delete", labPopID);
	this.cmd("SetText", this.leftoverLabelID, "Deleted Value: " + this.arrayData[this.top]);

	return this.commands;
}


LinkedList.prototype.clearAll = function()
{
	this.commands = new Array();
	for (var i = 0; i < this.top; i++)
	{
		this.cmd("Delete", this.linkedListElemID[i]);
	}
	this.top = 0;
	this.cmd("SetNull", this.headID, 1);
	return this.commands;

}


var currentAlg;

function init()
{
	var animManag = initCanvas();
	currentAlg = new LinkedList(animManag, canvas.width, canvas.height);
}