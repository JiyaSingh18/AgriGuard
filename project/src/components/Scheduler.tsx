import React, { useState, useEffect } from 'react';
import { format, addDays, isSameDay, parseISO, addMonths, subMonths, isToday, isPast, startOfMonth, endOfMonth, eachDayOfInterval, addWeeks, addYears } from 'date-fns';
import { 
  Calendar, CheckCircle, AlertCircle, Clock, ChevronLeft, ChevronRight, 
  Sun, Droplets, Sprout, CloudRain, Leaf, Clock4, Filter, Search, 
  PlusCircle, Trash2, Edit2, Bell, BellOff, CalendarCheck, CalendarX,
  BarChart2, TrendingUp, CloudSun, CloudMoon, Wind, Thermometer, Languages
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { themes } from '../utils/themes';

interface Task {
  id: string;
  title: string;
  date: Date;
  time: string;
  type: 'watering' | 'fertilizing' | 'pesticide' | 'harvest' | 'other';
  description: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  reminder: boolean;
  weather?: {
    temperature: number;
    condition: string;
    humidity: number;
  };
}

interface ScheduleRequest {
  taskType: Task['type'];
  frequency: 'daily' | 'weekly' | 'biweekly' | 'monthly';
  duration: {
    value: number;
    unit: 'days' | 'weeks' | 'months' | 'years';
  };
  startDate: Date;
  time: string;
  description: string;
  priority: Task['priority'];
}

const Scheduler: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const savedTasks = localStorage.getItem('scheduledTasks');
    if (savedTasks) {
      const parsedTasks = JSON.parse(savedTasks);
      return parsedTasks.map((task: any) => ({
        ...task,
        date: new Date(task.date)
      }));
    }
    return [];
  });
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [showWeather, setShowWeather] = useState(true);
  const [theme, setTheme] = useState<'light' | 'dark' | 'nature'>('nature');
  const [currentLanguage, setCurrentLanguage] = useState<'en' | 'hi'>(
    localStorage.getItem('language') as 'en' | 'hi' || 'hi'
  );
  const [newTask, setNewTask] = useState({
    title: '',
    type: 'watering' as const,
    description: '',
    priority: 'medium' as const,
    time: '09:00',
    reminder: true,
    frequency: 'weekly' as const,
    startDate: new Date()
  });

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('scheduledTasks', JSON.stringify(tasks));
  }, [tasks]);

  // Load theme preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | 'nature';
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  const toggleLanguage = () => {
    setCurrentLanguage(prev => {
      const newLanguage = prev === 'en' ? 'hi' : 'en';
      toast.success(newLanguage === 'hi' 
        ? "भाषा हिंदी में बदल गई है"
        : "Language switched to English");
      return newLanguage;
    });
  };

  const handleAddTask = () => {
    if (!newTask.title.trim()) return;

    const task: Task = {
      id: Date.now().toString(),
      ...newTask,
      date: selectedDate,
      completed: false,
      weather: {
        temperature: Math.floor(Math.random() * 30) + 10,
        condition: ['Sunny', 'Cloudy', 'Rainy', 'Partly Cloudy'][Math.floor(Math.random() * 4)],
        humidity: Math.floor(Math.random() * 50) + 30
      }
    };

    // If frequency is set to monthly, create tasks for the entire month
    if (newTask.frequency === 'monthly') {
      const startDate = new Date(newTask.startDate);
      const endOfMonth = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);
      const monthlyTasks: Task[] = [];

      for (let date = new Date(startDate); date <= endOfMonth; date.setDate(date.getDate() + 1)) {
        monthlyTasks.push({
          ...task,
          id: `${task.id}-${date.toISOString()}`,
          date: new Date(date)
        });
      }

      setTasks(prev => [...prev, ...monthlyTasks]);
      toast.success(currentLanguage === 'hi' 
        ? 'महीने के लिए कार्य अनुसूचित किए गए हैं'
        : 'Tasks scheduled for the month!');
    } else {
      setTasks(prev => [...prev, task]);
      toast.success(currentLanguage === 'hi' 
        ? 'कार्य जोड़ा गया'
        : 'Task added successfully!');
    }

    setNewTask({
      title: '',
      type: 'watering',
      description: '',
      priority: 'medium',
      time: '09:00',
      reminder: true,
      frequency: 'daily',
      startDate: new Date()
    });
  };

  const handleTaskComplete = (taskId: string) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
    toast.success('Task status updated!');
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
    toast.success('Task deleted!');
  };

  const handleToggleReminder = (taskId: string) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === taskId ? { ...task, reminder: !task.reminder } : task
      )
    );
    toast.success('Reminder status updated!');
  };

  const getTasksForDate = (date: Date) => {
    return tasks.filter(task => isSameDay(task.date, date));
  };

  const getTaskColor = (type: Task['type']) => {
    switch (type) {
      case 'watering':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'fertilizing':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pesticide':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'harvest':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTaskIcon = (type: Task['type']) => {
    switch (type) {
      case 'watering':
        return <Droplets className="w-4 h-4 text-blue-500 animate-bounce" />;
      case 'fertilizing':
        return <Sprout className="w-4 h-4 text-green-500 animate-pulse" />;
      case 'pesticide':
        return <CloudRain className="w-4 h-4 text-red-500 animate-pulse" />;
      case 'harvest':
        return <Sun className="w-4 h-4 text-yellow-500 animate-bounce" />;
      default:
        return <Leaf className="w-4 h-4 text-gray-500" />;
    }
  };

  const getPriorityIcon = (priority: Task['priority']) => {
    switch (priority) {
      case 'high':
        return <AlertCircle className="w-4 h-4 text-red-500 animate-pulse" />;
      case 'medium':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'low':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
    }
  };

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'sunny':
        return <Sun className="w-4 h-4 text-yellow-500" />;
      case 'cloudy':
        return <CloudMoon className="w-4 h-4 text-gray-500" />;
      case 'rainy':
        return <CloudRain className="w-4 h-4 text-blue-500" />;
      case 'partly cloudy':
        return <CloudSun className="w-4 h-4 text-gray-400" />;
      default:
        return <Wind className="w-4 h-4 text-gray-400" />;
    }
  };

  const filteredTasks = tasks
    .filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          task.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = filterType === 'all' || task.type === filterType;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const generateCalendarDays = () => {
    const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const endOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
    const startDay = startOfMonth.getDay();
    const daysInMonth = endOfMonth.getDate();
    
    const days = [];
    for (let i = 0; i < startDay; i++) {
      days.push(null);
    }
    
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i));
    }
    
    return days;
  };

  const scheduleTasks = (request: ScheduleRequest) => {
    const { taskType, frequency, duration, startDate, time, description, priority } = request;
    let endDate: Date;
    
    // For monthly tasks, always set end date to end of the month
    if (frequency === 'monthly') {
      endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);
    } else {
      switch (duration.unit) {
        case 'days':
          endDate = addDays(startDate, duration.value);
          break;
        case 'weeks':
          endDate = addWeeks(startDate, duration.value);
          break;
        case 'months':
          endDate = addMonths(startDate, duration.value);
          break;
        case 'years':
          endDate = addYears(startDate, duration.value);
          break;
        default:
          endDate = addMonths(startDate, 1);
      }
    }

    const allDays = eachDayOfInterval({ start: startDate, end: endDate });
    let daysToSchedule: Date[] = [];
    
    switch (frequency) {
      case 'daily':
        daysToSchedule = allDays;
        break;
      case 'weekly':
        daysToSchedule = allDays.filter(date => date.getDay() === startDate.getDay());
        break;
      case 'biweekly':
        daysToSchedule = allDays.filter((date, index) => index % 14 === 0);
        break;
      case 'monthly':
        // For monthly, include all days in the month
        daysToSchedule = allDays;
        break;
    }

    const newTasks = daysToSchedule.map(date => ({
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      title: newTask.title || `${taskType.charAt(0).toUpperCase() + taskType.slice(1)} Task`,
      date,
      time,
      type: taskType,
      description,
      completed: false,
      priority,
      reminder: true,
      weather: {
        temperature: Math.floor(Math.random() * 30) + 10,
        condition: ['Sunny', 'Cloudy', 'Rainy', 'Partly Cloudy'][Math.floor(Math.random() * 4)],
        humidity: Math.floor(Math.random() * 50) + 30
      }
    }));

    setTasks(prev => [...prev, ...newTasks]);
    toast.success(
      currentLanguage === 'hi' 
        ? `${newTasks.length} कार्य अनुसूचित किए गए (${format(startDate, 'dd/MM/yyyy')} से ${format(endDate, 'dd/MM/yyyy')} तक)`
        : `${newTasks.length} tasks scheduled (from ${format(startDate, 'MM/dd/yyyy')} to ${format(endDate, 'MM/dd/yyyy')})`
    );

    // Reset the form
    setNewTask({
      title: '',
      type: 'watering',
      description: '',
      priority: 'medium',
      time: '09:00',
      reminder: true,
      frequency: 'daily',
      startDate: new Date()
    });
  };

  // Function to handle chat-based scheduling
  const handleChatSchedule = (scheduleData: any) => {
    try {
      const request: ScheduleRequest = {
        taskType: scheduleData.type || 'watering',
        frequency: scheduleData.frequency || 'weekly',
        duration: {
          value: scheduleData.duration?.value || 1,
          unit: scheduleData.duration?.unit || 'months'
        },
        startDate: new Date(scheduleData.startDate || new Date()),
        time: scheduleData.time || '09:00',
        description: scheduleData.description || '',
        priority: scheduleData.priority || 'medium'
      };
      
      scheduleTasks(request);
    } catch (error) {
      toast.error(
        currentLanguage === 'hi'
          ? "अनुसूची बनाने में त्रुटि हुई"
          : "Error creating schedule"
      );
    }
  };

  return (
    <div className="flex flex-col min-h-screen max-w-7xl mx-auto p-4 bg-gradient-to-br from-green-50 to-emerald-50">
      <div className="flex items-center justify-between mb-6 p-4 rounded-2xl bg-green-50/80 backdrop-blur-sm shadow-lg">
        <h2 className="text-2xl font-bold text-green-800 flex items-center">
          <Calendar className="w-6 h-6 mr-2 text-green-600" />
          {currentLanguage === 'hi' ? 'कार्य अनुसूची' : 'Task Scheduler'}
        </h2>
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleLanguage}
            className="p-2 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-colors"
            title={currentLanguage === 'hi' ? "Switch to English" : "हिंदी में बदलें"}
          >
            <Languages className="w-5 h-5" />
          </button>
          <button
            onClick={() => setShowWeather(!showWeather)}
            className="p-2 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-colors"
          >
            {showWeather ? <CloudSun className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </button>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              placeholder={currentLanguage === 'hi' ? "खोजें..." : "Search..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-4 py-2 rounded-full bg-white border border-green-200 text-green-800 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 rounded-full bg-white border border-green-200 text-green-800 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="all">{currentLanguage === 'hi' ? "सभी" : "All"}</option>
              <option value="watering">{currentLanguage === 'hi' ? "पानी देना" : "Watering"}</option>
              <option value="fertilizing">{currentLanguage === 'hi' ? "खाद डालना" : "Fertilizing"}</option>
              <option value="pesticide">{currentLanguage === 'hi' ? "कीटनाशक" : "Pesticide"}</option>
              <option value="harvest">{currentLanguage === 'hi' ? "कटाई" : "Harvest"}</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Add New Task Section */}
        <div className="p-6 rounded-2xl bg-green-50/80 backdrop-blur-sm shadow-lg transition-all duration-300 hover:scale-[1.02]">
          <h3 className="text-lg font-semibold mb-4 text-green-800 flex items-center">
            <PlusCircle className="w-5 h-5 mr-2 text-green-500" />
            {currentLanguage === 'hi' ? "नया कार्य जोड़ें" : "Add New Task"}
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-green-700 mb-1">
                {currentLanguage === 'hi' ? "कार्य का शीर्षक" : "Task Title"}
              </label>
              <input
                type="text"
                value={newTask.title}
                onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                placeholder={currentLanguage === 'hi' ? "क्या करना है?" : "What needs to be done?"}
                className="w-full p-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-green-700 mb-1">
                {currentLanguage === 'hi' ? "कार्य का प्रकार" : "Task Type"}
              </label>
              <select
                value={newTask.type}
                onChange={(e) => setNewTask(prev => ({ ...prev, type: e.target.value as Task['type'] }))}
                className="w-full p-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300"
              >
                <option value="watering">{currentLanguage === 'hi' ? "पानी देना" : "Watering"}</option>
                <option value="fertilizing">{currentLanguage === 'hi' ? "खाद डालना" : "Fertilizing"}</option>
                <option value="pesticide">{currentLanguage === 'hi' ? "कीटनाशक" : "Pesticide"}</option>
                <option value="harvest">{currentLanguage === 'hi' ? "कटाई" : "Harvest"}</option>
                <option value="other">{currentLanguage === 'hi' ? "अन्य" : "Other"}</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-green-700 mb-1">
                {currentLanguage === 'hi' ? "समय" : "Time"}
              </label>
              <input
                type="time"
                value={newTask.time}
                onChange={(e) => setNewTask(prev => ({ ...prev, time: e.target.value }))}
                className="w-full p-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-green-700 mb-1">
                {currentLanguage === 'hi' ? "प्राथमिकता" : "Priority"}
              </label>
              <select
                value={newTask.priority}
                onChange={(e) => setNewTask(prev => ({ ...prev, priority: e.target.value as Task['priority'] }))}
                className="w-full p-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300"
              >
                <option value="high">{currentLanguage === 'hi' ? "उच्च" : "High"}</option>
                <option value="medium">{currentLanguage === 'hi' ? "मध्यम" : "Medium"}</option>
                <option value="low">{currentLanguage === 'hi' ? "निम्न" : "Low"}</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-green-700 mb-1">
                {currentLanguage === 'hi' ? "विवरण" : "Description"}
              </label>
              <textarea
                value={newTask.description}
                onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                placeholder={currentLanguage === 'hi' ? "कार्य के बारे में विवरण जोड़ें..." : "Add details about the task..."}
                className="w-full p-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300"
                rows={3}
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="reminder"
                checked={newTask.reminder}
                onChange={(e) => setNewTask(prev => ({ ...prev, reminder: e.target.checked }))}
                className="rounded border-green-200 text-green-600 focus:ring-green-500"
              />
              <label htmlFor="reminder" className="text-sm text-green-700 font-medium">
                {currentLanguage === 'hi' ? "याद दिलाना सेट करें" : "Set Reminder"}
              </label>
            </div>

            <div className="border-t border-green-200 pt-4 mt-4">
              <h4 className="text-md font-semibold mb-3 text-green-800">
                {currentLanguage === 'hi' ? "अनुसूची सेटिंग्स" : "Schedule Settings"}
              </h4>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-green-700 mb-1">
                      {currentLanguage === 'hi' ? "आवृत्ति" : "Frequency"}
                    </label>
                    <select
                      value={newTask.frequency}
                      onChange={(e) => setNewTask(prev => ({ ...prev, frequency: e.target.value as 'daily' | 'weekly' | 'biweekly' | 'monthly' }))}
                      className="w-full p-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300"
                    >
                      <option value="daily">{currentLanguage === 'hi' ? "दैनिक" : "Daily"}</option>
                      <option value="weekly">{currentLanguage === 'hi' ? "साप्ताहिक" : "Weekly"}</option>
                      <option value="biweekly">{currentLanguage === 'hi' ? "द्विसाप्ताहिक" : "Biweekly"}</option>
                      <option value="monthly">{currentLanguage === 'hi' ? "मासिक" : "Monthly"}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-green-700 mb-1">
                      {currentLanguage === 'hi' ? "अवधि" : "Duration"}
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="number"
                        min="1"
                        value={newTask.duration?.value || 1}
                        onChange={(e) => setNewTask(prev => ({ 
                          ...prev, 
                          duration: { 
                            ...prev.duration, 
                            value: parseInt(e.target.value) 
                          } 
                        }))}
                        className="w-1/2 p-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300"
                      />
                      <select
                        value={newTask.duration?.unit || 'months'}
                        onChange={(e) => setNewTask(prev => ({ 
                          ...prev, 
                          duration: { 
                            ...prev.duration, 
                            unit: e.target.value as 'days' | 'weeks' | 'months' | 'years' 
                          } 
                        }))}
                        className="w-1/2 p-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300"
                      >
                        <option value="days">{currentLanguage === 'hi' ? "दिन" : "Days"}</option>
                        <option value="weeks">{currentLanguage === 'hi' ? "सप्ताह" : "Weeks"}</option>
                        <option value="months">{currentLanguage === 'hi' ? "महीने" : "Months"}</option>
                        <option value="years">{currentLanguage === 'hi' ? "साल" : "Years"}</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-green-700 mb-1">
                    {currentLanguage === 'hi' ? "प्रारंभ तिथि" : "Start Date"}
                  </label>
                  <input
                    type="date"
                    value={newTask.startDate ? format(newTask.startDate, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd')}
                    onChange={(e) => setNewTask(prev => ({ ...prev, startDate: new Date(e.target.value) }))}
                    className="w-full p-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300"
                  />
                </div>

                <button
                  onClick={() => {
                    if (newTask.type && newTask.frequency && newTask.startDate) {
                      scheduleTasks({
                        taskType: newTask.type,
                        frequency: newTask.frequency,
                        duration: newTask.duration || { value: 1, unit: 'months' },
                        startDate: newTask.startDate,
                        time: newTask.time,
                        description: newTask.description,
                        priority: newTask.priority
                      });
                    }
                  }}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:scale-[1.02] shadow-md"
                >
                  {currentLanguage === 'hi' ? "कार्य अनुसूचित करें" : "Schedule Tasks"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Calendar View */}
        <div className="p-6 rounded-2xl bg-green-50/80 backdrop-blur-sm shadow-lg transition-all duration-300 hover:scale-[1.02]">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setCurrentMonth(prev => subMonths(prev, 1))}
              className="p-2 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-semibold text-green-800">
              {format(currentMonth, 'MMMM yyyy')}
            </h3>
            <button
              onClick={() => setCurrentMonth(prev => addMonths(prev, 1))}
              className="p-2 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          <div className="grid grid-cols-7 gap-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-sm font-medium text-green-700 opacity-80">
                {day}
              </div>
            ))}
            {generateCalendarDays().map((date, index) => (
              <div
                key={index}
                className={`p-2 border rounded-lg min-h-[80px] transition-all duration-300 ${
                  date ? 'hover:bg-green-50 cursor-pointer' : ''
                } ${
                  date && isSameDay(date, selectedDate)
                    ? 'bg-green-100 border-green-300'
                    : 'border-gray-200'
                } ${
                  date && isToday(date)
                    ? 'border-green-500'
                    : ''
                } ${
                  date && isPast(date) && !isToday(date)
                    ? 'opacity-50'
                    : ''
                }`}
                onClick={() => date && setSelectedDate(date)}
              >
                {date && (
                  <>
                    <div className="text-sm font-medium mb-1 flex items-center justify-between">
                      <span className="text-green-800 font-medium">{format(date, 'd')}</span>
                      {isToday(date) && (
                        <span className="text-xs text-green-600 bg-green-100 px-1 rounded">
                          {currentLanguage === 'hi' ? "आज" : "Today"}
                        </span>
                      )}
                    </div>
                    <div className="space-y-1">
                      {getTasksForDate(date).map(task => (
                        <div
                          key={task.id}
                          className={`text-xs p-1 rounded border ${getTaskColor(task.type)}`}
                        >
                          {task.title}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Task List */}
        <div className="p-6 rounded-2xl bg-green-50/80 backdrop-blur-sm shadow-lg transition-all duration-300 hover:scale-[1.02]">
          <h3 className="text-lg font-semibold mb-4 text-green-800 flex items-center">
            <Clock4 className="w-5 h-5 mr-2 text-green-500" />
            {currentLanguage === 'hi' ? "कार्य सूची" : "Task List"}
          </h3>
          <div className="space-y-3">
            {filteredTasks.map(task => (
              <div
                key={task.id}
                className={`p-4 border rounded-lg transition-all duration-300 transform hover:scale-[1.02] ${
                  task.completed ? 'bg-gray-50' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {getPriorityIcon(task.priority)}
                    {getTaskIcon(task.type)}
                    <span className={`font-semibold ${getTaskColor(task.type)} px-2 py-1 rounded`}>
                      {task.title}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleTaskComplete(task.id)}
                      className={`p-1 rounded-full transition-all duration-300 ${
                        task.completed
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800 hover:bg-green-100 hover:text-green-800'
                      }`}
                    >
                      {task.completed ? <CalendarCheck className="w-4 h-4" /> : <CalendarX className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => handleToggleReminder(task.id)}
                      className={`p-1 rounded-full transition-all duration-300 ${
                        task.reminder
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800 hover:bg-blue-100 hover:text-blue-800'
                      }`}
                    >
                      {task.reminder ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="p-1 rounded-full text-red-500 hover:bg-red-100 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="mt-2 text-sm text-gray-500 flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm text-gray-600 opacity-80">{format(task.date, 'MMM d, yyyy')}</span>
                  <Clock className="w-4 h-4 ml-2" />
                  <span className="text-sm text-gray-600 opacity-80">{task.time}</span>
                </div>
                {showWeather && task.weather && (
                  <div className="mt-2 flex items-center space-x-4 text-sm">
                    <div className="flex items-center space-x-1">
                      <Thermometer className="w-4 h-4 text-red-500" />
                      <span className="text-sm text-gray-600 opacity-80">{task.weather.temperature}°C</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      {getWeatherIcon(task.weather.condition)}
                      <span className="text-sm text-gray-600 opacity-80">{task.weather.condition}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Droplets className="w-4 h-4 text-blue-500" />
                      <span className="text-sm text-gray-600 opacity-80">{task.weather.humidity}%</span>
                    </div>
                  </div>
                )}
                {task.description && (
                  <p className="mt-2 text-sm text-gray-600 opacity-80">{task.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Scheduler; 