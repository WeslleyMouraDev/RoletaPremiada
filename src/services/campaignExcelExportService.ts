import ExcelJS from 'exceljs';
import type { CampaignState } from '../types/campaign';

export async function exportCampaignToExcel(state: CampaignState, campaignType: 'graduacao' | 'pos'): Promise<void> {
  const workbook = new ExcelJS.Workbook();
  const campaignLabel = campaignType === 'pos' ? 'Pós-Graduação' : 'Graduação';
  const worksheet = workbook.addWorksheet(`Premiação - ${campaignLabel}`);

  // Configuração de Colunas
  worksheet.columns = [
    { header: 'Posição', key: 'rank', width: 10 },
    { header: 'Consultor', key: 'name', width: 32 },
    { header: 'Matrículas (Giros Totais)', key: 'totalEnrollments', width: 26 },
    { header: 'Giros Efetuados', key: 'completedSpins', width: 18 },
    { header: 'Giros Pendentes', key: 'pendingSpins', width: 18 },
    { header: 'Total em Prêmios', key: 'totalPrize', width: 22 }
  ];

  // Ordena consultores pelo valor total de prêmios recebidos
  const ranking = [...state.consultants].sort((a, b) => b.totalPrizeAmount - a.totalPrizeAmount);

  // Adiciona título estilizado na linha 1
  worksheet.mergeCells('A1:F1');
  const titleRow = worksheet.getRow(1);
  titleRow.height = 40;
  const titleCell = titleRow.getCell(1);
  titleCell.value = `ROLETA PREMIADA HUNTER - ${campaignLabel.toUpperCase()}`;
  titleCell.font = { name: 'Arial', size: 16, bold: true, color: { argb: 'FFFFD166' } };
  titleCell.alignment = { vertical: 'middle', horizontal: 'center' };
  titleCell.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF0B0F1A' } // Dark Navy do projeto
  };

  // Informações adicionais na linha 2 e 3
  worksheet.mergeCells('A2:F2');
  const infoRow1 = worksheet.getRow(2);
  infoRow1.height = 20;
  const infoCell1 = infoRow1.getCell(1);
  infoCell1.value = `Verba Inicial: R$ ${state.initialBudget.toFixed(2)}  |  Saldo em Caixa: R$ ${state.availableBalance.toFixed(2)}  |  Total Pago: R$ ${state.totalPaidPrizes.toFixed(2)}`;
  infoCell1.font = { name: 'Arial', size: 10, bold: true, color: { argb: 'FF9CA3AF' } };
  infoCell1.alignment = { vertical: 'middle', horizontal: 'center' };
  infoCell1.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E2A36' } };

  // Linha vazia
  worksheet.getRow(3).height = 15;

  // Estilização do cabeçalho da tabela (linha 4)
  const headerRow = worksheet.getRow(4);
  headerRow.height = 28;
  headerRow.eachCell((cell) => {
    cell.font = { name: 'Arial', size: 11, bold: true, color: { argb: 'FFFFFFFF' } };
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF0B0F1A' } // Navy escuro
    };
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
    cell.border = {
      top: { style: 'thin', color: { argb: 'FF2A3B4C' } },
      left: { style: 'thin', color: { argb: 'FF2A3B4C' } },
      bottom: { style: 'medium', color: { argb: 'FFFFD166' } }, // Linha inferior dourada
      right: { style: 'thin', color: { argb: 'FF2A3B4C' } }
    };
  });

  // Adicionar dados dos participantes (iniciando na linha 5)
  ranking.forEach((consultant, index) => {
    const rowNum = 5 + index;
    const row = worksheet.getRow(rowNum);
    row.height = 24;

    row.getCell(1).value = index + 1; // Rank
    row.getCell(2).value = consultant.name;
    row.getCell(3).value = consultant.totalEnrollments;
    row.getCell(4).value = consultant.completedSpins;
    row.getCell(5).value = consultant.pendingSpins;
    row.getCell(6).value = consultant.totalPrizeAmount;

    // Alinhamentos e formatos
    row.getCell(1).alignment = { vertical: 'middle', horizontal: 'center' };
    row.getCell(2).alignment = { vertical: 'middle', horizontal: 'left' };
    row.getCell(3).alignment = { vertical: 'middle', horizontal: 'center' };
    row.getCell(4).alignment = { vertical: 'middle', horizontal: 'center' };
    row.getCell(5).alignment = { vertical: 'middle', horizontal: 'center' };
    row.getCell(6).alignment = { vertical: 'middle', horizontal: 'right' };
    
    // Formato monetário brasileiro
    row.getCell(6).numFmt = '"R$ "#,##0.00';

    // Zebra striping e fontes
    const isEven = index % 2 === 0;
    const bgArgb = isEven ? 'FFFFFFFF' : 'FFF9FAFB'; // Alterna branco e cinza muito claro

    row.eachCell((cell) => {
      cell.font = { name: 'Arial', size: 10, color: { argb: 'FF1E2A36' } };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bgArgb } };
      cell.border = {
        top: { style: 'thin', color: { argb: 'FFE5E7EB' } },
        left: { style: 'thin', color: { argb: 'FFE5E7EB' } },
        bottom: { style: 'thin', color: { argb: 'FFE5E7EB' } },
        right: { style: 'thin', color: { argb: 'FFE5E7EB' } }
      };
    });

    // Destaca primeiro lugar do ranking
    if (index === 0) {
      row.getCell(1).font = { name: 'Arial', size: 10, bold: true, color: { argb: 'FFD4A017' } };
      row.getCell(2).font = { name: 'Arial', size: 10, bold: true, color: { argb: 'FF0B0F1A' } };
    }
  });

  // Linha de Totais (ao final)
  const totalRowNum = 5 + ranking.length;
  const totalRow = worksheet.getRow(totalRowNum);
  totalRow.height = 26;

  totalRow.getCell(1).value = '';
  totalRow.getCell(2).value = 'TOTAL DISTRIBUÍDO';
  totalRow.getCell(3).value = ranking.reduce((acc, c) => acc + c.totalEnrollments, 0);
  totalRow.getCell(4).value = ranking.reduce((acc, c) => acc + c.completedSpins, 0);
  totalRow.getCell(5).value = ranking.reduce((acc, c) => acc + c.pendingSpins, 0);
  totalRow.getCell(6).value = ranking.reduce((acc, c) => acc + c.totalPrizeAmount, 0);

  totalRow.getCell(2).alignment = { vertical: 'middle', horizontal: 'right' };
  totalRow.getCell(3).alignment = { vertical: 'middle', horizontal: 'center' };
  totalRow.getCell(4).alignment = { vertical: 'middle', horizontal: 'center' };
  totalRow.getCell(5).alignment = { vertical: 'middle', horizontal: 'center' };
  totalRow.getCell(6).alignment = { vertical: 'middle', horizontal: 'right' };
  
  totalRow.getCell(6).numFmt = '"R$ "#,##0.00';

  totalRow.eachCell((cell) => {
    cell.font = { name: 'Arial', size: 10, bold: true, color: { argb: 'FF0B0F1A' } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFF3CD' } }; // Amarelo/Dourado pastel
    cell.border = {
      top: { style: 'medium', color: { argb: 'FFFFD166' } },
      left: { style: 'thin', color: { argb: 'FFFFD166' } },
      bottom: { style: 'medium', color: { argb: 'FFFFD166' } },
      right: { style: 'thin', color: { argb: 'FFFFD166' } }
    };
  });

  // Gera Buffer e dispara o Download
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = window.URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  const fileName = `premiacao-hunter-${campaignType}-${new Date().toISOString().split('T')[0]}.xlsx`;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}
