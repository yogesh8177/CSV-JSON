let fs = require('fs');

exports.parseCSV = (contents) => {
    let headerKeys,
        totalLines,
        missingValues,
        duplicateValues,
        duplicates,
        jsonObj;
    return new Promise((resolve, reject) => {
        try {
            let array = contents.split(/\n/);
            let headers = array.splice(0, 1)[0];
            console.log(headers);
            // remove headers, now array has only content
            let content = array;
           
            totalLines = content.length;
            headerKeys = headers.split(',');
            missingValues = {};
            duplicateValues = {};
            duplicates = {};
            jsonObj = {};
        console.log('heasers', headerKeys);
            headerKeys.forEach((header, index) => {
                header = header.replace(/^"(.*)"$/, '$1');
                jsonObj[header] = [];
                missingValues[header] = 0;
                duplicates[header] = {};

                for (let line = 0; line < totalLines; line++) {
    
                    let valueArray = content[line].split(',');
                    let value = valueArray[index] ? valueArray[index].replace(/^"(.*)"$/, '$1') : "";
                    jsonObj[header].push(value);
    
                    if (!value || value === "\"\"") {
                        missingValues[header]++;
                    }
                    if (!duplicateValues[value]) {
                        duplicateValues[value] = 1;
                    }
                    else {
                        duplicateValues[value]++;                      
                        duplicates[header][value] = duplicateValues[value];
                    }
                }
            });
            console.log('Headers', headerKeys);
            console.log('Parsed Object');
            console.log(jsonObj);
            var date = new Date();
            fs.writeFile(`Json-${date}.json`, JSON.stringify(jsonObj, 2)
            , (error) => {
                console.log(error);
                throw error;
            });

            fs.writeFile(`Duplicates-${date}.json`, JSON.stringify(duplicates, 2)
            , (error) => {
                console.log(error);
                throw error;
            })
        }
        catch (error) {
            return reject(error);
        }
        return resolve({ 
            json: jsonObj,
            totalLines: totalLines,
            headers: headerKeys,
            missingValues: missingValues,
            duplicateValues: duplicates
        });
    });
}