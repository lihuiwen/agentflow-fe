// Tailwind CSS 类名配置
export const styles = {
  formContainer: "min-h-[calc(100vh-140px)] bg-gradient-to-br from-indigo-500 via-purple-500 to-gray-100 w-full m-0 p-0",
  
  formCard: "bg-white/95 backdrop-blur-lg border border-white/30 rounded-3xl shadow-[0_20px_40px_rgba(0,0,0,0.1)] overflow-visible",
  
  sectionCard: "bg-white/80 backdrop-blur-sm border border-white/40 rounded-2xl p-6 mb-6",
  
  textField: {
    root: "transition-all duration-300",
    input: "bg-white/90 rounded-2xl hover:bg-white focus-within:bg-white transition-all duration-300",
    inputHover: "[&:hover_.MuiOutlinedInput-notchedOutline]:border-indigo-400/40",
    inputFocused: "[&.Mui-focused_.MuiOutlinedInput-notchedOutline]:border-indigo-500 [&.Mui-focused_.MuiOutlinedInput-notchedOutline]:border-2"
  },
  
  formControl: {
    root: "transition-all duration-300",
    input: "bg-white/90 rounded-2xl hover:bg-white focus-within:bg-white transition-all duration-300",
    inputHover: "[&:hover_.MuiOutlinedInput-notchedOutline]:border-indigo-400/40",
    inputFocused: "[&.Mui-focused_.MuiOutlinedInput-notchedOutline]:border-indigo-500 [&.Mui-focused_.MuiOutlinedInput-notchedOutline]:border-2"
  },
  
  saveButton: "bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-2xl px-8 py-3 normal-case font-semibold text-base shadow-[0_8px_20px_rgba(102,126,234,0.3)] transition-all duration-300 hover:bg-gradient-to-br hover:from-indigo-600 hover:to-purple-700 hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(102,126,234,0.4)]",
  
  cancelButton: "bg-white/90 text-gray-600 border-2 border-indigo-500/20 rounded-2xl px-8 py-3 normal-case font-semibold text-base transition-all duration-300 hover:bg-indigo-500/10 hover:border-indigo-500 hover:-translate-y-px"
};