import { useState } from 'react'
import { Mail, Bell, CheckCircle, TrendingUp, AlertCircle } from 'lucide-react'
import { supabase } from '../lib/supabase'

const Subscribe = () => {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    
    try {
      const { error: submitError } = await supabase
        .from('subscribers')
        .insert([{ email }])
      
      if (submitError) {
        // Check if it's a duplicate email error
        if (submitError.code === '23505') {
          setError('This email is already subscribed!')
        } else {
          throw submitError
        }
      } else {
        setSubscribed(true)
        setTimeout(() => {
          setSubscribed(false)
          setEmail('')
        }, 5000)
      }
    } catch (err) {
      console.error('Error subscribing:', err)
      setError('Failed to subscribe. Please try again later.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="py-20 bg-white relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-uk-blue/5 via-transparent to-uk-blue-light/5" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Main Subscribe Card */}
          <div className="bg-gradient-to-br from-uk-blue to-uk-blue-light rounded-3xl p-8 md:p-12 shadow-2xl animate-fade-in">
            <div className="text-center text-white mb-8">
              <div className="inline-block p-4 bg-white/20 backdrop-blur-sm rounded-2xl mb-6">
                <Bell size={40} />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Never Miss a Story
              </h2>
              <p className="text-lg md:text-xl opacity-95 max-w-2xl mx-auto leading-relaxed">
                Subscribe to Kentucky Sports Chronicle and get the latest news, analysis, 
                and exclusive content delivered straight to your inbox.
              </p>
            </div>

            {error && (
              <div className="max-w-xl mx-auto mb-6 p-4 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg flex items-start gap-3">
                <AlertCircle className="text-white flex-shrink-0 mt-0.5" size={20} />
                <p className="text-white text-sm font-semibold">{error}</p>
              </div>
            )}
            
            {!subscribed ? (
              <form onSubmit={handleSubmit} className="max-w-xl mx-auto">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1 relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="Enter your email address"
                      className="w-full pl-12 pr-4 py-4 rounded-xl text-gray-900 font-medium focus:outline-none focus:ring-4 focus:ring-white/50 transition-all"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-8 py-4 bg-white text-uk-blue font-bold rounded-xl hover:bg-gray-100 transition-all duration-200 hover:scale-105 shadow-lg whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-uk-blue border-t-transparent rounded-full animate-spin" />
                        <span>Subscribing...</span>
                      </>
                    ) : (
                      'Subscribe Now'
                    )}
                  </button>
                </div>
                <p className="text-white/80 text-sm text-center mt-4">
                  Join thousands of Big Blue fans getting our updates. Unsubscribe anytime.
                </p>
              </form>
            ) : (
              <div className="max-w-xl mx-auto text-center py-8 animate-fade-in">
                <div className="inline-block p-4 bg-white/20 backdrop-blur-sm rounded-full mb-4">
                  <CheckCircle size={48} className="text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  You're All Set!
                </h3>
                <p className="text-white/90 text-lg">
                  Welcome to the Kentucky Sports Chronicle family. Check your inbox for confirmation.
                </p>
              </div>
            )}
          </div>

          {/* Benefits Grid */}
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 animate-slide-up">
              <div className="w-12 h-12 gradient-blue rounded-xl flex items-center justify-center mb-4">
                <Mail className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Daily Digest
              </h3>
              <p className="text-gray-600">
                Get a curated roundup of the day's top Kentucky sports stories every morning
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 animate-slide-up" style={{ animationDelay: '100ms' }}>
              <div className="w-12 h-12 gradient-blue rounded-xl flex items-center justify-center mb-4">
                <Bell className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Breaking News
              </h3>
              <p className="text-gray-600">
                Be the first to know when major stories break in UK athletics
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 animate-slide-up" style={{ animationDelay: '200ms' }}>
              <div className="w-12 h-12 gradient-blue rounded-xl flex items-center justify-center mb-4">
                <TrendingUp className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Exclusive Content
              </h3>
              <p className="text-gray-600">
                Access subscriber-only analysis, interviews, and insider perspectives
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Subscribe
