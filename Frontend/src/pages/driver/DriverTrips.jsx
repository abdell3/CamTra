import { useEffect, useState } from 'react';
import { Play, Truck, MapPin, Clock3, AlertCircle, CheckCircle } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import api from '../../services/api';
import ReportModal from '../../components/ui/ReportModal';

const statusStyles = {
  Planned: 'bg-yellow-500/20 text-yellow-300',
  InProgress: 'bg-blue-500/20 text-blue-200',
  Completed: 'bg-green-500/20 text-green-200',
};

const statusLabel = {
  Planned: 'Planifiée',
  InProgress: 'En cours',
  Completed: 'Terminée',
};

const formatDate = (value) =>
  value ? new Date(value).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' }) : '—';

const DriverTrips = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionId, setActionId] = useState(null);
  const [reportTrip, setReportTrip] = useState(null);

  const loadTrips = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await api.get('/trips/my-trips');
      setTrips(data.trips || []);
    } catch (err) {
      const message = err.response?.data?.message || 'Impossible de charger les missions';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrips();
  }, []);

  const handleStart = async (tripId) => {
    try {
      setActionId(tripId);
      await api.patch(`/trips/${tripId}/start`);
      setTrips((prev) =>
        prev.map((trip) =>
          trip._id === tripId ? { ...trip, status: 'InProgress' } : trip
        )
      );
    } catch (err) {
      const message = err.response?.data?.message || 'Impossible de démarrer la mission';
      setError(message);
    } finally {
      setActionId(null);
    }
  };

  const handleReportSubmit = async (formData) => {
    try {
      await api.post('/trip-reports', formData);
      toast.success('Mission clôturée avec succès');
      setReportTrip(null);
      await loadTrips();
    } catch (err) {
      const message = err.response?.data?.message || 'Impossible de clôturer la mission';
      toast.error(message);
    }
  };

  if (loading) {
    return (
      <div className="p-4 text-slate-100">
        Chargement des missions...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Mes Missions</h1>
          <p className="text-sm text-slate-200">Les missions qui vous sont assignées.</p>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-md border border-danger/30 bg-red-500/10 px-3 py-2 text-danger text-sm">
          <AlertCircle className="h-4 w-4 text-danger" />
          {error}
        </div>
      )}

      {trips.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/20 bg-white/5 backdrop-blur-lg p-6 text-center text-slate-200 shadow-xl">
          Aucune mission assignée.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {trips.map((trip) => {
            const planned = formatDate(trip.plannedStartDate);
            const plannedEnd = formatDate(trip.plannedEndDate);
            const statusClass = statusStyles[trip.status] || 'bg-white/10 text-white';
            const truckInfo = trip.assignedTruckId
              ? `${trip.assignedTruckId.brand || ''} ${trip.assignedTruckId.immatriculation || ''}`.trim()
              : 'Camion non assigné';

            return (
              <div
                key={trip._id}
                className="bg-white/5 backdrop-blur-lg border border-white/10 shadow-xl rounded-2xl p-5 flex flex-col gap-4"
              >
                <div className="flex items-center justify-between text-sm text-slate-200">
                  <div className="flex items-center gap-2">
                    <Clock3 className="h-4 w-4 text-white" />
                    <span>{planned}</span>
                  </div>
                  <span className={`text-xs font-semibold uppercase px-3 py-1 rounded-full ${statusClass}`}>
                    {statusLabel[trip.status] || trip.status}
                  </span>
                </div>

                <div>
                  <div className="text-lg font-semibold text-white">
                    {trip.departureSite} → {trip.arrivalSite}
                  </div>
                  <div className="text-sm text-slate-200">
                    Fin prévue : {plannedEnd}
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-slate-200">
                  <div className="flex items-center gap-2">
                    <Truck className="h-4 w-4 text-white" />
                    <span>{truckInfo}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-200">
                    <MapPin className="h-4 w-4 text-white" />
                    <span>ID: {trip._id.slice(-6)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {trip.status === 'Planned' && (
                    <button
                      type="button"
                      onClick={() => handleStart(trip._id)}
                      disabled={actionId === trip._id}
                      className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-violet-600 to-cyan-600 px-3 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      <Play className="h-4 w-4" />
                      {actionId === trip._id ? 'Démarrage...' : 'Démarrer'}
                    </button>
                  )}

                  {trip.status === 'InProgress' && (
                    <button
                      type="button"
                      onClick={() => setReportTrip(trip)}
                      className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/20 border border-white/10"
                    >
                      <CheckCircle className="h-4 w-4" />
                      Terminer / Rapport
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <ReportModal
        trip={reportTrip}
        isOpen={!!reportTrip}
        onClose={() => setReportTrip(null)}
        onSubmit={handleReportSubmit}
      />
    </div>
  );
};

export default DriverTrips;


