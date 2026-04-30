import { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const RouteContext = createContext();

export function RouteProvider({ children }) {
  const [routePlaces, setRoutePlaces] = useState(() => {
    const saved = localStorage.getItem('citylore_route');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('citylore_route', JSON.stringify(routePlaces));
  }, [routePlaces]);

  const addToRoute = (place) => {
    if (routePlaces.find(p => p._id === place._id)) {
      toast.error('Bu mekan zaten rotanızda!');
      return;
    }
    if (routePlaces.length >= 10) {
      toast.error('Bir rotaya en fazla 10 mekan ekleyebilirsiniz.');
      return;
    }
    setRoutePlaces([...routePlaces, place]);
    toast.success('Rotaya eklendi! 📍');
  };

  const removeFromRoute = (placeId) => {
    setRoutePlaces(routePlaces.filter(p => p._id !== placeId));
    toast.success('Rotadan çıkarıldı.');
  };

  const clearRoute = () => {
    setRoutePlaces([]);
    toast.success('Rota temizlendi.');
  };

  return (
    <RouteContext.Provider value={{ routePlaces, addToRoute, removeFromRoute, clearRoute, setRoutePlaces }}>
      {children}
    </RouteContext.Provider>
  );
}

export const useRoute = () => useContext(RouteContext);
