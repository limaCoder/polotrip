function convertDMSToDD(dms: number[], ref: string | undefined) {
  const degrees = dms[0];
  const minutes = dms[1] / 60;
  const seconds = dms[2] / 3600;

  let decimalDegrees = degrees + minutes + seconds;

  // If the reference is south (S) or west (W), the value must be negative
  if (ref === 'S' || ref === 'W') {
    decimalDegrees = -decimalDegrees;
  }

  return decimalDegrees;
}

export { convertDMSToDD };
