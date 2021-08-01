const fieldSchema = {
  channel: [
    { name: "Same Channel", value: 0, variable: false },
    { name: "Command Author", value: 1, variable: false },
    { name: "Mentioned User", value: 2, variable: false },
    { name: "Mentioned Channel", value: 3, variable: false },
    { name: "Default Channel", value: 4, variable: false },
    { name: "Temp Variable", value: 5, variable: true },
    { name: "Server Variable", value: 6, variable: true },
    { name: "Global Variable", value: 7, variable: true },
  ],
};

export default fieldSchema;
