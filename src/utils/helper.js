const MaskCharacter = (str, mask, n = 1) => {
  return ("" + str).slice(0, -n).replace(/./g, mask) + ("" + str).slice(-n);
};
const ordinal_suffix_of = (i) => {
  var j = i % 10,
    k = i % 100;
  if (j === 1 && k !== 11) {
    return i + "st";
  }
  if (j === 2 && k !== 12) {
    return i + "nd";
  }
  if (j === 3 && k !== 13) {
    return i + "rd";
  }
  return i + "th";
};
const formatPhoneNumber = (value) => {
  if (!value) return value;

  const phoneNumber = value.replace(/[^\d]/g, "");

  const phoneNumberLength = phoneNumber.length;

  if (phoneNumberLength < 4) return phoneNumber;

  if (phoneNumberLength < 7) {
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
  }

  return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(
    3,
    6
  )}-${phoneNumber.slice(6, 10)}`;
};
function formatSSN(value) {
  if (!value) return value;

  const ssn = value.replace(/[^\d]/g, "");

  const ssnLength = ssn.length;

  if (ssnLength < 4) return ssn;

  if (ssnLength < 6) {
    return `${ssn.slice(0, 3)}-${ssn.slice(3)}`;
  }

  return `${ssn.slice(0, 3)}-${ssn.slice(3, 5)}-${ssn.slice(5, 9)}`;
}
function formatEIN(value) {
  if (!value) return value;

  const ein = value.replace(/[^\d]/g, "");

  const einLength = ein.length;

  if (einLength < 4) return ein;
  if (einLength < 10) {
    return `${ein.slice(0, 2)}-${ein.slice(2, 9)}`;
  }
  return `${ein.slice(0, 2)}-${ein.slice(2, 9)}`;
}
export {
  MaskCharacter,
  ordinal_suffix_of,
  formatPhoneNumber,
  formatSSN,
  formatEIN,
};
