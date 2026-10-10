const validator = require("./validator");

function validateEvaluationInput(input) {
    const { id_usuario, momento, puntuacion, puntuacion_maxima, instrumento, duracion_segundos, intentos } = input;
    const score = Number(puntuacion);
    const maximumScore = Number(puntuacion_maxima);
    const duration = duracion_segundos === undefined || duracion_segundos === null ? null : Number(duracion_segundos);
    const attempts = intentos === undefined || intentos === null ? 1 : Number(intentos);
    const evaluationInstrument = instrumento?.trim() || "Evaluación de programación";
    const validNumbers = [score, maximumScore, duration, attempts].every((value) => value === null || Number.isFinite(value));
    const valid = validator.validateUUID(id_usuario).ok && ["pretest", "postest"].includes(momento) && Number.isFinite(score) && Number.isFinite(maximumScore) && maximumScore > 0 && score >= 0 && score <= maximumScore && evaluationInstrument.length <= 120 && validNumbers && (duration === null || (duration >= 0 && Number.isInteger(duration))) && Number.isInteger(attempts) && attempts >= 1;
    return { valid, data: { id_usuario, momento, puntuacion: score, puntuacion_maxima: maximumScore, instrumento: evaluationInstrument, duracion_segundos: duration, intentos: attempts } };
}

module.exports = { validateEvaluationInput };
