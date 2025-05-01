export const themes = {
  light: {
    bg: 'bg-gradient-to-b from-white via-gray-50 to-gray-100',
    text: 'text-gray-800',
    bubble: {
      user: 'bg-blue-500 text-white',
      assistant: 'bg-white text-gray-800 shadow-md'
    },
    input: 'bg-white border-gray-300',
    header: 'bg-white/90 text-gray-800',
    button: 'bg-blue-100 text-blue-600 hover:bg-blue-200',
    accent: 'text-blue-500',
    record: 'bg-red-500 hover:bg-red-600 text-white',
    schedule: 'bg-green-500 hover:bg-green-600 text-white'
  },
  dark: {
    bg: 'bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900',
    text: 'text-gray-100',
    bubble: {
      user: 'bg-blue-600 text-white',
      assistant: 'bg-gray-700 text-gray-100 shadow-lg'
    },
    input: 'bg-gray-700 border-gray-600',
    header: 'bg-gray-900/90 text-gray-100',
    button: 'bg-gray-700 text-gray-100 hover:bg-gray-600',
    accent: 'text-blue-400',
    record: 'bg-red-600 hover:bg-red-700 text-white',
    schedule: 'bg-green-600 hover:bg-green-700 text-white'
  },
  nature: {
    bg: 'bg-gradient-to-b from-emerald-900 via-green-800 to-teal-900',
    text: 'text-gray-100',
    bubble: {
      user: 'bg-gradient-to-r from-emerald-600 to-green-700 text-white',
      assistant: 'bg-emerald-800/90 text-gray-100 shadow-lg'
    },
    input: 'bg-emerald-800/90 border-emerald-600',
    header: 'bg-emerald-900/90 text-gray-100',
    button: 'bg-emerald-700 text-white hover:bg-emerald-600',
    accent: 'text-emerald-400',
    record: 'bg-red-500 hover:bg-red-600 text-white shadow-lg',
    schedule: 'bg-green-500 hover:bg-green-600 text-white shadow-lg',
    action: 'bg-yellow-500 hover:bg-yellow-600 text-white shadow-lg'
  }
}; 