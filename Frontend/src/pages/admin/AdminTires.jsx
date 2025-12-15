import { useEffect, useState } from 'react';
import { Plus, Package, Truck, AlertCircle } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import api from '../../services/api';

const statusBadge = {
  Neuf: 'bg-green-500/20 text-green-200 border border-green-400/30',
  Bon: 'bg-emerald-500/20 text-emerald-200 border border-emerald-400/30',
  Use: 'bg-yellow-500/20 text-yellow-200 border border-yellow-400/30',
  Critique: 'bg-red-500/20 text-red-200 border border-red-400/30',
  Reforme: 'bg-slate-500/20 text-slate-200 border border-slate-400/30',
};

const AddTireModal = ({ isOpen, onClose, onSubmit }) => {
  const [serialNumber, setSerialNumber] = useState('');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [status, setStatus] = useState('Neuf');
  const [purchaseDate, setPurchaseDate] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSerialNumber('');
      setBrand('');
      setModel('');
      setStatus('Neuf');
      setPurchaseDate('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    try {
      setLoading(true);
      const payload = {
        serialNumber,
        brand,
        model,
        status,
        purchaseDate: purchaseDate || new Date().toISOString().split('T')[0],
      };
      await onSubmit(payload);
      onClose();
    } catch (err) {
      // onSubmit gère le toast
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xl px-4">
      <div className="w-full max-w-2xl bg-slate-900/80 border border-white/10 rounded-2xl shadow-2xl p-6 text-slate-100 relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-300 hover:text-white"
        >
          ×
        </button>
        <h2 className="text-xl font-semibold text-white mb-1">Nouveau Pneu</h2>
        <p className="text-sm text-slate-300 mb-4">Ajouter un pneu au stock</p>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-sm text-slate-200">N° de série *</label>
            <input
              type="text"
              required
              value={serialNumber}
              onChange={(e) => setSerialNumber(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-slate-950/50 px-3 py-2 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-gradient-start"
              placeholder="Ex: TIRE-2024-001"
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
                placeholder="Ex: Michelin"
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
                placeholder="Ex: X Line Energy"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-slate-200">Statut *</label>
              <select
                required
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-slate-950/50 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-gradient-start"
              >
                <option value="Neuf">Neuf</option>
                <option value="Bon">Bon</option>
                <option value="Use">Use</option>
                <option value="Critique">Critique</option>
                <option value="Reforme">Reforme</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm text-slate-200">Date d'achat *</label>
              <input
                type="date"
                required
                value={purchaseDate}
                onChange={(e) => setPurchaseDate(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-slate-950/50 px-3 py-2 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-gradient-start"
              />
            </div>
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
              {loading ? 'Création...' : 'Ajouter le pneu'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const AdminTires = () => {
  const [tires, setTires] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const loadTires = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/tires');
      setTires(data?.tires || data || []);
    } catch (err) {
      const message = err.response?.data?.message || 'Impossible de charger les pneus';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTire = async (payload) => {
    try {
      await api.post('/tires', payload);
      toast.success('Pneu ajouté avec succès');
      await loadTires();
    } catch (err) {
      const message = err.response?.data?.message || 'Erreur lors de l\'ajout du pneu';
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
    loadTires();
  }, []);

  const getMountedOnText = (tire) => {
    if (!tire.mountedOnEntity || !tire.mountedOnModel) {
      return 'En stock';
    }
    return tire.mountedOnModel === 'Truck' ? 'Camion' : 'Remorque';
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Gestion des Pneus</h1>
            <p className="text-sm text-slate-300">Stock et suivi des pneus</p>
          </div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg p-4 shadow-xl">
          <div className="h-10 w-32 bg-white/10 rounded animate-pulse mb-3" />
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-12 bg-white/5 rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Gestion des Pneus</h1>
          <p className="text-sm text-slate-300">Stock et suivi des pneus</p>
        </div>
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-primary-gradient-start to-primary-gradient-end shadow-lg hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          Ajouter un Pneu
        </button>
      </div>

      {!tires || tires.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg p-6 text-center text-slate-200 shadow-xl">
          <Package className="h-12 w-12 mx-auto mb-3 text-slate-400" />
          <p>Aucun pneu enregistré.</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg p-4 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-slate-200">
              <Package className="h-4 w-4 text-cyan-400" />
              <span className="text-sm">Liste des pneus</span>
            </div>
          </div>
          <div className="overflow-auto">
            <table className="min-w-full text-left text-sm text-slate-100">
              <thead className="bg-white/10 text-slate-200">
                <tr>
                  <th className="px-4 py-3 font-semibold">N° Série</th>
                  <th className="px-4 py-3 font-semibold">Marque / Modèle</th>
                  <th className="px-4 py-3 font-semibold">Statut</th>
                  <th className="px-4 py-3 font-semibold">Monté sur</th>
                  <th className="px-4 py-3 font-semibold">Km parcourus</th>
                </tr>
              </thead>
              <tbody>
                {tires.map((tire) => (
                  <tr key={tire._id} className="hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3 text-slate-200 font-mono text-xs">
                      {tire.serialNumber || '—'}
                    </td>
                    <td className="px-4 py-3 text-white">
                      <div className="font-semibold">{tire.brand || '—'}</div>
                      <div className="text-xs text-slate-300">{tire.model || '—'}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          statusBadge[tire.status] || 'bg-white/10 text-white border border-white/10'
                        }`}
                      >
                        {tire.status || '—'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-200">
                      <div className="flex items-center gap-2">
                        {tire.mountedOnEntity ? (
                          <Truck className="h-4 w-4 text-cyan-400" />
                        ) : (
                          <Package className="h-4 w-4 text-slate-400" />
                        )}
                        <span>{getMountedOnText(tire)}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-200">
                      {tire.totalKmDriven ? tire.totalKmDriven.toLocaleString('fr-FR') : '0'} km
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <AddTireModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleCreateTire}
      />
    </div>
  );
};

export default AdminTires;

