//import 'better-log/install';

function log(source) {
  console.log(JSON.stringify(source, null, 2));
}

function getUnionName(node) {
  if(node.type === 'Identifier'){
    return node.name;
  } else if(node.type === 'CallExpression') { 
    return node.callee.name;
  } else {
    throw Error('unknown union node');
  }
}

function buildTypeDefinition(t, root, node) {
  if(node.type === 'BinaryExpression'){
    var left = buildTypeDefinition(t, root, node.left);
    return buildTypeDefinition(t, left, node.right);
  } else {
    return t.callExpression(
      t.memberExpression(
        root, 
        t.identifier("union")
      )
      , [t.stringLiteral(getUnionName(node)), ...(node.arguments || []) ]
    )
  }
}

function matchExpressionList(node) {
  if(node.type === 'BinaryExpression' && node.operator === '|'){
    return [ ...matchExpressionList(node.left), ...matchExpressionList(node.right) ]
  } else {
    return [ node ]
  }    
}

function getMatchExpression(t, node) {
  var body = t.blockStatement([ t.expressionStatement(node.right) ]);
  var args = (node.left.arguments||[])
              .filter(a => a.type === 'Identifier')
              .map(a => t.identifier(a.name));
  return t.functionExpression(undefined, args, body);
}

function getExpressionMatch(t, node) {
  if(node.type === 'Identifier' && node.name === '_') {
    //return esfun._
    return t.memberExpression(t.identifier('esfun'), t.identifier('_'));
  } else if(node.type === 'Identifier') {
    return t.identifier(node.name);
  } else if(node.type === 'CallExpression'){
    //test for all param.type === 'Identifier' 
    //todo: identifier could be known values, for now assume literals are params to then expression
    if(node.arguments === undefined || node.arguments.length == 0 || node.arguments.every(a => a.type === 'Identifier')){
      return t.identifier(node.callee.name);
    } else {
      return t.callExpression(t.identifier(node.callee.name), node.arguments);
    }
  }
}

export default function ({ types: t }) {

  return {
    visitor: { 
      BinaryExpression(path) {
        if (path.node.operator === "|") {
          if(path.parent.type === 'VariableDeclarator') {
            path.replaceWith(
              t.callExpression(
                t.memberExpression( 
                  buildTypeDefinition(t, t.identifier('esfun'), path.node),
                  t.identifier('create')
                ),
                []
              )
            );
          } else {
            var [ expressionToMatch, ...matchExpressions ] = matchExpressionList(path.node);
            //wrap expression in esfun
            var root = t.callExpression(
              t.identifier('esfun'),
              [ t.identifier(expressionToMatch.name) ]
            );
            //append matches
            var match = matchExpressions.reduce(function (prev, cur) { 
              return t.callExpression(
                t.memberExpression(
                  //left is expression to match, build right
                  prev,
                  t.identifier('when')
                ),
                [ getExpressionMatch(t, cur.left), getMatchExpression(t, cur) ]
              )
            }, root);
            //append final matc
            path.replaceWith(
              t.callExpression(
                t.memberExpression(match, t.identifier('match')),
                []
              )
            );
          }
        } else if(path.node.operator === '>>') {
          //use pipe
          path.replaceWith(
            t.callExpression(t.memberExpression(path.node.left, t.identifier("pipe")), [path.node.right])
          );
        }
      },
      Function(path) {
        if(path.node.type != 'FunctionDeclaration' && path.parent.type == 'VariableDeclarator') {
          path.replaceWith(
            t.callExpression(t.memberExpression(t.identifier("esfun"), t.identifier("curry")), [path.node])
          );
        }
      }
    }
  };
}