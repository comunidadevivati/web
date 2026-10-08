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

const tailwindPaletteColors =
  'white|black|slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose';

const tailwindColorUtilities =
  'bg|text|border(?:-[trblxyse])?|ring|ring-offset|outline|from|via|to|fill|stroke|shadow|inset-shadow|divide|decoration|accent|caret|placeholder';

const hardcodedColorPatterns = [
  /\[[^\]]*#[0-9a-f]{3,8}\b/i,
  /^#(?:[0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i,
  /(?<![a-z-])(?:rgba?|hsla?|hwb|oklch|oklab|lab|lch)\(/i,
  new RegExp(
    String.raw`(?:^|[\s:'"])(?:${tailwindColorUtilities})-(?:${tailwindPaletteColors})(?:-\d{2,3})?(?:\/[\d.]+)?(?=$|[\s'"\]])`,
  ),
];

const containsHardcodedColor = (value) => {
  return hardcodedColorPatterns.some((pattern) => pattern.test(value));
};

const noHardcodedColorsRule = {
  meta: {
    type: 'problem',
    messages: {
      hardcodedColor:
        'Não use cores fixas (hex, rgb/oklch, paleta padrão do Tailwind). Use tokens semânticos definidos em "src/index.css" (ex.: bg-header, text-primary-strong).',
    },
  },
  create(context) {
    return {
      Literal(node) {
        if (typeof node.value !== 'string' || node.parent?.type === 'ImportDeclaration') {
          return;
        }

        if (containsHardcodedColor(node.value)) {
          context.report({
            node,
            messageId: 'hardcodedColor',
          });
        }
      },
      TemplateElement(node) {
        if (containsHardcodedColor(node.value.raw)) {
          context.report({
            node,
            messageId: 'hardcodedColor',
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
    'no-hardcoded-colors': noHardcodedColorsRule,
    'no-native-jsx-elements': noNativeJsxElementsRule,
  },
};

export default plugin;
