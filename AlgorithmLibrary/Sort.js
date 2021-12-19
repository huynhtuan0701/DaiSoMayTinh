function Sort(am, w, h)
{
	this.init(am, w, h);

}


var ARRAY_SIZE_SMALL  = 15;
var ARRAY_WIDTH_SMALL = 60;
var ARRAY_BAR_WIDTH_SMALL = 50;
var ARRAY_INITIAL_X_SMALL = 15;

var ARRAY_Y_POS = 350;
var ARRAY_LABEL_Y_POS = 370;

var LOWER_ARRAY_Y_POS = 500;
var LOWER_ARRAY_LABEL_Y_POS = 510;

var SCALE_FACTOR = 2.0;

var ARRAY_SIZE_LARGE = 50;
var ARRAY_WIDTH_LARGE = 18;
var ARRAY_BAR_WIDTH_LARGE = 10;
var ARRAY_INITIAL_X_LARGE = 15;

var BAR_FOREGROUND_COLOR = "#0000FF";
var BAR_BACKGROUND_COLOR ="#AAAAFF";
var INDEX_COLOR = "#0000FF";
var HIGHLIGHT_BAR_COLOR = "#FF0000";
var HIGHLIGHT_BAR_BACKGROUND_COLOR = "#FFAAAA";

var QUICKSORT_LINE_COLOR = "#FF0000";



Sort.prototype = new Algorithm();
Sort.prototype.constructor = Sort;
Sort.superclass = Algorithm.prototype;

Sort.prototype.init = function(am, w, h)
{
	var sc = Sort.superclass;
	var fn = sc.init;
	fn.call(this,am);
	this.addControls();
	this.nextIndex = 0;
	
	this.setArraySize(true);
	this.arrayData = new Array(ARRAY_SIZE_LARGE);
	this.arraySwap = new Array(ARRAY_SIZE_LARGE);
	this.labelsSwap = new Array(ARRAY_SIZE_LARGE);
	this.objectsSwap = new Array(ARRAY_SIZE_LARGE);
	
	this.createVisualObjects();	
}



Sort.prototype.addControls =  function()
{
	this.resetButton = addControlToAlgorithmBar("Button", "Randomize Array");
	this.resetButton.onclick = this.resetCallback.bind(this);

	this.insertSortButton = addControlToAlgorithmBar("Button", "Insertion Sort");
	this.insertSortButton.onclick = this.insertSortCallback.bind(this);

	this.selectSortButton = addControlToAlgorithmBar("Button", "Selection Sort");
	this.selectSortButton.onclick = this.selectSortCallback.bind(this);

	this.bubbleSortButton = addControlToAlgorithmBar("Button", "Bubble Sort");
	this.bubbleSortButton.onclick = this.bubbleSortCallback.bind(this);

	this.quickSortButton = addControlToAlgorithmBar("Button", "Quick Sort");
	this.quickSortButton.onclick = this.quickSortCallback.bind(this);

	this.mergeSortButton = addControlToAlgorithmBar("Button", "Merge Sort");
	this.mergeSortButton.onclick = this.mergeSortCallback.bind(this);

	this.sizeButton = addControlToAlgorithmBar("Button", "Change Size");
	this.sizeButton.onclick = this.changeSizeCallback.bind(this);
}

		
Sort.prototype.setArraySize = function (small)
{
	if (small)
	{
		this.array_size = ARRAY_SIZE_SMALL;
		this.array_width = ARRAY_WIDTH_SMALL;
		this.array_bar_width = ARRAY_BAR_WIDTH_SMALL;
		this.array_initial_x = ARRAY_INITIAL_X_SMALL;
		this.array_y_pos = ARRAY_Y_POS;
		this.array_label_y_pos = ARRAY_LABEL_Y_POS;
		this.showLabels = true;
	}
	else
	{
		this.array_size = ARRAY_SIZE_LARGE;
		this.array_width = ARRAY_WIDTH_LARGE;
		this.array_bar_width = ARRAY_BAR_WIDTH_LARGE;
		this.array_initial_x = ARRAY_INITIAL_X_LARGE;
		this.array_y_pos = ARRAY_Y_POS;
		this.array_label_y_pos = ARRAY_LABEL_Y_POS;
		this.showLabels = false;
	}
	
}


Sort.prototype.resetAll = function(small)
{
	this.animationManager.resetAll();
	this.setArraySize(!small);
	this.nextIndex = 0;
	this.createVisualObjects();
}


