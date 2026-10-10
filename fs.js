export class TreeNode {
    constructor(name, isDir = false) {
        this.name = name;
        this.isDir = isDir;
        this.children = []
        this.parent = null
        this.content = null
    }

    addChild(childNode) {
        childNode.parent = this;
        this.children.push(childNode);
    }
}