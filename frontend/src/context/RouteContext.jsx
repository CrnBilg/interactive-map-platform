import { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useLanguage } from '../i18n/LanguageContext';

const RouteContext = createContext();

export function RouteProvider({ children }) {
  const { t } = useLanguage();
  const [routePlaces, setRoutePlaces] = useState(() => {
    const saved = localStorage.getItem('citylore_route');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('citylore_route', JSON.stringify(routePlaces));
  }, [routePlaces]);

  const addToRoute = (place) => {
    if (routePlaces.find(p => p._id === place._id)) {
      toast.error(t('toast.alreadyRoute'));
      return;
    }
    if (routePlaces.length >= 10) {
      toast.error(t('toast.routeLimit'));
      return;
    }
    setRoutePlaces([...routePlaces, place]);
    toast.success(t('toast.routeAdded'));
  };

  const removeFromRoute = (placeId) => {
    setRoutePlaces(routePlaces.filter(p => p._id !== placeId));
    toast.success(t('toast.routeRemoved'));
  };

  const clearRoute = () => {
    setRoutePlaces([]);
    toast.success(t('toast.routeCleared'));
  };

  return (
    <RouteContext.Provider value={{ routePlaces, addToRoute, removeFromRoute, clearRoute, setRoutePlaces }}>
      {children}
    </RouteContext.Provider>
  );
}

export const useRoute = () => useContext(RouteContext);
