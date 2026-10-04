const directExportRule = {
  meta: {
    type: 'suggestion',
    messages: {
      directExport:
        'Exporte diretamente na declaração. Use "export const", "export type", "export interface" ou equivalente.',
    },
  },
  create(context) {
    return {
      ExportNamedDeclaration(node) {
        if (node.declaration === null && node.source === null && node.specifiers.length > 0) {
          context.report({
            node,
            messageId: 'directExport',
          });
        }
      },
    };
  },
};

const plugin = {
  meta: {
    name: 'project',
  },
  rules: {
    'direct-export': directExportRule,
  },
};

export default plugin;
