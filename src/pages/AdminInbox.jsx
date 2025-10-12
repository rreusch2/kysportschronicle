import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { 
  Mail, Users, ArrowLeft, LogOut, Inbox, CheckCircle, 
  Trash2, Download, Search, Filter 
} from 'lucide-react'
import { format } from 'date-fns'

const AdminInbox = () => {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('contacts')
  const [contacts, setContacts] = useState([])
  const [subscribers, setSubscribers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchData()
  }, [activeTab])

  const fetchData = async () => {
    setLoading(true)
    try {
      if (activeTab === 'contacts') {
        const { data, error } = await supabase
          .from('contacts')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) throw error
        setContacts(data || [])
      } else {
        const { data, error } = await supabase
          .from('subscribers')
          .select('*')
          .order('subscribed_at', { ascending: false })

        if (error) throw error
        setSubscribers(data || [])
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (id) => {
    try {
      const { error } = await supabase
        .from('contacts')
        .update({ is_read: true })
        .eq('id', id)

      if (error) throw error
      fetchData()
    } catch (error) {
      console.error('Error marking as read:', error)
    }
  }

  const deleteContact = async (id) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return

    try {
      const { error } = await supabase
        .from('contacts')
        .delete()
        .eq('id', id)

      if (error) throw error
      setContacts(contacts.filter(c => c.id !== id))
    } catch (error) {
      console.error('Error deleting contact:', error)
    }
  }

  const deleteSubscriber = async (id) => {
    if (!window.confirm('Are you sure you want to delete this subscriber?')) return

    try {
      const { error} = await supabase
        .from('subscribers')
        .delete()
        .eq('id', id)

      if (error) throw error
      setSubscribers(subscribers.filter(s => s.id !== id))
    } catch (error) {
      console.error('Error deleting subscriber:', error)
    }
  }

  const exportToCSV = () => {
    let data, headers, filename

    if (activeTab === 'contacts') {
      headers = ['Date', 'Name', 'Email', 'Subject', 'Message', 'Read']
      data = contacts.map(c => [
        format(new Date(c.created_at), 'yyyy-MM-dd HH:mm'),
        c.name,
        c.email,
        c.subject,
        c.message,
        c.is_read ? 'Yes' : 'No'
      ])
      filename = 'contacts.csv'
    } else {
      headers = ['Date', 'Email', 'Status']
      data = subscribers.map(s => [
        format(new Date(s.subscribed_at), 'yyyy-MM-dd HH:mm'),
        s.email,
        s.is_active ? 'Active' : 'Inactive'
      ])
      filename = 'subscribers.csv'
    }

    const csvContent = [
      headers.join(','),
      ...data.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      navigate('/admin/login')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const filteredContacts = contacts
    .filter(c => {
      if (filter === 'unread') return !c.is_read
      if (filter === 'read') return c.is_read
      return true
    })
    .filter(c => 
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.subject.toLowerCase().includes(searchTerm.toLowerCase())
    )

  const filteredSubscribers = subscribers.filter(s =>
    s.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const stats = {
    totalContacts: contacts.length,
    unreadContacts: contacts.filter(c => !c.is_read).length,
    totalSubscribers: subscribers.length,
    activeSubscribers: subscribers.filter(s => s.is_active).length
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img src="/logoround.JPG" alt="KSC" className="h-12 w-12" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Messages & Subscribers</h1>
                <p className="text-sm text-gray-600">{user?.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/admin/dashboard')}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-uk-blue font-semibold transition-colors"
              >
                <ArrowLeft size={18} />
                Dashboard
              </button>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold transition-colors"
              >
                <LogOut size={18} />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold">Total Messages</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalContacts}</p>
              </div>
              <div className="w-12 h-12 bg-uk-blue/10 rounded-lg flex items-center justify-center">
                <Mail className="text-uk-blue" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold">Unread</p>
                <p className="text-3xl font-bold text-orange-600 mt-1">{stats.unreadContacts}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Inbox className="text-orange-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold">Total Subscribers</p>
                <p className="text-3xl font-bold text-green-600 mt-1">{stats.totalSubscribers}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Users className="text-green-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold">Active Subscribers</p>
                <p className="text-3xl font-bold text-purple-600 mt-1">{stats.activeSubscribers}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="text-purple-600" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
          <div className="border-b border-gray-200">
            <div className="flex gap-6 px-6">
              <button
                onClick={() => setActiveTab('contacts')}
                className={`py-4 font-semibold transition-colors relative ${
                  activeTab === 'contacts'
                    ? 'text-uk-blue'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Contact Messages
                {stats.unreadContacts > 0 && (
                  <span className="ml-2 px-2 py-0.5 bg-orange-100 text-orange-600 text-xs font-bold rounded-full">
                    {stats.unreadContacts}
                  </span>
                )}
                {activeTab === 'contacts' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-uk-blue" />
                )}
              </button>
              <button
                onClick={() => setActiveTab('subscribers')}
                className={`py-4 font-semibold transition-colors relative ${
                  activeTab === 'subscribers'
                    ? 'text-uk-blue'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Email Subscribers
                {activeTab === 'subscribers' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-uk-blue" />
                )}
              </button>
            </div>
          </div>

          {/* Toolbar */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              <div className="flex-1 w-full md:w-auto">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder={`Search ${activeTab}...`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:border-uk-blue focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-3 flex-wrap">
                {activeTab === 'contacts' && (
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-uk-blue focus:outline-none font-semibold"
                  >
                    <option value="all">All Messages</option>
                    <option value="unread">Unread Only</option>
                    <option value="read">Read Only</option>
                  </select>
                )}

                <button
                  onClick={exportToCSV}
                  className="flex items-center gap-2 px-4 py-2 bg-uk-blue text-white rounded-lg font-semibold hover:bg-uk-blue-light transition-colors"
                >
                  <Download size={18} />
                  Export CSV
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {loading ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 border-4 border-uk-blue border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-gray-600">Loading...</p>
              </div>
            ) : activeTab === 'contacts' ? (
              filteredContacts.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-600 text-lg">No contact messages yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredContacts.map((contact) => (
                    <div
                      key={contact.id}
                      className={`border rounded-xl p-6 transition-all ${
                        contact.is_read
                          ? 'bg-gray-50 border-gray-200'
                          : 'bg-blue-50 border-uk-blue/30'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-bold text-gray-900">{contact.name}</h3>
                            {!contact.is_read && (
                              <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-semibold rounded-full">
                                NEW
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                            <a href={`mailto:${contact.email}`} className="hover:text-uk-blue">
                              {contact.email}
                            </a>
                            <span>•</span>
                            <span>{format(new Date(contact.created_at), 'MMM d, yyyy h:mm a')}</span>
                          </div>
                          <p className="font-semibold text-gray-900 mb-2">{contact.subject}</p>
                          <p className="text-gray-700 whitespace-pre-wrap">{contact.message}</p>
                        </div>

                        <div className="flex gap-2">
                          {!contact.is_read && (
                            <button
                              onClick={() => markAsRead(contact.id)}
                              className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
                              title="Mark as read"
                            >
                              <CheckCircle size={20} />
                            </button>
                          )}
                          <button
                            onClick={() => deleteContact(contact.id)}
                            className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )
            ) : (
              filteredSubscribers.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-600 text-lg">No subscribers yet</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredSubscribers.map((subscriber) => (
                    <div
                      key={subscriber.id}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-2 h-2 rounded-full ${subscriber.is_active ? 'bg-green-500' : 'bg-gray-400'}`} />
                        <div>
                          <p className="font-semibold text-gray-900">{subscriber.email}</p>
                          <p className="text-sm text-gray-600">
                            Subscribed {format(new Date(subscriber.subscribed_at), 'MMM d, yyyy')}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => deleteSubscriber(subscriber.id)}
                        className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  ))}
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminInbox
