module.exports = {
  name: "Add Item to List",
  section: "Lists and Loops",
  subtitle(data) {
    const storage = ["", "Temp Variable", "Server Variable", "Global Variable"];
    return `Add "${data.value}" to ${storage[parseInt(data.storage)]} (${
      data.varName
    })`;
  },
  fields: ["storage", "varName", "addType", "position", "value"],
  html(isEvent, data) {
    return `
<div>
	<div style="float: left; width: 35%;">
		Source List:<br>
		<select id="storage" class="round" onchange="glob.refreshVariableList(this)">
			${data.variables[1]}
		</select>
	</div>
	<div id="varNameContainer" style="float: right; width: 60%;">
		Variable Name:<br>
		<input id="varName" class="round varSearcher" type="text" list="variableList">
	</div>
</div><br><br><br>
<div style="padding-top: 8px;">
	<div style="float: left; width: 45%;">
		Add Type:<br>
		<select id="addType" class="round" onchange="glob.onChange1(this)">
			<option value="0" selected>Add to End</option>
			<option value="1">Add to Front</option>
			<option value="2">Add to Specific Position</option>
		</select>
	</div>
	<div id="positionHolder" style="float: right; width: 50%; display: none;">
		Position:<br>
		<input id="position" class="round" type="text"><br>
	</div>
</div><br><br><br>
<div style="padding-top: 8px;">
	Value:<br>
	<input id="value" class="round" type="text" name="is-eval">
</div>`;
  },
  init: function () {
    const { glob, document } = this;

    glob.onChange1 = function (event) {
      const value = parseInt(event.value);
      const dom = document.getElementById("positionHolder");
      if (value < 2) {
        dom.style.display = "none";
      } else {
        dom.style.display = null;
      }
    };

    glob.refreshVariableList(document.getElementById("storage"));
    glob.onChange1(document.getElementById("addType"));
  },

  action(cache) {
    const data = cache.actions[cache.index];
    const storage = parseInt(data.storage);
    const varName = this.evalMessage(data.varName, cache);
    const list = this.getVariable(storage, varName, cache);

    const type = parseInt(data.addType);
    let val = this.evalMessage(data.value, cache);
    try {
      val = this.eval(val, cache);
    } catch (e) {
      this.displayError(data, cache, e);
    }

    switch (type) {
      case 0:
        list.push(val);
        break;
      case 1:
        list.unshift(val);
        break;
      case 2:
        const position = parseInt(this.evalMessage(data.position));
        if (position < 0) {
          list.unshift(val);
        } else if (position >= list.length) {
          list.push(val);
        } else {
          list.splice(position, 0, val);
        }
        break;
    }

    this.callNextAction(cache);
  },
}; // End of module
