import { useEffect, useMemo, useState } from 'react';
import { Activity, Truck, CheckCircle, Map } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import api from '../../services/api';

const StatCard = ({ icon: Icon, label, value, gradient }) => (
  <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-4 flex items-center justify-between shadow-xl">
    <div>
      <p className="text-sm text-slate-200">{label}</p>
      <p className="text-3xl font-semibold text-white mt-1">{value}</p>
    </div>
    <div className="h-12 w-12 rounded-xl bg-white/5 flex items-center justify-center">
      <Icon className={`h-6 w-6 ${gradient}`} />
    </div>
  </div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalTrips: 0,
    inProgress: 0,
    completed: 0,
    totalKm: 0,
  });
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  const skeletons = useMemo(() => Array.from({ length: 4 }), []);

  const computeFromTrips = (trips = []) => {
    const totalTrips = trips.length;
    const inProgress = trips.filter((t) => t.status === 'InProgress').length;
    const completed = trips.filter((t) => t.status === 'Completed').length;
    const totalKm = trips.reduce((acc, t) => acc + (t.totalDistance || t.distance || 0), 0);
    return { totalTrips, inProgress, completed, totalKm };
  };

  const fetchStats = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/stats/dashboard');
      
      
      if (data?.data) {
        const statsData = data.data;
        const totalDistance = statsData.totalDistance || 0;
        
        try {
          const { data: tripsData } = await api.get('/trips');
          const trips = tripsData?.trips || tripsData || [];
          const totalTrips = trips.length;
          const completed = trips.filter((t) => t.status === 'Completed').length;
          
          setStats({
            totalTrips,
            inProgress: statsData.trucksStatus?.inMission || 0,
            completed,
            totalKm: totalDistance, 
          });
        } catch (tripsErr) {
          setStats({
            totalTrips: 0,
            inProgress: statsData.trucksStatus?.inMission || 0,
            completed: 0,
            totalKm: totalDistance,
          });
        }
      } else {
        throw new Error('Fallback to trips');
      }
    } catch (err) {
      try {
        const { data: tripsData } = await api.get('/trips');
        const computed = computeFromTrips(tripsData?.trips || tripsData || []);
        setStats(computed);
        toast('Stats calculées depuis les trajets', { icon: 'ℹ️' });
      } catch (fallbackErr) {
        const message = fallbackErr.response?.data?.message || 'Impossible de charger les statistiques';
        toast.error(message);
      }
    } finally {
      setLastUpdated(new Date());
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="space-y-8">
      <Toaster position="top-right" />

      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Tableau de Bord</h1>
          <p className="text-sm text-slate-300">
            {lastUpdated ? `Dernière mise à jour : ${lastUpdated.toLocaleString('fr-FR')}` : 'Chargement...'}
          </p>
        </div>
        <button
          type="button"
          onClick={fetchStats}
          className="rounded-lg px-4 py-2 text-sm font-semibold text-white bg-white/10 border border-white/10 hover:bg-white/20 transition-colors"
          disabled={loading}
        >
          Actualiser
        </button>
      </header>

      <section>
        <h2 className="text-lg font-semibold text-white mb-3">Stats rapides</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {loading
            ? skeletons.map((_, idx) => (
                <div
                  key={idx}
                  className="h-28 rounded-2xl bg-white/5 border border-white/10 animate-pulse"
                />
              ))
            : (
              <>
                <StatCard
                  icon={Activity}
                  label="Total Trajets"
                  value={stats.totalTrips}
                  gradient="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400"
                />
                <StatCard
                  icon={Truck}
                  label="En cours"
                  value={stats.inProgress}
                  gradient="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400"
                />
                <StatCard
                  icon={CheckCircle}
                  label="Terminés"
                  value={stats.completed}
                  gradient="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400"
                />
                <StatCard
                  icon={Map}
                  label="Total Km parcourus"
                  value={`${stats.totalKm} km`}
                  gradient="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-400"
                />
              </>
            )}
        </div>
      </section>

      <section className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-4 shadow-xl">
        <h3 className="text-lg font-semibold text-white mb-2">Activité récente</h3>
        <p className="text-sm text-slate-300">
          {lastUpdated
            ? `Dernière mise à jour des données à ${lastUpdated.toLocaleTimeString('fr-FR')}.`
            : 'En attente de données...'}
        </p>
      </section>
    </div>
  );
};

export default AdminDashboard;

