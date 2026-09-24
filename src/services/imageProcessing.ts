/**
 * Utilitários de processamento de imagem no cliente (Canvas API)
 * Reduz latência de envio e gera mapas de valores tonais no dispositivo.
 */

export async function compressArtworkImage(file: File, maxDimension = 1600, quality = 0.85): Promise<{ dataUrl: string; width: number; height: number; originalSizeBytes: number; compressedSizeBytes: number }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context could not be created'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        const compressedSizeBytes = Math.round((dataUrl.length * 3) / 4);

        resolve({
          dataUrl,
          width,
          height,
          originalSizeBytes: file.size,
          compressedSizeBytes,
        });
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Gera um mapa de valores tonais (posterização em 5 passos)
 * Técnica fundamental para artistas avaliarem chiaroscuro e hierarquia de sombras
 */
export async function generateValueStudyMap(imageUrl: string): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(imageUrl);
        return;
      }

      // Dimensão otimizada para o mapa
      const w = Math.min(img.width, 1000);
      const h = Math.round((img.height * w) / img.width);
      canvas.width = w;
      canvas.height = h;

      ctx.drawImage(img, 0, 0, w, h);
      const imgData = ctx.getImageData(0, 0, w, h);
      const data = imgData.data;

      // 5 degraus de valor tonal:
      // 0: Sombra oclusiva (20)
      // 1: Sombra própria (75)
      // 2: Meio-tom médio (135)
      // 3: Meio-tom claro (190)
      // 4: Brilho/Luz direta (245)
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        // Luminância perceptual
        const lum = 0.299 * r + 0.587 * g + 0.114 * b;

        let posterized = 135;
        if (lum < 50) {
          posterized = 25;
        } else if (lum < 110) {
          posterized = 80;
        } else if (lum < 165) {
          posterized = 140;
        } else if (lum < 215) {
          posterized = 195;
        } else {
          posterized = 248;
        }

        data[i] = posterized;
        data[i + 1] = posterized;
        data[i + 2] = posterized;
      }

      ctx.putImageData(imgData, 0, 0);

      // Adiciona sutil legenda técnica no rodapé
      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.fillRect(10, h - 30, 220, 20);
      ctx.fillStyle = '#ffffff';
      ctx.font = '10px monospace';
      ctx.fillText('ESTUDO DE 5 VALORES TONAIS', 16, h - 16);

      resolve(canvas.toDataURL('image/jpeg', 0.85));
    };

    img.onerror = () => resolve(imageUrl);
    img.src = imageUrl;
  });
}

/**
 * Gera um overlay de eixos estruturais e linhas de alinhamento
 */
export async function generateStructuralOverlay(imageUrl: string): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(imageUrl);
        return;
      }

      const w = Math.min(img.width, 1000);
      const h = Math.round((img.height * w) / img.width);
      canvas.width = w;
      canvas.height = h;

      // Desenha imagem com sutil atenuação
      ctx.drawImage(img, 0, 0, w, h);
      ctx.fillStyle = 'rgba(15, 23, 42, 0.35)';
      ctx.fillRect(0, 0, w, h);

      // Linhas estruturais de grid e proporção áurea / terços
      ctx.strokeStyle = '#ef4444'; // Redline clássico
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);

      // Eixo central de equilíbrio
      ctx.beginPath();
      ctx.moveTo(w * 0.5, 0);
      ctx.lineTo(w * 0.5, h);
      ctx.stroke();

      // Linha dos olhos / horizonte aproximado
      ctx.strokeStyle = '#06b6d4'; // Ciano para horizonte
      ctx.beginPath();
      ctx.moveTo(0, h * 0.38);
      ctx.lineTo(w, h * 0.38);
      ctx.stroke();

      // Linha do queixo / base estrutural
      ctx.beginPath();
      ctx.moveTo(0, h * 0.62);
      ctx.lineTo(w, h * 0.62);
      ctx.stroke();

      // Guias de perspectiva em convergência
      ctx.setLineDash([]);
      ctx.strokeStyle = '#eab308'; // Amarelo para convergência
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, h * 0.8);
      ctx.lineTo(w * 0.5, h * 0.38);
      ctx.lineTo(w, h * 0.8);
      ctx.stroke();

      // Marca d'água técnica
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(10, 10, 240, 24);
      ctx.fillStyle = '#38bdf8';
      ctx.font = '11px monospace';
      ctx.fillText('OVERLAY ESTRUTURAL & HORIZONTE', 16, 26);

      resolve(canvas.toDataURL('image/jpeg', 0.85));
    };

    img.onerror = () => resolve(imageUrl);
    img.src = imageUrl;
  });
}
