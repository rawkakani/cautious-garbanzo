import XLSX  from 'npm:xlsx';
const evaluateBids = (file) => {

  const evaluation_id = crypto.randomUUID()
  const busineses = []
  const criteria = [];
  const criteria_values = [];

  const reader = new FileReader();

    reader.onload = async (event) => {
      const binaryData = event.target.result;
      // console.log(binaryData); // This will be an ArrayBuffer containing the binary data

      try{
          const workbook = XLSX.read(binaryData, { type: 'array' })
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

        let organiseByLot =  assesment.reduce((acc, item) => {
            const category = item.lot;
            acc[category] = (acc[category] || []).concat(item);
            acc[category] = acc[category].sort((a, b) =>  b.grade - a.grade);
            return acc;
          }, {});


        const kv = await Deno.openKv();
        await kv.set(["evaluations", evaluation_id], organiseByLot);
    };

    reader.readAsArrayBuffer(file); // Read the file as an ArrayBuffer (binary data)

    return evaluation_id

}

export {evaluateBids};
