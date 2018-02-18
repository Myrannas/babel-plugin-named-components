const t = require("babel-types");

module.exports = function () {
    return {
        name: 'named-components',
        visitor: {
            AssignmentExpression(path, state) {
                if (t.isMemberExpression(path.node.left)
                    && t.isIdentifier(path.node.left.object)
                    && path.node.left.object.name === 'exports'
                    && t.isIdentifier(path.node.left.property)
                    && path.node.left.property.name !== 'default'
                    && t.isArrowFunctionExpression(path.node.right)) {
                    let name = path.node.left.property.name;
                    if (path.scope.hasBinding(name)) {
                        name = path.scope.generateUidIdentifier(name);
                    } else {
                        name = t.identifier(name);
                    }

                    const componentCreation = t.variableDeclaration("const", [t.variableDeclarator(name, path.node.right)]);
                    const exportExpression = t.memberExpression(t.identifier("exports"), path.node.left.property);

                    path.replaceWithMultiple([
                        componentCreation,
                        t.expressionStatement(t.assignmentExpression("=", exportExpression, name))
                    ]);
                }
            }
        }
    };
};