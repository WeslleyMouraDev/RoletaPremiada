import { useState, useCallback } from 'react';
import { toPng, toBlob } from 'html-to-image';

export function usePngExport() {
  const [isExporting, setIsExporting] = useState(false);

  const getPngBlob = useCallback(async (elementRef: HTMLElement): Promise<Blob> => {
    const blob = await toBlob(elementRef, {
      width: 1080,
      height: 1920,
      pixelRatio: 1,
      backgroundColor: '#0B0F1A',
    });
    if (!blob) {
      throw new Error('Falha ao gerar o blob da imagem PNG.');
    }
    return blob;
  }, []);

  const exportPng = useCallback(async (elementRef: HTMLElement, filename = 'roleta-premiada-hunter.png') => {
    setIsExporting(true);
    try {
      const dataUrl = await toPng(elementRef, {
        width: 1080,
        height: 1920,
        pixelRatio: 1,
        backgroundColor: '#0B0F1A',
      });
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = filename;
      a.click();
    } catch (error) {
      console.error('Export PNG error:', error);
    } finally {
      setIsExporting(false);
    }
  }, []);

  return { exportPng, getPngBlob, isExporting };
}
