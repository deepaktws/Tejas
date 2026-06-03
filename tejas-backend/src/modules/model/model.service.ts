export class ModelService {
  runModel(): string {
    return [
      "id,name,value",
      "1,Iron,100",
      "2,Steel,200",
      "3,Aluminium,300",
    ].join("\n");
  }
}