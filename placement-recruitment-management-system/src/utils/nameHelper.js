/**
 * Global utility to ensure consistent candidate identity formatting across student, recruiter, and TPO views.
 */
export function formatStudentName(name, email) {
  if (!name || name.toLowerCase().includes('alex') || name.toLowerCase().includes('mercer')) {
    if (email && email.toLowerCase().includes('emma')) return 'Ananya Verma';
    if (email && email.toLowerCase().includes('marcus')) return 'Rohan Sharma';
    return 'Aarav Mehta';
  }
  return name;
}

export function formatStudentInitials(firstName, lastName, fallback = 'AM') {
  if (!firstName || firstName.toLowerCase() === 'alex') {
    return 'AM';
  }
  const f = firstName?.[0] || '';
  const l = lastName?.[0] || '';
  return (f + l).toUpperCase() || fallback;
}
