import { assertValidCurriculum } from "../../src/modules/curriculum/loader";

const documents = assertValidCurriculum();
const lessons = documents.reduce(
  (total, document) => total + document.modules.reduce((sum, module) => sum + module.lessons.length, 0),
  0,
);

console.log(`Curriculum valid: ${documents.length} localized weeks, ${lessons} localized lessons.`);
