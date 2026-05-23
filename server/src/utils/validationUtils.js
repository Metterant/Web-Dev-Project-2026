function isValidMySQLDate(dateString) {
  if (!dateString) return false;

  const regex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
  if (!regex.test(dateString)) return false;

  const date = new Date(dateString);
  const timestamp = date.getTime();

  if (typeof timestamp !== 'number' || Number.isNaN(timestamp)) return false;

  return date.toISOString().startsWith(dateString);
}

function isValidEmail(emailString) {
  if (!emailString) return false;

  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(emailString);
}

function isValidName(nameString) {
  if (!nameString) return false;
  
  const regex = /^[a-zA-Z]+$/;
  return regex.test(nameString);
}

function isValidStudentCode(codeString) {
  if (!codeString) return false;

  const regex = /^S[A-Z]*[0-9]{3,}$/; // Must start with 'S' followed by one or more characters and then at least 3 digits
  return regex.test(codeString);
}

function isValidInstructorCode(codeString) {
  const regex = /^I[A-Z]*[0-9]{3,}$/; // Must start with 'F' followed by one or more characters and then at least 3 digits
  return regex.test(codeString);
}

function isValidCourseCode(codeString) {
  if (!codeString) return false;
  
  const regex = /^[A-Z]+[0-9]+$/;
  return regex.test(codeString);
}

module.exports = { 
  isValidMySQLDate, 
  isValidEmail, 
  isValidName,
  isValidStudentCode,
  isValidInstructorCode,
  isValidCourseCode
};