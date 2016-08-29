let k = 0;
function uuid() {
  return ++k;
}
export default function uniqRef() {
  return (uuid() + Math.random()).toString();
}
