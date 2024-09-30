export const handleError = (error: unknown) => {
  console.error("Handling error:", error); // Log do erro antes de processá-lo

  if (error instanceof Error) {
    console.error(error.stack || error.message);
    throw new Error(`Error: ${error.message || 'Erro desconhecido'}`); // Adicionada uma mensagem padrão
  } else if (typeof error === "string") {
    console.error(error);
    throw new Error(`Error: ${error}`);
  } else {
    console.error(JSON.stringify(error, null, 2)); // Log mais legível de erros desconhecidos
    throw new Error(`Unknown error: ${JSON.stringify(error)}`);
  }
};


export const resizeBase64Img = async (
  base64Str: string,
  maxWidth = 100,
  maxHeight = 100,
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = base64Str;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      let width = img.width;
      let height = img.height;

      // Calcular a proporção e ajustar a largura/altura
      if (width > height) {
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      // Definir as dimensões do canvas
      canvas.width = width;
      canvas.height = height;

      // Desenhar a imagem no canvas
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Falha ao obter o contexto do canvas"));
        return;
      }
      ctx.drawImage(img, 0, 0, width, height);

      // Converter o canvas de volta para base64 no formato JPEG
      const newBase64Str = canvas.toDataURL("image/jpeg", 0.7);
      resolve(newBase64Str);
    };

    img.onerror = () => {
      reject(new Error("Falha ao carregar a imagem"));
    };
  });
};

