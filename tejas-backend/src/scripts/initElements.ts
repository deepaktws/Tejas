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

  const filePath = rawPath
    .trim()
    .replace(/^["']|["']$/g, "");

  const workbook = XLSX.readFile(filePath);

  const sheet = workbook.Sheets[workbook.SheetNames[0]];

  const rows: Record<string, any>[] = XLSX.utils.sheet_to_json(sheet, {
    defval: null,
  });

  if (!rows.length) {
    throw new Error("No rows found in Excel");
  }

  const headers = Object.keys(rows[0]);

  const EXCLUDED_COLUMNS = new Set([
    "Grade",
    "Spec",

    "Ti/N",
    "CA/S",
    "Cu+Ni+Cr",
    "Cu+Ni+Cr+Mo",
    "V+Nb+Ti",
    "Al/N",

    "G101",
    "Spec CE Eq (IIW)",
    "Spec CE (AWS)",
    "Spec Pcm",
  ]);

  const elementColumns = headers.filter(
    (header) => !EXCLUDED_COLUMNS.has(header.trim())
  );

  console.log("\nDetected element columns:");
  console.log(elementColumns);

  const skippedColumns = headers.filter(
    (header) => EXCLUDED_COLUMNS.has(header.trim())
  );

  console.log("\nSkipped columns:");
  console.log(skippedColumns);

  const elementMap = new Map<string, number>();

  console.log("\nCreating elements...");

  for (const elementName of elementColumns) {
    const element = await prisma.element.upsert({
      where: {
        name: elementName.trim(),
      },
      update: {},
      create: {
        name: elementName.trim(),
      },
    });

    elementMap.set(elementName, element.id);
  }

  console.log(`Inserted/verified ${elementMap.size} elements`);

  const gradeNames = [
    ...new Set(
      rows
        .map((row) => String(row.Grade).trim())
        .filter(Boolean)
    ),
  ];

  console.log(`Found ${gradeNames.length} grades`);

  for (const gradeName of gradeNames) {
    const gradeRecord = await prisma.grade.upsert({
      where: {
        name: gradeName,
      },
      update: {},
      create: {
        name: gradeName,
      },
    });

    const gradeRows = rows.filter(
      (row) => String(row.Grade).trim() === gradeName
    );

    const minRow = gradeRows.find(
      (row) =>
        String(row.Spec ?? "")
          .trim()
          .toLowerCase() === "min"
    );

    const maxRow = gradeRows.find(
      (row) =>
        String(row.Spec ?? "")
          .trim()
          .toLowerCase() === "max"
    );

    if (!minRow && !maxRow) {
      console.warn(
        `Skipping grade ${gradeName}: no Min/Max rows found`
      );
      continue;
    }

    for (const elementName of elementColumns) {
      const minVal = minRow?.[elementName];
      const maxVal = maxRow?.[elementName];

      if (minVal == null && maxVal == null) {
        continue;
      }

      await prisma.grade_spec.upsert({
        where: {
          grade_id_element_id: {
            grade_id: gradeRecord.id,
            element_id: elementMap.get(elementName)!,
          },
        },
        update: {
          min_val:
            minVal != null ? Number(minVal) : null,
          max_val:
            maxVal != null ? Number(maxVal) : null,
        },
        create: {
          grade_id: gradeRecord.id,
          element_id: elementMap.get(elementName)!,
          min_val:
            minVal != null ? Number(minVal) : null,
          max_val:
            maxVal != null ? Number(maxVal) : null,
        },
      });
    }

    console.log(`Processed grade ${gradeName}`);
  }

  console.log("\nImport completed successfully.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    rl.close();
    await prisma.$disconnect();
  });