import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { Sizes, densities } from '@/utils';
import { MutableRefObject } from 'react';

const sizes: Sizes = {
  normal: 96,
  small: 64
};

interface IconData {
  size: string;
  filename: string;
}

export const generateIcons = async ({
  normalImage,
  smallImage,
  androidIconName,
  canvasRef,
}: {
  normalImage: HTMLImageElement | null;
  smallImage: HTMLImageElement | null;
  canvasRef: MutableRefObject<HTMLCanvasElement | null>;
  androidIconName: string;
}) => {
  if (!normalImage || !smallImage || !canvasRef.current) return;
  const canvas = canvasRef.current;
  const ctx = canvas.getContext('2d');
  const zip = new JSZip();

  // Pasta Android
  const androidFolder = zip.folder('android');

  // Objeto para armazenar os ícones
  const iconData: { [key: string]: IconData[] } = {};

  const drawableScale = densities.xxxhdpi;
  const drawableFolder = androidFolder?.folder('drawable');
  const width = Math.round(sizes.normal * drawableScale);
  const height = Math.round(sizes.normal * drawableScale);
  canvas.width = width;
  canvas.height = height;
  ctx?.clearRect(0, 0, width, height);
  ctx?.drawImage(normalImage, 0, 0, width, height);
  const dataUrl = canvas.toDataURL('image/png');
  const blob = await fetch(dataUrl).then((res) => res.blob());
  drawableFolder?.file(`${androidIconName}.png`, blob);
  drawableFolder?.file('icon.png', blob);
  
  // Gerar ícones Android (normal e small)
  for (const density in densities) {
    const scale = densities[density];
    const densityFolder = androidFolder?.folder(`drawable-${density}`);

    // Ícones normais (apenas redimensionar)
    const normalWidth = Math.round(sizes.normal * scale);
    const normalHeight = Math.round(sizes.normal * scale);
    canvas.width = normalWidth;
    canvas.height = normalHeight;
    ctx?.clearRect(0, 0, normalWidth, normalHeight);
    ctx?.drawImage(normalImage, 0, 0, normalWidth, normalHeight);
    const normalDataUrl = canvas.toDataURL('image/png');
    const normalBlob = await fetch(normalDataUrl).then((res) => res.blob());
    densityFolder?.file(`${androidIconName}.png`, normalBlob);

    // Armazenar dados do ícone
    if (!iconData[density]) iconData[density] = [];
    iconData[density].push({ size: `${normalWidth}x${normalHeight}`, filename: `${androidIconName}.png` });

    // Ícones small (carregar imagem small)
    const smallWidth = Math.round(sizes.small * scale);
    const smallHeight = Math.round(sizes.small * scale);
    canvas.width = smallWidth;
    canvas.height = smallHeight;
    ctx?.clearRect(0, 0, smallWidth, smallHeight);
    ctx?.drawImage(smallImage, 0, 0, smallWidth, smallHeight);
    const smallDataUrl = canvas.toDataURL('image/png');
    const smallBlob = await fetch(smallDataUrl).then((res) => res.blob());
    densityFolder?.file(`${androidIconName}_small.png`, smallBlob);

    // Armazenar dados do ícone small
    iconData[density].push({ size: `${smallWidth}x${smallHeight}`, filename: `${androidIconName}_small.png` });
  }

  // Gerar o arquivo zip e baixar
  zip.generateAsync({ type: 'blob' }).then((content) => {
    saveAs(content, `icons.zip`);
  });
};
