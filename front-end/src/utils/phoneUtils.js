// phoneUtils.js
export const isValidPhone = (phone) => {
  // E.164 format validation
  return /^\+[1-9]\d{1,14}$/.test(phone);
};

export const formatPhone = (phoneCode, localNumber) => {
  // Add null/undefined check
  if (!localNumber || !phoneCode) {
    return "";
  }

  // Remove all non-digit characters except leading "+"
  const cleaned = localNumber.replace(/[^\d+]/g, "");

  // ✅ 1. Already starts with '+213'
  if (cleaned.startsWith(`+${phoneCode}`)) {
    return cleaned;
  }

  // ✅ 2. Starts with '00' + phoneCode
  if (cleaned.startsWith(`00${phoneCode}`)) {
    return `+${cleaned.slice(2)}`; // remove '00' and prepend '+'
  }

  // ✅ 3. Starts with phoneCode without '+' (e.g., 213540016247)
  if (cleaned.startsWith(phoneCode)) {
    return `+${cleaned}`;
  }

  // ✅ 4. Starts with one or more leading zeroes
  const local = cleaned.replace(/^0+/, "");

  return `+${phoneCode}${local}`;
};