Sort.prototype.randomizeArray = function()
{
	this.commands = new Array();
	for (var i = 0; i < this.array_size; i++)
	{
		this.arrayData[i] = Math.floor(1 + Math.random()*99);
		this.oldData[i] = this.arrayData[i];
		if (this.showLabels)
		{
			this.cmd("SetText", this.barLabels[i], this.arrayData[i]);
		}
		else
		{
			this.cmd("SetText", this.barLabels[i], "");					
		}
		this.cmd("SetHeight", this.barObjects[i], this.arrayData[i] * SCALE_FACTOR);				
	}
	this.animationManager.StartNewAnimation(this.commands);
	this.animationManager.skipForward();
	this.animationManager.clearHistory();
	
}


Sort.prototype.swap = function(index1, index2)
{
	var tmp = this.arrayData[index1];
	this.arrayData[index1] = this.arrayData[index2];
	this.arrayData[index2] = tmp;
	
	tmp = this.barObjects[index1];
	this.barObjects[index1] = this.barObjects[index2];
	this.barObjects[index2] = tmp;
	
	tmp = this.barLabels[index1];
	this.barLabels[index1] = this.barLabels[index2];
	this.barLabels[index2] = tmp;
	
	
	this.cmd("Move", this.barObjects[index1], this.barPositionsX[index1], this.array_y_pos);
	this.cmd("Move", this.barObjects[index2], this.barPositionsX[index2], this.array_y_pos);
	this.cmd("Move", this.barLabels[index1], this.barPositionsX[index1], this.array_label_y_pos);
	this.cmd("Move", this.barLabels[index2], this.barPositionsX[index2], this.array_label_y_pos);
	this.cmd("Step");
}


Sort.prototype.createVisualObjects = function()
{
	this.barObjects = new Array(this.array_size);
	this.oldBarObjects= new Array(this.array_size);
	this.oldbarLabels= new Array(this.array_size);
	
	this.barLabels = new Array(this.array_size);
	this.barPositionsX = new Array(this.array_size);			
	this.oldData = new Array(this.array_size);
	this.obscureObject  = new Array(this.array_size);
	
	
	var xPos = this.array_initial_x;
	var yPos = this.array_y_pos;
	var yLabelPos = this.array_label_y_pos;
	
	this.commands = new Array();
	for (var i = 0; i < this.array_size; i++)
	{
		xPos = xPos + this.array_width;
		this.barPositionsX[i] = xPos;
		this.cmd("CreateRectangle", this.nextIndex, "", this.array_bar_width, 200, xPos, yPos,"center","bottom");
		this.cmd("SetForegroundColor", this.nextIndex, BAR_FOREGROUND_COLOR);
		this.cmd("SetBackgroundColor", this.nextIndex, BAR_BACKGROUND_COLOR);
		this.barObjects[i] = this.nextIndex;
		this.oldBarObjects[i] = this.barObjects[i];
		this.nextIndex += 1;
		if (this.showLabels)
		{
			this.cmd("CreateLabel", this.nextIndex, "99", xPos, yLabelPos);
		}
		else
		{
			this.cmd("CreateLabel", this.nextIndex, "", xPos, yLabelPos);
		}
		this.cmd("SetForegroundColor", this.nextIndex, INDEX_COLOR);
		
		this.barLabels[i] = this.nextIndex;
		this.oldbarLabels[i] = this.barLabels[i];
		++this.nextIndex;				
	}
	this.animationManager.StartNewAnimation(this.commands);
	this.animationManager.skipForward();
	this.randomizeArray();
	for (i = 0; i < this.array_size; i++)
	{
		this.obscureObject[i] = false;
	}
	this.lastCreatedIndex = this.nextIndex;
}

Sort.prototype.highlightRange  = function(lowIndex, highIndex)
{
	for (var i = 0; i < lowIndex; i++)
	{
		if (!this.obscureObject[i])
		{
			this.obscureObject[i] = true;
			this.cmd("SetAlpha", this.barObjects[i], 0.08);
			this.cmd("SetAlpha", this.barLabels[i], 0.08);
		}
	}
	for (i = lowIndex; i <= highIndex; i++)
	{
		if (this.obscureObject[i])
		{
			this.obscureObject[i] = false;
			this.cmd("SetAlpha", this.barObjects[i], 1.0);
			this.cmd("SetAlpha", this.barLabels[i], 1.0);
		}				
	}
	for (i = highIndex+1; i < this.array_size; i++)
	{
		if (!this.obscureObject[i])
		{
			this.obscureObject[i] = true;
			this.cmd("SetAlpha", this.barObjects[i], 0.08);
			this.cmd("SetAlpha", this.barLabels[i], 0.08);
		}				
	}
}



