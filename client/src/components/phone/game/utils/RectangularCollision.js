export function rectangularCollision({ rect1, rect2 }) {
  // Assuming that rect1 can sometimes be a bomb without an attackBox
  const r1x = rect1.attackBox ? rect1.attackBox.position.x : rect1.position.x;
  const r1y = rect1.attackBox ? rect1.attackBox.position.y : rect1.position.y;
  const r1w = rect1.attackBox ? rect1.attackBox.width : rect1.width;
  const r1h = rect1.attackBox ? rect1.attackBox.height : rect1.height;

  if (!rect1 || !rect2 || !rect2.position) {
    console.error("Invalid rectangles:", rect1, rect2);
    return false;
  }

  return (
    r1x + r1w >= rect2.position.x &&
    r1x <= rect2.position.x + rect2.width &&
    r1y + r1h >= rect2.position.y &&
    r1y <= rect2.position.y + rect2.height
  );
}
