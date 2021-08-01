export function deserialize(serializedJavascript) {
  return eval("(" + serializedJavascript + ")");
}
