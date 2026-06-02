import XLSX from "xlsx";
import * as readline from "readline";
import { prisma } from "../lib/prisma";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function ask(question: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
}

async function main() {
  const rawPath =
    process.argv[2] || (await ask("Excel file path: "));

  const filePath = rawPath.trim().replace(/^["']|["']$/g, "");

  const workbook = XLSX.readFile(filePath);

  const sheet = workbook.Sheets[workbook.SheetNames[0]];

  const rows: Record<string, any>[] = XLSX.utils.sheet_to_json(sheet, {
    defval: null,
  });

  for (const row of rows) {
    const heatId = Number(row.HeatID);

    const gradeName = String(row.GradeName).trim();

    const grade = await prisma.grade.findUnique({
      where: {
        name: gradeName,
      },
    });

    if (!grade) {
      console.warn(
        `Grade ${gradeName} not found. Skipping heat ${heatId}`
      );
      continue;
    }

    await prisma.heat.upsert({
      where: {
        heat_id: heatId,
      },
      update: {
        grade_id: grade.id,
      },
      create: {
        heat_id: heatId,
        grade_id: grade.id,
      },
    });
  }

  console.log("Heat import completed");
}

main()
  .catch(console.error)
  .finally(async () => {
    rl.close();
    await prisma.$disconnect();
  });