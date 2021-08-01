module.exports = {
	//---------------------------------------------------------------------
	// Action Name
	//
	// This is the name of the action displayed in the editor.
	//---------------------------------------------------------------------

	name: "Join Voice Channel",

	//---------------------------------------------------------------------
	// Action Section
	//
	// This is the section the action will fall into.
	//---------------------------------------------------------------------

	section: "Audio Control",

	//---------------------------------------------------------------------
	// Action Subtitle
	//
	// This function generates the subtitle displayed next to the name.
	//---------------------------------------------------------------------

	subtitle: function(data) {
		const channels = ["Command Author's Voice Ch.", "Mentioned User's Voice Ch.", "Default Voice Channel", "Temp Variable", "Server Variable", "Global Variable"];
		return `${channels[parseInt(data.channel)]}`;

	},

	//---------------------------------------------------------------------
	// Action Fields
	//
	// These are the fields for the action. These fields are customized
	// by creating elements with corresponding IDs in the HTML. These
	// are also the names of the fields stored in the action's JSON data.
	//---------------------------------------------------------------------

	fields: ["channel", "varName"],

	//---------------------------------------------------------------------
	// Command HTML
	//
	// This function returns a string containing the HTML used for
	// editting actions.
	//
	// The "isEvent" parameter will be true if this action is being used
	// for an event. Due to their nature, events lack certain information,
	// so edit the HTML to reflect this.
	//
	// The "data" parameter stores constants for select elements to use.
	// Each is an array: index 0 for commands, index 1 for events.
	// The names are: sendTargets, members, roles, channels,
	//                messages, servers, variables
	//---------------------------------------------------------------------

	html: function(isEvent, data) {
		return `
<div>
	<div style="float: left; width: 45%;">
		Voice Channel:<br>
		<select id="channel" class="round" onchange="glob.voiceChannelChange(this, 'varNameContainer')">
			${data.voiceChannels[isEvent ? 1 : 0]}
		</select>
	</div>
	<div id="varNameContainer" style="display: none; float: right; width: 50%;">
		Variable Name:<br>
		<input id="varName" class="round" type="text" list="variableList">
	</div>
</div>`;
	},

	//---------------------------------------------------------------------
	// Action Editor Init Code
	//
	// When the HTML is first applied to the action editor, this code
	// is also run. This helps add modifications or setup reactionary
	// functions for the DOM elements.
	//---------------------------------------------------------------------

	init: function() {
		const { glob, document } = this;

		glob.voiceChannelChange(document.getElementById("channel"), "varNameContainer");
	},

	//---------------------------------------------------------------------
	// Action Bot Function
	//
	// This is the function for the action within the Bot's Action class.
	// Keep in mind event calls won't have access to the "msg" parameter,
	// so be sure to provide checks for variable existance.
	//---------------------------------------------------------------------

	action: function(cache) {
		const data = cache.actions[cache.index];
		const Audio = this.getDBM().Audio;
		const type = parseInt(data.channel);
		const varName = this.evalMessage(data.varName, cache);
		const channel = this.getVoiceChannel(type, varName, cache);
		if(channel !== undefined) {
			Audio.connectToVoice(channel).then(() => this.callNextAction(cache));
		} else {
			this.callNextAction(cache);
		}
	},

	//---------------------------------------------------------------------
	// Requires Audio Libraries
	//
	// If 'true', this action requires audio libraries to run.
	//---------------------------------------------------------------------

	requiresAudioLibraries: true,

	//---------------------------------------------------------------------
	// Action Bot Mod
	//
	// Upon initialization of the bot, this code is run. Using the bot's
	// DBM namespace, one can add/modify existing functions if necessary.
	// In order to reduce conflictions between mods, be sure to alias
	// functions you wish to overwrite.
	//---------------------------------------------------------------------

	mod: function() {}
}; // End of module
