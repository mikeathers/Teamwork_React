import values from "object.values";

 export const exportCSVFile = (items, fileTitle) => {


    if(!Object.values) {
        values.shim();
    }

    // Convert Object to JSON
    var jsonObject = JSON.parse(JSON.stringify(items));

    var csv = arrayToCSV(jsonObject);
    var parsedCsv = "\uFEFF" + csv;
    var exportedFilenmae = fileTitle + '.csv' || 'export.csv';

    var blob = new Blob([parsedCsv], { type: 'data:text/csv;charset=utf-8,%EF%BB%BF' });
    if (navigator.msSaveBlob) { // IE 10+
        navigator.msSaveBlob(blob, exportedFilenmae);
    } else {
        var link = document.createElement("a");
        if (link.download !== undefined) { // feature detection
            // Browsers that support HTML5 download attribute
            var url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", exportedFilenmae);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
}


function arrayToCSV(objArray) {
    const array = typeof objArray !== 'object' ? JSON.parse(JSON.stringify(objArray)) : objArray;
    let str = `${Object.keys(array[0]).map(prop => `"${prop}"`).join(",")} \r\n`;

    return array.reduce((str, next) => {
        str += `${Object.values(next).map(prop => `"${prop}"`).join(",")} \r\n`;
        return str;
       }, str);
}



