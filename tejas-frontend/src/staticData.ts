export const orderPlanData = [
  { srNo: "01", heatId: "HT1001", sequenceId: "SQ-201", grade: "Medium Grade", quantity: 1200 },
  { srNo: "02", heatId: "HT1002", sequenceId: "SQ-202", grade: "High Grade", quantity: 200 },
  { srNo: "03", heatId: "HT1003", sequenceId: "SQ-203", grade: "Semi Medium Grade", quantity: 120 },
  { srNo: "04", heatId: "HT1004", sequenceId: "SQ-204", grade: "Medium Grade", quantity: 1780 },
  { srNo: "05", heatId: "HT1005", sequenceId: "SQ-205", grade: "Medium Grade", quantity: 450 },
  { srNo: "06", heatId: "HT1006", sequenceId: "SQ-206", grade: "Semi Medium Grade", quantity: 1000 },
  { srNo: "07", heatId: "HT1007", sequenceId: "SQ-207", grade: "High Grade", quantity: 2011 },
  { srNo: "08", heatId: "HT1008", sequenceId: "SQ-208", grade: "Medium Grade", quantity: 2341 },
  { srNo: "09", heatId: "HT1009", sequenceId: "SQ-209", grade: "High Grade", quantity: 1324 },
  { srNo: "10", heatId: "HT1010", sequenceId: "SQ-210", grade: "High Grade", quantity: 1002 },
];

export const scrapAvailabilityData = [
  { srNo: "01", scrapType: "Type-01", scrapName: "Scrap-101", costPerMT: 22000, availabilityMT: 1200, fe: 96, c: 0.25, mn: 0.45, si: 0.15, p: 0.08 },
  { srNo: "02", scrapType: "Type-01", scrapName: "Scrap-101", costPerMT: 22000, availabilityMT: 200, fe: 96, c: 0.25, mn: 0.45, si: 0.15, p: 0.08 },
  { srNo: "03", scrapType: "Type-01", scrapName: "Scrap-101", costPerMT: 22000, availabilityMT: 120, fe: 96, c: 0.25, mn: 0.45, si: 0.15, p: 0.08 },
  { srNo: "04", scrapType: "Type-01", scrapName: "Scrap-101", costPerMT: 22000, availabilityMT: 1780, fe: 96, c: 0.25, mn: 0.45, si: 0.15, p: 0.08 },
  { srNo: "05", scrapType: "Type-01", scrapName: "Scrap-101", costPerMT: 22000, availabilityMT: 450, fe: 96, c: 0.25, mn: 0.45, si: 0.15, p: 0.08 },
  { srNo: "06", scrapType: "Type-01", scrapName: "Scrap-101", costPerMT: 22000, availabilityMT: 1000, fe: 96, c: 0.25, mn: 0.45, si: 0.15, p: 0.08 },
  { srNo: "07", scrapType: "Type-01", scrapName: "Scrap-101", costPerMT: 22000, availabilityMT: 2011, fe: 96, c: 0.25, mn: 0.45, si: 0.15, p: 0.08 },
  { srNo: "08", scrapType: "Type-01", scrapName: "Scrap-101", costPerMT: 22000, availabilityMT: 2341, fe: 96, c: 0.25, mn: 0.45, si: 0.15, p: 0.08 },
  { srNo: "09", scrapType: "Type-01", scrapName: "Scrap-101", costPerMT: 22000, availabilityMT: 1324, fe: 96, c: 0.25, mn: 0.45, si: 0.15, p: 0.08 },
  { srNo: "10", scrapType: "Type-01", scrapName: "Scrap-101", costPerMT: 22000, availabilityMT: 1002, fe: 96, c: 0.25, mn: 0.45, si: 0.15, p: 0.08 },
];

export const chemistryData = [
  {
    srNo: "01",
    elements: "Fe",
    openingChemistry: "61.25",
    target: { min: "60.00", max: "62.50" },
    predictedChemistry: "61.65",
    actualChemistry: "61.40",
  },
  {
    srNo: "02",
    elements: "SiO2",
    openingChemistry: "4.10",
    target: { min: "3.80", max: "4.50" },
    predictedChemistry: "4.15",
    actualChemistry: "4.12",
  },
  {
    srNo: "03",
    elements: "Al2O3",
    openingChemistry: "2.25",
    target: { min: "2.00", max: "2.50" },
    predictedChemistry: "2.28",
    actualChemistry: "2.26",
  },
  {
    srNo: "04",
    elements: "Mn",
    openingChemistry: "0.55",
    target: { min: "0.45", max: "0.70" },
    predictedChemistry: "0.58",
    actualChemistry: "0.57",
  },
  {
    srNo: "05",
    elements: "P",
    openingChemistry: "0.04",
    target: { min: "0.02", max: "0.06" },
    predictedChemistry: "0.04",
    actualChemistry: "0.04",
  },
  {
    srNo: "06",
    elements: "S",
    openingChemistry: "0.03",
    target: { min: "0.01", max: "0.05" },
    predictedChemistry: "0.03",
    actualChemistry: "0.02",
  },
  {
    srNo: "07",
    elements: "MgO",
    openingChemistry: "1.10",
    target: { min: "0.90", max: "1.30" },
    predictedChemistry: "1.12",
    actualChemistry: "1.11",
  },
  {
    srNo: "08",
    elements: "CaO",
    openingChemistry: "1.85",
    target: { min: "1.50", max: "2.00" },
    predictedChemistry: "1.88",
    actualChemistry: "1.86",
  }
];

export const scrapTableData = [
  {
    scrapType: "Type-01",
    modelSuggested: "1200",
    operatorAdditions: "1200",
  },
  {
    scrapType: "Type-02",
    modelSuggested: "1200",
    operatorAdditions: "1200",
  },
  {
    scrapType: "Type-03",
    modelSuggested: "1200",
    operatorAdditions: "1200",
  },
  {
    scrapType: "Type-04",
    modelSuggested: "1200",
    operatorAdditions: "1200",
  },
  {
    scrapType: "Type-05",
    modelSuggested: "1200",
    operatorAdditions: "1200",
  },
  {
    scrapType: "Type-06",
    modelSuggested: "1200",
    operatorAdditions: "1200",
  },
  {
    scrapType: "Type-07",
    modelSuggested: "1200",
    operatorAdditions: "1200",
  },
  {
    scrapType: "Type-08",
    modelSuggested: "1200",
    operatorAdditions: "1200",
  },
  {
    scrapType: "Type-09",
    modelSuggested: "1200",
    operatorAdditions: "1200",
  }
];