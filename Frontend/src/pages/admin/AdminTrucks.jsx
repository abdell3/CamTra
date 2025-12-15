import { useEffect, useMemo, useState } from 'react';
import { Plus, Truck, Pencil, Trash2 } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import api from '../../services/api';

const formatKm = (value = 0) =>
  `${Number(value || 0).toLocaleString('fr-FR')} km`;

const statusBadge = (isAvailable) =>
  isAvailable
    ? 'bg-emerald-500/20 text-emerald-200 border border-emerald-400/30'
    : 'bg-red-500/20 text-red-200 border border-red-400/30';

const AddTruckModal = ({ isOpen, onClose, onSubmit, editingTruck = null }) => {
  const [immatriculation, setImmatriculation] = useState('');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [currentKm, setCurrentKm] = useState(0);
  const [acquisitionDate, setAcquisitionDate] = useState('');
  const [loading, setLoading] = useState(false);

  const isEditMode = !!editingTruck;

  useEffect(() => {
    if (isOpen) {
      if (editingTruck) {
        setImmatriculation(editingTruck.immatriculation || '');
        setBrand(editingTruck.brand || '');
        setModel(editingTruck.model || '');
        setCurrentKm(editingTruck.currentKm || 0);
        setAcquisitionDate(editingTruck.acquisitionDate ? new Date(editingTruck.acquisitionDate).toISOString().split('T')[0] : '');
      } else {
        setImmatriculation('');
        setBrand('');
        setModel('');
        setCurrentKm(0);
        setAcquisitionDate('');
      }
      setLoading(false);
    }
  }, [isOpen, editingTruck]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const payload = {
        immatriculation,
        brand,
        model,
        currentKm: Number(currentKm || 0),
        acquisitionDate,
      };
      if (!isEditMode) {
        payload.isAvailable = true;
      }
      await onSubmit(payload, editingTruck?._id);
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
        <h2 className="text-xl font-semibold text-white mb-1">
          {isEditMode ? 'Modifier le Camion' : 'Nouveau Camion'}
        </h2>
        <p className="text-sm text-slate-300 mb-4">
          {isEditMode ? 'Modifier les informations du camion' : 'Ajoutez un véhicule à la flotte'}
        </p>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-sm text-slate-200">Immatriculation</label>
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
              <label className="text-sm text-slate-200">Marque</label>
              <input
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-slate-950/50 px-3 py-2 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-gradient-start"
                placeholder="Volvo"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-slate-200">Modèle</label>
              <input
                type="text"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-slate-950/50 px-3 py-2 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-gradient-start"
                placeholder="FH16"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-slate-200">Kilométrage actuel</label>
              <input
                type="number"
                min="0"
                value={currentKm}
                onChange={(e) => setCurrentKm(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-slate-950/50 px-3 py-2 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-gradient-start"
                placeholder="120000"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-slate-200">Date d'acquisition</label>
              <input
                type="date"
                value={acquisitionDate}
                onChange={(e) => setAcquisitionDate(e.target.value)}
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
              {loading ? (isEditMode ? 'Modification...' : 'Création...') : (isEditMode ? 'Modifier' : 'Créer')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const TrucksTable = ({ trucks = [], loading, onEdit, onDelete }) => {
  const rows = useMemo(() => trucks, [trucks]);

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
        Aucun camion trouvé.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg p-4 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-slate-200">
          <Truck className="h-4 w-4 text-cyan-400" />
          <span className="text-sm">Liste des camions</span>
        </div>
      </div>
      <div className="overflow-auto">
        <table className="min-w-full text-left text-sm text-slate-100">
          <thead className="bg-white/10 text-slate-200">
            <tr>
              <th className="px-4 py-3 font-semibold">Immatriculation</th>
              <th className="px-4 py-3 font-semibold">Marque / Modèle</th>
              <th className="px-4 py-3 font-semibold">Kilométrage</th>
              <th className="px-4 py-3 font-semibold">Statut</th>
              <th className="px-4 py-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((truck) => (
              <tr key={truck._id} className="hover:bg-white/5 transition-colors">
                <td className="px-4 py-3">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-white border border-white/10">
                    {truck.immatriculation}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-200">
                  {truck.brand} {truck.model}
                </td>
                <td className="px-4 py-3 text-slate-200">
                  {formatKm(truck.currentKm)}
                </td>
                <td className="px-4 py-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusBadge(truck.isAvailable)}`}>
                    {truck.isAvailable ? 'Disponible' : 'En mission'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onEdit(truck)}
                      className="p-2 rounded-lg bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 transition-colors"
                      title="Modifier"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(truck._id)}
                      className="p-2 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30 transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const AdminTrucks = () => {
  const [trucks, setTrucks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTruck, setEditingTruck] = useState(null);

  const loadTrucks = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/trucks');
      setTrucks(data?.trucks || data || []);
    } catch (err) {
      const message = err.response?.data?.message || 'Impossible de charger les camions';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitTruck = async (payload, truckId) => {
    try {
      if (truckId) {
        await api.put(`/trucks/${truckId}`, payload);
        toast.success('Camion modifié avec succès');
      } else {
        await api.post('/trucks', payload);
        toast.success('Camion créé avec succès');
      }
      await loadTrucks();
    } catch (err) {
      const message = err.response?.data?.message || `Erreur lors de la ${truckId ? 'modification' : 'création'} du camion`;
      toast.error(message);
      throw err;
    }
  };

  const handleEditTruck = (truck) => {
    setEditingTruck(truck);
    setModalOpen(true);
  };

  const handleDeleteTruck = async (truckId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce camion ?')) {
      return;
    }
    try {
      await api.delete(`/trucks/${truckId}`);
      toast.success('Camion supprimé avec succès');
      await loadTrucks();
    } catch (err) {
      const message = err.response?.data?.message || 'Erreur lors de la suppression du camion';
      toast.error(message);
    }
  };

  useEffect(() => {
    loadTrucks();
  }, []);

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Gestion des Camions</h1>
          <p className="text-sm text-slate-300">Ajoutez et suivez les véhicules.</p>
        </div>
        <button
          type="button"
          onClick={() => {
            setEditingTruck(null);
            setModalOpen(true);
          }}
          className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-primary-gradient-start to-primary-gradient-end shadow-lg hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          Nouveau Camion
        </button>
      </div>

      <TrucksTable trucks={trucks} loading={loading} onEdit={handleEditTruck} onDelete={handleDeleteTruck} />

      <AddTruckModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingTruck(null);
        }}
        onSubmit={handleSubmitTruck}
        editingTruck={editingTruck}
      />
    </div>
  );
};

export default AdminTrucks;

