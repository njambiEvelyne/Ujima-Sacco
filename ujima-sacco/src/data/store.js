// In-memory store using localStorage for persistence

const USERS_KEY = 'ujima_users';
const LOANS_KEY = 'ujima_loans';
const SESSION_KEY = 'ujima_session';

// Seed default admin
const seedAdmin = () => {
  const users = getUsers();
  if (!users.find(u => u.role === 'admin')) {
    users.push({
      id: 'admin-001',
      fullName: 'Admin User',
      email: 'admin@ujima.co.ke',
      password: 'Admin@1234',
      phone: '+254700000000',
      idNumber: 'ADM001',
      role: 'admin',
      createdAt: new Date().toISOString(),
      status: 'active',
      memberNumber: 'MEM-0001',
      savings: 250000,
    });
    saveUsers(users);
  }
};

export const getUsers = () => {
  try { return JSON.parse(localStorage.getItem(USERS_KEY)) || []; }
  catch { return []; }
};

export const saveUsers = (users) => localStorage.setItem(USERS_KEY, JSON.stringify(users));

export const getLoans = () => {
  try { return JSON.parse(localStorage.getItem(LOANS_KEY)) || []; }
  catch { return []; }
};

export const saveLoans = (loans) => localStorage.setItem(LOANS_KEY, JSON.stringify(loans));

export const getSession = () => {
  try { return JSON.parse(localStorage.getItem(SESSION_KEY)); }
  catch { return null; }
};

export const setSession = (user) => localStorage.setItem(SESSION_KEY, JSON.stringify(user));

export const clearSession = () => localStorage.removeItem(SESSION_KEY);

export const registerUser = (data) => {
  const users = getUsers();
  if (users.find(u => u.email === data.email)) {
    return { success: false, error: 'Email already registered.' };
  }
  if (users.find(u => u.idNumber === data.idNumber)) {
    return { success: false, error: 'ID number already registered.' };
  }
  const memberNumber = `MEM-${String(users.length + 2).padStart(4, '0')}`;
  const user = {
    id: `user-${Date.now()}`,
    ...data,
    role: 'member',
    status: 'active',
    createdAt: new Date().toISOString(),
    memberNumber,
    savings: 5000, // starter savings
  };
  users.push(user);
  saveUsers(users);
  return { success: true, user };
};

export const loginUser = (email, password) => {
  seedAdmin();
  const users = getUsers();
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) return { success: false, error: 'Invalid email or password.' };
  if (user.status === 'suspended') return { success: false, error: 'Account suspended. Contact admin.' };
  setSession(user);
  return { success: true, user };
};

export const applyLoan = (userId, data) => {
  const users = getUsers();
  const user = users.find(u => u.id === userId);
  const loans = getLoans();

  // Check active loans
  const activeLoan = loans.find(l => l.userId === userId && (l.status === 'pending' || l.status === 'approved'));
  if (activeLoan) return { success: false, error: 'You already have an active or pending loan.' };

  const loan = {
    id: `loan-${Date.now()}`,
    userId,
    memberName: user?.fullName,
    memberNumber: user?.memberNumber,
    email: user?.email,
    phone: user?.phone,
    amount: Number(data.amount),
    purpose: data.purpose,
    duration: Number(data.duration),
    interestRate: 12, // 12% p.a.
    monthlyPayment: calculateMonthlyPayment(Number(data.amount), 12, Number(data.duration)),
    status: 'pending',
    appliedAt: new Date().toISOString(),
    adminNote: '',
    paidAmount: 0,
  };

  loans.push(loan);
  saveLoans(loans);
  return { success: true, loan };
};

export const updateLoanStatus = (loanId, status, adminNote = '') => {
  const loans = getLoans();
  const idx = loans.findIndex(l => l.id === loanId);
  if (idx === -1) return { success: false };
  loans[idx].status = status;
  loans[idx].adminNote = adminNote;
  loans[idx].reviewedAt = new Date().toISOString();
  saveLoans(loans);
  return { success: true, loan: loans[idx] };
};

export const getUserLoans = (userId) => getLoans().filter(l => l.userId === userId);

const calculateMonthlyPayment = (principal, annualRate, months) => {
  const r = annualRate / 100 / 12;
  return Math.round((principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1));
};

export const formatKES = (amount) =>
  new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', maximumFractionDigits: 0 }).format(amount);

// Seed on import
seedAdmin();
