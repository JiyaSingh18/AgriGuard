import React, { useState, useEffect } from 'react';
import { 
  Plus, Trash2, Download, Filter, Search, 
  Calendar, DollarSign, Tag, FileText,
  BarChart2, PieChart, TrendingUp, TrendingDown
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { themes } from '../utils/themes';

interface Expense {
  id: string;
  date: Date;
  amount: number;
  category: string;
  description: string;
  type: 'income' | 'expense';
}

const categories = [
  'Seeds',
  'Fertilizers',
  'Pesticides',
  'Equipment',
  'Labor',
  'Irrigation',
  'Transport',
  'Miscellaneous'
];

const ExpenseTracker: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const saved = localStorage.getItem('expenses');
    return saved ? JSON.parse(saved).map((e: any) => ({
      ...e,
      date: new Date(e.date)
    })) : [];
  });
  
  const [newExpense, setNewExpense] = useState<Partial<Expense>>({
    date: new Date(),
    amount: 0,
    category: categories[0],
    description: '',
    type: 'expense'
  });
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [dateRange, setDateRange] = useState<{ start: Date | null; end: Date | null }>({
    start: null,
    end: null
  });
  const [showReport, setShowReport] = useState(false);

  // Save expenses to localStorage
  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses]);

  const handleAddExpense = () => {
    if (!newExpense.amount || !newExpense.category || !newExpense.description) {
      toast.error('Please fill all required fields');
      return;
    }

    const expense: Expense = {
      id: Date.now().toString(),
      date: newExpense.date || new Date(),
      amount: newExpense.amount,
      category: newExpense.category,
      description: newExpense.description,
      type: newExpense.type || 'expense'
    };

    setExpenses(prev => [...prev, expense]);
    setNewExpense({
      date: new Date(),
      amount: 0,
      category: categories[0],
      description: '',
      type: 'expense'
    });
    toast.success('Expense added successfully');
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(expense => expense.id !== id));
    toast.success('Expense deleted successfully');
  };

  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = expense.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         expense.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || expense.category === selectedCategory;
    const matchesDate = (!dateRange.start || expense.date >= dateRange.start) &&
                       (!dateRange.end || expense.date <= dateRange.end);
    return matchesSearch && matchesCategory && matchesDate;
  });

  const calculateTotals = () => {
    const income = filteredExpenses
      .filter(e => e.type === 'income')
      .reduce((sum, e) => sum + e.amount, 0);
    const expenses = filteredExpenses
      .filter(e => e.type === 'expense')
      .reduce((sum, e) => sum + e.amount, 0);
    return {
      income,
      expenses,
      balance: income - expenses
    };
  };

  const generateReport = () => {
    const totals = calculateTotals();
    const categoryBreakdown = categories.map(category => ({
      category,
      amount: filteredExpenses
        .filter(e => e.category === category)
        .reduce((sum, e) => sum + e.amount, 0)
    }));

    return {
      totals,
      categoryBreakdown,
      transactions: filteredExpenses
    };
  };

  const exportToCSV = () => {
    const report = generateReport();
    const headers = ['Date', 'Type', 'Category', 'Description', 'Amount'];
    const rows = report.transactions.map(expense => [
      expense.date.toLocaleDateString(),
      expense.type,
      expense.category,
      expense.description,
      expense.amount
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'expense-report.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatAmount = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  return (
    <div className="flex flex-col min-h-screen max-w-7xl mx-auto p-4 bg-gradient-to-br from-green-50 to-emerald-50">
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <h2 className="text-2xl font-bold text-green-800 mb-4">Expense Tracker</h2>
        
        {/* Add New Expense Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-green-600" />
            <input
              type="date"
              value={newExpense.date?.toISOString().split('T')[0]}
              onChange={(e) => setNewExpense({ ...newExpense, date: new Date(e.target.value) })}
              className="p-2 border rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-green-600 font-semibold text-xl">₹</span>
            <input
              type="number"
              placeholder="Amount"
              value={newExpense.amount || ''}
              onChange={(e) => setNewExpense({ ...newExpense, amount: parseFloat(e.target.value) })}
              className="p-2 border rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Tag className="w-5 h-5 text-green-600" />
            <select
              value={newExpense.category}
              onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
              className="p-2 border rounded-lg focus:ring-2 focus:ring-green-500"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-green-600" />
            <input
              type="text"
              placeholder="Description"
              value={newExpense.description}
              onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
              className="p-2 border rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>
          
          <button
            onClick={handleAddExpense}
            className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 flex items-center justify-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Add Expense</span>
          </button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="flex items-center space-x-2">
            <Search className="w-5 h-5 text-green-600" />
            <input
              type="text"
              placeholder="Search expenses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="p-2 border rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-green-600" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="p-2 border rounded-lg focus:ring-2 focus:ring-green-500"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-green-600" />
            <input
              type="date"
              value={dateRange.start?.toISOString().split('T')[0] || ''}
              onChange={(e) => setDateRange({ ...dateRange, start: new Date(e.target.value) })}
              className="p-2 border rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="Start Date"
            />
            <input
              type="date"
              value={dateRange.end?.toISOString().split('T')[0] || ''}
              onChange={(e) => setDateRange({ ...dateRange, end: new Date(e.target.value) })}
              className="p-2 border rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="End Date"
            />
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="text-green-800 font-semibold">Income</h3>
            <p className="text-2xl font-bold text-green-600">{formatAmount(calculateTotals().income)}</p>
          </div>
          
          <div className="bg-red-50 p-4 rounded-lg">
            <h3 className="text-red-800 font-semibold">Expenses</h3>
            <p className="text-2xl font-bold text-red-600">{formatAmount(calculateTotals().expenses)}</p>
          </div>
        </div>

        {/* Export Button */}
        <div className="flex justify-end mb-4">
          <button
            onClick={exportToCSV}
            className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 flex items-center space-x-2"
          >
            <Download className="w-5 h-5" />
            <span>Export to CSV</span>
          </button>
        </div>

        {/* Expenses Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg overflow-hidden">
            <thead className="bg-green-50">
              <tr>
                <th className="px-4 py-2 text-left">Date</th>
                <th className="px-4 py-2 text-left">Amount</th>
                <th className="px-4 py-2 text-left">Category</th>
                <th className="px-4 py-2 text-left">Description</th>
                <th className="px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredExpenses.map(expense => (
                <tr key={expense.id} className="border-t hover:bg-green-50">
                  <td className="px-4 py-2">{expense.date.toLocaleDateString()}</td>
                  <td className="px-4 py-2">{formatAmount(expense.amount)}</td>
                  <td className="px-4 py-2">{expense.category}</td>
                  <td className="px-4 py-2">{expense.description}</td>
                  <td className="px-4 py-2 text-center">
                    <button
                      onClick={() => handleDeleteExpense(expense.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ExpenseTracker; 