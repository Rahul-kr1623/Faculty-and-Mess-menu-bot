import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import { Search, MapPin, Phone, Star, X, Sun, Moon, Zap, Shield, Users, TrendingUp } from 'lucide-react'

function App() {
  const [query, setQuery] = useState('')
  const [faculty, setFaculty] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedFaculty, setSelectedFaculty] = useState(null)
  
  // Theme State
  const [darkMode, setDarkMode] = useState(true) // Default to Dark for that "Premium" feel
  const toggleTheme = () => setDarkMode(!darkMode)

  // Search Logic
  const searchFaculty = async (searchTerm) => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('faculty')
        .select('*')
        .ilike('name', `%${searchTerm}%`)
      if (error) throw error
      setFaculty(data || [])
    } catch (error) {
      console.error('Error:', error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.length > 0) searchFaculty(query)
      else setFaculty([])
    }, 500)
    return () => clearTimeout(timer)
  }, [query])

  // --- COMPONENT: RATING MODAL ---
  const RatingModal = ({ faculty, onClose }) => {
    const [teaching, setTeaching] = useState(5)
    const [grading, setGrading] = useState(5)
    const [behavior, setBehavior] = useState(5)
    const [submitting, setSubmitting] = useState(false)

    const submitReview = async () => {
      setSubmitting(true)
      await supabase.from('reviews').insert({
        faculty_id: faculty.id,
        teaching, grading, behavior
      })
      alert('Review Submitted! Rating will update shortly.')
      setSubmitting(false)
      onClose()
      if (query) searchFaculty(query)
    }

    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
        <div className={`rounded-3xl p-8 w-full max-w-sm relative shadow-2xl border ${darkMode ? 'bg-[#18181b] border-zinc-700 text-white' : 'bg-white border-white text-gray-800'}`}>
          <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-500/20 transition-colors">
            <X size={24} />
          </button>
          
          <h2 className="text-2xl font-bold mb-1">Rate Faculty</h2>
          <p className="text-sm opacity-60 mb-6">{faculty.name}</p>

          <div className="space-y-6">
            {[
              { label: 'Teaching', val: teaching, set: setTeaching },
              { label: 'Grading', val: grading, set: setGrading },
              { label: 'Behavior', val: behavior, set: setBehavior }
            ].map((item) => (
              <div key={item.label}>
                <div className="flex justify-between mb-2">
                  <label className="font-medium text-sm">{item.label}</label>
                  <span className={`font-bold ${darkMode ? 'text-red-400' : 'text-blue-600'}`}>{item.val}/5</span>
                </div>
                <input 
                  type="range" min="1" max="5" value={item.val} 
                  onChange={(e) => item.set(Number(e.target.value))}
                  className={`w-full h-2 rounded-lg appearance-none cursor-pointer ${darkMode ? 'bg-zinc-700 accent-red-500' : 'bg-gray-200 accent-blue-600'}`}
                />
              </div>
            ))}
          </div>

          <button 
            onClick={submitReview}
            disabled={submitting}
            className={`w-full mt-8 py-3.5 rounded-xl font-bold shadow-lg transition-transform active:scale-95 ${
              darkMode 
                ? 'bg-red-600 hover:bg-red-700 text-white shadow-red-900/20' 
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200'
            }`}
          >
            {submitting ? 'Publish Review' : 'Submit Review'}
          </button>
        </div>
      </div>
    )
  }

  // --- MAIN UI ---
  return (
    <div className={`min-h-screen transition-colors duration-500 font-sans ${darkMode ? 'bg-[#09090b] text-gray-100' : 'bg-[#f8fafc] text-gray-900'}`}>
      
      {/* NAVBAR */}
      <nav className={`px-6 py-4 flex justify-between items-center sticky top-0 z-10 backdrop-blur-xl border-b ${darkMode ? 'bg-[#09090b]/80 border-zinc-800' : 'bg-white/80 border-slate-200'}`}>
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl ${darkMode ? 'bg-red-500/20 text-red-500' : 'bg-blue-600 text-white'}`}>
            <Star size={20} fill="currentColor" />
          </div>
          <span className="font-bold text-lg tracking-tight">VIT Ratings</span>
        </div>
        <button onClick={toggleTheme} className={`p-2.5 rounded-xl transition-all ${darkMode ? 'hover:bg-zinc-800 text-yellow-400' : 'hover:bg-gray-100 text-slate-600'}`}>
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </nav>

      <div className="max-w-4xl mx-auto p-4 md:p-8 flex flex-col min-h-[85vh]">
        
        {/* HERO HEADER */}
        <div className={`text-center transition-all duration-500 ${query ? 'mt-4 mb-8' : 'mt-20 mb-12'}`}>
          <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tight">
            Find Your <span className={`text-transparent bg-clip-text bg-gradient-to-r ${darkMode ? 'from-red-500 to-orange-500' : 'from-blue-600 to-cyan-500'}`}>Faculty</span>
          </h1>
          <p className={`text-lg md:text-xl max-w-xl mx-auto ${darkMode ? 'text-zinc-400' : 'text-slate-500'}`}>
            The unofficial platform for honest student reviews. Anonymous. Fast. Reliable.
          </p>
        </div>

        {/* SEARCH INPUT */}
        <div className="relative mb-8 group max-w-2xl mx-auto w-full z-20">
          <div className={`absolute -inset-0.5 rounded-2xl blur opacity-30 transition duration-500 group-hover:opacity-60 ${darkMode ? 'bg-gradient-to-r from-red-600 to-orange-600' : 'bg-gradient-to-r from-blue-600 to-cyan-400'}`}></div>
          <div className={`relative flex items-center p-2 rounded-2xl shadow-2xl transition-all ${darkMode ? 'bg-[#18181b]' : 'bg-white'}`}>
            <Search className={`ml-4 ${darkMode ? 'text-zinc-500' : 'text-slate-400'}`} size={24} />
            <input
              type="text"
              placeholder="Search by name (e.g. Sanat)..."
              className="w-full p-4 bg-transparent text-lg focus:outline-none placeholder-zinc-500 font-medium"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {query && (
              <button onClick={() => setQuery('')} className="mr-4 p-1 rounded-full hover:bg-zinc-700/20 text-zinc-500">
                <X size={20} />
              </button>
            )}
          </div>
        </div>

        {/* --- EMPTY STATE (SHOW WHEN NO SEARCH) --- */}
        {!query && (
          <div className="flex-1 flex flex-col justify-between animate-fade-in-up">
            
            {/* Quick Tags */}
            <div className="flex justify-center flex-wrap gap-3 mb-16">
              <span className={`text-sm font-semibold py-2 ${darkMode ? 'text-zinc-500' : 'text-slate-400'}`}>Trending:</span>
              {['Sanat Jain', 'Praveen Lalwani', 'Reena Jain', 'Anant Kant'].map((name) => (
                <button 
                  key={name}
                  onClick={() => setQuery(name)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all hover:scale-105 active:scale-95
                    ${darkMode 
                      ? 'border-zinc-800 bg-zinc-900/50 text-zinc-300 hover:border-red-500/50 hover:text-red-400' 
                      : 'border-slate-200 bg-white text-slate-600 hover:border-blue-400 hover:text-blue-600 shadow-sm'}`}
                >
                  {name}
                </button>
              ))}
            </div>

            {/* Feature Grid (Fills the empty space) */}
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { icon: <Shield size={24} />, title: "100% Anonymous", desc: "Your identity is hidden. Review without fear." },
                { icon: <Zap size={24} />, title: "Instant Updates", desc: "Ratings update in real-time across the bot & web." },
                { icon: <Users size={24} />, title: "Student Driven", desc: "Data sourced directly from the VIT community." }
              ].map((feat, i) => (
                <div key={i} className={`p-6 rounded-3xl border transition-all hover:-translate-y-1 
                  ${darkMode 
                    ? 'bg-[#18181b]/50 border-zinc-800 hover:bg-[#18181b]' 
                    : 'bg-white border-slate-100 shadow-lg shadow-slate-200/50'}`}>
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${darkMode ? 'bg-zinc-800 text-red-500' : 'bg-blue-50 text-blue-600'}`}>
                    {feat.icon}
                  </div>
                  <h3 className="text-lg font-bold mb-2">{feat.title}</h3>
                  <p className={`text-sm leading-relaxed ${darkMode ? 'text-zinc-400' : 'text-slate-500'}`}>{feat.desc}</p>
                </div>
              ))}
            </div>

            {/* Bottom Stats */}
            <div className={`mt-16 py-8 border-t flex justify-center gap-12 text-center ${darkMode ? 'border-zinc-800 text-zinc-500' : 'border-slate-200 text-slate-400'}`}>
              <div>
                <p className={`text-3xl font-black ${darkMode ? 'text-white' : 'text-slate-800'}`}>300+</p>
                <p className="text-xs uppercase tracking-widest font-bold mt-1">Faculty</p>
              </div>
              <div>
                <p className={`text-3xl font-black ${darkMode ? 'text-white' : 'text-slate-800'}`}>1.2k</p>
                <p className="text-xs uppercase tracking-widest font-bold mt-1">Reviews</p>
              </div>
            </div>
          </div>
        )}

        {/* --- SEARCH RESULTS --- */}
        {loading ? (
          <div className="text-center py-20">
            <div className={`inline-block animate-spin rounded-full h-10 w-10 border-4 border-t-transparent ${darkMode ? 'border-red-500' : 'border-blue-600'}`}></div>
          </div>
        ) : (
          <div className="grid gap-4 pb-20">
            {faculty.map((f) => (
              <div 
                key={f.id} 
                className={`p-6 rounded-3xl border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all duration-300 hover:scale-[1.01]
                  ${darkMode 
                    ? 'bg-[#18181b] border-zinc-800 hover:border-zinc-600 shadow-lg' 
                    : 'bg-white border-slate-100 shadow-sm hover:shadow-xl hover:shadow-blue-900/5'
                  }`}
              >
                <div>
                  <h2 className="text-xl font-bold mb-1">{f.name}</h2>
                  <div className={`flex items-center gap-4 text-sm font-medium ${darkMode ? 'text-zinc-400' : 'text-slate-500'}`}>
                    <span className="flex items-center gap-1.5">
                      <MapPin size={16} /> {f.cabin}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Phone size={16} /> {f.mobile || 'N/A'}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm
                    ${darkMode 
                      ? 'bg-zinc-900 text-red-400 border border-zinc-700' 
                      : 'bg-blue-50 text-blue-700 border border-blue-100'
                    }`}>
                    <Star size={16} fill="currentColor" />
                    {f.teaching_rating ? f.teaching_rating : 'New'}
                  </div>
                  
                  <button 
                    onClick={() => setSelectedFaculty(f)}
                    className={`flex-1 sm:flex-none text-sm font-bold px-6 py-2.5 rounded-xl transition-all active:scale-95
                      ${darkMode 
                        ? 'bg-white text-black hover:bg-gray-200' 
                        : 'bg-black text-white hover:bg-gray-800'
                      }`}
                  >
                    Rate
                  </button>
                </div>
              </div>
            ))}
            
            {query && faculty.length === 0 && (
              <div className={`text-center mt-12 p-12 rounded-3xl border-2 border-dashed ${darkMode ? 'border-zinc-800 text-zinc-500' : 'border-slate-200 text-slate-400'}`}>
                <Search className="mx-auto mb-4 opacity-50" size={48} />
                <p className="text-lg">No faculty found matching "{query}"</p>
                <p className="text-sm mt-2">Try searching just the first name.</p>
              </div>
            )}
          </div>
        )}

      </div>

      {/* MODAL */}
      {selectedFaculty && (
        <RatingModal faculty={selectedFaculty} onClose={() => setSelectedFaculty(null)} />
      )}
    </div>
  )
}

export default App