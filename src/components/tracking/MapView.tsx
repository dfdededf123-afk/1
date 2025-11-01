import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN ?? "";

interface MapViewProps {
  coordinates: [number, number][];
}

export const MapView = ({ coordinates }: MapViewProps) => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current || mapInstance.current) return;

    mapInstance.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: coordinates[0] ?? [12.4964, 41.9028],
      zoom: 5,
    });

    return () => {
      mapInstance.current?.remove();
      mapInstance.current = null;
    };
  }, [coordinates]);

  useEffect(() => {
    const map = mapInstance.current;
    if (!map || coordinates.length === 0) return;

    const sourceId = "vehicle-route";
    const updateSource = () => {
      const data = {
        type: "Feature" as const,
        geometry: {
          type: "LineString" as const,
          coordinates,
        },
        properties: {},
      };

      if (!map.getSource(sourceId)) {
        map.addSource(sourceId, {
          type: "geojson",
          data,
        });
        map.addLayer({
          id: "vehicle-route",
          type: "line",
          source: sourceId,
          paint: {
            "line-color": "#2563eb",
            "line-width": 4,
          },
        });
      } else {
        const source = map.getSource(sourceId) as mapboxgl.GeoJSONSource;
        source.setData(data);
      }
    };

    if (!map.isStyleLoaded()) {
      map.once("load", updateSource);
    } else {
      updateSource();
    }
  }, [coordinates]);

  return <div ref={mapContainer} className="h-full w-full rounded-xl border" />;
};
