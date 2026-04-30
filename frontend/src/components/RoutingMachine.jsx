import { useEffect } from "react";
import L from "leaflet";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import { useMap } from "react-leaflet";

const RoutingMachine = ({ waypoints, onRouteFound }) => {
  const map = useMap();

  useEffect(() => {
    if (!map || waypoints.length < 2) return;

    const routingControl = L.Routing.control({
      waypoints: waypoints.map(wp => L.latLng(wp[0], wp[1])),
      lineOptions: {
        styles: [
          { color: "#000", weight: 6, opacity: 0.4 },
          { color: "#f59e0b", weight: 4, opacity: 0.8 }
        ],
        extendToWaypoints: true,
        missingRouteTolerance: 0
      },
      show: false,
      addWaypoints: false,
      routeWhileDragging: false,
      draggableWaypoints: false,
      fitSelectedRoutes: true,
      showAlternatives: false,
      itineraryClassName: 'hidden',
      createMarker: () => null, // Don't show extra markers
    }).addTo(map);

    routingControl.on('routesfound', function(e) {
      const routes = e.routes;
      const summary = routes[0].summary;
      if (onRouteFound) {
        onRouteFound({
          distance: summary.totalDistance, // in meters
          time: summary.totalTime // in seconds
        });
      }
    });

    return () => map.removeControl(routingControl);
  }, [map, waypoints, onRouteFound]);

  return null;
};

export default RoutingMachine;
