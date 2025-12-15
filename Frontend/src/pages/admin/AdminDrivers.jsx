import { useEffect, useMemo, useState } from 'react';
import { User, Mail, Plus, Search } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import api from '../../services/api';

const Avatar = ({ firstName = '', lastName = '' }) => {
  const initials = `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase() || 'D';
  return (
    <div className="h-10 w-10 rounded-full bg-white/10 border border-white/10 text-white flex items-center justify-center text-sm font-semibold">
      {initials}
    </div>
  );
};

const AddDriverModal = ({ isOpen, onClose, onSubmit }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFirstName('');
      setLastName('');
      setEmail('');
      setPassword('');
      setLoading(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await onSubmit({ firstName, lastName, email, password, role: 'Chauffeur' });
      onClose();
    } catch (err) {
      // onSubmit gère les toasts
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xl px-4">
      <div className="w-full max-w-lg bg-slate-900/80 border border-white/10 rounded-2xl shadow-2xl p-6 text-slate-100 relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-300 hover:text-white"
        >
          ×
        </button>
        <h2 className="text-xl font-semibold text-white mb-1">Nouveau Chauffeur</h2>
        <p className="text-sm text-slate-300 mb-4">Créer un compte chauffeur</p>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-slate-200">Prénom</label>
              <input
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-slate-950/50 px-3 py-2 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-gradient-start"
                placeholder="Jean"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-slate-200">Nom</label>
              <input
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-slate-950/50 px-3 py-2 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-gradient-start"
                placeholder="Dupont"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm text-slate-200">Email</label>
            <div className="relative">
              <Mail className="h-4 w-4 text-cyan-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-slate-950/50 pl-9 pr-3 py-2 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-gradient-start"
                placeholder="email@camtra.com"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm text-slate-200">Mot de passe</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-slate-950/50 px-3 py-2 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-gradient-start"
              placeholder="********"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-200 bg-white/10 hover:bg-white/20 border border-white/10"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-primary-gradient-start to-primary-gradient-end shadow-lg hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <Plus className="h-4 w-4" />
              {loading ? 'Création...' : 'Créer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const DriversTable = ({ drivers = [], loading }) => {
  const rows = useMemo(() => drivers, [drivers]);

  if (loading) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg p-4 shadow-xl">
        <div className="h-10 w-32 bg-white/10 rounded animate-pulse mb-3" />
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-12 bg-white/5 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!rows.length) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg p-6 text-center text-slate-200 shadow-xl">
        Aucun chauffeur trouvé.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg p-4 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-slate-200">
          <Search className="h-4 w-4 text-cyan-400" />
          <span className="text-sm">Liste des chauffeurs</span>
        </div>
      </div>
      <div className="overflow-auto">
        <table className="min-w-full text-left text-sm text-slate-100">
          <thead className="bg-white/10 text-slate-200">
            <tr>
              <th className="px-4 py-3 font-semibold">Chauffeur</th>
              <th className="px-4 py-3 font-semibold">Email</th>
              <th className="px-4 py-3 font-semibold">Statut</th>
              <th className="px-4 py-3 font-semibold">Inscription</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((driver) => {
              const dateStr = driver.createdAt
                ? new Date(driver.createdAt).toLocaleDateString('fr-FR')
                : '—';
              return (
                <tr key={driver._id} className="hover:bg-white/5 transition-colors">
                  <td className="px-4 py-3 flex items-center gap-3">
                    <Avatar firstName={driver.firstName} lastName={driver.lastName} />
                    <div>
                      <p className="text-sm font-semibold text-white">
                        {driver.firstName} {driver.lastName}
                      </p>
                      <p className="text-xs text-slate-300">{driver.role}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-200">{driver.email}</td>
                  <td className="px-4 py-3">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-200 border border-emerald-500/30">
                      Actif
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-200">{dateStr}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const AdminDrivers = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const loadDrivers = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/users/drivers');
      setDrivers(data?.drivers || data || []);
    } catch (err) {
      const message = err.response?.data?.message || 'Impossible de charger les chauffeurs';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddDriver = async (payload) => {
    await api.post('/users/drivers', payload);
    toast.success('Chauffeur créé avec succès');
    await loadDrivers();
  };

  useEffect(() => {
    loadDrivers();
  }, []);

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Gestion des Chauffeurs</h1>
          <p className="text-sm text-slate-300">Créez et suivez vos chauffeurs.</p>
        </div>
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-primary-gradient-start to-primary-gradient-end shadow-lg hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          Nouveau Chauffeur
        </button>
      </div>

      <DriversTable drivers={drivers} loading={loading} />

      <AddDriverModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleAddDriver}
      />
    </div>
  );
};

export default AdminDrivers;

