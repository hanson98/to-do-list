export function getDate(){
  const options = {
    weekday: "long",
    day: "numeric",
    month: "short",
  };

  const today = new Date();
  return today.toLocaleDateString("en-US", options);
}
