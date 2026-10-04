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

const noNativeJsxElementsRule = {
  meta: {
    type: 'problem',
    messages: {
      nativeElement:
        'Não use tags HTML nativas nesta camada. Use componentes de "@/components/ui" ou "@/components".',
    },
  },
  create(context) {
    return {
      JSXOpeningElement(node) {
        if (node.name.type !== 'JSXIdentifier') {
          return;
        }

        const elementName = node.name.name;

        if (elementName[0] !== elementName[0]?.toLowerCase()) {
          return;
        }

        context.report({
          node,
          messageId: 'nativeElement',
        });
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
    'no-native-jsx-elements': noNativeJsxElementsRule,
  },
};

export default plugin;