Sort.prototype.reset = function()
{
	for (var i = 0; i < this.array_size; i++)
	{
		
		this.arrayData[i]= this.oldData[i];
		this.barObjects[i] = this.oldBarObjects[i];
		this.barLabels[i] = this.oldbarLabels[i];
		if (this.showLabels)
		{
			this.cmd("SetText", this.barLabels[i], this.arrayData[i]);
		}
		else
		{
			this.cmd("SetText", this.barLabels[i], "");					
		}
		this.cmd("SetHeight", this.barObjects[i], this.arrayData[i] * SCALE_FACTOR);
	}
	this.commands = new Array();
}


Sort.prototype.resetCallback = function(event)
{
	this.randomizeArray();
}

Sort.prototype.changeSizeCallback = function(event)
{
	this.resetAll(this.showLabels);
}



Sort.prototype.insertSortCallback = function(event)
{
	this.animationManager.clearHistory();
	this.commands = new Array();
	this.insertionSortSkip(1,0);
	this.animationManager.StartNewAnimation(this.commands);
	this.commands = new Array();
}

Sort.prototype.selectSortCallback = function(event)
{
	this.commands = new Array();
	this.animationManager.clearHistory();
	
	
	for (var i = 0; i < this.array_size - 1; i++)
	{
		var smallestIndex = i;
		this.cmd("SetForegroundColor", this.barObjects[smallestIndex], HIGHLIGHT_BAR_COLOR);
		this.cmd("SetBackgroundColor", this.barObjects[smallestIndex], HIGHLIGHT_BAR_BACKGROUND_COLOR);
		for (var j = i+1; j < this.array_size; j++)
		{
			this.cmd("SetForegroundColor", this.barObjects[j], HIGHLIGHT_BAR_COLOR);
			this.cmd("SetBackgroundColor", this.barObjects[j], HIGHLIGHT_BAR_BACKGROUND_COLOR);
			this.cmd("Step");
			if (this.arrayData[j] < this.arrayData[smallestIndex])
			{
				this.cmd("SetForegroundColor", this.barObjects[smallestIndex], BAR_FOREGROUND_COLOR);
				this.cmd("SetBackgroundColor", this.barObjects[smallestIndex], BAR_BACKGROUND_COLOR);
				smallestIndex = j;
			}
			else
			{
				this.cmd("SetForegroundColor", this.barObjects[j], BAR_FOREGROUND_COLOR);						
				this.cmd("SetBackgroundColor", this.barObjects[j], BAR_BACKGROUND_COLOR);
			}										
		}
		if (smallestIndex != i)
		{
			this.swap(smallestIndex, i);
		}
		this.cmd("SetForegroundColor", this.barObjects[i], BAR_FOREGROUND_COLOR);				
		this.cmd("SetBackgroundColor", this.barObjects[i], BAR_BACKGROUND_COLOR);
	}
	this.animationManager.StartNewAnimation(this.commands);
}
Sort.prototype.bubbleSortCallback = function(event)
{
	this.animationManager.clearHistory();
	
	this.commands = new Array();
	for (var i = this.array_size-1; i > 0; i--)
	{
		for (var j = 0; j < i; j++)
		{
			this.cmd("SetForegroundColor", this.barObjects[j], HIGHLIGHT_BAR_COLOR);
			this.cmd("SetBackgroundColor", this.barObjects[j], HIGHLIGHT_BAR_BACKGROUND_COLOR);

			this.cmd("SetForegroundColor", this.barObjects[j+1], HIGHLIGHT_BAR_COLOR);
			this.cmd("SetBackgroundColor", this.barObjects[j+1], HIGHLIGHT_BAR_BACKGROUND_COLOR);
			this.cmd("Step");
			if (this.arrayData[j] > this.arrayData[j+1])
			{
				this.swap(j,j+1);
			}
			this.cmd("SetForegroundColor", this.barObjects[j], BAR_FOREGROUND_COLOR);
			this.cmd("SetBackgroundColor", this.barObjects[j], BAR_BACKGROUND_COLOR);

			this.cmd("SetForegroundColor", this.barObjects[j+1], BAR_FOREGROUND_COLOR);
			this.cmd("SetBackgroundColor", this.barObjects[j+1], BAR_BACKGROUND_COLOR);

		}
	}
	this.animationManager.StartNewAnimation(this.commands);
}
Sort.prototype.quickSortCallback = function(event)
{
	this.animationManager.clearHistory();
	
	this.commands = new Array();
	this.iID = this.nextIndex++;
	this.jID= this.nextIndex++;
	this.cmd("CreateLabel", this.iID, "i", this.barObjects[0], this.array_label_y_pos + 20);
	this.cmd("CreateLabel", this.jID, "j", this.barObjects[this.array_size - 1], this.array_label_y_pos + 20);
	this.cmd("SetForegroundColor", this.iID, HIGHLIGHT_BAR_COLOR);
	this.cmd("SetBackgroundColor", this.iID, HIGHLIGHT_BAR_BACKGROUND_COLOR);
	this.cmd("SetForegroundColor", this.jID, HIGHLIGHT_BAR_COLOR);			
	this.cmd("SetBackgroundColor", this.jID, HIGHLIGHT_BAR_BACKGROUND_COLOR);
	this.doQuickSort(0, this.array_size - 1);			
	this.cmd("Delete", this.iID);
	this.cmd("Delete", this.jID);
	this.animationManager.StartNewAnimation(this.commands);
}

