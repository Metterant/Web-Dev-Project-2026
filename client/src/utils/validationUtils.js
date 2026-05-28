export function isValidMySQLDate(dateString) {
  if (!dateString) return false;

  const regex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
  if (!regex.test(dateString)) return false;

  const date = new Date(dateString);
  const timestamp = date.getTime();

  if (typeof timestamp !== 'number' || Number.isNaN(timestamp)) return false;

  return date.toISOString().startsWith(dateString);
}

export function isValidEmail(emailString) {
  if (!emailString) return false;

  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(emailString);
}

export function isValidName(nameString) {
  if (!nameString) return false;
  
  const regex = /^[a-zA-Z]+$/;
  return regex.test(nameString);
}

export function isValidStudentCode(codeString) {
  if (!codeString) return false;

  const regex = /^S[A-Z]*[0-9]{3,}$/;
  return regex.test(codeString);
}

export function isValidInstructorCode(codeString) {
  const regex = /^I[A-Z]*[0-9]{3,}$/;
  return regex.test(codeString);
}

export function isValidCourseCode(codeString) {
  if (!codeString) return false;
  
  const regex = /^[A-Z]+[0-9]+$/;
  return regex.test(codeString);
}

export function isValidSemesterCode(semCode) {
  if (!semCode) return false;

  const regex = /^\d{5}$/;
  return regex.test(semCode);
}

export function isValidPeriod(periodValue) {
  const period = Number(periodValue);
  return Number.isInteger(period) && period >= 0 && period <= 10;
}

export function isValidPeriodRange(startPeriod, endPeriod) {
  return isValidPeriod(startPeriod) && isValidPeriod(endPeriod) && Number(startPeriod) <= Number(endPeriod);
}

export default {
  isValidMySQLDate,
  isValidEmail,
  isValidName,
  isValidStudentCode,
  isValidInstructorCode,
  isValidCourseCode,
  isValidSemesterCode,
  isValidPeriod,
  isValidPeriodRange,
};
