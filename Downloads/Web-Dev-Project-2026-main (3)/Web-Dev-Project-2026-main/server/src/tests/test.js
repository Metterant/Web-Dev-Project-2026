const Student = require('#models/Student');
const dateUtils = require('#utils/validationUtils');

// console.log(Student);

// (async () => {
//     try {
//         const student = await Student.deleteById(3);
//         console.log(student);
//     } catch (err) {
//         console.error(err);
//     }
// })();

console.log(dateUtils.isValidMySQLDate("2006-04-03"));