Sort.prototype.doQuickSort = function(low, high)
{
	this.highlightRange(low,high);
	if (high <= low)
		return;
	this.cmd("Step");
	var lineID = this.nextIndex;
	var pivot = this.arrayData[low];
	this.cmd("CreateRectangle", lineID, "", (this.array_size + 1) * this.array_width, 0, this.array_initial_x, this.array_y_pos - pivot * 2,"left","bottom");
	this.cmd("SetForegroundColor", lineID, QUICKSORT_LINE_COLOR);
	var i = low+1;
	var j = high;
	
	this.cmd("Move", this.iID, this.barPositionsX[i], this.array_label_y_pos + 20);
	this.cmd("Move", this.jID, this.barPositionsX[j], this.array_label_y_pos + 20);
	this.cmd("Step");
	
	while (i <= j)
	{
		
		this.cmd("SetForegroundColor", this.barObjects[i], HIGHLIGHT_BAR_COLOR);
		this.cmd("SetBackgroundColor", this.barObjects[i], HIGHLIGHT_BAR_BACKGROUND_COLOR);
		this.cmd("SetForegroundColor", this.barObjects[low], HIGHLIGHT_BAR_COLOR);
		this.cmd("SetBackgroundColor", this.barObjects[low], HIGHLIGHT_BAR_BACKGROUND_COLOR);
		this.cmd("Step");	
		this.cmd("SetForegroundColor", this.barObjects[low], BAR_FOREGROUND_COLOR);
		this.cmd("SetBackgroundColor", this.barObjects[low], BAR_BACKGROUND_COLOR);

		this.cmd("SetForegroundColor", this.barObjects[i], BAR_FOREGROUND_COLOR);
		this.cmd("SetBackgroundColor", this.barObjects[i], BAR_BACKGROUND_COLOR);
		while (i <= j && this.arrayData[i] < pivot)
		{
			++i;
			this.cmd("Move", this.iID, this.barPositionsX[i], this.array_label_y_pos + 20);
			this.cmd("Step");	
			this.cmd("SetForegroundColor", this.barObjects[low], HIGHLIGHT_BAR_COLOR);
			this.cmd("SetBackgroundColor", this.barObjects[low], HIGHLIGHT_BAR_BACKGROUND_COLOR);
			this.cmd("SetForegroundColor", this.barObjects[i], HIGHLIGHT_BAR_COLOR);
			this.cmd("SetBackgroundColor", this.barObjects[i], HIGHLIGHT_BAR_BACKGROUND_COLOR);
			this.cmd("Step");	
			this.cmd("SetForegroundColor", this.barObjects[low], BAR_FOREGROUND_COLOR);
			this.cmd("SetBackgroundColor", this.barObjects[low], BAR_BACKGROUND_COLOR);

			this.cmd("SetForegroundColor", this.barObjects[i], BAR_FOREGROUND_COLOR);				
			this.cmd("SetBackgroundColor", this.barObjects[i], BAR_BACKGROUND_COLOR);
		}
		this.cmd("SetForegroundColor", this.barObjects[j], HIGHLIGHT_BAR_COLOR);
		this.cmd("SetBackgroundColor", this.barObjects[j], HIGHLIGHT_BAR_BACKGROUND_COLOR);

		this.cmd("SetForegroundColor", this.barObjects[low], HIGHLIGHT_BAR_COLOR);
		this.cmd("SetBackgroundColor", this.barObjects[low], HIGHLIGHT_BAR_BACKGROUND_COLOR);

		this.cmd("Step");	
		this.cmd("SetForegroundColor", this.barObjects[j], BAR_FOREGROUND_COLOR);
		this.cmd("SetBackgroundColor", this.barObjects[j], BAR_BACKGROUND_COLOR);

		this.cmd("SetForegroundColor", this.barObjects[low], BAR_FOREGROUND_COLOR);
		this.cmd("SetBackgroundColor", this.barObjects[low], BAR_BACKGROUND_COLOR);

		while (j >= i && this.arrayData[j] > pivot)
		{
			--j;			
			this.cmd("Move", this.jID, this.barPositionsX[j], this.array_label_y_pos + 20);
			this.cmd("Step");	
			this.cmd("SetForegroundColor", this.barObjects[j], HIGHLIGHT_BAR_COLOR);
			this.cmd("SetBackgroundColor", this.barObjects[j], HIGHLIGHT_BAR_BACKGROUND_COLOR);

			this.cmd("SetForegroundColor", this.barObjects[low], HIGHLIGHT_BAR_COLOR);
			this.cmd("SetBackgroundColor", this.barObjects[low], HIGHLIGHT_BAR_BACKGROUND_COLOR);

			this.cmd("Step");					
			this.cmd("SetForegroundColor", this.barObjects[j], BAR_FOREGROUND_COLOR);
			this.cmd("SetBackgroundColor", this.barObjects[j], BAR_BACKGROUND_COLOR);
			this.cmd("SetForegroundColor", this.barObjects[low], BAR_FOREGROUND_COLOR);
			this.cmd("SetBackgroundColor", this.barObjects[low], BAR_BACKGROUND_COLOR);
		}
		if (i <= j)
		{
			this.cmd("Move", this.jID, this.barPositionsX[j-1], this.array_label_y_pos + 20);
			this.cmd("Move", this.iID, this.barPositionsX[i+1], this.array_label_y_pos + 20);
			
			this.swap(i,j);
			++i;
			--j;
		}
	}
	if (i >= low)
	{
		this.cmd("SetForegroundColor", this.barObjects[i], BAR_FOREGROUND_COLOR);
		this.cmd("SetBackgroundColor", this.barObjects[i], BAR_BACKGROUND_COLOR);

	}
	if (j <= high)
	{
		this.cmd("SetForegroundColor", this.barObjects[j], BAR_FOREGROUND_COLOR);
		this.cmd("SetBackgroundColor", this.barObjects[j], BAR_BACKGROUND_COLOR);

	}
	this.swap(low, j);
	
	this.cmd("Step");
	this.cmd("Delete", lineID);	
	
	this.doQuickSort(low, j-1);
	this.doQuickSort(j+1,high);
	this.highlightRange(low,high);
}		

