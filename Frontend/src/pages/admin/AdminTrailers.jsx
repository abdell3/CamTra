import { useEffect, useMemo, useState } from 'react';
import { Plus, Container } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import api from '../../services/api';

const statusBadge = (isAvailable) =>
  isAvailable
    ? 'bg-emerald-500/20 text-emerald-200 border border-emerald-400/30'
    : 'bg-red-500/20 text-red-200 border border-red-400/30';

const AddTrailerModal = ({ isOpen, onClose, onSubmit }) => {
  const [immatriculation, setImmatriculation] = useState('');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setImmatriculation('');
      setBrand('');
      setModel('');
      setIsAvailable(true);
      setLoading(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await onSubmit({
        immatriculation,
        brand,
        model,
        isAvailable,
        acquisitionDate: new Date().toISOString(),
        currentKm: 0,
      });
      onClose();
    } catch (err) {
      // onSubmit handles toast
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xl px-4">
      <div className="w-full max-w-xl bg-slate-900/80 border border-white/10 rounded-2xl shadow-2xl p-6 text-slate-100 relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-300 hover:text-white"
        >
          ×
        </button>
        <h2 className="text-xl font-semibold text-white mb-1">Nouvelle Remorque</h2>
        <p className="text-sm text-slate-300 mb-4">Ajoutez une remorque à la flotte</p>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-sm text-slate-200">Immatriculation *</label>
            <input
              type="text"
              required
              value={immatriculation}
              onChange={(e) => setImmatriculation(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-slate-950/50 px-3 py-2 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-gradient-start"
              placeholder="AA-123-BB"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-slate-200">Marque *</label>
              <input
                type="text"
                required
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-slate-950/50 px-3 py-2 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-gradient-start"
                placeholder="Ex: Schmitz"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-slate-200">Modèle *</label>
              <input
                type="text"
                required
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-slate-950/50 px-3 py-2 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-gradient-start"
                placeholder="Ex: Cargobull"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-slate-200">Statut</label>
            <select
              value={isAvailable ? 'true' : 'false'}
              onChange={(e) => setIsAvailable(e.target.value === 'true')}
              className="w-full rounded-lg border border-white/10 bg-slate-950/50 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-gradient-start"
            >
              <option value="true">Disponible</option>
              <option value="false">En mission</option>
            </select>
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

const TrailersTable = ({ trailers = [], loading }) => {
  const rows = useMemo(() => trailers, [trailers]);

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
        Aucune remorque trouvée.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg p-4 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-slate-200">
          <Container className="h-4 w-4 text-cyan-400" />
          <span className="text-sm">Liste des remorques</span>
        </div>
      </div>
      <div className="overflow-auto">
        <table className="min-w-full text-left text-sm text-slate-100">
          <thead className="bg-white/10 text-slate-200">
            <tr>
              <th className="px-4 py-3 font-semibold">Immatriculation</th>
              <th className="px-4 py-3 font-semibold">Marque</th>
              <th className="px-4 py-3 font-semibold">Modèle</th>
              <th className="px-4 py-3 font-semibold">Statut</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((trailer) => (
              <tr key={trailer._id} className="hover:bg-white/5 transition-colors">
                <td className="px-4 py-3">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-white border border-white/10">
                    {trailer.immatriculation}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-200">{trailer.brand || '—'}</td>
                <td className="px-4 py-3 text-slate-200">{trailer.model || '—'}</td>
                <td className="px-4 py-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusBadge(trailer.isAvailable)}`}>
                    {trailer.isAvailable ? 'Disponible' : 'En mission'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const AdminTrailers = () => {
  const [trailers, setTrailers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const loadTrailers = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/trailers');
      setTrailers(data?.trailers || data || []);
    } catch (err) {
      const message = err.response?.data?.message || 'Impossible de charger les remorques';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTrailer = async (payload) => {
    try {
      await api.post('/trailers', payload);
      toast.success('Remorque créée avec succès');
      await loadTrailers();
    } catch (err) {
      const message = err.response?.data?.message || 'Erreur lors de la création de la remorque';
      if (err.response?.status === 400 || err.response?.status === 409) {
        // Erreur de validation ou duplicata
        toast.error(message);
      } else {
        toast.error(message);
      }
      throw err;
    }
  };

  useEffect(() => {
    loadTrailers();
  }, []);

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Gestion des Remorques</h1>
          <p className="text-sm text-slate-300">Ajoutez et suivez les remorques.</p>
        </div>
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-primary-gradient-start to-primary-gradient-end shadow-lg hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          Nouvelle Remorque
        </button>
      </div>

      <TrailersTable trailers={trailers} loading={loading} />

      <AddTrailerModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleAddTrailer}
      />
    </div>
  );
};

export default AdminTrailers;

