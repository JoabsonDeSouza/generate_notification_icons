import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { Sizes, densities } from '@/utils';
import { MutableRefObject } from 'react';

const sizes: Sizes = {
  normal: 96,
  small: 64
};

/**
 * Draw an image onto the canvas at the given dp size and scale, returning a PNG blob.
 */
async function createBlobFromImage(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  dpSize: number,
  scale: number
): Promise<Blob> {
  const px = Math.round(dpSize * scale);
  canvas.width = px;
  canvas.height = px;
  ctx.clearRect(0, 0, px, px);
  ctx.drawImage(image, 0, 0, px, px);
  const dataUrl = canvas.toDataURL('image/png');
  return fetch(dataUrl).then((res) => res.blob());
}

/**
 * Generate normal and small icons for a given density and add them to the Android folder.
 */
async function addDensityIcons(
  androidFolder: JSZip,
  density: string,
  scale: number,
  normalImage: HTMLImageElement,
  smallImage: HTMLImageElement,
  androidIconName: string,
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D
): Promise<void> {
  const densityFolder = androidFolder.folder(`drawable-${density}`);
  const normalBlob = await createBlobFromImage(canvas, ctx, normalImage, sizes.normal, scale);
  densityFolder?.file(`${androidIconName}.png`, normalBlob);
  const smallBlob = await createBlobFromImage(canvas, ctx, smallImage, sizes.small, scale);
  densityFolder?.file(`${androidIconName}_small.png`, smallBlob);
}

async function addDrawableIcon(
  androidFolder: JSZip,
  normalImage: HTMLImageElement,
  androidIconName: string,
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D
): Promise<void> {
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
  if (!ctx) return;
  const zip = new JSZip();

  const androidFolder = zip.folder('android');

   await addDrawableIcon(
      androidFolder!,
      normalImage,
      androidIconName,
      canvas,
      ctx
    );

  // Generate Android icons for each density
  for (const [density, scale] of Object.entries(densities)) {
    await addDensityIcons(
      androidFolder!,
      density,
      scale,
      normalImage,
      smallImage,
      androidIconName,
      canvas,
      ctx
    );
  }

  // Generate zip and trigger download
  zip.generateAsync({ type: 'blob' }).then((content) => {
    saveAs(content, `icons.zip`);
  });
};
