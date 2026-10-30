// Abre um PDF (ou imagem) numa nova aba: o navegador o exibe no próprio visualizador (ler, ampliar,
// baixar, imprimir). false quando o navegador bloqueou a nova aba.

// Rota do BFF na mesma origem do front: o cookie de sessão segue junto.
export const openPdfTab = (path: string): boolean => {
  const tab = window.open(path, '_blank');

  if (!tab) {
    return false;
  }

  // A nova aba não precisa de acesso a esta.
  tab.opener = null;

  return true;
};

// Endereço obtido depois (ex.: URL assinada do bucket): a aba abre já no clique, para o navegador
// não bloqueá-la, e recebe o endereço quando ele chega. Em caso de falha, a aba é fechada.
export const openPdfTabFrom = async (loadUrl: () => Promise<string>): Promise<boolean> => {
  const tab = window.open('about:blank', '_blank');

  if (!tab) {
    return false;
  }

  try {
    const url = await loadUrl();

    tab.opener = null;

    tab.location.replace(url);

    return true;
  } catch (error) {
    tab.close();

    throw error;
  }
};
