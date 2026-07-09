import { useState, useCallback } from 'react';
import { toPng } from 'html-to-image';

export function usePngExport() {
  const [isExporting, setIsExporting] = useState(false);

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

  return { exportPng, isExporting };
}