Sort.prototype.mergeSortCallback = function(event)
{
	this.animationManager.clearHistory();
	
	this.commands = new Array();
	this.doMergeSort(0, this.array_size-1);
	this.animationManager.StartNewAnimation(this.commands);
}

Sort.prototype.doMergeSort = function(low,high)
{
	this.highlightRange(low, high);
	if (low < high)
	{
		this.cmd("Step");
		var mid = Math.floor((low + high) / 2);
		this.doMergeSort(low,mid);
		this.doMergeSort(mid+1, high);
		this.highlightRange(low,high);
		var insertIndex = low;
		var leftIndex = low;
		var rightIndex = mid+1;
		while (insertIndex <= high)
		{
			if (leftIndex <= mid && (rightIndex > high || this.arrayData[leftIndex] <= this.arrayData[rightIndex]))
			{
				this.arraySwap[insertIndex] = this.arrayData[leftIndex];
				this.cmd("Move", this.barObjects[leftIndex], this.barPositionsX[insertIndex], LOWER_ARRAY_Y_POS);
				this.cmd("Move", this.barLabels[leftIndex], this.barPositionsX[insertIndex], LOWER_ARRAY_LABEL_Y_POS);
				this.cmd("Step");
				this.labelsSwap[insertIndex] = this.barLabels[leftIndex];
				this.objectsSwap[insertIndex] = this.barObjects[leftIndex];
				insertIndex++;
				leftIndex++;
			}
			else
			{
				this.arraySwap[insertIndex] = this.arrayData[rightIndex];
				this.cmd("Move", this.barLabels[rightIndex], this.barPositionsX[insertIndex], LOWER_ARRAY_LABEL_Y_POS);
				this.cmd("Move", this.barObjects[rightIndex], this.barPositionsX[insertIndex], LOWER_ARRAY_Y_POS);
				this.cmd("Step");
				this.labelsSwap[insertIndex] = this.barLabels[rightIndex];
				this.objectsSwap[insertIndex] = this.barObjects[rightIndex];
				
				insertIndex++;
				rightIndex++;					
			}
		}
		for (insertIndex = low; insertIndex <= high; insertIndex++)
		{
			this.barObjects[insertIndex] = this.objectsSwap[insertIndex];
			this.barLabels[insertIndex] = this.labelsSwap[insertIndex];
			this.arrayData[insertIndex] = this.arraySwap[insertIndex];
			this.cmd("Move", this.barObjects[insertIndex], this.barPositionsX[insertIndex], this.array_y_pos);
			this.cmd("Move", this.barLabels[insertIndex], this.barPositionsX[insertIndex], this.array_label_y_pos);
		}
		this.cmd("Step");				
	}
	else
	{
		this.cmd("Step");				
	}
	
}


