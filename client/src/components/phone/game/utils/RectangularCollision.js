export function rectangularCollision({ rect1, rect2 }) {
    if (!rect1 || !rect2 || !rect1.attackBox || !rect2.position) {
      console.error("Invalid rectangles:", rect1, rect2);
      return false;
    }

    return (
      rect1.attackBox.position.x + rect1.attackBox.width >=
        rect2.position.x &&
      rect1.attackBox.position.x <= rect2.position.x + rect2.width &&
      rect1.attackBox.position.y + rect1.attackBox.height >=
        rect2.position.y &&
      rect1.attackBox.position.y <= rect2.position.y + rect2.height
    );
  }