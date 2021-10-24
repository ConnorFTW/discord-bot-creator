module.exports = {
  name: "Send Message",
  section: "Messaging",

  fields: [
    "channel",
    "varName",
    "message",
    "storage",
    "varName2",
    "iffalse",
    "iffalseVal",
    "text"
  ],

  html(isEvent, data) {
    return `
  <div>
    <div style="float: left; width: 35%;">
      Send To:<br>
      <select id="channel" class="round" onchange="glob.sendTargetChange(this, 'varNameContainer')">
        ${data.sendTargets[isEvent ? 1 : 0]}
      </select>
    </div>
    <div id="varNameContainer" style="display: none; float: right; width: 60%;">
      Variable Name:<br>
      <input id="varName" class="round" type="text" list="variableList"><br>
    </div>
  </div><br><br><br>
  <div style="padding-top: 8px;">
    Message:<br>
    <textarea id="message" rows="9" placeholder="Insert message here..." style="width: 99%; font-family: monospace; white-space: nowrap; resize: none;"></textarea>
  </div><br>
  <div>
    <div style="float: left; width: 35%;">
      Store In:<br>
      <select id="storage" class="round" onchange="glob.variableChange(this, 'varNameContainer2')">
        ${data.variables[0]}
      </select>
    </div>
    <div id="varNameContainer2" style="display: none; float: right; width: 60%;">
      Variable Name:<br>
      <input id="varName2" class="round" type="text">
    </div>
  </div><br><br><br>
  <div style="padding-top: 8px;">
    <div style="float: left; width: 35%;">
      If Message Delivery Fails:<br>
      <select id="iffalse" class="round" onchange="glob.onChangeFalse(this)">
        <option value="0" selected>Continue Actions</option>
        <option value="1">Stop Action Sequence</option>
        <option value="2">Jump To Action</option>
        <option value="3">Skip Next Actions</option>
        <option value="4">Jump To Anchor</option>
      </select>
    </div>
    <div id="iffalseContainer" style="display: none; float: right; width: 60%;">
      <span id="iffalseName">Action Number</span>:<br>
      <input id="iffalseVal" class="round" type="text">
    </div>
    </div><br /><br /> <br />
  <div style="padding-top: 8px; margin-top:8px;">
  <div style="float: left; width: 100%; padding-top:8px;">
    Button Name:<br>
    <textarea id="text" rows="9" style="width: 100%;" placeholder="Button Name, leave blank for nothing"></textarea>
    </div>
  </div>
</div>`;
  },

  init() {
    const { glob, document } = this;

    glob.onChangeFalse = function onChangeFalse(event) {
      switch (parseInt(event.value, 10)) {
        case 0:
        case 1:
          document.getElementById("iffalseContainer").style.display = "none";
          break;
        case 2:
          document.getElementById("iffalseName").innerHTML = "Action Number";
          document.getElementById("iffalseContainer").style.display = null;
          break;
        case 3:
          document.getElementById("iffalseName").innerHTML =
            "Number of Actions to Skip";
          document.getElementById("iffalseContainer").style.display = null;
          break;
        case 4:
          document.getElementById("iffalseName").innerHTML = "Anchor ID";
          document.getElementById("iffalseContainer").style.display = null;
          break;
        default:
          break;
      }
    };
    glob.sendTargetChange(
      document.getElementById("channel"),
      "varNameContainer"
    );
    glob.variableChange(
      document.getElementById("storage"),
      "varNameContainer2"
    );
    glob.onChangeFalse(document.getElementById("iffalse"));
  },
};