Sort.prototype.insertionSortSkip = function(inc, offset)
{
	for (var i =inc + offset; i < this.array_size; i = i + inc)
	{
		var j = i;
		while (j > inc - 1)
		{
			this.cmd("SetForegroundColor", this.barObjects[j], HIGHLIGHT_BAR_COLOR);
			this.cmd("SetForegroundColor", this.barObjects[j-inc], HIGHLIGHT_BAR_COLOR);
			this.cmd("SetBackgroundColor", this.barObjects[j], HIGHLIGHT_BAR_BACKGROUND_COLOR);
			this.cmd("SetBackgroundColor", this.barObjects[j - inc], HIGHLIGHT_BAR_BACKGROUND_COLOR);
			this.cmd("Step");
			if (this.arrayData[j-inc] <= this.arrayData[j])
			{
				this.cmd("SetForegroundColor", this.barObjects[j], BAR_FOREGROUND_COLOR);
				this.cmd("SetForegroundColor", this.barObjects[j-inc], BAR_FOREGROUND_COLOR);
				this.cmd("SetBackgroundColor", this.barObjects[j], BAR_BACKGROUND_COLOR);
				this.cmd("SetBackgroundColor", this.barObjects[j - inc], BAR_BACKGROUND_COLOR);
				break;
			}
			this.swap(j,j-inc);
			this.cmd("SetForegroundColor", this.barObjects[j], BAR_FOREGROUND_COLOR);
			this.cmd("SetForegroundColor", this.barObjects[j-inc], BAR_FOREGROUND_COLOR);
			this.cmd("SetBackgroundColor", this.barObjects[j], BAR_BACKGROUND_COLOR);
			this.cmd("SetBackgroundColor", this.barObjects[j - inc], BAR_BACKGROUND_COLOR);
			j = j - inc;					
		}
		
	}
}

Sort.prototype.disableUI = function(event)
{
	this.resetButton.disabled = true;
	this.insertSortButton.disabled = true;
	this.selectSortButton.disabled = true;
	this.bubbleSortButton.disabled = true;
	this.quickSortButton.disabled = true;
	this.mergeSortButton.disabled = true;
	this.sizeButton.disabled = true;
}
Sort.prototype.enableUI = function(event)
{
	this.resetButton.disabled = false;
	this.insertSortButton.disabled = false;
	this.selectSortButton.disabled = false;
	this.bubbleSortButton.disabled = false;
	this.quickSortButton.disabled = false;
	this.mergeSortButton.disabled = false;
	this.sizeButton.disabled = false;
}


var currentAlg;

function init()
{
	var animManag = initCanvas();
	currentAlg = new Sort(animManag, canvas.width, canvas.height);
}