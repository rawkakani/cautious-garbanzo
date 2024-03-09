import XLSX  from 'npm:xlsx';

const filePath = './EvaluationSample.xlsx';
const evaluateBids = (filePath) => {

  const busineses = []
  const criteria = [];
  const criteria_values = [];

  try {
    const workbook = XLSX.readFile(filePath);
    const rows = workbook.Sheets["Sheet 1"]
    for (const key in rows) {
      if(key.includes('1')){
        criteria.push(rows[key].w);  // Access key and value
      }

      if(key.includes('A')){
        busineses.push(rows[key].w)
      }


      if(!key.includes('1') && !key.includes('A')){
        criteria_values.push(rows[key].w)
      }

    }
  } catch (err) {
    console.error(err); // Handle potential errors during file reading
  }

  busineses.shift()

  criteria.shift()

  criteria_values.shift()
  criteria_values.pop()

  const assesment = busineses.map((value, business_key ) => {
    const number_of_criterias = criteria.length
    const name = value
    let lot;
    let date;
    let grade = 0;
    const raw_data = criteria.map((criteria_name,key) => {
      const criteria_index = number_of_criterias * business_key;
      const criteria_value = criteria_values[criteria_index + key]

      if(criteria_name.toLowerCase() === "lot"){
        lot = criteria_value
      }else if (criteria_name.toLowerCase() === "date"){
        date = criteria_value
      }else{
        grade += parseInt(criteria_value)
      }

      return {[criteria_name]:criteria_value}
    })

   return {name, grade,date, lot, raw_data}
  })


  return  assesment.sort((a, b) =>  b.grade - a.grade);
}

console.log(evaluateBids(filePath))
