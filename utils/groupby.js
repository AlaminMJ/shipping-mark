function groupBy(data, groupBy, calculationOptions) {
  const groupedData = data.reduce((result, item) => {
    // Create a composite key based on multiple fields
    const key = groupBy.map((field) => item[field]).join("|"); // Concatenate field values with '|' separator

    // Initialize if the group doesn't exist
    if (!result[key]) {
      result[key] = { items: [], sums: {} };
    }

    // Add the current item to the group
    result[key].items.push(item);

    // Perform the dynamic calculations (e.g., summing fields)
    if (calculationOptions && calculationOptions.sumFields) {
      calculationOptions.sumFields.forEach((field) => {
        const value = parseFloat(item[field]);
        if (!isNaN(value)) {
          if (!result[key].sums[field]) {
            result[key].sums[field] = 0;
          }
          result[key].sums[field] += value;
        }
      });
    }

    return result;
  }, {});

  // Convert grouped data into an array of objects
  return Object.keys(groupedData).map((key) => ({
    key,
    items: groupedData[key].items,
    sums: groupedData[key].sums,
  }));
}

// const groupByFields = ["CartonNo"];
// const calculationOptions = {
//   sumFields: ["TTL", "GrossWeight", "NetWeight"],
// };
// //   const data = groupBy(Data, groupByFields, calculationOptions);

export default groupBy;
