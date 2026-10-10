export class TreeNode {
  constructor(name, isDir = false) {
    this.name = name;
    this.isDir = isDir;
    this.children = [];
    this.parent = null;
    this.content = null;
    this.isLocked = false;
  }

  addChild(childNode) {
    childNode.parent = this;
    this.children.push(childNode);
    return childNode;
  }

  getChild(name) {
    return this.children.find((child) => child.name === name) || null;
  }
}
