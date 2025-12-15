import { useState } from 'react';
import { Truck, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { login, loading, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);

    try {
      await login(email, password);
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        error ||
        'Identifiants invalides, vérifiez vos accès.';
      setLocalError(message);
    }
  };

  const errorMessage = localError || error;

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-white/10 text-white">
            <Truck className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold text-white">CamTra</h1>
          <p className="text-sm text-slate-300">Connectez-vous pour continuer</p>
        </div>

        {errorMessage ? (
          <div className="rounded-md border border-danger/30 bg-red-50 px-3 py-2 text-sm text-danger">
            {errorMessage}
          </div>
        ) : null}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-white">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-lg border border-white/10 bg-slate-950/50 px-4 py-2 text-white placeholder:text-slate-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-gradient-start"
              placeholder="vous@exemple.com"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-white">Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-lg border border-white/10 bg-slate-950/50 px-4 py-2 text-white placeholder:text-slate-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-gradient-start"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-primary-gradient-start to-primary-gradient-end px-4 py-2 font-semibold text-white transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary-gradient-start focus:ring-offset-2 focus:ring-offset-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Connexion...
              </>
            ) : (
              'Se connecter'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;

