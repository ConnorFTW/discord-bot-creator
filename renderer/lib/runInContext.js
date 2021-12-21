import parseFunction from 'parse-function-string';

const runInContext = (
  type,
  { functionString, action, isEvent, elem, glob: _glob }
) => {
  if (!['html', 'init', 'listener'].includes(type)) {
    return console.error("Type has to be 'html', 'init', or 'listener'");
  }

  const data = action || {};
  const content = '';
  const val1 = '';
  const val2 = '';
  const inputData = '';

  data.messages = [
    `
    <option value="0">Command Message</option>
    <option value="1">Temp Variable</option>
    <option value="2">Server Variable</option>
    <option value="3">Global Variable</option>
    `,
    `
    <option value="1">Temp Variable</option>
    <option value="2">Server Variable</option>
    <option value="3">Global Variable</option>
    `,
  ];
  data.channels = [
    `
    <option value="0">Same Channel</option>
    <option value="1">Mentioned Channel</option>
    <option value="2">Default Channel</option>
    <option value="3">Temp Variable</option>
    <option value="4">Server Variable</option>
    <option value="5">Global Variable</option>
    `,
    `
    <option value="2">Default Channel</option>
    <option value="3">Temp Variable</option>
    <option value="4">Server Variable</option>
    <option value="5">Global Variable</option>
    `,
  ];
  data.voiceChannels = [
    `
    <option value="0">Command Author's Voice Channel</option>
    <option value="1">Mentioned User's Voice Channel</option>
    <option value="2">Default Voice Channel</option>
    <option value="3">Temp Variable</option>
    <option value="4">Server Variable</option>
    <option value="5">Global Variable</option>
    `,

    `
    <option value="2">Default Voice Channel</option>
    <option value="3">Temp Variable</option>
    <option value="4">Server Variable</option>
    <option value="5">Global Variable</option>
    `,
  ];
  data.variables = [
    `
    <option value="0">Nothing</option>
    <option value="1">Temp Variable</option>
    <option value="2">Server Variable</option>
    <option value="3">Global Variable</option>
      `,
    `
    <option value="1">Temp Variable</option>
    <option value="2">Server Variable</option>
    <option value="3">Global Variable</option>
      `,
  ];
  data.sendTargets = [
    `
    <option value="0">Same Channel</option>
    <option value="1">Command Author</option>
    <option value="2">Mentioned User</option>
    <option value="3">Mentioned Channel</option>
    <option value="4">Default Channel</option>
    <option value="5">Temp Variable</option>
    <option value="6">Server Variable</option>
    <option value="7">Global Variable</option>
    `,
    `
    <option value="4">Default Channel</option>
    <option value="5">Temp Variable</option>
    <option value="6">Server Variable</option>
    <option value="7">Global Variable</option>
    `,
  ];
  data.members = [
    `
    <option value="0">Mentioned User</option>
    <option value="1">Command Author</option>
    <option value="2">Temp Variable</option>
    <option value="3">Server Variable</option>
    <option value="4">Global Variable</option>
    `,
    `
    <option value="2">Temp Variable</option>
    <option value="3">Server Variable</option>
    <option value="4">Global Variable</option>
    `,
  ];
  data.servers = [
    `
    <option value="0">Current Server</option>
    <option value="1">Temp Variable</option>
    <option value="2">Server Variable</option>
    <option value="3">Global Variable</option>
    `,
    `
    <option value="0">Current Server</option>
    <option value="1">Temp Variable</option>
    <option value="2">Server Variable</option>
    <option value="3">Global Variable</option>
    `,
  ];
  data.roles = [
    `
    <option value="0">Mentioned Role</option>
    <option value="1">1st Author Role</option>
    <option value="2">1st Server Role</option>
    <option value="3">Temp Variable</option>
    <option value="4">Server Variable</option>
    <option value="5">Global Variable</option>
    `,
    `
    <option value="2">1st Server Role</option>
    <option value="3">Temp Variable</option>
    <option value="4">Server Variable</option>
    <option value="5">Global Variable</option>
    `,
  ];
  data.conditions = [
    `
  <div style="padding-top: 8px;">
    <div style="float: left; width: 35%;">
      If true:<br>
      <select id="iftrue" class="round" onchange="glob.onChangeTrue(this)">
        <option value="0" selected>Continue Actions</option>
        <option value="1">Stop Action Sequence</option>
        <option value="2">Jump To Action</option>
        <option value="3">Skip Next Actions</option>
        <option value="4">Jump to Anchor</option>
      </select>
    </div>
    <div id="iftrueContainer" style="display: none; float: right; width: 60%;">
      <span id="iftrueName">Action Number</span>:<br><input id="iftrueVal" class="round" type="text">
    </div>
  </div><br><br><br>
  <div style="padding-top: 18px;">
    <div style="float: left; width: 35%;">
      If false:<br>
      <select id="iffalse" class="round" onchange="glob.onChangeFalse(this)">
        <option value="0">Continue Actions</option>
        <option value="1" selected>Stop Action Sequence</option>
        <option value="2">Jump To Action</option>
        <option value="3">Skip Next Actions</option>
        <option value="4">Jump to Anchor</option>
      </select>
    </div>
    <div id="iffalseContainer" style="display: none; float: right; width: 60%;">
      <span id="iffalseName">Action Number</span>:<br><input id="iffalseVal" class="round" type="text"></div>
    </div><br><br><br>
  </div>
    `,
  ];

  const glob = {
    variableChange(_this, varName) {
      const element = document.getElementById(varName);
      if (!element) return;
      element.style.display = +_this.value ? 'block' : 'none';
    },
    channelChange(_this, varName) {
      if (isNaN(+_this?.value)) return;
      if (+_this.value < 3) {
        document.getElementById(varName).style.display = 'none';
      } else {
        document.getElementById(varName).style.display = 'block';
      }
    },
    voiceChannelChange(_this, varName) {
      if (isNaN(+_this?.value)) return;
      if (+_this.value < 3) {
        document.getElementById(varName).style.display = 'none';
      } else {
        document.getElementById(varName).style.display = 'block';
      }
    },
    sendTargetChange(_this, varName) {
      if (isNaN(+_this?.value)) return;
      if (+_this.value < 5) {
        document.getElementById(varName).style.display = 'none';
      } else {
        document.getElementById(varName).style.display = 'block';
      }
    },
    memberChange(_this, varName) {
      document.getElementById(varName).style.display = +_this.value
        ? 'block'
        : 'none';
      if (isNaN(+_this.value)) return;
      if (+_this.value < 2) {
        document.getElementById(varName).style.display = 'none';
      } else {
        document.getElementById(varName).style.display = 'block';
      }
    },
    serverChange(_this, varName) {
      document.getElementById(varName).style.display = +_this.value
        ? 'block'
        : 'none';
      if (isNaN(+_this.value)) return;
      if (+_this.value < 1) {
        document.getElementById(varName).style.display = 'none';
      } else {
        document.getElementById(varName).style.display = 'block';
      }
    },
    messageChange(_this, varName) {
      document.getElementById(varName).style.display = +_this.value
        ? 'block'
        : 'none';
      if (isNaN(+_this.value)) return;
      if (+_this.value < 1) {
        document.getElementById(varName).style.display = 'none';
      } else {
        document.getElementById(varName).style.display = 'block';
      }
    },
    roleChange(_this, varName) {
      document.getElementById(varName).style.display = +_this.value
        ? 'block'
        : 'none';
      if (isNaN(+_this.value)) return;
      if (+_this.value < 1) {
        document.getElementById(varName).style.display = 'none';
      } else {
        document.getElementById(varName).style.display = 'block';
      }
    },
    onChangeBasic(_this, varName) {
      document.getElementById(varName).style.display = +_this.value
        ? 'block'
        : 'none';
      if (isNaN(+_this.value)) return;
      if (+_this.value < 3) {
        document.getElementById(varName).style.display = 'none';
      } else {
        document.getElementById(varName).style.display = 'block';
      }
    },
    refreshVariableList() {},
  };

  Object.assign(glob, _glob);

  if (!functionString) return console.log('No function provided');

  const context = {
    glob,
    document,
    call() {
      switch (type) {
        case 'html':
          return new Function(
            'isEvent',
            'data',
            parseFunction(functionString).body
          ).bind(this)(isEvent, data);
        case 'init':
          new Function('data', parseFunction(functionString).body).bind(this)(
            data
          );
          return glob;
        case 'listener':
          return new Function('glob', parseFunction(functionString).body).bind(
            elem
          )(glob);
      }
    },
  };

  return context.call();
};

export let evalHTML = (html, action, isEvent) =>
  runInContext('html', { functionString: html, action, isEvent });

export let evalInit = (init, action, isEvent) =>
  runInContext('init', { functionString: init, action, isEvent });

export let evalListener = (listener, action, isEvent, elem, glob) =>
  runInContext('listener', {
    functionString: listener,
    action,
    isEvent,
    elem,
    glob,
  });

export default runInContext;
