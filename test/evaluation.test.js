const assert = require("node:assert/strict");
const test = require("node:test");
const { validateEvaluationInput } = require("../src/utils/evaluationValidator");
const requirePermission = require("../src/middleware/requirePermission");

const userId = "550e8400-e29b-41d4-a716-446655440000";
const validInput = { id_usuario: userId, momento: "pretest", puntuacion: 0, puntuacion_maxima: 10 };

test("acepta puntuación cero y aplica valores opcionales por defecto", () => {
    const result = validateEvaluationInput(validInput);
    assert.equal(result.valid, true);
    assert.equal(result.data.instrumento, "Evaluación de programación");
    assert.equal(result.data.intentos, 1);
});

test("rechaza momento, UUID, rango e intentos inválidos", () => {
    assert.equal(validateEvaluationInput({ ...validInput, momento: "final" }).valid, false);
    assert.equal(validateEvaluationInput({ ...validInput, id_usuario: "invalid" }).valid, false);
    assert.equal(validateEvaluationInput({ ...validInput, puntuacion: 11 }).valid, false);
    assert.equal(validateEvaluationInput({ ...validInput, puntuacion_maxima: 0 }).valid, false);
    assert.equal(validateEvaluationInput({ ...validInput, intentos: 0 }).valid, false);
    assert.equal(validateEvaluationInput({ ...validInput, duracion_segundos: 1.5 }).valid, false);
});

test("requirePermission permite el permiso requerido y rechaza el faltante", () => {
    let nextCalled = false;
    const next = () => { nextCalled = true; };
    const response = { status: () => response, json: (body) => body };
    requirePermission("ver_metricas_evaluacion")({ user: { permisos: ["ver_metricas_evaluacion"] } }, response, next);
    assert.equal(nextCalled, true);
    const denied = requirePermission("crear_evaluaciones")({ user: { permisos: [] } }, response, () => {});
    assert.equal(denied.requiredPermission, "crear_evaluaciones");
});
