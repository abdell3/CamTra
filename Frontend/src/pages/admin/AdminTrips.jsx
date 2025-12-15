import { useEffect, useMemo, useState } from 'react';
import { Plus, Map, User, Truck, CalendarClock, AlertCircle } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import api from '../../services/api';

const statusBadge = {
  Planned: 'bg-yellow-500/20 text-yellow-200 border border-yellow-400/30',
  InProgress: 'bg-blue-500/20 text-blue-200 border border-blue-400/30',
  Completed: 'bg-green-500/20 text-green-200 border border-green-400/30',
};

const formatDate = (value) =>
  value ? new Date(value).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' }) : '—';

const CreateTripModal = ({ isOpen, onClose, onSubmit }) => {
  const [departureSite, setDepartureSite] = useState('');
  const [arrivalSite, setArrivalSite] = useState('');
  const [plannedStartDate, setPlannedStartDate] = useState('');
  const [plannedEndDate, setPlannedEndDate] = useState('');
  const [driverId, setDriverId] = useState('');
  const [truckId, setTruckId] = useState('');
  const [drivers, setDrivers] = useState([]);
  const [trucks, setTrucks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [listsLoading, setListsLoading] = useState(false);

  useEffect(() => {
    const loadLists = async () => {
      try {
        setListsLoading(true);
        const [driversRes, trucksRes] = await Promise.all([
          api.get('/users/drivers'),
          api.get('/trucks'),
        ]);
        setDrivers(driversRes.data?.drivers || driversRes.data || []);
        const allTrucks = trucksRes.data?.trucks || trucksRes.data || [];
        const available = allTrucks.filter((t) => t.isAvailable !== false);
        setTrucks(available);
      } catch (err) {
        const message = err.response?.data?.message || 'Impossible de charger les données';
        toast.error(message);
      } finally {
        setListsLoading(false);
      }
    };

    if (isOpen) {
      setDepartureSite('');
      setArrivalSite('');
      setPlannedStartDate('');
      setPlannedEndDate('');
      setDriverId('');
      setTruckId('');
      loadLists();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    try {
      setLoading(true);
      await onSubmit({
        assignedDriverId: driverId,
        assignedTruckId: truckId,
        departureSite,
        arrivalSite,
        plannedStartDate,
        plannedEndDate,
      });
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
        <h2 className="text-xl font-semibold text-white mb-1">Nouveau Trajet</h2>
        <p className="text-sm text-slate-300 mb-4">Créer une mission et assigner un chauffeur</p>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-slate-200">Départ</label>
              <input
                type="text"
                required
                value={departureSite}
                onChange={(e) => setDepartureSite(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-slate-950/50 px-3 py-2 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-gradient-start"
                placeholder="Entrepôt A"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-slate-200">Arrivée</label>
              <input
                type="text"
                required
                value={arrivalSite}
                onChange={(e) => setArrivalSite(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-slate-950/50 px-3 py-2 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-gradient-start"
                placeholder="Client B"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-slate-200">Début (planifié)</label>
              <input
                type="datetime-local"
                required
                value={plannedStartDate}
                onChange={(e) => setPlannedStartDate(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-slate-950/50 px-3 py-2 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-gradient-start"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-slate-200">Fin (planifiée)</label>
              <input
                type="datetime-local"
                required
                value={plannedEndDate}
                onChange={(e) => setPlannedEndDate(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-slate-950/50 px-3 py-2 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-gradient-start"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-slate-200 flex items-center gap-2">
                <User className="h-4 w-4 text-cyan-400" /> Chauffeur
              </label>
              <select
                required
                value={driverId}
                onChange={(e) => setDriverId(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-slate-950/50 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-gradient-start"
              >
                <option value="">Sélectionner un chauffeur</option>
                {drivers.map((d) => (
                  <option key={d._id} value={d._id}>
                    {d.firstName} {d.lastName}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm text-slate-200 flex items-center gap-2">
                <Truck className="h-4 w-4 text-cyan-400" /> Camion
              </label>
              <select
                required
                value={truckId}
                onChange={(e) => setTruckId(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-slate-950/50 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-gradient-start"
              >
                <option value="">Sélectionner un camion</option>
                {trucks.map((t) => (
                  <option key={t._id} value={t._id}>
                    {t.immatriculation} • {t.brand}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {listsLoading && (
            <div className="flex items-center gap-2 text-sm text-slate-300">
              <AlertCircle className="h-4 w-4 text-cyan-400" />
              Chargement des données...
            </div>
          )}

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
              {loading ? 'Création...' : 'Créer le trajet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const TripsTable = ({ trips = [], loading }) => {
  const rows = useMemo(() => trips, [trips]);

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
        Aucun trajet trouvé.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg p-4 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-slate-200">
          <Map className="h-4 w-4 text-cyan-400" />
          <span className="text-sm">Liste des trajets</span>
        </div>
      </div>
      <div className="overflow-auto">
        <table className="min-w-full text-left text-sm text-slate-100">
          <thead className="bg-white/10 text-slate-200">
            <tr>
              <th className="px-4 py-3 font-semibold">Départ</th>
              <th className="px-4 py-3 font-semibold">Trajet</th>
              <th className="px-4 py-3 font-semibold">Chauffeur</th>
              <th className="px-4 py-3 font-semibold">Camion</th>
              <th className="px-4 py-3 font-semibold">Statut</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((trip) => (
              <tr key={trip._id} className="hover:bg-white/5 transition-colors">
                <td className="px-4 py-3 text-slate-200">{formatDate(trip.plannedStartDate)}</td>
                <td className="px-4 py-3 text-white font-semibold">
                  {trip.departureSite} → {trip.arrivalSite}
                  <div className="text-xs text-slate-300">
                    Fin : {formatDate(trip.plannedEndDate)}
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-200">
                  {trip.assignedDriverId
                    ? `${trip.assignedDriverId.firstName || ''} ${trip.assignedDriverId.lastName || ''}`
                    : '—'}
                </td>
                <td className="px-4 py-3 text-slate-200">
                  {trip.assignedTruckId
                    ? `${trip.assignedTruckId.immatriculation || ''} • ${trip.assignedTruckId.brand || ''}`
                    : '—'}
                </td>
                <td className="px-4 py-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusBadge[trip.status] || 'bg-white/10 text-white border border-white/10'}`}>
                    {trip.status}
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

const AdminTrips = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const loadTrips = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/trips');
      setTrips(data?.trips || data || []);
    } catch (err) {
      const message = err.response?.data?.message || 'Impossible de charger les trajets';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTrip = async (payload) => {
    try {
      await api.post('/trips', payload);
      toast.success('Trajet créé avec succès');
      await loadTrips();
    } catch (err) {
      const message = err.response?.data?.message || 'Erreur lors de la création du trajet';
      toast.error(message);
      throw err;
    }
  };

  useEffect(() => {
    loadTrips();
  }, []);

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Gestion des Trajets</h1>
          <p className="text-sm text-slate-300">Créez et assignez des missions.</p>
        </div>
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-primary-gradient-start to-primary-gradient-end shadow-lg hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          Nouveau Trajet
        </button>
      </div>

      <TripsTable trips={trips} loading={loading} />

      <CreateTripModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleCreateTrip}
      />
    </div>
  );
};

export default AdminTrips;

