import { GradeSpecRepository } from "./gradespec.repository";

export class GradeSpecService {
  constructor(
    private readonly repository = new GradeSpecRepository()
  ) {}

  async getByHeatId(heatId: number) {
    const heat = await this.repository.findByHeatId(heatId);

    if (!heat) {
      throw new Error("HEAT_NOT_FOUND");
    }

    return {
      id: heat.id,
      heatId: heat.heat_id,
      grade: heat.grade.name,

      specs: heat.grade.grade_specs.map((spec) => ({
        element: spec.element.name,
        min: spec.min_val,
        max: spec.max_val,
        openingChemistry: null,
        predictedChemistry: null,
        actualChemistry: null,
      })),
    };
  }

  async getNextHeat(id: number) {
    const heat = await this.repository.findNextHeat(id);

    if (!heat) {
      throw new Error("NEXT_HEAT_NOT_FOUND");
    }

    return {
      id: heat.id,
      heatId: heat.heat_id,
    };
  }
}